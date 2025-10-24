const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const li = document.createElement("li");
  li.textContent = taskText;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "❌";
  removeBtn.classList.add("remove-btn");

  removeBtn.addEventListener("click", () => {
    taskList.removeChild(li);
  });

  li.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") {
      li.classList.toggle("done");
    }
  });

  li.appendChild(removeBtn);
  taskList.appendChild(li);

  taskInput.value = "";
});
