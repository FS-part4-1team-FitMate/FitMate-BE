export function getLessonSubTypeKr(lessonSubType: string | null): string {
  if (!lessonSubType) return '알 수 없음';

  const lessonSubTypeMap: Record<string, string> = {
    // SPORTS
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

    // FITNESS
    PERSONAL_TRAINING: '퍼스널 트레이닝',
    YOGA: '요가',
    PILATES: '필라테스',
    DIET_MANAGEMENT: '다이어트 관리',

    // REHAB
    STRETCHING: '스트레칭',
    REHAB_TREATMENT: '재활 치료',
  };

  return lessonSubTypeMap[lessonSubType] ?? '기타';
}
