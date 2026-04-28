import { Anchor, LogIn } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export default function Login() {
  const { signInWithGoogle, isLoading } = useAuthStore()

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <Anchor size={48} />
          <h1>인턴 관찰일지</h1>
          <p>신보 일경험 인턴 SPAR 소재 관리</p>
        </div>
        <button
          onClick={signInWithGoogle}
          disabled={isLoading}
          className="btn-google"
        >
          <LogIn size={18} />
          {isLoading ? '연결 중...' : 'Google 계정으로 시작'}
        </button>
        <p className="login-note">
          데이터는 서버에 안전하게 저장되어<br />
          어느 기기에서나 접근 가능합니다
        </p>
      </div>
    </div>
  )
}
