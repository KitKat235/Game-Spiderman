const fs = require('fs');
const path = require('path');

const spideyB64  = fs.readFileSync(path.join(__dirname, 'sprite_b64.txt'), 'utf8');
const goblinB64  = fs.readFileSync(path.join(__dirname, 'goblin_b64.txt'), 'utf8');
const docockB64  = fs.readFileSync(path.join(__dirname, 'docock_b64.txt'), 'utf8');
const climbB64   = fs.readFileSync(path.join(__dirname, 'climb_strip_b64.txt'), 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Spider-Man: The Ultimate Boss Showdown</title>
  <style>
    :root {
      --spidey-red: #e62429;
      --spidey-dark-red: #9e1418;
      --spidey-blue: #0078d4;
      --spidey-cyan: #38bdf8;
      --spidey-gold: #ffbe0b;
      --bg-dark: #050811;
      --panel-bg: rgba(11, 18, 33, 0.88);
      --font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }

    body, html {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: var(--bg-dark);
      font-family: var(--font-family);
      color: #fff;
    }

    #game-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #020617;
    }

    canvas#gameCanvas {
      display: block;
      width: 100%;
      height: 100%;
      cursor: crosshair;
    }

    /* Top HUD Header */
    #hud {
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      pointer-events: none;
      z-index: 20;
      gap: 10px;
    }

    .hud-card {
      background: var(--panel-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 14px;
      padding: 10px 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .hud-left {
      min-width: 210px;
    }

    .bar-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .bar-shell {
      flex: 1;
      height: 12px;
      background: rgba(0, 0, 0, 0.65);
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.18);
      position: relative;
    }

    .bar-core {
      height: 100%;
      border-radius: 5px;
      transition: width 0.12s ease-out;
    }

    #hp-bar {
      background: linear-gradient(90deg, #ff2e3b, #ff7b00);
      box-shadow: 0 0 10px rgba(255, 46, 59, 0.8);
    }

    #web-bar {
      background: linear-gradient(90deg, #00b4d8, #90e0ef);
      box-shadow: 0 0 10px rgba(0, 180, 216, 0.8);
    }

    /* Distance Track */
    .hud-center {
      flex: 1;
      max-width: 440px;
      align-items: center;
    }

    .distance-track {
      width: 100%;
      height: 12px;
      background: rgba(0, 0, 0, 0.75);
      border-radius: 8px;
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .distance-fill {
      height: 100%;
      background: linear-gradient(90deg, #0078d4, #e62429, #ffbe0b);
      border-radius: 8px;
      width: 0%;
      transition: width 0.1s linear;
    }

    .distance-marker {
      position: absolute;
      top: -8px;
      font-size: 15px;
      transform: translateX(-50%);
      transition: left 0.1s linear;
      filter: drop-shadow(0 0 4px #ff3344);
    }

    .outpost-marker {
      position: absolute;
      top: -4px;
      font-size: 11px;
      transform: translateX(-50%);
      color: #ff3b40;
      filter: drop-shadow(0 0 4px #ff0000);
    }

    .finish-marker {
      position: absolute;
      right: -6px;
      top: -10px;
      font-size: 16px;
      animation: pulse 1.5s infinite;
    }

    .hud-right {
      min-width: 170px;
      align-items: flex-end;
      text-align: right;
    }

    .score-val {
      font-size: 24px;
      font-weight: 900;
      color: #fff;
      text-shadow: 0 0 12px rgba(255, 190, 11, 0.7);
      line-height: 1.1;
    }

    .highscore-val {
      font-size: 12px;
      font-weight: 700;
      color: var(--spidey-gold);
    }

    /* BOSS HEALTH BAR */
    #bossBarContainer {
      position: absolute;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 560px;
      background: var(--panel-bg);
      backdrop-filter: blur(12px);
      border: 2px solid #ff3b40;
      box-shadow: 0 0 35px rgba(230, 36, 41, 0.6);
      border-radius: 14px;
      padding: 10px 18px;
      display: none;
      flex-direction: column;
      gap: 6px;
      z-index: 25;
      animation: modalPop 0.4s ease-out;
    }

    .boss-bar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .boss-bar-shell {
      width: 100%;
      height: 16px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .boss-bar-fill {
      height: 100%;
      width: 100%;
      background: linear-gradient(90deg, #b91c1c, #ef4444, #f59e0b);
      box-shadow: 0 0 12px rgba(239, 68, 68, 0.9);
      transition: width 0.15s ease-out;
    }

    .hud-mode-pill {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      border: 1px solid #38bdf8;
      border-radius: 9999px;
      padding: 5px 14px;
      font-size: 11px;
      font-weight: 800;
      color: #fff;
      cursor: pointer;
      pointer-events: auto;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .hud-mode-pill:hover {
      transform: translateY(-1px) scale(1.03);
      box-shadow: 0 6px 18px rgba(56, 189, 248, 0.6);
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
    }
    .hud-mode-pill.cursor-mode {
      background: linear-gradient(135deg, #8b5cf6, #6d28d9);
      border-color: #c084fc;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    }

    #airspaceWarning {
      position: absolute;
      top: 130px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(90deg, rgba(220, 38, 38, 0.96), rgba(153, 27, 27, 0.96));
      border: 2px solid #facc15;
      box-shadow: 0 0 35px rgba(239, 68, 68, 0.85);
      border-radius: 12px;
      padding: 9px 24px;
      display: none;
      align-items: center;
      gap: 12px;
      z-index: 28;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      animation: alertPulse 0.4s infinite alternate;
    }

    /* Banners & Alerts */
    #outpostLockdownBanner {
      position: absolute;
      top: 86px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(180, 0, 0, 0.92);
      border: 2px solid #ff3b40;
      box-shadow: 0 0 25px rgba(255, 0, 0, 0.7);
      border-radius: 14px;
      padding: 8px 22px;
      display: none;
      align-items: center;
      gap: 10px;
      z-index: 25;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 1px;
    }

    #streetHazardBanner {
      position: absolute;
      bottom: 86px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(90deg, rgba(230, 36, 41, 0.95), rgba(180, 0, 0, 0.95));
      border: 2px solid #ffbe0b;
      box-shadow: 0 0 30px rgba(230, 36, 41, 0.8);
      border-radius: 12px;
      padding: 10px 24px;
      display: none;
      align-items: center;
      gap: 12px;
      z-index: 25;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      animation: alertPulse 0.5s infinite alternate;
    }

    #spiderSenseFlash {
      position: absolute;
      top: 140px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 190, 11, 0.95);
      color: #111;
      font-weight: 900;
      font-size: 13px;
      letter-spacing: 1.5px;
      padding: 6px 18px;
      border-radius: 20px;
      box-shadow: 0 0 25px #ffbe0b;
      display: none;
      z-index: 25;
      text-transform: uppercase;
      animation: alertPulse 0.3s infinite alternate;
    }

    #stunAlert {
      position: absolute;
      top: 180px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 120, 212, 0.95);
      color: #fff;
      font-weight: 900;
      font-size: 13px;
      padding: 6px 18px;
      border-radius: 20px;
      box-shadow: 0 0 25px #38bdf8;
      display: none;
      z-index: 25;
      animation: alertPulse 0.3s infinite alternate;
    }

    #cheatAlert {
      position: absolute;
      top: 220px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(90deg, #ffd700, #ff8c00);
      color: #000;
      font-weight: 900;
      font-size: 16px;
      padding: 10px 24px;
      border-radius: 25px;
      box-shadow: 0 0 35px #ffd700;
      display: none;
      z-index: 50;
      animation: modalPop 0.3s ease-out;
    }

    @keyframes alertPulse {
      from { opacity: 0.8; transform: translateX(-50%) scale(0.96); }
      to { opacity: 1; transform: translateX(-50%) scale(1.05); }
    }

    /* Top Tools */
    #top-tools {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      gap: 8px;
      z-index: 25;
      pointer-events: auto;
    }

    .tool-btn {
      background: var(--panel-bg);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
    }

    .tool-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }

    /* Modals */
    .modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(4, 8, 16, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      padding: 16px;
    }

    .modal-backdrop.active {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-box {
      background: linear-gradient(150deg, #131c31, #0a0f1d);
      border: 2px solid rgba(230, 36, 41, 0.6);
      border-radius: 22px;
      width: 100%;
      max-width: 620px;
      padding: 30px;
      box-shadow: 0 20px 70px rgba(230, 36, 41, 0.4), 0 0 30px rgba(0, 120, 212, 0.35);
      text-align: center;
      position: relative;
      animation: modalPop 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    @keyframes modalPop {
      from { transform: scale(0.85); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .modal-title {
      font-size: 30px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      background: linear-gradient(90deg, #ff4d52, #ffbe0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 6px;
    }

    .modal-subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 20px;
    }

    .instructions-card {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 24px;
      text-align: left;
      font-size: 13px;
      line-height: 1.6;
    }

    .instructions-card h4 {
      color: var(--spidey-gold);
      font-size: 14px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .key-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: #fff;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 6px;
      font-size: 11px;
      margin: 0 2px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }

    .stat-pill {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stat-pill span {
      font-size: 11px;
      color: #94a3b8;
      display: block;
    }

    .stat-pill strong {
      font-size: 22px;
      color: #fff;
    }

    .btn-spidey {
      background: linear-gradient(135deg, #e62429, #b31217);
      border: none;
      color: #fff;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 1px;
      padding: 15px 30px;
      border-radius: 14px;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(230, 36, 41, 0.55);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-transform: uppercase;
      width: 100%;
    }

    .btn-spidey:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 34px rgba(230, 36, 41, 0.75);
      background: linear-gradient(135deg, #ff3b40, #cc181e);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #cbd5e1;
      font-size: 13px;
      padding: 12px 20px;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 10px;
      width: 100%;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    /* Mobile Controls */
    #mobile-controls {
      position: absolute;
      bottom: 18px;
      left: 14px;
      right: 14px;
      display: none;
      justify-content: space-between;
      align-items: flex-end;
      pointer-events: none;
      z-index: 30;
    }

    .dpad-group, .action-group {
      display: flex;
      gap: 8px;
      pointer-events: auto;
    }

    .action-group {
      flex-wrap: wrap;
      max-width: 210px;
      justify-content: flex-end;
    }

    .mobile-btn {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      font-size: 17px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    .mobile-btn:active {
      background: rgba(230, 36, 41, 0.85);
      border-color: #ffbe0b;
      transform: scale(0.92);
    }

    @media (max-width: 768px) {
      #mobile-controls { display: flex; }
      .hud-left { min-width: 130px; }
      .hud-right { min-width: 110px; margin-right: 90px; }
      .score-val { font-size: 18px; }
    }
  </style>
</head>
<body>

  <div id="game-container">
    <canvas id="gameCanvas"></canvas>

    <!-- Top Tools -->
    <div id="top-tools">
      <button class="tool-btn" id="audioBtn" title="Suara Nyala/Mati">🔊</button>
      <button class="tool-btn" id="pauseBtn" title="Jeda Permainan">⏸️</button>
    </div>

    <!-- HUD -->
    <div id="hud">
      <!-- Spidey Stats -->
      <div class="hud-card hud-left">
        <div class="bar-row">
          <span style="color: #ff4d52;">❤️ DARAH</span>
          <div class="bar-shell">
            <div class="bar-core" id="hp-bar" style="width: 100%;"></div>
          </div>
        </div>
        <div class="bar-row">
          <span style="color: #38bdf8;">🕸️ JARING</span>
          <div class="bar-shell">
            <div class="bar-core" id="web-bar" style="width: 100%;"></div>
          </div>
        </div>
        <div style="font-size: 11px; font-weight: 700; color: #90e0ef; margin-top: 2px;">
          <span>🕸️ AYUNAN:</span> <strong style="color:#ffbe0b;">BEBAS DI MANA SAJA</strong>
        </div>
      </div>

      <!-- Distance Track -->
      <div class="hud-card hud-center">
        <div style="display:flex; justify-content:space-between; width:100%; font-size:11px; font-weight:800; margin-bottom:4px;">
          <span>JARAK: <span id="dist-curr" style="color: #ffbe0b;">0</span> m</span>
          <span>BOSS ARENA: 2400 m</span>
        </div>
        <div class="distance-track">
          <div class="distance-fill" id="distance-fill"></div>
          <div class="distance-marker" id="dist-marker">🕷️</div>
          <div class="outpost-marker" style="left: 33%;" title="Markas Oscorp #1">🛡️800m</div>
          <div class="outpost-marker" style="left: 70%;" title="Markas Oscorp #2">🛡️1700m</div>
          <div class="finish-marker">👑</div>
        </div>
      </div>

      <!-- Score, Mode & High Score -->
      <div class="hud-card hud-right" style="margin-right: 90px; gap: 6px;">
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
          <button id="btnWebMode" class="hud-mode-pill" title="Klik atau tekan [T] untuk ganti mode ayunan">🎯 LINGKARAN [T]</button>
          <div class="score-val" id="score-display">0</div>
        </div>
        <div class="highscore-val">REKOR: <span id="highscore-display">0</span></div>
        <div id="combo-badge" style="display:none; color: #ffbe0b; font-size: 11px; font-weight: 800;">COMBO x2</div>
      </div>
    </div>

    <!-- BOSS HEALTH BAR HUD -->
    <div id="bossBarContainer">
      <div class="boss-bar-header">
        <span id="bossNameDisplay" style="color: #ff3b40;">⚠️ BOSS: GREEN GOBLIN</span>
        <span id="bossHpPercent" style="color: #ffbe0b;">100%</span>
      </div>
      <div class="boss-bar-shell">
        <div class="boss-bar-fill" id="bossHpFill"></div>
      </div>
    </div>

    <!-- Airspace Anti-Camping Drone Banner -->
    <div id="airspaceWarning">
      <span>🚨</span>
      <span>ZONA UDARA TERBATAS! DRONE ANTI-CAMPING MENGINCIRMU! TURUN KE KOTA!</span>
    </div>

    <!-- Outpost Lockdown Banner -->
    <div id="outpostLockdownBanner">
      <span>🚨</span>
      <span>MARKAS TERKUNCI! KALAHKAN <span id="outpostRemaining" style="color:#ffbe0b;">0</span> PENJAGA UNTUK BUKA BARRIER!</span>
    </div>

    <!-- Street Hazard Alert -->
    <div id="streetHazardBanner">
      <span>⚠️ AWAS JALAN RAYA! NAIK KE ATAS SEBELUM DITABRAK MOBIL! (<span id="streetTimerVal">10</span>s)</span>
    </div>

    <!-- Spider Sense Alert -->
    <div id="spiderSenseFlash">⚡ SPIDER-SENSE: TEKAN [CTRL] UNTUK PERFECT DODGE! ⚡</div>
    <div id="stunAlert">⚡ DISENGAT JELAJAH LISTRIK! KALAHKAN MUSUH! ⚡</div>
    <div id="cheatAlert">⚡ CHEAT DIAKTIFKAN: TELEPORT KE BOSS FIGHT! ⚡</div>

    <!-- Mobile Touch Controls -->
    <div id="mobile-controls">
      <div class="dpad-group">
        <button class="mobile-btn" id="btn-left">◀</button>
        <button class="mobile-btn" id="btn-right">▶</button>
        <button class="mobile-btn" id="btn-down">▼</button>
      </div>
      <div class="action-group">
        <button class="mobile-btn" id="btn-zip" style="background:rgba(16, 185, 129, 0.75);" title="Web-Zip">[C]</button>
        <button class="mobile-btn" id="btn-dodge" style="background:rgba(234, 88, 12, 0.75);" title="Dodge">[CTRL]</button>
        <button class="mobile-btn" id="btn-shoot" style="background:rgba(230, 36, 41, 0.75);" title="Shoot Web">[E]</button>
        <button class="mobile-btn" id="btn-swing" style="background:rgba(0, 120, 212, 0.75);" title="Swing">[KLIK]</button>
        <button class="mobile-btn" id="btn-jump" style="background:rgba(147, 51, 234, 0.75);" title="Jump">▲</button>
      </div>
    </div>

    <!-- START MODAL -->
    <div class="modal-backdrop active" id="startModal">
      <div class="modal-box">
        <div style="font-size: 42px; margin-bottom: 8px; filter: drop-shadow(0 0 12px #e62429);">🕷️</div>
        <h2 class="modal-title">SPIDER-MAN: THE ULTIMATE SHOWDOWN</h2>
        <p class="modal-subtitle">Web-Slinger City Rush • Hadapi Green Goblin / Doctor Octopus!</p>

        <div class="instructions-card">
          <h4>🎮 KONTROL & FITUR ENHANCED:</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
            <li>🏃 <strong>Jalan, Wall Crawling & Clinging:</strong> <span class="key-badge">A</span>/<span class="key-badge">D</span> bergerak. Saat menempel di dinding gedung, gunakan <span class="key-badge">W</span> untuk merayap naik dan <span class="key-badge">S</span> untuk turun tanpa melompat-lompat! Diam di dinding untuk pose menempel (*wall-cling*). Tekan <span class="key-badge">SPACE</span> khusus untuk <strong>Wall Jump</strong> menjauh dari tembok!</li>
            <li>🕸️ <strong>Web Swinging Realistis (Pendulum Physics):</strong> Tahan <span class="key-badge">KLIK KIRI</span> untuk berayun. Tekan <span class="key-badge">A</span>/<span class="key-badge">D</span> saat berayun untuk memompa akselerasi (*swing pumping*). Tekan <span class="key-badge">W</span>/<span class="key-badge">S</span> untuk menarik/mengulur panjang jaring. Lepas klik atau tekan <span class="key-badge">SPACE</span> di titik naik untuk <strong>Catapult Launch</strong> melesat tinggi ke depan!</li>
            <li>🎯 <strong>Pilihan Mode Web Swing:</strong> Tekan <span class="key-badge">T</span> atau tombol mode di HUD untuk berganti antara <strong>Mode Lingkaran (Anchor)</strong> atau <strong>Mode Bebas (Cursor)</strong>!</li>
            <li>🛸 <strong>Drone Anti-Camping Atas:</strong> Jangan camping di awan/langit paling atas! Drone patroli pertahanan udara akan menembakkan EMP Blast yang melumpuhkan dan membanting Spider-Man ke bawah jika Anda berdiam di langit!</li>
            <li>🚀 <strong>Web-Zip & Bunuh Musuh:</strong> Arahkan kursor ke dinding atau musuh lalu tekan <span class="key-badge">C</span> untuk menukik membunuh musuh instan!</li>
            <li>🎯 <strong>Tembak Jaring (Musuh & Boss):</strong> Arahkan kursor ke musuh atau boss + tekan <span class="key-badge">E</span> untuk melumpuhkan musuh dari jauh.</li>
            <li>🛡️ <strong>Perfect Dodge:</strong> Tekan <span class="key-badge">CTRL</span> tepat sebelum serangan musuh mengenai Spidey untuk Matrix slow-motion!</li>
            <li>🛑 <strong>Markas & Barrier Solid:</strong> Musuh markas dilacak secara ketat dan otomatis membuka barrier seketika saat semua musuh markas dikalahkan!</li>
            <li>👑 <strong>Grand Boss Battle:</strong> Di helipad 2400m, lawan <strong>GREEN GOBLIN</strong> atau <strong>GIANT DOCTOR OCTOPUS</strong> dengan animasi sprite yang telah diperbaiki tanpa glitch!</li>
            <li>⌨️ <strong>Cheat Code Rahasia:</strong> Ketik <span class="key-badge">Spidey123</span> kapan saja untuk warp langsung ke arena Boss fight!</li>
          </ul>
        </div>

        <button class="btn-spidey" id="startBtn">MULAI PETUALANGAN 🕸️</button>
      </div>
    </div>

    <!-- GAME OVER MODAL -->
    <div class="modal-backdrop" id="gameOverModal">
      <div class="modal-box">
        <div style="font-size: 42px; filter: drop-shadow(0 0 12px #ff2e3b); margin-bottom: 8px;">💀</div>
        <h2 class="modal-title" style="background: linear-gradient(90deg, #ff2e3b, #ff7b00); -webkit-background-clip:text;">SPIDER-MAN TERJATUH!</h2>
        <p class="modal-subtitle">New York masih menunggumu! Ayo bangkit kembali!</p>

        <div class="stats-grid">
          <div class="stat-pill">
            <span>JARAK TERCAPAI</span>
            <strong id="go-dist">0 m</strong>
          </div>
          <div class="stat-pill">
            <span>SKOR AKHIR</span>
            <strong id="go-score">0</strong>
          </div>
          <div class="stat-pill">
            <span>MUSUH DIKALAHKAN</span>
            <strong id="go-enemies">0</strong>
          </div>
          <div class="stat-pill">
            <span>REKOR TERTINGGI</span>
            <strong id="go-high" style="color: var(--spidey-gold);">0</strong>
          </div>
        </div>

        <button class="btn-spidey" id="restartBtn">🔄 MULAI ULANG (RESTART)</button>
      </div>
    </div>

    <!-- VICTORY MODAL -->
    <div class="modal-backdrop" id="victoryModal">
      <div class="modal-box">
        <div style="font-size: 46px; filter: drop-shadow(0 0 18px #ffbe0b); margin-bottom: 8px;">🏆</div>
        <h2 class="modal-title" style="background: linear-gradient(90deg, #ffbe0b, #00d26a); -webkit-background-clip:text;">KOTA AMAN! BOSS DIKALAHKAN!</h2>
        <p class="modal-subtitle" id="vicSubtitle">Kamu berhasil mengalahkan Boss legendaris dan menyelamatkan New York!</p>

        <div class="stats-grid">
          <div class="stat-pill">
            <span>BOSS DIKALAHKAN</span>
            <strong id="vic-boss" style="color: #00d26a;">GREEN GOBLIN</strong>
          </div>
          <div class="stat-pill">
            <span>SKOR AKHIR</span>
            <strong id="vic-score">0</strong>
          </div>
          <div class="stat-pill">
            <span>TOTAL ELIMINASI</span>
            <strong id="vic-enemies">0</strong>
          </div>
          <div class="stat-pill">
            <span>REKOR TERTINGGI</span>
            <strong id="vic-high" style="color: var(--spidey-gold);">0</strong>
          </div>
        </div>

        <button class="btn-spidey" id="vicRestartBtn">🔄 MAIN LAGI (LAWAN BOSS BERIKUTNYA)</button>
      </div>
    </div>

    <!-- PAUSE MODAL -->
    <div class="modal-backdrop" id="pauseModal">
      <div class="modal-box">
        <div style="font-size: 40px; margin-bottom: 8px;">⏸️</div>
        <h2 class="modal-title">PERMAINAN DIJEDA</h2>
        <p class="modal-subtitle">Tarik napas sejenak, Peter Parker!</p>
        <button class="btn-spidey" id="resumeBtn">LANJUTKAN BERMAIN ▶️</button>
        <button class="btn-secondary" id="pauseRestartBtn">🔄 Mulai Ulang dari Awal</button>
      </div>
    </div>
  </div>

  <script>
    /* =========================================================================
       AUDIO SYNTHESIZER
       ========================================================================= */
    class SoundEngine {
      constructor() { this.ctx = null; this.enabled = true; }
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      }
      playThwip() {
        if (!this.enabled || !this.ctx) return;
        try {
          const osc = this.ctx.createOscillator(), gain = this.ctx.createGain(), filter = this.ctx.createBiquadFilter();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1650, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.14);
          filter.type = 'bandpass'; filter.frequency.setValueAtTime(1500, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.14);
          osc.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
          osc.start(); osc.stop(this.ctx.currentTime + 0.15);
        } catch (e) {}
      }
      playSwing() {
        if (!this.enabled || !this.ctx) return;
        try {
          const bufferSize = this.ctx.sampleRate * 0.22;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = this.ctx.createBufferSource(); noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass';
          filter.frequency.setValueAtTime(280, this.ctx.currentTime);
          filter.frequency.linearRampToValueAtTime(750, this.ctx.currentTime + 0.08);
          filter.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.22);
          const gain = this.ctx.createGain(); gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.22);
          noise.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
          noise.start();
        } catch (e) {}
      }
      playJump() {
        if (!this.enabled || !this.ctx) return;
        try {
          const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
          osc.type = 'sine'; osc.frequency.setValueAtTime(220, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(); osc.stop(this.ctx.currentTime + 0.13);
        } catch (e) {}
      }
      playDodge() {
        if (!this.enabled || !this.ctx) return;
        try {
          const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
          osc.type = 'sine'; osc.frequency.setValueAtTime(800, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(); osc.stop(this.ctx.currentTime + 0.21);
        } catch (e) {}
      }
      playHit() {
        if (!this.enabled || !this.ctx) return;
        try {
          const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
          osc.type = 'triangle'; osc.frequency.setValueAtTime(320, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.18);
          gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(); osc.stop(this.ctx.currentTime + 0.19);
        } catch (e) {}
      }
      playBossRoar() {
        if (!this.enabled || !this.ctx) return;
        try {
          const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
          osc.type = 'sawtooth'; osc.frequency.setValueAtTime(130, this.ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(280, this.ctx.currentTime + 0.25);
          osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.6);
          gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(); osc.stop(this.ctx.currentTime + 0.62);
        } catch (e) {}
      }
      playExplosion() {
        if (!this.enabled || !this.ctx) return;
        try {
          const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
          osc.type = 'square'; osc.frequency.setValueAtTime(150, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.35);
          gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(); osc.stop(this.ctx.currentTime + 0.36);
        } catch (e) {}
      }
      playAlarm() {
        if (!this.enabled || !this.ctx) return;
        try {
          const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
          osc.type = 'sawtooth'; osc.frequency.setValueAtTime(920, this.ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(460, this.ctx.currentTime + 0.16);
          gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.16);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(); osc.stop(this.ctx.currentTime + 0.17);
        } catch (e) {}
      }
      playCheatWarp() {
        if (!this.enabled || !this.ctx) return;
        const notes = [440, 659, 880, 1318];
        notes.forEach((f, i) => {
          setTimeout(() => {
            try {
              const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
              osc.type = 'sine'; osc.frequency.setValueAtTime(f, this.ctx.currentTime);
              gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
              osc.connect(gain); gain.connect(this.ctx.destination);
              osc.start(); osc.stop(this.ctx.currentTime + 0.26);
            } catch (e) {}
          }, i * 70);
        });
      }
      playVictory() {
        if (!this.enabled || !this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          setTimeout(() => {
            try {
              const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
              osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
              gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
              osc.connect(gain); gain.connect(this.ctx.destination);
              osc.start(); osc.stop(this.ctx.currentTime + 0.36);
            } catch (e) {}
          }, idx * 110);
        });
      }
    }
    const sound = new SoundEngine();

    /* =========================================================================
       SPRITE SHEETS EMBEDDED
       ========================================================================= */
    const spideyImg = new Image();
    spideyImg.src = "data:image/png;base64," + \`${spideyB64}\`;

    // Climbing animation strip (V2 no white-bg): 10 frames × 48px = 480×96
    const climbImg = new Image();
    climbImg.src = "data:image/png;base64," + \`${climbB64}\`;
    const CLIMB_FRAME_W = 48;
    const CLIMB_FRAME_H = 96;
    const CLIMB_NUM_FRAMES = 10;

    const goblinImg = new Image();
    goblinImg.src = "data:image/png;base64," + \`${goblinB64}\`;

    const docockImg = new Image();
    docockImg.src = "data:image/png;base64," + \`${docockB64}\`;


    // Spider-Man Sprite Frames
    // V1 sheet (512x319) for all except climbing
    // Climbing uses separate climbImg strip (V2, no white bg)
    const SPIDEY_FRAMES = {
      run: [
        { x: 13,  y: 3,   w: 38, h: 73 },
        { x: 56,  y: 0,   w: 40, h: 74 },
        { x: 112, y: 2,   w: 35, h: 74 },
        { x: 154, y: 2,   w: 50, h: 74 },
        { x: 218, y: 2,   w: 53, h: 67 },
        { x: 271, y: 0,   w: 50, h: 62 },
        { x: 325, y: 0,   w: 41, h: 75 },
        { x: 381, y: 2,   w: 34, h: 74 }
      ],
      idle: [
        { x: 325, y: 0,   w: 41, h: 75 }, // Ready stance
        { x: 67,  y: 180, w: 29, h: 51 }  // Iconic Spidey crouch
      ],
      shoot:    { x: 375, y: 89,  w: 48, h: 78 },
      jump:     { x: 1,   y: 179, w: 51, h: 58 },
      swing:    { x: 280, y: 180, w: 61, h: 78 },
      dodge:    { x: 435, y: 204, w: 40, h: 52 },
      zip:      { x: 310, y: 89,  w: 66, h: 78 },
      wallCling:{ x: 114, y: 180, w: 41, h: 51 },
      // Climb: 3 frames from V1 sheet (clear wall-crawl poses)
      climb: [
        { x: 114, y: 180, w: 41, h: 51 }, // cling/cling
        { x: 154, y: 200, w: 52, h: 56 }, // reach up
        { x: 226, y: 200, w: 44, h: 43 }  // pull up
      ]
    };

    // Green Goblin Frames (Zero bleed, single person per frame)
    const GOBLIN_FRAMES = {
      glider: [
        { x: 38, y: 345, w: 33, h: 58 },
        { x: 75, y: 345, w: 33, h: 58 },
        { x: 114, y: 345, w: 33, h: 58 },
        { x: 153, y: 345, w: 32, h: 58 },
        { x: 187, y: 345, w: 39, h: 61 },
        { x: 230, y: 345, w: 33, h: 58 }
      ],
      throwBomb: { x: 44, y: 50, w: 48, h: 81 },
      hurt: { x: 267, y: 345, w: 42, h: 58 }
    };

    // Doctor Octopus Frames (Strictly bounded height, no vertical bleeding)
    const DOCOCK_FRAMES = {
      walk: [
        { x: 48, y: 115, w: 23, h: 47 },
        { x: 77, y: 115, w: 26, h: 46 },
        { x: 112, y: 115, w: 23, h: 46 },
        { x: 142, y: 115, w: 24, h: 47 },
        { x: 171, y: 116, w: 23, h: 46 },
        { x: 202, y: 116, w: 25, h: 46 },
        { x: 234, y: 116, w: 36, h: 46 },
        { x: 276, y: 116, w: 23, h: 46 },
        { x: 305, y: 116, w: 28, h: 47 },
        { x: 339, y: 117, w: 26, h: 46 },
        { x: 371, y: 117, w: 36, h: 46 }
      ],
      strike: { x: 54, y: 178, w: 51, h: 39 },
      slam: { x: 440, y: 178, w: 53, h: 39 },
      hurt: { x: 415, y: 117, w: 23, h: 45 }
    };

    /* =========================================================================
       GAME STATE & ENGINE
       ========================================================================= */
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const LEVEL_WIDTH = 2500 * 24; // 60,000 px level
    const BOSS_ARENA_START = 2400 * 24; // 57,600 px
    const STREET_Y = 1600;

    let gameRunning = false;
    let gamePaused = false;
    let animationId = null;
    let timeScale = 1.0;
    let slowMoTimer = 0;

    let selectedBossType = 'goblin'; // 'goblin' or 'docock'
    let currentBoss = null;

    // WEB TARGETING MODE: 'anchor' (lingkaran) or 'cursor' (bebas di mana saja)
    let swingMode = 'anchor';

    function setSwingMode(mode) {
      swingMode = mode;
      const btn = document.getElementById('btnWebMode');
      if (btn) {
        if (swingMode === 'anchor') {
          btn.innerHTML = '🎯 LINGKARAN [T]';
          btn.classList.remove('cursor-mode');
        } else {
          btn.innerHTML = '🖱️ BEBAS CURSOR [T]';
          btn.classList.add('cursor-mode');
        }
      }
      createFloatingText(spidey.x, spidey.y - 50, swingMode === 'anchor' ? '🎯 MODE: LINGKARAN ANCHOR' : '🖱️ MODE: BEBAS CURSOR', '#38bdf8');
    }

    function toggleWebMode() {
      setSwingMode(swingMode === 'anchor' ? 'cursor' : 'anchor');
      sound.playThwip();
    }

    // ANTI-CAMPING AIRSPACE DRONE DEFENSE
    const CAMPING_CEILING_Y = -300;
    const antiCampingDrone = {
      active: false,
      x: 0,
      y: -100,
      targetX: 0,
      chargeTimer: 0,
      cooldownTimer: 0,
      rotorAngle: 0,
      warningSirenTimer: 0,
      update(dt, spidey) {
        this.rotorAngle += dt * 35;
        if (this.cooldownTimer > 0) this.cooldownTimer -= dt;

        // Player is camping too high above the skyscrapers!
        const isCamping = spidey.y < CAMPING_CEILING_Y && spidey.hp > 0 && !spidey.onStreet;

        if (isCamping) {
          this.active = true;
          this.targetX = spidey.x;
          this.x += (this.targetX - this.x) * (dt * 5.0);
          const targetY = Math.max(20, spidey.y - 110);
          this.y += (targetY - this.y) * (dt * 6.0);

          this.chargeTimer += dt;
          this.warningSirenTimer += dt;

          const warnEl = document.getElementById('airspaceWarning');
          if (warnEl) warnEl.style.display = 'flex';

          if (this.warningSirenTimer > 0.45) {
            sound.playAlarm();
            this.warningSirenTimer = 0;
          }

          // Laser targeting lock
          if (this.chargeTimer >= 1.2 && this.cooldownTimer <= 0) {
            this.fireEmpShock(spidey);
            this.chargeTimer = 0;
            this.cooldownTimer = 1.0;
          }
        } else {
          if (this.active) {
            this.chargeTimer = Math.max(0, this.chargeTimer - dt * 2);
            this.y -= dt * 250;
            if (this.y < -150) {
              this.active = false;
              const warnEl = document.getElementById('airspaceWarning');
              if (warnEl) warnEl.style.display = 'none';
            }
          }
        }
      },
      fireEmpShock(spidey) {
        sound.playExplosion();
        createFloatingText(spidey.x, spidey.y - 60, '⚡ EMP SMASH! KEMBALI KE KOTA! -18 HP', '#facc15');
        spidey.takeDamage(18);
        // FORCE DOWNWARD VELOCITY & SLIGHT STUN
        spidey.vy = 750;
        spidey.vx = (Math.random() - 0.5) * 200;
        spidey.stunTimer = 1.2;

        // Sparks & shockwave
        for (let i = 0; i < 22; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 120 + Math.random() * 260;
          createParticle(spidey.x, spidey.y, Math.cos(ang) * spd, Math.sin(ang) * spd, '#facc15', 3.5, 0.6);
        }
      },
      draw(ctx, spidey) {
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);

        // Warning targeting laser to Spidey
        const dx = spidey.x - this.x;
        const dy = spidey.y - this.y;
        ctx.strokeStyle = this.chargeTimer > 0.8 ? 'rgba(239, 68, 68, 0.9)' : 'rgba(234, 179, 8, 0.6)';
        ctx.lineWidth = this.chargeTimer > 0.8 ? 3 : 1.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(dx, dy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Drone Body
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-24, -10, 48, 20, 6);
        ctx.fill();
        ctx.stroke();

        // Flashing Warning Beacons
        const flash = Math.floor(Date.now() / 120) % 2 === 0;
        ctx.fillStyle = flash ? '#ef4444' : '#3b82f6';
        ctx.beginPath(); ctx.arc(-14, 0, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = flash ? '#3b82f6' : '#ef4444';
        ctx.beginPath(); ctx.arc(14, 0, 4, 0, Math.PI * 2); ctx.fill();

        // Twin Rotors
        [-22, 22].forEach(rx => {
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(rx, -10);
          ctx.lineTo(rx, -16);
          ctx.stroke();

          ctx.save();
          ctx.translate(rx, -16);
          ctx.scale(Math.cos(this.rotorAngle), 1);
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-16, 0); ctx.lineTo(16, 0);
          ctx.stroke();
          ctx.restore();
        });

        // Searchlight cone
        const grad = ctx.createRadialGradient(0, 12, 5, 0, 80, 80);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(-45, 120);
        ctx.lineTo(45, 120);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    };

    let highScore = parseInt(localStorage.getItem('spiderman_high_score') || '0', 10);
    document.getElementById('highscore-display').innerText = highScore;

    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      worldX: 0,
      worldY: 0,
      isDown: false,
      targetEnemy: null,
      selectedAnchor: null
    };

    const keys = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false
    };

    // CHEAT CODE BUFFER: "Spidey123"
    let cheatBuffer = '';
    window.addEventListener('keydown', (e) => {
      cheatBuffer += e.key;
      if (cheatBuffer.length > 25) cheatBuffer = cheatBuffer.slice(-25);
      if (/spidey123$/i.test(cheatBuffer)) {
        cheatBuffer = '';
        triggerBossWarpCheat();
      }
    });

    function triggerBossWarpCheat() {
      sound.playCheatWarp();
      spidey.x = BOSS_ARENA_START - 160;
      spidey.y = 420;
      spidey.vx = 0;
      spidey.vy = 0;
      spidey.hp = spidey.maxHp;
      spidey.webFluid = spidey.maxWebFluid;
      spidey.isWallClimbing = false;
      spidey.isSwinging = false;
      camera.x = BOSS_ARENA_START - canvas.width * 0.35;

      const cEl = document.getElementById('cheatAlert');
      cEl.style.display = 'block';
      setTimeout(() => { cEl.style.display = 'none'; }, 2500);
      createFloatingText(spidey.x, spidey.y - 60, '⚡ CHEAT ACTIVATED! WARP KE BOSS! ⚡', '#ffd700');
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    /* =========================================================================
       CAMERA SYSTEM
       ========================================================================= */
    const camera = {
      x: 0,
      y: 300,
      targetX: 0,
      targetY: 300,
      leadX: 0,
      update(target, activeBarrierX) {
        const desiredLead = target.facing * 80;
        this.leadX += (desiredLead - this.leadX) * 0.04;
        this.targetX = target.x - canvas.width * 0.35 + this.leadX;

        const vDiff = target.y - canvas.height * 0.52 - this.targetY;
        if (Math.abs(vDiff) > 75) {
          this.targetY += vDiff * 0.06;
        }

        this.x += (this.targetX - this.x) * 0.08;
        this.y += (this.targetY - this.y) * 0.07;

        if (this.x < 0) this.x = 0;
        // Clamp camera at active outpost barrier
        if (activeBarrierX && this.x > activeBarrierX - canvas.width * 0.72) {
          this.x = activeBarrierX - canvas.width * 0.72;
        }
        if (this.x > LEVEL_WIDTH - canvas.width + 500) this.x = LEVEL_WIDTH - canvas.width + 500;
        if (this.y > STREET_Y - canvas.height + 140) this.y = STREET_Y - canvas.height + 140;
      }
    };

    /* =========================================================================
       WORLD GENERATION
       ========================================================================= */
    let buildings = [];
    let swingAnchors = [];
    let enemies = [];
    let outposts = [];
    let enemyLasers = [];
    let webProjectiles = [];
    let bossProjectiles = [];
    let streetCars = [];
    let particles = [];
    let floatingTexts = [];
    let collectibles = [];

    function setupOutposts() {
      outposts = [
        {
          id: 1,
          barrierX: 800 * 24, // 19,200 px
          startX: 800 * 24 - 850,
          enemiesRemaining: 3,
          cleared: false,
          active: false
        },
        {
          id: 2,
          barrierX: 1700 * 24, // 40,800 px
          startX: 1700 * 24 - 950,
          enemiesRemaining: 4,
          cleared: false,
          active: false
        }
      ];
    }

    function generateWorld() {
      buildings = [];
      swingAnchors = [];
      enemies = [];
      enemyLasers = [];
      webProjectiles = [];
      bossProjectiles = [];
      streetCars = [];
      particles = [];
      floatingTexts = [];
      collectibles = [];
      setupOutposts();

      selectedBossType = Math.random() < 0.5 ? 'goblin' : 'docock';

      let currentX = -300;
      const roofBaseY = 500;

      // Start Rooftop
      buildings.push({
        x: currentX,
        y: roofBaseY,
        w: 900,
        h: STREET_Y - roofBaseY + 400,
        color: '#1a233a'
      });
      currentX += 900;

      let bIndex = 0;
      while (currentX < BOSS_ARENA_START) {
        bIndex++;
        const gap = 160 + Math.random() * 220;
        const width = 380 + Math.random() * 440;
        const y = roofBaseY + (Math.sin(bIndex * 0.7) * 90) + (Math.random() * 40 - 20);

        const colors = ['#161e31', '#1e293b', '#0f172a', '#1e1b4b', '#172554'];
        const bColor = colors[Math.floor(Math.random() * colors.length)];

        buildings.push({
          x: currentX + gap,
          y: y,
          w: width,
          h: STREET_Y - y + 400,
          color: bColor
        });

        // HIGH SWING ANCHORS
        const anchorX1 = currentX + gap * 0.5;
        const anchorY1 = y - 360 - Math.random() * 120;
        swingAnchors.push({ x: anchorX1, y: anchorY1, r: 24, pulse: Math.random() * Math.PI });

        if (width > 420) {
          swingAnchors.push({
            x: currentX + gap + width * 0.5,
            y: y - 380 - Math.random() * 100,
            r: 24,
            pulse: Math.random() * Math.PI
          });
        }

        // Outpost Enemies
        const isNearOutpost1 = (currentX > 18300 && currentX < 19200);
        const isNearOutpost2 = (currentX > 39800 && currentX < 40800);

        if (isNearOutpost1) {
          if (enemies.filter(e => e.outpostId === 1).length < 3) {
            enemies.push(new Enemy(currentX + gap + 100, y - 70, 'drone', 1));
          }
        } else if (isNearOutpost2) {
          if (enemies.filter(e => e.outpostId === 2).length < 4) {
            enemies.push(new Enemy(currentX + gap + 120, y - 80, 'chaser', 2));
          }
        } else {
          if (currentX > 1000 && Math.random() < 0.4) {
            const eType = Math.random() < 0.4 ? 'chaser' : 'drone';
            enemies.push(new Enemy(currentX + gap + 80, y - 70 - Math.random() * 100, eType));
          }
        }

        if (Math.random() < 0.55) {
          collectibles.push({
            x: currentX + gap + width * 0.5,
            y: y - 36,
            type: Math.random() < 0.3 ? 'pizza' : 'coin',
            collected: false
          });
        }

        currentX += gap + width;
      }

      // FINAL BOSS ARENA (Oscorp Helipad at 2400m - 2500m)
      const arenaRoofY = 460;
      const arenaWidth = 1800;
      buildings.push({
        x: BOSS_ARENA_START,
        y: arenaRoofY,
        w: arenaWidth,
        h: STREET_Y - arenaRoofY + 400,
        color: '#0a1628',
        isArena: true
      });

      // Arena High Anchors
      swingAnchors.push({ x: BOSS_ARENA_START + 350, y: arenaRoofY - 380, r: 26, pulse: 0 });
      swingAnchors.push({ x: BOSS_ARENA_START + 850, y: arenaRoofY - 420, r: 26, pulse: 0 });
      swingAnchors.push({ x: BOSS_ARENA_START + 1350, y: arenaRoofY - 380, r: 26, pulse: 0 });

      currentBoss = new Boss(BOSS_ARENA_START + 850, arenaRoofY - 10, selectedBossType);

      for (let i = 0; i < 16; i++) {
        streetCars.push(new StreetCar(i * 440 + Math.random() * 200, Math.random() > 0.5 ? 1 : -1));
      }
    }

    /* =========================================================================
       SPIDER-MAN CLASS
       ========================================================================= */
    class SpiderMan {
      constructor() { this.reset(); }

      reset() {
        this.x = 200;
        this.y = 400;
        this.w = 34;
        this.h = 60;
        this.vx = 0;
        this.vy = 0;
        this.facing = 1;

        this.hp = 100;
        this.maxHp = 100;
        this.webFluid = 100;
        this.maxWebFluid = 100;

        this.isGrounded = false;
        this.isSwinging = false;
        this.swingAnchor = null;
        this.ropeLength = 0;
        this.swingAngle = 0;
        this.angularVel = 0;

        // Wall Crawling & Clinging
        this.isWallClimbing = false;
        this.wallSide = 0;
        this.climbCycle = 0;

        // Web-Zip
        this.isZipping = false;
        this.zipStartX = 0; this.zipStartY = 0;
        this.zipTargetX = 0; this.zipTargetY = 0;
        this.zipProgress = 0;
        this.zipEnemyTarget = null;

        // Dodge
        this.isDodging = false;
        this.dodgeTimer = 0;

        // Stunned / Slowed status
        this.stunTimer = 0;

        this.onStreet = false;
        this.streetTimer = 10.0;

        this.idleTimer = 0;
        this.runCycle = 0;
        this.state = 'idle';
        this.invulnerableTimer = 0;
        this.score = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.enemiesDefeated = 0;
      }

      update(dt, activeBarrierX) {
        if (this.webFluid < this.maxWebFluid) {
          this.webFluid = Math.min(this.maxWebFluid, this.webFluid + 40 * dt);
        }
        if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;

        // Stun decay
        if (this.stunTimer > 0) {
          this.stunTimer -= dt;
          document.getElementById('stunAlert').style.display = 'block';
          if (this.stunTimer <= 0) document.getElementById('stunAlert').style.display = 'none';
        }

        if (this.combo > 0) {
          this.comboTimer -= dt;
          if (this.comboTimer <= 0) {
            this.combo = 0;
            document.getElementById('combo-badge').style.display = 'none';
          }
        }

        // ================= DODGE STATE =================
        if (this.isDodging) {
          this.dodgeTimer -= dt;
          this.state = 'dodge';
          // Move horizontally — collision detection STILL runs below (no early return)
          this.x += this.facing * 520 * dt;
          this.vx = 0;
          if (this.dodgeTimer <= 0) this.isDodging = false;
          // Apply barrier clamp immediately during dodge
          if (activeBarrierX && this.x >= activeBarrierX - 22) {
            this.x = activeBarrierX - 22;
            this.isDodging = false; // cancel dodge at barrier
          }
          // Don't return — let building collision detection below run normally
        }

        // ================= WEB-ZIP STATE =================
        if (this.isZipping) {
          this.state = 'zip';
          this.zipProgress += dt * 4.6;

          // Clamp zip position to barrier!
          if (activeBarrierX && this.zipTargetX >= activeBarrierX - 25) {
            this.zipTargetX = activeBarrierX - 25;
          }

          if (this.zipProgress >= 1.0) {
            this.isZipping = false;
            this.x = this.zipTargetX;
            this.y = this.zipTargetY;

            // IF ZIPPED INTO AN ENEMY -> POW! WEB STRIKE!
            if (this.zipEnemyTarget) {
              if (this.zipEnemyTarget === currentBoss) {
                currentBoss.takeDamage(85, this);
                createFloatingText(this.x, this.y - 40, '💥 ZIP KICK! -85', '#ffbe0b');
              } else {
                this.zipEnemyTarget.hitByWeb(this);
                createFloatingText(this.x, this.y - 40, '💥 POW! ZIP STRIKE!', '#ffbe0b');
                this.addScore(300, this.x, this.y);
              }
              sound.playHit();
              this.zipEnemyTarget = null;
            }

            // Acrobatic bounce forward into the air!
            this.vx = this.facing * 440;
            this.vy = -450;
            sound.playJump();
            createDust(this.x, this.y);
          } else {
            this.x = this.zipStartX + (this.zipTargetX - this.zipStartX) * this.zipProgress;
            this.y = this.zipStartY + (this.zipTargetY - this.zipStartY) * this.zipProgress;
          }
          return;
        }

        // ================= WALL CRAWLING STATE =================
        if (this.isWallClimbing) {
          this.state = 'climb';
          this.vx = 0;

          // PURE CLIMBING WITHOUT JUMPING: W = Climb Up, S = Slide Down
          if (keys.up) {
            this.vy = -270;
            this.y += this.vy * dt;
            this.climbCycle += dt * 8;
          } else if (keys.down) {
            this.vy = 220;
            this.y += this.vy * dt;
            this.climbCycle += dt * 8;
          } else {
            // Stationary cling on the wall!
            this.vy = 0;
          }

          // Wall Jump: ONLY TRIGGERED BY SPACE KEY!
          if (keys.jump) {
            this.isWallClimbing = false;
            this.vx = -this.wallSide * 480;
            this.vy = -640;
            this.facing = -this.wallSide;
            sound.playJump();
            createDust(this.x, this.y);
            createFloatingText(this.x, this.y - 30, 'WALL JUMP! 💨', '#38bdf8');
          }
          return;
        }

        // ================= REALISTIC WEB SWINGING (PENDULUM PHYSICS) =================
        if (this.isSwinging && this.swingAnchor) {
          this.state = 'swing';

          // 1. Gravity and Pendulum Dynamics
          const g = 1420;
          const gravityTorque = -(g / this.ropeLength) * Math.sin(this.swingAngle);
          let angularAcc = gravityTorque;

          // 2. Swing Pumping: Pressing A/D adds extra tangential propulsion in swing direction
          if (keys.right) {
            if (this.angularVel > -0.2) angularAcc += (1250 / this.ropeLength); // pump forward
            else angularAcc += (650 / this.ropeLength); // reverse pump
          }
          if (keys.left) {
            if (this.angularVel < 0.2) angularAcc -= (1250 / this.ropeLength); // pump backward
            else angularAcc -= (650 / this.ropeLength);
          }

          // 3. Reel-In / Let-Out Rope Control (W / S while swinging)
          if (keys.up) {
            this.ropeLength = Math.max(160, this.ropeLength - 200 * dt);
          }
          if (keys.down) {
            this.ropeLength = Math.min(750, this.ropeLength + 200 * dt);
          }

          this.angularVel += angularAcc * dt;

          // Natural aerodynamic drag
          this.angularVel *= Math.pow(0.996, dt * 60);

          // Safe velocity limits
          this.angularVel = Math.max(-5.8, Math.min(5.8, this.angularVel));

          this.swingAngle += this.angularVel * dt;

          // Pendulum coordinates
          this.x = this.swingAnchor.x + Math.sin(this.swingAngle) * this.ropeLength;
          this.y = this.swingAnchor.y + Math.cos(this.swingAngle) * this.ropeLength;

          // True linear velocity derived from circular motion
          const linearSpeed = this.angularVel * this.ropeLength;
          this.vx = Math.cos(this.swingAngle) * linearSpeed;
          this.vy = -Math.sin(this.swingAngle) * linearSpeed;

          // Facing direction
          if (this.vx > 15) this.facing = 1;
          else if (this.vx < -15) this.facing = -1;

          // RELEASE AYUNAN (Mouse Up atau Tekan SPACE untuk Catapult Launch)
          if (!mouse.isDown || keys.jump) {
            this.releaseSwing(keys.jump);
          }
        } else if (this.isDodging) {
          // ================= DODGE PHYSICS (gravity only, movement handled above) =================
          this.vy += 1150 * dt;
          if (this.vy > 1250) this.vy = 1250;
          this.y += this.vy * dt;
        } else {
          // ================= GROUND & AIR MOVEMENT =================
          const speedMod = (this.stunTimer > 0) ? 0.45 : 1.0;
          const moveSpeed = 480 * speedMod;

          if (keys.right) {
            this.vx += moveSpeed * 4 * dt;
            if (this.vx > moveSpeed) this.vx = moveSpeed;
            this.facing = 1;
          } else if (keys.left) {
            this.vx -= moveSpeed * 4 * dt;
            if (this.vx < -moveSpeed) this.vx = -moveSpeed;
            this.facing = -1;
          } else {
            this.vx *= this.isGrounded ? Math.pow(0.001, dt) : Math.pow(0.5, dt);
            if (Math.abs(this.vx) < 5) this.vx = 0;
          }

          // Jump: SPACE ONLY!
          if (keys.jump && this.isGrounded) {
            this.vy = -680;
            this.isGrounded = false;
            sound.playJump();
            createDust(this.x, this.y + this.h * 0.5);
          }

          if (keys.down && !this.isGrounded) {
            this.vy += 1200 * dt;
          }

          this.vy += 1150 * dt;
          if (this.vy > 1250) this.vy = 1250;

          this.x += this.vx * dt;
          this.y += this.vy * dt;

          if (this.isGrounded) {
            if (Math.abs(this.vx) > 20) {
              this.state = 'running';
              this.runCycle += Math.abs(this.vx) * dt * 0.04;
              this.idleTimer = 0;
              if (Math.random() < 0.1) createDust(this.x, this.y + this.h * 0.5);
            } else {
              this.state = 'idle';
              this.idleTimer += dt;
            }
          } else {
            this.state = 'jump';
            this.idleTimer = 0;
          }
        }

        // ================= COLLISION & WALL CRAWL DETECTION =================
        this.isGrounded = false;
        this.isWallClimbing = false;
        const feetY = this.y + this.h * 0.5;
        const leftX = this.x - this.w * 0.4;
        const rightX = this.x + this.w * 0.4;

        for (const b of buildings) {
          if (rightX > b.x && leftX < b.x + b.w) {
            if (feetY >= b.y && feetY <= b.y + 40 && this.vy >= 0 && !this.isSwinging) {
              this.y = b.y - this.h * 0.5;
              this.vy = 0;
              this.isGrounded = true;
              break;
            }
          }

          // SOLID SIDE-WALL COLLISION (blocks dodge AND normal movement through buildings)
          const topY = this.y - this.h * 0.5;
          const botY = this.y + this.h * 0.5;
          if (botY > b.y + 10 && topY < b.y + b.h) {
            // Hitting right face of building (moving right)
            if (this.vx >= 0 || this.isDodging) {
              if (rightX >= b.x && rightX <= b.x + 30 && leftX < b.x) {
                this.x = b.x - this.w * 0.4;
                this.vx = 0;
                if (this.isDodging) this.isDodging = false; // stop dodge at solid wall
              }
            }
            // Hitting left face of building (moving left)
            if (this.vx <= 0 || this.isDodging) {
              const bRight = b.x + b.w;
              if (leftX <= bRight && leftX >= bRight - 30 && rightX > bRight) {
                this.x = bRight + this.w * 0.4;
                this.vx = 0;
                if (this.isDodging) this.isDodging = false;
              }
            }
          }

          // Wall contact for wall-crawling (skip during dodge)
          if (!this.isDodging && this.y > b.y && this.y < b.y + b.h && !this.isGrounded && !this.isSwinging) {
            if (rightX >= b.x - 2 && rightX <= b.x + 14 && this.facing === 1) {
              this.isWallClimbing = true;
              this.wallSide = 1;
              this.x = b.x - this.w * 0.4;
              break;
            }
            if (leftX <= b.x + b.w + 2 && leftX >= b.x + b.w - 14 && this.facing === -1) {
              this.isWallClimbing = true;
              this.wallSide = -1;
              this.x = b.x + b.w + this.w * 0.4;
              break;
            }
          }
        }

        // Street Level
        if (feetY >= STREET_Y) {
          this.y = STREET_Y - this.h * 0.5;
          this.vy = 0;
          this.isGrounded = true;
          this.onStreet = true;
        } else {
          this.onStreet = false;
        }

        // SOLID OUTPOST BARRIER STOPPER
        if (activeBarrierX) {
          if (this.x >= activeBarrierX - 22) {
            this.x = activeBarrierX - 22;
            this.vx = 0;
          }
        }

        // Street Hazard Timer
        const streetBanner = document.getElementById('streetHazardBanner');
        if (this.onStreet) {
          this.streetTimer -= dt;
          streetBanner.style.display = 'flex';
          document.getElementById('streetTimerVal').innerText = Math.max(0, Math.ceil(this.streetTimer));
          if (this.streetTimer <= 0) {
            this.takeDamage(15);
            this.vy = -480;
            this.streetTimer = 2.5;
          }
        } else {
          this.streetTimer = Math.min(10.0, this.streetTimer + dt * 4);
          streetBanner.style.display = 'none';
        }

        // Street Traffic Collision
        if (this.onStreet) {
          for (const car of streetCars) {
            if (Math.abs(this.x - car.x) < 45 && Math.abs(this.y - car.y) < 25) {
              this.takeDamage(15);
              this.vy = -450;
              this.vx = car.dir * 400;
              sound.playHit();
              break;
            }
          }
        }

        // Update HUD
        const currentMeters = Math.max(0, Math.floor(this.x / 24));
        document.getElementById('dist-curr').innerText = currentMeters;
        const progressPct = Math.min(100, (currentMeters / 2400) * 100);
        document.getElementById('distance-fill').style.width = progressPct + '%';
        document.getElementById('dist-marker').style.left = progressPct + '%';

        document.getElementById('hp-bar').style.width = Math.max(0, (this.hp / this.maxHp) * 100) + '%';
        document.getElementById('web-bar').style.width = Math.max(0, (this.webFluid / this.maxWebFluid) * 100) + '%';
        document.getElementById('score-display').innerText = this.score;
      }

      startSwing(anchor) {
        if (!anchor) return false;

        // Disengage wall climb immediately so Spidey doesn't stick!
        if (this.isWallClimbing) {
          this.isWallClimbing = false;
          this.x += -this.wallSide * 25;
          this.vx = -this.wallSide * 160;
        }

        const dx = this.x - anchor.x;
        const dy = this.y - anchor.y;
        const dist = Math.hypot(dx, dy);

        this.isSwinging = true;
        this.swingAnchor = anchor;
        this.ropeLength = Math.max(140, dist);
        this.swingAngle = Math.atan2(dx, dy);

        // Convert existing linear velocity into initial angular velocity
        const tangVel = this.vx * Math.cos(this.swingAngle) - this.vy * Math.sin(this.swingAngle);
        this.angularVel = tangVel / this.ropeLength;

        // Minimum swing momentum impulse
        if (Math.abs(this.angularVel) < 1.2) {
          this.angularVel = this.facing * 2.5;
        }

        sound.playThwip();
        sound.playSwing();
        createWebSplash(anchor.x, anchor.y);
        return true;
      }

      // LAUNCH FORWARD VELOCITY WITH CATAPULT OPTION
      releaseSwing(isCatapult = false) {
        if (!this.isSwinging) return;
        this.isSwinging = false;
        this.swingAnchor = null;

        if (isCatapult) {
          // SPACE CATAPULT JUMP: Massive acrobatic release boost!
          this.vx = this.facing * Math.max(Math.abs(this.vx) * 1.35, 750) + this.facing * 180;
          this.vy = Math.min(this.vy, -380) - 220;
          sound.playJump();
          createFloatingText(this.x, this.y - 50, '🚀 CATAPULT LAUNCH!', '#ffbe0b');
        } else {
          // NATURAL MOMENTUM RELEASE
          this.vx = this.facing * Math.max(Math.abs(this.vx), 560);
          // If swinging upward in the arc, preserve the upward slingshot!
          if (this.vy < -50) {
            this.vy = Math.max(-580, this.vy * 1.15);
          } else {
            // Level out smoothly so Spidey doesn't nosedive into pavement
            this.vy = -160;
          }
          sound.playJump();
        }

        for (let i = 0; i < 14; i++) {
          createParticle(this.x, this.y, -this.vx * 0.2 + (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 120, '#ffffff', 2.8, 0.45);
        }
      }

      // RAYCAST WEB-ZIP
      triggerWebZip(targetX, targetY, activeBarrierX) {
        if (this.webFluid < 20) {
          createFloatingText(this.x, this.y - 40, 'JARING TIDAK CUKUP!', '#ff4d52');
          return;
        }

        const maxRange = 750;
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) return;

        const dirX = dx / dist;
        const dirY = dy / dist;

        let hitPoint = null;
        let enemyHit = null;

        // 1. Check if aiming near an enemy -> ZIP STRIKE!
        for (const enemy of enemies) {
          if (enemy.isDead || enemy.isWebbed) continue;
          if (Math.hypot(targetX - enemy.x, targetY - enemy.y) < 65) {
            enemyHit = enemy;
            hitPoint = { x: enemy.x, y: enemy.y };
            break;
          }
        }

        if (!hitPoint && currentBoss && currentBoss.active && currentBoss.hp > 0) {
          if (Math.hypot(targetX - currentBoss.x, targetY - currentBoss.y) < 90) {
            enemyHit = currentBoss;
            hitPoint = { x: currentBoss.x, y: currentBoss.y };
          }
        }

        // 2. Raycast against buildings, ignoring buildings Spidey is currently inside
        if (!hitPoint) {
          const stepSize = 8;
          const steps = Math.min(dist, maxRange) / stepSize;

          const currentBuildings = buildings.filter(b => (
            this.x >= b.x - 5 && this.x <= b.x + b.w + 5 &&
            this.y >= b.y - 5 && this.y <= b.y + b.h + 5
          ));

          for (let s = 4; s <= steps; s++) {
            const rx = this.x + dirX * (s * stepSize);
            const ry = this.y + dirY * (s * stepSize);

            // Check barrier intersection
            if (activeBarrierX && rx >= activeBarrierX - 25) {
              hitPoint = { x: activeBarrierX - 25, y: ry };
              break;
            }

            for (const b of buildings) {
              if (currentBuildings.includes(b)) continue;

              if (rx >= b.x && rx <= b.x + b.w && ry >= b.y && ry <= b.y + b.h) {
                hitPoint = { x: rx - dirX * 10, y: ry - dirY * 10 };
                break;
              }
            }
            if (hitPoint) break;
          }
        }

        // CLAMP TO ACTIVE BARRIER
        if (activeBarrierX && hitPoint && hitPoint.x >= activeBarrierX - 25) {
          hitPoint.x = activeBarrierX - 25;
          if (enemyHit && enemyHit.x >= activeBarrierX) enemyHit = null;
        }

        if (!hitPoint) {
          createFloatingText(this.x, this.y - 30, '❌ TIDAK ADA TEMBOK / MUSUH!', '#ff4d52');
          return;
        }

        // Disengage wall climb if zipping
        this.isWallClimbing = false;
        this.webFluid -= 22;
        this.isZipping = true;
        this.zipStartX = this.x;
        this.zipStartY = this.y;
        this.zipTargetX = hitPoint.x;
        this.zipTargetY = hitPoint.y;
        this.zipProgress = 0;
        this.zipEnemyTarget = enemyHit;

        if (this.zipTargetX > this.x) this.facing = 1;
        else this.facing = -1;

        sound.playThwip();
        createWebSplash(hitPoint.x, hitPoint.y);
      }

      triggerDodge() {
        if (this.isDodging) return;
        this.isDodging = true;
        this.dodgeTimer = 0.45;
        this.invulnerableTimer = 0.6;
        sound.playDodge();

        let perfect = false;
        for (const laser of enemyLasers) {
          if (laser.chargeProgress > 0.5 && Math.hypot(this.x - laser.startX, this.y - laser.startY) < 700) {
            perfect = true;
            laser.chargeProgress = 0;
            break;
          }
        }
        if (currentBoss && currentBoss.isAttacking && Math.hypot(this.x - currentBoss.x, this.y - currentBoss.y) < 250) {
          perfect = true;
        }

        if (perfect) {
          timeScale = 0.2;
          slowMoTimer = 0.4;
          this.webFluid = Math.min(this.maxWebFluid, this.webFluid + 35);
          this.addScore(250, this.x, this.y);
          createFloatingText(this.x, this.y - 50, '⚡ PERFECT DODGE! +250', '#ffbe0b');
        } else {
          createFloatingText(this.x, this.y - 30, 'DODGE!', '#38bdf8');
        }
      }

      shootWeb(targetX, targetY) {
        if (this.webFluid < 16) {
          createFloatingText(this.x, this.y - 40, 'JARING HABIS!', '#ff4d52');
          return;
        }
        this.webFluid -= 16;
        sound.playThwip();

        const originX = this.x + this.facing * 18;
        const originY = this.y - 6;
        const dx = targetX - originX;
        const dy = targetY - originY;
        const len = Math.hypot(dx, dy) || 1;

        webProjectiles.push({
          x: originX, y: originY,
          vx: (dx / len) * 980 + this.vx * 0.2,
          vy: (dy / len) * 980,
          r: 9, life: 1.5, trail: []
        });
      }

      addScore(points, x, y) {
        this.combo++;
        this.comboTimer = 3.2;
        const mult = Math.min(5, 1 + Math.floor(this.combo / 3));
        const total = points * mult;
        this.score += total;

        if (this.score > highScore) {
          highScore = this.score;
          try { localStorage.setItem('spiderman_high_score', highScore); } catch (e) {}
          document.getElementById('highscore-display').innerText = highScore;
        }

        const badge = document.getElementById('combo-badge');
        if (mult > 1) {
          badge.style.display = 'block';
          badge.innerText = 'COMBO x' + mult + ' 🔥';
        }
        createFloatingText(x || this.x, y || this.y - 40, '+' + total, mult > 1 ? '#ffbe0b' : '#fff');
      }

      takeDamage(amount) {
        if (this.invulnerableTimer > 0 || this.isDodging) return;
        this.hp -= amount;
        this.invulnerableTimer = 0.8;
        sound.playHit();
        createFloatingText(this.x, this.y - 30, '-' + amount + ' HP', '#ff2e3b');
        if (this.hp <= 0) { this.hp = 0; gameOver(); }
      }

      // BOTTOM-ALIGNED SPRITE RENDERING WITH IDLE ANIMATION & WALL CLING
      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 70) % 2 === 0) {
          ctx.globalAlpha = 0.5;
        }

        ctx.scale(this.facing, 1);

        let frame = SPIDEY_FRAMES.idle[0];
        let breathOffset = 0;

        if (this.isDodging) {
          frame = SPIDEY_FRAMES.dodge;
        } else if (this.isZipping) {
          frame = SPIDEY_FRAMES.zip;
        } else if (this.isWallClimbing) {
          if (this.vy !== 0) {
            // Active wall crawl: cycle through V1 climb frames
            const cIdx = Math.floor(this.climbCycle) % SPIDEY_FRAMES.climb.length;
            frame = SPIDEY_FRAMES.climb[cIdx];
          } else {
            // Stationary cling
            frame = SPIDEY_FRAMES.wallCling;
            breathOffset = Math.sin(Date.now() * 0.005) * 1.2;
          }
        } else if (this.isSwinging) {
          frame = SPIDEY_FRAMES.swing;
        } else if (!this.isGrounded) {
          frame = SPIDEY_FRAMES.jump;
        } else if (this.state === 'running') {
          const runIdx = Math.floor(this.runCycle) % SPIDEY_FRAMES.run.length;
          frame = SPIDEY_FRAMES.run[runIdx];
        } else {
          // IDLE ANIMATION: Breathing stance -> Vigilant Spidey Crouch
          if (this.idleTimer < 2.2) {
            frame = SPIDEY_FRAMES.idle[0]; // Standing ready stance
            breathOffset = Math.sin(this.idleTimer * 3.8) * 1.8;
          } else {
            frame = SPIDEY_FRAMES.idle[1]; // Iconic Spidey crouch
            breathOffset = Math.sin(this.idleTimer * 2.8) * 1.0;
          }
        }

        // All states use V1 spideyImg (climb included)
        const isClimbing = this.isWallClimbing;
        if (frame && spideyImg.complete && spideyImg.naturalWidth > 0) {
          const renderH = isClimbing ? 70 + breathOffset : 66 + breathOffset;
          const renderW = (frame.w / frame.h) * renderH;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(
            spideyImg,
            frame.x, frame.y, frame.w, frame.h,
            -renderW * 0.5,
            this.h * 0.5 - renderH,
            renderW,
            renderH
          );
        } else {
          ctx.fillStyle = '#e62429';
          ctx.fillRect(-17, -this.h * 0.5, 34, this.h);
        }

        ctx.restore();
      }
    }
    /* =========================================================================
       CHALLENGING BOSS CLASS: GREEN GOBLIN & GIANT DOCTOR OCTOPUS
       ========================================================================= */
    class Boss {
      constructor(x, y, type = 'goblin') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.maxHp = 2400;
        this.hp = 2400;
        this.active = false;
        this.facing = -1;
        this.state = 'idle';
        this.phase = 1; // 1 = normal, 2 = ENRAGE (below 40% HP)

        this.attackTimer = 1.5;
        this.isAttacking = false;
        this.walkCycle = 0;
        this.flyY = y - 100;
        this.enrageActive = false;
      }

      update(dt, spidey) {
        if (!this.active) return;
        if (this.hp <= 0) return;

        this.facing = spidey.x > this.x ? 1 : -1;
        this.attackTimer -= dt;

        // PHASE 2 ENRAGE at 40% HP
        const hpPct = this.hp / this.maxHp;
        if (hpPct <= 0.40 && this.phase === 1) {
          this.phase = 2;
          this.enrageActive = true;
          sound.playBossRoar();
          createFloatingText(this.x, this.y - 80, '💢 PHASE 2: ENRAGE!! 💢', '#ff0000');
          createFloatingText(this.x, this.y - 110, '⚠️ POLA SERANGAN BERUBAH!', '#ffbe0b');
        }

        const speedMult = this.phase === 2 ? 1.55 : 1.0;
        const attackCooldownMult = this.phase === 2 ? 0.52 : 1.0;

        if (this.type === 'goblin') {
          // GREEN GOBLIN: Fast & aggressive - sweeps harder in phase 2
          const flyRange = this.phase === 2 ? 90 : 55;
          const flySpeed = this.phase === 2 ? 0.005 : 0.0035;
          this.flyY = 340 + Math.sin(Date.now() * flySpeed) * flyRange;
          this.y += (this.flyY - this.y) * 0.14;
          // Strafe side to side faster in phase 2
          const strafeAmp = this.phase === 2 ? 220 : 150;
          this.x += Math.sin(Date.now() * 0.003) * strafeAmp * dt;

          if (this.attackTimer <= 0) {
            const baseCooldown = (1.1 + Math.random() * 0.8) * attackCooldownMult;
            this.attackTimer = baseCooldown;
            const roll = Math.random();
            if (this.phase === 2) {
              // Phase 2: more aggressive multi-burst
              if (roll < 0.4) {
                this.throwTriplePumpkinBombs(spidey);
              } else if (roll < 0.7) {
                this.swoopRam(spidey);
              } else if (roll < 0.85) {
                this.scatterBombBarrage(spidey);
              } else {
                this.throwTriplePumpkinBombs(spidey);
                setTimeout(() => { if (this.hp > 0) this.swoopRam(spidey); }, 350);
              }
            } else {
              if (roll < 0.6) this.throwTriplePumpkinBombs(spidey);
              else this.swoopRam(spidey);
            }
          }
        } else {
          // DOCTOR OCTOPUS: Giant pursuit, multi-attack in phase 2
          this.walkCycle += dt * (this.phase === 2 ? 9 : 6);
          const dist = Math.hypot(spidey.x - this.x, spidey.y - this.y);
          const chaseSpeed = this.phase === 2 ? 260 : 180;

          if (dist > 150) {
            this.x += this.facing * chaseSpeed * speedMult * dt;
          }

          if (this.attackTimer <= 0) {
            const baseCooldown = (1.0 + Math.random() * 0.9) * attackCooldownMult;
            this.attackTimer = baseCooldown;
            const roll = Math.random();
            if (this.phase === 2) {
              if (roll < 0.35) { this.dualTentacleSmash(spidey); }
              else if (roll < 0.6) { this.throwConcreteDebris(spidey); }
              else if (roll < 0.8) {
                // Quad-wave shockwave burst
                this.quadShockwave();
              } else {
                this.dualTentacleSmash(spidey);
                setTimeout(() => { if (this.hp > 0) this.throwConcreteDebris(spidey); }, 500);
              }
            } else {
              if (roll < 0.6) this.dualTentacleSmash(spidey);
              else this.throwConcreteDebris(spidey);
            }
          }
        }

        const displayPct = Math.max(0, Math.ceil((this.hp / this.maxHp) * 100));
        document.getElementById('bossHpFill').style.width = displayPct + '%';
        document.getElementById('bossHpPercent').innerText = displayPct + '%';
      }

      throwTriplePumpkinBombs(spidey) {
        sound.playThwip();
        const phase2 = this.phase === 2;
        createFloatingText(this.x, this.y - 50, phase2 ? '💣💣 TRIPLE DEATH BOMB! 💣💣' : '💣 HAHAHA! CATCH THIS!', '#ff7b00');
        const spreads = phase2 ? [-130, -65, 0, 65, 130] : [-80, 0, 80];
        spreads.forEach(spread => {
          const dx = spidey.x + spread - this.x;
          const dy = spidey.y - this.y;
          const len = Math.hypot(dx, dy) || 1;
          const spd = phase2 ? 520 : 440;
          bossProjectiles.push({
            x: this.x, y: this.y,
            vx: (dx / len) * spd, vy: (dy / len) * spd - 140,
            type: 'bomb', r: phase2 ? 13 : 11, life: 2.6
          });
        });
      }

      scatterBombBarrage(spidey) {
        // Phase 2 only: 8 bombs fired in a wide fan at the player
        sound.playBossRoar();
        createFloatingText(this.x, this.y - 50, '💥 BOMB BARRAGE! 💥', '#ef4444');
        for (let i = 0; i < 8; i++) {
          const ang = -Math.PI / 2 + (i / 7) * Math.PI * 0.8 - 0.4;
          bossProjectiles.push({
            x: this.x, y: this.y - 20,
            vx: Math.cos(ang) * 480 * this.facing,
            vy: Math.sin(ang) * 480 - 80,
            type: 'bomb', r: 10, life: 2.5
          });
        }
      }

      swoopRam(spidey) {
        sound.playBossRoar();
        const phase2 = this.phase === 2;
        createFloatingText(this.x, this.y - 50, phase2 ? '🔥 DEATH DIVE SWOOP! 🔥' : '⚡ GLIDER SWOOP!', '#ea580c');
        const ramDist = phase2 ? 500 : 350;
        const startX = this.x;
        this.x += this.facing * ramDist;
        // Check and damage all along the path
        if (Math.hypot(this.x - spidey.x, this.y - spidey.y) < 80) {
          spidey.takeDamage(phase2 ? 35 : 25);
          sound.playExplosion();
        }
        // Phase 2: leave a trail of bombs
        if (phase2) {
          for (let i = 0; i < 3; i++) {
            const bx = startX + (this.x - startX) * (i / 2);
            bossProjectiles.push({ x: bx, y: this.y, vx: 0, vy: 120, type: 'bomb', r: 9, life: 1.8 });
          }
        }
      }

      dualTentacleSmash(spidey) {
        sound.playBossRoar();
        this.isAttacking = true;
        const phase2 = this.phase === 2;
        createFloatingText(this.x, this.y - 60, phase2 ? '🐙🔥 QUAD SLAM FURY! 🔥🐙' : '🐙 DUAL TENTACLE SLAM!', '#38bdf8');

        const delay = phase2 ? 280 : 400;
        setTimeout(() => {
          this.isAttacking = false;
          sound.playExplosion();
          const spd = phase2 ? 680 : 540;
          const r = phase2 ? 22 : 18;
          const life = phase2 ? 1.8 : 1.4;
          bossProjectiles.push({ x: this.x - 30, y: 450, vx: -spd, vy: 0, type: 'shockwave', r, life });
          bossProjectiles.push({ x: this.x + 30, y: 450, vx: spd, vy: 0, type: 'shockwave', r, life });
          if (phase2) {
            // Extra diagonal shockwaves
            bossProjectiles.push({ x: this.x, y: 350, vx: -spd * 0.7, vy: -260, type: 'shockwave', r: 16, life: 1.6 });
            bossProjectiles.push({ x: this.x, y: 350, vx: spd * 0.7, vy: -260, type: 'shockwave', r: 16, life: 1.6 });
          }
        }, delay);
      }

      quadShockwave() {
        // Phase 2 Doc Ock only: 4-directional shockwave burst
        sound.playBossRoar();
        this.isAttacking = true;
        createFloatingText(this.x, this.y - 70, '🌊 4-WAY SHOCKWAVE!', '#a78bfa');
        setTimeout(() => {
          this.isAttacking = false;
          sound.playExplosion();
          const dirs = [[-700, 0], [700, 0], [0, -600], [0, 600],
                        [-500, -430], [500, -430], [-500, 430], [500, 430]];
          dirs.forEach(([vx, vy]) => {
            bossProjectiles.push({ x: this.x, y: this.y, vx, vy, type: 'shockwave', r: 20, life: 1.8 });
          });
        }, 350);
      }

      throwConcreteDebris(spidey) {
        sound.playHit();
        const phase2 = this.phase === 2;
        createFloatingText(this.x, this.y - 60, phase2 ? '🪨🪨 CONCRETE BARRAGE!' : '🪨 DIE, SPIDER!', '#94a3b8');
        const spd = phase2 ? 580 : 480;
        // Throw 2 debris in phase 2
        const count = phase2 ? 3 : 1;
        for (let i = 0; i < count; i++) {
          const dx = spidey.x + (i - 1) * 60 - this.x;
          const dy = spidey.y - this.y;
          const len = Math.hypot(dx, dy) || 1;
          bossProjectiles.push({
            x: this.x, y: this.y - 40,
            vx: (dx / len) * spd, vy: (dy / len) * spd - 160,
            type: 'debris', r: phase2 ? 16 : 14, life: 2.4
          });
        }
      }

      takeDamage(amount, spidey) {
        this.hp -= amount;
        sound.playHit();
        createFloatingText(this.x, this.y - 30, '-' + amount + ' HP', '#ff3b40');

        if (this.hp <= 0) {
          this.hp = 0;
          this.defeat(spidey);
        }
      }

      defeat(spidey) {
        sound.playExplosion();
        createFloatingText(this.x, this.y - 60, '🏆 BOSS DIKALAHKAN!', '#ffbe0b');
        spidey.addScore(5000, this.x, this.y);

        setTimeout(() => {
          gameVictory();
        }, 1200);
      }

      draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.facing, 1);

        if (this.type === 'goblin') {
          // GREEN GOBLIN: Clean animation cycle, zero double characters
          const f = GOBLIN_FRAMES.glider[Math.floor(Date.now() / 120) % GOBLIN_FRAMES.glider.length];
          const rH = 82, rW = (f.w / f.h) * rH;
          if (goblinImg.complete && goblinImg.naturalWidth > 0) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(goblinImg, f.x, f.y, f.w, f.h, -rW * 0.5, -rH * 0.5, rW, rH);
          } else {
            ctx.fillStyle = '#15803d'; ctx.fillRect(-25, -40, 50, 80);
          }
        } else {
          // GIANT DOCTOR OCTOPUS: Strictly bounded frames, zero lower-body bleed
          const f = this.isAttacking ? DOCOCK_FRAMES.strike : DOCOCK_FRAMES.walk[Math.floor(this.walkCycle) % DOCOCK_FRAMES.walk.length];
          const rH = 145;
          const rW = (f.w / f.h) * rH;
          if (docockImg.complete && docockImg.naturalWidth > 0) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(docockImg, f.x, f.y, f.w, f.h, -rW * 0.5, -rH * 0.85, rW, rH);
          } else {
            ctx.fillStyle = '#b45309'; ctx.fillRect(-45, -120, 90, 130);
          }
        }

        ctx.restore();
      }
    }

    /* =========================================================================
       ENEMIES WITH ANNOYING PURSUIT SYSTEM
       ========================================================================= */
    class Enemy {
      constructor(x, y, type = 'drone', outpostId = null) {
        this.x = x; this.y = y; this.type = type; this.outpostId = outpostId;
        this.w = 38; this.h = 24; this.hp = 1;
        this.isWebbed = false; this.isDead = false;
        this.originY = y; this.hoverAngle = Math.random() * Math.PI * 2;
        this.laserTimer = 1.2 + Math.random() * 1.5;
        this.isChargingLaser = false; this.laserChargeTime = 0;
        this.targetLaserX = x; this.targetLaserY = y;

        this.inPursuit = false;
      }

      update(dt, spidey) {
        if (this.isDead) return;
        if (this.isWebbed) {
          this.y += 480 * dt;
          if (this.y > STREET_Y + 100) this.isDead = true;
          return;
        }

        this.hoverAngle += dt * 2.5;
        const dist = Math.hypot(spidey.x - this.x, spidey.y - this.y);

        // PURSUIT MODE: Chases Spidey if player runs past!
        if (dist < 600 && spidey.x > this.x + 80) {
          this.inPursuit = true;
        }

        if (this.inPursuit && dist > 120 && dist < 850) {
          const pDir = spidey.x > this.x ? 1 : -1;
          this.x += pDir * 320 * dt;
          this.y += (spidey.y - 80 - this.y) * 0.05;
        } else {
          this.y = this.originY + Math.sin(this.hoverAngle) * 20;
        }

        // Taser / Laser attack
        if (dist < 650) {
          this.laserTimer -= dt;
          if (this.laserTimer <= 1.2 && !this.isChargingLaser) {
            this.isChargingLaser = true;
            this.laserChargeTime = 0;
            document.getElementById('spiderSenseFlash').style.display = 'block';
            setTimeout(() => { document.getElementById('spiderSenseFlash').style.display = 'none'; }, 600);
          }
          if (this.isChargingLaser) {
            this.laserChargeTime += dt;
            this.targetLaserX += (spidey.x - this.targetLaserX) * 0.14;
            this.targetLaserY += (spidey.y - this.targetLaserY) * 0.14;

            if (this.laserChargeTime >= 1.0) {
              this.fireLaser(spidey);
              this.isChargingLaser = false;
              this.laserTimer = 2.4 + Math.random() * 1.2;
            }
          }
        }
      }

      fireLaser(spidey) {
        const dx = spidey.x - this.x, dy = spidey.y - this.y, len = Math.hypot(dx, dy) || 1;
        enemyLasers.push({
          startX: this.x, startY: this.y,
          endX: this.x + (dx / len) * 750, endY: this.y + (dy / len) * 750,
          life: 0.25, color: (this.type === 'chaser') ? '#00b4d8' : '#ef4444'
        });

        if (Math.hypot(spidey.x - this.targetLaserX, spidey.y - this.targetLaserY) < 45) {
          spidey.takeDamage(20);
          if (this.type === 'chaser') {
            // ELECTRIC TASER SLOWS SPIDEY!
            spidey.stunTimer = 2.5;
            createFloatingText(spidey.x, spidey.y - 45, '⚡ SLOWED BY TASER!', '#00b4d8');
          }
        }
      }

      hitByWeb(spidey) {
        this.hp--;
        sound.playHit();
        createWebSplash(this.x, this.y);
        if (this.hp <= 0) {
          this.isWebbed = true;
          this.inPursuit = false;
          spidey.enemiesDefeated++;
          spidey.addScore(150, this.x, this.y);

          // Clear outpost check immediately
          updateOutposts(spidey);
        }
      }

      draw(ctx) {
        if (this.isDead) return;
        ctx.save();
        ctx.translate(this.x, this.y);

        if (mouse.targetEnemy === this) {
          ctx.strokeStyle = '#ff2e3b'; ctx.lineWidth = 2.5; ctx.shadowColor = '#ff2e3b'; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(0, 0, this.w + 14, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#ffbe0b'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('ZIP [C] / TEMBAK [E]', 0, -this.h - 18);
        }

        if (this.inPursuit) {
          ctx.fillStyle = '#ff3b40'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('🚨 PURSUIT', 0, -this.h - 32);
        } else if (this.outpostId) {
          ctx.fillStyle = '#ef4444'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('🛡️ TARGET MARKAS', 0, -this.h - 32);
        }

        if (this.isWebbed) {
          ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.ellipse(0, 0, this.w * 0.6, this.h * 0.7, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore(); return;
        }

        // ─── Drone body ───
        const isChaser = this.type === 'chaser';
        const baseColor = isChaser ? '#0ea5e9' : '#334155';
        const accentColor = isChaser ? '#38bdf8' : '#94a3b8';
        const t = Date.now() * 0.003;

        // Pulsing glow ring when charging
        if (this.isChargingLaser) {
          const glowR = 22 + Math.sin(t * 6) * 4;
          ctx.beginPath(); ctx.arc(0, 0, glowR, 0, Math.PI * 2);
          ctx.strokeStyle = isChaser ? 'rgba(56,189,248,0.6)' : 'rgba(239,68,68,0.7)';
          ctx.lineWidth = 3; ctx.stroke();
        }

        // Main fuselage (elongated hexagon-ish shape)
        ctx.beginPath();
        ctx.moveTo(-20, -5); ctx.lineTo(-14, -9); ctx.lineTo(14, -9);
        ctx.lineTo(20, -5); ctx.lineTo(20, 5); ctx.lineTo(14, 9);
        ctx.lineTo(-14, 9); ctx.lineTo(-20, 5); ctx.closePath();
        ctx.fillStyle = baseColor;
        ctx.shadowColor = isChaser ? '#0ea5e9' : '#475569';
        ctx.shadowBlur = 6;
        ctx.fill();

        // Rotors (4 small spinning circles)
        ctx.shadowBlur = 0;
        const rotorPositions = [[-13, -12], [13, -12], [-13, 12], [13, 12]];
        for (const [rx, ry] of rotorPositions) {
          // Rotor arm
          ctx.strokeStyle = accentColor; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(rx, ry); ctx.stroke();
          // Rotor disc (spinning effect)
          const spinAngle = t * (isChaser ? 8 : 5) + rx;
          ctx.save(); ctx.translate(rx, ry); ctx.rotate(spinAngle);
          ctx.strokeStyle = accentColor; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.ellipse(0, 0, 7, 2.5, 0, 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        }

        // Center eye/sensor
        const eyeColor = this.isChargingLaser
          ? (isChaser ? '#00ffff' : '#ff0000')
          : (isChaser ? '#38bdf8' : '#ff3b40');
        ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = eyeColor;
        ctx.shadowColor = eyeColor; ctx.shadowBlur = 12;
        ctx.fill();

        // Pursuit indicator light strip
        if (this.inPursuit) {
          ctx.beginPath(); ctx.rect(-18, -3, 36, 6);
          ctx.fillStyle = 'rgba(255,59,64,0.55)';
          ctx.shadowBlur = 0; ctx.fill();
        }

        ctx.restore();

        if (this.isChargingLaser && !this.isWebbed) {
          ctx.save();
          ctx.strokeStyle = (this.type === 'chaser') ? 'rgba(0, 180, 216, 0.8)' : 'rgba(239, 68, 68, 0.8)';
          ctx.lineWidth = 2.5; ctx.setLineDash([8, 4]);
          ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.targetLaserX, this.targetLaserY); ctx.stroke();
          ctx.restore();
        }
      }
    }

    /* =========================================================================
       ROBUST OUTPOST & BARRIER SYSTEM
       ========================================================================= */
    function updateOutposts(spidey) {
      let activeBarrierX = null;
      for (const op of outposts) {
        if (!op.cleared) {
          // Find all living enemies belonging to this outpost OR within outpost sector
          // Living = not dead AND not webbed (webbed enemies fall off screen and die)
          const living = enemies.filter(e =>
            !e.isDead && !e.isWebbed &&
            (e.outpostId === op.id ||
             (e.x >= op.startX - 300 && e.x <= op.barrierX + 350))
          );
          op.enemiesRemaining = living.length;

          // Inside lockdown zone?
          if (spidey.x >= op.startX && spidey.x <= op.barrierX + 100) {
            op.active = true;
            activeBarrierX = op.barrierX;
            const bEl = document.getElementById('outpostLockdownBanner');
            if (bEl) bEl.style.display = 'flex';
            const rEl = document.getElementById('outpostRemaining');
            if (rEl) rEl.innerText = op.enemiesRemaining;
          }

          // If all outpost enemies are eliminated, IMMEDIATELY UNLOCK AND OPEN BARRIER!
          if (op.enemiesRemaining <= 0 && (op.active || spidey.x >= op.startX - 200)) {
            op.cleared = true;
            op.active = false;
            sound.playExplosion();
            const bEl = document.getElementById('outpostLockdownBanner');
            if (bEl) bEl.style.display = 'none';
            createFloatingText(op.barrierX, spidey.y - 80, '🏆 MARKAS DIBERSIHKAN! BARRIER TERBUKA! +1000', '#ffbe0b');
            spidey.addScore(1000, op.barrierX, spidey.y);
            collectibles.push({ x: op.barrierX + 50, y: spidey.y - 40, type: 'pizza', collected: false });
          }
        }
      }
      return activeBarrierX;
    }

    class StreetCar {
      constructor(x, dir = 1) {
        this.x = x; this.y = STREET_Y - 26; this.w = 72; this.h = 24; this.dir = dir;
        this.speed = (360 + Math.random() * 200) * dir;
        this.type = Math.random() < 0.35 ? 'police' : 'taxi';
      }
      update(dt) {
        this.x += this.speed * dt;
        if (this.dir > 0 && this.x > camera.x + canvas.width + 500) this.x = camera.x - 500;
        else if (this.dir < 0 && this.x < camera.x - 500) this.x = camera.x + canvas.width + 500;
      }
      draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y); ctx.scale(this.dir, 1);
        ctx.fillStyle = this.type === 'taxi' ? '#facc15' : '#0f172a';
        ctx.beginPath(); ctx.roundRect(-this.w * 0.5, -this.h * 0.5, this.w, this.h, 6); ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(-this.w * 0.3, this.h * 0.4, 7, 0, Math.PI * 2); ctx.arc(this.w * 0.3, this.h * 0.4, 7, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    function createParticle(x, y, vx, vy, color, size, life) {
      particles.push({ x, y, vx, vy, color, size, life, maxLife: life });
    }
    function createDust(x, y) {
      for (let i = 0; i < 5; i++) {
        createParticle(x + (Math.random() - 0.5) * 20, y, (Math.random() - 0.5) * 50, -Math.random() * 30, 'rgba(255, 255, 255, 0.4)', 3, 0.35);
      }
    }
    function createWebSplash(x, y) {
      for (let i = 0; i < 14; i++) {
        const a = Math.random() * Math.PI * 2, s = Math.random() * 140 + 40;
        createParticle(x, y, Math.cos(a) * s, Math.sin(a) * s, '#ffffff', 2.5, 0.4);
      }
    }
    function createFloatingText(x, y, text, color = '#ffffff') {
      floatingTexts.push({ x, y, text, color, life: 1.0, maxLife: 1.0 });
    }

    /* =========================================================================
       INPUT LISTENERS (WEB SWING ANYWHERE ON DESKTOP!)
       ========================================================================= */
    window.addEventListener('keydown', (e) => {
      sound.init();
      const code = e.code;
      if (code === 'KeyA' || code === 'ArrowLeft') keys.left = true;
      if (code === 'KeyD' || code === 'ArrowRight') keys.right = true;
      // W / Up: STRICTLY CLIMB UP ON WALL (DOES NOT JUMP!)
      if (code === 'KeyW' || code === 'ArrowUp') keys.up = true;
      if (code === 'KeyS' || code === 'ArrowDown') keys.down = true;

      // Space: DEDICATED JUMP / WALL JUMP / CATAPULT RELEASE
      if (code === 'Space') {
        keys.jump = true;
        if (spidey.isSwinging) spidey.releaseSwing(true);
        e.preventDefault();
      }
      // T: TOGGLE WEB TARGETING MODE
      if (code === 'KeyT') {
        toggleWebMode();
        e.preventDefault();
      }
      if (code === 'KeyC') {
        const activeBarrierX = updateOutposts(spidey);
        spidey.triggerWebZip(mouse.worldX, mouse.worldY, activeBarrierX);
        e.preventDefault();
      }
      if (code === 'KeyE') {
        spidey.shootWeb(mouse.worldX, mouse.worldY);
        e.preventDefault();
      }
      if (code === 'ControlLeft' || code === 'ControlRight') {
        spidey.triggerDodge();
        e.preventDefault();
      }
      if (code === 'Escape' || code === 'KeyP') togglePause();
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;
      if (code === 'KeyA' || code === 'ArrowLeft') keys.left = false;
      if (code === 'KeyD' || code === 'ArrowRight') keys.right = false;
      if (code === 'KeyW' || code === 'ArrowUp') keys.up = false;
      if (code === 'KeyS' || code === 'ArrowDown') keys.down = false;
      if (code === 'Space') keys.jump = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // MOUSE LEFT CLICK: WEB SWING BASED ON SELECTED MODE
    canvas.addEventListener('mousedown', (e) => {
      sound.init();
      if (e.button !== 0 || !gameRunning || gamePaused) return;
      mouse.isDown = true;

      let anchor = null;
      if (swingMode === 'anchor') {
        // MODE 1: LINGKARAN ANCHOR ONLY
        anchor = mouse.selectedAnchor;
        if (!anchor) {
          createFloatingText(mouse.worldX, mouse.worldY - 20, '❌ DI LUAR JANGKAUAN ANCHOR!', '#ff4d52');
          return;
        }
      } else {
        // MODE 2: BEBAS CURSOR ANYWHERE!
        const anchorY = Math.min(mouse.worldY, spidey.y - 320);
        anchor = { x: mouse.worldX, y: anchorY, r: 24, isDynamic: true };
      }

      spidey.startSwing(anchor);
    });

    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        mouse.isDown = false;
        if (spidey.isSwinging) spidey.releaseSwing(keys.jump);
      }
    });

    const webModeBtn = document.getElementById('btnWebMode');
    if (webModeBtn) {
      webModeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWebMode();
      });
    }

    const bindTouch = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); sound.init(); onDown(); }, { passive: false });
      el.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); }, { passive: false });
    };

    bindTouch('btn-left', () => { keys.left = true; }, () => { keys.left = false; });
    bindTouch('btn-right', () => { keys.right = true; }, () => { keys.right = false; });
    bindTouch('btn-down', () => { keys.down = true; }, () => { keys.down = false; });
    bindTouch('btn-jump', () => { keys.jump = true; }, () => { keys.jump = false; });

    bindTouch('btn-swing', () => {
      mouse.isDown = true;
      let anchor = null;
      if (swingMode === 'anchor') {
        anchor = mouse.selectedAnchor;
        if (!anchor) {
          createFloatingText(spidey.x, spidey.y - 40, '❌ CARI LINGKARAN ANCHOR!', '#ff4d52');
          return;
        }
      } else {
        anchor = { x: spidey.x + spidey.facing * 240, y: spidey.y - 380, r: 24, isDynamic: true };
      }
      spidey.startSwing(anchor);
    }, () => {
      mouse.isDown = false;
      if (spidey.isSwinging) spidey.releaseSwing(keys.jump);
    });

    bindTouch('btn-zip', () => {
      let activeBarrierX = null;
      for (const op of outposts) {
        if (!op.cleared && spidey.x >= op.startX && spidey.x <= op.barrierX + 100) {
          activeBarrierX = op.barrierX; break;
        }
      }
      spidey.triggerWebZip(spidey.x + spidey.facing * 400, spidey.y - 120, activeBarrierX);
    }, () => {});
    bindTouch('btn-dodge', () => { spidey.triggerDodge(); }, () => {});
    bindTouch('btn-shoot', () => {
      let tx = spidey.x + spidey.facing * 400, ty = spidey.y - 40;
      if (mouse.targetEnemy) { tx = mouse.targetEnemy.x; ty = mouse.targetEnemy.y; }
      else if (currentBoss && currentBoss.active) { tx = currentBoss.x; ty = currentBoss.y; }
      spidey.shootWeb(tx, ty);
    }, () => {});

    document.getElementById('audioBtn').addEventListener('click', () => {
      sound.init();
      sound.enabled = !sound.enabled;
      document.getElementById('audioBtn').innerText = sound.enabled ? '🔊' : '🔇';
    });
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('resumeBtn').addEventListener('click', togglePause);

    function togglePause() {
      if (!gameRunning) return;
      gamePaused = !gamePaused;
      document.getElementById('pauseModal').classList.toggle('active', gamePaused);
      if (!gamePaused) lastTime = performance.now();
    }

    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', startGame);
    document.getElementById('vicRestartBtn').addEventListener('click', startGame);
    document.getElementById('pauseRestartBtn').addEventListener('click', startGame);

    /* =========================================================================
       MAIN LOOP
       ========================================================================= */
    const spidey = new SpiderMan();
    let lastTime = performance.now();

    function startGame() {
      sound.init();
      document.getElementById('startModal').classList.remove('active');
      document.getElementById('gameOverModal').classList.remove('active');
      document.getElementById('victoryModal').classList.remove('active');
      document.getElementById('pauseModal').classList.remove('active');
      document.getElementById('bossBarContainer').style.display = 'none';

      generateWorld();
      spidey.reset();
      camera.x = 0;
      camera.y = 300;

      gameRunning = true;
      gamePaused = false;
      lastTime = performance.now();

      if (animationId) cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(gameLoop);
    }

    function gameOver() {
      gameRunning = false;
      sound.playHit();
      const dist = Math.floor(spidey.x / 24);
      document.getElementById('go-dist').innerText = dist + ' m';
      document.getElementById('go-score').innerText = spidey.score;
      document.getElementById('go-enemies').innerText = spidey.enemiesDefeated;
      document.getElementById('go-high').innerText = highScore;

      setTimeout(() => {
        document.getElementById('gameOverModal').classList.add('active');
      }, 500);
    }

    function gameVictory() {
      gameRunning = false;
      sound.playVictory();
      const bName = selectedBossType === 'goblin' ? 'GREEN GOBLIN' : 'DOCTOR OCTOPUS';
      document.getElementById('vic-boss').innerText = bName;
      document.getElementById('vic-score').innerText = spidey.score;
      document.getElementById('vic-enemies').innerText = spidey.enemiesDefeated;
      document.getElementById('vic-high').innerText = highScore;

      setTimeout(() => {
        document.getElementById('victoryModal').classList.add('active');
      }, 600);
    }

    function gameLoop(now) {
      if (!gameRunning) return;

      let dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (slowMoTimer > 0) {
        slowMoTimer -= dt;
        if (slowMoTimer <= 0) timeScale = 1.0;
      }
      dt *= timeScale;

      if (!gamePaused) update(dt);
      render();

      animationId = requestAnimationFrame(gameLoop);
    }

    function update(dt) {
      mouse.worldX = mouse.x + camera.x;
      mouse.worldY = mouse.y + camera.y;

      // Check Boss Arena trigger
      if (spidey.x >= BOSS_ARENA_START && currentBoss && !currentBoss.active) {
        currentBoss.active = true;
        sound.playBossRoar();
        const bName = selectedBossType === 'goblin' ? 'GREEN GOBLIN' : 'DOCTOR OCTOPUS';
        document.getElementById('bossNameDisplay').innerText = '⚠️ BOSS: ' + bName;
        document.getElementById('bossBarContainer').style.display = 'flex';
      }

      // Outpost Barrier update
      const activeBarrierX = updateOutposts(spidey);

      spidey.update(dt, activeBarrierX);
      camera.update(spidey, activeBarrierX);

      // Anti-Camping Drone Update
      antiCampingDrone.update(dt, spidey);

      // Select anchor closest to mouse cursor (desktop wide reach!)
      let bestAnchor = null;
      let minCursorDist = 620;
      for (const a of swingAnchors) {
        const dToCursor = Math.hypot(mouse.worldX - a.x, mouse.worldY - a.y);
        const dToSpidey = Math.hypot(spidey.x - a.x, spidey.y - a.y);
        // Allow anchors up to 600px BELOW spidey (so you can swing from below buildings too)
        if (dToSpidey < 900 && dToCursor < minCursorDist && a.y < spidey.y + 600) {
          minCursorDist = dToCursor;
          bestAnchor = a;
        }
      }
      mouse.selectedAnchor = bestAnchor;

      // Target enemy detection
      let targetEnemy = null;
      let minEnemyDist = 140;
      for (const enemy of enemies) {
        if (enemy.isDead || enemy.isWebbed) continue;
        const d = Math.hypot(mouse.worldX - enemy.x, mouse.worldY - enemy.y);
        if (d < minEnemyDist) {
          minEnemyDist = d;
          targetEnemy = enemy;
        }
      }
      if (!targetEnemy && currentBoss && currentBoss.active && currentBoss.hp > 0) {
        if (Math.hypot(mouse.worldX - currentBoss.x, mouse.worldY - currentBoss.y) < 140) {
          targetEnemy = currentBoss;
        }
      }
      mouse.targetEnemy = targetEnemy;

      for (const enemy of enemies) enemy.update(dt, spidey);
      if (currentBoss) currentBoss.update(dt, spidey);

      // Web Projectiles
      for (let i = webProjectiles.length - 1; i >= 0; i--) {
        const p = webProjectiles[i];
        p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        for (const enemy of enemies) {
          if (enemy.isDead || enemy.isWebbed) continue;
          if (Math.hypot(p.x - enemy.x, p.y - enemy.y) < p.r + enemy.w * 0.5) {
            enemy.hitByWeb(spidey);
            p.life = 0; break;
          }
        }

        if (p.life > 0 && currentBoss && currentBoss.active && currentBoss.hp > 0) {
          const bossHitDist = p.r + (currentBoss.type === 'goblin' ? 55 : 75);
          if (Math.hypot(p.x - currentBoss.x, p.y - currentBoss.y) < bossHitDist) {
            // Web hit boss: damage + web-slow effect
            const webDmg = currentBoss.phase === 2 ? 30 : 55;
            currentBoss.takeDamage(webDmg, spidey);
            // Briefly slow boss attacks
            if (currentBoss.attackTimer < 0.6) currentBoss.attackTimer = 0.6;
            createFloatingText(p.x, p.y - 20, '🕸️ WEB HIT! -' + webDmg, '#94a3b8');
            // Visual web splash on boss
            createWebSplash(currentBoss.x, currentBoss.y);
            p.life = 0;
          }
        }

        if (p.life <= 0) webProjectiles.splice(i, 1);
      }

      // Boss Projectiles
      for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const bp = bossProjectiles[i];
        bp.x += bp.vx * dt;
        bp.y += bp.vy * dt;
        if (bp.type === 'bomb' || bp.type === 'debris') bp.vy += 450 * dt;
        bp.life -= dt;

        if (Math.hypot(bp.x - spidey.x, bp.y - spidey.y) < bp.r + spidey.w * 0.5) {
          spidey.takeDamage(20);
          sound.playExplosion();
          bp.life = 0;
        }

        if (bp.life <= 0) bossProjectiles.splice(i, 1);
      }

      for (let i = enemyLasers.length - 1; i >= 0; i--) {
        const l = enemyLasers[i];
        l.life -= dt;
        if (l.life <= 0) enemyLasers.splice(i, 1);
      }

      for (const car of streetCars) car.update(dt);

      for (const item of collectibles) {
        if (item.collected) continue;
        if (Math.hypot(spidey.x - item.x, spidey.y - item.y) < 38) {
          item.collected = true;
          if (item.type === 'coin') {
            spidey.addScore(100, item.x, item.y);
            sound.playJump();
          } else {
            spidey.hp = Math.min(spidey.maxHp, spidey.hp + 30);
            spidey.addScore(50, item.x, item.y);
            createFloatingText(item.x, item.y - 20, '+30 HP PIZZA! 🍕', '#ffbe0b');
          }
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.life -= dt;
        if (pt.life <= 0) particles.splice(i, 1);
      }

      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y -= 40 * dt; ft.life -= dt;
        if (ft.life <= 0) floatingTexts.splice(i, 1);
      }
    }

    /* =========================================================================
       CANVAS RENDERING (GORGEOUS TENSILE WEB LINES & ATMOSPHERE)
       ========================================================================= */
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const distRatio = Math.min(1, spidey.x / LEVEL_WIDTH);
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (distRatio < 0.35) {
        sky.addColorStop(0, '#0c162d'); sky.addColorStop(0.5, '#3b1d60'); sky.addColorStop(1, '#ff6b4a');
      } else if (distRatio < 0.7) {
        sky.addColorStop(0, '#060a14'); sky.addColorStop(0.5, '#1e1b4b'); sky.addColorStop(1, '#581c87');
      } else {
        sky.addColorStop(0, '#020617'); sky.addColorStop(0.6, '#0f172a'); sky.addColorStop(1, '#1e293b');
      }
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      renderParallax(0.08, '#0b1220', 360, 160);
      renderParallax(0.2, '#11192e', 460, 220);

      ctx.save();
      ctx.translate(-camera.x, -camera.y);

      // Render Buildings
      for (const b of buildings) {
        if (b.x + b.w < camera.x - 100 || b.x > camera.x + canvas.width + 100) continue;

        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);

        ctx.fillStyle = b.isArena ? '#ffd700' : '#ff3344';
        ctx.fillRect(b.x, b.y, b.w, 6);

        if (b.isArena) {
          ctx.save();
          ctx.fillStyle = '#ffbe0b'; ctx.font = 'bold 28px sans-serif';
          ctx.shadowColor = '#ffbe0b'; ctx.shadowBlur = 15;
          ctx.fillText('👑 OSCORP SUMMIT - FINAL BOSS SHOWDOWN 👑', b.x + 200, b.y - 40);
          ctx.restore();
        }

        ctx.fillStyle = 'rgba(255, 240, 180, 0.08)';
        const winW = 16, winH = 22, padX = 24, padY = 32;
        const cols = Math.floor((b.w - 30) / (winW + padX));
        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < 18; row++) {
            if ((col * 7 + row * 11 + Math.floor(b.x)) % 4 !== 0) {
              ctx.fillRect(b.x + 20 + col * (winW + padX), b.y + 20 + row * (winH + padY), winW, winH);
            }
          }
        }
      }

      // Street Floor
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(camera.x - 200, STREET_Y, canvas.width + 400, 300);

      ctx.fillStyle = '#facc15';
      const dashW = 40, dashGap = 30;
      const startDash = Math.floor(camera.x / (dashW + dashGap)) * (dashW + dashGap);
      for (let dx = startDash - 200; dx < camera.x + canvas.width + 200; dx += (dashW + dashGap)) {
        ctx.fillRect(dx, STREET_Y - 4, dashW, 4);
      }

      for (const car of streetCars) {
        if (car.x > camera.x - 100 && car.x < camera.x + canvas.width + 100) car.draw(ctx);
      }

      // Solid Outpost Barriers
      for (const op of outposts) {
        if (!op.cleared) {
          ctx.save();
          const bAlpha = 0.7 + Math.sin(Date.now() * 0.008) * 0.25;
          ctx.fillStyle = 'rgba(239, 68, 68, ' + bAlpha + ')';
          ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 20;
          ctx.fillRect(op.barrierX - 8, -500, 16, STREET_Y + 500);

          ctx.strokeStyle = '#ffbe0b'; ctx.lineWidth = 3;
          ctx.beginPath();
          for (let y = -200; y < STREET_Y; y += 40) {
            ctx.moveTo(op.barrierX - 8, y); ctx.lineTo(op.barrierX + 8, y + 20);
          }
          ctx.stroke();

          ctx.fillStyle = '#ffbe0b'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('⚡ BARRIER SOLID TERKUNCI ⚡', op.barrierX, 260);
          ctx.restore();
        }
      }

      // High Swing Anchors
      for (const a of swingAnchors) {
        if (a.x < camera.x - 100 || a.x > camera.x + canvas.width + 100) continue;

        // In anchor mode, highlight selected anchor; in cursor mode, dim anchors
        const isSelected = (swingMode === 'anchor' && mouse.selectedAnchor === a);
        if (swingMode === 'cursor') ctx.globalAlpha = 0.35;
        a.pulse += 0.05;

        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.strokeStyle = isSelected ? '#ffbe0b' : '#38bdf8';
        ctx.shadowColor = isSelected ? '#ffbe0b' : '#38bdf8';
        ctx.shadowBlur = isSelected ? 18 : 8;
        ctx.lineWidth = isSelected ? 3.5 : 2;

        ctx.beginPath();
        ctx.arc(0, 0, a.r * (isSelected ? 1.15 : 1.0), 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isSelected ? 'rgba(255, 190, 11, 0.25)' : 'rgba(56, 189, 248, 0.15)';
        ctx.beginPath(); ctx.arc(0, 0, a.r, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-a.r * 0.6, 0); ctx.lineTo(a.r * 0.6, 0);
        ctx.moveTo(0, -a.r * 0.6); ctx.lineTo(0, a.r * 0.6); ctx.stroke();

        ctx.restore();

        if (isSelected && !spidey.isSwinging) {
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 190, 11, 0.65)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(spidey.x, spidey.y - 10); ctx.lineTo(a.x, a.y); ctx.stroke();
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1.0;

      // Render Anti-Camping High-Altitude Drone
      antiCampingDrone.draw(ctx, spidey);

      // Render Spider-Man & Web with realistic tension curve & wrist attachment
      if (spidey.isSwinging && spidey.swingAnchor) {
        ctx.save();
        const wristX = spidey.x + spidey.facing * 18;
        const wristY = spidey.y - 12;

        // Subtle tension sag/curve calculation
        const midX = (spidey.swingAnchor.x + wristX) * 0.5;
        const midY = (spidey.swingAnchor.y + wristY) * 0.5 + Math.sin(Date.now() * 0.02) * 2;

        // Glowing outer web strand
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(spidey.swingAnchor.x, spidey.swingAnchor.y);
        ctx.quadraticCurveTo(midX, midY, wristX, wristY);
        ctx.stroke();

        // Bright white silk core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(spidey.swingAnchor.x, spidey.swingAnchor.y);
        ctx.quadraticCurveTo(midX, midY, wristX, wristY);
        ctx.stroke();

        // Web silk sparkles
        if (Math.random() < 0.35) {
          createParticle(wristX, wristY, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, '#ffffff', 2.0, 0.25);
        }

        ctx.restore();
      }

      // Web-Zip Line
      if (spidey.isZipping) {
        ctx.save();
        ctx.strokeStyle = '#90e0ef'; ctx.lineWidth = 4; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.moveTo(spidey.x, spidey.y - 10); ctx.lineTo(spidey.zipTargetX, spidey.zipTargetY); ctx.stroke();
        ctx.restore();
      }

      for (const item of collectibles) {
        if (item.collected) continue;
        ctx.save();
        ctx.translate(item.x, item.y + Math.sin(Date.now() * 0.006) * 5);
        if (item.type === 'coin') {
          ctx.fillStyle = '#ffbe0b'; ctx.shadowColor = '#ffbe0b'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#000'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🕷️', 0, 4);
        } else {
          ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🍕', 0, 4);
        }
        ctx.restore();
      }

      for (const p of webProjectiles) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; ctx.lineWidth = 3;
        ctx.beginPath();
        p.trail.forEach((pt, i) => { if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
        ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      for (const bp of bossProjectiles) {
        ctx.save();
        if (bp.type === 'bomb') {
          ctx.fillStyle = '#ea580c'; ctx.shadowColor = '#f97316'; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(bp.x, bp.y, bp.r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#111'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('💣', bp.x, bp.y + 4);
        } else if (bp.type === 'shockwave') {
          ctx.fillStyle = '#38bdf8'; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 16;
          ctx.beginPath(); ctx.arc(bp.x, bp.y, bp.r, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = '#94a3b8'; ctx.fillRect(bp.x - 12, bp.y - 12, 24, 24);
        }
        ctx.restore();
      }

      for (const l of enemyLasers) {
        ctx.save();
        ctx.strokeStyle = l.color; ctx.lineWidth = 5; ctx.shadowColor = l.color; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.moveTo(l.startX, l.startY); ctx.lineTo(l.endX, l.endY); ctx.stroke();
        ctx.restore();
      }

      for (const enemy of enemies) {
        if (enemy.x > camera.x - 100 && enemy.x < camera.x + canvas.width + 100) enemy.draw(ctx);
      }

      if (currentBoss) currentBoss.draw(ctx);
      spidey.draw(ctx);

      for (const pt of particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      for (const ft of floatingTexts) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
        ctx.font = 'bold 16px sans-serif'; ctx.fillStyle = ft.color;
        ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore(); // End World Translation

      if (gameRunning && !gamePaused) {
        ctx.save();
        ctx.strokeStyle = mouse.targetEnemy ? '#ff2e3b' : '#38bdf8';
        ctx.lineWidth = 2; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouse.x - 14, mouse.y); ctx.lineTo(mouse.x - 4, mouse.y);
        ctx.moveTo(mouse.x + 4, mouse.y); ctx.lineTo(mouse.x + 14, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 14); ctx.lineTo(mouse.x, mouse.y - 4);
        ctx.moveTo(mouse.x, mouse.y + 4); ctx.lineTo(mouse.x, mouse.y + 14);
        ctx.stroke();
        ctx.restore();
      }
    }

    function renderParallax(factor, color, baseH, stepW) {
      const offsetX = (camera.x * factor) % stepW;
      const count = Math.ceil(canvas.width / stepW) + 2;
      ctx.fillStyle = color;
      for (let i = -1; i < count; i++) {
        const x = i * stepW - offsetX;
        const seed = Math.sin((Math.floor((camera.x * factor) / stepW) + i) * 12.98);
        const h = baseH + seed * 90;
        ctx.fillRect(x, canvas.height - h, stepW - 4, h + 200);
      }
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent);
fs.writeFileSync(path.join(__dirname, '..', 'index.html'), htmlContent);
console.log('Successfully written index.html to both locations! Size:', htmlContent.length);
