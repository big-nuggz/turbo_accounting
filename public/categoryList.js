import { populateCategories, reloadAll } from "./app.js";
import { getCategories, updateUserCategories } from "./data.js";
import { escapeHtml } from "./utils.js";


const form = document.getElementById('categoryListForm');
const input = document.getElementById('categoryEditInput');

export function updateCategoryList() {
  const categories = getCategories().user;
  const list = document.getElementById('categoryList');

  list.innerHTML = '';
  categories.forEach((category, index) => {
    const li = document.createElement('li');
    li.className = 'group flex items-center justify-between list-row transition-all cursor-grab hover:bg-base-200 active:cursor-grabbing select-none';
    li.draggable = true;
    li.dataset.index = index;

    li.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="bi bi-grip-horizontal"></i>
        <span class="text-slate-700 text-sm font-medium">${category.name}</span>
      </div>

      <div class="flex flex-row gap-x-2">
        <div class="flex flex-col gap-2 max-w-xs">
          <input type="color" id="color" class="color-picker h-8 w-12 cursor-pointer rounded-xl border border-base-300 overflow-hidden transition hover:shadow-sm" value="${category.color}" />
        </div>

        <button class="delete-btn text-slate-400 hover:text-red-500 p-1 rounded" aria-label="delete">
          <i class="bi bi-trash-fill"></i>
        </button>
      </div>
    `;

    attachDragEvents(li);
    li.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteItem(index);
    });

    li.querySelector('.color-picker').addEventListener('change', (e) => {
      e.stopPropagation();
      setCategoryColor(e, index);
    });

    list.appendChild(li);
  });

  populateCategories();
}

// Drag & Drop Handlers
let draggedIndex = null;

function attachDragEvents(element) {
  element.addEventListener('dragstart', (e) => {
    draggedIndex = +element.dataset.index;
    element.classList.add('opacity-40');
    e.dataTransfer.effectAllowed = 'move';
  });

  element.addEventListener('dragend', () => {
    element.classList.remove('opacity-40');
    document.querySelectorAll('#editableList li').forEach(li => {
      li.classList.remove('border-t-2', 'border-indigo-500');
    });
  });

  element.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });

  element.addEventListener('dragenter', (e) => {
    e.preventDefault();
    if (+element.dataset.index !== draggedIndex) {
      element.classList.add('border-t-2', 'border-indigo-500');
    }
  });

  element.addEventListener('dragleave', () => {
    element.classList.remove('border-t-2', 'border-indigo-500');
  });

  element.addEventListener('drop', (e) => {
    e.preventDefault();
    const targetIndex = +element.dataset.index;
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      var userCategories = getCategories().user;
      
      const draggedItem = userCategories.splice(draggedIndex, 1)[0];
      userCategories.splice(targetIndex, 0, draggedItem);

      updateUserCategories(userCategories);
      updateCategoryList();
    }
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = escapeHtml(input.value.trim());
  const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`

  var userCategories = getCategories().user;

  if (name) {
    userCategories.push({name: name, color: color});
    updateUserCategories(userCategories);
    input.name = '';
    updateCategoryList();
  }
});

function deleteItem(index) {
  const userConfirmation = confirm("Are you sure?");

  if (userConfirmation) {
    var userCategories = getCategories().user;
    userCategories.splice(index, 1);
    updateUserCategories(userCategories);
    updateCategoryList();
  }
}

function setCategoryColor(e, index) {
  var userCategories = getCategories().user;
  userCategories[index].color = e.target.value;
  updateUserCategories(userCategories);
  reloadAll();
}