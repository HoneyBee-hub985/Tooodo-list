const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between bg-white/90 px-5 py-4 rounded-2xl shadow-xl animate-todo-glow border-2 border-pink-300 relative overflow-hidden';
    // 네온 효과 배경
    const neon = document.createElement('div');
    neon.className = 'absolute inset-0 pointer-events-none z-0';
    neon.style.background = 'radial-gradient(circle at 70% 30%, #f472b6 0%, #fde68a 80%, transparent 100%)';
    neon.style.opacity = '0.18';
    li.appendChild(neon);
    // 번호 추가
    const number = document.createElement('span');
    number.textContent = (idx + 1) + '.';
    number.className = 'mr-4 font-extrabold text-pink-400 text-xl z-10 animate-text-glow-neon';
    li.appendChild(number);
    // 할 일 텍스트 (네온 효과와 애니메이션)
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.className = (todo.completed ? 'line-through text-gray-400 ' : '') + 'cursor-pointer flex-1 font-extrabold text-xl z-10 animate-text-glow-neon';
    span.onclick = function() { toggleTodo(idx); };
    // 삭제 버튼
    const delBtn = document.createElement('button');
    delBtn.textContent = '삭제';
    delBtn.className = 'ml-4 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-bold shadow-[0_0_20px_#f472b6] hover:scale-110 transition-all duration-200 z-10';
    delBtn.onclick = function() { showDeleteConfirm(idx); };
    li.appendChild(span);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}

function toggleTodo(idx) {
  todos[idx].completed = !todos[idx].completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(idx) {
  todos.splice(idx, 1);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    todos.push({ text, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
    // 새로 추가된 li에 spin 애니메이션 적용
    const lastLi = todoList.lastElementChild;
    if (lastLi) {
      lastLi.classList.add('animate-spin-once');
      setTimeout(() => lastLi.classList.remove('animate-spin-once'), 800);
    }
  }
});

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function showDeleteConfirm(idx) {
  // 이미 존재하는 confirm이 있으면 제거
  const old = document.getElementById('delete-confirm-modal');
  if (old) old.remove();

  const modalBg = document.createElement('div');
  modalBg.id = 'delete-confirm-modal';
  modalBg.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60';

  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-xs border-4 border-pink-400 animate-todo-glow';

  const img = document.createElement('img');
  img.src = "warning.jpg"; // 경고 이미지 경로
  img.className = 'w-24 h-24 mb-4 rounded-full shadow-lg border-4 border-pink-300';
  modal.appendChild(img);

  const msg = document.createElement('div');
  msg.className = 'text-lg font-bold text-pink-600 mb-6 text-center';
  msg.textContent = '정말로 삭제 하시겠습니까?';
  modal.appendChild(msg);

  const btnWrap = document.createElement('div');
  btnWrap.className = 'flex gap-4';

  const yesBtn = document.createElement('button');
  yesBtn.textContent = '예';
  yesBtn.className = 'px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold shadow-lg hover:scale-110 transition-all duration-200';
  yesBtn.onclick = function() {
    modalBg.remove();
    deleteTodo(idx);
  };

  const noBtn = document.createElement('button');
  noBtn.textContent = '아니오';
  noBtn.className = 'px-6 py-2 rounded-xl bg-gray-300 text-gray-700 font-bold shadow hover:bg-gray-400 transition-all duration-200';
  noBtn.onclick = function() {
    modalBg.remove();
  };

  btnWrap.appendChild(yesBtn);
  btnWrap.appendChild(noBtn);
  modal.appendChild(btnWrap);
  modalBg.appendChild(modal);
  document.body.appendChild(modalBg);
}

renderTodos();