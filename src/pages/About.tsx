import React, { useEffect, useRef, useState } from 'react';

const monitorStyles = `
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

:root {
  --terminal-green: #35ffb5;
  --terminal-bg: #0c0c0c;
  --case-color: #1f1f1f;
  --highlight-key: #66e5ff;
  --highlight-text: #c5f3ff;
  --glow-shadow: 0 0 10px rgba(0, 255, 191, 0.5);
}

.monitor-mock {
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 32px 12px;
  box-sizing: border-box;
  gap: 20px;
  background: none;
}

.monitor-mock .desk-setup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  transform: scale(0.95);
  width: 100%;
  max-width: 1200px;
}

.monitor-mock .main-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  width: 100%;
  flex-wrap: nowrap;
}

.monitor-mock .input-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 28px;
  margin-top: 8px;
  flex-wrap: nowrap;
  justify-content: center;
}

.monitor-mock .monitor-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
}

.monitor-mock .monitor-frame {
  background: #222;
  padding: 16px;
  border-radius: 12px;
  border: 3px solid #333;
  box-shadow: 0 0 24px rgba(0, 255, 191, 0.1);
  width: 640px;
  max-width: 100%;
  height: 300px;
  position: relative;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.monitor-mock .screen {
  background-color: var(--terminal-bg);
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 18px;
  font-family: 'VT323', monospace;
  font-size: 18px;
  line-height: 1.45;
  color: var(--terminal-green);
  overflow-y: auto;
  position: relative;
  box-shadow: inset 0 0 30px rgba(0,0,0,0.9);
  text-shadow: 0 0 4px rgba(0, 255, 191, 0.6);
  white-space: pre-wrap;
  word-wrap: break-word;
  scroll-behavior: smooth;
  box-sizing: border-box;
}

.monitor-mock .screen::-webkit-scrollbar { width: 12px; }
.monitor-mock .screen::-webkit-scrollbar-track { background: #000; }
.monitor-mock .screen::-webkit-scrollbar-thumb { background: #1f4433; border: 2px solid #000; border-radius: 6px; }
.monitor-mock .screen::-webkit-scrollbar-thumb:hover { background: var(--terminal-green); }

.monitor-mock .screen::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
  z-index: 2;
  background-size: 100% 4px;
  pointer-events: none;
}

.monitor-mock .cursor {
  display: inline-block;
  width: 12px;
  height: 24px;
  background-color: var(--terminal-green);
  animation: blink 1s step-end infinite;
  vertical-align: sub;
  box-shadow: 0 0 8px var(--terminal-green);
}

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.monitor-mock .monitor-stand {
  width: 150px;
  height: 38px;
  background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);
  clip-path: polygon(20% 0, 80% 0, 100% 100%, 0% 100%);
}

.monitor-mock .monitor-base {
  width: 230px;
  height: 10px;
  background: #222;
  border-radius: 4px;
  box-shadow: 0 6px 14px rgba(0,0,0,0.6);
  border-top: 1px solid #444;
}

.monitor-mock .screen.off {
  background-color: #050505;
  box-shadow: inset 0 0 50px black;
  text-shadow: none;
}
.monitor-mock .screen.off * { display: none; }

.monitor-mock .cpu-tower {
  width: 190px;
  height: 280px;
  background: #252525;
  border-radius: 6px;
  border: 2px solid #333;
  box-shadow: 10px 0 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  position: relative;
  transform: perspective(1000px) rotateY(-5deg); 
}

.monitor-mock .info-btn {
  position: static;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 2px solid #111;
  background: radial-gradient(circle at 30% 30%, #444, #222);
  color: #a5ffe4;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 14px rgba(53, 255, 181, 0.35), 0 4px 8px rgba(0,0,0,0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.monitor-mock .info-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 18px rgba(102, 229, 255, 0.5);
  border-color: #66e5ff;
}

.monitor-mock .info-panel {
  position: absolute;
  top: 20px;
  right: -320px;
  width: 300px;
  padding: 16px 18px;
  border-radius: 12px;
  background: rgba(10, 18, 22, 0.94);
  border: 1px solid rgba(102, 229, 255, 0.45);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.65), 0 0 24px rgba(102, 229, 255, 0.25);
  backdrop-filter: blur(8px);
  color: #e6fbff;
  font-size: 14px;
  line-height: 1.55;
  z-index: 20;
}

.monitor-mock .info-panel h4 {
  margin: 0 0 10px 0;
  font-size: 15px;
  color: #b6fff0;
  letter-spacing: 0.6px;
}

.monitor-mock .info-panel ul {
  margin: 0;
  padding-left: 18px;
  list-style: disc;
}

.monitor-mock .info-panel li {
  margin-bottom: 8px;
}

.monitor-mock .info-panel .close {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  color: #e6fbff;
  cursor: pointer;
  font-size: 14px;
}

.monitor-mock .vent-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 80%;
  margin-bottom: 20px;
}
.monitor-mock .vent { width: 100%; height: 3px; background: #111; border-radius: 2px; }

.monitor-mock .cd-drive {
  width: 78%;
  height: 28px;
  border: 1px solid #111;
  background: #1f1f1f;
  margin-bottom: 22px;
  border-radius: 2px;
  position: relative;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
}
.monitor-mock .cd-button { width: 12px; height: 6px; background: #333; border-radius: 1px; }

.monitor-mock .power-section {
  margin-top: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding-bottom: 20px;
}

.monitor-mock .power-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #444, #222);
  border: 2px solid #111;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  margin-bottom: 0;
  box-shadow: 0 0 14px rgba(53, 255, 181, 0.45), 0 4px 8px rgba(0,0,0,0.4);
}
.monitor-mock .power-btn:active { transform: scale(0.95); box-shadow: inset 0 2px 5px rgba(0,0,0,0.8); }
.monitor-mock .power-icon { color: #666; font-size: 20px; }

.monitor-mock.system-on .power-btn { border-color: var(--terminal-green); box-shadow: 0 0 20px rgba(0, 255, 191, 0.4); }
.monitor-mock.system-on .power-icon { color: var(--terminal-green); text-shadow: 0 0 8px var(--terminal-green); }

.monitor-mock .keyboard-wrapper { transform: scale(1); }

.monitor-mock .keyboard {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  padding-bottom: 16px;
  border-radius: 16px;
  background-color: #666666;
  background-image: linear-gradient(to bottom, #383838, #1f1f1f);
  box-shadow:
      0 10px 20px rgba(0,0,0,0.4),
      inset 0 1px 0 rgba(255,255,255,0.1);
  width: 720px;
  max-width: 100%;
  user-select: none;
}

.monitor-mock .row { display: flex; gap: 4px; justify-content: center; }

.monitor-mock .row.top-row .key { min-width: 40px; }

.monitor-mock .key {
  background-color: #1f1e1e;
  border: 1px solid #111;
  border-bottom: 3px solid #000;
  border-radius: 6px;
  min-width: 36px;
  height: 36px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--terminal-green);
  text-shadow: 0 0 3px rgba(0, 255, 191, 0.5);
  cursor: pointer;
  transition: all 0.1s;
  font-family: sans-serif;
  position: relative;
  top: 0;
}

.monitor-mock .key:hover { background-color: #2a2a2a; box-shadow: 0 0 5px rgba(0, 255, 191, 0.3); }
        
.monitor-mock .key:active, .monitor-mock .key.active {
  top: 1px;
  border-bottom: 1px solid #000;
  background-color: #151515;
  color: #fff;
  text-shadow: 0 0 8px #fff;
  box-shadow: inset 0 0 10px rgba(0, 255, 191, 0.2);
}

.monitor-mock .key.hotkey {
  border-color: #550022;
  border-bottom-color: #330011;
  color: var(--highlight-key);
  text-shadow: 0 0 5px var(--highlight-key);
}
.monitor-mock .key.hotkey:active, .monitor-mock .key.hotkey.active {
  color: #fff;
  background: var(--highlight-key);
  box-shadow: 0 0 15px var(--highlight-key);
}

.monitor-mock .space-key { flex: 4.8; min-width: 220px; }
.monitor-mock .shift-key-left { flex: 2.2; }
.monitor-mock .shift-key-right { flex: 2.4; }
.monitor-mock .enter-key { flex: 1.9; }
.monitor-mock .caps-key { flex: 1.6; }
.monitor-mock .tab-key { flex: 1.4; }
.monitor-mock .backspace-key { flex: 1.8; }

.monitor-mock .mouse-container {
  width: 84px;
  height: 122px;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 45px 45px 50px 50px;
  border: 1px solid #000;
  box-shadow: 
      0 10px 20px rgba(0,0,0,0.5),
      inset 1px 1px 1px rgba(255,255,255,0.1);
  position: relative;
  margin-top: 12px;
}

.monitor-mock .mouse-top {
  height: 50%;
  width: 100%;
  border-bottom: 1px solid #111;
  border-radius: 45px 45px 5px 5px;
  position: relative;
  display: flex;
  overflow: hidden;
}

.monitor-mock .mouse-btn {
  flex: 1;
  background: linear-gradient(to bottom, #333, #2a2a2a);
  cursor: pointer;
  transition: background 0.1s;
  position: relative;
}
        
.monitor-mock .mouse-btn:hover { background: #383838; }
.monitor-mock .mouse-btn:active, .monitor-mock .mouse-btn.active { background: #222; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5); }
        
.monitor-mock .mouse-btn.left { border-right: 1px solid #111; }

.monitor-mock .scroll-wheel-zone {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 34px;
  background: #0f0f0f;
  border-radius: 8px;
  z-index: 5;
  padding: 2px;
}

.monitor-mock .scroll-wheel {
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(to bottom, #1a1a1a, #1a1a1a 3px, #333 4px);
  border-radius: 6px;
  cursor: ns-resize;
  border: 1px solid #000;
  transition: transform 0.1s;
}
.monitor-mock .scroll-wheel:active, .monitor-mock .scroll-wheel.active { transform: scale(0.95); background: #222; }

.monitor-mock .mouse-body {
  height: 50%;
  border-radius: 5px 5px 50px 50px;
}
        
.monitor-mock .mouse-logo {
  position: absolute;
  bottom: 20px; left: 50%; transform: translateX(-50%);
  width: 20px; height: 20px; opacity: 0.2; background: white;
  mask: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>') no-repeat center;
  -webkit-mask: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>') no-repeat center;
}

.monitor-mock .mobile-controls {
  display: none;
  margin-top: 14px;
  width: 100%;
  max-width: 640px;
  display: none;
}

.monitor-mock .mobile-controls .btn-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
}

.monitor-mock .mobile-btn {
  background: linear-gradient(145deg, #1a1f22, #0f1417);
  border: 1px solid rgba(102, 229, 255, 0.35);
  color: #e6fbff;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 8px 8px;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  line-height: 1.2;
  box-shadow: 0 0 12px rgba(53, 255, 181, 0.35), 0 8px 20px rgba(0,0,0,0.35);
  transition: transform 0.1s ease, box-shadow 0.1s ease, border-color 0.15s ease;
}

.monitor-mock .mobile-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0,0,0,0.45);
  border-color: rgba(102, 229, 255, 0.6);
}

.monitor-mock .mobile-btn:active {
  transform: translateY(0);
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.45);
}

.monitor-mock .mobile-btn.power {
  color: #35ffb5;
  border-color: rgba(53, 255, 181, 0.7);
}

.monitor-mock .mobile-btn.clear {
  color: #ffb6c1;
  border-color: rgba(255, 182, 193, 0.65);
}

.monitor-mock .mobile-hint {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(10, 18, 22, 0.9);
  border: 1px solid rgba(102, 229, 255, 0.3);
  color: #cfefff;
  font-size: 12px;
  text-align: left;
  box-shadow: 0 6px 14px rgba(0,0,0,0.35);
}
.monitor-mock .mobile-hint .hint-icon {
  margin-right: 6px;
  color: var(--terminal-green);
  font-weight: 700;
  text-shadow: 0 0 8px rgba(53, 255, 181, 0.5);
  vertical-align: middle;
}

@media (max-width: 768px) {
  .monitor-mock {
    padding: 20px 10px;
  }
  .monitor-mock .main-row {
    flex-wrap: wrap;
  }
  .monitor-mock .cpu-tower,
  .monitor-mock .input-row,
  .monitor-mock .mouse-container {
    display: none;
  }
  .monitor-mock .monitor-frame {
    width: 100%;
    max-width: 100%;
    height: 420px;
    min-height: 420px;
  }
  .monitor-mock .screen {
    height: 100%;
    min-height: 100%;
  }
  .monitor-mock .mobile-controls {
    display: block;
  }
}

.monitor-mock .title-centered {
  text-align: center;
  font-size: 1.2em;
  letter-spacing: 3.5px;
  margin-bottom: 6px;
  border-bottom: 1px solid rgba(102, 229, 255, 0.65);
  padding-bottom: 6px;
  color: #c8fff1;
  text-shadow: 0 0 12px rgba(102, 229, 255, 0.8), 0 0 6px rgba(53, 255, 181, 0.6);
  text-transform: uppercase;
}
        
.monitor-mock .header-section {
  color: #04130e;
  background: var(--terminal-green);
  font-weight: bold;
  display: inline-block;
  padding: 2px 8px;
  margin-top: 25px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 0 10px var(--terminal-green);
}
.monitor-mock .highlight-text { color: white; text-shadow: 0 0 5px white; }
.monitor-mock .accent-text { color: var(--highlight-text); text-shadow: 0 0 5px var(--highlight-key); }
.monitor-mock .instruction-line { margin-top: 6px; border-top: 1px dashed #2a2a2a; padding-top: 6px; color: #e4fdff; font-size: 1em; letter-spacing: 1.1px; line-height: 1.3; text-align: left; }
`;

