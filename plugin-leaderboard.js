(function() {
    'use strict';
    console.log("30+ Themes Leaderboard: Ultimate Hide Patch loaded...");

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
            .lb-item, .lb-item-first {
                margin: 1px 0;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .lb-item-first { font-weight: bold; }
            
            .panel-neon { background: rgba(10, 15, 30, 0.85); border: 1px solid rgba(255, 0, 85, 0.9); color: #ff3366; box-shadow: 0 0 12px rgba(255, 0, 85, 0.5); backdrop-filter: blur(6px); }
            .panel-glass { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); backdrop-filter: blur(10px); }
            .panel-matrix { background: rgba(0, 15, 5, 0.95); border: 1px solid #00ff66; color: #00ff66; box-shadow: 0 0 10px rgba(0,255,102,0.3); }
            .panel-gold { background: rgba(30, 25, 10, 0.9); border: 1px solid #ffd700; color: #ffd700; box-shadow: 0 0 12px rgba(255,215,0,0.4); }
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

    // دالة فحص ما إذا كان التفعيل شغّال
    function shouldHide() {
        try {
            const host = document.getElementById('menu-host');
            if (host && host.shadowRoot) {
                const isHideChecked = host.shadowRoot.getElementById('chk-hide-leaderboard')?.checked;
                const themeSelect = host.shadowRoot.getElementById('select-theme-style');
                const selectedTheme = themeSelect ? themeSelect.value : 'off';
                return isHideChecked || selectedTheme !== 'off';
            }
        } catch (e) {}
        return true; // افتراضي للإخفاء لو الـ host مش موجود
    }

    // تدمير واعتراض الرسم بالكامل في الزاوية اليمنى العليا
    try {
        if (!window._originalDrawImage) {
            window._originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
        }

        CanvasRenderingContext2D.prototype.drawImage = function(...args) {
            if (shouldHide()) {
                let x = args[1];
                let y = args[2];
                // توسيع نطاق الإحداثيات ليشمل أي مكان محتمل لليدر بورد
                if (typeof x === 'number' && typeof y === 'number' && x > window.innerWidth - 450 && y < 400) {
                    return; 
                }
            }
            return window._originalDrawImage.apply(this, args);
        };
    } catch (err) {}

    // التقاط النصوص وبنائها
    if (!window._smartPanelHookActive) {
        window._smartPanelHookActive = true;
        const origFillText = CanvasRenderingContext2D.prototype.fillText;

        CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
            const result = origFillText.apply(this, arguments);

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
            const host = document.getElementById('menu-host');
            if (!host || !host.shadowRoot) return;

            const isHideChecked = host.shadowRoot.getElementById('chk-hide-leaderboard')?.checked;
            const themeSelect = host.shadowRoot.getElementById('select-theme-style');
            const selectedTheme = themeSelect ? themeSelect.value : 'off';

            if (isHideChecked || selectedTheme === 'off') {
                if (lbPanel.classList.contains('active')) {
                    lbPanel.className = '';
                    lbPanel.innerHTML = '';
                    cachedHTML = "";
                    playersMap = {};
                }
                return;
            }

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

    console.log("Ultimate Hide Patch applied successfully!");
})();
