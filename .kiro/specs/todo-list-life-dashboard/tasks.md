# Implementation Plan: Todo List Life Dashboard

## Overview

Implementation akan mengikuti urutan: foundational setup → component modules → HTML structure → styling responsif → integration dan testing. Setiap task membangun di atas yang sebelumnya dengan clear success criteria.

---

## Tasks

### Phase 1: Project Setup & Core Modules

- [x] 1. Setup project structure dan StorageManager foundation
  - Create folder structure: `index.html`, `css/style.css`, `js/script.js`
  - Initialize `script.js` dengan IIFE pattern dan module exports
  - Implement StorageManager dengan methods: `get()`, `set()`, `remove()`, `clear()`, `isAvailable()`
  - Add storage key constants: `STORAGE_KEYS.TASKS`, `STORAGE_KEYS.QUICK_LINKS`
  - _Requirements: 19.1, 19.3_

### Phase 2: HTML & Semantic Structure

- [x] 2. Implement semantic HTML structure dengan accessibility
  - Create complete HTML file dengan doctype, meta tags, semantic sections
  - Build greeting section dengan time dan date display elements
  - Build timer section dengan display area dan control buttons (Start, Stop, Reset)
  - Build todo list section dengan input field dan task list container
  - Build quick links section dengan input fields (name, URL) dan links grid
  - Add proper `aria-label`, `aria-labelledby`, `role` attributes
  - Include empty state divs untuk todo list dan quick links
  - Verify semantic markup dengan h2 titles dan proper heading hierarchy
  - _Requirements: 1, 2, 3, 7, 8, 13, 14, 18, 19.3_

### Phase 3: CSS Styling & Responsive Design

