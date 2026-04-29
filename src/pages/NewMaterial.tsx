import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Plus } from 'lucide-react'
import { COMPETENCY_OPTIONS } from '@/types'
import { useMaterialStore } from '@/store/useMaterialStore'
import { useAuthStore } from '@/store/useAuthStore'

const today = () => new Date().toISOString().split('T')[0]

export default function NewMaterial() {
  const navigate = useNavigate()
  const { addMaterial } = useMaterialStore()
  const { user } = useAuthStore()

  const [form, setForm] = useState({
    date: today(), scene: '', rawNote: '',
    sparS: '', sparP: '', sparA: '', sparR: '',
    competencyTags: [] as string[],
    completion: 50,
  })
  const [saving, setSaving] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [customInput, setCustomInput] = useState('')

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      competencyTags: f.competencyTags.includes(tag)
        ? f.competencyTags.filter(t => t !== tag)
        : [...f.competencyTags, tag],
    }))
  }

  const addCustomTag = () => {
    const tag = customInput.trim()
    if (!tag || form.competencyTags.includes(tag)) { setCustomInput(''); return }
    setForm(f => ({ ...f, competencyTags: [...f.competencyTags, tag] }))
    setCustomInput('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.scene.trim() || !user) return
    setSaving(true)
    try {
      await addMaterial({ ...form, userId: user.id })
      navigate('/journal')
    } finally {
      setSaving(false)
    }
  }

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const customTags = form.competencyTags.filter(t => !COMPETENCY_OPTIONS.includes(t))

  return (
    <div className="page">
      <h2 className="page-title">새 소재 입력</h2>
      <form onSubmit={handleSubmit} className="material-form">

        <div className="form-row">
          <label>날짜</label>
          <input type="date" value={form.date} onChange={f('date')} />
        </div>

        <div className="form-row">
          <label>장면 제목 <span className="required">*</span></label>
          <input
            type="text" value={form.scene} onChange={f('scene')}
            placeholder="예: 고객 방문 시 기보증/신규 구분 안내"
            required
          />
        </div>

        <div className="form-row">
          <label>관찰 메모 <span className="hint">(자유롭게)</span></label>
          <textarea value={form.rawNote} onChange={f('rawNote')} rows={3}
            placeholder="그날 있었던 일을 자유롭게 기록..." />
        </div>

        <div className="spar-section">
          <h3 className="section-title">SPAR 구조화</h3>
          {([
            ['sparS', 'S 상황', '당시 배경과 상황을 설명하세요'],
            ['sparP', 'P 문제', '어떤 문제 또는 과제가 있었나요?'],
            ['sparA', 'A 행동', '본인이 한 행동 (관찰 포함)'],
            ['sparR', 'R 결과', '결과 또는 배운 점'],
          ] as [string, string, string][]).map(([field, label, ph]) => (
            <div key={field} className="form-row">
              <label>{label}</label>
              <textarea value={(form as any)[field]} onChange={f(field)}
                rows={2} placeholder={ph} />
            </div>
          ))}
        </div>

        <div className="form-row">
          <label>역량 태그</label>
          <div className="tag-grid">
            {COMPETENCY_OPTIONS.map(tag => (
              <button
                key={tag} type="button"
                className={form.competencyTags.includes(tag) ? 'tag active' : 'tag'}
                onClick={() => toggleTag(tag)}
              >{tag}</button>
            ))}
            <button
              type="button"
              className={showCustom ? 'tag active' : 'tag'}
              onClick={() => setShowCustom(s => !s)}
            >기타</button>
          </div>

          {showCustom && (
            <div className="custom-tag-row">
              <input
                type="text"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag() } }}
                placeholder="태그 직접 입력 후 Enter"
                className="custom-tag-input"
                autoFocus
              />
              <button type="button" className="btn-secondary" onClick={addCustomTag}>
                <Plus size={14} /> 추가
              </button>
            </div>
          )}

          {customTags.length > 0 && (
            <div className="tag-grid" style={{ marginTop: 8 }}>
              {customTags.map(tag => (
                <button
                  key={tag} type="button"
                  className="tag active"
                  onClick={() => toggleTag(tag)}
                >{tag} ×</button>
              ))}
            </div>
          )}
        </div>

        <div className="form-row">
          <label>작성률: <strong>{form.completion}%</strong></label>
          <input
            type="range" min={0} max={100} step={25}
            value={form.completion}
            onChange={e => setForm(f => ({ ...f, completion: +e.target.value }))}
          />
          <div className="completion-labels">
            <span>미작성</span><span>초안</span><span>절반</span><span>검토중</span><span>완성</span>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={saving || !form.scene.trim()}>
          <Save size={16} />
          {saving ? '저장 중...' : '저장하기'}
        </button>
      </form>
    </div>
  )
}
