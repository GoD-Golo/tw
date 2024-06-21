// JavaScript for hamburger menu

const hamburger = document.querySelector(".hamburger-icon");
const nav = document.querySelector(".hamburger");

hamburger.addEventListener("click", function () {
  console.log("clicked");
  nav.classList.toggle("active");
});