const monitorContent: Record<string, string> = {
  intro: `<div class="title-centered">about me</div>
<div class="instruction-line">
COMMANDS:[ <span class="accent-text">W</span> ] WHO  [ <span class="accent-text">P</span> ] PURPOSE  [ <span class="accent-text">X</span> ] CREATIVE  [ <span class="accent-text">H</span> ] PASSIONS
</div>
>_ `,
  w: `<br><span class="header-section">WHO AM I?</span>
I am a <span class="highlight-text">Full Stack Developer</span> & UI Designer.
I specialize in building immersive web experiences that feel alive.
<br>>_ `,
  p: `<br><span class="header-section">MY PURPOSE</span>
To humanize technology. I build tools that are intuitive, robust, and delightful.
My goal is to simplify the complex and make the web a more beautiful place.
<br>>_ `,
  x: `<br><span class="header-section">CREATIVE PHILOSOPHY</span>
"Form follows function, but form implies values."
1. <span class="accent-text">Simplicity</span> is the ultimate sophistication.
2. <span class="accent-text">Performance</span> is a feature, not an afterthought.
3. <span class="accent-text">Accessibility</span> ensures everyone is invited.
<br>>_ `,
  h: `<br><span class="header-section">PASSIONS</span>
> <span class="highlight-text">Coding</span> (React, WebGL, Node.js)
> <span class="highlight-text">Gaming</span> (RPG, Strategy)
> <span class="highlight-text">Coffee</span> (Dark Roast)
<br>>_ `,
};

