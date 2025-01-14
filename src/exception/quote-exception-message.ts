enum QuoteExceptionMessage {
  ONLY_TRAINER_CAN_CREATE_QUOTE = '트레이너만 견적을 생성할 수 있습니다.',
  QUOTE_NOT_FOUND = '해당 견적을 찾을 수 없습니다.',
  NOT_AUTHORIZED_TO_ACCEPT_QUOTE = '해당 견적을 확정할 권한이 없습니다.',
  NOT_AUTHORIZED_TO_REJECT_QUOTE = '해당 견적을 반려할 권한이 없습니다.',
  INVALID_STATUS_TO_ACCEPT = '확정할 수 있는 상태가 아닙니다.',
  INVALID_STATUS_TO_REJECT = '반려할 수 있는 상태가 아닙니다.',
  REJECTION_REASON_REQUIRED = '거절 사유를 입력해주세요.',
}
export default QuoteExceptionMessage;
