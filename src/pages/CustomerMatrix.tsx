import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

type Step =
  | 'start'
  | 'existing_revenue'
  | 'existing_industry'
  | 'startup_professional'
  | 'result_redirect'
  | 'result_normal'
  | 'result_professional'
  | 'result_startup_general'

interface State { step: Step; industry: string }

const INDUSTRIES = ['제조업', '도소매업', '서비스업', '음식점업', '건설업', '기타']

function Btn({ onClick, variant = 'default', children }: {
  onClick: () => void; variant?: 'default' | 'danger' | 'success'; children: React.ReactNode
}) {
  const cls = {
    default: 'matrix-btn',
    danger:  'matrix-btn matrix-btn-danger',
    success: 'matrix-btn matrix-btn-success',
  }[variant]
  return <button type="button" className={cls} onClick={onClick}>{children}</button>
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="matrix-step">
      <p className="matrix-question">{title}</p>
      <div className="matrix-choices">{children}</div>
    </div>
  )
}

function Result({ type, title, children }: {
  type: 'warning' | 'success' | 'info'; title: string; children: React.ReactNode
}) {
  const border = { warning: 'var(--yellow)', success: 'var(--green)', info: 'var(--primary)' }[type]
  return (
    <div className="matrix-result" style={{ borderColor: border }}>
      <p className="matrix-result-title" style={{ color: border }}>{title}</p>
      {children}
    </div>
  )
}

export default function CustomerMatrix() {
  const [state, setState] = useState<State>({ step: 'start', industry: '' })

  const go = (step: Step, extra?: Partial<State>) =>
    setState(s => ({ ...s, step, ...extra }))
  const reset = () => setState({ step: 'start', industry: '' })

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">고객응대 매트릭스</h2>
        {state.step !== 'start' && (
          <button className="btn-secondary" onClick={reset}>
            <RotateCcw size={14} /> 처음으로
          </button>
        )}
      </div>

      <div className="matrix-card">

        {state.step === 'start' && (
          <Step title="고객 유형을 선택하세요">
            <Btn onClick={() => go('existing_revenue')}>기존 사업자</Btn>
            <Btn onClick={() => go('startup_professional')}>예비 창업자</Btn>
          </Step>
        )}

        {state.step === 'existing_revenue' && (
          <Step title="연 매출을 확인하세요">
            <Btn variant="danger"  onClick={() => go('result_redirect')}>2억 미만</Btn>
            <Btn variant="success" onClick={() => go('existing_industry')}>2억 이상</Btn>
          </Step>
        )}

        {state.step === 'existing_industry' && (
          <Step title="업종을 선택하세요">
            {INDUSTRIES.map(ind => (
              <Btn key={ind} onClick={() => go('result_normal', { industry: ind })}>{ind}</Btn>
            ))}
          </Step>
        )}

        {state.step === 'startup_professional' && (
          <Step title="창업 업종 유형을 확인하세요">
            <Btn onClick={() => go('result_professional')}>전문직</Btn>
            <Btn onClick={() => go('result_startup_general')}>일반 업종</Btn>
          </Step>
        )}

        {state.step === 'result_redirect' && (
          <Result type="warning" title="경기신보 안내 (2억 미만)">
            <p className="matrix-note">
              매출 규모로 인해 신보 직접 지원 대상이 아닙니다.<br />
              기분이 상하지 않도록 아래 멘트로 안내하세요.
            </p>
            <p className="matrix-script-label">안내 멘트</p>
            <blockquote className="matrix-script">
              "고객님, 해당 업종의 경우 가까운 <strong>경기신보</strong>에서 특화하여 지원하고 있어서
              그쪽에서 더 맞춤화된 서비스를 받으실 수 있을 것 같습니다.
              경기신보 쪽으로 안내해 드려도 될까요?"
            </blockquote>
          </Result>
        )}

        {state.step === 'result_normal' && (
          <Result type="success" title={`정상 상담 진행 — ${state.industry}`}>
            <p className="matrix-note">
              2억 이상 기존 사업자 · <strong>{state.industry}</strong><br />
              일반 보증 상담을 진행하세요.
            </p>
          </Result>
        )}

        {state.step === 'result_professional' && (
          <Result type="info" title="전문직 예비 창업자">
            <p className="matrix-script-label">확인 사항</p>
            <ul className="matrix-checklist">
              <li>상호명에 전문직 명칭 포함 여부 확인</li>
              <li>성명 — 자격증 보유자 본인 여부 확인</li>
              <li>해당 면허·자격증 사본 제출 요청</li>
            </ul>
            <p className="matrix-note" style={{ marginTop: 12 }}>
              ※ 의사·변호사·약사 등 전문직은 상호 및 성명에 따라 보증 한도·조건이 달라집니다.
            </p>
          </Result>
        )}

        {state.step === 'result_startup_general' && (
          <Result type="info" title="일반 예비 창업자">
            <p className="matrix-note">일반 예비 창업자 상담을 진행하세요.</p>
          </Result>
        )}

      </div>
    </div>
  )
}
