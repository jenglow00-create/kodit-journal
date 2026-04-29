export type CompetencyTag = string

export interface Material {
  id: string
  userId: string
  date: string
  scene: string
  rawNote: string
  sparS: string
  sparP: string
  sparA: string
  sparR: string
  competencyTags: string[]
  completion: number
  createdAt: string
  updatedAt: string
  syncStatus: 'synced' | 'pending' | 'error'
}

export interface FollowupQuestion {
  id: string
  materialId: string
  question: string
  answerDirection: string
}

export const COMPETENCY_OPTIONS = [
  '규정준수', '고객소통', '협업', '직업윤리', '문제해결', '꼼꼼함', '적응력',
]

export const COMPLETION_LABELS: Record<number, string> = {
  0: '미작성', 25: '초안', 50: '절반', 75: '검토중', 100: '완성',
}
