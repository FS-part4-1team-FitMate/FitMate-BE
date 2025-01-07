enum ExceptionMessages {
  BAD_REQUEST = '잘못된 요청입니다.',
  WRONG_FORMAT = '데이터 형식이 잘못되었습니다.',
  FORBIDDEN = '접근 권한이 없습니다.',
  INTERNAL_SERVER_ERROR = '서버 내부 오류가 발생했습니다.',
  USER_EXISTS = '이미 존재하는 이메일입니다.',
  EMAIL_NOT_FOUND = '해당 이메일을 찾을 수 없습니다.',
  PASSWORD_ERROR = '비밀번호가 잘못되었습니다.',
  NO_ENV_VARIABLE = '필요한 환경변수가 지정되지 않았습니다.',
  UNAUTHORIZED = '로그인이 필요합니다.',
  USER_NOT_FOUND = '해당 유저를 찾을 수 없습니다.',
  NO_REFRESH_TOKEN = '리프레시 토큰이 없습니다.',
  INVALID_REFRESH_TOKEN = '유효하지 않은 리프레시 토큰입니다.',
  INVALID_ACCESS_TOKEN = '유효하지 않은 엑세스 토큰입니다.',
  NO_STORE = '활성화된 AsyncLocalStorage 컨텍스트를 찾을 수 없습니다.',
}

export default ExceptionMessages;
