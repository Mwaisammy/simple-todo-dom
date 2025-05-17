document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".todo-app__form");
  const input = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const clearBtn = document.querySelector(".todo-completed h3");
  const itemCountEl = document.querySelector(".todo-footer__count h3");
  const addBtn = document.getElementById("onAdd");

//   const initialTodos = [
//     { text: "Complete online JavaScript course", completed: true },
//     { text: "Jog around the park 3x", completed: false },
//     { text: "10 minutes meditation", completed: false },
//     { text: "Read for 1 hour", completed: false },
//     { text: "Pick up groceries", completed: false },
//     { text: "Complete Todo App on Frontend Mentor", completed: false }
//   ];

  // Filter buttons
  const filterAllBtns = document.querySelectorAll(".filter-all__btn");
  const filterActiveBtns = document.querySelectorAll(".filter-active__btn");
  const filterCompletedBtns = document.querySelectorAll(".filter-completed__btn");

  // Initialize the todo list with sample data
  function initializeTodos() {
    initialTodos.forEach(todo => {
      createTodoElement(todo.text, todo.completed);
    });
    updateCount();
  }

  // Event listener for form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addTodo();
  });

  // Add new todo when clicking the add button
  addBtn.addEventListener("click", addTodo);

  // Add new todo
  function addTodo() {
    const todoText = input.value.trim();
    if (todoText === "") return;

    createTodoElement(todoText, false);
    input.value = "";
    updateCount();
  }

  // Create todo element
  function createTodoElement(text, isCompleted) {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (isCompleted) li.classList.add("completed");

    const checkbox = document.createElement("span");
    checkbox.className = "todo-item__checkbox";
    if (isCompleted) checkbox.classList.add("checked");

    const p = document.createElement("p");
    p.className = "todo-item__text";
    p.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "todo-item__delete";
    deleteBtn.innerHTML = `<img src="./assets/images/icon-cross.svg" alt="Delete">`;

    // Toggle completion  clicking checkbox
    checkbox.addEventListener("click", function () {
      li.classList.toggle("completed");
      checkbox.classList.toggle("checked");
      updateCount();
    });

    // Remove todo when clicking delete button
    deleteBtn.addEventListener("click", function () {
      li.remove();
      updateCount();
    });

    li.appendChild(checkbox);
    li.appendChild(p);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
  }

  // Update the count of remaining items
  function updateCount() {
    const total = document.querySelectorAll(".todo-item:not(.completed)").length;
    itemCountEl.textContent = `${total} item${total !== 1 ? "s" : ""} left`;
  }

  // Clear completed todos
  clearBtn.addEventListener("click", function () {
    const completedItems = document.querySelectorAll(".todo-item.completed");
    completedItems.forEach(item => item.remove());
    updateCount();
  });

  // Filter todos
  function filterTodos(filter) {
    const todos = document.querySelectorAll(".todo-item");

    todos.forEach(todo => {
      const isCompleted = todo.classList.contains("completed");

      if (filter === "all") {
        todo.style.display = "flex";
      } else if (filter === "active") {
        todo.style.display = isCompleted ? "none" : "flex";
      } else if (filter === "completed") {
        todo.style.display = isCompleted ? "flex" : "none";
      }
    });
  }

  // Sync filter buttons in desktop and mobile views
  function setActiveFilterButtons(activeFilter) {
    // Remove active class from all filter buttons
    filterAllBtns.forEach(btn => btn.classList.remove("filter-active"));
    filterActiveBtns.forEach(btn => btn.classList.remove("filter-active"));
    filterCompletedBtns.forEach(btn => btn.classList.remove("filter-active"));

    // Add active class to the selected filter buttons
    if (activeFilter === "all") {
      filterAllBtns.forEach(btn => btn.classList.add("filter-active"));
    } else if (activeFilter === "active") {
      filterActiveBtns.forEach(btn => btn.classList.add("filter-active"));
    } else if (activeFilter === "completed") {
      filterCompletedBtns.forEach(btn => btn.classList.add("filter-active"));
    }
  }

  // Event listeners for filter buttons (both desktop and mobile)
  filterAllBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterTodos("all");
      setActiveFilterButtons("all");
    });
  });

  filterActiveBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterTodos("active");
      setActiveFilterButtons("active");
    });
  });

  filterCompletedBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterTodos("completed");
      setActiveFilterButtons("completed");
    });
  });

  // Dark mode / Light mode toggle
  const modeToggle = document.getElementById("mode-toggle");
  const modeIcon = document.getElementById("mode-icon");

  modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if(!document.body.classList.contains("dark-mode")) {
      // Switch to light mode
      modeIcon.src = "./assets/images/icon-moon.svg";
      modeIcon.alt = "dark";
    } else {
      // Switch to dark mode
      modeIcon.src = "./assets/images/icon-sun.svg";
      modeIcon.alt = "light";
    }
  });

  // Drag and drop functionality
  function enableDragAndDrop() {
    let draggedItem = null;

    // Make todos draggable
    function makeDraggable() {
      const todos = document.querySelectorAll(".todo-item");
      todos.forEach(todo => {
        todo.setAttribute("draggable", true);
        
        todo.addEventListener("dragstart", function() {
          draggedItem = this;
          setTimeout(() => this.classList.add("dragging"), 0);
        });
        
        todo.addEventListener("dragend", function() {
          draggedItem = null;
          this.classList.remove("dragging");
        });
      });
    }

    // Handle dropping
    todoList.addEventListener("dragover", function(e) {
      e.preventDefault();
      const afterElement = getDragAfterElement(todoList, e.clientY);
      if (draggedItem) {
        if (afterElement) {
          todoList.insertBefore(draggedItem, afterElement);
        } else {
          todoList.appendChild(draggedItem);
        }
      }
    });

    // Get the element to insert  based on mouse position
    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll(".todo-item:not(.dragging)")];
      
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    makeDraggable();

    // Make new items draggable 
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          makeDraggable();
        }
      });
    });

    observer.observe(todoList, { childList: true });
  }

  initializeTodos();
  enableDragAndDrop();
});