const MonitorMock: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const display = root.querySelector('#display') as HTMLElement | null;
    const textContent = root.querySelector('#text-content') as HTMLElement | null;
    const keys = Array.from(root.querySelectorAll('.key')) as HTMLElement[];
    const mouseLeft = root.querySelector('#mouseLeft') as HTMLElement | null;
    const mouseRight = root.querySelector('#mouseRight') as HTMLElement | null;
    const scrollWheel = root.querySelector('#scrollWheel') as HTMLElement | null;
    const powerBtn = root.querySelector('#powerBtn') as HTMLElement | null;
    const infoBtn = root.querySelector('#infoBtn') as HTMLElement | null;
    const mobileBtnW = root.querySelector('#mobileBtnW') as HTMLElement | null;
    const mobileBtnP = root.querySelector('#mobileBtnP') as HTMLElement | null;
    const mobileBtnX = root.querySelector('#mobileBtnX') as HTMLElement | null;
    const mobileBtnH = root.querySelector('#mobileBtnH') as HTMLElement | null;
    const mobileBtnClear = root.querySelector('#mobileBtnClear') as HTMLElement | null;
    const mobileBtnPower = root.querySelector('#mobileBtnPower') as HTMLElement | null;

    let isPowerOn = true;
    let clickOrderIndex = 0;
    const clickOrder = ['w', 'p', 'x', 'h'];

    let bootInterval: number | null = null;
    let bootTimeout: number | null = null;

    const scrollToBottom = () => {
      if (!display) return;
      display.scrollTop = display.scrollHeight;
    };

    const bootSequence = () => {
      if (!textContent) return;
      textContent.innerHTML = '';
      clickOrderIndex = 0;
      let dots = 0;
      bootInterval = window.setInterval(() => {
        if (textContent) {
          textContent.innerHTML = '> BOOTING SYSTEM' + '.'.repeat(dots);
        }
        dots = (dots + 1) % 4;
      }, 200);

      bootTimeout = window.setTimeout(() => {
        if (bootInterval) clearInterval(bootInterval);
        if (textContent) textContent.innerHTML = monitorContent.intro;
      }, 1500);
    };

    const findKeyElement = (eventKey: string) => {
      const selector = `.key[data-key="${eventKey}"]`;
      let el = root.querySelector(selector) as HTMLElement | null;
      if (!el && eventKey.length === 1) {
        el = root.querySelector(`.key[data-key="${eventKey.toLowerCase()}"]`) as HTMLElement | null;
      }
      return el;
    };

    const handleScroll = (direction: number) => {
      if (!isPowerOn || !display || !scrollWheel) return;
      const amount = direction * 50;
      display.scrollTop += amount;
      scrollWheel.style.transform = `translateY(${direction * 2}px) scale(0.95)`;
      window.setTimeout(() => {
        scrollWheel.style.transform = 'translateY(0) scale(1)';
      }, 100);
    };

    const animateMouseBtn = (element: HTMLElement | null) => {
      if (!element) return;
      element.classList.add('active');
      window.setTimeout(() => element.classList.remove('active'), 150);
    };

    const handleInput = (_virtualText: string | null, actionKey: string) => {
      if (!isPowerOn || !textContent) return;
      const lowerKey = actionKey.toLowerCase();

      if (monitorContent[lowerKey]) {
        textContent.innerHTML += monitorContent[lowerKey];
        const foundIndex = clickOrder.indexOf(lowerKey);
        if (foundIndex !== -1) {
          clickOrderIndex = (foundIndex + 1) % clickOrder.length;
        }
        scrollToBottom();
        return;
      }

      if (actionKey === 'Backspace') {
        const current = textContent.innerHTML;
        if (!current.endsWith('>_ ')) {
          textContent.innerHTML = current.slice(0, -1);
        }
      } else if (actionKey === 'Enter') {
        textContent.innerHTML += '<br>>_ ';
      } else if (actionKey === 'Tab') {
        textContent.innerHTML += '&nbsp;&nbsp;';
      } else if (actionKey.length === 1) {
        textContent.innerHTML += actionKey;
      }

      scrollToBottom();
    };

    const resetIntro = () => {
      if (textContent) textContent.innerHTML = monitorContent.intro;
      clickOrderIndex = 0;
    };

    const handlePowerToggle = () => {
      isPowerOn = !isPowerOn;
      if (isPowerOn) {
        root.classList.add('system-on');
        display?.classList.remove('off');
        bootSequence();
      } else {
        root.classList.remove('system-on');
        display?.classList.add('off');
        if (textContent) textContent.innerHTML = '';
      }
    };

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      handleScroll(direction);
    };

    const mouseDownHandler = (e: MouseEvent) => {
      if (!isPowerOn) return;
      if (e.button === 0) {
        animateMouseBtn(mouseLeft);
      } else if (e.button === 2) {
        animateMouseBtn(mouseRight);
        resetIntro();
      }
    };

    const contextMenuHandler = (e: MouseEvent) => e.preventDefault();

    const keydownHandler = (e: KeyboardEvent) => {
      if (!isPowerOn) return;
      const keyEl = findKeyElement(e.key);
      if (keyEl) keyEl.classList.add('active');
      if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();
      handleInput(null, e.key);
    };

    const keyupHandler = (e: KeyboardEvent) => {
      const keyEl = findKeyElement(e.key);
      if (keyEl) keyEl.classList.remove('active');
    };

    const virtualHandlers = new Map<HTMLElement, (ev: MouseEvent) => void>();
    keys.forEach(key => {
      const handler = (e: MouseEvent) => {
        e.stopPropagation();
        if (!isPowerOn) return;
        handleInput(key.innerText, key.getAttribute('data-key') || '');
      };
      virtualHandlers.set(key, handler);
      key.addEventListener('mousedown', handler);
    });

    bootSequence();

    const toggleInfo = () => setShowInfo((prev) => !prev);
    const mobileSectionHandler = (key: string) => () => handleInput(null, key);

    root.addEventListener('wheel', wheelHandler, { passive: false });
    root.addEventListener('mousedown', mouseDownHandler);
    root.addEventListener('contextmenu', contextMenuHandler);
    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);
    powerBtn?.addEventListener('click', handlePowerToggle);
    infoBtn?.addEventListener('click', toggleInfo);
    const onMobileW = mobileSectionHandler('w');
    const onMobileP = mobileSectionHandler('p');
    const onMobileX = mobileSectionHandler('x');
    const onMobileH = mobileSectionHandler('h');
    mobileBtnW?.addEventListener('click', onMobileW);
    mobileBtnP?.addEventListener('click', onMobileP);
    mobileBtnX?.addEventListener('click', onMobileX);
    mobileBtnH?.addEventListener('click', onMobileH);
    mobileBtnClear?.addEventListener('click', resetIntro);
    mobileBtnPower?.addEventListener('click', handlePowerToggle);

    return () => {
      if (bootInterval) clearInterval(bootInterval);
      if (bootTimeout) clearTimeout(bootTimeout);
      root.removeEventListener('wheel', wheelHandler);
      root.removeEventListener('mousedown', mouseDownHandler);
      root.removeEventListener('contextmenu', contextMenuHandler);
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('keyup', keyupHandler);
      powerBtn?.removeEventListener('click', handlePowerToggle);
      virtualHandlers.forEach((handler, key) => key.removeEventListener('mousedown', handler));
      infoBtn?.removeEventListener('click', toggleInfo);
      mobileBtnW?.removeEventListener('click', onMobileW);
      mobileBtnP?.removeEventListener('click', onMobileP);
      mobileBtnX?.removeEventListener('click', onMobileX);
      mobileBtnH?.removeEventListener('click', onMobileH);
      mobileBtnClear?.removeEventListener('click', resetIntro);
      mobileBtnPower?.removeEventListener('click', handlePowerToggle);
    };
  }, []);

  return (
    <div className="monitor-mock system-on" ref={rootRef}>
      <style>{monitorStyles}</style>
      <div className="desk-setup">
        <div className="main-row">
          <div className="monitor-group">
            <div className="monitor-frame">
              <div className="screen" id="display">
                <span id="text-content" />
                <span className="cursor" />
              </div>
            </div>
            <div className="monitor-stand" />
            <div className="monitor-base" />
            <div className="mobile-controls">
              <div className="btn-grid">
                <button className="mobile-btn" id="mobileBtnW">WHO (W)</button>
                <button className="mobile-btn" id="mobileBtnP">PURPOSE (P)</button>
                <button className="mobile-btn" id="mobileBtnX">CREATIVE (X)</button>
                <button className="mobile-btn" id="mobileBtnH">PASSIONS (H)</button>
                <button className="mobile-btn clear" id="mobileBtnClear">CLEAR</button>
                <button className="mobile-btn power" id="mobileBtnPower">POWER</button>
              </div>
              <div className="mobile-hint"><span className="hint-icon">ℹ</span>For a more interactive experience, switch to a desktop</div>
            </div>
          </div>

          <div className="cpu-tower">
            <div className="vent-grid">
              <div className="vent" />
              <div className="vent" />
              <div className="vent" />
            </div>
            <div className="cd-drive"><div className="cd-button" /></div>
            <div className="vent-grid">
              <div className="vent" />
              <div className="vent" />
              <div className="vent" />
              <div className="vent" />
            </div>
            <div className="power-section">
              <div className="power-btn" id="powerBtn">
                <div className="power-icon">⏻</div>
              </div>
              <button className="info-btn" id="infoBtn" aria-label="Show info">i</button>
            </div>
            {showInfo && (
              <div className="info-panel">
                <button className="close" aria-label="Close info" onClick={() => setShowInfo(false)}>✕</button>
                <h4>How to use</h4>
                <ul>
                  <li>Left-click: mouse tap animation only.</li>
                  <li>Right-click: clear and return to the command list.</li>
                  <li>Keys W / P / X / H: open Who, Purpose, Creative, Passions.</li>
                  <li>Enter adds a new prompt line; Backspace deletes characters.</li>
                  <li>Scroll wheel or touchpad scrolls the screen.</li>
                  <li>Power button toggles the monitor on/off (desktop & mobile).</li>
                  <li>Info button (this) explains controls.</li>
                  <li>Mobile: use the 6 buttons below the screen for sections, clear, power.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="input-row">
          <div className="keyboard-wrapper">
            <div className="keyboard" id="virtual-keyboard">
              <div className="row top-row">
                <div className="key" data-key="Escape">ESC</div>
                <div className="key" data-key="F1">F1</div>
                <div className="key" data-key="F2">F2</div>
                <div className="key" data-key="F3">F3</div>
                <div className="key" data-key="F4">F4</div>
                <div className="key" data-key="F5">F5</div>
                <div className="key" data-key="F6">F6</div>
                <div className="key" data-key="F7">F7</div>
                <div className="key" data-key="F8">F8</div>
                <div className="key" data-key="F9">F9</div>
                <div className="key" data-key="F10">F10</div>
                <div className="key" data-key="F11">F11</div>
                <div className="key" data-key="F12">F12</div>
              </div>
              <div className="row">
                <div className="key" data-key="`">`</div>
                <div className="key" data-key="1">1</div>
                <div className="key" data-key="2">2</div>
                <div className="key" data-key="3">3</div>
                <div className="key" data-key="4">4</div>
                <div className="key" data-key="5">5</div>
                <div className="key" data-key="6">6</div>
                <div className="key" data-key="7">7</div>
                <div className="key" data-key="8">8</div>
                <div className="key" data-key="9">9</div>
                <div className="key" data-key="0">0</div>
                <div className="key" data-key="-">-</div>
                <div className="key" data-key="=">=</div>
                <div className="key backspace-key" data-key="Backspace">DEL</div>
              </div>
              <div className="row">
                <div className="key tab-key" data-key="Tab">TAB</div>
                <div className="key" data-key="q">Q</div>
                <div className="key hotkey" data-key="w" title="Who Am I?">W</div>
                <div className="key" data-key="e">E</div>
                <div className="key" data-key="r">R</div>
                <div className="key" data-key="t">T</div>
                <div className="key" data-key="y">Y</div>
                <div className="key" data-key="u">U</div>
                <div className="key" data-key="i">I</div>
                <div className="key" data-key="o">O</div>
                <div className="key hotkey" data-key="p" title="My Purpose">P</div>
                <div className="key" data-key="[">[</div>
                <div className="key" data-key="]">]</div>
                <div className="key" data-key="\\">{"\\"}</div>
              </div>
              <div className="row">
                <div className="key caps-key" data-key="CapsLock">CAPS</div>
                <div className="key" data-key="a">A</div>
                <div className="key" data-key="s">S</div>
                <div className="key" data-key="d">D</div>
                <div className="key" data-key="f">F</div>
                <div className="key" data-key="g">G</div>
                <div className="key hotkey" data-key="h" title="My Passions">H</div>
                <div className="key" data-key="j">J</div>
                <div className="key" data-key="k">K</div>
                <div className="key" data-key="l">L</div>
                <div className="key" data-key=";">;</div>
                <div className="key" data-key="'">'</div>
                <div className="key enter-key" data-key="Enter">ENTER</div>
              </div>
              <div className="row">
                <div className="key shift-key-left" data-key="Shift">SHIFT</div>
                <div className="key" data-key="z">Z</div>
                <div className="key hotkey" data-key="x" title="Creative Philosophy">X</div>
                <div className="key" data-key="c">C</div>
                <div className="key" data-key="v">V</div>
                <div className="key" data-key="b">B</div>
                <div className="key" data-key="n">N</div>
                <div className="key" data-key="m">M</div>
                <div className="key" data-key=",">,</div>
                <div className="key" data-key=".">.</div>
                <div className="key" data-key="/">/</div>
                <div className="key shift-key-right" data-key="Shift">SHIFT</div>
              </div>
              <div className="row">
                <div className="key" data-key="Control">CTRL</div>
                <div className="key" data-key="Alt">ALT</div>
                <div className="key space-key" data-key=" " />
                <div className="key" data-key="Alt">ALT</div>
                <div className="key" data-key="Control">CTRL</div>
              </div>
            </div>
          </div>

          <div className="mouse-container">
            <div className="mouse-top">
              <div className="mouse-btn left" id="mouseLeft" />
              <div className="scroll-wheel-zone">
                <div className="scroll-wheel" id="scrollWheel" />
              </div>
              <div className="mouse-btn right" id="mouseRight" />
            </div>
            <div className="mouse-body">
              <div className="mouse-logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const About: React.FC = () => {
  return <MonitorMock />;
};

export default About; 