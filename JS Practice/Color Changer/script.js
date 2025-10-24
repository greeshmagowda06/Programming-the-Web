const colorBoxes = document.querySelectorAll(".color-box");
const selectedColorText = document.getElementById("selectedColor");
const resetBtn = document.getElementById("resetBtn");

colorBoxes.forEach(box => {
  box.addEventListener("click", () => {
    const color = box.getAttribute("data-color");
    document.body.style.backgroundColor = color.toLowerCase();
    selectedColorText.textContent = `Selected Color: ${color}`;
  });
});

resetBtn.addEventListener("click", () => {
  document.body.style.backgroundColor = "white";
  selectedColorText.textContent = "Selected Color: None";
});
