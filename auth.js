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

window.showLoginPage = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('login-page').classList.add('active');
};

window.showAppPage = function() {
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('home-page').classList.add('active');
};

window.addEventListener('DOMContentLoaded', async () => {
    const user = await getCurrentUser();
    if (user) {
        console.log('✅ Logged in as:', user.email);
        showAppPage();
    } else {
        console.log('❌ No user — showing login');
        showLoginPage();
    }
});