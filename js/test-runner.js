/**
 * Simple Test Runner for TodoListManager
 * Tests basic functionality without requiring Jest/npm setup
 */

// Mock localStorage
const mockStorage = {};
global.localStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, value) => {
        mockStorage[key] = value.toString();
    },
    removeItem: (key) => {
        delete mockStorage[key];
    }
};

// Add clear to mockStorage as a helper
const clearMockStorage = () => {
    for (const key in mockStorage) {
        delete mockStorage[key];
    }
};

// Mock DOM
global.document = {
    readyState: 'complete',
    addEventListener: () => {},
    getElementById: () => null
};

global.window = global;

// Load the script
require('./script.js');

// Test utilities
let testsPassed = 0;
let testsFailed = 0;
const failures = [];

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function assertEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
    }
}

function test(description, testFn) {
    try {
        // Reset before each test
        clearMockStorage();
        window.TodoApp.TodoListManager.tasks = [];
        
        testFn();
        console.log(`✓ ${description}`);
        testsPassed++;
    } catch (error) {
        console.log(`✗ ${description}`);
        console.log(`  ${error.message}`);
        testsFailed++;
        failures.push(description);
    }
}

// Tests
console.log('\n=== TodoListManager Tests ===\n');

console.log('Module Structure:');
test('TodoListManager should have tasks property', () => {
    assert(window.TodoApp.TodoListManager.tasks !== undefined, 'tasks property missing');
    assert(Array.isArray(window.TodoApp.TodoListManager.tasks), 'tasks should be an array');
});

test('TodoListManager should have all required methods', () => {
    assert(typeof window.TodoApp.TodoListManager.generateId === 'function', 'generateId missing');
    assert(typeof window.TodoApp.TodoListManager.validateTaskText === 'function', 'validateTaskText missing');
    assert(typeof window.TodoApp.TodoListManager.syncToStorage === 'function', 'syncToStorage missing');
    assert(typeof window.TodoApp.TodoListManager.loadFromStorage === 'function', 'loadFromStorage missing');
    assert(typeof window.TodoApp.TodoListManager.init === 'function', 'init missing');
    assert(typeof window.TodoApp.TodoListManager.renderTaskList === 'function', 'renderTaskList missing');
});

console.log('\ngenerateId():');
test('should generate unique IDs', () => {
    const id1 = window.TodoApp.TodoListManager.generateId();
    const id2 = window.TodoApp.TodoListManager.generateId();
    assert(id1 !== id2, 'IDs should be unique');
});

test('should return string starting with "task_"', () => {
    const id = window.TodoApp.TodoListManager.generateId();
    assert(typeof id === 'string', 'ID should be a string');
    assert(id.startsWith('task_'), 'ID should start with "task_"');
});

console.log('\nvalidateTaskText():');
test('should accept non-empty strings', () => {
    assert(window.TodoApp.TodoListManager.validateTaskText('Buy groceries') === true, 'Should accept "Buy groceries"');
    assert(window.TodoApp.TodoListManager.validateTaskText('a') === true, 'Should accept "a"');
});

test('should reject empty strings', () => {
    assert(window.TodoApp.TodoListManager.validateTaskText('') === false, 'Should reject empty string');
});

test('should reject whitespace-only strings', () => {
    assert(window.TodoApp.TodoListManager.validateTaskText('   ') === false, 'Should reject spaces');
    assert(window.TodoApp.TodoListManager.validateTaskText('\t') === false, 'Should reject tab');
    assert(window.TodoApp.TodoListManager.validateTaskText('\n') === false, 'Should reject newline');
});

test('should reject non-string inputs', () => {
    assert(window.TodoApp.TodoListManager.validateTaskText(null) === false, 'Should reject null');
    assert(window.TodoApp.TodoListManager.validateTaskText(undefined) === false, 'Should reject undefined');
    assert(window.TodoApp.TodoListManager.validateTaskText(123) === false, 'Should reject number');
});

test('should accept strings with leading/trailing whitespace', () => {
    assert(window.TodoApp.TodoListManager.validateTaskText('  task  ') === true, 'Should trim and accept');
});

console.log('\nsyncToStorage():');
test('should save empty tasks array to Local Storage', () => {
    window.TodoApp.TodoListManager.tasks = [];
    window.TodoApp.TodoListManager.syncToStorage();
    const stored = mockStorage[window.TodoApp.StorageManager.STORAGE_KEYS.TASKS];
    assert(stored === '[]', 'Should store empty array');
});

