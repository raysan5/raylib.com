window.addEventListener("DOMContentLoaded", () => {
  var clickedInCanvas = false;
  var warning = document.createElement("div");
  warning.innerHTML =
    "Arrow key scrolling disabled.<br />Click outside canvas or press Escape to enable again.";
  warning.style.padding = "1em";
  warning.style.color = "white";
  warning.style.backgroundColor = "red";
  warning.style.position = "fixed";
  warning.style.bottom = 0;
  warning.style.left = 0;
  warning.style.right = 0;
  warning.style.textAlign = "center";
  warning.id = "no-scroll-warning-20220323";
  warning.style.display = "none";
  warning.style.fontFamily =
    "grixel_acme_7_wide_xtnd, Courier New, Verdana, Arial";
  document.body.appendChild(warning);

  function update() {
    warning.style.display = clickedInCanvas ? "block" : "none";
  }

  window.addEventListener("click", (ev) => {
    clickedInCanvas = ev.target.tagName.toUpperCase() == "CANVAS";
    update();
  });
  window.addEventListener(
    "keydown",
    (ev) => {
      if (clickedInCanvas) {
        if (
          ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
            ev.code
          ) > -1
        ) {
          ev.preventDefault();
        }
      }
      if (ev.code == "Escape") {
        clickedInCanvas = false;
        update();
      }
    },
    false
  );
});
