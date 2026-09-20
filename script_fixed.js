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

    // MIGRATION: convert old string entries to array-of-parts
compiledBookEntries = compiledBookEntries.map(entry => {
    if (typeof entry.text === 'string') {
        // split old entries on the em-dash separator
        const parts = entry.text.split(/\n*— — —\n*/).map(p => p.trim()).filter(Boolean);
        return { text: parts.length ? parts : [entry.text], date: entry.date };
    }
    return entry; // already array
});
Storage.save('entries', compiledBookEntries);

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

    function updateMobilePastButtonState() {
    const pastBtn = document.getElementById('mobile-past-btn');
    const commitBtn = document.getElementById('commit-day-btn');
    if (!pastBtn) return;

    if (currentViewingPageIndex === -1) {
        pastBtn.textContent = '◀ PAST';
        if (commitBtn) commitBtn.style.display = '';
    } else {
        pastBtn.textContent = 'NOW ▶';
        if (commitBtn) commitBtn.style.display = 'none';
    }
}

function handleMobilePastButton() {
    if (currentViewingPageIndex === -1) {
        openMobileHistory();
    } else {
        resetInputWorkspace();
    }
}

function openMobileHistory() {
    const overlay = document.getElementById('mobile-history-overlay');
    if (!overlay) return;
    updateMobileHistoryUI();
    overlay.classList.add('open');
}

function closeMobileHistory(event) {
    const overlay = document.getElementById('mobile-history-overlay');
    if (!overlay) return;
    if (event && event.target !== overlay) return;
    overlay.classList.remove('open');
}

