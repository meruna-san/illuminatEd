const ActivityTracker = (() => {

    const STORAGE_KEY = "illuminated_daily_activity";

    function getData() {
        return JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "{}"
        );
    }

    function saveData(data) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );
    }

    function getTodayKey() {
        return new Date().toLocaleDateString("en-CA");
    }

    function getToday() {
        const data = getData();
        const today = getTodayKey();

        if (!data[today]) {
            data[today] = {
                tasks: [],
                goals: [],
                focusMinutes: 0,
                journalCommitted: false
            };
        }

        saveData(data);
        return data[today];
    }

    function addTask(text) {
        const day = getToday();

        day.tasks.push(text);

        const data = getData();
        data[getTodayKey()] = day;
        saveData(data);
    }

    function addGoal(text) {
        const day = getToday();

        day.goals.push(text);

        const data = getData();
        data[getTodayKey()] = day;
        saveData(data);
    }

    function addFocusMinutes(minutes) {
        const day = getToday();

        day.focusMinutes += minutes;

        const data = getData();
        data[getTodayKey()] = day;
        saveData(data);
    }

    function markJournalCommitted() {
        const day = getToday();

        day.journalCommitted = true;

        const data = getData();
        data[getTodayKey()] = day;
        saveData(data);
    }

    function getTodayActivity() {
        return getToday();
    }

    return {
        addTask,
        addGoal,
        addFocusMinutes,
        markJournalCommitted,
        getTodayActivity
    };

})();

window.ActivityTracker = ActivityTracker;