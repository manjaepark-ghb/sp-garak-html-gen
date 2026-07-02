export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };

const CATEGORY_ICONS = [
  { bg: '#fff8e6', emoji: '🏠' },
  { bg: '#e8f4ff', emoji: '💳' },
  { bg: '#f0eeff', emoji: '🍺' },
];

const LATEST_MATERIALS_URL = 'https://drive.google.com/drive/folders/1P_kNgpn_8kHRBx3HjjfHmLCB4uVhyw5g';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { volNumber, volDate, intro, pptAllLink, pdfAllLink, categories } = req.body;

  if (!categories || categories.length !== 3) {
    return res.status(400).json({ error: '업종 3개가 필요합니다.' });
  }

  const categoryHTML = categories.map((cat, i) => {
    const icon = CATEGORY_ICONS[i] || { bg: '#f3f0e9', emoji: '📌' };
    const num = String(i + 1).padStart(2, '0');
    return `
        <!-- CAT ${num} ${cat.name} -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:12px;border:1px solid #e8e5de;${i < 2 ? 'margin-bottom:14px;' : ''}">
          <tr>
            <td style="padding:18px 20px 14px;border-bottom:1px solid #f3f0e9;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:34px;height:34px;background-color:${icon.bg};border-radius:8px;text-align:center;vertical-align:middle;font-size:16px;padding:0 9px;">${icon.emoji}</td>
                  <td style="padding-left:12px;">
                    <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:1.2px;color:#bbbbbb;text-transform:uppercase;">Category ${num}</p>
                    <p style="margin:0;font-size:15px;font-weight:700;color:#111111;">${cat.name}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px 14px;border-bottom:1px solid #f3f0e9;">
              <p style="margin:0 0 12px;font-size:13px;color:#444444;line-height:1.8;">${cat.insight}</p>
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                <tr>
                  <td style="background-color:#fffbf0;border-left:3px solid #f5a623;border-radius:0 6px 6px 0;padding:9px 12px;">
                    <p style="margin:0;font-size:12px;color:#7a5500;line-height:1.6;">💡 ${cat.callout}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0;border-bottom:1px solid #f3f0e9;">
              <img src="${cat.imageUrl || ''}" alt="${cat.name} × 프라임오피스 집행 레퍼런스" width="100%" style="display:block;width:100%;border:none;" />
            </td>
          </tr>
          <tr>
            <td style="background-color:#faf9f6;padding:12px 16px;border-radius:0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="49%" style="padding-right:6px;">
                    <a href="${cat.pptLink || '#'}" style="display:block;text-align:center;padding:10px 0;background-color:#0f1117;color:#ffffff;font-size:12px;font-weight:700;text-decoration:none;border-radius:7px;">PPT 다운로드</a>
                  </td>
                  <td width="49%" style="padding-left:6px;">
                    <a href="${cat.pdfLink || '#'}" style="display:block;text-align:center;padding:10px 0;background-color:#ffffff;color:#555555;font-size:12px;font-weight:700;text-decoration:none;border-radius:7px;border:1px solid #dedad2;">PDF만 받기</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;
  }).join('\n');

  const html = `<!-- 스티비 [HTML로 만들기] 템플릿에 그대로 붙여넣으세요 -->
<!-- 미리보기 텍스트 -->
<table id="$stb-htmlv3$" style="height:0px;max-height:0px;border-width:0px;visibility:hidden;line-height:0px;font-size:0px;overflow:hidden;display:none;"><tr><td>${categories.map(c => c.name).join('·')} 트렌드 인사이트와 프라임오피스 집행 레퍼런스를 확인해보세요.</td></tr></table>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f1ed;">
<tr><td align="center" style="padding:32px 16px;">

  <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-radius:14px;overflow:hidden;border:1px solid #e0ddd5;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">

    <!-- HEADER -->
    <tr>
      <td style="background-color:#0f1117;padding:34px 36px 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-size:20px;font-weight:700;color:#ffffff;">슾가락</td>
            <td align="right" style="font-size:10px;letter-spacing:1.5px;color:rgba(255,255,255,0.35);text-transform:uppercase;">${volNumber ? 'Vol. ' + volNumber + ' &middot; ' : ''}${volDate || ''}</td>
          </tr>
        </table>
        <p style="margin:20px 0 8px;font-size:24px;font-weight:700;color:#ffffff;line-height:1.4;">${intro || '이달의 소비 트렌드,<br>지금 확인해보세요'}</p>
        <p style="margin:0 0 22px;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.75;">달라지는 소비 흐름과 공간 미디어 인사이트를<br>이번 슾가락에서 확인해보세요.</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="49%" style="padding-right:6px;">
              <a href="${pptAllLink || '#'}" style="display:block;text-align:center;padding:11px 0;background-color:#ffffff;color:#0f1117;font-size:12px;font-weight:700;text-decoration:none;border-radius:7px;">&#8595; 전체 자료 다운로드 (PPT)</a>
            </td>
            <td width="49%" style="padding-left:6px;">
              <a href="${pdfAllLink || '#'}" style="display:block;text-align:center;padding:11px 0;background-color:rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);font-size:12px;font-weight:700;text-decoration:none;border-radius:7px;border:1px solid rgba(255,255,255,0.18);">PDF만 받기</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="background-color:#f9f8f5;padding:20px 20px 28px;">
${categoryHTML}
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background-color:#ffffff;padding:20px 36px 24px;border-top:1px solid #e8e5de;text-align:center;">
        <p style="margin:0 0 6px;font-size:11px;color:#bbbbbb;line-height:1.8;">${volNumber ? volNumber + '번째 ' : ''}슾가락, 어떠셨나요? &#128522;<br>문의: <a href="mailto:sac@spaceadd.com" style="color:#999999;text-decoration:none;">sac@spaceadd.com</a> 또는 담당자에게 편하게 연락 주세요.</p>
        <p style="margin:0;font-size:11px;color:#bbbbbb;">
          <a href="${LATEST_MATERIALS_URL}" style="color:#999999;text-decoration:none;">최신 자료 모아보기</a>
          &nbsp;&middot;&nbsp;
          <a href="$%unsubscribe%$" style="color:#999999;text-decoration:none;">수신거부</a>
        </p>
      </td>
    </tr>

  </table>

</td></tr>
</table>`;

  return res.status(200).json({ html });
}
