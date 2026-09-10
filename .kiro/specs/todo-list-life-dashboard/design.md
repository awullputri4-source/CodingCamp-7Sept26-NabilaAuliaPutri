# Todo List Life Dashboard - Technical Design Document

## Overview

The Todo List Life Dashboard is a single-page web application that integrates productivity and lifestyle features into a unified interface. The design follows a modular JavaScript architecture with clear separation of concerns, leveraging Local Storage for data persistence and CSS Grid/Flexbox for responsive layout.

**Key Design Principles:**
- Single responsibility per module (Greeting, Timer, TodoList, QuickLinks)
- Local-first architecture with automatic persistence
- Responsive design supporting desktop (>1024px), tablet (768-1024px), and mobile (<768px)
- Clean, semantic HTML with minimal JavaScript coupling
- Progressive enhancement with graceful degradation

---

## Architecture

### Component Structure

The application is organized into five logical modules:

```
TodoListLifeDashboard (Main Application)
├── GreetingManager (Time & Greeting display)
├── PomodoroTimer (Focus timer with controls)
├── TodoListManager (Task CRUD operations)
├── QuickLinksManager (Website shortcuts)
└── StorageManager (Local Storage abstraction)
```

### Data Flow

```
User Interaction (UI Event)
    ↓
Manager Module (Process & Validate)
    ↓
StorageManager (Persist to Local Storage)
    ↓
DOM Renderer (Update UI Display)
    ↓
Visual Feedback to User
```

### Responsibilities

| Module | Purpose |
|--------|---------|
| **GreetingManager** | Track current time, calculate greeting based on time period, update display every second |
| **PomodoroTimer** | Manage 25-minute countdown, handle start/stop/reset, update display, track running state |
| **TodoListManager** | Create, read, update, delete tasks; manage completion status; sync with storage |
| **QuickLinksManager** | Create, read, delete quick links; open URLs in new tabs; sync with storage |
| **StorageManager** | Abstract Local Storage operations (get, set, remove); provide JSON serialization |

---

## Components and Interfaces

### 1. HTML Structure (Semantic Markup)

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List Life Dashboard</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="dashboard-container">
        
        <!-- Header Section: Time & Greeting -->
        <header class="greeting-section" role="banner">
            <div class="greeting-content">
                <h1 class="greeting-text" id="greeting-text">Pagi</h1>
                <div class="time-display">
                    <time class="date-display" id="date-display">Loading...</time>
                    <time class="time-display" id="time-display">Loading...</time>
                </div>
            </div>
        </header>

        <!-- Main Content Grid -->
        <main class="dashboard-grid">
            
            <!-- Pomodoro Timer Section -->
            <section class="timer-section" aria-labelledby="timer-title">
                <h2 id="timer-title" class="section-title">Focus Timer</h2>
                <div class="timer-container">
                    <div class="timer-display" id="timer-display">25:00</div>
                    <div class="timer-controls">
                        <button class="btn btn-primary" id="timer-start" aria-label="Start timer">Start</button>
                        <button class="btn btn-secondary" id="timer-stop" aria-label="Stop timer">Stop</button>
                        <button class="btn btn-tertiary" id="timer-reset" aria-label="Reset timer">Reset</button>
                    </div>
                    <p class="timer-status" id="timer-status">Ready to start</p>
                </div>
            </section>

            <!-- Todo List Section -->
            <section class="todo-section" aria-labelledby="todo-title">
                <h2 id="todo-title" class="section-title">To-Do List</h2>
                
                <div class="todo-input-container">
                    <input 
                        type="text" 
                        id="todo-input" 
                        class="todo-input" 
                        placeholder="Add a new task..."
                        aria-label="New task description"
                    >
                    <button class="btn btn-primary" id="todo-add-btn" aria-label="Add task">Add</button>
                </div>

                <div class="todo-list-wrapper">
                    <ul class="todo-list" id="todo-list" role="list">
                        <!-- Tasks will be inserted here -->
                    </ul>
                    <div class="empty-state" id="todo-empty-state">
                        <p>Tidak ada tugas</p>
                    </div>
                </div>
            </section>

            <!-- Quick Links Section -->
            <section class="quick-links-section" aria-labelledby="quick-links-title">
                <h2 id="quick-links-title" class="section-title">Quick Links</h2>
                
                <div class="quick-links-input-container">
                    <input 
                        type="text" 
                        id="quick-link-name" 
                        class="quick-link-input" 
                        placeholder="Site name..."
                        aria-label="Website name"
                    >
                    <input 
                        type="url" 
                        id="quick-link-url" 
                        class="quick-link-input" 
                        placeholder="https://..."
                        aria-label="Website URL"
                    >
                    <button class="btn btn-primary" id="quick-link-add-btn" aria-label="Add quick link">Add</button>
                </div>

                <div class="quick-links-wrapper">
                    <div class="quick-links-grid" id="quick-links-grid">
                        <!-- Quick links will be inserted here -->
                    </div>
                    <div class="empty-state" id="quick-links-empty-state">
                        <p>Belum ada quick links</p>
                    </div>
                </div>
            </section>

        </main>
    </div>

    <script src="js/script.js"></script>
