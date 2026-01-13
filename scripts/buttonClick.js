document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
  const button = document.getElementById("myButton");
  button.addEventListener("click", function () {
    console.log("Button was clicked!");
  });
});

function buttonClicked() {
  const toast = document.createElement("div");
  toast.id = "snackbar";
  toast.innerHTML = `Test Toast`;
  document.body.appendChild(toast);
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);

  toast.scrollIntoView({ behavior: "smooth", block: "end" });
}
