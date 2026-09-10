/**
 * Todo List Life Dashboard
 */
(function() {
    'use strict';

    const StorageManager = {
        STORAGE_KEYS: { TASKS: 'todolist_tasks', QUICK_LINKS: 'todolist_quicklinks' },
        isAvailable() {
            try { localStorage.setItem('test', 'test'); localStorage.removeItem('test'); return true; }
            catch(e) { return false; }
        },
        get(key) { try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : null; } catch(e) { return null; } },
        set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {} }
    };

    const GreetingManager = {
        intervalId: null,
        init() { this.update(); this.intervalId = setInterval(() => this.update(), 1000); },
        update() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            const secs = String(now.getSeconds()).padStart(2, '0');
            document.getElementById('time-display').textContent = hours + ':' + mins + ':' + secs;
            
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
            const dateStr = now.toLocaleDateString('id-ID', options);
            document.getElementById('date-display').textContent = dateStr;
            
            const hour = now.getHours();
            let greeting = 'Malam';
            if (hour >= 4 && hour < 11) greeting = 'Pagi';
            else if (hour >= 11 && hour < 15) greeting = 'Siang';
            else if (hour >= 15 && hour < 19) greeting = 'Sore';
            document.getElementById('greeting-text').textContent = 'Selamat ' + greeting;
        }
    };

    const PomodoroTimer = {
        remainingSeconds: 1500,
        isRunning: false,
        intervalId: null,
        init() {
            this.updateDisplay();
            document.getElementById('timer-start').onclick = () => this.start();
            document.getElementById('timer-stop').onclick = () => this.stop();
            document.getElementById('timer-reset').onclick = () => this.reset();
        },
        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
        },
        updateDisplay() {
            document.getElementById('timer-display').textContent = this.formatTime(this.remainingSeconds);
        },
        start() {
            if (!this.isRunning && this.remainingSeconds > 0) {
                this.isRunning = true;
                document.getElementById('timer-status').textContent = 'Running...';
                this.intervalId = setInterval(() => {
                    this.remainingSeconds--;
                    this.updateDisplay();
                    if (this.remainingSeconds === 0) {
                        this.stop();
                        document.getElementById('timer-status').textContent = "Time's up!";
                    }
                }, 1000);
            }
        },
        stop() {
            if (this.isRunning) {
                this.isRunning = false;
                clearInterval(this.intervalId);
                document.getElementById('timer-status').textContent = 'Paused';
            }
        },
        reset() {
            this.stop();
            this.remainingSeconds = 1500;
            this.updateDisplay();
            document.getElementById('timer-status').textContent = 'Ready to start';
        }
    };

    const TodoListManager = {
        tasks: [],
        init() {
            this.loadFromStorage();
            this.render();
            document.getElementById('task-add-btn').onclick = () => this.addTask();
            document.getElementById('task-input').onkeypress = (e) => { if (e.key === 'Enter') this.addTask(); };
        },
        addTask() {
            const input = document.getElementById('task-input');
            const text = input.value.trim();
            if (!text) return;
            
            const task = { id: Date.now(), text: text, completed: false };
            this.tasks.push(task);
            this.saveToStorage();
            this.render();
            input.value = '';
        },
        deleteTask(id) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveToStorage();
            this.render();
        },
        toggleTask(id) {
            const task = this.tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                this.saveToStorage();
                this.render();
            }
        },
        render() {
            const list = document.getElementById('task-list');
            const empty = document.getElementById('tasks-empty-state');
            
            list.innerHTML = '';
            
            if (this.tasks.length === 0) {
                empty.style.display = 'block';
                return;
            }
            
            empty.style.display = 'none';
            
            this.tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = 'task-item' + (task.completed ? ' completed' : '');
                
                const checkboxHtml = '<input type="checkbox"' + (task.completed ? ' checked' : '') + ' onchange="window.TodoApp.toggleTask(' + task.id + ')">';
                li.innerHTML = checkboxHtml + '<span class="task-text">' + task.text + '</span><button class="btn btn-delete" onclick="window.TodoApp.deleteTask(' + task.id + ')">Delete</button>';
                list.appendChild(li);
            });
        },
        saveToStorage() { StorageManager.set(StorageManager.STORAGE_KEYS.TASKS, this.tasks); },
        loadFromStorage() {
            const saved = StorageManager.get(StorageManager.STORAGE_KEYS.TASKS);
            this.tasks = Array.isArray(saved) ? saved : [];
        }
    };

    const QuickLinksManager = {
        links: [],
        init() {
            this.loadFromStorage();
            this.render();
            document.getElementById('link-add-btn').onclick = () => this.addLink();
            document.getElementById('link-url').onkeypress = (e) => { if (e.key === 'Enter') this.addLink(); };
        },
        addLink() {
            const nameInput = document.getElementById('link-name');
            const urlInput = document.getElementById('link-url');
            const name = nameInput.value.trim();
            let url = urlInput.value.trim();
            
            if (!name || !url) return;
            
            if (!url.includes('http')) { url = 'https://' + url; }
            
            const link = { id: Date.now(), name: name, url: url };
            this.links.push(link);
            this.saveToStorage();
            this.render();
            nameInput.value = '';
            urlInput.value = '';
        },
        deleteLink(id) {
            this.links = this.links.filter(l => l.id !== id);
            this.saveToStorage();
            this.render();
        },
        openLink(url) { window.open(url, '_blank'); },
        render() {
            const container = document.getElementById('links-container');
            container.innerHTML = '';
            
            this.links.forEach(link => {
                const div = document.createElement('div');
                div.className = 'link-item';
                const html = '<span class="link-item-name" onclick="window.TodoApp.openLink(\'' + link.url + '\')" style="cursor: pointer; flex: 1;">' + link.name + '</span>';
                const closeBtn = '<button class="link-item-close" onclick="window.TodoApp.deleteLink(' + link.id + ')">×</button>';
                div.innerHTML = html + closeBtn;
                container.appendChild(div);
            });
        },
        saveToStorage() { StorageManager.set(StorageManager.STORAGE_KEYS.QUICK_LINKS, this.links); },
        loadFromStorage() {
            const saved = StorageManager.get(StorageManager.STORAGE_KEYS.QUICK_LINKS);
            this.links = Array.isArray(saved) ? saved : [];
        }
    };

    function init() {
        GreetingManager.init();
        PomodoroTimer.init();
        TodoListManager.init();
        QuickLinksManager.init();
        console.log('Dashboard initialized!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.TodoApp = {
        deleteTask: (id) => TodoListManager.deleteTask(id),
        toggleTask: (id) => TodoListManager.toggleTask(id),
        deleteLink: (id) => QuickLinksManager.deleteLink(id),
        openLink: (url) => QuickLinksManager.openLink(url)
    };
})();


