enum LessonExceptionMessage {
  ONLY_USER_CAN_REQUEST_LESSON = '일반 유저인 경우에만 레슨을 요청하실 수 있습니다.',
  PENDING_LESSON_EXISTS = '이미 진행중인 레슨이 있습니다.',
  LESSON_NOT_FOUND = '요청하신 Lesson이 존재하지 않습니다.',
  NOT_MY_LESSON = '본인의 레슨만 취소할 수 있습니다.',
  INVALID_STATUS_TOBE_PENDING = '대기중인 레슨만 취소할 수 있습니다.',
}

export default LessonExceptionMessage;
