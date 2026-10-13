/* ==========================================================================
   CyberSafe – script.js   (plain JavaScript, no libraries)
   1. LEVELS   – content: 10 levels, each with a mock-up scenario + 1 question
   2. STATE    – progress, saved in localStorage
   3. EFFECTS  – confetti, sounds, score pop (the "juice")
   4. RENDER   – home/level map, level page, results
   5. ACTIONS  – clicks: answer, next, clues, reset, share
   6. INIT
   ========================================================================== */
'use strict';

const POINTS = 10;

/* Helper used inside scenarios: a tappable clue. Click = reveal the hint. */
const clue = (text, hint) =>
  `<button type="button" class="clue" data-hint="${hint.replace(/"/g, '&quot;')}">${text}</button>`;

/* --------------------------------------------------------------------------
   1. LEVELS
   scenario = HTML mock-up (email / chat / call...) with clue() buttons
   choices  = 2–4 answers, answer = index of the right one, why = short reason
   -------------------------------------------------------------------------- */
const LEVELS = [
  {
    title: 'What Is Phishing?', icon: '🪝',
    explanation: 'Fake messages that pretend to be someone you trust, so you click or type your password.',
    tips: ['👀 Check the real link', '⏰ Urgency = pressure', '⌨️ Type the site yourself'],
    scenario: `
      <div class="mock mock-email">
        <div class="mock-bar">📧 Inbox</div>
        <div class="meta">
          <div><strong>From:</strong> IT Help Desk &lt;${clue('helpdesk@stateu-support.com', 'Your school is stateu.edu. "stateu-support.com" is a look-alike domain anyone can buy.')}&gt;</div>
          <div class="subject">${clue('⚠️ Your password expires in 24 hours', 'Deadlines push you to act before you think.')}</div>
        </div>
        <div class="mock-body">
          <p>Hi Student, your StateU password expires soon. Reset it now to keep access to Canvas and email.</p>
          <p><a class="mock-btn" href="#" onclick="return false">Reset Password</a><br>
          <small>${clue('stateu-support.com/reset', 'The button goes to the fake domain, not stateu.edu.')}</small></p>
          <p>— StateU IT Services</p>
        </div>
      </div>
      <p class="narration">No typos, real logo, polite tone. Still phishing?</p>`,
    question: 'What gives this email away?',
    choices: ['It talks about passwords', 'The domain isn\'t stateu.edu', 'It arrived at night', 'It uses the school logo'],
    answer: 1,
    why: 'Logos, wording and timing are easy to fake. A domain isn\'t. Real IT mail comes from stateu.edu and never sends you to a random site to reset.'
  },
  {
    title: 'Spot the Fake Job', icon: '🧑‍💻',
    explanation: 'Scam job offers promise easy money, skip the interview, then ask you to move money around.',
    tips: ['🧾 Fake checks bounce', '🏫 Verify via career center', '🚩 "No interview needed"'],
    scenario: `
      <div class="mock mock-email">
        <div class="mock-bar">📧 Inbox</div>
        <div class="meta">
          <div><strong>From:</strong> Jordan Lee &lt;${clue('recruiting@amazon-careers-hiring.com', 'Real Amazon mail comes from amazon.com or amazon.jobs.')}&gt;</div>
          <div class="subject">Remote Internship – Immediate Start 🎉</div>
        </div>
        <div class="mock-body">
          <p>You've been selected for a remote Data Entry Internship at <strong>$32/hr</strong>, 15 hrs/week. ${clue('No interview needed!', 'Real employers interview you. Skipping it means they just want a victim.')}</p>
          <p>To start, we'll mail you a <strong>$2,400 check</strong> for a laptop. ${clue('Keep $300, send the rest to our vendor via Zelle.', 'Classic fake-check scam: the check bounces later, your Zelle money is gone for good.')}</p>
          <p>Reply with your full name, address and phone to begin.</p>
        </div>
      </div>`,
    question: 'Biggest red flag?',
    choices: ['It\'s remote', 'Pay is high', 'Deposit a check, forward money', 'Sent to your .edu email'],
    answer: 2,
    why: 'The check will bounce days later and the bank makes YOU pay back the money you sent. No real employer asks a new hire to move money.'
  },
  {
    title: 'Password Reuse', icon: '🗝️',
    explanation: 'One password on many sites means one data breach unlocks everything.',
    tips: ['🔁 Never reuse', '📏 Long passphrases win', '🗝️ Use a password manager'],
    scenario: `
      <div class="mock mock-push">
        <div class="push"><span class="push-icon">🎮</span><div><div class="push-title">GamerHub Forum <span class="push-time">now</span></div><div class="push-text">${clue('Security notice: our user database, including passwords, was stolen.', 'Leaked passwords get tried on hundreds of other sites automatically. That\'s called credential stuffing.')}</div></div></div>
      </div>
      <p class="narration">Maya uses <strong>GoTigers2024!</strong> on GamerHub… ${clue('and on her school portal, Netflix and Instagram.', 'Every account sharing that password is now at risk, not just the forum.')} She thinks, "It\'s just a forum."</p>`,
    question: 'What should Maya do?',
    choices: ['Change only the forum password', 'Change it everywhere + make each one unique', 'Change only the school portal', 'Wait and see'],
    answer: 1,
    why: 'Bots take leaked logins and try them on every big site within hours. Every account sharing the password needs a new, unique one.'
  },
  {
    title: 'Social Engineering', icon: '🎭',
    explanation: 'Manipulation, not hacking. They sound official, know a few facts, and rush you.',
    tips: ['📞 Hang up, call back', '🧠 Knowing your ID proves nothing', '🙅 Never confirm SSN'],
    scenario: `
      <div class="mock mock-call">
        <div class="call-avatar">🏛️</div>
        <div class="call-name">${clue('StateU Financial Aid', 'Caller ID can display any name. It is not proof.')}</div>
        <div class="call-sub">Incoming call · 00:42</div>
        <div class="call-quote">
          <p>"There's a problem with your FAFSA that could delay your scholarship."</p>
          <p>"I see you're <strong>Sam Patel</strong>, Biology major, ID <strong>#2048811</strong>. ${clue('I just need to verify your date of birth and the last 4 of your Social.', 'They already "know" you so you drop your guard. Then they ask for the pieces they\'re missing.')}"</p>
        </div>
        <div class="call-btns"><span class="call-btn red">📵</span><span class="call-btn green">📞</span></div>
      </div>`,
    question: 'Best move?',
    choices: ['Give it, they know your ID', 'Ask them to email you instead', 'Give DOB but not the SSN', 'Hang up, call the office number from the official site'],
    answer: 3,
    why: 'Names, majors and student IDs leak all the time. Only a number YOU look up is trustworthy. Even a date of birth helps build a fake identity.'
  },
  {
    title: 'Safe Social Media', icon: '📸',
    explanation: 'Hacked accounts message their friends. A DM from a friend\'s account isn\'t a DM from your friend.',
    tips: ['🔗 "Log in to view" = trap', '📲 Verify by text or call', '⚠️ Warn your friend'],
    scenario: `
      <div class="mock mock-dm">
        <div class="mock-bar"><span class="dm-avatar">🧑</span> alex.rivera.22 <small style="font-weight:400;color:#888">· roommate last year</small></div>
        <div class="mock-body" style="display:flex;flex-direction:column;gap:.4rem">
          <div class="bubble them">omg is this you in this video?? 😳</div>
          <div class="bubble them">${clue('insta-videos-view.com/v/83kd1', 'Not instagram.com. A look-alike link that leads to a fake login page.')}</div>
        </div>
      </div>
      <div class="mock">
        <div class="mock-login"><div class="logo">Instagram</div>
          <div class="field">Phone number, username or email</div><div class="field">Password</div>
          <span class="mock-btn" style="display:block">${clue('Log in to view video', 'You\'re already logged in. A page asking you to log in again is harvesting passwords.')}</span>
        </div>
      </div>`,
    question: 'Safest move?',
    choices: ['Reply and ask Alex first', 'Log in, it looks legit', 'Don\'t log in. Text Alex, warn them', 'Log in, then change password'],
    answer: 2,
    why: 'Alex\'s account is probably hijacked, so replying just reaches the scammer ("yes lol watch it"). Check through a different app and warn them.'
  },
  {
    title: 'Public Wi-Fi', icon: '📡',
    explanation: 'Anyone can create a hotspot named like the café\'s. On it, they can watch or redirect you.',
    tips: ['☕ Ask staff for the real name', '📡 Use cellular for banking', '🛡️ VPN encrypts everything'],
    scenario: `
      <div class="mock mock-wifi">
        <div class="mock-bar">📶 Wi-Fi</div>
        <div class="wifi-row"><span>BeanThere_Guest</span><span class="wifi-right">🔓 ▂▄</span></div>
        <div class="wifi-row">${clue('BeanThere_Free_WiFi_5G', 'Two similar names, one is fake. The stronger signal is often the attacker sitting nearby.')}<span class="wifi-right">🔓 ▂▄▆█</span></div>
        <div class="wifi-row"><span>xfinitywifi</span><span class="wifi-right">🔓 ▂</span></div>
      </div>
      <p class="narration">You need to check your bank balance before rent is due. ${clue('The bank site has the HTTPS padlock.', 'HTTPS helps, but a fake network can still show a fake "sign in to Wi-Fi" page or redirect you.')}</p>`,
    question: 'Safest way to check your balance?',
    choices: ['Strongest network, HTTPS protects me', 'Ask staff for the real name, use cellular or a VPN for banking', 'Pick the one that needs a password', 'Use incognito mode'],
    answer: 1,
    why: 'Cellular data or a VPN keeps your traffic off the stranger\'s network. Incognito only hides history on your own device.'
  },
  {
    title: 'Two-Factor (2FA)', icon: '🔐',
    explanation: 'A second check after your password. Attackers spam push prompts hoping you tap Approve to make it stop.',
    tips: ['🚫 Never approve what you didn\'t start', '🔑 A prompt means they have your password', '📣 Report to IT'],
    scenario: `
      <p class="narration">11:40 pm. You\'re in bed, not logging into anything.</p>
      <div class="mock mock-push">
        <div class="push"><span class="push-icon">🟢</span><div><div class="push-title">Duo Mobile <span class="push-time">11:40 pm</span></div><div class="push-text">Login request: StateU Portal · Lagos, Nigeria</div></div></div>
        <div class="push"><span class="push-icon">🟢</span><div><div class="push-title">Duo Mobile <span class="push-time">11:42 pm</span></div><div class="push-text">Login request: StateU Portal</div></div></div>
        <div class="push"><span class="push-icon">🟢</span><div><div class="push-title">Duo Mobile <span class="push-time">11:43 pm</span></div><div class="push-text">${clue('Login request: StateU Portal — Approve / Deny', 'A push only fires AFTER someone typed your correct password. They have it. Deny, change it, report it.')}</div></div></div>
      </div>`,
    question: 'True or false: Unexpected 2FA prompts mean someone already has your password.',
    choices: ['True', 'False'],
    answer: 0,
    why: 'True. The prompt only appears after a correct password. Deny every request, change your password now, and tell IT. Never turn off 2FA to stop the buzzing.'
  },
  {
    title: 'Marketplace Scams', icon: '🛒',
    explanation: 'Payment apps are like cash: sent money is gone. Scammers fake "payment pending" emails.',
    tips: ['💵 Sellers never pay fees', '📱 Check inside the real app', '🤝 Meet in public, cash or verified'],
    scenario: `
      <div class="mock mock-listing">
        <div class="mock-bar">🛒 Marketplace</div>
        <div class="listing-row"><span class="listing-thumb">📗</span><div><div><strong>Organic Chemistry, 9th ed.</strong></div><div class="listing-price">$120</div></div></div>
        <div class="mock-body" style="display:flex;flex-direction:column;gap:.4rem">
          <div class="bubble them">I'll take it! Paying by Zelle now 👍</div>
          <div class="bubble me">Great, thanks!</div>
        </div>
      </div>
      <div class="mock mock-email">
        <div class="meta">
          <div><strong>From:</strong> Zelle Payments &lt;${clue('support@zelle-business-transfer.com', 'Zelle\'s real domain is zellepay.com. This is a spoof.')}&gt;</div>
          <div class="subject">Payment of $120.00 is PENDING</div>
        </div>
        <div class="mock-body"><p>The buyer sent $120. ${clue('Your account must be upgraded to Zelle Business. Send a refundable $300 fee to the buyer', 'No payment app charges the seller to receive money. The $300 you send is unrecoverable.')} and your $420 will be released.</p></div>
      </div>`,
    question: 'What\'s going on?',
    choices: ['Normal Zelle policy, you get refunded', 'Buyer made a mistake', 'Scam. Fake email, no fee exists', 'Legit, it shows the exact price'],
    answer: 2,
    why: 'No money is pending. The scammer wrote the email and knows the price because they agreed to it. Zelle has no "business upgrade fee".'
  },
  {
    title: 'Oversharing', icon: '🪪',
    explanation: 'Small details add up: name + ID number + dorm = enough to impersonate you or find you.',
    tips: ['✂️ Crop IDs and barcodes', '📸 Private accounts get screenshotted', '🏠 Don\'t post where you sleep'],
    scenario: `
      <div class="mock mock-post">
        <div class="mock-bar"><span class="dm-avatar">👩</span> priya.sharma <small style="font-weight:400;color:#888">· Hall C</small></div>
        <div class="post-image">🎉
          <div class="id-card"><strong>STATEU STUDENT</strong>${clue('Priya Sharma · ID 2051177', 'Name + student ID is what help desks use to verify you. Now anyone can "be" Priya.')}</div>
        </div>
        <div class="post-caption"><span class="user">priya.sharma</span> Officially a StateU Panther! 🐾 ${clue('Hall C, room 214, come say hi!', 'That\'s her exact address, visible to 400 people and anyone they screenshot it for.')}</div>
        <div class="post-likes">❤️ 212 likes · 🔒 Private account · 400 followers</div>
      </div>`,
    question: 'What\'s the risk here?',
    choices: ['Low, IDs only work on campus', 'Impersonation with her ID + strangers know where she lives', 'Only the room number is bad', 'None, the account is private'],
    answer: 1,
    why: 'Student IDs verify you with housing, dining, and IT. "Private" just means 400 people can screenshot and share it.'
  },
  {
    title: 'Final Challenge', icon: '👑',
    explanation: 'Everything at once: fake alert, spoofed caller ID, urgency, and a request for your code.',
    tips: ['🔢 Codes are typed, never read aloud', '📞 Caller ID can be faked', '💳 Call the number on your card'],
    scenario: `
      <div class="mock mock-chat">
        <div class="mock-bar">83591</div>
        <div class="mock-body">
          <div class="bubble them">Chase Fraud Alert: Did you attempt $482.19 at Best Buy? Reply YES or NO.</div>
          <div class="bubble me">NO</div>
          <div class="bubble-time">1 min later</div>
          <div class="bubble them">Your Chase verification code is <strong>${clue('739 204', 'This is a REAL code. It arrived because the caller is logging into your account right now and needs it.')}</strong>. Do not share it.</div>
        </div>
      </div>
      <div class="mock mock-call">
        <div class="call-avatar">🏦</div>
        <div class="call-name">${clue('Chase Fraud Dept', 'Spoofed. Caller ID can show any name or number.')}</div>
        <div class="call-sub">Incoming call</div>
        <div class="call-quote"><p>"Hi, this is Marcus from Chase. We're blocking that charge now. ${clue('To secure your account, read me the 6-digit code I just sent you.', 'Banks never ask you to read a code out loud. The code is for YOU to type.')}"</p></div>
        <div class="call-btns"><span class="call-btn red">📵</span><span class="call-btn green">📞</span></div>
      </div>`,
    question: 'What do you do?',
    choices: ['Read the code, caller ID says Chase', 'Ask him to confirm your card\'s last 4 first', 'Refuse, hang up, call the number on your card', 'Reply STOP to the text'],
    answer: 2,
    why: '"Marcus" is logging in as you and the code is the last thing he needs. He may already know your card\'s last 4. Hang up and call the real bank.'
  }
];

