/**
 * build-standalone.js
 * 모든 섹션 HTML + dist/index.css 를 하나의 standalone.html 로 번들링
 * Usage: node build-standalone.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// 사이드바 네비게이션 정의 (index.html 과 동일 순서)
const NAV = [
  { label: 'Foundation', type: 'group' },
  { label: '색상 (Color)',       section: 'foundation/color' },
  { label: '타이포그래피',        section: 'foundation/typography' },

  { label: 'Components', type: 'group' },
  { label: '버튼 & 칩 (Button & Chip)',     section: 'components/button' },
  { label: '텍스트 필드 & 스테퍼',           section: 'components/textfield' },
  { label: '날짜 & 시간 선택',               section: 'components/datepicker' },
  { label: '체크박스 (Checkbox)',            section: 'components/checkbox' },
  { label: '라디오 버튼 (Radio)',            section: 'components/radio' },
  { label: '스위치 (Switch)',               section: 'components/switch' },
  { label: '드롭다운 (Dropdown)',            section: 'components/dropdown' },
  { label: '검색 (Search)',                 section: 'components/search' },
  { label: '배지 (Badge)',                  section: 'components/badge' },
  { label: '구분선 (Divider)',              section: 'components/divider' },
  { label: '토스트 (Toast)',               section: 'components/toast' },
  { label: '헤더 & 푸터 (Header & Footer)', section: 'components/header' },
  { label: '네비게이션 바 & 상단앱바',       section: 'components/navbar' },
  { label: '탭 (Tab)',                      section: 'components/tab' },
  { label: 'Segmented Control',             section: 'components/segmented' },
  { label: '페이지네이션 (Pagination)',      section: 'components/pagination' },
  { label: '로딩 (Loading)',                section: 'components/loading' },
  { label: '모달 (Modal)',                  section: 'components/modal' },
  { label: '툴팁 (Tooltip)',               section: 'components/tooltip' },
  { label: '도움 패널 (Help Panel)',        section: 'components/helppanel' },
  { label: '잡 카드 (Job Card)',            section: 'components/card' },
  { label: '바텀 시트 (Bottom Sheet)',      section: 'components/bottom-sheet' },
];

// CSS 읽기
const cssPath = path.join(ROOT, 'dist', 'index.css');
if (!fs.existsSync(cssPath)) {
  console.error('dist/index.css not found. Run: npx tailwindcss -i ./src/index.css -o ./dist/index.css');
  process.exit(1);
}
const css = fs.readFileSync(cssPath, 'utf8');

// 섹션 HTML 읽기
function readSection(section) {
  const filePath = path.join(ROOT, 'sections', `${section}.html`);
  if (!fs.existsSync(filePath)) {
    return `<p class="text-red-500">섹션 파일 없음: sections/${section}.html</p>`;
  }
  return fs.readFileSync(filePath, 'utf8');
}

// 사이드바 HTML 생성
function buildSidebar() {
  let html = '';
  for (const item of NAV) {
    if (item.type === 'group') {
      html += `
      <div class="px-4 mt-4 mb-1">
        <div class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2 py-1">${item.label}</div>
      </div>`;
    } else {
      html += `
      <a href="#" class="nav-item" data-section="${item.section}">${item.label}</a>`;
    }
  }
  return html;
}

// 섹션 패널 HTML 생성
function buildSections() {
  const sections = NAV.filter(n => n.section);
  return sections.map(item => {
    const content = readSection(item.section);
    return `
  <!-- ======== ${item.section} ======== -->
  <div class="section-panel" data-panel="${item.section}" style="display:none">
${content}
  </div>`;
  }).join('\n');
}

// 스크립트 — 섹션 내 inline <script> 를 재실행하는 로직 포함
const inlineScript = `
(function () {
  var panels = document.querySelectorAll('.section-panel');
  var navItems = document.querySelectorAll('.nav-item[data-section]');
  var welcome = document.getElementById('welcome');

  function showSection(section) {
    // cleanup 이전 섹션
    if (typeof window._sectionCleanup === 'function') {
      window._sectionCleanup();
      window._sectionCleanup = null;
    }

    welcome && (welcome.style.display = 'none');
    panels.forEach(function (p) { p.style.display = 'none'; });

    var panel = document.querySelector('.section-panel[data-panel="' + section + '"]');
    if (!panel) return;
    panel.style.display = '';

    // 패널 내 script 태그 재실행
    panel.querySelectorAll('script').forEach(function (orig) {
      var s = document.createElement('script');
      s.textContent = orig.textContent;
      document.body.appendChild(s);
      document.body.removeChild(s);
    });

    // Lucide 아이콘 초기화
    if (window.lucide) lucide.createIcons({ nameAttr: 'data-lucide' });

    window.scrollTo(0, 0);
    location.hash = section;
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      navItems.forEach(function (n) { n.classList.remove('active'); });
      item.classList.add('active');
      showSection(item.dataset.section);
    });
  });

  // 해시 기반 초기 로드
  var hash = location.hash.slice(1);
  if (hash) {
    var target = document.querySelector('.nav-item[data-section="' + hash + '"]');
    if (target) { target.classList.add('active'); showSection(hash); }
  }
})();
`;

// 최종 HTML 조립
const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>넥스트파트너 Design System</title>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
  <style>
${css}
  </style>
  <style>
    .nav-item {
      display: block;
      padding: 6px 16px;
      margin: 1px 8px;
      border-radius: 6px;
      font-size: 13px;
      color: #666666;
      text-decoration: none;
      transition: background 120ms, color 120ms;
    }
    .nav-item:hover { background: #f5f5f5; color: #1a1a1a; }
    .nav-item.active { background: #fff4f1; color: #ff7f65; font-weight: 600; }
  </style>
</head>
<body class="flex min-h-screen font-base">

  <!-- Sidebar -->
  <aside class="w-[220px] shrink-0 border-r border-neutral-200 bg-neutral-0 flex flex-col fixed top-0 left-0 h-full overflow-y-auto">
    <div class="px-6 py-6 border-b border-neutral-200">
      <div class="text-[13px] font-bold text-primary-500 tracking-widest uppercase mb-1">넥스트파트너</div>
      <div class="text-[11px] text-neutral-400">Design System v1.0</div>
    </div>
    <nav class="flex-1 py-4">
${buildSidebar()}
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="ml-[220px] flex-1 p-8 min-h-screen bg-neutral-50">

    <!-- 웰컴 화면 -->
    <div id="welcome" class="max-w-2xl">
      <h1 class="text-3xl font-bold text-neutral-900 mb-3">넥스트파트너 Design System</h1>
      <p class="text-neutral-600 text-lg mb-8">시니어 구직 플랫폼 디자인 시스템 — Tailwind CSS v3 기반</p>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-neutral-0 border border-neutral-200 rounded-card p-5">
          <div class="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Foundation</div>
          <p class="text-neutral-600 text-sm">색상, 타이포그래피 등 기초 토큰</p>
        </div>
        <div class="bg-neutral-0 border border-neutral-200 rounded-card p-5">
          <div class="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Components</div>
          <p class="text-neutral-600 text-sm">버튼, 칩, 배지 등 UI 컴포넌트</p>
        </div>
      </div>
    </div>

    <!-- 섹션 패널들 -->
${buildSections()}

  </main>

  <script>${inlineScript}</script>
  <script>lucide.createIcons();</script>
</body>
</html>
`;

const outPath = path.join(ROOT, 'standalone.html');
fs.writeFileSync(outPath, html, 'utf8');

const sizeKB = Math.round(fs.statSync(outPath).size / 1024);
console.log(`✓ standalone.html 생성 완료 (${sizeKB} KB)`);
