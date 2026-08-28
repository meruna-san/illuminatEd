// --- LIVE EXTERNAL DATABASE PORT STREAM ---
const OPPORTUNITIES_DATABASE = [
    // --- COMPETITIONS ---
    { title: "Breakthrough Junior Challenge", category: "competition", tags: ["STEM", "Science"], description: "Global science video competition (ages 13–18). Explain a complex big idea in physics, life sciences, or math visually in a short video.", deadline: "ANNUAL", meta: "$250K SCHOLARSHIP PRIZE", link: "https://breakthroughjuniorchallenge.org" },
    { title: "Conrad Challenge", category: "competition", tags: ["STEM", "Business"], description: "Innovation and entrepreneurship competition where teams design sustainable solutions to global real-world challenges.", deadline: "VARIES", meta: "GLOBAL STAGE // AGES 13-18", link: "https://www.conradchallenge.org" },
    { title: "NASA Space Apps Challenge", category: "competition", tags: ["STEM", "Coding", "Space"], description: "Massive international hackathon where teams leverage NASA's open-source data to address problems on Earth and in space.", deadline: "OCTOBER", meta: "FREE // GLOBAL HACKATHON", link: "https://www.nasaspaceappschallenge.org" },
    { title: "IAAC Astronomy Competition", category: "competition", tags: ["STEM", "Space"], description: "The International Astronomy and Astrophysics Competition gives students a unique global playground to test skills.", deadline: "ROUNDS", meta: "FREE QUALIFIER // GLOBAL", link: "https://iaac.space" },
    { title: "IYMC Mathematics Challenge", category: "competition", tags: ["Math"], description: "International Youth Math Challenge. An online global math competition designed to unleash creative problem solving.", deadline: "VARIES", meta: "GLOBAL CASH PRIZES", link: "https://iymc.info" },
    { title: "John Locke Essay Competition", category: "competition", tags: ["Writing"], description: "Elite level global essay evaluation platform across economics, history, politics, philosophy, and psychology fields.", deadline: "MAY/JUNE", meta: "OXFORD ACADEMIC EVAL", link: "https://www.johnlockeinstitute.com/essay-competition" },
    { title: "Harvard International Review Contest", category: "competition", tags: ["Writing"], description: "Academic writing competition centered on global affairs and international relations topics evaluated by HIR boards.", deadline: "VARIES", meta: "GLOBAL SUBMISSIONS", link: "https://hir.harvard.edu/contest" },
    { title: "Blue Ocean Competition", category: "competition", tags: ["Business"], description: "Prestigious virtual business pitch competition for high school entrepreneurs to layout strategic startup formulas.", deadline: "VARIES", meta: "FREE // GLOBAL VIRTUAL", link: "https://blueoceancompetition.org" },
    { title: "Diamond Challenge", category: "competition", tags: ["Business"], description: "Global entrepreneurship engine providing hands-on opportunities to pitch game-changing startup theories.", deadline: "VARIES", meta: "INVESTMENT FUND PRIZES", link: "https://diamondchallenge.org" },

    // --- SUMMER PROGRAMS ---
    { title: "Yale Young Global Scholars (YYGS)", category: "summer", tags: ["Global"], description: "Unparalleled academic summer experience hosting students across global humanities, innovations, and policy tracks.", deadline: "VARIES", meta: "YALE RESIDENTIAL CAMPUS", link: "https://globalscholars.yale.edu" },
    { title: "Research Science Institute (RSI)", category: "summer", tags: ["Research"], description: "Ultra-selective flagship summer cycle blending advanced scientific theory on-campus with authentic thesis creation.", deadline: "JANUARY", meta: "100% FREE // MIT CAMPUS", link: "https://www.cee.org/programs/research-science-institute" },
    { title: "LaunchX Entrepreneurship", category: "summer", tags: ["Tech"], description: "Rigorous summer program where top-tier students construct actual functioning corporate startups from absolute scratch.", deadline: "VARIES", meta: "STARTUP LAB ACCELERATOR", link: "https://www.launchx.com" },

    // --- LEARNING & PROJECTS ---
    { title: "Zooniverse Citizen Science", category: "learning", tags: ["Citizen Science"], description: "Contribute to real active scientific investigations globally by analyzing telescope footage, climate logs, and data matrices.", deadline: "ONGOING", meta: "SELF-PACED APP MATERIAL", link: "https://www.zooniverse.org" },
    { title: "IASC Asteroid Search", category: "learning", tags: ["Citizen Science"], description: "Discover original astronomical assets. Analyze real-time deep space image data to map undetected celestial materials.", deadline: "CAMPAIGNS", meta: "ASTRONOMY PROJECTS TEAM", link: "http://iasc.cosmosearch.org" },
    { title: "MIT OpenCourseWare", category: "learning", tags: ["Courses"], description: "Unlock full authentic semester material streams representing direct undergraduate curricula branches from MIT catalog blocks.", deadline: "SELF-PACED", meta: "FREE STUDY MATERIALS", link: "https://ocw.mit.edu" },

    // --- SCHOLARSHIPS ---
    { title: "The Gates Scholarship", category: "scholarship", tags: ["Leadership", "Full-Ride"], description: "Highly selective full-ride scholarship for outstanding, minority high school seniors with strong academic tracking.", deadline: "SEPTEMBER", meta: "FULL-RIDE // FUNDING", link: "https://www.thegatesscholarship.org" },
    { title: "Coca-Cola Scholars Program", category: "scholarship", tags: ["Service", "Merit"], description: "Achievement-based scholarship awarded to graduating high school seniors recognized for their capacity to lead and serve.", deadline: "OCTOBER", meta: "$20,000 AWARD", link: "https://www.coca-colascholarsfoundation.org" },
    { title: "Regeneron Science Talent Search", category: "scholarship", tags: ["STEM", "Research"], description: "The nation's oldest and most prestigious science and math competition for high school seniors doing independent research.", deadline: "NOVEMBER", meta: "UP TO $250,000 PRIZES", link: "https://www.societyforscience.org/regeneron-sts" }
];