</body>
</html>
```

### 2. Component Specifications

#### GreetingManager Interface

```javascript
{
    // Properties
    currentTime: Date,              // Current date and time
    greetingPeriod: String,         // 'Pagi', 'Siang', 'Sore', 'Malam'
    updateInterval: number,         // Milliseconds between updates (1000ms)

    // Public Methods
    init(): void,                   // Initialize greeting display and time update loop
    start(): void,                  // Begin updating time display
    stop(): void,                   // Stop updating time display
    getGreeting(hour: number): String,  // Calculate greeting based on hour (0-23)
    updateDisplay(): void,          // Update both time and greeting display
    
    // Private Methods
    formatDate(date: Date): String,     // Format: "Wednesday, September 26, 2024"
    formatTime(date: Date): String,     // Format: "14:30:45" (24-hour)
    updateGreetingDisplay(): void,      // Update greeting text element
    updateTimeDisplay(): void,          // Update date and time elements
}
```

#### PomodoroTimer Interface

```javascript
{
    // Properties
    totalSeconds: number,           // Total duration: 1500 (25 * 60)
    remainingSeconds: number,       // Current countdown value
    isRunning: boolean,             // Timer state
    intervalId: number | null,      // setInterval handle
    
    // Public Methods
    init(): void,                   // Initialize timer display and attach event listeners
    start(): void,                  // Begin countdown
    stop(): void,                   // Pause countdown
    reset(): void,                  // Return to 25:00 and stop
    
    // Private Methods
    tick(): void,                   // Decrement counter and update display
    formatDisplay(seconds: number): String,  // Format: "MM:SS" (e.g., "05:03")
    updateDisplay(): void,          // Render display and button states
    updateButtonStates(): void,     // Enable/disable buttons based on state
    onTimerComplete(): void,        // Handle completion (beep, notification)
}
```

#### TodoListManager Interface

```javascript
{
    // Properties
    tasks: Array<Task>,             // Array of task objects
    
    // Task Object Structure
    // {
    //   id: string (uuid),
    //   text: string,
    //   completed: boolean,
    //   createdAt: number (timestamp)
    // }
    
    // Public Methods
    init(): void,                   // Load tasks from storage and render
    addTask(text: string): boolean, // Add new task, return success
    updateTask(id: string, text: string): void,  // Update task description
    toggleTask(id: string): void,   // Toggle completion status
    deleteTask(id: string): void,   // Remove task from list
    renderTaskList(): void,         // Render all tasks to DOM
    
    // Private Methods
    generateId(): string,           // Generate unique task ID
    createTaskElement(task: Task): HTMLElement,  // Create DOM element for single task
    validateTaskText(text: string): boolean,     // Check non-empty and not whitespace
    syncToStorage(): void,          // Save tasks to Local Storage
    loadFromStorage(): void,        // Load tasks from Local Storage
}
```

#### QuickLinksManager Interface

```javascript
{
    // Properties
    links: Array<QuickLink>,        // Array of quick link objects
    
    // QuickLink Object Structure
    // {
    //   id: string (uuid),
    //   name: string,
    //   url: string,
    //   createdAt: number (timestamp)
    // }
    
    // Public Methods
    init(): void,                   // Load links from storage and render
    addLink(name: string, url: string): boolean,  // Add new link, return success
    deleteLink(id: string): void,   // Remove link from list
    openLink(id: string): void,     // Open URL in new tab
    renderLinks(): void,            // Render all links to DOM
    
    // Private Methods
    generateId(): string,           // Generate unique link ID
    createLinkElement(link: QuickLink): HTMLElement,  // Create DOM element
    validateUrl(url: string): boolean,     // Validate URL format
    normalizeUrl(url: string): string,     // Add https:// if missing
    syncToStorage(): void,          // Save links to Local Storage
    loadFromStorage(): void,        // Load links from Local Storage
}
```

#### StorageManager Interface

```javascript
{
    // Constants
    STORAGE_KEYS: {
        TASKS: 'todolist_tasks',
        QUICK_LINKS: 'todolist_quicklinks'
    }
    
    // Public Methods
    get(key: string): object | null,        // Retrieve and parse JSON
    set(key: string, value: object): void,  // Serialize and store JSON
    remove(key: string): void,              // Delete storage entry
    clear(): void,                          // Clear all application data
    
    // Utility Methods
    isAvailable(): boolean,         // Check if Local Storage is accessible
}
```

---

## Data Models

### Task Object

```javascript
{
    id: "uuid-1234-5678",          // Unique identifier
    text: "Complete project report",// Task description
    completed: false,               // Completion status
    createdAt: 1695734445000       // Timestamp (milliseconds)
}
```

### QuickLink Object

```javascript
{
    id: "uuid-9999-1111",          // Unique identifier
    name: "GitHub",                 // Display name
    url: "https://github.com",      // Full URL
    createdAt: 1695734445000       // Timestamp (milliseconds)
}
```

### Application State

```javascript
{
    tasks: [
        { id: "1", text: "Task 1", completed: true, createdAt: 1695734445000 },
        { id: "2", text: "Task 2", completed: false, createdAt: 1695734446000 }
    ],
    quickLinks: [
        { id: "a", name: "Google", url: "https://google.com", createdAt: 1695734445000 },
        { id: "b", name: "GitHub", url: "https://github.com", createdAt: 1695734446000 }
    ],
    timer: {
        remainingSeconds: 1500,
        isRunning: false
    },
    greeting: {
        currentPeriod: "Pagi",
        lastUpdated: 1695734445000
    }
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

This feature involves multiple pure functions (time formatting, task validation, URL normalization) and critical state transformations (task list updates, local storage persistence). Property-based testing is appropriate for validating universal correctness properties across these functions.

### Property 1: Time Display Format Consistency

*For any* timestamp, when the time display is updated, the format SHALL always be "HH:MM:SS" with two-digit zero-padded hours, minutes, and seconds.

**Validates: Requirements 1.2**

### Property 2: Date Display Format Consistency

*For any* date object, the formatted date SHALL follow "dddd, MMMM DD, YYYY" format with the correct day name for that date.

**Validates: Requirements 1.1**

### Property 3: Greeting Period Round-Trip

*For any* hour value (0-23), the greeting assigned to that hour SHALL remain consistent when queried multiple times without intervening state changes.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 4: Task Persistence Round-Trip

*For any* valid task object, when added to the list and persisted to Local Storage, then reloaded from storage, the task data SHALL be identical (same id, text, completed status).

**Validates: Requirements 7, 12.1, 12.2, 12.3, 12.4, 12.5**

### Property 5: Task Completion Toggle Idempotence

*For any* task, toggling the completion status twice SHALL return the task to its original state before the first toggle.

**Validates: Requirements 9.1, 9.4**

### Property 6: Whitespace-Only Task Rejection

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines), attempting to add it as a task SHALL fail and the task list length SHALL remain unchanged.

