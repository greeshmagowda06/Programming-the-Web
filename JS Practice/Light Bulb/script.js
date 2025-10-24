const bulb = document.getElementById("bulb");
const onBtn = document.getElementById("onBtn");
const offBtn = document.getElementById("offBtn");
const toggleBtn = document.getElementById("toggleBtn");

onBtn.addEventListener("click", () => {
  bulb.setAttribute("src", "bulb_on.jpg");
  bulb.classList.add("on");
});

offBtn.addEventListener("click", () => {
  bulb.setAttribute("src", "bulb_off.jpg");
  bulb.classList.remove("on");
});

toggleBtn.addEventListener("click", () => {
  const isOn = bulb.getAttribute("src").includes("on");
  if (isOn) {
    bulb.setAttribute("src", "bulb_off.jpg");
    bulb.classList.remove("on");
    toggleBtn.textContent = "Toggle (Off)";
  } else {
    bulb.setAttribute("src", "bulb_on.jpg");
    bulb.classList.add("on");
    toggleBtn.textContent = "Toggle (On)";
  }
});