let currentMainSector = 'all';

// --- GLOBAL ROUTING & NAVIGATION UNDERLINE ---
window.showPage = function(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(link => link.classList.remove('active-link'));

    const targetPage = document.getElementById(pageId + '-page');
    const targetLink = document.getElementById('nav-' + pageId);

    if (targetPage) targetPage.classList.add('active');
    if (targetLink) targetLink.classList.add('active-link');

    if (pageId === 'dashboard') {
        setTimeout(() => {
            resizeAppCanvas();
            resizeTrailCanvas();
        }, 50);
    }
    if (pageId === 'launchpad') {
        renderLaunchpadGrid(OPPORTUNITIES_DATABASE);
    }

    closeMobileMenu();
};

// --- RUNTIME ERROR LOGGING & DEV HELPERS ---
window.__appErrors = [];
window.addEventListener('error', (e) => {
    try { console.error('App uncaught error:', e.error || e.message || e); } catch (err) {}
    window.__appErrors.push(e && (e.message || String(e)));
});
window.addEventListener('unhandledrejection', (e) => {
    try { console.error('App unhandled rejection:', e.reason || e); } catch (err) {}
    window.__appErrors.push(e && (e.reason && (e.reason.message || String(e.reason))) || 'unhandledrejection');
});

window.__checkRequiredDOM = function(list) {
    const missing = (list || []).filter(id => !document.getElementById(id));
    if (missing.length) console.warn('Missing DOM ids detected:', missing);
    return missing;
};

// --- CORE POMODORO ENGINE WITH BACKGROUND TIME TRACKING & SYNC ---
let timeLeft = 25 * 60;
let timerId = null;
let display = null;
let startBtn = null;

function playChime() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(440, ctx.currentTime);
        gain1.gain.setValueAtTime(0.3, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        gain2.gain.setValueAtTime(0.15, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc1.start(); osc2.start();
        osc1.stop(ctx.currentTime + 1.2); osc2.stop(ctx.currentTime + 1.2);
    } catch (e) { console.log(e); }
}

window.updateDisplay = function() {
    display = document.getElementById('time-display');
    const drawerDisplay = document.getElementById('drawer-time-display');
    
    const hrs = Math.floor(timeLeft / 3600);
    const remSeconds = timeLeft % 3600;
    const mins = Math.floor(remSeconds / 60);
    const secs = remSeconds % 60;
    const formatted = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    if (display) display.textContent = formatted;
    if (drawerDisplay) drawerDisplay.textContent = formatted;
};

window.setTimer = function(minutes, element) {
    clearInterval(timerId);
    timerId = null;
    localStorage.removeItem('timerEndTime');
    localStorage.removeItem('timerIsRunning');
    
    startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.textContent = "START";
    timeLeft = minutes * 60;
    localStorage.setItem('timerTimeLeft', timeLeft);

    if (element) {
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        element.classList.add('active');
    }
    window.updateDisplay();
};

window.toggleTimeDrawer = function() {
    const drawer = document.getElementById('time-limit-drawer');
    if(drawer) {
        drawer.classList.toggle('open');
        localStorage.setItem('drawerOpen', drawer.classList.contains('open'));
    }
};

function restoreTimerState() {
    const isRunning = localStorage.getItem('timerIsRunning') === 'true';
    const savedEndTime = localStorage.getItem('timerEndTime');
    const savedTimeLeft = localStorage.getItem('timerTimeLeft');
    
    if (localStorage.getItem('drawerOpen') === 'true') {
        const drawer = document.getElementById('time-limit-drawer');
        if(drawer) drawer.classList.add('open');
    }

    if (isRunning && savedEndTime) {
        const remaining = Math.ceil((parseInt(savedEndTime) - Date.now()) / 1000);
        if (remaining > 0) {
            timeLeft = remaining;
            window.updateDisplay();
            triggerTimerLoop(parseInt(savedEndTime));
        } else {
            timeLeft = 0;
            window.updateDisplay();
            localStorage.removeItem('timerEndTime');
            localStorage.removeItem('timerIsRunning');
        }
    } else if (savedTimeLeft) {
        timeLeft = parseInt(savedTimeLeft);
        window.updateDisplay();
    }
}

