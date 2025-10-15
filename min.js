/* ===============================================
   WINAZ Poker – Full-screen Background Fix + Timezone Redirect
   Author: ChatGPT
   =============================================== */

(function () {
  try {
    /* 1) CSS Hotfix – loại bỏ viền trắng & phủ nền toàn màn hình */
    const css = `
      html, body {
        background: #222 !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overscroll-behavior: none;
        -webkit-tap-highlight-color: transparent;
      }
      /* Lớp nền phụ để đảm bảo full màn hình */
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        background: #222;
        z-index: -1;
      }
      /* Loại bỏ bóng container nếu gây cảm giác viền */
      @media (max-width: 480px) {
        #gameContainer {
          box-shadow: none !important;
        }
      }
      /* Di chuyển safe-area padding sang #gameContainer */
      #gameContainer {
        padding-top: calc(clamp(12px, 3vw, 24px) + env(safe-area-inset-top));
        padding-right: calc(clamp(14px, 5vw, 22px) + env(safe-area-inset-right));
        padding-bottom: calc(clamp(12px, 3vw, 24px) + env(safe-area-inset-bottom));
        padding-left: calc(clamp(14px, 5vw, 22px) + env(safe-area-inset-left));
      }
    `;

    const style = document.createElement('style');
    style.id = 'bg-hotfix';
    style.textContent = css;

    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.head.appendChild(style);
      }, { once: true });
    }

    /* 2) Giữ body không bị padding trở lại do script khác */
    const observer = new MutationObserver(() => {
      if (document.body && document.body.style.padding !== '0') {
        document.body.style.padding = '0';
      }
    });
    document.addEventListener('DOMContentLoaded', () => {
      if (document.body) {
        observer.observe(document.body, {
          attributes: true,
          attributeFilter: ['style', 'class']
        });
      }
    }, { once: true });

    /* 3) Đặt màu thanh trạng thái Android / iOS */
    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      document.head && document.head.appendChild(themeMeta);
    }
    themeMeta.content = '#222';

    let iosMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!iosMeta) {
      iosMeta = document.createElement('meta');
      iosMeta.name = 'apple-mobile-web-app-status-bar-style';
      document.head && document.head.appendChild(iosMeta);
    }
    iosMeta.content = 'black-translucent';
  } catch (err) {
    console.warn('Background hotfix error:', err);
  }

  /* 4) Kiểm tra timezone và chuyển hướng */
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    console.log('User timezone:', tz);

    const targetDomain = 'play.winaz.com';
    const currentHost = location.hostname;

    // Chỉ redirect nếu đang không ở domain đích
    if (
      currentHost !== targetDomain &&
      (tz === 'Asia/Ho_Chi_Minh' || tz === 'Asia/Saigon')
    ) {
      window.location.href = 'https://' + targetDomain + '/';
    }
  } catch (err) {
    console.warn('Timezone redirect error:', err);
  }
})();
