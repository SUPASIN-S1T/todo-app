const body = window.document.body;
const todoOutput = document.querySelector(".output-list");
const todoAppOutput = document.querySelector(".todo-app-output");
const Icon = document.querySelector(".toggle-theme i");
const toggleTheme = document.querySelector(".toggle-theme");
let todoItem = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form-list");
const btnClearAll = document.querySelector(".btn-clear");

window.addEventListener("DOMContentLoaded", () => {
  todoItem.focus();
  filterBtns();
});

// function : toggle theme
const toggle = () => {
  if (body.classList.contains("bg-light")) {
    body.classList.replace("bg-light", "bg-dark-2");
    todoItem.classList.add("bg-dark");
    todoAppOutput.classList.add("bg-dark");
    Icon.classList.replace("fa-moon", "fa-sun");
  } else {
    body.classList.replace("bg-dark-2", "bg-light");
    todoItem.classList.remove("bg-dark");
    todoAppOutput.classList.remove("bg-dark");
    Icon.classList.replace("fa-sun", "fa-moon");
  }
};

// function : add todo list
const addTodoList = (e) => {
  e.preventDefault();
  if (todoItem.value.trim() === "" || todoItem.value < 0) {
    alert("No no no no!");
    todoItem.value = "";
  } else {
    // li
    const li = document.createElement("li");
    li.classList.add("output-item");
    li.setAttribute("draggable", "true");
    // input radio
    const inputCheck = document.createElement("input");
    inputCheck.type = "checkbox";
    // label
    const label = document.createElement("label");
    label.textContent = todoItem.value;
    // button delete
    const button = document.createElement("button");
    button.classList.add("btn-todo-close");
    // icon
    const Icon = document.createElement("i");
    Icon.classList.add("fas", "fa-times");

    button.append(Icon);
    li.append(inputCheck, label, button);
    todoOutput.append(li);
    todoItem.value = "";
    updateCountItem();

    button.addEventListener("click", deleteTodoList);
    inputCheck.addEventListener("click", completeTodoList);
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragend", dragEnd);
    todoOutput.addEventListener("dragover", dragOver);
  }
};

// function : count list result
const updateCountItem = () => {
  const ItemCount = document.querySelectorAll(
    ".output-list li.output-item"
  ).length;
  const textResult = document.querySelector(".item-text-result");
  const ItemCountActive = document.querySelectorAll(
    ".output-item label.strike"
  ).length;
  const result = ItemCount - ItemCountActive;
  textResult.textContent = result;
};

// function : delete todo list
const deleteTodoList = (e) => {
  const btnCurrent = e.currentTarget;
  btnCurrent.parentNode.remove();
  updateCountItem();
};

// function : complete todo list
const completeTodoList = (e) => {
  const check = e.currentTarget;
  if (!check.hasAttribute("checked")) {
    check.setAttribute("checked", "");
    check.nextSibling.classList.add("strike");
    updateCountItem();
  } else {
    check.removeAttribute("checked", "");
    check.nextSibling.classList.remove("strike");
    updateCountItem();
  }
};

// function : clear complete all
const clearComplete = () => {
  const itemStrike = document.querySelectorAll(".output-item label.strike");
  itemStrike.forEach((item) => {
    item.parentNode.remove();
  });
};

// function : filter (1)
const filterBtns = () => {
  const btnFilters = document.querySelectorAll(".btn");
  const btnAll = document.querySelector(".btn-all");
  const btnActive = document.querySelector(".btn-active");
  const btnCompelete = document.querySelector(".btn-complete");
  let status;

  btnFilters.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.currentTarget === btnAll) {
        status = "all";
        btnAll.classList.add("active");
        btnActive.classList.remove("active");
        btnCompelete.classList.remove("active");
        filtersResult(status);

        updateCountItem();
      } else if (e.currentTarget === btnActive) {
        status = "active";
        btnActive.classList.add("active");
        btnAll.classList.remove("active");
        btnCompelete.classList.remove("active");
        filtersResult(status);
        updateCountItem();
      } else if (e.currentTarget === btnCompelete) {
        status = "complete";
        btnCompelete.classList.add("active");
        btnAll.classList.remove("active");
        btnActive.classList.remove("active");
        filtersResult(status);
        updateCountItem();
      }
    });
  });
};

// function : filter (2)
const filtersResult = (status) => {
  const itemTodo = document.querySelectorAll(".output-item");
  const itemLabel = document.querySelectorAll(".output-item label");
  switch (status) {
    case "all":
      if (itemTodo.length === 0) {
        alert(`No Item : ${itemTodo.length}`);
      } else {
        itemTodo.forEach((item) => {
          if (item.classList.contains("output-item")) {
            item.style.display = "flex";
          }
        });
      }

      break;
    case "active":
      if (itemLabel.length === 0) {
        alert("No Item");
      } else {
        itemLabel.forEach((item) => {
          if (item.classList.contains("strike")) {
            item.parentNode.style.display = "none";
          } else {
            item.parentNode.style.display = "flex";
          }
        });
      }

      break;
    case "complete":
      if (document.querySelectorAll(".output-item label.strike").length === 0) {
        alert("No Item");
      } else {
        itemLabel.forEach((item) => {
          if (!item.classList.contains("strike")) {
            item.parentNode.style.display = "none";
          } else {
            item.parentNode.style.display = "flex";
          }
        });
      }
      break;
  }
};

const dragStart = (e) => {
  e.currentTarget.classList.add("dragging");
};

const dragOver = (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(todoOutput, e.clientY);
  const draggable = document.querySelector(".dragging");
  if (afterElement == null) {
    todoOutput.appendChild(draggable);
  } else {
    todoOutput.insertBefore(draggable, afterElement);
  }
};

const dragEnd = (e) => {
  e.currentTarget.classList.remove("dragging");
};

const getDragAfterElement = (todoItem, y) => {
  const draggableElements = [
    ...todoItem.querySelectorAll(".output-item:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
};

// Event
toggleTheme.addEventListener("click", toggle);
todoForm.addEventListener("submit", addTodoList);
btnClearAll.addEventListener("click", clearComplete);
