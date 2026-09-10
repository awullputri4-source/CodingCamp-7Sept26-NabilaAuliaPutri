# Todo List Life Dashboard Requirements Document

## Introduction

The Todo List Life Dashboard is a comprehensive web application that combines productivity tools and daily lifestyle features into a single, unified interface. It provides users with real-time greeting information, a Pomodoro-based focus timer, a task management system, and quick access to frequently visited websites. The application persists all user data locally using browser storage, ensuring data retention across sessions without requiring server infrastructure.

## Glossary

- **Dashboard**: The main application interface displaying all features in a cohesive layout
- **User**: An individual interacting with the Todo List Life Dashboard
- **Local Storage**: Browser-based persistent storage mechanism for saving application data
- **Pomodoro Timer**: A 25-minute interval-based time management technique
- **Task**: A single item in the To-Do List representing work to be completed
- **Task Status**: The current completion state of a task (pending or completed)
- **Quick Links**: User-defined shortcuts to external websites
- **Greeting**: A contextual salutation based on time of day
- **Focus Timer**: The application component implementing the Pomodoro technique
- **To-Do List**: The application component managing task creation, editing, and tracking
- **Quick Links Panel**: The application component displaying user-defined website shortcuts
- **System**: The Todo List Life Dashboard application

## Requirements

### Requirement 1: Display Current Time and Date

**User Story:** As a user, I want to see the current time and date displayed on the dashboard, so that I can stay aware of the current moment throughout my working session.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE System SHALL display the current date in a readable format (e.g., "Wednesday, September 26, 2024")
2. WHEN the Dashboard loads, THE System SHALL display the current time in 24-hour format (e.g., "14:30:45")
3. WHEN time progresses, THE System SHALL update the displayed time every second to reflect the current time
4. THE System SHALL continue updating the time display while the Dashboard remains open

---

### Requirement 2: Display Contextual Time-Based Greeting

**User Story:** As a user, I want to receive a greeting that changes based on the time of day, so that the dashboard feels personalized and contextually appropriate.

#### Acceptance Criteria

1. WHEN the time is between 04:00 and 10:59, THE System SHALL display "Pagi" (morning)
2. WHEN the time is between 11:00 and 14:59, THE System SHALL display "Siang" (afternoon)
3. WHEN the time is between 15:00 and 18:59, THE System SHALL display "Sore" (late afternoon)
4. WHEN the time is between 19:00 and 03:59, THE System SHALL display "Malam" (evening/night)
5. WHEN the time changes and crosses a greeting boundary, THE System SHALL update the displayed greeting immediately

---

### Requirement 3: Initialize Pomodoro Focus Timer

**User Story:** As a productivity-focused user, I want a built-in Pomodoro timer set to 25 minutes, so that I can manage my work intervals effectively.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Focus_Timer SHALL display the time as "25:00" in MM:SS format
2. WHEN the Dashboard loads, THE Focus_Timer SHALL be in a stopped state and ready to start
3. THE Focus_Timer SHALL display minutes and seconds with two-digit formatting (e.g., "05:03" for 5 minutes 3 seconds)
4. THE Focus_Timer SHALL be visually distinct and prominently displayed on the Dashboard

---

### Requirement 4: Start Pomodoro Timer

**User Story:** As a user, I want to start the Pomodoro timer with a button click, so that I can begin a focused work session.

#### Acceptance Criteria

1. WHEN the User clicks the Start button, THE Focus_Timer SHALL begin counting down from its current value
2. WHEN the Focus_Timer is running, THE Focus_Timer display SHALL update every second to show the remaining time
3. WHEN the Focus_Timer is running, THE Start button state SHALL change to indicate the timer is active (e.g., disabled or showing "Running")
4. THE Focus_Timer SHALL continue counting down even if the User minimizes the browser or switches tabs

---

### Requirement 5: Stop Pomodoro Timer

**User Story:** As a user, I want to pause the Pomodoro timer, so that I can temporarily suspend my work session without losing my progress.

#### Acceptance Criteria

1. WHEN the Focus_Timer is running AND the User clicks the Stop button, THE Focus_Timer SHALL immediately pause at its current value
2. WHEN the Focus_Timer is stopped, THE Stop button state SHALL change to indicate the timer is paused
3. WHEN the Focus_Timer is stopped, THE Start button SHALL become active again, allowing the User to resume the timer from the paused value
4. WHEN the Focus_Timer is paused, THE displayed time SHALL remain constant until the User clicks Start again

---

### Requirement 6: Reset Pomodoro Timer

