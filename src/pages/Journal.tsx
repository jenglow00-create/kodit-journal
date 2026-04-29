import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Edit2, Trash2, ChevronDown, ChevronUp, CloudOff, Check } from 'lucide-react'
import { useMaterialStore } from '@/store/useMaterialStore'
import { useAuthStore } from '@/store/useAuthStore'
import { COMPETENCY_OPTIONS, COMPLETION_LABELS, type CompetencyTag } from '@/types'

export default function Journal() {
  const { materials, loadMaterials, removeMaterial } = useMaterialStore()
  const { user } = useAuthStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filterTag, setFilterTag] = useState<string>('전체')
  const [filterCompletion, setFilterCompletion] = useState<number>(-1)

  useEffect(() => {
    if (user) loadMaterials(user.id)
  }, [user])

  const filtered = materials.filter(m => {
    if (filterTag !== '전체' && !m.competencyTags.includes(filterTag as CompetencyTag)) return false
    if (filterCompletion !== -1 && m.completion !== filterCompletion) return false
    return true
  })

  const completionColor = (pct: number) =>
    pct === 100 ? 'green' : pct >= 50 ? 'yellow' : 'red'

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">소재 목록 <span className="count">({filtered.length})</span></h2>
        <Link to="/new" className="btn-primary">
          <PlusCircle size={16} /> 새 소재
        </Link>
      </div>

      <div className="filter-bar">
        <select value={filterTag} onChange={e => setFilterTag(e.target.value)}>
          <option value="전체">전체 역량</option>
          {COMPETENCY_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterCompletion} onChange={e => setFilterCompletion(+e.target.value)}>
          <option value={-1}>전체 작성률</option>
          {Object.entries(COMPLETION_LABELS).map(([k, v]) =>
            <option key={k} value={k}>{v} ({k}%)</option>
          )}
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>소재가 없습니다.</p>
          <Link to="/new" className="btn-primary">첫 소재 입력하기</Link>
        </div>
      )}

      <div className="material-list">
        {filtered.map(m => (
          <div key={m.id} className="material-card">
            <div className="card-header" onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
              <div className="card-meta">
                <span className="card-date">{m.date}</span>
                {m.syncStatus === 'pending' && <CloudOff size={14} color="var(--yellow)" />}
                {m.syncStatus === 'synced'  && <Check    size={14} color="var(--green)"  />}
              </div>
              <h3 className="card-scene">{m.scene}</h3>
              <div className="card-footer">
                <div className="tag-list">
                  {m.competencyTags.map(t => <span key={t} className="tag-badge">{t}</span>)}
                </div>
                <div className="completion-bar">
                  <div
                    className={`completion-fill ${completionColor(m.completion)}`}
                    style={{ width: `${m.completion}%` }}
                  />
                </div>
                <span className="completion-label">{COMPLETION_LABELS[m.completion]}</span>
                {expanded === m.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expanded === m.id && (
              <div className="card-body">
                {([['S 상황', m.sparS], ['P 문제', m.sparP], ['A 행동', m.sparA], ['R 결과', m.sparR]] as [string, string][]).map(([label, val]) =>
                  val ? (
                    <div key={label} className="spar-row">
                      <span className="spar-label">{label}</span>
                      <p className="spar-text">{val}</p>
                    </div>
                  ) : null
                )}
                {m.rawNote && (
                  <div className="spar-row raw-note">
                    <span className="spar-label">원본 메모</span>
                    <p className="spar-text">{m.rawNote}</p>
                  </div>
                )}
                <div className="card-actions">
                  <Link to={`/edit/${m.id}`} className="btn-secondary">
                    <Edit2 size={14} /> 수정
                  </Link>
                  <button
                    className="btn-danger"
                    onClick={() => { if (window.confirm('삭제하시겠습니까?')) removeMaterial(m.id) }}
                  >
                    <Trash2 size={14} /> 삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