function triggerTimerLoop(targetEndTime) {
    startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.textContent = "PAUSE";
    
    timerId = setInterval(() => {
        const remaining = Math.ceil((targetEndTime - Date.now()) / 1000);
        if (remaining >= 0) {
            timeLeft = remaining;
            localStorage.setItem('timerTimeLeft', timeLeft);
            window.updateDisplay();
        } else {
            clearInterval(timerId);
            timerId = null;
            timeLeft = 0;
            localStorage.setItem('timerTimeLeft', 0);
            localStorage.removeItem('timerEndTime');
            localStorage.removeItem('timerIsRunning');
            if (startBtn) startBtn.textContent = "START";
            playChime();
            setTimeout(() => { alert("Time is up!"); }, 100);
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.__checkRequiredDOM) window.__checkRequiredDOM([
        'time-display','start-btn','reset-btn','custom-settings','custom-min',
        'streak-count-display','trail-canvas','app-canvas','constellation-title','constellation-difficulty',
        'vault-gallery','task-input','task-list','goal-input','goal-list','opps-grid','sub-filter-container',
        'book-title','journal-input','book-cover','book-texture','preview-right-page-element','book-mirror-text',
        'workspace','focus-toggle','book-left-title-render','flipping-paper-sheet','book-count','studio-header-title',
        'deck-card-container','transition-wrapper','chronicle-page-index','chronicle-toggle','realistic-stage','page-index','history-shelf'
    ]);
    
    loadStoredLists();

    startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (timerId) {
                clearInterval(timerId);
                timerId = null;
                startBtn.textContent = "START";
                localStorage.setItem('timerIsRunning', 'false');
                localStorage.setItem('timerTimeLeft', timeLeft);
                localStorage.removeItem('timerEndTime');
            } else {
                const targetEnd = Date.now() + (timeLeft * 1000);
                localStorage.setItem('timerEndTime', targetEnd);
                localStorage.setItem('timerIsRunning', 'true');
                triggerTimerLoop(targetEnd);
            }
        });
    }

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', () => window.setTimer(25));

    restoreTimerState();
    verifyStreakIntegrity(false);
    renderVaultGallery();
});

window.toggleSettings = function() {
    const pnl = document.getElementById('custom-settings');
    if (pnl) pnl.classList.toggle('open');
};

window.applyCustomTime = function() {
    const val = document.getElementById('custom-min').value;
    if (val > 0) {
        window.setTimer(val);
        window.toggleSettings();
    }
};

// --- STREAK CONTINUITY SYSTEM ---
let currentStreak = 0;
let lastActiveDate = "";

function verifyStreakIntegrity(isNewTaskCompleted = false) {
    const todayStr = new Date().toDateString();
    if (isNewTaskCompleted) {
        if (lastActiveDate !== todayStr) {
            const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
            if (lastActiveDate === yesterdayStr || lastActiveDate === "") currentStreak++;
            else currentStreak = 1;
            lastActiveDate = todayStr;
        }
    } else {
        if (lastActiveDate !== "" && lastActiveDate !== todayStr) {
            const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
            if (lastActiveDate !== yesterdayStr) currentStreak = 0;
        }
    }

    const displayEl = document.getElementById('streak-count-display');
    if (displayEl) displayEl.textContent = `${currentStreak} ${currentStreak === 1 ? 'DAY' : 'DAYS'}`;

    const streakBox = document.querySelector('.streak-box');
    if (streakBox) {
        if (currentStreak > 0) streakBox.classList.add('hot-streak');
        else streakBox.classList.remove('hot-streak');
    }
}

// --- CONSTELLATION PATTERNS ---
const SCIENTIFIC_CATALOG = [
    { name: "TRIANGULUM", level: "LEVEL 1 (EASY)", nodes: [{x:40, y:120}, {x:80, y:40}, {x:120, y:120}] },
    { name: "ARIES", level: "LEVEL 2 (EASY)", nodes: [{x:30, y:110}, {x:70, y:70}, {x:110, y:50}, {x:135, y:65}] },
    { name: "CASSIOPEIA", level: "LEVEL 3 (MEDIUM)", nodes: [{x:25, y:60}, {x:50, y:100}, {x:80, y:70}, {x:110, y:110}, {x:135, y:60}] },
    { name: "CYGNUS", level: "LEVEL 4 (HARD)", nodes: [{x:80, y:30}, {x:80, y:75}, {x:40, y:75}, {x:120, y:75}, {x:80, y:115}, {x:80, y:145}] },
    { name: "ORION", level: "LEVEL 5 (MASTER)", nodes: [{x:45, y:40}, {x:115, y:45}, {x:65, y:90}, {x:80, y:90}, {x:95, y:90}, {x:40, y:140}, {x:120, y:135}] }
];

let catalogIndex = 0;
let currentProgressStars = 0;
let vaultCollection = [];
let starNodes = [];

function resizeAppCanvas() {
    const canvas = document.getElementById('app-canvas');
    if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        buildActiveStellarModel();
    }
}

function buildActiveStellarModel() {
    const canvas = document.getElementById('app-canvas');
    if (!canvas) return;
    starNodes = [];

    let targetPattern = SCIENTIFIC_CATALOG[catalogIndex % SCIENTIFIC_CATALOG.length];
    const cTitle = document.getElementById('constellation-title');
    const cDiff = document.getElementById('constellation-difficulty');
    if (cTitle) cTitle.textContent = targetPattern.name;
    if (cDiff) cDiff.textContent = targetPattern.level;

    targetPattern.nodes.forEach((node, index) => {
        starNodes.push({
            x: (node.x / 160) * canvas.width,
            y: (node.y / 160) * canvas.height,
            baseRadius: Math.random() * 1.5 + 1,
            currentRadius: 0,
            active: index < currentProgressStars
        });
    });
}

function advanceAstronomicalProgress() {
    currentProgressStars++;

    let activePattern = SCIENTIFIC_CATALOG[catalogIndex % SCIENTIFIC_CATALOG.length];

    if (currentProgressStars >= activePattern.nodes.length) {
        const timestamp = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        if (!vaultCollection.some(item => item.name === activePattern.name)) {
            vaultCollection.push({ name: activePattern.name, date: timestamp, stars: activePattern.nodes.length });
        }
        catalogIndex++;
        currentProgressStars = 0;
        renderVaultGallery();
    }

    buildActiveStellarModel();
}

