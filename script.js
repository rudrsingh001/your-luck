// ====== AD REWARD SYSTEM (secure) ======
const COIN_KEY = "coins";
const LAST_AD_KEY = "lastAdTime";
const DAILY_KEY = "dailyAdCount";
const DAILY_DATE_KEY = "dailyAdDate";

const COOLDOWN_MS = 30 * 1000;     // 30 seconds
const DAILY_LIMIT = 20;            // 20 ads per day
const REWARD_COINS = 1;            // per ad

function todayStr(){
  const d = new Date();
  return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
}

function getNum(key, def=0){
  const v = localStorage.getItem(key);
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
}

function setNum(key, val){
  localStorage.setItem(key, String(val));
}

function syncDaily(){
  const t = todayStr();
  const saved = localStorage.getItem(DAILY_DATE_KEY);
  if(saved !== t){
    localStorage.setItem(DAILY_DATE_KEY, t);
    setNum(DAILY_KEY, 0);
  }
}

function renderCoins(){
  const coins = getNum(COIN_KEY, 0);
  const el = document.getElementById("coins");
  if(el) el.innerText = coins;
}

function setMsg(text){
  const msg = document.getElementById("adMsg");
  if(msg) msg.innerText = text;
}

async function watchAdAndReward(){
  syncDaily();

  const now = Date.now();
  const last = getNum(LAST_AD_KEY, 0);
  const diff = now - last;

  const dailyCount = getNum(DAILY_KEY, 0);

  // ✅ Daily limit
  if(dailyCount >= DAILY_LIMIT){
    setMsg(`❌ Daily limit reached (${DAILY_LIMIT}/day). Come tomorrow.`);
    return;
  }

  // ✅ Cooldown
  if(last && diff < COOLDOWN_MS){
    const sec = Math.ceil((COOLDOWN_MS - diff)/1000);
    setMsg(`⏳ Please wait ${sec}s before next ad.`);
    return;
  }

  // ✅ Lock immediately (anti double-click / glitch)
  setNum(LAST_AD_KEY, now);

  // UI disable
  const btn = document.getElementById("watchAdBtn");
  if(btn){
    btn.disabled = true;
    btn.innerText = "Playing Ad...";
  }

  // ====== Simulated Ad (30 sec) ======
  let remaining = 30;
  setMsg(`📺 Ad running... ${remaining}s`);

  const timer = setInterval(() => {
    remaining--;
    setMsg(`📺 Ad running... ${remaining}s`);
    if(remaining <= 0){
      clearInterval(timer);

      // ✅ Reward
      const coins = getNum(COIN_KEY, 0) + REWARD_COINS;
      setNum(COIN_KEY, coins);

      const newCount = getNum(DAILY_KEY, 0) + 1;
      setNum(DAILY_KEY, newCount);

      renderCoins();
      setMsg(`✅ +${REWARD_COINS} coin added! (Today: ${newCount}/${DAILY_LIMIT})`);

      if(btn){
        btn.disabled = false;
        btn.innerText = "Watch Ad & Earn Coin";
      }
    }
  }, 1000);
}

// Hook
document.addEventListener("DOMContentLoaded", () => {
  syncDaily();
  renderCoins();

  const btn = document.getElementById("watchAdBtn");
  if(btn){
    btn.addEventListener("click", watchAdAndReward);
  }
});

