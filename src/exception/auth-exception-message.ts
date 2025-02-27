enum AuthExceptionMessage {
  USER_EXISTS = '이미 존재하는 이메일입니다.',
  EMAIL_NOT_FOUND = '해당 이메일을 찾을 수 없습니다.',
  PASSWORD_ERROR = '비밀번호가 잘못되었습니다.',
  UNAUTHORIZED = '로그인이 필요합니다.',
  USER_NOT_FOUND = '해당 유저를 찾을 수 없습니다.',
  NO_REFRESH_TOKEN = '리프레시 토큰이 없습니다.',
  INVALID_ROLE = '잘못된 역할 값입니다.',
  EMAIL_NOT_VERIFIED = '이메일 인증이 완료되지 않았습니다.',
  INVALID_VERIFICATION_CODE = '인증 실패: 잘못된 인증번호 입니다.',
  PASSWORD_MISMATCH = '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
}

export default AuthExceptionMessage;
