const currentURL = window.location.href;

// if test environment, change header color
function changeHeaderColor(string) {
  const header = document.getElementById("global-navigation");
  const actionStepPattern =
    /^https:\/\/ap-southeast-2\.actionstep(staging)?\.com\//;
  const match = string.match(actionStepPattern);

  let environment = match[1] === "staging" ? "staging" : "production";
  if (!match) return false;

  if (environment === "staging") {
    if (header) {
      header.style.cssText += "background-color: #b99a0e !important;";
    } else return false;
  } else if (environment === "production") {
    if (header) {
      header.style.cssText += "background-color: #004b87 !important;";
    } else return false;
  }

  const globalMessage = document.getElementById("global-message");
  if (globalMessage) {
    globalMessage.style.cssText += "position: sticky; top:0; z-index: 9999;";
  }
}

changeHeaderColor(currentURL);
