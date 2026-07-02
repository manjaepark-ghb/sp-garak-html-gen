export const config = { api: { bodyParser: { sizeLimit: '20mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });

  const { pdfBase64, industryName } = req.body;
  if (!pdfBase64 || !industryName) return res.status(400).json({ error: '필수 파라미터가 없습니다.' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: '당신은 B2B 광고 영업 뉴스레터 전문 에디터입니다. PDF 자료를 읽고 두 가지 텍스트만 JSON으로 출력하세요. 마크다운, 설명, 코드블록 없이 { 로 시작해서 } 로 끝내세요. JSON 문자열 값 안에 큰따옴표 금지. 줄바꿈 금지.',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 }
            },
            {
              type: 'text',
              text: `이 PDF는 한국 ${industryName} 업종의 소비 트렌드 자료입니다.\n\n아래 두 가지를 JSON으로 출력하세요:\n\ninsight: 이 업종의 핵심 소비 트렌드 2~3문장. 수치나 사례 포함. 구매 의사결정에 영향을 주는 변화 중심으로. 광고/미디어 언급 금지. <strong> 태그로 핵심어 1~2개 강조.\ncallout: 공간 미디어(프라임오피스 엘리베이터 로비) 집행과 연결되는 광고주 소구 포인트 1문장. 30자 이내.\n\nJSON만 출력:`
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Anthropic API 오류: ' + errText.slice(0, 200) });
    }

    const data = await response.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');

    // JSON 파싱
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return res.status(500).json({ error: '응답 파싱 실패', raw: text.slice(0, 300) });

    let parsed;
    try { parsed = JSON.parse(text.slice(start, end + 1)); }
    catch (e) {
      // 줄바꿈 제거 후 재시도
      try { parsed = JSON.parse(text.slice(start, end + 1).replace(/[\r\n]+/g, ' ')); }
      catch (e2) { return res.status(500).json({ error: '파싱 실패', raw: text.slice(0, 300) }); }
    }

    return res.status(200).json({ insight: parsed.insight || '', callout: parsed.callout || '' });
  } catch (err) {
    return res.status(500).json({ error: '서버 오류: ' + err.message });
  }
}