**Validates: Requirements 7.5**

### Property 7: Quick Link URL Normalization

*For any* URL entered without a protocol, the normalized URL SHALL have "https://" prepended before storage.

**Validates: Requirements 13, 17.1**

### Property 8: Quick Link Persistence Round-Trip

*For any* valid quick link object, when added and persisted to Local Storage, then reloaded from storage, the link data SHALL be identical (same id, name, normalized url).

**Validates: Requirements 13, 14, 17.1, 17.3**

### Property 9: Timer Display Countdown

*For any* countdown state, when the timer is running, the displayed time SHALL decrease by exactly one second every 1000 milliseconds.

**Validates: Requirements 4.2**

### Property 10: Timer Reset to Initial State

*For any* timer state (running or stopped, any remaining seconds), when reset is called, the remaining seconds SHALL immediately return to 1500 (25:00) and the running state SHALL become false.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 11: Empty Task List Validation

*For any* application instance with no tasks, the UI SHALL display the empty state message "Tidak ada tugas" and the task list container SHALL be empty.

**Validates: Requirements 8.5**

### Property 12: Empty Quick Links Validation

*For any* application instance with no quick links, the UI SHALL display the empty state message "Belum ada quick links" and the quick links container SHALL be empty.

**Validates: Requirements 14.4**

