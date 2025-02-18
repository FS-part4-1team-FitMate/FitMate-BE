enum ChatbotExceptionMessage {
  INVALID_API_KEY = '잘못된 API 키가 제공되었습니다. OpenAI API 키를 확인해주세요.',
  TOO_MANY_REQUESTS = '현재 사용 가능한 API 호출 한도를 초과했습니다.',
  BAD_REQUEST = '요청이 잘못되었습니다. 입력값을 다시 확인해주세요.',
  FORBIDDEN = '권한이 없습니다. API 사용 권한을 확인해주세요.',
  INTERNAL_SERVER_ERROR = '현재 AI 서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
}

export default ChatbotExceptionMessage;
