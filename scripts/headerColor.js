// if test environment, change header color
function changeHeaderColor() {
  const header = document.getElementById("global-navigation");
  if (header) {
  header.style.cssText += "background-color: #b99a0e !important;";
  } else return false;
}

changeHeaderColor();
