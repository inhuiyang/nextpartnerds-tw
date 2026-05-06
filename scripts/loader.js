const container = document.getElementById('section-container');
const navItems = document.querySelectorAll('.nav-item[data-section]');

async function loadSection(section) {
  try {
    const res = await fetch(`sections/${section}.html?v=${Date.now()}`);
    if (!res.ok) throw new Error(`${res.status}`);

    // 이전 섹션 정리
    if (typeof window._sectionCleanup === 'function') {
      window._sectionCleanup();
      window._sectionCleanup = null;
    }

    container.innerHTML = await res.text();
    if (window.lucide) lucide.createIcons({ nameAttr: 'data-lucide' });
    container.querySelectorAll('script').forEach(orig => {
      const script = document.createElement('script');
      script.textContent = orig.textContent;
      document.body.appendChild(script);
      document.body.removeChild(script);
    });
  } catch (e) {
    container.innerHTML = `<p class="text-error-500">섹션을 불러올 수 없습니다: sections/${section}.html</p>`;
  }
}

navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    loadSection(item.dataset.section);
    window.scrollTo(0, 0);
  });
});

// 해시 기반 초기 로드
const hash = location.hash.slice(1);
if (hash) {
  const target = document.querySelector(`.nav-item[data-section="${hash}"]`);
  if (target) target.click();
}
