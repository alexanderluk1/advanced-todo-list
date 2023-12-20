// Delete Todos

const form = document.querySelector("#new-todo-form");
const textInput = document.querySelector("#todo-input");
const displayList = document.querySelector("#list");
const template = document.querySelector("#list-item-template");

// All Local Host share the SAME storage, therefore prefix is important
// Always create a Prefix when you are saving things to Local Storage
const LOCAL_STORAGE_PREFIX = "ADVANCED_TODO_LIST";
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;

// --- Retrieving from Local Storage & Rendering ---
let todos = loadTodos();
todos.forEach((eachTodo) => renderTodo(eachTodo));

// --- Adding eventListener to the List for the changing of Checkbox
displayList.addEventListener("change", (e) => {
  // If it doesn't match the checkbox, return
  if (!e.target.matches("[data-list-item-checkbox]")) return;

  // Look for the List Item via closest
  const parent = e.target.closest(".list-item");

  // Getting the ID of that List Item
  const todoId = parent.dataset.todoId;

  // Find the todo with the ID
  const todoFound = todos.find((t) => t.id === todoId);

  // Setting the completed to whether the checkbox is checked
  todoFound.completed = e.target.checked;

  // Saving the todos
  saveTodos();
});

// --- DELETING OF TODOS ---
displayList.addEventListener("click", (e) => {
  if (!e.target.matches("[data-button-delete]")) return;

  const parent = e.target.closest(".list-item");
  const currentButton = parent.querySelector("[data-button-delete]");

  // Getting the ID of the To-do to delete
  const listItemID = parent.dataset.todoId;

  // Calling the function delete with the specific ID
  currentButton.addEventListener("clicks", deleteTodos(listItemID));
});

// --- ADDING OF TODOS ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const toDoName = textInput.value;

  // Handle Edge case where input is blank
  if (toDoName === "") return;

  // Since we also need to store whether the todo is checked, we need an obj
  let todoObj = {
    name: toDoName,
    completed: false,
    // Using value of date will give us current time up to milliseconds
    // which can be used as a unique value
    id: new Date().valueOf().toString(),
  };

  // Adding to todoList array
  todos.push(todoObj);
  saveTodos();

  // Clear the textbox Input after retrieving
  textInput.value = "";

  // Render the list
  renderTodo(todoObj);
});

// This does the rendering of the page.
function renderTodo(todoObj) {
  // Clones the template element from HTML
  const templateClone = template.content.cloneNode(true);

  // !!! We want to save the ID directly to the HTML element !!!
  const listItem = templateClone.querySelector(".list-item");

  // Saving it directly to an attribute `toDoId`
  listItem.dataset.todoId = todoObj.id;

  // Appending to text to list
  const textElement = templateClone.querySelector("[data-list-item-text]");
  textElement.innerText = todoObj.name;

  // This will render the checkbox according to HTML element property
  // This will cause the page to display the item being checked
  const checkbox = templateClone.querySelector("[data-list-item-checkbox]");
  checkbox.checked = todoObj.completed;

  // Appending templateClone to the displayList
  displayList.appendChild(templateClone);
}

function loadTodos() {
  // Local Storage data is always a string, if not found == null
  const todosString = localStorage.getItem(TODOS_STORAGE_KEY);

  // Convert String back to array & short-circuit to return empty arr if undefined
  return JSON.parse(todosString) || [];
}

function saveTodos() {
  // Convert this array into a JSON String
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}

function deleteTodos(itemID) {
  // Overriding the todos list less the ID to delete
  todos = todos.filter((each) => each.id !== itemID);

  // Saving the entire array to local storage which will override the old
  saveTodos();

  // Reloading the page
  location.reload();
}