test('should save tasks array with correct key', () => {
    window.TodoApp.TodoListManager.tasks = [
        { id: '1', text: 'Task 1', completed: false, createdAt: 1695734445000 }
    ];
    window.TodoApp.TodoListManager.syncToStorage();
    const stored = mockStorage[window.TodoApp.StorageManager.STORAGE_KEYS.TASKS];
    assert(stored !== null, 'Storage should have data');
    const parsed = JSON.parse(stored);
    assert(parsed.length === 1, 'Should have 1 task');
    assert(parsed[0].text === 'Task 1', 'Task text should match');
});

test('should save multiple tasks', () => {
    window.TodoApp.TodoListManager.tasks = [
        { id: '1', text: 'Task 1', completed: false, createdAt: 1695734445000 },
        { id: '2', text: 'Task 2', completed: true, createdAt: 1695734446000 }
    ];
    window.TodoApp.TodoListManager.syncToStorage();
    const stored = mockStorage[window.TodoApp.StorageManager.STORAGE_KEYS.TASKS];
    const parsed = JSON.parse(stored);
    assert(parsed.length === 2, 'Should have 2 tasks');
});

console.log('\nloadFromStorage():');
test('should load empty array when storage is empty', () => {
    window.TodoApp.TodoListManager.tasks = [{ id: 'old' }];
    clearMockStorage();
    window.TodoApp.TodoListManager.loadFromStorage();
    assert(window.TodoApp.TodoListManager.tasks.length === 0, 'Should load empty array');
});

test('should load tasks from Local Storage', () => {
    const tasks = [
        { id: '1', text: 'Task 1', completed: false, createdAt: 1695734445000 },
        { id: '2', text: 'Task 2', completed: true, createdAt: 1695734446000 }
    ];
    mockStorage[window.TodoApp.StorageManager.STORAGE_KEYS.TASKS] = JSON.stringify(tasks);
    window.TodoApp.TodoListManager.tasks = [];
    window.TodoApp.TodoListManager.loadFromStorage();
    assert(window.TodoApp.TodoListManager.tasks.length === 2, 'Should load 2 tasks');
    assert(window.TodoApp.TodoListManager.tasks[0].text === 'Task 1', 'First task should match');
});

test('should preserve task object structure', () => {
    const task = {
        id: 'task_1695734445000_abc123',
        text: 'Complete project report',
        completed: true,
        createdAt: 1695734445000
    };
    mockStorage[window.TodoApp.StorageManager.STORAGE_KEYS.TASKS] = JSON.stringify([task]);
    window.TodoApp.TodoListManager.loadFromStorage();
    assertEqual(
        window.TodoApp.TodoListManager.tasks[0],
        task,
        'Task structure should be preserved'
    );
});

console.log('\nStorage Round-Trip (Integration):');
test('should persist and restore task data correctly', () => {
    const taskData = {
        id: window.TodoApp.TodoListManager.generateId(),
        text: 'Integration test task',
        completed: false,
        createdAt: Date.now()
    };
    
    window.TodoApp.TodoListManager.tasks = [taskData];
    window.TodoApp.TodoListManager.syncToStorage();
    window.TodoApp.TodoListManager.tasks = [];
    window.TodoApp.TodoListManager.loadFromStorage();
    
    assert(window.TodoApp.TodoListManager.tasks.length === 1, 'Should have 1 task');
    assertEqual(
        window.TodoApp.TodoListManager.tasks[0],
        taskData,
        'Task should match after round-trip'
    );
});

test('should handle multiple save/load cycles', () => {
    const tasks1 = [{ id: '1', text: 'Task 1', completed: false, createdAt: 1000 }];
    
    window.TodoApp.TodoListManager.tasks = tasks1;
    window.TodoApp.TodoListManager.syncToStorage();
    window.TodoApp.TodoListManager.tasks = [];
    window.TodoApp.TodoListManager.loadFromStorage();
    assertEqual(window.TodoApp.TodoListManager.tasks, tasks1, 'Cycle 1 should match');
    
    const tasks2 = [
        { id: '1', text: 'Task 1', completed: true, createdAt: 1000 },
        { id: '2', text: 'Task 2', completed: false, createdAt: 2000 }
    ];
    window.TodoApp.TodoListManager.tasks = tasks2;
    window.TodoApp.TodoListManager.syncToStorage();
    window.TodoApp.TodoListManager.tasks = [];
    window.TodoApp.TodoListManager.loadFromStorage();
    assertEqual(window.TodoApp.TodoListManager.tasks, tasks2, 'Cycle 2 should match');
});

console.log('\n=== Test Results ===');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);

if (testsFailed > 0) {
    console.log('\nFailed tests:');
    failures.forEach(f => console.log(`  - ${f}`));
    process.exit(1);
} else {
    console.log('\n✓ All tests passed!');
    process.exit(0);
}