const TOTAL = LEVELS.length;
const MAX_SCORE = TOTAL * POINTS;
const AVATARS = ['🦊', '🐯', '🦄', '🐙', '🤖', '👽', '🐲', '🦉'];

const RANKS = [
  { min: 90, title: 'Cyber Defender',         icon: '🏆', message: 'Unstoppable. Scammers should be scared of you.' },
  { min: 70, title: 'Security Savvy',         icon: '🥇', message: 'Strong instincts! Replay the levels you missed.' },
  { min: 50, title: 'Cyber Apprentice',       icon: '🧠', message: 'Good start. A few tricks still got past you.' },
  { min: 0,  title: 'Time for More Training', icon: '🎒', message: 'Scammers would love you right now. Run it back!' }
];

/* Fun badges awarded on the results screen */
const BADGES = [
  { id: 'perfect', label: '💎 Flawless', test: s => s.score === MAX_SCORE },
  { id: 'streak5', label: '🔥 5-streak', test: s => s.bestStreak >= 5 },
  { id: 'detective', label: '🕵️ Detective', test: s => s.cluesFound >= 15 },
  { id: 'phish', label: '🪝 Phish Slayer', test: s => s.answers[0]?.correct && s.answers[1]?.correct },
  { id: 'finisher', label: '🎖️ Finisher', test: () => true }
];