---

## Error Handling

### Input Validation

| Component | Input | Validation | Response |
|-----------|-------|-----------|----------|
| **TodoListManager** | Task text | Non-empty, not only whitespace | Show inline validation message, prevent addition |
| **QuickLinksManager** | Site name | Non-empty string | Show validation message, prevent addition |
| **QuickLinksManager** | URL | Valid format or parseable | Normalize and validate, show error if invalid |
| **StorageManager** | Local Storage access | Check availability | Fallback to in-memory storage, warn user |

### Error Scenarios

1. **Local Storage Unavailable** (Private/Incognito Mode)
   - Detection: Try-catch on storage access
   - Fallback: Use in-memory arrays, warn user about session loss
   - User Impact: Application works but loses data on refresh

2. **Invalid Task Input**
   - Empty string → Prevent addition, show "Task cannot be empty"
   - Whitespace only → Prevent addition, show "Task must contain text"
   - Special characters → Accept, escape on render

3. **Invalid URL**
   - Missing protocol → Add "https://"
   - Invalid format → Warn user, do not save
   - Server not responding → Still add link (user will see error on click)

4. **Timer Edge Cases**
   - Rapid start/stop clicks → Debounce, ignore duplicate clicks
   - Browser blur/focus → Timer continues running in background
   - Low system resources → May cause slight timing drift (acceptable)

---

## Testing Strategy

### Unit Tests (Example-Based)

Test specific behaviors with concrete examples:

1. **GreetingManager**
   - Test greeting display: hour 8 → "Pagi", hour 13 → "Siang", etc.
   - Test date format with known date (e.g., Sept 26, 2024 → "Wednesday, September 26, 2024")

2. **PomodoroTimer**
   - Test start/stop state transitions
   - Test reset always returns to "25:00"
   - Test button enable/disable based on state

3. **TodoListManager**
   - Test adding valid task creates element with correct text
   - Test completing task adds "completed" class
   - Test empty state message appears/disappears correctly

4. **QuickLinksManager**
   - Test adding link opens in new tab (verify window.open call)
   - Test deleting link removes element from DOM
   - Test empty state message appears when no links

5. **StorageManager**
   - Test get/set with known data
   - Test clear removes all data
   - Test unavailable storage handled gracefully

### Property-Based Tests

Validate universal properties across many generated inputs using a PBT library (Hypothesis for Python, fast-check for JavaScript, or similar):

1. **Time Formatting Properties** (Property 1, 2)
   - Generate random timestamps → Format → Verify format matches regex "HH:MM:SS"
   - Generate random dates → Format → Verify day name matches Intl.DateTimeFormat

2. **Greeting Consistency Property** (Property 3)
   - Generate hour values (0-23) → Get greeting → Query again → Must match
   - Generate transitions (e.g., 10:59 → 11:00) → Verify greeting changes

3. **Task Persistence Properties** (Property 4, 5, 6)
   - Generate random task objects → Add → Save → Reload → Verify identical
   - Generate valid tasks → Toggle twice → Verify original state
   - Generate strings of whitespace → Try to add → Verify list unchanged

4. **Timer Properties** (Property 9, 10)
   - Generate random start times → Run for fixed intervals → Verify countdown
   - Generate random timer states → Reset → Verify always 25:00 and stopped

5. **Quick Link Properties** (Property 7, 8)
   - Generate URLs with/without protocol → Normalize → Verify https:// present
   - Generate quick links → Save → Reload → Verify data identical

### Integration Tests

Test end-to-end workflows:

1. User adds task → Task appears in list → Page reloaded → Task still exists
2. User starts timer → Timer counts down → User stops → Resume from paused time
3. User adds quick link → Clicks link → New tab opens with correct URL
4. User completes multiple tasks → Marks completed → Saves to storage → Clears all → Empty state shown

### Configuration

