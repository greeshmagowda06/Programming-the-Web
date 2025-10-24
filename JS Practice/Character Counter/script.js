const messageBox = document.getElementById("message");
const counter = document.getElementById("counter");
const submitBtn = document.getElementById("submitBtn");

messageBox.addEventListener("input", () => {
  const length = messageBox.value.length;

  counter.textContent = `Characters: ${length} / 100`;

  if (length > 90) {
    counter.style.color = "red";
  } else {
    counter.style.color = "#333";
  }

  if (length > 100) {
    submitBtn.disabled = true;
  } else {
    submitBtn.disabled = false;
  }
});