/* --------------------------------------------------------------------------
   2. STATE + localStorage
   -------------------------------------------------------------------------- */
const STORAGE_KEY = 'cybersafe-progress-v2';
const fresh = () => ({ answers: {}, currentLevel: 0, streak: 0, bestStreak: 0, cluesFound: 0, foundClues: {}, avatar: AVATARS[0], sound: true });
let state = fresh();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.answers) state = { ...fresh(), ...saved };
  } catch (e) { console.warn('Could not load progress', e); }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}
function resetProgressOnly() {
  // Keep avatar + sound preference, wipe the game
  state = { ...fresh(), avatar: state.avatar, sound: state.sound };
  saveState();
}

const getScore = () => Object.values(state.answers).filter(a => a.correct).length * POINTS;
const getDone = () => Object.keys(state.answers).length;
const isAnswered = i => state.answers[i] !== undefined;
/* Next level to play: the first unanswered level AFTER the furthest one
   completed, wrapping around to any skipped earlier levels. */
function nextUnanswered() {
  const done = Object.keys(state.answers).map(Number);
  const start = done.length ? Math.max(...done) + 1 : 0;
  for (let k = 0; k < TOTAL; k++) {
    const i = (start + k) % TOTAL;
    if (!isAnswered(i)) return i;
  }
  return 0;
}
const getRank = score => RANKS.find(r => score >= r.min);

