enum LessonExceptionMessage {
  ONLY_USER_CAN_REQUEST_LESSON = '일반 유저인 경우에만 레슨을 요청하실 수 있습니다.',
  PENDING_LESSON_EXISTS = '이미 대기중인 레슨이 있습니다.',
  LESSON_NOT_FOUND = '요청하신 Lesson이 존재하지 않습니다.',
  NOT_MY_LESSON = '본인의 레슨만 취소할 수 있습니다.',
  INVALID_STATUS_TOBE_PENDING = '대기중인 레슨만 취소할 수 있습니다.',
  NOT_MY_LESSON_DIRECT_QUOTE = '본인의 요청 레슨에만 지정 견적 요청을 할 수 있습니다.',
  INVALID_LESSON_STATUS_FOR_QUOTE = '대기중인 레슨에만 견적을 요청할 수 있습니다.',
  TRAINER_NOT_FOUND_OR_INVALID = '해당 트레이너가 존재하지 않습니다.',
  DIRECT_QUOTE_ALREADY_EXISTS = '이미 해당 트레이너에게 지정 견적 요청이 존재합니다..',
  DIRECT_QUOTE_NOT_FOUND = '지정 견적 요청을 찾을 수 없습니다.',
  NOT_MY_DIRECT_QUOTE_REQUEST = '본인의 지정 견적 요청만 반려할 수 있습니다.',
  INVALID_DIRECT_QUOTE_STATUS = '이미 처리된 요청입니다.',
  INVALID_LESSON_REQUEST_MATCH = '요청 레슨과 지정 견적 요청이 일치하지 않습니다.',
  DIRECT_QUOTE_LIMIT_REACHED = '지정 견적 요청은 최대 3개까지 가능합니다.',
  TRAINER_ALREADY_SENT_QUOTE = '이미 이 요청 레슨에 대해 견적서를 보냈습니다.',
}

export default LessonExceptionMessage;
