-- -----------------------------------------------
-- 0. 알림 생성 저장 프로시저: notify_user_change
-- -----------------------------------------------
-- id 컬럼이 Prisma 스키마에서 @default(uuid())라면,
-- DB 내부에서 직접 INSERT 시에는 자동으로 채워지지 않음.
-- DB 내부에서 UPDATE할 경우, Prisma가 관여하지 않으므로 updatedAt이 자동 갱신되지 않음.
CREATE OR REPLACE PROCEDURE notify_user_change(
  user_id TEXT, -- 알림을 받을 사용자 ID  
  type TEXT,
  message TEXT
)
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO "Notification" (
    "userId", 
    "type", 
    "message",
    "createdAt",
    "updatedAt"
  ) VALUES (
    user_id, 
    type::"NotificationType",   -- 문자열을 enum으로 변환
    message,
    now() AT TIME ZONE 'UTC', -- UTC 기준으로 변환하여 저장장
    now() AT TIME ZONE 'UTC' -- DB 내부에서 updatedAt은 수동으로 셋팅해줘야 함
  );
END;
$$;

-- -----------------------------------------------
-- 1. 레슨 상태 변경 알림
-- -----------------------------------------------

-- 1-1. 레슨 상태 변경 저장 프로시저 생성
CREATE OR REPLACE PROCEDURE notify_lesson_status_change(
  lesson_id TEXT
)
LANGUAGE plpgsql AS $$
DECLARE
  user_id TEXT;
  lesson_type TEXT;
  lesson_sub_type TEXT;
  lesson_status TEXT;
  trainer_id TEXT;
  notification_message TEXT;
  lesson_type_kr TEXT;
  lesson_sub_type_kr TEXT;
  user_nick TEXT;
BEGIN
  SELECT lr."userId", lr."lessonType"::TEXT, lr."lessonSubType"::TEXT, lr."status" , u."nickname"
  INTO user_id, lesson_type, lesson_sub_type, lesson_status, user_nick
  FROM "LessonRequest" lr
  JOIN "User" u On lr."userId" = u.id
  WHERE lr.id = lesson_id;

  IF user_id IS NULL THEN
    RETURN; -- 사용자가 없으면 종료
  END IF;

    -- lesson_type을 한글로 변환
  lesson_type_kr := 
    CASE lesson_type
      WHEN 'FITNESS' THEN '피트니스'
      WHEN 'SPORTS' THEN '스포츠'
      WHEN 'REHAB' THEN '재활'
      ELSE '알 수 없는 레슨'
    END;

  -- lesson_sub_type을 한글로 변환
  lesson_sub_type_kr := 
    CASE lesson_sub_type
      -- SPORTS
      WHEN 'SOCCER' THEN '축구'
      WHEN 'BASKETBALL' THEN '농구'
      WHEN 'BASEBALL' THEN '야구'
      WHEN 'TENNIS' THEN '테니스'
      WHEN 'BADMINTON' THEN '배드민턴'
      WHEN 'TABLE_TENNIS' THEN '탁구'
      WHEN 'SKI' THEN '스키'
      WHEN 'SURFING' THEN '서핑'
      WHEN 'BOXING' THEN '복싱'
      WHEN 'TAEKWONDO' THEN '태권도'
      WHEN 'JIUJITSU' THEN '주짓수'

      -- FITNESS
      WHEN 'PERSONAL_TRAINING' THEN '퍼스널 트레이닝'
      WHEN 'YOGA' THEN '요가'
      WHEN 'PILATES' THEN '필라테스'
      WHEN 'DIET_MANAGEMENT' THEN '다이어트 관리'

      -- REHAB
      WHEN 'STRETCHING' THEN '스트레칭'
      WHEN 'REHAB_TREATMENT' THEN '재활 치료'

      ELSE NULL
    END;

  -- lesson_sub_type이 NULL이면 lesson_type을 사용
  IF lesson_sub_type_kr IS NULL THEN
    lesson_sub_type_kr := lesson_type_kr;
  END IF;

  -- 상태에 따른 알림 메시지 생성
  CASE lesson_status
    WHEN 'QUOTE_CONFIRMED' THEN
      notification_message := user_nick || '님의 레슨(' || lesson_sub_type_kr || ')에 대한 견적이 확정되었습니다.';

    WHEN 'COMPLETED' THEN
      notification_message := user_nick || '님의 레슨(' || lesson_sub_type_kr || ')이 완료되었습니다.';

    WHEN 'CANCELED' THEN
      notification_message := user_nick || '님의 레슨(' || lesson_sub_type || ') 요청이 취소되었습니다.';

    WHEN 'EXPIRED' THEN
      notification_message := user_nick || '님의 레슨(' || lesson_sub_type_kr || ') 요청이 만료되었습니다.';
    ELSE
      RETURN; -- 알림을 보낼 필요가 없는 상태이면 종료
  END CASE;

  -- 레슨 요청자에게 알림 생성
  CALL notify_user_change(
    user_id,
    'LESSON_QUOTE',
    notification_message
  );

  -- 트레이너 알림 생성 추가
  IF lesson_status IN ('QUOTE_CONFIRMED', 'COMPLETED') THEN
    SELECT "trainerId"
    INTO trainer_id
    FROM "LessonQuote"
    WHERE "lessonRequestId" = lesson_id AND "status" = 'ACCEPTED' 
    LIMIT 1; -- 혹시나 있을 오류 방지를 위해

    IF trainer_id IS NOT NULL THEN
      CALL notify_user_change(
        trainer_id,
        'LESSON_QUOTE',
        notification_message
      );
    END IF;
  END IF;  