**User Story:** As a user, I want to reset the Pomodoro timer back to 25 minutes, so that I can end my current session and start fresh.

#### Acceptance Criteria

1. WHEN the User clicks the Reset button, THE Focus_Timer SHALL immediately return to "25:00"
2. WHEN the Focus_Timer is reset, THE Timer state SHALL change to stopped (not running)
3. WHEN the Focus_Timer is reset, THE Timer display SHALL show "25:00" regardless of the previous timer state (running or stopped)
4. THE Reset button SHALL function at any time, whether the timer is running or stopped

---

### Requirement 7: Add New Task to To-Do List

**User Story:** As a user, I want to add new tasks to my to-do list, so that I can track what needs to be done.

#### Acceptance Criteria

1. WHEN the User enters task text in the input field AND clicks the Add button, THE System SHALL create a new task with the entered text
2. WHEN a new task is added, THE System SHALL append it to the visible To-Do List
3. WHEN a new task is added, THE Task shall have a default status of "pending" (not completed)
4. WHEN a new task is added, THE input field SHALL be cleared and ready for the next task entry
5. WHEN the User attempts to add an empty task (empty or whitespace-only input), THE System SHALL not create a task and may display a validation message

---

### Requirement 8: Display All Tasks in To-Do List

**User Story:** As a user, I want to see all my tasks displayed in a clear, organized list, so that I can manage my workload effectively.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE System SHALL display all previously saved tasks from Local Storage
2. WHEN tasks exist in the To-Do List, THE System SHALL display each task with its title and completion status
3. WHEN the User adds a task, THE System SHALL immediately display the new task in the To-Do List
4. THE To-Do List display SHALL be scrollable if the number of tasks exceeds the available display area
5. WHEN no tasks exist, THE System SHALL display an empty state message (e.g., "Tidak ada tugas")

---

### Requirement 9: Mark Task as Completed

**User Story:** As a user, I want to mark tasks as completed, so that I can track my progress and see what I've accomplished.

#### Acceptance Criteria

1. WHEN the User clicks the checkbox or completion button on a task, THE System SHALL toggle the task status between "pending" and "completed"
2. WHEN a task is marked as completed, THE System SHALL visually distinguish it (e.g., strikethrough text, different color, checkmark icon)
3. WHEN a task is marked as completed, THE change SHALL persist in Local Storage
4. WHEN a completed task is toggled again, THE System SHALL restore it to "pending" status with appropriate visual updates
5. THE User SHALL be able to toggle task completion status at any time

---

### Requirement 10: Edit Existing Task

**User Story:** As a user, I want to edit task descriptions, so that I can update tasks that have changed or correct mistakes.

#### Acceptance Criteria

1. WHEN the User clicks the Edit button on a task, THE System SHALL enter edit mode for that specific task
2. WHEN in edit mode, THE System SHALL display an input field containing the current task text
3. WHEN the User modifies the text AND confirms the edit (e.g., clicking Save or pressing Enter), THE System SHALL update the task with the new text
4. WHEN the User confirms an edit, THE System SHALL save the changes to Local Storage
5. WHEN the User cancels an edit (e.g., clicking Cancel or pressing Escape), THE System SHALL discard changes and return to the display view
6. WHEN a task is being edited, THE other tasks in the To-Do List SHALL remain unchanged and unaffected

---

### Requirement 11: Delete Task from To-Do List

**User Story:** As a user, I want to delete tasks that are no longer needed, so that my to-do list stays current and relevant.

#### Acceptance Criteria

1. WHEN the User clicks the Delete button on a task, THE System SHALL remove that task from the To-Do List
2. WHEN a task is deleted, THE System SHALL immediately update the displayed list
3. WHEN a task is deleted, THE change SHALL persist in Local Storage
4. WHEN a task is deleted, THE User may be prompted to confirm deletion (optional confirmation mechanism)
5. WHEN all tasks are deleted, THE System SHALL display the empty state message

---

### Requirement 12: Persist To-Do List Data in Local Storage

**User Story:** As a user, I want my tasks to be saved automatically, so that I don't lose my work when I close the browser or reload the page.

#### Acceptance Criteria

1. WHEN a new task is added, THE System SHALL save the entire To-Do List to Local Storage
2. WHEN a task status is changed (completed/pending), THE System SHALL update the saved data in Local Storage
3. WHEN a task is edited, THE System SHALL update the corresponding entry in Local Storage
4. WHEN a task is deleted, THE System SHALL remove it from the saved data in Local Storage
5. WHEN the Browser is closed and reopened, THE System SHALL restore all tasks from Local Storage to the To-Do List

---

### Requirement 13: Add Quick Link to Favorites

