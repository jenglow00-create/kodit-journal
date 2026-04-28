import Dexie, { type EntityTable } from 'dexie'
import type { Material, FollowupQuestion } from '@/types'

class KoditDB extends Dexie {
  materials!: EntityTable<Material, 'id'>
  followupQuestions!: EntityTable<FollowupQuestion, 'id'>

  constructor() {
    super('KoditJournalDB')
    this.version(1).stores({
      materials: 'id, userId, date, completion, syncStatus, [userId+date]',
      followupQuestions: 'id, materialId',
    })
  }
}

export const db = new KoditDB()
