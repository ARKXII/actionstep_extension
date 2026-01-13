// document.addEventListener("DOMContentLoaded", function () {
//   console.log("DOM fully loaded and parsed");
//   buttonClicked();
// });
function buttonClicked() {
  //get toast css
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("toast.css");
  document.head.appendChild(link);

  //inject toast div
  const toast = document.createElement("div");
  toast.id = "snackbar";
  toast.innerHTML = `Actionstep QoL scripts loaded!`;
  document.body.appendChild(toast);

  // Get the toast DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
};

buttonClicked();