function renderVaultGallery() {
    const shelf = document.getElementById('vault-gallery');
    if (!shelf) return;

    if (vaultCollection.length === 0) {
        shelf.innerHTML = `<div class="empty-vault-notice">No completed constellations discovered yet. Execute non-repetitive goals to unlock entries.</div>`;
        return;
    }

shelf.innerHTML = vaultCollection.map(item => `
    <div class="vault-card">
        <div class="icon">🌌</div>

        <div class="title">
            ${item.name}
        </div>

        <div class="stars">
            ${"★".repeat(item.stars)}
        </div>

        <div class="date">
            ${item.date}
        </div>
    </div>
`).join('');
}

function renderAppCanvasLoop() {
    const canvas = document.getElementById('app-canvas');
    if (!canvas) { requestAnimationFrame(renderAppCanvasLoop); return; }

    let appCtx = canvas.getContext('2d');
    appCtx.clearRect(0, 0, canvas.width, canvas.height);

    appCtx.beginPath();
    appCtx.strokeStyle = 'rgba(255, 204, 0, 0.08)';
    appCtx.lineWidth = 0.9;

    let activeNodes = starNodes.filter(n => n.active);
    if (activeNodes.length > 1) {
        appCtx.moveTo(activeNodes[0].x, activeNodes[0].y);
        for (let i = 1; i < activeNodes.length; i++) appCtx.lineTo(activeNodes[i].x, activeNodes[i].y);
    }
    appCtx.stroke();

    starNodes.forEach(node => {
        if (node.active) {
            if (node.currentRadius < node.baseRadius * 2.5) node.currentRadius += 0.15;
            appCtx.fillStyle = 'rgba(255, 204, 0, 0.8)';
            appCtx.shadowBlur = 8;
            appCtx.shadowColor = '#ffcc00';
        } else {
            node.currentRadius = node.baseRadius;
            appCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            appCtx.shadowBlur = 0;
        }
        appCtx.beginPath();
        appCtx.arc(node.x, node.y, node.currentRadius, 0, Math.PI * 2);
        appCtx.fill();
    });

    appCtx.shadowBlur = 0;
    requestAnimationFrame(renderAppCanvasLoop);
}
requestAnimationFrame(renderAppCanvasLoop);

// --- EMBER BOX TRAIL MECHANICS ---
let trailParticles = [];
function resizeTrailCanvas() {
    const tCanvas = document.getElementById('trail-canvas');
    if (tCanvas && tCanvas.parentElement) {
        tCanvas.width = tCanvas.parentElement.clientWidth;
        tCanvas.height = tCanvas.parentElement.clientHeight;
    }
}
function spawnStreakEmbers() {
    const tCanvas = document.getElementById('trail-canvas');
    if (!tCanvas || currentStreak === 0) return;

    let targetX = tCanvas.width * 0.1 + (tCanvas.width * 0.8 * Math.min(currentStreak / 7, 1));

    for (let i = 0; i < 4; i++) {
        trailParticles.push({
            x: targetX - (Math.random() * 10),
            y: tCanvas.height / 2,
            vx: Math.random() * 1 - 0.5,
            vy: -(Math.random() * 1 + 0.3),
            life: 1.0
        });
    }
}
function renderTrailLoop() {
    const tCanvas = document.getElementById('trail-canvas');
    if (!tCanvas) { requestAnimationFrame(renderTrailLoop); return; }

    let tCtx = tCanvas.getContext('2d');
    tCtx.clearRect(0, 0, tCanvas.width, tCanvas.height);

    let startX = tCanvas.width * 0.1;
    let endX = tCanvas.width * 0.9;
    let midY = tCanvas.height / 2;

    tCtx.beginPath();
    tCtx.strokeStyle = 'rgba(255,255,255,0.04)';
    tCtx.lineWidth = 4;
    tCtx.lineCap = 'round';
    tCtx.moveTo(startX, midY);
    tCtx.lineTo(endX, midY);
    tCtx.stroke();

    if (currentStreak > 0) {
        let percentage = Math.min(currentStreak / 7, 1);

        tCtx.beginPath();
        let grad = tCtx.createLinearGradient(startX, midY, endX, midY);
        grad.addColorStop(0, '#ff5500');
        grad.addColorStop(1, '#ffcc00');

        tCtx.strokeStyle = grad;
        tCtx.lineWidth = 4;
        tCtx.lineCap = 'round';
        tCtx.moveTo(startX, midY);
        tCtx.lineTo(startX + (endX - startX) * percentage, midY);
        tCtx.stroke();

        if (Math.random() < 0.2) spawnStreakEmbers();
    }

    for (let i = trailParticles.length - 1; i >= 0; i--) {
        let p = trailParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;

        tCtx.fillStyle = `rgba(255, 120, 0, ${p.life})`;
        tCtx.fillRect(p.x, p.y, 2, 2);

        if (p.life <= 0) trailParticles.splice(i, 1);
    }

    requestAnimationFrame(renderTrailLoop);
}
requestAnimationFrame(renderTrailLoop);

// --- ANTI-SPAM SHIELD MECHANICS ---
let historicalLoggedTasks = [];
let lastExecutionTimestamp = 0;
function checkAntiSpamValidity(rawString) {
    const optimizedStr = rawString.trim().toLowerCase();
    const currentTimestamp = Date.now();

    if (currentTimestamp - lastExecutionTimestamp < 1500) return false;
    if (optimizedStr.length < 3) return false;
    if (historicalLoggedTasks.includes(optimizedStr)) return false;

    lastExecutionTimestamp = currentTimestamp;
    historicalLoggedTasks.push(optimizedStr);
    if (historicalLoggedTasks.length > 50) historicalLoggedTasks.shift();
    return true;
}