**User Story:** As a user, I want to save shortcuts to my frequently visited websites, so that I can quickly access them from the dashboard.

#### Acceptance Criteria

1. WHEN the User enters a website name AND a URL in the Quick Links input fields AND clicks Add, THE System SHALL create a new Quick Link entry
2. WHEN a new Quick Link is added, THE System SHALL append it to the visible Quick Links Panel
3. WHEN a new Quick Link is added, THE input fields SHALL be cleared and ready for the next entry
4. WHEN the User attempts to add a Quick Link with missing or invalid data, THE System may display a validation message and not create the link
5. WHEN a Quick Link is added, THE change SHALL persist in Local Storage

---

### Requirement 14: Display All Quick Links

**User Story:** As a user, I want to see all my saved website shortcuts displayed clearly, so that I can quickly navigate to my favorite sites.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE System SHALL display all previously saved Quick Links from Local Storage
2. WHEN Quick Links exist, THE System SHALL display each link with a visible label and clickable button or link element
3. WHEN the User adds a new Quick Link, THE System SHALL immediately display it in the Quick Links Panel
4. WHEN no Quick Links are saved, THE System SHALL display an empty state message (e.g., "Belum ada quick links")
5. THE Quick Links Panel SHALL be visually organized and easy to scan

---

### Requirement 15: Open Quick Link in New Window

**User Story:** As a user, I want to click a Quick Link and be taken to the associated website, so that I can access my favorite sites quickly.

#### Acceptance Criteria

1. WHEN the User clicks a Quick Link button, THE System SHALL open the associated URL
2. WHEN a Quick Link is clicked, THE Target website SHALL open in a new browser window or tab (target="_blank")
3. WHEN a Quick Link is clicked, THE Dashboard SHALL remain open and unaffected
4. IF the URL is invalid or malformed, THE System MAY attempt to open it or display an error message

---

### Requirement 16: Delete Quick Link

**User Story:** As a user, I want to remove Quick Links I no longer need, so that my shortcuts panel stays organized and relevant.

#### Acceptance Criteria

1. WHEN the User clicks the Delete button on a Quick Link, THE System SHALL remove that Quick Link from the Quick Links Panel
2. WHEN a Quick Link is deleted, THE System SHALL immediately update the displayed panel
3. WHEN a Quick Link is deleted, THE change SHALL persist in Local Storage
4. WHEN all Quick Links are deleted, THE System SHALL display the empty state message
5. WHEN a Quick Link is deleted, THE other Quick Links SHALL remain unchanged and unaffected

---

### Requirement 17: Persist Quick Links in Local Storage

**User Story:** As a user, I want my Quick Links to be saved automatically, so that my shortcuts persist between browser sessions.

#### Acceptance Criteria

1. WHEN a new Quick Link is added, THE System SHALL save all Quick Links to Local Storage
2. WHEN a Quick Link is deleted, THE System SHALL update the saved data in Local Storage
3. WHEN the Browser is closed and reopened, THE System SHALL restore all Quick Links from Local Storage to the Quick Links Panel
4. THE Quick Links storage format SHALL be consistent and retrievable across browser sessions

---

### Requirement 18: Responsive Dashboard Layout

**User Story:** As a user, I want the dashboard to display properly on different screen sizes, so that I can use it effectively on desktop and mobile devices.

#### Acceptance Criteria

1. THE System SHALL display all four main components (Greeting, Focus Timer, To-Do List, Quick Links) in an organized layout
2. WHEN the viewport width is greater than 1024px, THE Dashboard components SHALL be arranged in a multi-column layout for optimal space usage
3. WHEN the viewport width is between 768px and 1024px, THE Dashboard components SHALL reflow to maintain readability and usability
4. WHEN the viewport width is less than 768px, THE Dashboard components SHALL stack vertically for mobile viewing
5. THE Dashboard interface SHALL remain fully functional at all supported viewport sizes

---

### Requirement 19: Apply Clean and Readable Code Structure

**User Story:** As a developer, I want the codebase to follow clean code principles, so that the application is maintainable and easy to understand.

#### Acceptance Criteria

1. THE JavaScript code SHALL be contained in a single file (`js/script.js`) with clear function naming and logical organization
2. THE CSS code SHALL be contained in a single file (`css/style.css`) with organized sections and consistent formatting
3. THE HTML code SHALL use semantic markup with clear structure and appropriate element hierarchy
4. THE Code SHALL include comments explaining complex logic and functionality
5. THE Code SHALL follow consistent naming conventions throughout the application (camelCase for JavaScript, kebab-case for CSS classes)