/* --------------------------------------------------------------------------
   3. EFFECTS: confetti, sound, score pop
   -------------------------------------------------------------------------- */
const $ = id => document.getElementById(id);

/* Confetti: simple particles drawn on a canvas for ~1.5s */
function confetti(amount = 120) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = $('confetti'), ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const colors = ['#ff5ea8', '#ffd93d', '#3de0ff', '#45e58a', '#a78bfa', '#ff9f43'];
  const parts = Array.from({ length: amount }, () => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * 200, y: canvas.height / 3,
    vx: (Math.random() - 0.5) * 14, vy: Math.random() * -12 - 4,
    size: Math.random() * 8 + 4, color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3
  }));
  let frame = 0;
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.4; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (++frame < 90) requestAnimationFrame(draw); else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })();
}

/* Sounds: tiny beeps made with the Web Audio API (no audio files needed) */
let audioCtx;
function beep(notes) {
  if (!state.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    notes.forEach(([freq, start, len]) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'triangle'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime + start);
      g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + start + len);
      o.connect(g).connect(audioCtx.destination);
      o.start(audioCtx.currentTime + start); o.stop(audioCtx.currentTime + start + len);
    });
  } catch (e) { /* audio not available */ }
}
const sfx = {
  correct: () => beep([[523, 0, 0.15], [659, 0.12, 0.15], [784, 0.24, 0.3]]),
  wrong:   () => beep([[220, 0, 0.25], [180, 0.2, 0.35]]),
  clue:    () => beep([[880, 0, 0.08]]),
  win:     () => beep([[523, 0, 0.15], [659, 0.15, 0.15], [784, 0.3, 0.15], [1047, 0.45, 0.5]])
};

