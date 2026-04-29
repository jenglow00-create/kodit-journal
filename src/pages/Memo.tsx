import { Printer } from 'lucide-react'

export default function Memo() {
  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">업무 메모</h2>
        <button className="btn-secondary" onClick={() => window.print()}>
          <Printer size={16} /> PDF 저장
        </button>
      </div>

      <div className="memo-doc" id="memo-print">

        <div className="memo-section">
          <h3 className="memo-section-title">고객응대 매트릭스</h3>

          <div className="memo-block">
            <p className="memo-label">1단계 — 확인 사항</p>
            <div className="memo-row">
              <span className="memo-badge">①</span>
              <span>매출</span>
            </div>
            <div className="memo-row">
              <span className="memo-badge">②</span>
              <span>업종</span>
            </div>
          </div>

          <div className="memo-block memo-block-warning">
            <p className="memo-label">매출 2억 미만일 경우</p>
            <p className="memo-desc">
              직접 "매출이 작아서"라고 안내하면 기분이 상할 수 있음.<br />
              아래 멘트로 경기신보로 안내할 것.
            </p>
            <blockquote className="memo-quote">
              "고객님, 가까운 <strong>경기신보</strong>에서 해당 업종을 특화하여 지원하고 있어서
              그쪽에서 더 맞춤화된 서비스를 받으실 수 있을 것 같습니다."
            </blockquote>
          </div>

          <div className="memo-block memo-block-info">
            <p className="memo-label">예비 창업자 — 전문직일 경우</p>
            <p className="memo-desc">상호 및 성명에 따라 안내 방식이 달라짐.</p>
            <ul className="memo-list">
              <li>상호명에 전문직 명칭 포함 여부 확인</li>
              <li>성명 — 자격증 보유자 본인 여부 확인</li>
              <li>면허·자격증 사본 제출 요청</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
