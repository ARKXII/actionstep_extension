document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
  const button = document.getElementById("myButton");
  button.addEventListener("click", function () {
    console.log("Button was clicked!");
  });
});

function buttonClicked() {
  alert("Button Clicked!");
}
