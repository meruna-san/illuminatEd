const ActivityTracker = (() => {

    function getTodayKey() {
        return new Date().toLocaleDateString("en-CA");
    }

    async function getUserId() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user ? user.id : null;
    }

    async function getTodayActivity() {
        const userId = await getUserId();
        if (!userId) return { tasks: [], goals: [], focusMinutes: 0, journalCommitted: false };

        const today = getTodayKey();

        const { data, error } = await supabaseClient
            .from('daily_activity')
            .select('*')
            .eq('user_id', userId)
            .eq('date_key', today)
            .maybeSingle();

        if (error) {
            console.error("Error fetching activity:", error);
        }

        if (data) {
            return {
                tasks: data.tasks || [],
                goals: data.goals || [],
                focusMinutes: data.focus_minutes || 0,
                journalCommitted: data.journal_committed || false
            };
        } else {
            return { tasks: [], goals: [], focusMinutes: 0, journalCommitted: false };
        }
    }

    async function saveTodayActivity(updatedData) {
        const userId = await getUserId();
        if (!userId) return;

        const today = getTodayKey();

        const payload = {
            user_id: userId,
            date_key: today,
            tasks: updatedData.tasks,
            goals: updatedData.goals,
            focus_minutes: updatedData.focusMinutes,
            journal_committed: updatedData.journalCommitted
        };

        const { error } = await supabaseClient
            .from('daily_activity')
            .upsert(payload, { onConflict: 'user_id, date_key' });

        if (error) {
            console.error("Error saving activity:", error);
        }
    }

    async function addTask(text) {
        const day = await getTodayActivity();
        day.tasks.push(text);
        await saveTodayActivity(day);
    }

    async function addGoal(text) {
        const day = await getTodayActivity();
        day.goals.push(text);
        await saveTodayActivity(day);
    }

    async function addFocusMinutes(minutes) {
        const day = await getTodayActivity();
        day.focusMinutes += minutes;
        await saveTodayActivity(day);
    }

    async function markJournalCommitted() {
        const day = await getTodayActivity();
        day.journalCommitted = true;
        await saveTodayActivity(day);
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