function updateMobileHistoryUI() {
    const list = document.getElementById('mobile-history-list');
    if (!list) return;

    list.innerHTML = '';
    if (compiledBookEntries.length === 0) {
        list.innerHTML = `<div style="text-align:center;color:#666;padding:2rem 0;font-style:italic;">No past entries yet.</div>`;
        return;
    }

    compiledBookEntries.forEach((entry, idx) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="receipt-day">DAY ${String(idx + 1).padStart(2, "0")}</div>
            <div class="receipt-date">${(entry.date || "").toUpperCase()}</div>
            <div class="receipt-divider"></div>
            <div class="receipt-meta">TAP TO EDIT</div>
        `;
        item.onclick = () => {
            loadEntryForEditing(idx);
            closeMobileHistory();
            updateMobilePastButtonState();
        };
        list.appendChild(item);
    });
}

    function loadEntryForEditing(idx) {
    if(idx < 0 || idx >= compiledBookEntries.length) return;
    currentViewingPageIndex = idx;
    const entry = compiledBookEntries[idx];

    const parts = Array.isArray(entry.text) ? entry.text : [entry.text || ''];

    if(input) {
        input.innerHTML = parts
            .map(p => `<div class="entry-part">${String(p)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br>')}</div>`)
            .join('<hr class="entry-divider" contenteditable="false">');
    }
    if(bookMirrorText) bookMirrorText.textContent = parts.join('\n\n') || '...';
    if(overlay) overlay.style.opacity = parts.join('').trim() ? '0' : '1';
    if(stamp) stamp.textContent = `DAY ${idx + 1} (EDITING)`;
    updatePageIndicator();
    updateMobilePastButtonState();
}

    function resetInputWorkspace(){
    if(input) input.innerHTML = '';
    if(bookMirrorText) bookMirrorText.textContent = '...';
    if(overlay) overlay.style.opacity = '1';
    currentViewingPageIndex = -1;
    if(stamp) stamp.textContent = getCurrentActiveDayLabel();
    updatePageIndicator();
    updateMobilePastButtonState();
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
const parts = entry && Array.isArray(entry.text)
    ? entry.text
    : (entry ? [entry.text] : ['No data collected.']);

const bodyHtml = parts
    .map(p => `<div class="chronicle-part" style="white-space: pre-wrap; line-height: 1.6;">${p.replace(/</g, '&lt;')}</div>`)
    .join('<hr class="entry-divider">');

transitionWrapper.innerHTML = `
    <div class="page-header-real" style="color: ${currentPalette.text}; opacity: 0.7; border-bottom: 1px solid rgba(0,0,0,0.15); padding-bottom: 8px; margin-bottom: 12px; font-weight:600;">${currentTitle}</div>
    <div id="inner-deck-body" class="page-body-real" style="color: ${currentPalette.text};">[ DAY ${singleChronicleIndex} ]<br><br>${bodyHtml}</div>
`;
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

    function extractPartsFromEditor(el) {
    if (!el) return [];

    const parts = [];
    let current = '';

    const flush = () => {
        const trimmed = current.trim();
        if (trimmed) parts.push(trimmed);
        current = '';
    };

    const walk = (node) => {
        node.childNodes.forEach(child => {
            if (child.nodeType === 1) {
                // element node
                if (child.tagName === 'HR' && child.classList.contains('entry-divider')) {
                    flush();
                } else if (child.tagName === 'BR') {
                    current += '\n';
                } else if (child.tagName === 'DIV' || child.tagName === 'P') {
                    // block → treat as line break before/after
                    if (current && !current.endsWith('\n')) current += '\n';
                    walk(child);
                    if (current && !current.endsWith('\n')) current += '\n';
                } else {
                    walk(child);
                }
            } else if (child.nodeType === 3) {
                // text node
                current += child.textContent;
            }
        });
    };

    walk(el);
    flush();

    return parts;
}

   function commitCurrentDayLog() {
    const parts = extractPartsFromEditor(input);

    if(parts.length === 0) {
        alert("Please write a log entry before committing!");
        return;
    }

    const todayStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    if(currentViewingPageIndex !== -1) {
        compiledBookEntries[currentViewingPageIndex] = { text: parts, date: todayStr };
    } else {
        const lastIndex = compiledBookEntries.length - 1;
        const lastEntry = lastIndex >= 0 ? compiledBookEntries[lastIndex] : null;

        if(lastEntry && lastEntry.date === todayStr) {
            const lastParts = Array.isArray(lastEntry.text) ? lastEntry.text : [lastEntry.text];
            compiledBookEntries[lastIndex] = {
                text: [...lastParts, ...parts],
                date: todayStr
            };
        } else {
            compiledBookEntries.push({ text: parts, date: todayStr });
        }
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
            const v = input.innerText || '';
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
        resetInputWorkspace,
        handleMobilePastButton,
        openMobileHistory,
        closeMobileHistory,
        updateMobileHistoryUI
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
// ==========================================
// SLEEP NOTIFICATION (12AM – 4AM)
// ==========================================

const SLEEP_MESSAGES = [
    "The stars are out. Your mind needs sleep to remember what you learned today. Rest — you can pick this up tomorrow.",
    "It's late. The best students aren't the ones who never stop — they're the ones who know when to rest.",
    "Nothing you learn at 2 AM will stick like it would tomorrow morning. Sleep is part of the work.",
    "The embers are dimming. Step away, breathe, sleep. Your future self will thank you.",
    "You've done enough for today. Rest is not laziness — it's strategy."
];

function isLateNight() {
    const hour = new Date().getHours();
    return hour >= 0 && hour < 4;
}

function pickSleepMessage() {
    return SLEEP_MESSAGES[Math.floor(Math.random() * SLEEP_MESSAGES.length)];
}

function isMobileViewport() {
    return window.matchMedia('(max-width: 768px)').matches;
}

let sleepToastTimer = null;

function showSleepToast() {
    const toast = document.getElementById('sleep-toast');
    const backdrop = document.getElementById('sleep-toast-backdrop');
    const textEl = document.getElementById('sleep-toast-text');
    if (!toast) return;

    if (textEl) textEl.textContent = pickSleepMessage();

    if (backdrop) backdrop.classList.add('open');

    toast.classList.remove('dismissing');
    toast.classList.add('open');

    clearTimeout(sleepToastTimer);
    sleepToastTimer = setTimeout(() => {
        dismissSleepToast();
    }, 9000);
}

function dismissSleepToast() {
    const toast = document.getElementById('sleep-toast');
    const backdrop = document.getElementById('sleep-toast-backdrop');
    if (!toast) return;

    toast.classList.remove('open');
    toast.classList.add('dismissing');
    if (backdrop) backdrop.classList.remove('open');

    clearTimeout(sleepToastTimer);

    setTimeout(() => {
        toast.classList.remove('dismissing');
    }, 600);
}

window.tapSleepToast = function() {
    // tap → dismiss toast AND show the full modal (mobile users get the ritual card too)
    dismissSleepToast();

    // temporarily force the modal to show even on mobile for this one tap
    const modal = document.getElementById('sleep-modal');
    const textEl = document.getElementById('sleep-modal-text');
    if (!modal) return;

    if (textEl) textEl.textContent = pickSleepMessage();

    modal.classList.add('open');
    modal.classList.add('force-show');

    // remove the force-show class once closed
    const observer = new MutationObserver(() => {
        if (!modal.classList.contains('open')) {
            modal.classList.remove('force-show');
            observer.disconnect();
        }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
};

function showSleepModal() {
    const modal = document.getElementById('sleep-modal');
    const textEl = document.getElementById('sleep-modal-text');
    if (!modal) return;

    if (textEl) textEl.textContent = pickSleepMessage();

    modal.classList.add('open');
}

window.closeSleepModal = function() {
    const modal = document.getElementById('sleep-modal');
    if (!modal) return;
    if (modal.classList.contains('closing')) return;

    modal.classList.add('closing');

    setTimeout(() => {
        modal.classList.remove('open');
        modal.classList.remove('closing');
    }, 600);
};

// Override the mobile CSS hide when force-show is on
const sleepStyle = document.createElement('style');
sleepStyle.textContent = `
    @media (max-width: 768px) {
        .sleep-modal.force-show.open {
            display: flex !important;
        }
    }
`;
document.head.appendChild(sleepStyle);

// Trigger on load
(function initSleepCheck() {
    if (!isLateNight()) return;
    if (sessionStorage.getItem('sleep_modal_shown') === 'true') return;

    setTimeout(() => {
        if (isMobileViewport()) {
            showSleepToast();
        } else {
            showSleepModal();
        }
        sessionStorage.setItem('sleep_modal_shown', 'true');
    }, 1200);
})();

// ==========================================
// STORY PAGE — EVIDENCE CARDS
// ==========================================

const EVIDENCE_DATA = [
    {
        label: 'STREAKS',
        stat: '+0.17σ',
        sub: 'higher math scores',
        summary: 'A field experiment with 60,000 students tested whether highlighting study streaks would boost engagement. It worked — students scored significantly higher on end-of-term math tests and stayed consistent week after week.',
        link: 'https://www.nber.org/papers/w29161'
    },
    {
        label: 'ACHIEVEMENTS',
        stat: 'moderate+',
        sub: 'improvement across courses',
        summary: 'Research on gamification across university courses found that achievement badges improved student performance and guided behavior — students did the actions that earned them.',
        link: 'https://www.sciencedirect.com/science/article/abs/pii/S0360131514001625'
    },
    {
        label: 'PROCRASTINATION',
        stat: 'fear-driven',
        sub: 'not laziness',
        summary: 'Fear of failure is a primary driver of academic procrastination. Students don\'t procrastinate because they\'re lazy — it\'s emotional, not a time-management problem.',
        link: 'https://www.nature.com/articles/s41598-022-26967-2'
    },
    {
        label: 'SLEEP',
        stat: '-12%',
        sub: 'exam score drop',
        summary: 'Sleep efficiency and consistency predict exam performance more than total hours. Students who vary their sleep schedule most score the lowest.',
        link: 'https://www.nature.com/articles/s41598-023-41990-4'
    },
    {
        label: 'ACTIVE RECALL',
        stat: '2x',
        sub: 'better retention',
        summary: 'Self-testing beats rereading your notes for long-term retention. It feels harder — that\'s why it works.',
        link: 'https://pubmed.ncbi.nlm.nih.gov/26173288/'
    },
    {
        label: 'OPPORTUNITIES',
        stat: 'structured',
        sub: '> random searching',
        summary: 'Students without structured access to opportunity information miss deadlines and programs they\'d qualify for. The information gap is real.',
        link: 'https://www.nassp.org/publication/principal-leadership/volume-20/principal-leadership-february-2020/access-to-opportunity-and-the-power-of-networks/'
    }
];

(function initEvidence() {

    // Render cards
    const grid = document.getElementById('evidence-grid');
    if (!grid) return;

    grid.innerHTML = EVIDENCE_DATA.map((card, i) => `
        <button class="evidence-card" onclick="openEvidenceModal(${i})">
            <div class="evidence-card-label">${card.label}</div>
            <div class="evidence-card-stat">${card.stat}</div>
            <div class="evidence-card-sub">${card.sub}</div>
        </button>
    `).join('');

    // Reveal observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('#story-page .reveal').forEach(el => {
        revealObserver.observe(el);
    });

})();

window.openEvidenceModal = function(i) {
    const card = EVIDENCE_DATA[i];
    if (!card) return;

    document.getElementById('evidence-modal-label').textContent = card.label;
    document.getElementById('evidence-modal-stat').textContent = card.stat;
    document.getElementById('evidence-modal-title').textContent = card.sub;
    document.getElementById('evidence-modal-summary').textContent = card.summary;
    document.getElementById('evidence-modal-link').href = card.link;

    document.getElementById('evidence-modal').classList.add('open');
};

window.closeEvidenceModal = function(event) {
    const modal = document.getElementById('evidence-modal');
    if (!modal) return;
    if (event && event.target !== modal) return;
    modal.classList.remove('open');
};

// Navigation
window.enterTryMode = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('login-page').classList.add('active');
};

window.goToLogin = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('login-page').classList.add('active');
};

// ==========================================
// STORY PAGE — LIVE STARFIELD (with sparkle)
// ==========================================

(function initStarfield() {
    const canvas = document.getElementById('story-stars');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Evenly spread stars using grid jitter
    const STAR_COUNT = 220;
    const stars = [];
    const cols = Math.ceil(Math.sqrt(STAR_COUNT * (W / H)));
    const rows = Math.ceil(STAR_COUNT / cols);
    const cellW = W / cols;
    const cellH = H / rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            stars.push({
                x: c * cellW + Math.random() * cellW,
                y: r * cellH + Math.random() * cellH,
                baseR: Math.random() * 1.1 + 0.3,
                twinkleOffset: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.6 + Math.random() * 1.8,
                isGold: Math.random() < 0.3
            });
        }
    }

    const startTime = Date.now();
    let t = 0;

    function draw() {
        t += 0.016;
        const age = (Date.now() - startTime) / 1000;
        const globalFade = Math.min(1, age / 2.5); // fade in over 2.5s

        ctx.clearRect(0, 0, W, H);

        stars.forEach(s => {
            const twinkle = (Math.sin(t * s.twinkleSpeed + s.twinkleOffset) + 1) / 2;
            const flare = Math.pow(twinkle, 4); // sharp peak = sparkle
            const alpha = (0.15 + twinkle * 0.5 + flare * 0.5) * globalFade;
            const radius = s.baseR + flare * 1.2;

            ctx.beginPath();
            if (s.isGold) {
                ctx.fillStyle = `rgba(255, 204, 0, ${alpha})`;
                ctx.shadowBlur = 8 + flare * 14;
                ctx.shadowColor = 'rgba(255, 204, 0, 0.9)';
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
                ctx.shadowBlur = 5 + flare * 10;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
            }
            ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.shadowBlur = 0;
        requestAnimationFrame(draw);
    }
    draw();
})();

// ==========================================
// PHASE 2 — SELF-ANIMATING PREVIEWS
// ==========================================

(function initPreviewCards() {

    // -------- 01 · TIMER --------
    const timerDisplay = document.getElementById('preview-timer-display');
    const timerFill = document.getElementById('preview-timer-fill');

    if (timerDisplay && timerFill) {
        let secondsLeft = 25 * 60;
        const totalSeconds = 25 * 60;

        setInterval(() => {
            secondsLeft--;
            if (secondsLeft < 0) secondsLeft = totalSeconds;

            const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
            const s = (secondsLeft % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${m}:${s}`;
            timerFill.style.width = `${(secondsLeft / totalSeconds) * 100}%`;
        }, 1000);
    }

    // -------- 02 · JOURNAL (types itself) --------
    const journalBody = document.getElementById('preview-journal-body');
    let hasStartedJournal = false;

    function startJournalTyping() {
        if (hasStartedJournal || !journalBody) return;
        hasStartedJournal = true;

        journalBody.innerHTML = '';

        const sequence = [
            { type: 'text', value: "today i studied for 47 minutes. didn't check my phone once." },
            { type: 'divider' },
            { type: 'text', value: "started the essay. actually started it." }
        ];

        let html = '';
        let sIdx = 0;
        let cIdx = 0;

        function typeChar() {
            if (sIdx >= sequence.length) {
                journalBody.innerHTML = html.replace(/<span class="caret"><\/span>/, '');
                return;
            }

            const step = sequence[sIdx];

            if (step.type === 'divider') {
                html = html.replace(/<span class="caret"><\/span>/, '');
                html += '<span class="mini-divider"></span>';
                sIdx++;
                cIdx = 0;
                journalBody.innerHTML = html + '<span class="caret"></span>';
                setTimeout(typeChar, 500);
                return;
            }

            const line = step.value;
            if (cIdx < line.length) {
                html = html.replace(/<span class="caret"><\/span>/, '');
                html += line[cIdx];
                html += '<span class="caret"></span>';
                cIdx++;
                journalBody.innerHTML = html;
                setTimeout(typeChar, 28);
            } else {
                html = html.replace(/<span class="caret"><\/span>/, '');
                if (sIdx < sequence.length - 1) html += '<br><br>';
                sIdx++;
                cIdx = 0;
                journalBody.innerHTML = html + '<span class="caret"></span>';
                setTimeout(typeChar, 500);
            }
        }

        typeChar();
    }

    // -------- REVEAL OBSERVER --------
    const previewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.dataset.preview === 'journal') {
                    setTimeout(startJournalTyping, 500);
                }
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.preview-card').forEach(el => {
        previewObserver.observe(el);
    });

})();

// ==========================================
// PHASE 2 — HALF B PREVIEWS
// ==========================================

(function initHalfB() {

    // -------- 03 · CONSTELLATION --------
    const cCanvas = document.getElementById('preview-constellation-canvas');
    if (cCanvas) {
        const cCtx = cCanvas.getContext('2d');
        let cW, cH;

        function resizeC() {
            const rect = cCanvas.getBoundingClientRect();
            cW = cCanvas.width = rect.width;
            cH = cCanvas.height = rect.height;
        }

        // Cassiopeia — 5 points, normalized
        const STARS = [
            { x: 0.15, y: 0.35 },
            { x: 0.32, y: 0.65 },
            { x: 0.50, y: 0.40 },
            { x: 0.68, y: 0.70 },
            { x: 0.85, y: 0.30 }
        ];

        let visibleStars = 0;
        const starRadii = STARS.map(() => 0);
        let hasStarted = false;

        function drawConstellation() {
            cCtx.clearRect(0, 0, cW, cH);

            // connecting lines
            cCtx.strokeStyle = 'rgba(255, 204, 0, 0.4)';
            cCtx.lineWidth = 1.2;
            cCtx.beginPath();
            for (let i = 0; i < visibleStars - 1; i++) {
                const a = STARS[i];
                const b = STARS[i + 1];
                cCtx.moveTo(a.x * cW, a.y * cH);
                cCtx.lineTo(b.x * cW, b.y * cH);
            }
            cCtx.stroke();

            // stars
            STARS.forEach((s, i) => {
                if (i >= visibleStars) return;
                const x = s.x * cW;
                const y = s.y * cH;

                if (starRadii[i] < 4) starRadii[i] += 0.15;

                cCtx.fillStyle = 'rgba(255, 204, 0, 0.9)';
                cCtx.shadowBlur = 20;
                cCtx.shadowColor = '#ffcc00';
                cCtx.beginPath();
                cCtx.arc(x, y, starRadii[i], 0, Math.PI * 2);
                cCtx.fill();
            });
            cCtx.shadowBlur = 0;

            requestAnimationFrame(drawConstellation);
        }

        function startConstellation() {
            if (hasStarted) return;
            hasStarted = true;

            resizeC();
            window.addEventListener('resize', resizeC);

            // reveal one star every 500ms
            const interval = setInterval(() => {
                visibleStars++;
                if (visibleStars >= STARS.length) {
                    clearInterval(interval);
                    const label = document.querySelector('.mini-constellation-label');
                    if (label) label.classList.add('visible');
                }
            }, 500);

            drawConstellation();
        }

        window.__startConstellation = startConstellation;
    }

    // -------- 04 · SLEEP TOAST --------
    let sleepInterval = null;
    function startSleepLoop() {
        if (sleepInterval) return;
        const toast = document.querySelector('.mini-sleep-toast');
        if (!toast) return;

        function showThenHide() {
            toast.classList.add('visible');
            setTimeout(() => {
                toast.classList.remove('visible');
            }, 4500);
        }

        // first show after 800ms
        setTimeout(showThenHide, 800);
        // then loop every 8s
        sleepInterval = setInterval(showThenHide, 8000);
    }

    window.__startSleepLoop = startSleepLoop;

    // -------- 05 · LAUNCHPAD --------
    function buildLaunchpad() {
        const scroll = document.getElementById('preview-launchpad-scroll');
        if (!scroll) return;

        const items = [
            { title: 'Breakthrough Junior Challenge', meta: '$250K SCHOLARSHIP' },
            { title: 'NASA Space Apps Challenge', meta: 'FREE // GLOBAL' },
            { title: 'John Locke Essay Competition', meta: 'OXFORD EVAL' },
            { title: 'The Gates Scholarship', meta: 'FULL-RIDE' },
            { title: 'Regeneron Science Talent Search', meta: 'UP TO $250K' },
            { title: 'Yale Young Global Scholars', meta: 'YALE CAMPUS' }
        ];

        // duplicate items so scroll loops seamlessly
        const doubled = [...items, ...items, ...items];
        scroll.innerHTML = `<div class="mini-launchpad-track">${doubled.map(item => `
    <div class="mini-launchpad-item">
        <div class="mini-launchpad-item-title">${item.title}</div>
        <div class="mini-launchpad-item-meta">${item.meta}</div>
    </div>
`).join('')}</div>`;
    }
    buildLaunchpad();

    // -------- TRIGGER ALL THREE ON SCROLL --------
    const halfBObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const type = entry.target.dataset.preview;
                if (type === 'constellation' && window.__startConstellation) {
                    setTimeout(window.__startConstellation, 400);
                }
                if (type === 'sleep' && window.__startSleepLoop) {
                    setTimeout(window.__startSleepLoop, 600);
                }
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.preview-card').forEach(el => {
        halfBObserver.observe(el);
    });

})();

// ==========================================
// STORY PAGE — SCROLL-TRIGGERED SLEEP TOAST
// ==========================================

(function initStorySleepTrigger() {

    // Find the "quiet part" section
    const sections = document.querySelectorAll('#story-page .story-section');
    let quietSection = null;

    sections.forEach(sec => {
        if (sec.textContent.includes("It even tells you to go to sleep")) {
            quietSection = sec;
        }
    });

    if (!quietSection) return;

    let hasFired = false;

    const sleepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasFired) {
                hasFired = true;

                // wait a beat so the text settles first
                setTimeout(() => {
                    triggerStorySleepToast();
                }, 1200);
            }
        });
    }, { threshold: 0.5 });

    sleepObserver.observe(quietSection);

})();

// ==========================================
// STORY-ONLY SLEEP TOAST (works on desktop + mobile)
// ==========================================

function triggerStorySleepToast() {
    // Build the toast element if it doesn't exist
        let toast = document.getElementById('story-sleep-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'story-sleep-toast';
        toast.className = 'story-sleep-toast';
        toast.onclick = openStorySleepModal;
        toast.innerHTML = `
            <div class="story-sleep-toast-icon">🌙</div>
            <div class="story-sleep-toast-body">
                <div class="story-sleep-toast-title">IT'S LATE</div>
                <div class="story-sleep-toast-text">The stars are out. Rest — you can pick this up tomorrow.</div>
            </div>
        `;
        document.body.appendChild(toast);
    }

    // Backdrop
    let backdrop = document.getElementById('story-sleep-toast-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'story-sleep-toast-backdrop';
        backdrop.className = 'story-sleep-toast-backdrop';
        document.body.appendChild(backdrop);
    }

    // Show
    requestAnimationFrame(() => {
        backdrop.classList.add('open');
        toast.classList.add('visible');
    });

        // Auto-dismiss after 5s
    setTimeout(() => {
        toast.classList.remove('visible');
        backdrop.classList.remove('open');
    }, 5000);
}

window.openStorySleepModal = function() {
    let modal = document.getElementById('story-sleep-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'story-sleep-modal';
        modal.className = 'story-sleep-modal';
        modal.onclick = (e) => {
            if (e.target === modal) closeStorySleepModal();
        };
        modal.innerHTML = `
            <div class="story-sleep-modal-card">
                <div class="story-sleep-modal-icon">🌙</div>
                <h2 class="story-sleep-modal-title">IT'S LATE</h2>
                <p class="story-sleep-modal-text">
                    The stars are out. Your mind needs sleep to remember what you learned today. Rest — you can pick this up tomorrow.
                </p>
                <button class="story-sleep-modal-btn" type="button" onclick="closeStorySleepModal()">I'LL SLEEP SOON</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const toast = document.getElementById('story-sleep-toast');
    const backdrop = document.getElementById('story-sleep-toast-backdrop');

    if (toast) toast.classList.remove('visible');
    if (backdrop) backdrop.classList.remove('open');
    modal.classList.add('open');
};

window.closeStorySleepModal = function() {
    const modal = document.getElementById('story-sleep-modal');
    if (!modal) return;
    if (modal.classList.contains('closing')) return;

    modal.classList.add('closing');

    setTimeout(() => {
        modal.classList.remove('open');
        modal.classList.remove('closing');
    }, 550);
};

// ==========================================
// MANIFESTO — ANIMATED FLOATING CONSTELLATIONS
// ==========================================

(function initManifestoConstellations() {

    const patterns = [
        // TRIANGULUM
        [{x:0.25,y:0.7}, {x:0.5,y:0.3}, {x:0.75,y:0.7}],
        // ARIES
        [{x:0.2,y:0.6}, {x:0.4,y:0.4}, {x:0.6,y:0.5}, {x:0.8,y:0.35}],
        // CASSIOPEIA (W shape)
        [{x:0.15,y:0.5}, {x:0.3,y:0.7}, {x:0.5,y:0.4}, {x:0.7,y:0.7}, {x:0.85,y:0.5}],
        // CYGNUS
        [{x:0.5,y:0.2}, {x:0.5,y:0.5}, {x:0.25,y:0.55}, {x:0.75,y:0.55}, {x:0.5,y:0.8}]
    ];

    // Set up canvases
    const canvases = [];
    patterns.forEach((nodes, i) => {
        const canvas = document.getElementById(`manifesto-canvas-${i + 1}`);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = 180;
        canvas.width = size;
        canvas.height = size;
        canvases.push({
            ctx,
            nodes,
            size,
            visibleStars: 0,
            starRadii: nodes.map(() => 0),
            running: false
        });
    });

        function drawOne(c) {
        c.ctx.clearRect(0, 0, c.size, c.size);

        // Lines between visible stars
        c.ctx.strokeStyle = 'rgba(255, 204, 0, 0.35)';
        c.ctx.lineWidth = 1;
        c.ctx.beginPath();
        for (let i = 0; i < c.visibleStars - 1; i++) {
            const a = c.nodes[i];
            const b = c.nodes[i + 1];
            c.ctx.moveTo(a.x * c.size, a.y * c.size);
            c.ctx.lineTo(b.x * c.size, b.y * c.size);
        }
        c.ctx.stroke();

        // Stars — smaller, tighter glow
        c.nodes.forEach((n, i) => {
            if (i >= c.visibleStars) return;
            const x = n.x * c.size;
            const y = n.y * c.size;

            if (c.starRadii[i] < 2.2) c.starRadii[i] += 0.15;

            // Small glow halo — radius 6, not 15
            c.ctx.beginPath();
            const grd = c.ctx.createRadialGradient(x, y, 0, x, y, 6);
            grd.addColorStop(0, 'rgba(255, 204, 0, 0.35)');
            grd.addColorStop(1, 'rgba(255, 204, 0, 0)');
            c.ctx.fillStyle = grd;
            c.ctx.arc(x, y, 6, 0, Math.PI * 2);
            c.ctx.fill();

            // Star core — small
            c.ctx.beginPath();
            c.ctx.fillStyle = 'rgba(255, 204, 0, 0.95)';
            c.ctx.shadowBlur = 8;
            c.ctx.shadowColor = '#ffcc00';
            c.ctx.arc(x, y, c.starRadii[i], 0, Math.PI * 2);
            c.ctx.fill();
        });
        c.ctx.shadowBlur = 0;

        if (c.running) requestAnimationFrame(() => drawOne(c));
    }

    function startAnimating(c) {
        if (c.running) return;
        c.running = true;
        drawOne(c);

        const interval = setInterval(() => {
            c.visibleStars++;
            if (c.visibleStars >= c.nodes.length) {
                clearInterval(interval);
                setTimeout(() => {
                    // reset and replay after a pause
                    c.visibleStars = 0;
                    c.starRadii = c.nodes.map(() => 0);
                    startAnimating(c);
                }, 4000);
            }
        }, 600);
    }

    // Reveal when manifesto enters view
    const manifesto = document.querySelector('.story-manifesto');
    if (manifesto) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.manifesto-card').forEach((card, i) => {
                        setTimeout(() => card.classList.add('visible'), i * 250);
                    });
                    // start drawing each constellation
                    canvases.forEach((c, i) => {
                        setTimeout(() => startAnimating(c), 400 + i * 250);
                    });
                }
            });
        }, { threshold: 0.3 });
        obs.observe(manifesto);
    }

})();
// ==========================================
// EVIDENCE CARDS — JS fallback for :has()
// ==========================================

(function initEvidenceHoverFallback() {
    // Only run if the browser doesn't support :has()
    if (CSS.supports && CSS.supports('selector(:has(*))')) return;

    const grid = document.getElementById('evidence-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.evidence-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => {
                if (c !== card) {
                    c.style.filter = 'blur(3px)';
                    c.style.opacity = '0.35';
                    c.style.transform = 'scale(0.97)';
                }
            });
        });
        card.addEventListener('mouseleave', () => {
            cards.forEach(c => {
                c.style.filter = '';
                c.style.opacity = '';
                c.style.transform = '';
            });
        });
    });
})();