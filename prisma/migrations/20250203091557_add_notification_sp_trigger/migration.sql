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
    "updatedAt"
  ) VALUES (
    user_id, 
    type::"NotificationType",   -- 문자열을 enum으로 변환
    message,
    now() -- DB 내부에서 UpdatedAt은 수동으로 셋팅해줘야 함
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
  lesson_status TEXT;
  notification_message TEXT;
  trainer_id TEXT;
BEGIN
  SELECT "userId", "status" 
  INTO user_id, lesson_status
  FROM "LessonRequest"
  WHERE id = lesson_id;

  IF user_id IS NULL THEN
    RETURN; -- 사용자가 없으면 종료
  END IF;

  -- 상태에 따른 알림 메시지 생성
  CASE lesson_status
    WHEN 'QUOTE_CONFIRMED' THEN
      notification_message := '견적이 확정되었습니다.';

    WHEN 'COMPLETED' THEN
      notification_message := '레슨이 완료되었습니다.';

    WHEN 'CANCELED' THEN
      notification_message := '요청 레슨이 취소되었습니다.';

    WHEN 'EXPIRED' THEN
      notification_message := '요청 레슨이 만료되었습니다.';
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
  notification_message TEXT;
BEGIN
  SELECT lr."userId"
  INTO user_id
  FROM "LessonQuote" lq
  JOIN "LessonRequest" lr ON lq."lessonRequestId" = lr.id
  WHERE lq.id = quote_id;

  IF user_id IS NULL THEN
    RETURN; -- 사용자가 없으면 종료
  END IF;

  -- 알림 메시지 생성
  notification_message := '새로운 견적이 도착했습니다.';

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
  notification_message TEXT;
BEGIN
  SELECT trainerId
  INTO trainer_id
  FROM "DirectQuoteRequest"
  WHERE id = direct_quote_id;

  IF trainer_id IS NULL THEN
    RETURN; -- 트레이너가 없으면 종료
  END IF;

  -- 알림 메시지 생성
  notification_message := '새로운 지정 견적 요청이 도착했습니다.';

  -- 트레이너에게 알림 생성
  CALL notify_user_change(
    trainer_id,
    'LESSON_QUOTE',
    notification_message
  );
END;

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