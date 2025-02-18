import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.js';
import { AlsStore } from '#common/als/store-validator.js';
import AuthExceptionMessage from '#exception/auth-exception-message.js';
import ChatbotExceptionMessage from '#exception/chatbot-exception-meaage.js';
import { UserService } from '#user/user.service.js';
import { logger } from '#logger/winston-logger.js';

// ChatCompletionMessageParam : { role: string; content: string }
const userConversations: Map<string, ChatCompletionMessageParam[]> = new Map();

const CATEGORY_MAP = {
  SOCCER: '축구',
  BASKETBALL: '농구',
  BASEBALL: '야구',
  TENNIS: '테니스',
  BADMINTON: '배드민턴',
  TABLE_TENNIS: '탁구',
  SKI: '스키',
  SURFING: '서핑',
  BOXING: '복싱',
  TAEKWONDO: '태권도',
  JIUJITSU: '주짓수',
  PERSONAL_TRAINING: '퍼스널 트레이닝',
  YOGA: '요가',
  PILATES: '필라테스',
  DIET_MANAGEMENT: '다이어트 관리',
  STRETCHING: '스트레칭',
  REHAB_TREATMENT: '재활 치료',
};

// system 메시지를 상수로 선언
const MAX_RESPONSE_LENGTH = 200;
const SYSTEM_MESSAGE: ChatCompletionMessageParam = {
  role: 'system',
  content: `당신은 사용자의 몸 상태와 목표에 맞는 운동을 추천하는 전문가입니다.
  한국어로 ${MAX_RESPONSE_LENGTH}자 이내로 답변하되, 단순한 운동 이름이 아니라 간단한 설명과 방법까지 포함하세요.
  예시:
  - "무릎 통증에는 재활 스트레칭이 효과적입니다. 벽에 기대어 햄스트링을 10초간 늘려보세요."
  - "체지방 감량에는 인터벌 러닝이 좋습니다. 30초 전력 질주 후 1분 걷기를 10세트 반복하세요."
  카테고리는 다음 한글 명칭을 사용하세요: ${JSON.stringify(CATEGORY_MAP, null, 2)}
  `,
};
const MAX_HISTORY_LENGTH = 2; // 최근 N개의 대화만 저장

@Injectable()
export class ChatbotService {
  private openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly alsStore: AlsStore,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey });
  }

  private getUserId(): string {
    const { userId } = this.alsStore.getStore();
    if (!userId) {
      throw new UnauthorizedException(AuthExceptionMessage.UNAUTHORIZED);
    }
    return userId;
  }

  async getChatbotResponse(userMessage: string) {
    const userId = this.getUserId();
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException(AuthExceptionMessage.USER_NOT_FOUND);
    }

    let conversation = userConversations.get(userId) || [];

    // 시스템 메시지가 첫 번째 위치에 없으면 추가
    if (conversation.length === 0 || conversation[0].role !== 'system') {
      conversation.unshift(SYSTEM_MESSAGE);
    }

    // 사용자 메시지 추가
    conversation.push({ role: 'user', content: userMessage });

    // 최근 MAX_HISTORY_LENGTH개의 질문-응답 쌍만 유지
    const history = conversation.filter((msg) => msg.role !== 'system'); // 시스템 메시지 제외
    const trimmedHistory = history.slice(-MAX_HISTORY_LENGTH * 2 + 1); // 최근 N개 질문-응답 유지 + 현재 질문
    conversation = [SYSTEM_MESSAGE, ...trimmedHistory]; // 시스템 메시지 + trimmedHistory
    logger.debug('conversation 전송 전', conversation);

    // OpenAI API 호출
    const responseText = await this.createChatCompletion(conversation);

    // AI 응답 추가
    conversation.push({ role: 'assistant', content: responseText });

    // 다시 최신 MAX_HISTORY_LENGTH * 2개만 유지 (AI 응답 추가 후)
    const finalHistory = conversation.filter((msg) => msg.role !== 'system'); // 시스템 메시지 제외
    conversation = [SYSTEM_MESSAGE, ...finalHistory.slice(-MAX_HISTORY_LENGTH * 2)]; // 시스템 메시지 포함

    // 대화 기록 업데이트
    userConversations.set(userId, conversation);
    logger.debug('conversation 최종 저장', conversation);

    return responseText;
  }

  async createChatCompletion(Messages: ChatCompletionMessageParam[]) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: Messages,
        temperature: 0.7,
      });

      let answer =
        response.choices[0]?.message?.content ||
        '질문에 대한 적절한 답변을 찾을 수 없습니다. 다시 한 번 질문을 해보세요!';

      if (answer.length > MAX_RESPONSE_LENGTH) {
        answer = answer.slice(0, MAX_RESPONSE_LENGTH - 3) + '...';
      }

      return answer;
    } catch (error: any) {
      console.error('OpenAI API 호출 실패:', error.status);

      // OpenAI API 응답에서 상태 코드 직접 사용
      const status = error.status || 500;
      let errorMessage = ChatbotExceptionMessage.INTERNAL_SERVER_ERROR;

      if (status === 401) {
        throw new UnauthorizedException(ChatbotExceptionMessage.INVALID_API_KEY);
      } else if (status === 429) {
        // 메시지를 객체 `{ message: string }` 형태로 전달
        throw new HttpException(
          { message: ChatbotExceptionMessage.TOO_MANY_REQUESTS },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else if (status === 400) {
        throw new BadRequestException(ChatbotExceptionMessage.BAD_REQUEST);
      } else if (status === 403) {
        throw new ForbiddenException(ChatbotExceptionMessage.FORBIDDEN);
      }

      throw new InternalServerErrorException(errorMessage);
    }
  }
}
