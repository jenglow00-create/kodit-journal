import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, FileJson } from 'lucide-react'
import * as XLSX from 'xlsx'
import { useMaterialStore } from '@/store/useMaterialStore'
import { COMPLETION_LABELS } from '@/types'

export default function Export() {
  const { materials } = useMaterialStore()
  const [exporting, setExporting] = useState(false)

  const toRows = () => materials.map(m => ({
    날짜: m.date,
    장면: m.scene,
    'S(상황)': m.sparS,
    'P(문제)': m.sparP,
    'A(행동)': m.sparA,
    'R(결과)': m.sparR,
    역량태그: m.competencyTags.join(', '),
    작성률: `${COMPLETION_LABELS[m.completion]} (${m.completion}%)`,
    원본메모: m.rawNote,
    생성일: m.createdAt.split('T')[0],
  }))

  const exportExcel = () => {
    setExporting(true)
    const ws = XLSX.utils.json_to_sheet(toRows())
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'SPAR소재')
    XLSX.writeFile(wb, `kodit-spar-${new Date().toISOString().split('T')[0]}.xlsx`)
    setExporting(false)
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(materials, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `kodit-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const exportMarkdown = () => {
    const lines = ['# 인턴 일지 — SPAR 소재 모음\n']
    for (const m of materials) {
      lines.push(`## #${m.scene} [${m.date}]`)
      lines.push(`역량: ${m.competencyTags.join(', ')}  작성률: ${COMPLETION_LABELS[m.completion]}\n`)
      lines.push(`### S (상황)\n${m.sparS || '(미작성)'}\n`)
      lines.push(`### P (문제)\n${m.sparP || '(미작성)'}\n`)
      lines.push(`### A (행동)\n${m.sparA || '(미작성)'}\n`)
      lines.push(`### R (결과)\n${m.sparR || '(미작성)'}\n`)
      lines.push('---\n')
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `kodit-spar-${new Date().toISOString().split('T')[0]}.md`
    a.click()
  }

  return (
    <div className="page">
      <h2 className="page-title">내보내기</h2>
      <p className="page-desc">총 {materials.length}개 소재 저장됨</p>

      <div className="export-grid">
        <div className="export-card">
          <FileSpreadsheet size={32} />
          <h3>Excel (.xlsx)</h3>
          <p>자소서 작업용 스프레드시트.<br />모든 SPAR 항목이 열로 분리됩니다.</p>
          <button onClick={exportExcel} disabled={exporting || materials.length === 0} className="btn-primary">
            <Download size={16} /> Excel 내보내기
          </button>
        </div>

        <div className="export-card">
          <FileText size={32} />
          <h3>Markdown (.md)</h3>
          <p>면접 준비 문서.<br />SPAR 구조 그대로 포맷팅됩니다.</p>
          <button onClick={exportMarkdown} disabled={materials.length === 0} className="btn-secondary">
            <Download size={16} /> Markdown 내보내기
          </button>
        </div>

        <div className="export-card">
          <FileJson size={32} />
          <h3>JSON (백업)</h3>
          <p>전체 데이터 백업/복원용.<br />다른 기기로 이전할 때 사용합니다.</p>
          <button onClick={exportJSON} disabled={materials.length === 0} className="btn-secondary">
            <Download size={16} /> JSON 내보내기
          </button>
        </div>
      </div>
    </div>
  )
}
