enum ChatExceptionMessage {
  CHAT_ROOM_FORBIDDEN = '이 채팅방에 참여 중이 아닙니다.',
  CHAT_ROOM_NOT_FOUND = '채팅방을 찾을 수 없습니다.',
  CHAT_ROOM_CREATION_FAILED = '채팅방 생성에 실패했습니다.',
  MESSAGE_SAVE_FAILED = '메시지 저장에 실패했습니다.',
  CHAT_ROOM_LIST_FAILED = '채팅방 목록을 불러오는 중 오류가 발생했습니다.',
  INVALID_PAGE_OR_LIMIT = '페이지 또는 제한 값이 잘못되었습니다.',
  DELETED_CHAT_ROOM = '삭제된 채팅방입니다.',
}

export default ChatExceptionMessage;
