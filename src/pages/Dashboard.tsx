import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, Clock } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { useMaterialStore } from '@/store/useMaterialStore'
import { useAuthStore } from '@/store/useAuthStore'
import { COMPLETION_LABELS, COMPETENCY_OPTIONS } from '@/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

export default function Dashboard() {
  const { materials, loadMaterials } = useMaterialStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) loadMaterials(user.id)
  }, [user])

  const total = materials.length
  const completed = materials.filter(m => m.completion === 100).length
  const inProgress = materials.filter(m => m.completion > 0 && m.completion < 100).length

  const tagCounts = COMPETENCY_OPTIONS.map(tag =>
    materials.filter(m => m.competencyTags.includes(tag)).length
  )

  const chartData = {
    labels: COMPETENCY_OPTIONS,
    datasets: [{
      label: '소재 수',
      data: tagCounts,
      backgroundColor: '#2563eb',
      borderRadius: 6,
    }]
  }

  const recent = [...materials].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">대시보드</h2>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <BookOpen size={24} />
          <div>
            <div className="stat-value">{total}</div>
            <div className="stat-label">전체 소재</div>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={24} />
          <div>
            <div className="stat-value">{completed}</div>
            <div className="stat-label">완성</div>
          </div>
        </div>
        <div className="stat-card">
          <Clock size={24} />
          <div>
            <div className="stat-value">{inProgress}</div>
            <div className="stat-label">작성 중</div>
          </div>
        </div>
      </div>

      {total > 0 && (
        <div className="chart-section">
          <p className="section-title">역량 태그별 분포</p>
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      )}

      <p className="section-title">최근 소재</p>
      <div className="recent-section">
        {recent.length === 0 ? (
          <p style={{ color: 'var(--text-dim)' }}>아직 소재가 없습니다. <Link to="/new">첫 소재 입력하기</Link></p>
        ) : (
          recent.map(m => (
            <Link key={m.id} to={`/edit/${m.id}`} className="recent-card">
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{m.date}</div>
                <div style={{ fontWeight: 600 }}>{m.scene}</div>
              </div>
              <span className="completion-badge">{COMPLETION_LABELS[m.completion]}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
