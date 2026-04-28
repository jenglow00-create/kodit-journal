import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

import type { Material, CompetencyTag } from '@/types'
import { db } from '@/db/schema'
import { supabase } from '@/lib/supabase'

interface MaterialState {
  materials: Material[]
  isLoading: boolean
  error: string | null

  // Actions
  loadMaterials: (userId: string) => Promise<void>
  addMaterial: (data: Omit<Material, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => Promise<string>
  updateMaterial: (id: string, updates: Partial<Material>) => Promise<void>
  removeMaterial: (id: string) => Promise<void>
  syncToServer: (userId: string) => Promise<void>
}

export const useMaterialStore = create<MaterialState>()(
  devtools(
    immer((set, get) => ({
      materials: [],
      isLoading: false,
      error: null,

      loadMaterials: async (userId) => {
        set({ isLoading: true, error: null })
        try {
          // 1. 로컬 Dexie에서 즉시 로드
          const local = await db.materials.where('userId').equals(userId).sortBy('date')
          set({ materials: local.reverse(), isLoading: false })

          // 2. Supabase에서 최신 데이터 내려받기
          const { data, error } = await supabase
            .from('materials')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })

          if (error) throw error
          if (!data) return

          const serverMaterials: Material[] = data.map(r => ({
            id: r.id,
            userId: r.user_id,
            date: r.date,
            scene: r.scene,
            rawNote: r.raw_note ?? '',
            sparS: r.spar_s ?? '',
            sparP: r.spar_p ?? '',
            sparA: r.spar_a ?? '',
            sparR: r.spar_r ?? '',
            competencyTags: r.competency_tags ?? [],
            completion: r.completion ?? 0,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
            syncStatus: 'synced',
          }))

          // 로컬 캐시 갱신
          await db.materials.bulkPut(serverMaterials)
          set({ materials: serverMaterials })
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false })
        }
      },

      addMaterial: async (data) => {
        const id = globalThis.crypto.randomUUID()
        const now = new Date().toISOString()
        const material: Material = {
          ...data, id, createdAt: now, updatedAt: now, syncStatus: 'pending',
        }

        // 낙관적 업데이트
        await db.materials.add(material)
        set(state => { state.materials.unshift(material) })

        // 서버 동기화
        const { error } = await supabase.from('materials').insert({
          id, user_id: data.userId, date: data.date, scene: data.scene,
          raw_note: data.rawNote, spar_s: data.sparS, spar_p: data.sparP,
          spar_a: data.sparA, spar_r: data.sparR,
          competency_tags: data.competencyTags, completion: data.completion,
        })

        const syncStatus = error ? 'error' : 'synced'
        await db.materials.update(id, { syncStatus })
        set(state => {
          const m = state.materials.find(m => m.id === id)
          if (m) m.syncStatus = syncStatus
        })

        return id
      },

      updateMaterial: async (id, updates) => {
        const now = new Date().toISOString()
        const merged = { ...updates, updatedAt: now, syncStatus: 'pending' as const }

        await db.materials.update(id, merged)
        set(state => {
          const m = state.materials.find(m => m.id === id)
          if (m) Object.assign(m, merged)
        })

        const { error } = await supabase.from('materials').update({
          scene: updates.scene, raw_note: updates.rawNote,
          spar_s: updates.sparS, spar_p: updates.sparP,
          spar_a: updates.sparA, spar_r: updates.sparR,
          competency_tags: updates.competencyTags, completion: updates.completion,
          updated_at: now,
        }).eq('id', id)

        const syncStatus = error ? 'error' : 'synced'
        await db.materials.update(id, { syncStatus })
        set(state => {
          const m = state.materials.find(m => m.id === id)
          if (m) m.syncStatus = syncStatus
        })
      },

      removeMaterial: async (id) => {
        await db.materials.delete(id)
        set(state => { state.materials = state.materials.filter(m => m.id !== id) })
        await supabase.from('materials').delete().eq('id', id)
      },

      syncToServer: async (userId) => {
        const pending = await db.materials
          .where('syncStatus').equals('pending')
          .and(m => m.userId === userId)
          .toArray()

        for (const m of pending) {
          const { error } = await supabase.from('materials').upsert({
            id: m.id, user_id: m.userId, date: m.date, scene: m.scene,
            raw_note: m.rawNote, spar_s: m.sparS, spar_p: m.sparP,
            spar_a: m.sparA, spar_r: m.sparR,
            competency_tags: m.competencyTags, completion: m.completion,
          })
          if (!error) await db.materials.update(m.id, { syncStatus: 'synced' })
        }
      },
    })),
    { name: 'MaterialStore' }
  )
)
