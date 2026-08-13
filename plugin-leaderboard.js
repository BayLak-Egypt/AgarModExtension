(function() {
    'use strict';
    console.log("30+ Themes Leaderboard: Script loaded successfully...");

    const styleId = '_agar_smart_lb_style';
    if (!document.getElementById(styleId)) {
        const customStyle = document.createElement('style');
        customStyle.id = styleId;
        customStyle.innerHTML = `
            #smart-leaderboard-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 220px;
                padding: 10px;
                border-radius: 8px;
                font-family: 'Tahoma', sans-serif;
                font-size: 12px;
                z-index: 999996;
                pointer-events: none;
                display: none;
                backface-visibility: hidden;
                transform: translateZ(0);
            }
            #smart-leaderboard-panel.active {
                display: block !important;
            }
            .lb-title {
                font-weight: bold;
                text-align: center;
                margin-bottom: 6px;
                border-bottom: 1px solid rgba(255,255,255,0.2);
                padding-bottom: 4px;
            }
            .lb-item {
                margin: 1px 0;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .lb-item-first {
                font-weight: bold;
                margin: 1px 0;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .panel-neon { background: rgba(10, 15, 30, 0.85); border: 1px solid rgba(255, 0, 85, 0.9); color: #ff3366; box-shadow: 0 0 12px rgba(255, 0, 85, 0.5); backdrop-filter: blur(6px); }
            .panel-glass { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); backdrop-filter: blur(10px); }
            .panel-minimal { background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(59, 130, 246, 0.8); color: #38bdf8; }
            .panel-cyber-red { background: rgba(20, 5, 5, 0.9); border: 1px solid #ff0033; color: #ff1a40; box-shadow: 0 0 10px rgba(255,0,51,0.4); }
            .panel-matrix { background: rgba(0, 15, 5, 0.95); border: 1px solid #00ff66; color: #00ff66; box-shadow: 0 0 10px rgba(0,255,102,0.3); }
            .panel-gold { background: rgba(30, 25, 10, 0.9); border: 1px solid #ffd700; color: #ffd700; box-shadow: 0 0 12px rgba(255,215,0,0.4); }
            .panel-silver { background: rgba(40, 40, 40, 0.9); border: 1px solid #c0c0c0; color: #e0e0e0; box-shadow: 0 0 10px rgba(192,192,192,0.3); }
            .panel-purple { background: rgba(20, 10, 30, 0.9); border: 1px solid #9933ff; color: #cc66ff; box-shadow: 0 0 10px rgba(153,51,255,0.4); }
            .panel-ocean { background: rgba(5, 20, 35, 0.9); border: 1px solid #0099ff; color: #33ccff; box-shadow: 0 0 10px rgba(0,153,255,0.4); }
            .panel-lavender { background: rgba(30, 25, 40, 0.9); border: 1px solid #b19cd9; color: #dcd0ff; }
            .panel-sunset { background: linear-gradient(135deg, rgba(40, 10, 30, 0.9), rgba(20, 20, 40, 0.9)); border: 1px solid #ff77a9; color: #ff99bb; }
            .panel-aurora { background: rgba(10, 30, 30, 0.9); border: 1px solid #00ffcc; color: #66ffcc; }
            .panel-volcano { background: rgba(35, 10, 5, 0.9); border: 1px solid #ff4500; color: #ff6633; box-shadow: 0 0 10px rgba(255,69,0,0.4); }
            .panel-space { background: rgba(5, 5, 15, 0.95); border: 1px solid #7b68ee; color: #add8e6; box-shadow: 0 0 15px rgba(123,104,238,0.3); }
            .panel-emerald { background: rgba(5, 30, 15, 0.9); border: 1px solid #2ecc71; color: #57d98d; }
            .panel-pink { background: rgba(35, 15, 25, 0.9); border: 1px solid #ff69b4; color: #ffb6c1; }
            .panel-cappuccino { background: rgba(40, 30, 20, 0.9); border: 1px solid #d2b48c; color: #f5deb3; }
            .panel-carbon { background: rgba(15, 15, 15, 0.95); border: 1px solid #444; color: #aaa; }
            .panel-white { background: rgba(255, 255, 255, 0.95); border: 1px solid #ccc; color: #333; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .panel-retro { background: rgba(10, 35, 10, 0.9); border: 1px solid #33ff33; color: #33ff33; font-family: monospace; }
            .panel-halloween { background: rgba(30, 15, 5, 0.9); border: 1px solid #ff6600; color: #ff9933; box-shadow: 0 0 10px rgba(255,102,0,0.4); }
            .panel-turquoise { background: rgba(5, 30, 30, 0.9); border: 1px solid #40e0d0; color: #afeeee; }
            .panel-sapphire { background: rgba(5, 10, 35, 0.9); border: 1px solid #0f52ba; color: #6495ed; }
            .panel-jade { background: rgba(0, 30, 20, 0.9); border: 1px solid #00a86b; color: #5dbb63; }
            .panel-amber { background: rgba(35, 25, 5, 0.9); border: 1px solid #ffbf00; color: #ffcc00; }
            .panel-lime { background: rgba(25, 35, 5, 0.9); border: 1px solid #bfff00; color: #ccff00; }
            .panel-blueberry { background: rgba(15, 20, 40, 0.9); border: 1px solid #4682b4; color: #b0e0e6; }
            .panel-violet { background: rgba(25, 5, 35, 0.9); border: 1px solid #8a2be2; color: #dda0dd; }
            .panel-coral { background: rgba(35, 15, 15, 0.9); border: 1px solid #ff7f50; color: #ffa07a; }
            .panel-copper { background: rgba(35, 20, 10, 0.9); border: 1px solid #b87333; color: #deb887; }
            .panel-steel { background: rgba(25, 30, 35, 0.9); border: 1px solid #4682b4; color: #b0c4de; }
        `;
        document.head.appendChild(customStyle);
    }

    let lbPanel = document.getElementById('smart-leaderboard-panel');
    if (!lbPanel) {
        lbPanel = document.createElement('div');
        lbPanel.id = 'smart-leaderboard-panel';
        document.body.appendChild(lbPanel);
    }

    let playersMap = {};
    let cachedHTML = "";

    function shouldHideOriginal() {
        try {
            const host = document.getElementById('menu-host');
            if (host && host.shadowRoot) {
                const isHideChecked = host.shadowRoot.getElementById('chk-hide-leaderboard')?.checked;
                const themeSelect = host.shadowRoot.getElementById('select-theme-style');
                
                if (themeSelect) {
                    themeSelect.disabled = !!isHideChecked;
                }

                const selectedTheme = themeSelect ? themeSelect.value : 'off';
                // إخفاء الأصلي إذا كان الشيك بوكس مفعلاً أو الثيم غير مغلق
                return isHideChecked || selectedTheme !== 'off';
            }
        } catch (e) {}
        return false;
    }

    function isCustomPanelDisabled() {
        try {
            const host = document.getElementById('menu-host');
            if (host && host.shadowRoot) {
                const isHideChecked = host.shadowRoot.getElementById('chk-hide-leaderboard')?.checked;
                const themeSelect = host.shadowRoot.getElementById('select-theme-style');
                const selectedTheme = themeSelect ? themeSelect.value : 'off';
                
                // إلغاء الليدر بورد المخصص فقط إذا تم تفعيل الـ Checkbox أو كان الثيم 'off'
                return isHideChecked || selectedTheme === 'off';
            }
        } catch (e) {}
        return false;
    }

    try {
        if (!window._originalDrawImage) {
            window._originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
        }

        CanvasRenderingContext2D.prototype.drawImage = function(...args) {
            if (!shouldHideOriginal()) {
                return window._originalDrawImage.apply(this, args);
            }

            try {
                let x = args[1];
                let y = args[2];
                if (typeof x === 'number' && typeof y === 'number' && x > window.innerWidth - 450 && y < 400) {
                    return; // إخفاء الليدر بورد الأصلي المرسوم على الـ Canvas
                }
            } catch (e) {}

            return window._originalDrawImage.apply(this, args);
        };
    } catch (err) {}

    if (!window._smartPanelHookActive) {
        window._smartPanelHookActive = true;
        const origFillText = CanvasRenderingContext2D.prototype.fillText;

        CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
            const result = origFillText.apply(this, arguments);

            if (isCustomPanelDisabled()) {
                return result;
            }

            try {
                const host = document.getElementById('menu-host');
                if (host && host.shadowRoot) {
                    const themeSelect = host.shadowRoot.getElementById('select-theme-style');
                    const selectedTheme = themeSelect ? themeSelect.value : 'off';

                    if (selectedTheme !== 'off' && text && text.length > 1 && text !== "Score" && text !== "Leaderboard" && !text.includes(":")) {
                        let cleanText = text.trim();
                        const match = cleanText.match(/^([0-9]{1,2})\.\s*(.*)$/);
                        if (match) {
                            let rank = parseInt(match[1]);
                            let playerName = match[2];
                            playersMap[rank] = playerName;
                        }
                    }
                }
            } catch (e) {}

            return result;
        };
    }

    setInterval(() => {
        try {
            if (isCustomPanelDisabled()) {
                if (lbPanel.classList.contains('active')) {
                    lbPanel.className = '';
                    lbPanel.innerHTML = '';
                    cachedHTML = "";
                    playersMap = {};
                }
                return;
            }

            const host = document.getElementById('menu-host');
            if (!host || !host.shadowRoot) return;

            const themeSelect = host.shadowRoot.getElementById('select-theme-style');
            const selectedTheme = themeSelect ? themeSelect.value : 'off';

            let sortedRanks = Object.keys(playersMap).map(Number).sort((a, b) => a - b);
            if (sortedRanks.length === 0) return;

            let html = `<div class="lb-title">Leaderboard</div>`;
            sortedRanks.forEach(rank => {
                if (rank === 1) {
                    html += `<div class="lb-item-first">${rank}. ${playersMap[rank]}</div>`;
                } else {
                    html += `<div class="lb-item">${rank}. ${playersMap[rank]}</div>`;
                }
            });

            if (html !== cachedHTML) {
                cachedHTML = html;
                lbPanel.innerHTML = html;
            }

            lbPanel.className = `active panel-${selectedTheme}`;
            
            playersMap = {};
        } catch (e) {}
    }, 300);

    console.log("30+ Themes activated successfully!");
})();