END;
$$;

-- 1-2. 레슨 상태 변경 트리거 함수
CREATE OR REPLACE FUNCTION lesson_status_change_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    CALL notify_lesson_status_change(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1-3. 레슨 상태 변경 트리거 생성
DROP TRIGGER IF EXISTS lesson_status_change_trigger ON "LessonRequest";

CREATE TRIGGER lesson_status_change_trigger
AFTER UPDATE OF status ON "LessonRequest"
FOR EACH ROW
EXECUTE FUNCTION lesson_status_change_trigger();


-- -----------------------------------------------
-- 2. 새로운 견적 도착 알림
-- -----------------------------------------------

-- 2-1. 새로운 견적 도착 저장 프로시저 생성
CREATE OR REPLACE PROCEDURE notify_quote_create(
  quote_id TEXT
)
LANGUAGE plpgsql AS $$
DECLARE
  user_id TEXT;
  lesson_type TEXT;
  lesson_sub_type TEXT;
  trainer_nick TEXT;
  notification_message TEXT;
  lesson_type_kr TEXT;
  lesson_sub_type_kr TEXT;
BEGIN
  SELECT lr."userId", lr."lessonType"::TEXT, lr."lessonSubType"::TEXT, u."nickname"
  INTO user_id, lesson_type, lesson_sub_type, trainer_nick
  FROM "LessonQuote" lq
  JOIN "LessonRequest" lr ON lq."lessonRequestId" = lr.id
  JOIN "User" u ON lq."trainerId" = u.id
  WHERE lq.id = quote_id;

  IF user_id IS NULL THEN
    RETURN; -- 사용자가 없으면 종료
  END IF;

  -- lesson_type을 한글로 변환
  lesson_type_kr := 
    CASE lesson_type
      WHEN 'FITNESS' THEN '피트니스'
      WHEN 'SPORTS' THEN '스포츠'
      WHEN 'REHAB' THEN '재활'
      ELSE '알 수 없는 레슨'
    END;

  -- lesson_sub_type을 한글로 변환
  lesson_sub_type_kr := 
    CASE lesson_sub_type
      -- SPORTS
      WHEN 'SOCCER' THEN '축구'
      WHEN 'BASKETBALL' THEN '농구'
      WHEN 'BASEBALL' THEN '야구'
      WHEN 'TENNIS' THEN '테니스'
      WHEN 'BADMINTON' THEN '배드민턴'
      WHEN 'TABLE_TENNIS' THEN '탁구'
      WHEN 'SKI' THEN '스키'
      WHEN 'SURFING' THEN '서핑'
      WHEN 'BOXING' THEN '복싱'
      WHEN 'TAEKWONDO' THEN '태권도'
      WHEN 'JIUJITSU' THEN '주짓수'

      -- FITNESS
      WHEN 'PERSONAL_TRAINING' THEN '퍼스널 트레이닝'
      WHEN 'YOGA' THEN '요가'
      WHEN 'PILATES' THEN '필라테스'
      WHEN 'DIET_MANAGEMENT' THEN '다이어트 관리'

      -- REHAB
      WHEN 'STRETCHING' THEN '스트레칭'
      WHEN 'REHAB_TREATMENT' THEN '재활 치료'

      ELSE NULL
    END;

  -- lesson_sub_type이 NULL이면 lesson_type을 사용
  IF lesson_sub_type_kr IS NULL THEN
    lesson_sub_type_kr := lesson_type_kr;
  END IF;

  -- 알림 메시지 생성
  notification_message := trainer_nick || '님으로부터 요청하신 레슨(' || lesson_sub_type_kr || ') 에 대한 새로운 견적이 도착했습니다.';

  -- 레슨 요청자에게 알림 생성
  CALL notify_user_change(
    user_id,
    'LESSON_QUOTE',
    notification_message
  );
END;
$$;

-- 2-2. 새로운 견적 도착 트리거 함수
CREATE OR REPLACE FUNCTION quote_create_trigger()
RETURNS TRIGGER AS $$
BEGIN
  CALL notify_quote_create(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2-3. 새로운 견적 도착 트리거 생성
DROP TRIGGER IF EXISTS quote_create_trigger ON "LessonQuote";

CREATE TRIGGER quote_create_trigger
AFTER INSERT ON "LessonQuote"
FOR EACH ROW
EXECUTE FUNCTION quote_create_trigger();

-- -----------------------------------------------
-- 3. 지정 견적 요청 알림
-- -----------------------------------------------

-- 3-1. 지정 견적 요청 저장 프로시저 생성
CREATE OR REPLACE PROCEDURE notify_direct_quote_request(
  direct_quote_id TEXT
)
LANGUAGE plpgsql AS $$
DECLARE
  trainer_id TEXT;
  user_id TEXT;
  lesson_type TEXT;
  user_nick TEXT;
  notification_message TEXT;
  lesson_type_kr TEXT;
BEGIN
  SELECT dqr."trainerId", lr."userId", lr."lessonType"::TEXT, u."nickname"
  INTO trainer_id, user_id, lesson_type, user_nick
  FROM "DirectQuoteRequest" dqr
  JOIN "LessonRequest" lr ON dqr."lessonRequestId" = lr.id
  JOIN "User" u ON lr."userId" = u.id
  WHERE dqr.id = direct_quote_id;

   -- 트레이너가 없으면 종료
  IF trainer_id IS NULL OR user_id IS NULL THEN
    RETURN;
  END IF;

    -- lesson_type을 한글로 변환
  lesson_type_kr := 
    CASE lesson_type
      WHEN 'FITNESS' THEN '피트니스'
      WHEN 'SPORTS' THEN '스포츠'
      WHEN 'REHAB' THEN '재활'
      ELSE '알 수 없는 레슨'
    END;

  -- 알림 메시지 생성
  notification_message := user_nick || '님으로부터 레슨(' || lesson_type_kr || ')에 대한 지정 견적 요청이 도착했습니다.';

  -- 트레이너에게 알림 생성
  CALL notify_user_change(
    trainer_id,
    'LESSON_QUOTE',
    notification_message
  );
END;
$$;

-- 3-2. 지정 견적 요청 트리거 함수
CREATE OR REPLACE FUNCTION direct_quote_request_trigger()
RETURNS TRIGGER AS $$
BEGIN
  CALL notify_direct_quote_request(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3-3. 지정 견적 요청 트리거 생성
DROP TRIGGER IF EXISTS  direct_quote_request_trigger ON "DirectQuoteRequest";

CREATE TRIGGER direct_quote_request_trigger
AFTER INSERT ON "DirectQuoteRequest"
FOR EACH ROW
EXECUTE FUNCTION direct_quote_request_trigger();

-- -----------------------------------------------
-- 4. 트레이너 분야와 매칭되는 레슨 등록 알림
-- -----------------------------------------------

-- 4-1. 분야와 매칭되는 레슨 등록 저장 프로시저 생성
CREATE OR REPLACE PROCEDURE notify_lesson_create_matching_trainer(
  lesson_id TEXT
)
LANGUAGE plpgsql AS $$

DECLARE
  trainer_id TEXT;
  lesson_type "LessonType";
  location_type "LocationType";
  start_date DATE;
  end_date DATE;
  requester_nick TEXT;
  notification_message TEXT;
  lesson_type_kr TEXT;
  location_type_kr TEXT;
  road_address TEXT;

BEGIN
  -- 새로운 레슨 요청의 정보 가져오기
  SELECT lr."lessonType", lr."locationType", lr."startDate", lr."endDate", lr."roadAddress", u."nickname"
  INTO lesson_type, location_type, start_date, end_date, road_address, requester_nick
  FROM "LessonRequest" lr
  JOIN "User" u ON lr."userId" = u."id"
  WHERE lr.id = lesson_id;

  -- ENUM 값을 한글로 변환하는 CASE 문 추가
  CASE lesson_type
    WHEN 'SPORTS' THEN lesson_type_kr := '스포츠';
    WHEN 'FITNESS' THEN lesson_type_kr := '피트니스';
    WHEN 'REHAB' THEN lesson_type_kr := '재활';
    ELSE lesson_type_kr := '기타';
  END CASE;

  -- location_type에 따라 한글로 변환(OFFLINE 일 경우 해당 지역 표시)
  IF location_type = 'ONLINE' THEN
    location_type_kr := '온라인';
  ELSIF location_type = 'OFFLINE' THEN
    -- road_address에서 첫 번째 공백 이전의 단어 추출
    IF road_address IS NOT NULL AND road_address <> '' THEN
      location_type_kr := split_part(road_address, ' ', 1);
    ELSE
      location_type_kr := '오프라인';
    END IF;
  ELSE
    location_type_kr := '기타타';
  END IF;

  -- 매칭되는 트레이너 찾기
  FOR trainer_id IN
    SELECT u.id
    FROM "User" u
    JOIN "Profile" p ON u.id = p."userId"
    WHERE u."role" = 'TRAINER' 
      AND ARRAY[lesson_type] && p."lessonType"  -- ENUM 배열 비교

  LOOP
    -- 알림 메시지 생성
    notification_message := requester_nick || '님이 [' || location_type_kr || ']에서 ' || start_date || ' ~ ' || end_date || ' 동안 [' || lesson_type_kr || '] 레슨을 요청했습니다.';

    -- 트레이너에게 알림 전송
    CALL notify_user_change(
      trainer_id,
      'LESSON_QUOTE',
      notification_message
    );
  END LOOP;
END;
$$;

-- 4-2. 분야와 매칭되는 레슨 등록 트리거 함수
CREATE OR REPLACE FUNCTION lesson_create_trigger()
RETURNS TRIGGER AS $$
BEGIN 
  CALL notify_lesson_create_matching_trainer(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4-3. 분야와 매칭되는 레슨 등록 트리거 생성
CREATE TRIGGER lesson_create_trigger
AFTER INSERT ON "LessonRequest"
FOR EACH ROW
EXECUTE FUNCTION lesson_create_trigger();

-- -----------------------------------------------
-- 5. 알림 생성시 자동 이벤트 발생
-- -----------------------------------------------

-- 5-1. 알림 생성시 자동 이벤트 발생 트리거 함수
CREATE OR REPLACE FUNCTION notify_new_notification() 
RETURNS TRIGGER AS $$
DECLARE
  payload JSON;
BEGIN
  -- 새로 삽입된 알림 데이터를 JSON 형태로 변환
  payload := json_build_object(
    'id', New."id",
    'userId', NEW."userId",
    'type', NEW."type",
    'message', NEW."message",
    'isRead', New."isRead",
    'createdAt', New."createdAt",
    'updatedAt', New."updatedAt"
  );

  -- PostgreSQL NOTIFY를 통해 `notification_channel`에 이벤트 발생
  PERFORM pg_notify('notification_channel', payload::TEXT);

  RETURN NEW;
END;  
$$ LANGUAGE plpgsql;

-- 5-2. 알림 생성시 자동 이벤트 발생 트리거 생성
DROP TRIGGER IF EXISTS notify_new_notification_trigger ON "Notification";

CREATE TRIGGER notify_new_notification_trigger
AFTER INSERT ON "Notification"
FOR EACH ROW
EXECUTE FUNCTION notify_new_notification();