// --- LOCAL STORAGE DATA ENGINE FOR TASKS & GOALS ---
function saveListsToStorage() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(li => {
        tasks.push(li.querySelector('.task-text-node').textContent);
    });
    const goals = [];
    document.querySelectorAll('#goal-list li').forEach(li => {
        goals.push(li.querySelector('.task-text-node').textContent.replace('🎯 ', ''));
    });
    localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
    localStorage.setItem('dashboard_goals', JSON.stringify(goals));
}

function loadStoredLists() {
    const storedTasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];
    const storedGoals = JSON.parse(localStorage.getItem('dashboard_goals')) || [];
    
    const taskList = document.getElementById('task-list');
    const goalList = document.getElementById('goal-list');
    
    if(taskList) {
        taskList.innerHTML = '';
        storedTasks.forEach(val => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="task-text-node">${val}</span><input type="checkbox" onchange="window.handleItemCompletion(this)">`;
            taskList.appendChild(li);
        });
    }
    if(goalList) {
        goalList.innerHTML = '';
        storedGoals.forEach(val => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="task-text-node">🎯 ${val}</span><input type="checkbox" onchange="window.handleItemCompletion(this)">`;
            goalList.appendChild(li);
        });
    }
}

// --- TASK ENTRY ACTIONS ---
window.addTask = function() {
    const input = document.getElementById('task-input');
    const val = input ? input.value.trim() : "";
    if (!val) return;

    const li = document.createElement('li');
    li.innerHTML = `<span class="task-text-node">${val}</span><input type="checkbox" onchange="window.handleItemCompletion(this)">`;
    document.getElementById('task-list').appendChild(li);
    input.value = '';
    saveListsToStorage();
};

window.addGoal = function() {
    const input = document.getElementById('goal-input');
    const val = input ? input.value.trim() : "";
    if (!val) return;

    const li = document.createElement('li');
    li.innerHTML = `<span class="task-text-node">🎯 ${val}</span><input type="checkbox" onchange="window.handleItemCompletion(this)">`;
    document.getElementById('goal-list').appendChild(li);
    input.value = '';
    saveListsToStorage();
};

window.handleItemCompletion = function(checkboxElement) {
    if (checkboxElement.checked) {
        const textNode = checkboxElement.parentElement.querySelector('.task-text-node');
        const processingContentString = textNode ? textNode.textContent : "";
        const isSpamShieldClean = checkAntiSpamValidity(processingContentString);

        if (isSpamShieldClean) {
            ActivityTracker.addTask(processingContentString);
            advanceAstronomicalProgress();
            verifyStreakIntegrity(true);
        } else {
            checkboxElement.parentElement.style.borderColor = "rgba(255, 0, 0, 0.4)";
        }

        setTimeout(() => { 
            checkboxElement.parentElement.remove(); 
            saveListsToStorage();
        }, 400);
    }
};