- **Minimum Property Test Iterations**: 100 per property
- **Test Framework**: Jest (unit/integration) + fast-check (property-based)
- **Coverage Target**: >85% for critical functions (timer, storage, validation)

---

## Folder Structure

```
todo-list-life-dashboard/
├── index.html              # Main HTML file with semantic markup
├── css/
│   └── style.css           # All styling (responsive, component styles)
├── js/
│   └── script.js           # All JavaScript (modules, managers, initialization)
├── .kiro/
│   └── specs/
│       └── todo-list-life-dashboard/
│           ├── requirements.md
│           └── design.md
└── README.md               # Documentation
```

**Key Design Decision**: Single CSS and single JavaScript file for simplicity and ease of deployment, with clear module organization within script.js using object literals and IIFE patterns.

---

## Responsive Design Strategy

### Layout Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| **Mobile** | < 768px | Single column, vertical stack |
| **Tablet** | 768px - 1024px | 2-column grid (greeting spans full width) |
| **Desktop** | > 1024px | 2x2 grid with optimized spacing |

### CSS Grid Layout

```css
/* Desktop: 2 columns, greeting full width */
@media (min-width: 1025px) {
    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    .greeting-section {
        grid-column: 1 / -1;
    }
}

/* Tablet: Flexible 2-column with responsive wrapping */
@media (min-width: 768px) and (max-width: 1024px) {
    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }
}

/* Mobile: Single column, stacked vertically */
@media (max-width: 767px) {
    .dashboard-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
}
```

### Touch-Friendly Design (Mobile)

- Button minimum size: 44x44px (touch target)
- Input fields: Larger padding for easy tapping
- Scrollable task/link lists on mobile with overflow handling

---

## Visual Design Specifications

### Color Palette

- **Primary**: #007AFF (Actions, focus states)
- **Secondary**: #34C759 (Success, completed tasks)
- **Accent**: #FF9500 (Warnings, active timer)
- **Text**: #1C1C1E (Primary), #8E8E93 (Secondary)
- **Background**: #FFFFFF (Light), #F5F5F7 (Subtle)
- **Border**: #E5E5EA (Dividers)

### Typography

- **Heading**: 24px, 600 weight (section titles)
- **Body**: 16px, 400 weight (default text)
- **Small**: 12px, 400 weight (helper text, timestamps)
- **Monospace**: 14px (timer display, code examples)

### Component Spacing

- Section padding: 1.5rem
- Gap between components: 2rem (desktop), 1.5rem (tablet/mobile)
- Button padding: 0.75rem 1.5rem
- Input padding: 0.75rem 1rem

### Visual States

- **Hover**: 0.3s transition, slight shadow elevation
- **Active**: Darker background, visible focus ring
- **Disabled**: 0.5 opacity, cursor not-allowed
- **Focus**: 2px solid #007AFF ring
- **Completed Task**: Strikethrough text, 0.6 opacity, secondary color

---

## Implementation Notes

### Performance Considerations

1. **Timer Updates**: Use `setInterval` with 1000ms precision (not animation frame)
2. **DOM Updates**: Batch updates where possible; use DocumentFragment for multiple insertions
3. **Storage Access**: Debounce writes to Local Storage (save after 500ms of inactivity)
4. **Event Listeners**: Attach once to parent (event delegation) rather than per item

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge latest 2 versions)
- Local Storage support required (no fallback for this MVP)
- CSS Grid and Flexbox supported
- ES6+ JavaScript (no transpilation)

### Accessibility (WCAG 2.1 Level AA)

- Semantic HTML (`<header>`, `<main>`, `<section>`, `<time>`)
- ARIA labels on buttons and inputs
- Color contrast: 4.5:1 for text
- Focus management: Visible focus ring on all interactive elements
- Form labels associated with inputs
- Empty state messages clearly communicated

---

## Summary

This design provides a robust foundation for the Todo List Life Dashboard with:

✅ Clear separation of concerns through modular JavaScript architecture
✅ Semantic HTML enabling accessibility and SEO
✅ Responsive design supporting all device sizes
✅ Local Storage-based persistence without server dependency
✅ Property-based testing approach for correctness validation
✅ Comprehensive error handling and input validation
✅ Production-ready documentation for implementation

The architecture is extensible: additional managers can be added (e.g., NotificationManager, AnalyticsManager) without modifying core application logic.