function scorePop(text) {
  const el = $('score-pop');
  el.textContent = text; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
}

let toastTimer;
function showToast(msg) {
  const t = $('toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
}

/* --------------------------------------------------------------------------
   4. RENDER
   -------------------------------------------------------------------------- */
function showView(name) {
  ['home', 'lesson', 'results'].forEach(v => { $('view-' + v).hidden = v !== name; });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHeader() {
  const score = getScore(), done = getDone();
  $('header-score').textContent = score;
  $('progress-fill').style.width = `${(done / TOTAL) * 100}%`;
  $('progress-bar').setAttribute('aria-valuenow', done);
  $('streak-pill').hidden = state.streak < 2;
  $('streak-count').textContent = state.streak;
  $('btn-sound').textContent = state.sound ? '🔊' : '🔇';
  $('btn-sound').setAttribute('aria-pressed', state.sound);
  $('btn-sound').setAttribute('aria-label', state.sound ? 'Sound on' : 'Sound off');
}

function renderHome() {
  const score = getScore(), done = getDone();
  $('dash-score').textContent = score;
  $('dash-completed').textContent = `${done}/${TOTAL}`;
  $('dash-accuracy').textContent = done ? `${Math.round((score / POINTS / done) * 100)}%` : '—';

  const start = $('btn-start');
  start.innerHTML = done === 0 ? '<span aria-hidden="true">▶</span> Play'
    : done === TOTAL ? '<span aria-hidden="true">🏆</span> See results'
    : `<span aria-hidden="true">▶</span> Continue · Level ${nextUnanswered() + 1}`;

  // Avatar picker
  $('avatar-options').innerHTML = AVATARS.map(a =>
    `<button type="button" class="avatar-btn ${a === state.avatar ? 'is-selected' : ''}" data-avatar="${a}" aria-label="Avatar ${a}" aria-pressed="${a === state.avatar}">${a}</button>`).join('');

  // Level map
  const next = nextUnanswered();
  $('level-map').innerHTML = LEVELS.map((L, i) => {
    const a = state.answers[i];
    const cls = a ? (a.correct ? 'is-correct' : 'is-wrong') : (i === next && done < TOTAL ? 'is-current' : '');
    const status = a ? (a.correct ? 'correct' : 'missed') : (cls ? 'up next' : 'not started');
    const star = a?.correct ? '<span class="node-star" aria-hidden="true">⭐</span>' : '';
    const face = i === next && done < TOTAL ? state.avatar : L.icon;
    return `<li><button type="button" class="level-node ${cls}" data-level="${i}" aria-label="Level ${i + 1}: ${L.title}, ${status}">
      <span class="node-circle">${face}${star}<span class="node-num">${i + 1}</span></span>
      <span class="node-label">${L.title}</span></button></li>`;
  }).join('');
}

function renderLevel(i) {
  const L = LEVELS[i];
  state.currentLevel = i; saveState();

  $('lesson-counter').textContent = `Level ${i + 1} / ${TOTAL}`;
  $('lesson-icon').textContent = L.icon;
  $('lesson-title').textContent = L.title;
  $('lesson-explanation').textContent = L.explanation;
  $('lesson-tips').innerHTML = L.tips.map(t => `<li>${t}</li>`).join('');
  $('lesson-scenario').innerHTML = L.scenario;
  $('clue-hint').hidden = true;

  // Restore clues already found on this level
  const found = state.foundClues[i] || [];
  document.querySelectorAll('#lesson-scenario .clue').forEach((c, idx) => {
    c.dataset.index = idx;
    if (found.includes(idx)) c.classList.add('is-found');
  });
  updateClueCounter();

  $('quiz-question').textContent = L.question;
  const box = $('quiz-choices');
  box.className = 'choices' + (L.choices.length === 2 ? ' two' : '');
  const shapes = ['▲', '◆', '●', '■'];
  box.innerHTML = L.choices.map((c, k) =>
    `<button type="button" class="choice k${k}" data-choice="${k}"><span class="choice-shape" aria-hidden="true">${shapes[k]}</span><span>${c}</span></button>`).join('');

  $('quiz-feedback').hidden = true;
  if (isAnswered(i)) showAnswerResult(i, state.answers[i].choice, true);

  $('btn-prev').disabled = i === 0;
  $('btn-next').disabled = !isAnswered(i);
  $('btn-next').innerHTML = i === TOTAL - 1 ? 'Results <span aria-hidden="true">🏆</span>' : 'Next <span aria-hidden="true">→</span>';
  showView('lesson');
}

function updateClueCounter() {
  const all = document.querySelectorAll('#lesson-scenario .clue').length;
  const found = document.querySelectorAll('#lesson-scenario .clue.is-found').length;
  $('clue-counter').textContent = all ? `${found}/${all} clues found` : '';
}

function showAnswerResult(i, chosen, silent) {
  const L = LEVELS[i], correct = chosen === L.answer;
  document.querySelectorAll('#quiz-choices .choice').forEach(b => {
    const k = Number(b.dataset.choice);
    b.disabled = true;
    b.classList.add(k === L.answer ? 'is-correct' : k === chosen ? 'is-wrong' : 'is-dimmed');
    if (k === chosen) b.setAttribute('aria-pressed', 'true');
  });
  const fb = $('quiz-feedback');
  fb.className = 'feedback ' + (correct ? 'correct' : 'wrong');
  $('feedback-title').textContent = correct ? `🎉 Nailed it! +${POINTS}` : `😬 Nope. It was ${['A','B','C','D'][L.answer]}.`;
  $('feedback-text').textContent = L.why;
  fb.hidden = false;
  if (!silent) fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderResults() {
  const score = getScore(), rank = getRank(score);
  $('results-score').textContent = score;
  $('results-icon').textContent = rank.icon;
  $('results-rank').textContent = rank.title;
  $('results-message').textContent = rank.message;
  $('results-title').textContent = score >= 70 ? 'You crushed it!' : 'Game over!';

  // Animate the ring (circumference ≈ 326.7)
  const ring = $('ring-fg');
  ring.style.strokeDashoffset = 326.7;
  ring.style.stroke = score >= 70 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--red)';
  requestAnimationFrame(() => requestAnimationFrame(() => { ring.style.strokeDashoffset = 326.7 * (1 - score / MAX_SCORE); }));

  $('badge-row').innerHTML = BADGES.filter(b => b.test({ ...state, score })).map(b => `<span class="badge">${b.label}</span>`).join('');

  $('results-list').innerHTML = LEVELS.map((L, i) => {
    const ok = state.answers[i]?.correct;
    return `<li class="${ok ? 'ok' : 'bad'}" title="${L.title}"><span aria-hidden="true">${L.icon}</span><span>${ok ? '✓' : '✗'} L${i + 1}</span></li>`;
  }).join('');

  showView('results');
  if (score >= 70) { confetti(200); sfx.win(); }
}

/* --------------------------------------------------------------------------
   5. ACTIONS
   -------------------------------------------------------------------------- */
function goHome() { renderHeader(); renderHome(); showView('home'); }

function openLevel(i) {
  renderHeader(); renderLevel(i);
  $('lesson-title').setAttribute('tabindex', '-1');
  $('lesson-title').focus({ preventScroll: true });
}

function startOrContinue() {
  if (getDone() === TOTAL) { renderHeader(); renderResults(); }
  else openLevel(nextUnanswered());
}

function answerQuestion(choice) {
  const i = state.currentLevel;
  if (isAnswered(i)) return;
  const correct = choice === LEVELS[i].answer;
  state.answers[i] = { choice, correct };
  state.streak = correct ? state.streak + 1 : 0;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  saveState();

  showAnswerResult(i, choice, false);
  renderHeader();
  if (correct) { scorePop(`+${POINTS}`); confetti(90); sfx.correct(); }
  else sfx.wrong();

  $('btn-next').disabled = false;
  $('btn-next').focus({ preventScroll: true });
}

function revealClue(btn) {
  const i = state.currentLevel, idx = Number(btn.dataset.index);
  $('clue-hint').textContent = '💡 ' + btn.dataset.hint;
  $('clue-hint').hidden = false;
  if (!btn.classList.contains('is-found')) {
    btn.classList.add('is-found');
    state.foundClues[i] = [...(state.foundClues[i] || []), idx];
    state.cluesFound++;
    saveState(); sfx.clue(); updateClueCounter();
  }
}

function nextLevel() {
  const i = state.currentLevel;
  if (!isAnswered(i)) return;
  if (i === TOTAL - 1) { renderHeader(); renderResults(); } else openLevel(i + 1);
}
function prevLevel() { if (state.currentLevel > 0) openLevel(state.currentLevel - 1); }

function resetProgress() {
  if (getDone() > 0 && !window.confirm('Reset your score and all levels?')) return;
  resetProgressOnly(); goHome(); showToast('Progress reset. Good luck! 🍀');
}
function restartGame() { resetProgressOnly(); renderHeader(); openLevel(0); showToast('New game! 🎮'); }

async function shareScore() {
  const score = getScore(), rank = getRank(score);
  const grid = LEVELS.map((_, i) => state.answers[i]?.correct ? '🟩' : '🟥').join('');
  const text = `CyberSafe 🛡️ ${score}/100 · ${rank.title}\n${grid}\nCan you outsmart the scam?`;
  try { await navigator.clipboard.writeText(text); showToast('Copied! Paste it anywhere 📋'); }
  catch (e) { window.prompt('Copy your result:', text); }
}

/* --------------------------------------------------------------------------
   6. INIT
   -------------------------------------------------------------------------- */
function init() {
  loadState();

  $('brand-home').addEventListener('click', goHome);
  $('btn-start').addEventListener('click', startOrContinue);
  $('btn-reset-home').addEventListener('click', resetProgress);
  $('btn-sound').addEventListener('click', () => { state.sound = !state.sound; saveState(); renderHeader(); if (state.sound) sfx.clue(); });

  $('avatar-options').addEventListener('click', e => {
    const b = e.target.closest('[data-avatar]');
    if (b) { state.avatar = b.dataset.avatar; saveState(); renderHome(); sfx.clue(); }
  });
  $('level-map').addEventListener('click', e => {
    const b = e.target.closest('[data-level]');
    if (b) openLevel(Number(b.dataset.level));
  });

  $('btn-back-home').addEventListener('click', goHome);
  $('btn-prev').addEventListener('click', prevLevel);
  $('btn-next').addEventListener('click', nextLevel);
  $('quiz-choices').addEventListener('click', e => {
    const b = e.target.closest('.choice');
    if (b && !b.disabled) answerQuestion(Number(b.dataset.choice));
  });
  $('lesson-scenario').addEventListener('click', e => {
    const c = e.target.closest('.clue');
    if (c) revealClue(c);
  });

  $('btn-restart').addEventListener('click', restartGame);
  $('btn-share').addEventListener('click', shareScore);
  $('btn-results-home').addEventListener('click', goHome);

  const modal = $('about-modal');
  $('btn-about').addEventListener('click', () => modal.showModal());
  $('btn-close-about').addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

  let seen = false;
  try { seen = localStorage.getItem('cybersafe-seen-intro'); localStorage.setItem('cybersafe-seen-intro', '1'); } catch (e) { /* ignore */ }
  if (!seen && getDone() === 0) modal.showModal();

  window.addEventListener('resize', () => { const c = $('confetti'); c.width = innerWidth; c.height = innerHeight; });
  goHome();
}
document.addEventListener('DOMContentLoaded', init);

/* Console helper for demos: CyberSafe.reset(), CyberSafe.state, CyberSafe.levels */
window.CyberSafe = { get state() { return state; }, levels: LEVELS, reset: () => { resetProgressOnly(); goHome(); } };
