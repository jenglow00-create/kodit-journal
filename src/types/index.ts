export type CompetencyTag =
  | '규정준수' | '고객소통' | '협업' | '직업윤리'
  | '문제해결' | '꼼꼼함' | '적응력'

export interface Material {
  id: string
  userId: string
  date: string
  scene: string
  rawNote: string
  sparS: string   // 상황
  sparP: string   // 문제
  sparA: string   // 행동
  sparR: string   // 결과
  competencyTags: CompetencyTag[]
  completion: number   // 0 | 25 | 50 | 75 | 100
  createdAt: string
  updatedAt: string
  // 오프라인 sync 상태
  syncStatus: 'synced' | 'pending' | 'error'
}

export interface FollowupQuestion {
  id: string
  materialId: string
  question: string
  answerDirection: string
}

export const COMPETENCY_OPTIONS: CompetencyTag[] = [
  '규정준수', '고객소통', '협업', '직업윤리', '문제해결', '꼼꼼함', '적응력',
]

export const COMPLETION_LABELS: Record<number, string> = {
  0: '미작성', 25: '초안', 50: '절반', 75: '검토중', 100: '완성',
}
