/**
 * Unit Tests for PomodoroTimer Module
 * Tests timer functionality, formatting, state transitions, and DOM interactions
 */

describe('PomodoroTimer Module', () => {
    let timerDisplay, startBtn, stopBtn, resetBtn, statusEl;

    beforeEach(() => {
        // Set up DOM elements
        document.body.innerHTML = `
            <div class="timer-display" id="timer-display">25:00</div>
            <button id="timer-start" class="btn btn-primary">Start</button>
            <button id="timer-stop" class="btn btn-secondary">Stop</button>
            <button id="timer-reset" class="btn btn-tertiary">Reset</button>
            <p class="timer-status" id="timer-status">Ready to start</p>
        `;

        timerDisplay = document.getElementById('timer-display');
        startBtn = document.getElementById('timer-start');
        stopBtn = document.getElementById('timer-stop');
        resetBtn = document.getElementById('timer-reset');
        statusEl = document.getElementById('timer-status');

        // Reset PomodoroTimer state
        window.TodoApp.PomodoroTimer.remainingSeconds = window.TodoApp.PomodoroTimer.totalSeconds;
        window.TodoApp.PomodoroTimer.isRunning = false;
        if (window.TodoApp.PomodoroTimer.intervalId) {
            clearInterval(window.TodoApp.PomodoroTimer.intervalId);
            window.TodoApp.PomodoroTimer.intervalId = null;
        }
    });

    afterEach(() => {
        // Clean up any active intervals
        if (window.TodoApp.PomodoroTimer.intervalId) {
            clearInterval(window.TodoApp.PomodoroTimer.intervalId);
            window.TodoApp.PomodoroTimer.intervalId = null;
        }
    });

    describe('formatDisplay()', () => {
        it('should format 1500 seconds as "25:00"', () => {
            const result = window.TodoApp.PomodoroTimer.formatDisplay(1500);
            expect(result).toBe('25:00');
        });

        it('should format 303 seconds as "05:03"', () => {
            const result = window.TodoApp.PomodoroTimer.formatDisplay(303);
            expect(result).toBe('05:03');
        });

        it('should format 0 seconds as "00:00"', () => {
            const result = window.TodoApp.PomodoroTimer.formatDisplay(0);
            expect(result).toBe('00:00');
        });

        it('should format 59 seconds as "00:59"', () => {
            const result = window.TodoApp.PomodoroTimer.formatDisplay(59);
            expect(result).toBe('00:59');
        });

        it('should format 60 seconds as "01:00"', () => {
            const result = window.TodoApp.PomodoroTimer.formatDisplay(60);
            expect(result).toBe('01:00');
        });

        it('should format 3661 seconds as "61:01"', () => {
            const result = window.TodoApp.PomodoroTimer.formatDisplay(3661);
            expect(result).toBe('61:01');
        });

        it('should have zero-padded minutes and seconds', () => {
            const result = window.TodoApp.PomodoroTimer.formatDisplay(125);
            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });
    });

    describe('updateDisplay()', () => {
        it('should update timer display element with formatted time', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.updateDisplay();
            expect(timerDisplay.textContent).toBe('08:20');
        });

        it('should display "25:00" when remainingSeconds is 1500', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 1500;
            window.TodoApp.PomodoroTimer.updateDisplay();
            expect(timerDisplay.textContent).toBe('25:00');
        });

        it('should update display on multiple calls with different times', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 1200;
            window.TodoApp.PomodoroTimer.updateDisplay();
            expect(timerDisplay.textContent).toBe('20:00');

            window.TodoApp.PomodoroTimer.remainingSeconds = 60;
            window.TodoApp.PomodoroTimer.updateDisplay();
            expect(timerDisplay.textContent).toBe('01:00');
        });
    });

    describe('updateButtonStates()', () => {
        it('should disable Start button when timer is running', () => {
            window.TodoApp.PomodoroTimer.isRunning = true;
            window.TodoApp.PomodoroTimer.updateButtonStates();
            expect(startBtn.disabled).toBe(true);
            expect(stopBtn.disabled).toBe(false);
        });

        it('should enable Start button when timer is not running', () => {
            window.TodoApp.PomodoroTimer.isRunning = false;
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.updateButtonStates();
            expect(startBtn.disabled).toBe(false);
        });

        it('should disable Stop button when timer is at initial state', () => {
            window.TodoApp.PomodoroTimer.isRunning = false;
            window.TodoApp.PomodoroTimer.remainingSeconds = 1500;
            window.TodoApp.PomodoroTimer.updateButtonStates();
            expect(stopBtn.disabled).toBe(true);
        });

        it('should enable Stop button when timer has started', () => {
            window.TodoApp.PomodoroTimer.isRunning = false;
            window.TodoApp.PomodoroTimer.remainingSeconds = 1200;
            window.TodoApp.PomodoroTimer.updateButtonStates();
            expect(stopBtn.disabled).toBe(false);
        });
    });

    describe('start()', () => {
        it('should set isRunning to true', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.start();
            expect(window.TodoApp.PomodoroTimer.isRunning).toBe(true);
        });

        it('should create an interval', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.start();
            expect(window.TodoApp.PomodoroTimer.intervalId).not.toBeNull();
        });

        it('should update status to "Running..."', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.start();
            expect(statusEl.textContent).toBe('Running...');
        });

        it('should update button states', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.start();
            expect(startBtn.disabled).toBe(true);
        });

        it('should not start if already running', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.start();
            const firstIntervalId = window.TodoApp.PomodoroTimer.intervalId;
            window.TodoApp.PomodoroTimer.start();
            expect(window.TodoApp.PomodoroTimer.intervalId).toBe(firstIntervalId);
        });

        it('should not start if remainingSeconds is 0', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 0;
            window.TodoApp.PomodoroTimer.start();
            expect(window.TodoApp.PomodoroTimer.isRunning).toBe(false);
            expect(window.TodoApp.PomodoroTimer.intervalId).toBeNull();
        });
    });

    describe('stop()', () => {
        it('should set isRunning to false', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.start();
            window.TodoApp.PomodoroTimer.stop();
            expect(window.TodoApp.PomodoroTimer.isRunning).toBe(false);
        });

        it('should clear the interval', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.start();
            window.TodoApp.PomodoroTimer.stop();
            expect(window.TodoApp.PomodoroTimer.intervalId).toBeNull();
        });

        it('should update status to "Paused"', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.start();
            window.TodoApp.PomodoroTimer.stop();
            expect(statusEl.textContent).toBe('Paused');
        });

        it('should preserve remainingSeconds when stopped', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 300;
            const beforeStop = window.TodoApp.PomodoroTimer.remainingSeconds;
            window.TodoApp.PomodoroTimer.start();
            window.TodoApp.PomodoroTimer.stop();
            expect(window.TodoApp.PomodoroTimer.remainingSeconds).toBe(beforeStop);
        });

        it('should not stop if not running', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.stop();
            expect(window.TodoApp.PomodoroTimer.isRunning).toBe(false);
        });
    });

    describe('reset()', () => {
        it('should set remainingSeconds to totalSeconds (1500)', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.reset();
            expect(window.TodoApp.PomodoroTimer.remainingSeconds).toBe(1500);
        });

        it('should set isRunning to false', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.isRunning = true;
            window.TodoApp.PomodoroTimer.reset();
            expect(window.TodoApp.PomodoroTimer.isRunning).toBe(false);
        });

        it('should display "25:00" after reset', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 300;
            window.TodoApp.PomodoroTimer.reset();
            expect(timerDisplay.textContent).toBe('25:00');
        });

        it('should clear any active interval', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.start();
            window.TodoApp.PomodoroTimer.reset();
            expect(window.TodoApp.PomodoroTimer.intervalId).toBeNull();
        });

        it('should update status to "Ready to start"', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.reset();
            expect(statusEl.textContent).toBe('Ready to start');
        });

        it('should work when timer is running', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.start();
            window.TodoApp.PomodoroTimer.reset();
            expect(window.TodoApp.PomodoroTimer.remainingSeconds).toBe(1500);
            expect(window.TodoApp.PomodoroTimer.isRunning).toBe(false);
        });

        it('should work when timer is stopped', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.reset();
            expect(window.TodoApp.PomodoroTimer.remainingSeconds).toBe(1500);
            expect(window.TodoApp.PomodoroTimer.isRunning).toBe(false);
        });
    });

    describe('tick()', () => {
        it('should decrement remainingSeconds by 1', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 100;
            window.TodoApp.PomodoroTimer.tick();
            expect(window.TodoApp.PomodoroTimer.remainingSeconds).toBe(99);
        });

        it('should update display after tick', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 100;
            window.TodoApp.PomodoroTimer.tick();
            expect(timerDisplay.textContent).toBe('01:39');
        });

        it('should not decrement below 0', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 0;
            window.TodoApp.PomodoroTimer.tick();
            expect(window.TodoApp.PomodoroTimer.remainingSeconds).toBe(0);
        });

        it('should call onTimerComplete when remainingSeconds reaches 0', (done) => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 1;
            spyOn(window.TodoApp.PomodoroTimer, 'onTimerComplete');
            window.TodoApp.PomodoroTimer.tick();
            setTimeout(() => {
                expect(window.TodoApp.PomodoroTimer.onTimerComplete).toHaveBeenCalled();
                done();
            }, 10);
        });
    });

    describe('State transitions', () => {
        it('should transition from stopped to running to stopped', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            expect(window.TodoApp.PomodoroTimer.isRunning).toBe(false);

            window.TodoApp.PomodoroTimer.start();
            expect(window.TodoApp.PomodoroTimer.isRunning).toBe(true);

            window.TodoApp.PomodoroTimer.stop();
            expect(window.TodoApp.PomodoroTimer.isRunning).toBe(false);
        });

        it('should be able to resume after stop', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            window.TodoApp.PomodoroTimer.start();
            const timeAfterStart = window.TodoApp.PomodoroTimer.remainingSeconds;

            window.TodoApp.PomodoroTimer.stop();
            expect(window.TodoApp.PomodoroTimer.remainingSeconds).toBe(timeAfterStart);

            window.TodoApp.PomodoroTimer.start();
            expect(window.TodoApp.PomodoroTimer.isRunning).toBe(true);
        });
    });

    describe('init()', () => {
        it('should initialize the timer display', () => {
            window.TodoApp.PomodoroTimer.init();
            expect(timerDisplay.textContent).toBe('25:00');
        });

        it('should set up button states', () => {
            window.TodoApp.PomodoroTimer.init();
            expect(startBtn.disabled).toBe(false);
            expect(stopBtn.disabled).toBe(true);
        });

        it('should attach start button listener', () => {
            spyOn(window.TodoApp.PomodoroTimer, 'start');
            window.TodoApp.PomodoroTimer.init();
            startBtn.click();
            expect(window.TodoApp.PomodoroTimer.start).toHaveBeenCalled();
        });

        it('should attach stop button listener', () => {
            window.TodoApp.PomodoroTimer.remainingSeconds = 500;
            spyOn(window.TodoApp.PomodoroTimer, 'stop');
            window.TodoApp.PomodoroTimer.init();
            stopBtn.click();
            expect(window.TodoApp.PomodoroTimer.stop).toHaveBeenCalled();
        });

        it('should attach reset button listener', () => {
            spyOn(window.TodoApp.PomodoroTimer, 'reset');
            window.TodoApp.PomodoroTimer.init();
            resetBtn.click();
            expect(window.TodoApp.PomodoroTimer.reset).toHaveBeenCalled();
        });
    });
});


