export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };

const LATEST_MATERIALS_URL = 'https://drive.google.com/drive/folders/1P_kNgpn_8kHRBx3HjjfHmLCB4uVhyw5g';

// 업종명 키워드 → 아이콘 매핑
function getIcon(name) {
  const n = name.toLowerCase();
  if (/뷰티|화장품|코스메틱|스킨케어|미용/.test(n)) return { emoji: '💄', bg: '#fdf0f5' };
  if (/여행|숙박|호텔|항공|투어/.test(n)) return { emoji: '✈️', bg: '#e8f4ff' };
  if (/커머스|쇼핑|이커머스|플랫폼|리테일/.test(n)) return { emoji: '🛒', bg: '#fff0e8' };
  if (/금융|은행|보험|증권|카드|핀테크/.test(n)) return { emoji: '💳', bg: '#e8f4ff' };
  if (/패션|의류|의상|패션/.test(n)) return { emoji: '👗', bg: '#f5e8ff' };
  if (/식품|F&B|외식|프랜차이즈|음식|레스토랑|카페/.test(n)) return { emoji: '🍽️', bg: '#fff8e6' };
  if (/주류|술|맥주|와인|위스키/.test(n)) return { emoji: '🍺', bg: '#f0eeff' };
  if (/자동차|모빌리티|차량|EV|전기차/.test(n)) return { emoji: '🚗', bg: '#e8fff0' };
  if (/게임|엔터테인먼트|콘텐츠|OTT|미디어/.test(n)) return { emoji: '🎮', bg: '#eef0ff' };
  if (/헬스|건강|의료|제약|바이오|피트니스/.test(n)) return { emoji: '💊', bg: '#e8fff5' };
  if (/교육|에듀테크|학습|학원/.test(n)) return { emoji: '📚', bg: '#fff8e6' };
  if (/리빙|가구|인테리어|홈/.test(n)) return { emoji: '🏠', bg: '#fff8e6' };
  if (/가전|전자|IT|테크/.test(n)) return { emoji: '📱', bg: '#e8f4ff' };
  if (/키즈|아동|유아|육아/.test(n)) return { emoji: '🧸', bg: '#fff0e8' };
  if (/펫|반려동물|동물병원/.test(n)) return { emoji: '🐾', bg: '#f0fdf4' };
  if (/시즈널|계절|이슈/.test(n)) return { emoji: '📅', bg: '#f3f0e9' };
  return { emoji: '📌', bg: '#f3f0e9' };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { volNumber, volDate, intro, subText, pptAllLink, pdfAllLink, categories } = req.body;

  if (!categories || categories.length !== 3) {
    return res.status(400).json({ error: '업종 3개가 필요합니다.' });
  }

  const defaultSubText = '달라지는 소비 흐름과 공간 미디어 인사이트를<br>이번 슾가락에서 확인해보세요.';

  const categoryHTML = categories.map((cat, i) => {
    const icon = getIcon(cat.name);
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
        <p style="margin:0 0 22px;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.75;">${subText || defaultSubText}</p>
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
      <td style="background-color:#ffffff;padding:28px 36px 32px;border-top:1px solid #e8e5de;text-align:center;">
        <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#333333;">이번 슾가락, 어떠셨나요? 😊</p>
        <p style="margin:0 0 14px;font-size:12px;color:#888888;line-height:1.9;">궁금하신 점이나 필요하신 내용은 언제든지 편하게 연락 주세요.<br><a href="mailto:sac@spaceadd.com" style="color:#555555;font-weight:700;text-decoration:none;">sac@spaceadd.com</a> 또는 담당 매니저에게 직접 연락 주셔도 됩니다.</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #f0ede6;padding-top:14px;margin-top:4px;">
          <tr>
            <td align="center" style="padding-top:14px;">
              <a href="${LATEST_MATERIALS_URL}" style="color:#777777;font-size:12px;text-decoration:none;">최신 자료 모아보기</a>
              <span style="color:#cccccc;font-size:12px;">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
              <a href="$%unsubscribe%$" style="color:#777777;font-size:12px;text-decoration:none;">수신거부</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>

</td></tr>
</table>`;

  return res.status(200).json({ html });
}
