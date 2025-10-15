/* ===========================
   WIAZ Poker – One-file JS
   (BG fix + Safe-area + Theme + TZ redirect)
   =========================== */
(function () {
  try {
    /* 1) Bơm CSS hotfix sớm nhất có thể */
    var css = [
      'html{background:#222!important;}',
      'body{margin:0!important;padding:0!important;background:#222!important;-webkit-tap-highlight-color:transparent;}',
      /* giảm cảm giác “viền” do shadow khi màn nhỏ */
      '@media(max-width:480px){#gameContainer{box-shadow:none!important;}}'
    ].join('');
    var style = document.createElement('style');
    style.id = 'bg-hotfix';
    style.textContent = css;

    var injectHead = function (node) { if (document.head && !document.getElementById(node.id)) document.head.appendChild(node); };
    if (document.head) injectHead(style);
    else document.addEventListener('DOMContentLoaded', function(){ injectHead(style); }, { once:true });

    /* 2) Nếu có script khác set lại padding body -> đưa về 0 */
    var mo = new MutationObserver(function () {
      if (document.body && document.body.style && document.body.style.padding !== '0') {
        document.body.style.padding = '0';
      }
    });
    document.addEventListener('DOMContentLoaded', function () {
      if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    }, { once:true });

    /* 3) (Tuỳ chọn) Chuyển safe-area padding sang #gameContainer để không làm hở nền */
    var cssSafe = [
      '#gameContainer{',
      '  padding-top:calc(clamp(12px,3vw,24px) + env(safe-area-inset-top));',
      '  padding-right:calc(clamp(14px,5vw,22px) + env(safe-area-inset-right));',
      '  padding-bottom:calc(clamp(12px,3vw,24px) + env(safe-area-inset-bottom));',
      '  padding-left:calc(clamp(14px,5vw,22px) + env(safe-area-inset-left));',
      '}'
    ].join('');
    var styleSafe = document.createElement('style');
    styleSafe.id = 'bg-safe-area';
    styleSafe.textContent = cssSafe;
    document.addEventListener('DOMContentLoaded', function(){ injectHead(styleSafe); }, { once:true });

    /* 4) Màu thanh trạng thái để tránh viền sáng */
    var theme = document.querySelector('meta[name="theme-color"]');
    if (!theme) {
      theme = document.createElement('meta');
      theme.name = 'theme-color';
      theme.content = '#222';
      if (document.head) document.head.appendChild(theme);
      else document.addEventListener('DOMContentLoaded', function(){ document.head.appendChild(theme); }, { once:true });
    }
  } catch (e) {
    // nuốt lỗi để không cản trở game
    console && console.warn && console.warn('BG hotfix warn:', e);
  }

  /* 5) Redirect theo timezone (kèm chống vòng lặp) */
  try {
    var userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    console.log('TZ:', userTimeZone);
    var target = 'play.winaz.com';
    var onTarget = (location.hostname === target);
    if (!onTarget && (userTimeZone === 'Asia/Ho_Chi_Minh' || userTimeZone === 'Asia/Saigon')) {
      // chỉ chuyển khi chưa ở đúng domain
      location.href = 'https://' + target + '/';
    }
  } catch (e) {
    console && console.warn && console.warn('TZ redirect warn:', e);
  }
})();
