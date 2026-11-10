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

// -------- Populate Profile (Fetch Username from DB) --------
window.populateProfile = async function() {
    const user = await getCurrentUser();
    if (!user) return;

    const { data: profile } = await supabaseClient
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

    if (profile) {
        localStorage.setItem('illuminated_username', profile.username);
    }
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

    if (currentAuthMode === 'signin') {
        // --- SIGN IN FLOW ---
        const result = await signInUser(email, password);
        if (result.error) {
            errorEl.textContent = result.error;
            submitBtn.textContent = 'SIGN IN';
            submitBtn.disabled = false;
            return;
        }
        // If sign in works, just reload. No modal!
        window.location.reload();
        
    } else {
        // --- SIGN UP FLOW ---
        const result = await signUpUser(email, password);
        if (result.error) {
            errorEl.textContent = result.error;
            submitBtn.textContent = 'CREATE ACCOUNT';
            submitBtn.disabled = false;
            return;
        }
        // If sign up works, show the modal!
        document.getElementById('onboarding-modal').classList.add('open');
        submitBtn.textContent = 'ENTER THE APP';
    }
};

// ==========================================
// PAGE ROUTING
// ==========================================

function hideAllPages() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
}

window.showStoryPage = function() {
    hideAllPages();
    document.body.classList.remove('app-active');
    document.getElementById('story-page').classList.add('active');
};

window.showLoginPage = function() {
    hideAllPages();
    document.body.classList.remove('app-active');
    document.getElementById('login-page').classList.add('active');
};

window.showAppPage = function() {
    hideAllPages();
    document.body.classList.add('app-active');
    document.getElementById('home-page').classList.add('active');
};

// ==========================================
// STORY PAGE BUTTONS
// ==========================================

window.enterTryMode = function() {
    showLoginPage();
    
    // Check if they have an active session in their browser
    const hasVisitedBefore = localStorage.getItem('illuminated_has_visited') === 'true';
    
    if (hasVisitedBefore) {
        // Returning user: default to Sign In
        switchAuthTab('signin');
    } else {
        // Brand new user: default to Sign Up
        switchAuthTab('signup');
        // Mark this device as "visited" so next time it goes to Sign In
        localStorage.setItem('illuminated_has_visited', 'true');
    }
};

window.goToLogin = function() {
    showLoginPage();
};
// ==========================================
// BOOT — decide which page to show
// ==========================================

window.addEventListener('DOMContentLoaded', async () => {
    const user = await getCurrentUser();
    const INTRO_DURATION = 5000;

    if (user) {
        document.body.classList.add('logged-in');

        // 1. Fetch their profile
        const { data: profile } = await supabaseClient
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

        // 2. If their name is still the default "user_12345", they need to pick a name
        if (profile && profile.username.startsWith('user_')) {
            setTimeout(() => {
                document.getElementById('onboarding-modal').classList.add('open');
            }, INTRO_DURATION);
            return;
        }

        // 3. Otherwise, they have a name. Go to the app.
        if (profile) {
            localStorage.setItem('illuminated_username', profile.username);
        }
        setTimeout(() => {
            showAppPage();
        }, INTRO_DURATION);
    } else {
        setTimeout(() => {
            showStoryPage();
        }, INTRO_DURATION);
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
window.nextOnboardingStep = function() {
    const step1 = document.getElementById('onboarding-step-1');
    const step2 = document.getElementById('onboarding-step-2');
    
    // Fade out step 1
    step1.style.opacity = '0';
    step1.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        step1.style.display = 'none';
        step2.style.display = 'block';
        step2.classList.add('cinematic-step'); // Re-trigger animation
        document.getElementById('onboarding-username').focus();
    }, 400);
};

window.finishOnboarding = async function() {
    const usernameInput = document.getElementById('onboarding-username').value.trim().toLowerCase();
    const errorEl = document.getElementById('onboarding-error');

    // 1. THE BANNED WORD LIST 
    const bannedWords = ["fuck", "shit", "bitch", "nazi", "racist", "nigga", "nigger","cunt", "motherfucker", "pussy", "dick", "cock", "asshole", "bullshit", "dumbass", "cocksucker", "dickhead", "faggot", "fucker", "fucked", "fucking", "jackass", "shite", "twat", "wanker","dick-head", "cocksucker", "dumb-ass", "child-fucker", "jeffreyepstein", "donaldtrump", "miakhalifa", "bullocks", "bastard", "arsehead", "arsehole"]; 
    
    // Check if the username contains any banned words
    const containsBannedWord = bannedWords.some(word => usernameInput.includes(word));
    if (containsBannedWord) {
        errorEl.textContent = "This username contains restricted words. Please choose another.";
        return;
    }

    // 2. LENGTH CHECK
    if (usernameInput.length < 3) {
        errorEl.textContent = "Username must be at least 3 characters.";
        return;
    }
    if (usernameInput.length > 15) {
        errorEl.textContent = "Username must be under 15 characters.";
        return;
    }

    // 3. FORMAT CHECK (Only letters, numbers, and underscores)
    const formatRegex = /^[a-z0-9_]+$/;
    if (!formatRegex.test(usernameInput)) {
        errorEl.textContent = "Only lowercase letters, numbers, and underscores (_) are allowed.";
        return;
    }

    // 4. CHECK IF TAKEN IN SUPABASE
    const { data: existingUser } = await supabaseClient
        .from('profiles')
        .select('username')
        .eq('username', usernameInput)
        .maybeSingle();

    if (existingUser) {
        errorEl.textContent = "That star is already taken. Try another.";
        return;
    }

    // 5. SAVE TO SUPABASE
    const { data: { user } } = await supabaseClient.auth.getUser();
    const { error } = await supabaseClient
        .from('profiles')
        .update({ username: usernameInput })
        .eq('id', user.id);

    if (error) {
        errorEl.textContent = "Something went wrong. Try again.";
        return;
    }

    // 6. SUCCESS! Reload and enter.
    localStorage.setItem('illuminated_username', usernameInput);
    document.getElementById('onboarding-modal').classList.remove('open');

    // Wait a split second to ensure the database save completes, THEN reload
    setTimeout(() => {
        window.location.reload();
    }, 500);
};
// -------- Logout Logic --------
window.handleLogout = async function() {
    await signOutUser();
    window.location.reload();
};