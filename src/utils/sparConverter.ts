const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export interface SparResult {
  sparS: string
  sparP: string
  sparA: string
  sparR: string
}

export async function convertToSpar(rawNote: string): Promise<SparResult> {
  if (!rawNote.trim()) throw new Error('메모 내용을 먼저 입력해주세요.')
  if (!OPENAI_API_KEY) throw new Error('OpenAI API 키가 설정되지 않았습니다.')

  const prompt = `당신은 금융공기업 인턴의 업무 경험을 SPAR 구조로 정리해주는 도우미입니다.

아래 자유 메모를 읽고 SPAR 4개 항목으로 분류해주세요.

- S (상황): 당시 배경, 맥락, 환경
- P (문제): 마주한 과제, 어려움, 해결해야 할 상황
- A (행동): 본인이 직접 취한 행동, 관찰한 내용
- R (결과): 결과, 성과, 배운 점

규칙:
1. 각 항목은 1~3문장으로 간결하게 작성
2. 메모에 없는 내용은 절대 지어내지 말 것
3. 항목이 불분명하면 빈 문자열("")로 남길 것
4. 반드시 아래 JSON 형식으로만 응답할 것

자유 메모:
"""
${rawNote}
"""

응답 형식:
{
  "sparS": "...",
  "sparP": "...",
  "sparA": "...",
  "sparR": "..."
}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `OpenAI 오류 (${response.status})`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  try {
    const parsed = JSON.parse(content)
    return {
      sparS: parsed.sparS ?? '',
      sparP: parsed.sparP ?? '',
      sparA: parsed.sparA ?? '',
      sparR: parsed.sparR ?? '',
    }
  } catch {
    throw new Error('AI 응답 파싱에 실패했습니다. 다시 시도해주세요.')
  }
}