- [x] 3. Implement base CSS styles dan typography
  - Setup CSS reset dan base styles
  - Define color palette: primary (#007AFF), secondary (#34C759), accent (#FF9500)
  - Configure typography: headings (24px, 600w), body (16px, 400w), small (12px)
  - Setup monospace font untuk timer display
  - Define component spacing variables (padding, gaps, margins)
  - Style dashboard-container dengan max-width dan centering
  - _Requirements: 19, 18_

- [x] 4. Implement greeting section styling
  - Style greeting-section sebagai header dengan banner background
  - Create greeting-text styling dengan large, prominent typography
  - Style time-display dengan flexbox layout untuk date dan time
  - Add hover states dan transitions
  - _Requirements: 1, 2_

- [x] 5. Implement timer section styling
  - Style timer-display dengan monospace font, large size (60px+), bold weight
  - Create timer-controls button layout dengan flexbox
  - Style buttons: Start (primary), Stop (secondary), Reset (tertiary)
  - Add button states: hover, active, disabled
  - Style timer-status text untuk menunjukkan state ("Ready to start", "Running", "Paused")
  - _Requirements: 3, 4, 5, 6_

- [x] 6. Implement todo list section styling
  - Style todo-input-container dengan flexbox layout
  - Style input field dengan proper padding dan border-radius
  - Style Add button consistency dengan design system
  - Style todo-list dengan ul/li semantic markup
  - Create task item styling dengan checkbox area dan action buttons
  - Style completed task dengan strikethrough dan reduced opacity (0.6)
  - Style empty state message untuk "Tidak ada tugas"
  - _Requirements: 7, 8, 9, 10, 11_

- [x] 7. Implement quick links section styling
  - Style quick-links-input-container untuk dual inputs
  - Style quick-link-grid dengan responsive flex/grid layout
  - Create quick link card styling dengan name dan delete button
  - Style empty state message untuk "Belum ada quick links"
  - Add hover effects untuk quick link buttons
  - _Requirements: 13, 14, 15, 16_

- [x] 8. Implement responsive layout breakpoints
  - Desktop (>1024px): 2-column grid, greeting full width, 2rem gaps
  - Tablet (768-1024px): 2-column grid dengan wrap, 1.5rem gaps
  - Mobile (<768px): Single column vertical stack, 1.5rem gaps
  - Implement CSS Grid dengan proper `grid-template-columns` dan `grid-template-areas`
  - Ensure all sections reflow correctly pada setiap breakpoint
  - Add mobile-first CSS media queries `@media (min-width: ...)`
  - Test button dan input minimum size 44x44px untuk touch targets
  - _Requirements: 18_

- [x] 9. Checkpoint - Verify all CSS complete dan layout responsive
  - Test desktop view (>1024px) menampilkan 2-column layout
  - Test tablet view (768-1024px) dengan proper reflow
  - Test mobile view (<768px) single column vertical
  - Verify all sections visible dan readable di semua breakpoints
  - Check color contrast ratio 4.5:1 untuk text
  - Ask the user if questions arise

### Phase 4: GreetingManager Module

- [x] 10. Implement GreetingManager module
  - Create GreetingManager object dengan properties: currentTime, greetingPeriod, updateInterval
  - Implement `getGreeting(hour)` function:
    - 4:00-10:59 → "Pagi"
    - 11:00-14:59 → "Siang"
    - 15:00-18:59 → "Sore"
    - 19:00-03:59 → "Malam"
  - Implement `formatDate(date)` function menghasilkan "dddd, MMMM DD, YYYY" format
  - Implement `formatTime(date)` function menghasilkan "HH:MM:SS" format 24-hour
  - Implement `updateDisplay()` method update greeting-text, date-display, time-display
  - Implement `init()` method attach listeners dan start update loop
  - Implement `start()` method begin `setInterval` dengan 1000ms interval
  - Implement `stop()` method clear interval
  - _Requirements: 1, 2_

- [~] 11. Property test: Time Display Format Consistency*
  - **Property 1: Time Display Format Consistency**
  - **Validates: Requirements 1.2**
  - Generate random timestamps (0-86400 seconds per day)
  - Format time → Verify output matches regex `\d{2}:\d{2}:\d{2}`
  - Verify hours in range 00-23, minutes 00-59, seconds 00-59
  - Test edge cases: midnight (00:00:00), noon (12:00:00), end-of-day (23:59:59)

- [~] 12. Property test: Date Display Format Consistency*
  - **Property 2: Date Display Format Consistency**
  - **Validates: Requirements 1.1**
  - Generate random dates across different months dan years
  - Format date → Verify follows "dddd, MMMM DD, YYYY" pattern
  - Verify day name matches actual day (e.g., Sept 26, 2024 = "Wednesday")
  - Test edge cases: leap year dates, month boundaries

- [~] 13. Property test: Greeting Period Round-Trip*
  - **Property 3: Greeting Period Round-Trip**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
  - Generate hour values 0-23
  - Call `getGreeting(hour)` → Query again → Must match
  - Test all hour ranges return correct greeting
  - Test boundary hours (3:59→"Malam", 4:00→"Pagi", etc.)

- [~] 14. Unit test: Greeting update on time change*
  - Test that when time crosses greeting boundary, greeting updates
  - Example: 10:59 (Pagi) → 11:00 (Siang)
  - Verify `getGreeting()` returns correct value after boundary
  - _Requirements: 2.5_

### Phase 5: PomodoroTimer Module

- [x] 15. Implement PomodoroTimer module
  - Create PomodoroTimer object dengan properties: totalSeconds (1500), remainingSeconds, isRunning, intervalId
  - Implement `formatDisplay(seconds)` menghasilkan "MM:SS" format (e.g., "25:00", "05:03")
  - Implement `updateDisplay()` method render timer-display dengan formatted time
  - Implement `updateButtonStates()` method enable/disable Start, Stop buttons based on state
  - Implement `start()` method begin countdown dengan `setInterval(tick, 1000)`
  - Implement `tick()` method decrement remainingSeconds, call updateDisplay(), check completion
  - Implement `stop()` method pause countdown (clear interval, set isRunning=false)
  - Implement `reset()` method set remainingSeconds=1500, isRunning=false, clear interval, updateDisplay()
  - Implement `init()` method attach event listeners ke buttons, initialize display
  - _Requirements: 3, 4, 5, 6_

- [~] 16. Property test: Timer Display Countdown*
  - **Property 9: Timer Display Countdown**
  - **Validates: Requirements 4.2**
  - Start timer dari various remaining times (1500, 300, 60)
  - Measure that displayed time decreases by 1 setiap 1000ms
  - Run timer untuk 5 seconds, verify exactly 5 seconds counted down
  - Test formatDisplay() output consistency

- [~] 17. Property test: Timer Reset to Initial State*
  - **Property 10: Timer Reset to Initial State**
  - **Validates: Requirements 6.1, 6.2, 6.3**
  - Set timer ke various states: running with 500 seconds, stopped with 1200 seconds
  - Call reset() → remainingSeconds MUST equal 1500, isRunning MUST be false
  - Test display shows "25:00" after reset
  - Verify buttons enabled untuk start

- [~] 18. Unit test: Timer state transitions*
  - Test start() changes isRunning to true
  - Test stop() changes isRunning to false
  - Test reset() always returns to initial state
  - Test button states reflect current timer state
  - _Requirements: 4, 5, 6_

- [~] 19. Checkpoint - Timer functionality complete
  - Ensure timer counts down correctly setiap second
  - Verify display format correct (MM:SS)
  - Test all buttons (Start, Stop, Reset) bekerja
  - Verify timer state transitions smooth
  - Ask the user if questions arise

### Phase 6: TodoListManager Module

- [x] 20. Implement TodoListManager module - basic structure
  - Create TodoListManager object dengan property: tasks = []
  - Implement `generateId()` menggunakan timestamp + random (uuid alternative)
  - Implement `validateTaskText(text)` check non-empty, not only whitespace
  - Implement `syncToStorage()` save tasks array ke Local Storage
  - Implement `loadFromStorage()` restore tasks dari Local Storage
  - Implement `init()` call loadFromStorage() dan renderTaskList()
  - _Requirements: 7, 8, 12_

- [~] 21. Implement TodoListManager module - CRUD operations
  - Implement `addTask(text)` method:
    - Validate text dengan validateTaskText()
    - Create task object: { id, text, completed: false, createdAt: timestamp }
    - Push ke tasks array
    - Call syncToStorage() dan renderTaskList()
    - Return success boolean
  - Implement `toggleTask(id)` method flip completed status, syncToStorage(), renderTaskList()
  - Implement `deleteTask(id)` method remove dari array, syncToStorage(), renderTaskList()
  - Implement `updateTask(id, text)` method update task text, syncToStorage(), renderTaskList()
  - _Requirements: 7, 9, 10, 11_

- [~] 22. Implement TodoListManager module - DOM rendering
  - Implement `createTaskElement(task)` return HTMLElement dengan:
    - Checkbox input untuk completion toggle
    - Task text display (strikethrough jika completed)
    - Edit button
    - Delete button
    - Event listeners untuk semua interaksi
  - Implement `renderTaskList()` method:
    - Clear todo-list ul
    - Show/hide empty state based on tasks.length
    - Render setiap task dengan createTaskElement()
    - Add li elements ke ul dengan role="listitem"
  - Handle completed task styling (strikethrough, opacity 0.6)
  - _Requirements: 8, 9, 10, 11_

- [~] 23. Implement TodoListManager module - edit mode
  - Add edit mode UI: inline input field dengan Save/Cancel buttons
  - Implement edit mode toggle pada Edit button click
  - Handle Enter key untuk save, Escape untuk cancel
  - Update task text pada save
  - Restore display view setelah edit complete
  - _Requirements: 10_

- [~] 24. Property test: Task Persistence Round-Trip*
  - **Property 4: Task Persistence Round-Trip**
  - **Validates: Requirements 7, 12.1, 12.2, 12.3, 12.4, 12.5**
  - Generate random task objects (id, text, completed, timestamp)
  - Add to tasks array → syncToStorage() → loadFromStorage() → Verify identical
  - Test data serialization/deserialization correct
  - Test dengan multiple tasks

- [~] 25. Property test: Task Completion Toggle Idempotence*
  - **Property 5: Task Completion Toggle Idempotence**
  - **Validates: Requirements 9.1, 9.4**
  - Generate random task dengan completed=false
  - Call toggleTask() → toggleTask() → completed MUST return to false
  - Test dengan completed=true initial state
  - Verify visual changes (strikethrough) apply dan remove correctly

- [~] 26. Property test: Whitespace-Only Task Rejection*
  - **Property 6: Whitespace-Only Task Rejection**
  - **Validates: Requirements 7.5**
  - Generate strings: "", " ", "\t", "\n", "   \t\n  "
  - Attempt addTask() dengan setiap string
  - Verify tasks.length unchanged setelah attempt
  - Verify validation message displayed (optional)

- [~] 27. Property test: Empty Task List Validation*
  - **Property 11: Empty Task List Validation**
  - **Validates: Requirements 8.5**
  - Clear all tasks (tasks = [])
  - Call renderTaskList()
  - Verify empty state message "Tidak ada tugas" displayed
  - Verify todo-list ul empty (no li children)

- [~] 28. Unit test: TodoListManager operations*
  - Test addTask() dengan valid text
  - Test deleteTask() removes correct task
  - Test toggleTask() flips completion
  - Test updateTask() updates text
  - Test that invalid input rejected
  - Test empty state message visibility
  - _Requirements: 7, 8, 9, 10, 11_

- [~] 29. Checkpoint - Todo list functionality complete
  - Test adding task displays immediately
  - Test completing task shows strikethrough
  - Test editing task updates correctly
  - Test deleting task removes from list
  - Test empty state shows when no tasks
  - Verify Local Storage persistence (add task, refresh page, task still there)
  - Ask the user if questions arise

### Phase 7: QuickLinksManager Module

- [x] 30. Implement QuickLinksManager module - basic structure
  - Create QuickLinksManager object dengan property: links = []
  - Implement `generateId()` menggunakan timestamp + random
  - Implement `validateUrl(url)` check format (contain http/https or parseable)
  - Implement `normalizeUrl(url)` add "https://" jika missing protocol
  - Implement `syncToStorage()` save links array ke Local Storage
  - Implement `loadFromStorage()` restore links dari Local Storage
  - Implement `init()` call loadFromStorage() dan renderLinks()
  - _Requirements: 13, 14, 17_

- [~] 31. Implement QuickLinksManager module - CRUD operations
  - Implement `addLink(name, url)` method:
    - Validate name (non-empty)
    - Validate url dengan validateUrl()
    - Normalize url dengan normalizeUrl()
    - Create link object: { id, name, url, createdAt: timestamp }
    - Push ke links array
    - Call syncToStorage() dan renderLinks()
    - Return success boolean
  - Implement `deleteLink(id)` method remove dari array, syncToStorage(), renderLinks()
  - Implement `openLink(id)` method window.open(url, '_blank')
  - _Requirements: 13, 15, 16_

- [~] 32. Implement QuickLinksManager module - DOM rendering
  - Implement `createLinkElement(link)` return HTMLElement dengan:
    - Link name display
    - Clickable area untuk open link
    - Delete button
    - Event listeners
  - Implement `renderLinks()` method:
    - Clear quick-links-grid
    - Show/hide empty state based on links.length
    - Render setiap link dengan createLinkElement()
  - _Requirements: 14, 15, 16_

- [~] 33. Property test: Quick Link URL Normalization*
  - **Property 7: Quick Link URL Normalization**
  - **Validates: Requirements 13, 17.1**
  - Generate URLs: "google.com", "github.com", "https://example.com", "http://site.org"
  - Normalize setiap → Verify "https://" prepended jika missing
  - Verify URLs dengan protocol unchanged
  - Test edge cases

- [~] 34. Property test: Quick Link Persistence Round-Trip*
  - **Property 8: Quick Link Persistence Round-Trip**
  - **Validates: Requirements 13, 14, 17.1, 17.3**
  - Generate random quick link objects (id, name, normalized url, timestamp)
  - Add → syncToStorage() → loadFromStorage() → Verify identical
  - Test serialization correct
  - Test multiple links

- [~] 35. Property test: Empty Quick Links Validation*
  - **Property 12: Empty Quick Links Validation**
  - **Validates: Requirements 14.4**
  - Clear all links (links = [])
  - Call renderLinks()
  - Verify empty state message "Belum ada quick links" displayed
  - Verify quick-links-grid empty (no children)

- [~] 36. Unit test: QuickLinksManager operations*
  - Test addLink() dengan valid name dan URL
  - Test deleteLink() removes correct link
  - Test openLink() calls window.open() dengan correct URL
  - Test URL normalization (add https://)
  - Test invalid input rejected
  - Test empty state message visibility
  - _Requirements: 13, 14, 15, 16_

- [~] 37. Checkpoint - Quick links functionality complete
  - Test adding quick link displays immediately
  - Test clicking quick link opens in new tab
  - Test deleting quick link removes from list
  - Test empty state shows when no links
  - Verify Local Storage persistence
  - Verify URL normalization working
  - Ask the user if questions arise

### Phase 8: Application Integration

- [~] 38. Implement application initialization
  - Create main initialization function dalam IIFE
  - Call GreetingManager.init()
  - Call PomodoroTimer.init()
  - Call TodoListManager.init()
  - Call QuickLinksManager.init()
  - Verify all modules initialized saat DOM ready
  - Add error handling untuk storage unavailability
  - _Requirements: 1, 2, 3, 7, 8, 13, 14_

- [~] 39. Implement event delegation dan proper cleanup
  - Ensure event listeners properly attached via delegation where possible
  - Use data attributes untuk identify task/link IDs
  - Implement cleanup untuk intervals (timer) pada app unload
  - Test no memory leaks dari repeated dom manipulations
  - _Requirements: 19_

- [~] 40. Implement Local Storage error handling
  - Wrap StorageManager operations dalam try-catch
  - Check `isAvailable()` before attempting storage
  - Provide fallback ke in-memory storage jika unavailable
  - Display warning message ke user jika storage unavailable
  - Ensure app still functional dalam fallback mode
  - _Requirements: 12, 13, 17_

### Phase 9: Integration Testing

- [~] 41. Integration test: Complete user workflow*
  - Test end-to-end workflow:
    1. User adds task → Display immediately
    2. User completes task → Strikethrough applied
    3. Refresh page → Task still visible dengan completion state
    4. User adds quick link → Displays immediately
    5. User clicks quick link → Opens new tab
    6. Timer starts → Counts down correctly
    7. All data persists dalam Local Storage
  - _Requirements: 1-17_

- [~] 42. Integration test: Data persistence workflow*
  - Test localStorage persistence across page refresh
  - Add 3 tasks dan 2 quick links
  - Refresh page
  - Verify all data restored exactly
  - Complete 1 task, refresh
  - Verify completion state persisted
  - Delete 1 quick link, refresh
  - Verify deletion persisted
  - _Requirements: 12, 17_

- [~] 43. Integration test: Timer in background*
  - Start timer
  - Switch tabs/minimize browser (simulate blur event)
  - Wait 5 seconds
  - Return to app
  - Verify timer continued counting (not pause)
  - _Requirements: 4.4_

- [~] 44. Integration test: Responsive layout verification*
  - Test desktop view (>1024px): 2-column layout correct
  - Test tablet view (768-1024px): 2-column wrap correct
  - Test mobile view (<768px): Single column correct
  - Verify all features accessible dan functional at each breakpoint
  - _Requirements: 18_

- [~] 45. Checkpoint - All integration tests pass
  - Ensure all integration tests passing
  - Verify no console errors
  - Test in multiple browsers (Chrome, Firefox, Safari if available)
  - Verify responsive design at all breakpoints
  - Ask the user if questions arise

### Phase 10: Final Testing & Documentation

- [~] 46. Run full property test suite*
  - Execute all property-based tests
  - Verify minimum 100 iterations per property
  - Ensure all properties passing
  - Check for any edge case failures
  - Document any anomalies

- [~] 47. Run full unit test suite*
  - Execute all unit tests
  - Verify >85% code coverage untuk critical functions
  - Ensure all tests passing
  - Verify proper error handling tested

- [~] 48. Accessibility audit*
  - Verify all interactive elements have aria labels
  - Check color contrast ratio (4.5:1 minimum)
  - Test keyboard navigation (Tab, Enter, Escape keys work)
  - Verify semantic HTML used correctly
  - Test dalam screen reader jika available
  - _Requirements: 19, 18_

- [~] 49. Final code review dan cleanup
  - Review JavaScript code untuk clean code principles
  - Verify consistent naming (camelCase for JS, kebab-case for CSS classes)
  - Check for commented code, remove if not needed
  - Add meaningful comments untuk complex logic
  - Verify all TODOs/FIXMEs resolved
  - _Requirements: 19_

- [~] 50. Final checkpoint - Application complete
  - Verify all requirements mapped ke tasks
  - Ensure all test suites passing
  - Confirm responsive design working
  - Test performance (timer accuracy, no lag)
  - Create README dengan setup instructions
  - Ask the user if questions arise

---

## Notes

- Tasks marked dengan `*` adalah optional testing tasks dan dapat di-skip untuk MVP lebih cepat
- Setiap task referensi specific requirements untuk traceability
- Property-based tests validate universal properties (berlaku untuk semua input)
- Unit tests validate specific examples dan edge cases
- Checkpoints memastikan validation incremental
- Dependencies clear: setup → HTML → CSS → Modules → Integration → Testing

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2", "3"] },
    { "id": 2, "tasks": ["4", "5", "6", "7"] },
    { "id": 3, "tasks": ["8"] },
    { "id": 4, "tasks": ["10", "15", "20", "30"] },
    { "id": 5, "tasks": ["11", "12", "13", "14", "16", "17", "18", "24", "25", "26", "27", "28", "33", "34", "35", "36"] },
    { "id": 6, "tasks": ["21", "22", "23", "31", "32"] },
    { "id": 7, "tasks": ["38", "39", "40"] },
    { "id": 8, "tasks": ["41", "42", "43", "44"] },
    { "id": 9, "tasks": ["46", "47", "48", "49", "50"] }
  ]
}
```

