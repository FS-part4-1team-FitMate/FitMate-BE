export interface ILessonSchedulerService {
  /**
   * 서버 시작 시 실행되는 초기화 메서드
   */
  onModuleInit(): Promise<void>;

  /**
   * 매일 자정에 실행되는 크론 작업
   */
  handleCron(): Promise<void>;
}
