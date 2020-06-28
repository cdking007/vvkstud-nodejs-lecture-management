let nav = document.getElementById("m-navs");
let handler = document.getElementById("m-handle");

handler.addEventListener("click", () => {
  console.log("clicked");
  nav.classList.toggle("showNav");
});