// --- LAUNCHPAD SUBSYSTEM RENDER ENGINE ---
function renderLaunchpadGrid(data) {
    const grid = document.getElementById('opps-grid');
    if (!grid) return;

    if (data.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#444; padding:3rem 0;">No tracks match this sub-category.</div>`;
        return;
    }

    grid.innerHTML = data.map(opp => `
        <div class="opp-card">
            <div>
                <div class="card-top">
                    <span class="category-badge">${opp.category} ${opp.tags.map(t => `<span class="tag-badge">#${t}</span>`).join('')}</span>
                    <span class="deadline-tag">⏳ ${opp.deadline}</span>
                </div>
                <h3>${opp.title}</h3>
                <p>${opp.description}</p>
            </div>
            <div class="card-footer">
                <span class="opp-meta">${opp.meta}</span>
                <a href="${opp.link}" class="apply-link" target="_blank">Launch ↗</a>
            </div>
        </div>
    `).join('');
}

window.filterMain = function(sector, btn) {
    currentMainSector = sector;
    document.querySelectorAll('.filter-btn[data-type="main"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const subBar = document.getElementById('sub-filter-container');
    if (sector === 'all') {
        subBar.classList.add('hidden');
        renderLaunchpadGrid(OPPORTUNITIES_DATABASE);
        return;
    }

    const targetedSectorData = OPPORTUNITIES_DATABASE.filter(item => item.category === sector);
    const uniqueTags = [...new Set(targetedSectorData.flatMap(item => item.tags))];

    if (uniqueTags.length > 0) {
        subBar.classList.remove('hidden');
        subBar.innerHTML = `<button class="filter-btn sub-btn active" onclick="filterSub('all', this)">All ${sector}s</button>` +
            uniqueTags.map(tag => `<button class="filter-btn sub-btn" onclick="filterSub('${tag}', this)">${tag}</button>`).join('');
    } else {
        subBar.classList.add('hidden');
    }

    renderLaunchpadGrid(targetedSectorData);
};

window.filterSub = function(tag, btn) {
    document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const sectorData = OPPORTUNITIES_DATABASE.filter(item => item.category === currentMainSector);

    if (tag === 'all') {
        renderLaunchpadGrid(sectorData);
    } else {
        const doubleFiltered = sectorData.filter(item => item.tags.includes(tag));
        renderLaunchpadGrid(doubleFiltered);
    }
};

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (document.activeElement && document.activeElement.id === 'task-input') window.addTask();
        if (document.activeElement && document.activeElement.id === 'goal-input') window.addGoal();
    }
});

window.addEventListener('resize', () => {
    resizeAppCanvas();
    resizeTrailCanvas();
});

// ===============================
// Thoughts Studio Core Engine
// ===============================
const IlluminatEdThoughts = (function(){
    const Storage = {
        save: (key, val) => localStorage.setItem(`book_studio_${key}`, JSON.stringify(val)),
        get: (key, fallback) => {
            const item = localStorage.getItem(`book_studio_${key}`);
            return item ? JSON.parse(item) : fallback;
        }
    };

    const MOTIVATIONAL_QUOTES = [
        "\"Forget your mood; follow the plan.\"",
        "\"Every exceptional person I know is dangerously consistent.\"",
        "\"Become so skilled, so vigilant, so flat-out fantastic that your talent cannot be dismissed.\"",
        "\"Set goals so high they demand an entirely different version of you.\"",
        "become the standard.",
        "\"Work so hard that their biggest flex is that they used to know you.\"",
        "\"Practice like you've never won, but perform like you've never lost.\"",
        "\"You are who you train yourself to be, not who you hope to become.\"",
        "\"Discipline looks boring until you see what it builds.\"",
        "museum of failure or gallery of trying?",
        "\"When you're good at something, you'll tell everyone. When you're great at something, they'll tell you.\"",
        "\"You can't go back and change the beginning, but you can start where you are and change the ending.\""
    ];

    const WEALTHY_FOOD_PALETTES = [
        { bg: "#f9f6f0", text: "#2c2520" },
        { bg: "#ecdcb9", text: "#3a2e2b" },
        { bg: "#dcedda", text: "#1b2d24" },
        { bg: "#161b22", text: "#e6edf3" },
        { bg: "#3f1418", text: "#faebeb" },
        { bg: "#f7e1e3", text: "#3d2024" }
    ];

    let currentPaletteIndex = Storage.get('palette_idx', 0);
    let compiledBookEntries = Storage.get('entries', []);
    let currentViewingPageIndex = -1;
    let isChronicleModeActive = false;
    let singleChronicleIndex = 0;

    // Elements
    const input = document.getElementById('journal-input');
    const overlay = document.getElementById('quote-placeholder');
    const stamp = document.getElementById('journal-date');
    const historyShelf = document.getElementById('history-shelf');
    const bookCount = document.getElementById('book-count');
    const bookCover = document.getElementById('book-cover');
    const bookTexture = document.getElementById('book-texture');
    const previewRightPageElement = document.getElementById('preview-right-page-element');
    const pageIndexDisplay = document.getElementById('page-index');
    const bookMirrorText = document.getElementById('book-mirror-text');
    const workspace = document.getElementById('workspace');
    const bookTitleInput = document.getElementById('book-title');
    const bookLeftTitleRender = document.getElementById('book-left-title-render');

    const realisticStage = document.getElementById('realistic-stage');
    const deckCardContainer = document.getElementById('deck-card-container');
    const transitionWrapper = document.getElementById('transition-wrapper');
    const chroniclePageDisplay = document.getElementById('chronicle-page-index');

    function getCurrentActiveDayLabel(){
        if(currentViewingPageIndex !== -1) return `DAY ${currentViewingPageIndex + 1} (EDITING)`;
        return `DAY ${compiledBookEntries.length + 1}`;
    }

    function updatePageIndicator(){
        if(!pageIndexDisplay) return;
        if(compiledBookEntries.length === 0) pageIndexDisplay.textContent = '0 / 0';
        else if(currentViewingPageIndex === -1) pageIndexDisplay.textContent = `- / ${compiledBookEntries.length}`;
        else pageIndexDisplay.textContent = `${currentViewingPageIndex + 1} / ${compiledBookEntries.length}`;
    }

    function updateRandomQuote(){
        const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
        if(overlay) overlay.textContent = MOTIVATIONAL_QUOTES[randomIndex];
    }

    function updateHistoryUI() {
        if(historyShelf) {
            historyShelf.innerHTML = '';
            compiledBookEntries.forEach((entry, idx) => {
                const item = document.createElement('div');
                item.className = 'history-item';
                item.style.cssText = "padding: 8px 12px; margin-bottom: 6px; background: rgba(255,255,255,0.03); border-radius: 6px; cursor: pointer;";
                item.innerHTML = `
<div class="receipt-day">
    DAY ${String(idx + 1).padStart(2,"0")}
</div>

<div class="receipt-date">
    ${(entry.date || "").toUpperCase()}
</div>

<div class="receipt-divider"></div>

<div class="receipt-meta">
    ARCHIVED ENTRY
</div>
`;
                item.onclick = () => loadEntryForEditing(idx);
                historyShelf.appendChild(item);
            });
        }
        if(bookCount) bookCount.textContent = `${compiledBookEntries.length} ENTRIES`;
    }

    function loadEntryForEditing(idx) {
        if(idx < 0 || idx >= compiledBookEntries.length) return;
        currentViewingPageIndex = idx;
        const entry = compiledBookEntries[idx];
        if(input) input.value = entry.text || '';
        if(bookMirrorText) bookMirrorText.textContent = entry.text || '...';
        if(overlay) overlay.style.opacity = entry.text ? '0' : '1';
        if(stamp) stamp.textContent = `DAY ${idx + 1} (EDITING)`;
        updatePageIndicator();
    }

    function resetInputWorkspace(){
        if(input) input.value = '';
        if(bookMirrorText) bookMirrorText.textContent = '...';
        if(overlay) overlay.style.opacity = '1';
        currentViewingPageIndex = -1;
        if(stamp) stamp.textContent = getCurrentActiveDayLabel();
        updatePageIndicator();
    }

    function renderSingleDeckContent(){
        if(!deckCardContainer || !transitionWrapper || !chroniclePageDisplay) return;

        const currentTitle = (bookTitleInput && bookTitleInput.value) || 'Thoughts';
        const currentPalette = WEALTHY_FOOD_PALETTES[currentPaletteIndex];

        if(singleChronicleIndex === 0){
            deckCardContainer.className = 'single-deck-card display-cover';
            if(bookCover) deckCardContainer.style.background = bookCover.style.background || 'linear-gradient(135deg, #2b1f11 0%, #1c150c 100%)';
            deckCardContainer.style.color = 'white';
            chroniclePageDisplay.textContent = 'COVER';

            transitionWrapper.innerHTML = `
                <div style="margin: auto; text-align: center;">
                    <h1 class="cover-title-text">${currentTitle.toUpperCase()}</h1>
                    <div class="cover-separator" style="margin: 1.5rem auto;"></div>
                    <p class="cover-sub-text">Volume I</p>
                </div>
            `;
            return;
        }

        deckCardContainer.className = 'single-deck-card display-page';
        deckCardContainer.style.background = currentPalette.bg;
        deckCardContainer.style.backgroundColor = currentPalette.bg;
        deckCardContainer.style.color = currentPalette.text;
        chroniclePageDisplay.textContent = `${singleChronicleIndex} / ${compiledBookEntries.length}`;

        const entry = compiledBookEntries[singleChronicleIndex - 1];
        const entryBodyText = `[ DAY ${singleChronicleIndex} ]\n\n${entry ? entry.text : 'No data collected.'}`;

        transitionWrapper.innerHTML = `
            <div class="page-header-real" style="color: ${currentPalette.text}; opacity: 0.7; border-bottom: 1px solid rgba(0,0,0,0.15); padding-bottom: 8px; margin-bottom: 12px; font-weight:600;">${currentTitle}</div>
            <div id="inner-deck-body" class="page-body-real" style="color: ${currentPalette.text}; whitespace: pre-wrap; line-height: 1.6;"></div>
        `;
        const inner = document.getElementById('inner-deck-body');
        if(inner) inner.textContent = entryBodyText;
    }

    function applyCoverPreset(backgroundStyle, textureStyle){
        document.documentElement.style.setProperty('--cover-color', backgroundStyle.includes('gradient') ? '#222' : backgroundStyle);
        if(bookCover) bookCover.style.background = backgroundStyle;
        if(bookTexture) {
            bookTexture.style.backgroundImage = textureStyle || '';
            if(textureStyle) bookTexture.style.backgroundSize = '12px 12px';
        }

        Storage.save('cover_bg', backgroundStyle);
        Storage.save('cover_tex', textureStyle || '');

        if(singleChronicleIndex === 0) renderSingleDeckContent();
    }

    function cycleGourmetPageColor(direction){
        currentPaletteIndex += direction;
        if(currentPaletteIndex < 0) currentPaletteIndex = WEALTHY_FOOD_PALETTES.length - 1;
        if(currentPaletteIndex >= WEALTHY_FOOD_PALETTES.length) currentPaletteIndex = 0;

        const selectedPalette = WEALTHY_FOOD_PALETTES[currentPaletteIndex];
        document.documentElement.style.setProperty('--book-page', selectedPalette.bg);
        document.documentElement.style.setProperty('--page-text', selectedPalette.text);
        Storage.save('palette_idx', currentPaletteIndex);

        if(previewRightPageElement){
            previewRightPageElement.style.background = selectedPalette.bg;
            const bodyTextNode = previewRightPageElement.querySelector('.book-page-body');
            if(bodyTextNode) bodyTextNode.style.color = selectedPalette.text;
        }

        renderSingleDeckContent();
    }

    function commitCurrentDayLog() {
        const text = input ? input.value.trim() : '';
        if(!text) {
            alert("Please write a log entry before committing!");
            return;
        }
        const todayStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

        if(currentViewingPageIndex !== -1) {
            compiledBookEntries[currentViewingPageIndex] = { text: text, date: todayStr };
        } else {
            compiledBookEntries.push({ text: text, date: todayStr });
        }

        Storage.save('entries', compiledBookEntries);
        updateHistoryUI();
        resetInputWorkspace();
        updateRandomQuote();

        singleChronicleIndex = compiledBookEntries.length;
        renderSingleDeckContent();
    }

    function turnSingleChronicleDeck(direction) {
        const maxIndex = compiledBookEntries.length;
        singleChronicleIndex += direction;
        if(singleChronicleIndex < 0) singleChronicleIndex = 0;
        if(singleChronicleIndex > maxIndex) singleChronicleIndex = maxIndex;
        renderSingleDeckContent();
    }

    function toggleChronicleMode() {
        isChronicleModeActive = !isChronicleModeActive;
        const controls = document.getElementById("thoughts-controls");
const chronicleBtn = controls?.querySelector(".chronicle-btn");
const toggleBtn = controls?.querySelector(".toggle-sidebar-btn");
        if (realisticStage) {
    realisticStage.classList.toggle("show-mode", isChronicleModeActive);
    realisticStage.classList.toggle("grow-in", isChronicleModeActive);
}
        if(workspace) workspace.style.display = isChronicleModeActive ? 'none' : 'flex';
        if (chronicleBtn) {

    chronicleBtn.textContent = isChronicleModeActive
        ? "← Back to Studio"
        : "View Chronicles";

}

if (toggleBtn) {

    toggleBtn.style.display = isChronicleModeActive
        ? "none"
        : "";

}
        if(isChronicleModeActive) renderSingleDeckContent();
    }

    function toggleFocusMode() {
        if(workspace) workspace.classList.toggle('focus-mode');
    }

    function triggerPageTurnAnimation(direction) {
        if(currentViewingPageIndex === -1 && direction < 0) {
            if(compiledBookEntries.length > 0) loadEntryForEditing(compiledBookEntries.length - 1);
        } else {
            let newIdx = currentViewingPageIndex + direction;
            if(newIdx >= 0 && newIdx < compiledBookEntries.length) {
                loadEntryForEditing(newIdx);
            } else if(newIdx >= compiledBookEntries.length) {
                resetInputWorkspace();
            }
        }
    }

    // Input Events
    if(bookTitleInput){
        bookTitleInput.oninput = () => {
            const titleValue = bookTitleInput.value || 'Thoughts';
            if(bookLeftTitleRender) bookLeftTitleRender.textContent = titleValue;
            const studioHeaderTitle = document.getElementById('studio-header-title');
            if(studioHeaderTitle) studioHeaderTitle.textContent = titleValue;
            Storage.save('title', titleValue);
            renderSingleDeckContent();
        };
    }

    if(input){
        input.oninput = () => {
            const v = input.value;
            if(v && v.length > 0){
                if(overlay) overlay.style.opacity = '0';
                if(bookMirrorText) bookMirrorText.textContent = v;
            } else {
                if(overlay) overlay.style.opacity = '1';
                if(bookMirrorText) bookMirrorText.textContent = '...';
            }
            if(bookMirrorText) bookMirrorText.scrollTop = bookMirrorText.scrollHeight;
        };
    }

    // Initialize Studio on DOM Ready
    (function initStudio(){
        const savedTitle = Storage.get('title','Thoughts');
        if(bookTitleInput) bookTitleInput.value = savedTitle;
        if(bookLeftTitleRender) bookLeftTitleRender.textContent = savedTitle;
        const studioHeaderTitle = document.getElementById('studio-header-title');
        if(studioHeaderTitle) studioHeaderTitle.textContent = savedTitle;

        const savedBg = Storage.get('cover_bg','linear-gradient(135deg, #2b1f11 0%, #1c150c 100%)');
        const savedTex = Storage.get('cover_tex','');
        applyCoverPreset(savedBg, savedTex);

        updateHistoryUI();
        resetInputWorkspace();
        cycleGourmetPageColor(0);
        updateRandomQuote();
        renderSingleDeckContent();
    })();

    return {
        toggleFocusMode,
        toggleChronicleMode,
        cycleGourmetPageColor,
        applyCoverPreset,
        triggerPageTurnAnimation,
        turnSingleChronicleDeck,
        commitCurrentDayLog,
        updateHistoryUI,
        resetInputWorkspace
    };
})();

// Attach globally so HTML buttons work!
window.IlluminatEdThoughts = IlluminatEdThoughts;

function toggleMobileMenu(){

    document
        .querySelector(".mobile-menu")
        .classList
        .toggle("show");

}

function closeMobileMenu() {
    document
        .querySelector(".mobile-menu")
        .classList
        .remove("show");
}

document.addEventListener("click", function(e) {

    const menu = document.querySelector(".mobile-menu");
    const button = document.querySelector(".mobile-menu-btn");

    if (
        menu &&
        button &&
        menu.classList.contains("show") &&
        !menu.contains(e.target) &&
        !button.contains(e.target)
    ) {
        closeMobileMenu();
    }

});
function showStudioTab(tab, button) {

    // remove active state from all buttons
    document.querySelectorAll(".studio-tab")
        .forEach(btn => btn.classList.remove("active"));

    // activate clicked button
    button.classList.add("active");

    startStudioParticles(button);

    // hide all panels
    document.querySelectorAll(".studio-panel")
        .forEach(panel => panel.classList.remove("active-panel"));

    // show requested panel
    const panel = document.getElementById("studio-" + tab);

    if (panel) {
        panel.classList.add("active-panel");
    }
}
let studioSparkLoop = null;

function stopStudioParticles(){

    clearInterval(studioSparkLoop);

}

function startStudioParticles(button){

    stopStudioParticles();

    studioSparkLoop = setInterval(()=>{

        const spark = document.createElement("div");
        spark.className = "spark-particle";

        const side = Math.floor(Math.random() * 4);

switch(side){

    // top
    case 0:
        spark.style.left = Math.random() * 100 + "%";
        spark.style.top = "-4px";
        break;

    // right
    case 1:
        spark.style.left = "calc(100% + 4px)";
        spark.style.top = Math.random() * 100 + "%";
        break;

    // bottom
    case 2:
        spark.style.left = Math.random() * 100 + "%";
        spark.style.top = "calc(100% + 4px)";
        break;

    // left
    case 3:
        spark.style.left = "-4px";
        spark.style.top = Math.random() * 100 + "%";
        break;

}

        const angle = Math.random() * Math.PI * 2;
const distance = 35 + Math.random() * 45;

spark.style.setProperty(
    "--x",
    Math.cos(angle) * distance + "px"
);

spark.style.setProperty(
    "--y",
    Math.sin(angle) * distance + "px"
);

        button.appendChild(spark);

        spark.addEventListener("animationend",()=>{

            spark.remove();

        });

    },350);

}