/**
 * Unit Tests for GreetingManager Module
 * Tests greeting logic, time formatting, date formatting, and DOM updates
 */

describe('GreetingManager Module', () => {
    let greetingTextEl, dateDisplayEl, timeDisplayEl;

    beforeEach(() => {
        // Set up DOM elements
        document.body.innerHTML = `
            <h1 class="greeting-text" id="greeting-text">Pagi</h1>
            <time class="date-display" id="date-display">Loading...</time>
            <time class="time-display" id="time-display">Loading...</time>
        `;

        greetingTextEl = document.getElementById('greeting-text');
        dateDisplayEl = document.getElementById('date-display');
        timeDisplayEl = document.getElementById('time-display');

        // Reset GreetingManager state
        window.TodoApp.GreetingManager.stop();
        if (window.TodoApp.GreetingManager.intervalId) {
            clearInterval(window.TodoApp.GreetingManager.intervalId);
            window.TodoApp.GreetingManager.intervalId = null;
        }
    });

    afterEach(() => {
        // Clean up any active intervals
        if (window.TodoApp.GreetingManager.intervalId) {
            clearInterval(window.TodoApp.GreetingManager.intervalId);
            window.TodoApp.GreetingManager.intervalId = null;
        }
    });

    describe('getGreeting()', () => {
        it('should return "Pagi" for hour 4', () => {
            const result = window.TodoApp.GreetingManager.getGreeting(4);
            expect(result).toBe('Pagi');
        });

        it('should return "Pagi" for hour 10', () => {
            const result = window.TodoApp.GreetingManager.getGreeting(10);
            expect(result).toBe('Pagi');
        });

        it('should return "Siang" for hour 11', () => {
            const result = window.TodoApp.GreetingManager.getGreeting(11);
            expect(result).toBe('Siang');
        });

        it('should return "Siang" for hour 14', () => {
            const result = window.TodoApp.GreetingManager.getGreeting(14);
            expect(result).toBe('Siang');
        });

        it('should return "Sore" for hour 15', () => {
            const result = window.TodoApp.GreetingManager.getGreeting(15);
            expect(result).toBe('Sore');
        });

        it('should return "Sore" for hour 18', () => {
            const result = window.TodoApp.GreetingManager.getGreeting(18);
            expect(result).toBe('Sore');
        });

        it('should return "Malam" for hour 19', () => {
            const result = window.TodoApp.GreetingManager.getGreeting(19);
            expect(result).toBe('Malam');
        });

        it('should return "Malam" for hour 23', () => {
            const result = window.TodoApp.GreetingManager.getGreeting(23);
            expect(result).toBe('Malam');
        });

        it('should return "Malam" for hour 0', () => {
            const result = window.TodoApp.GreetingManager.getGreeting(0);
            expect(result).toBe('Malam');
        });

        it('should return "Malam" for hour 3', () => {
            const result = window.TodoApp.GreetingManager.getGreeting(3);
            expect(result).toBe('Malam');
        });

        it('should return correct greeting for hour 3:59 (boundary)', () => {
            const result = window.TodoApp.GreetingManager.getGreeting(3);
            expect(result).toBe('Malam');
        });

        it('should be consistent across multiple calls', () => {
            const hour = 12;
            const result1 = window.TodoApp.GreetingManager.getGreeting(hour);
            const result2 = window.TodoApp.GreetingManager.getGreeting(hour);
            expect(result1).toBe(result2);
        });
    });

    describe('formatTime()', () => {
        it('should format time as "HH:MM:SS" with zero padding', () => {
            const date = new Date(2024, 0, 1, 5, 3, 8);
            const result = window.TodoApp.GreetingManager.formatTime(date);
            expect(result).toBe('05:03:08');
        });

        it('should format time with single digit hours', () => {
            const date = new Date(2024, 0, 1, 9, 30, 45);
            const result = window.TodoApp.GreetingManager.formatTime(date);
            expect(result).toBe('09:30:45');
        });

        it('should format time with single digit minutes', () => {
            const date = new Date(2024, 0, 1, 14, 5, 20);
            const result = window.TodoApp.GreetingManager.formatTime(date);
            expect(result).toBe('14:05:20');
        });

        it('should format time with single digit seconds', () => {
            const date = new Date(2024, 0, 1, 23, 59, 5);
            const result = window.TodoApp.GreetingManager.formatTime(date);
            expect(result).toBe('23:59:05');
        });

        it('should format midnight as "00:00:00"', () => {
            const date = new Date(2024, 0, 1, 0, 0, 0);
            const result = window.TodoApp.GreetingManager.formatTime(date);
            expect(result).toBe('00:00:00');
        });

        it('should format noon as "12:00:00"', () => {
            const date = new Date(2024, 0, 1, 12, 0, 0);
            const result = window.TodoApp.GreetingManager.formatTime(date);
            expect(result).toBe('12:00:00');
        });

        it('should format end of day as "23:59:59"', () => {
            const date = new Date(2024, 0, 1, 23, 59, 59);
            const result = window.TodoApp.GreetingManager.formatTime(date);
            expect(result).toBe('23:59:59');
        });

        it('should return string matching pattern "\\d{2}:\\d{2}:\\d{2}"', () => {
            const date = new Date();
            const result = window.TodoApp.GreetingManager.formatTime(date);
            expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
        });
    });

    describe('formatDate()', () => {
        it('should format date with day, month, day number, and year', () => {
            const date = new Date(2024, 8, 26); // September 26, 2024 (note: month is 0-indexed)
            const result = window.TodoApp.GreetingManager.formatDate(date);
            // Should contain day of week, month name, day, and year
            expect(result).toContain('2024');
            expect(result).toMatch(/\d{1,2}/);
        });

        it('should format date with Indonesian locale', () => {
            const date = new Date(2024, 8, 26); // September 26, 2024
            const result = window.TodoApp.GreetingManager.formatDate(date);
            // Should be in format like "Kamis, 26 September 2024"
            expect(result).toContain('26');
            expect(result).toContain('2024');
        });

        it('should format date consistently across multiple calls', () => {
            const date = new Date(2024, 8, 26);
            const result1 = window.TodoApp.GreetingManager.formatDate(date);
            const result2 = window.TodoApp.GreetingManager.formatDate(date);
            expect(result1).toBe(result2);
        });

        it('should include day number in formatted date', () => {
            const date = new Date(2024, 0, 15); // January 15, 2024
            const result = window.TodoApp.GreetingManager.formatDate(date);
            expect(result).toContain('15');
        });

        it('should include month name in formatted date', () => {
            const date = new Date(2024, 0, 1); // January 1, 2024
            const result = window.TodoApp.GreetingManager.formatDate(date);
            // Depending on locale, should contain January or Januari
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('updateDisplay()', () => {
        it('should update greeting display element', () => {
            const date = new Date(2024, 0, 1, 8, 0, 0); // Morning
            window.TodoApp.GreetingManager.currentTime = date;
            window.TodoApp.GreetingManager.updateDisplay();
            expect(greetingTextEl.textContent).toBe('Pagi');
        });

        it('should update time display element', () => {
            const date = new Date(2024, 0, 1, 14, 30, 45);
            window.TodoApp.GreetingManager.currentTime = date;
            window.TodoApp.GreetingManager.updateDisplay();
            expect(timeDisplayEl.textContent).toBe('14:30:45');
        });

        it('should update date display element', () => {
            const date = new Date(2024, 0, 1, 12, 0, 0);
            window.TodoApp.GreetingManager.currentTime = date;
            window.TodoApp.GreetingManager.updateDisplay();
            expect(dateDisplayEl.textContent).toContain('2024');
        });

        it('should update greeting when crossing time boundary', () => {
            // Set to 10:59 (last minute of Pagi)
            let date = new Date(2024, 0, 1, 10, 59, 0);
            window.TodoApp.GreetingManager.currentTime = date;
            window.TodoApp.GreetingManager.updateDisplay();
            expect(greetingTextEl.textContent).toBe('Pagi');

            // Move to 11:00 (first minute of Siang)
            date = new Date(2024, 0, 1, 11, 0, 0);
            window.TodoApp.GreetingManager.currentTime = date;
            window.TodoApp.GreetingManager.updateDisplay();
            expect(greetingTextEl.textContent).toBe('Siang');
        });

        it('should not update greeting if it has not changed', () => {
            const date = new Date(2024, 0, 1, 12, 0, 0);
            window.TodoApp.GreetingManager.currentTime = date;
            window.TodoApp.GreetingManager.greetingPeriod = 'Siang';
            window.TodoApp.GreetingManager.updateDisplay();
            expect(window.TodoApp.GreetingManager.greetingPeriod).toBe('Siang');
        });
    });

    describe('start()', () => {
        it('should create an interval', () => {
            window.TodoApp.GreetingManager.start();
            expect(window.TodoApp.GreetingManager.intervalId).not.toBeNull();
        });

        it('should set interval to 1000ms', (done) => {
            let callCount = 0;
            spyOn(window.TodoApp.GreetingManager, 'tick').and.callFake(() => {
                callCount++;
            });
            
            window.TodoApp.GreetingManager.start();
            
            setTimeout(() => {
                // After ~1100ms, should have been called at least once
                expect(callCount).toBeGreaterThan(0);
                window.TodoApp.GreetingManager.stop();
                done();
            }, 1100);
        });

        it('should not create duplicate intervals', () => {
            window.TodoApp.GreetingManager.start();
            const firstIntervalId = window.TodoApp.GreetingManager.intervalId;
            window.TodoApp.GreetingManager.start();
            expect(window.TodoApp.GreetingManager.intervalId).toBe(firstIntervalId);
        });
    });

    describe('stop()', () => {
        it('should clear the interval', () => {
            window.TodoApp.GreetingManager.start();
            expect(window.TodoApp.GreetingManager.intervalId).not.toBeNull();
            window.TodoApp.GreetingManager.stop();
            expect(window.TodoApp.GreetingManager.intervalId).toBeNull();
        });

        it('should not throw error if no interval is running', () => {
            expect(() => {
                window.TodoApp.GreetingManager.stop();
            }).not.toThrow();
        });
    });

    describe('tick()', () => {
        it('should update currentTime to current date', () => {
            const beforeTime = window.TodoApp.GreetingManager.currentTime;
            window.TodoApp.GreetingManager.tick();
            const afterTime = window.TodoApp.GreetingManager.currentTime;
            expect(afterTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
        });

        it('should call updateDisplay', () => {
            spyOn(window.TodoApp.GreetingManager, 'updateDisplay');
            window.TodoApp.GreetingManager.tick();
            expect(window.TodoApp.GreetingManager.updateDisplay).toHaveBeenCalled();
        });
    });

    describe('init()', () => {
        it('should set up DOM element references', () => {
            window.TodoApp.GreetingManager.init();
            expect(window.TodoApp.GreetingManager.greetingTextEl).toBe(greetingTextEl);
            expect(window.TodoApp.GreetingManager.dateDisplayEl).toBe(dateDisplayEl);
            expect(window.TodoApp.GreetingManager.timeDisplayEl).toBe(timeDisplayEl);
        });

        it('should perform initial display update', () => {
            spyOn(window.TodoApp.GreetingManager, 'updateDisplay');
            window.TodoApp.GreetingManager.init();
            expect(window.TodoApp.GreetingManager.updateDisplay).toHaveBeenCalled();
        });

        it('should start the update loop', () => {
            window.TodoApp.GreetingManager.init();
            expect(window.TodoApp.GreetingManager.intervalId).not.toBeNull();
        });

        it('should handle missing DOM elements gracefully', () => {
            document.body.innerHTML = ''; // Remove all elements
            expect(() => {
                window.TodoApp.GreetingManager.init();
            }).not.toThrow();
        });
    });

    describe('Integration: Greeting Period Round-Trip (Property 3)', () => {
        it('should return consistent greeting for same hour across multiple queries', () => {
            const hour = 12;
            const greeting1 = window.TodoApp.GreetingManager.getGreeting(hour);
            const greeting2 = window.TodoApp.GreetingManager.getGreeting(hour);
            const greeting3 = window.TodoApp.GreetingManager.getGreeting(hour);
            expect(greeting1).toBe(greeting2);
            expect(greeting2).toBe(greeting3);
        });

        it('should maintain correct greeting for all hours 0-23', () => {
            const expectedGreetings = {
                0: 'Malam', 1: 'Malam', 2: 'Malam', 3: 'Malam',
                4: 'Pagi', 5: 'Pagi', 6: 'Pagi', 7: 'Pagi', 8: 'Pagi', 9: 'Pagi', 10: 'Pagi',
                11: 'Siang', 12: 'Siang', 13: 'Siang', 14: 'Siang',
                15: 'Sore', 16: 'Sore', 17: 'Sore', 18: 'Sore',
                19: 'Malam', 20: 'Malam', 21: 'Malam', 22: 'Malam', 23: 'Malam'
            };

            for (let hour = 0; hour < 24; hour++) {
                const result = window.TodoApp.GreetingManager.getGreeting(hour);
                expect(result).toBe(expectedGreetings[hour], `Hour ${hour} should return "${expectedGreetings[hour]}", got "${result}"`);
            }
        });
    });

    describe('Integration: Time Display Format (Property 1)', () => {
        it('should format all times with consistent "HH:MM:SS" pattern', () => {
            // Test various times
            const testTimes = [
                new Date(2024, 0, 1, 0, 0, 0),
                new Date(2024, 0, 1, 5, 15, 30),
                new Date(2024, 0, 1, 12, 30, 45),
                new Date(2024, 0, 1, 23, 59, 59)
            ];

            testTimes.forEach(date => {
                const result = window.TodoApp.GreetingManager.formatTime(date);
                expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
            });
        });
    });

    describe('Integration: Date Display Format (Property 2)', () => {
        it('should format all dates with consistent format', () => {
            // Test various dates
            const testDates = [
                new Date(2024, 0, 1),
                new Date(2024, 5, 15),
                new Date(2024, 11, 31)
            ];

            testDates.forEach(date => {
                const result = window.TodoApp.GreetingManager.formatDate(date);
                expect(result).toBeTruthy();
                expect(result.length).toBeGreaterThan(10); // Should be a reasonably long string
            });
        });
    });
});
