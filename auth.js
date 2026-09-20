// ==========================================
// AUTH — Supabase Login / Signup / Logout
// ==========================================

const SUPABASE_URL = 'https://xamijbwrojzrsbegplof.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PNPiR55ozNpoeKCP5C2X0w_QaTg2-Rx';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// -------- Signup --------
window.signUpUser = async function(email, password) {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });
    if (error) {
        console.error('Signup error:', error.message);
        return { error: error.message };
    }
    return { data };
};

// -------- Login --------
window.signInUser = async function(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (error) {
        console.error('Login error:', error.message);
        return { error: error.message };
    }
    return { data };
};

// -------- Logout --------
window.signOutUser = async function() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.error('Logout error:', error.message);
    return !error;
};

// -------- Get current user --------
window.getCurrentUser = async function() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
};

// ==========================================
// LOGIN UI LOGIC
// ==========================================

let currentAuthMode = 'signin';

window.switchAuthTab = function(mode) {
    currentAuthMode = mode;
    document.getElementById('tab-signin').classList.toggle('active', mode === 'signin');
    document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
    document.getElementById('auth-submit').textContent = mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT';
    document.getElementById('auth-error').textContent = '';
};

window.handleAuthSubmit = async function(event) {
    event.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');
    const submitBtn = document.getElementById('auth-submit');

    errorEl.textContent = '';
    submitBtn.textContent = '...';
    submitBtn.disabled = true;

    const fn = currentAuthMode === 'signin' ? signInUser : signUpUser;
    const result = await fn(email, password);

    if (result.error) {
        errorEl.textContent = result.error;
        submitBtn.textContent = currentAuthMode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT';
        submitBtn.disabled = false;
        return;
    }

    window.location.reload();
};

// ==========================================
// PAGE ROUTING
// ==========================================

function hideAllPages() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
}

window.showStoryPage = function() {
    hideAllPages();
    document.getElementById('story-page').classList.add('active');
};

window.showLoginPage = function() {
    hideAllPages();
    document.getElementById('login-page').classList.add('active');
};

window.showAppPage = function() {
    hideAllPages();
    document.getElementById('home-page').classList.add('active');
};

// ==========================================
// STORY PAGE BUTTONS
// ==========================================

window.enterTryMode = function() {
    showLoginPage();
};

window.goToLogin = function() {
    showLoginPage();
};

// ==========================================
// BOOT — decide which page to show
// ==========================================

window.addEventListener('DOMContentLoaded', async () => {
    showStoryPage();

    const user = await getCurrentUser();

    if (user) {
        console.log('✅ Logged in as:', user.email);
        document.body.classList.add('logged-in');
    } else {
        console.log('❌ No user');
    }
});
// ==========================================
// PHASE 2 — INTERACTIVE PREVIEWS
// ==========================================

(function initPreviewCards() {

    // -------- 01 · TIMER --------
    const timerDisplay = document.getElementById('preview-timer-display');
    const timerFill = document.getElementById('preview-timer-fill');
    if (timerDisplay && timerFill) {
        let secondsLeft = 25 * 60;
        let totalSeconds = 25 * 60;

        setInterval(() => {
            secondsLeft--;
            if (secondsLeft < 0) secondsLeft = totalSeconds;

            const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
            const s = (secondsLeft % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${m}:${s}`;
            timerFill.style.width = `${(secondsLeft / totalSeconds) * 100}%`;
        }, 1000);
    }

    // -------- 02 · JOURNAL (typing) --------
    const journalBody = document.getElementById('preview-journal-body');
    if (journalBody) {
        const entries = [
            "today i studied for 47 minutes. didn't check my phone once.",
            "— — —",
            "started the essay. actually started it."
        ];

        let hasStarted = false;

        function startJournalTyping() {
            if (hasStarted) return;
            hasStarted = true;

            journalBody.innerHTML = '';
            let eIdx = 0;
            let cIdx = 0;
            let html = '';

            function typeChar() {
                if (eIdx >= entries.length) {
                    // done — remove caret
                    journalBody.innerHTML = html.replace(/<span class="caret"><\/span>/, '');
                    return;
                }

                const line = entries[eIdx];

                // divider entry
                if (line === '— — —') {
                    html += '<span class="mini-divider"></span>';
                    eIdx++;
                    cIdx = 0;
                    setTimeout(typeChar, 500);
                    return;
                }

                if (cIdx < line.length) {
                    html = html.replace(/<span class="caret"><\/span>/, '');
                    html += line[cIdx];
                    html += '<span class="caret"></span>';
                    cIdx++;
                    journalBody.innerHTML = html;
                    setTimeout(typeChar, 30);
                } else {
                    html = html.replace(/<span class="caret"><\/span>/, '');
                    html += '<br><br>';
                    eIdx++;
                    cIdx = 0;
                    setTimeout(typeChar, 400);
                }
            }

            typeChar();
        }

        // Expose so the scroll observer can trigger it
        window.__startJournalTyping = startJournalTyping;
    }

    // -------- REVEAL OBSERVER (triggers animations) --------
    const previewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // trigger journal typing when its card enters view
                if (entry.target.dataset.preview === 'journal') {
                    setTimeout(() => window.__startJournalTyping && window.__startJournalTyping(), 400);
                }
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.preview-card').forEach(el => {
        previewObserver.observe(el);
    });

})();