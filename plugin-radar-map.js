(function() {
    'use strict';
    try {
        console.log("Dual-Layer Ultra Radar V26: مطابقة ثيم قائمة الصدارة بنجاح...");

        if (document.getElementById('agar-radar-map-container')) {
            document.getElementById('agar-radar-map-container').remove();
        }
        
        const radarContainer = document.createElement('div');
        radarContainer.id = 'agar-radar-map-container';
        radarContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 180px;
            height: 180px;
            background: rgba(8, 12, 20, 0.9);
            border: 3px solid #ff3333;
            border-radius: 50%;
            pointer-events: none;
            z-index: 999999;
            overflow: hidden;
            display: none;
            box-shadow: 0 0 20px rgba(255, 51, 51, 0.6);
        `;
        document.body.appendChild(radarContainer);

        const centerDot = document.createElement('div');
        centerDot.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            width: 8px;
            height: 8px;
            background: #4ade80;
            border: 2px solid #ffffff;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000003;
        `;
        radarContainer.appendChild(centerDot);

        const svgNS = "http://www.w3.org/2000/svg";
        const radarSvg = document.createElementNS(svgNS, "svg");
        radarSvg.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000001;';
        radarContainer.appendChild(radarSvg);

        const radarBoundsPath = document.createElementNS(svgNS, "path");
        radarBoundsPath.setAttribute("fill", "none");
        radarBoundsPath.setAttribute("stroke", "#ff3300");
        radarBoundsPath.setAttribute("stroke-width", "2");
        radarSvg.appendChild(radarBoundsPath);

        const memoryLayer = document.createElement('div');
        memoryLayer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000002; opacity: 0.45;';
        radarContainer.appendChild(memoryLayer);

        const liveLayer = document.createElement('div');
        liveLayer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000003;';
        radarContainer.appendChild(liveLayer);

        let mapB = { minX: null, maxX: null, minY: null, maxY: null };
        let stableB = { minX: null, maxX: null, minY: null, maxY: null };
        let camState = null;
        let lastCamTime = Date.now();
        
        let worldMemory = new Map();
        let currentFrameNodes = new Map();
        let nodeHistoryTracker = new Map();

        if (!window._origArcDual) {
            window._origArcDual = CanvasRenderingContext2D.prototype.arc;
        }

        CanvasRenderingContext2D.prototype.arc = function(x, y, radius, startAngle, endAngle, counterclockwise) {
            if (radius > 4.5 && radius < 35) {
                try {
                    let tr = this.getTransform();
                    if (tr && tr.a > 0) {
                        camState = { scale: tr.a, translateX: tr.e, translateY: tr.f };
                        lastCamTime = Date.now();

                        const sx = x * tr.a + y * tr.c + tr.e;
                        const sy = x * tr.b + tr.d * y + tr.f;
                        
                        const centerX = window.innerWidth / 2;
                        const centerY = window.innerHeight / 2;

                        let distanceFromScreenCenter = Math.hypot(sx - centerX, sy - centerY);
                        if (distanceFromScreenCenter < 60) {
                            return window._origArcDual.call(this, x, y, radius, startAngle, endAngle, counterclockwise);
                        }

                        let wx = Math.round(x);
                        let wy = Math.round(y);

                        if (Math.abs(wx) < 15000) {
                            if (mapB.minX === null || wx < mapB.minX) mapB.minX = wx;
                            if (mapB.maxX === null || wx > mapB.maxX) mapB.maxX = wx;
                        }
                        if (Math.abs(wy) < 15000) {
                            if (mapB.minY === null || wy < mapB.minY) mapB.minY = wy;
                            if (mapB.maxY === null || wy > mapB.maxY) mapB.maxY = wy;
                        }

                        if (mapB.minX !== null && mapB.maxX !== null && mapB.minY !== null && mapB.maxY !== null) {
                            let wSpan = mapB.maxX - mapB.minX;
                            let hSpan = mapB.maxY - mapB.minY;
                            if (wSpan > 500 && hSpan > 500 && wSpan < 20000 && hSpan < 20000) {
                                stableB.minX = mapB.minX;
                                stableB.maxX = mapB.maxX;
                                stableB.minY = mapB.minY;
                                stableB.maxY = mapB.maxY;
                            }
                        }

                        const worldX = (sx - tr.e) / tr.a;
                        const worldY = (sy - tr.f) / tr.a;
                        let nodeKey = `node_${Math.round(worldX / 8)}_${Math.round(worldY / 8)}`;

                        let nodeData = { wx: worldX, wy: worldY, r: radius };

                        currentFrameNodes.set(nodeKey, nodeData);

                        if (!nodeHistoryTracker.has(nodeKey)) {
                            nodeHistoryTracker.set(nodeKey, { count: 1, data: nodeData });
                        } else {
                            let tracker = nodeHistoryTracker.get(nodeKey);
                            tracker.count++;
                            if (tracker.count >= 3) {
                                worldMemory.set(nodeKey, nodeData);
                            }
                        }
                    }
                } catch (e) {}
            }
            return window._origArcDual.call(this, x, y, radius, startAngle, endAngle, counterclockwise);
        };

        function applyRadarTheme(theme, shadowRoot) {
            const themesMap = {
                neon:         { bg: 'rgba(5, 10, 20, 0.95)', border: '#ff3366', player: '#ff3366', live: '#38bdf8' },
                glass:        { bg: 'rgba(255, 255, 255, 0.1)', border: '#ffffff', player: '#4ade80', live: '#60a5fa' },
                minimal:      { bg: 'rgba(15, 23, 42, 0.9)', border: '#64748b', player: '#22c55e', live: '#94a3b8' },
                'cyber-red':  { bg: 'rgba(20, 5, 5, 0.95)', border: '#ff0033', player: '#ff1a40', live: '#ff1a40' },
                matrix:       { bg: 'rgba(0, 20, 10, 0.95)', border: '#00ff66', player: '#00ff66', live: '#00ff66' },
                gold:         { bg: 'rgba(20, 15, 5, 0.95)', border: '#ffd700', player: '#ffd700', live: '#ffd700' },
                silver:       { bg: 'rgba(30, 35, 45, 0.95)', border: '#c0c0c0', player: '#e0e0e0', live: '#e0e0e0' },
                purple:       { bg: 'rgba(15, 5, 25, 0.95)', border: '#9933ff', player: '#cc66ff', live: '#cc66ff' },
                ocean:        { bg: 'rgba(5, 20, 35, 0.95)', border: '#0099ff', player: '#33ccff', live: '#33ccff' },
                lavender:     { bg: 'rgba(20, 15, 30, 0.95)', border: '#b19cd9', player: '#dcd0ff', live: '#dcd0ff' },
                sunset:       { bg: 'rgba(30, 10, 15, 0.95)', border: '#ff77a9', player: '#ff99bb', live: '#ff99bb' },
                aurora:       { bg: 'rgba(5, 25, 20, 0.95)', border: '#00ffcc', player: '#66ffcc', live: '#66ffcc' },
                volcano:      { bg: 'rgba(35, 10, 5, 0.95)', border: '#ff4500', player: '#ff6633', live: '#ff6633' },
                space:        { bg: 'rgba(2, 4, 10, 0.98)', border: '#7b68ee', player: '#add8e6', live: '#add8e6' },
                emerald:      { bg: 'rgba(5, 25, 15, 0.95)', border: '#2ecc71', player: '#57d98d', live: '#57d98d' },
                pink:         { bg: 'rgba(30, 10, 20, 0.95)', border: '#ff69b4', player: '#ffb6c1', live: '#ffb6c1' },
                cappuccino:   { bg: 'rgba(25, 20, 15, 0.95)', border: '#d2b48c', player: '#f5deb3', live: '#f5deb3' },
                carbon:       { bg: 'rgba(10, 10, 10, 0.95)', border: '#444', player: '#aaa', live: '#aaa' },
                white:        { bg: 'rgba(240, 244, 248, 0.95)', border: '#ccc', player: '#333', live: '#333' },
                retro:        { bg: 'rgba(20, 5, 30, 0.95)', border: '#33ff33', player: '#33ff33', live: '#33ff33' },
                halloween:    { bg: 'rgba(25, 12, 2, 0.95)', border: '#ff6600', player: '#ff9933', live: '#ff9933' },
                turquoise:    { bg: 'rgba(5, 25, 25, 0.95)', border: '#40e0d0', player: '#afeeee', live: '#afeeee' },
                sapphire:     { bg: 'rgba(5, 15, 35, 0.95)', border: '#0f52ba', player: '#6495ed', live: '#6495ed' },
                jade:         { bg: 'rgba(5, 25, 20, 0.95)', border: '#00a86b', player: '#5dbb63', live: '#5dbb63' },
                amber:        { bg: 'rgba(30, 20, 5, 0.95)', border: '#ffbf00', player: '#ffcc00', live: '#ffcc00' },
                lime:         { bg: 'rgba(15, 30, 5, 0.95)', border: '#bfff00', player: '#ccff00', live: '#ccff00' },
                blueberry:    { bg: 'rgba(10, 15, 30, 0.95)', border: '#4682b4', player: '#b0e0e6', live: '#b0e0e6' },
                violet:       { bg: 'rgba(15, 5, 30, 0.95)', border: '#8a2be2', player: '#dda0dd', live: '#dda0dd' },
                coral:        { bg: 'rgba(30, 15, 15, 0.95)', border: '#ff7f50', player: '#ffa07a', live: '#ffa07a' },
                copper:       { bg: 'rgba(25, 15, 10, 0.95)', border: '#b87333', player: '#deb887', live: '#deb887' },
                steel:        { bg: 'rgba(20, 25, 30, 0.95)', border: '#4682b4', player: '#b0c4de', live: '#b0c4de' },
                off:          { bg: 'rgba(8, 12, 20, 0.9)', border: '#ff3333', player: '#4ade80', live: '#3b82f6' }
            };

            let activeThemeKey = theme;
            if (theme === 'leaderboard-match' && shadowRoot) {
                const globalThemeSelect = shadowRoot.getElementById('select-theme-style');
                if (globalThemeSelect && globalThemeSelect.value) {
                    activeThemeKey = globalThemeSelect.value;
                } else {
                    activeThemeKey = 'neon'; // القيمة الافتراضية للثيم المطابق لكي لا يحدث خطأ
                }
            }

            const t = themesMap[activeThemeKey] || themesMap['neon'];

            radarContainer.style.background = t.bg;
            radarContainer.style.border = `3px solid ${t.border}`;
            radarContainer.style.boxShadow = `0 0 20px ${t.border}`;
            centerDot.style.background = t.player;
            radarBoundsPath.setAttribute("stroke", t.border);

            return t.live;
        }

        setInterval(() => {
            const hostElem = document.getElementById('menu-host');
            const shadow = hostElem && hostElem.shadowRoot ? hostElem.shadowRoot : null;
            const chkRadar = shadow ? shadow.getElementById('chk-enable-radar-map') : null;
            const themeSelect = shadow ? shadow.getElementById('select-radar-theme') : null;
            
            const radarChecked = chkRadar ? chkRadar.checked : false;
            
            if (themeSelect) {
                themeSelect.disabled = !radarChecked;
            }

            const currentTheme = themeSelect ? themeSelect.value : 'leaderboard-match';

            radarContainer.style.display = radarChecked ? 'block' : 'none';
            let activeLiveColor = applyRadarTheme(currentTheme, shadow);

            while (liveLayer.firstChild) liveLayer.firstChild.remove();
            while (memoryLayer.firstChild) memoryLayer.firstChild.remove();

            if (!radarChecked) {
                currentFrameNodes.clear();
                return;
            }

            if (camState) {
                const radarRadius = 90;
                const scale = 0.08;
                const playerWorldX = -camState.translateX / camState.scale + (window.innerWidth / 2) / camState.scale;
                const playerWorldY = -camState.translateY / camState.scale + (window.innerHeight / 2) / camState.scale;

                worldMemory.forEach((node, key) => {
                    let dx = (node.wx - playerWorldX) * camState.scale * scale;
                    let dy = (node.wy - playerWorldY) * camState.scale * scale;
                    let distFromCenter = Math.hypot(node.wx - playerWorldX, node.wy - playerWorldY);
                    
                    if (distFromCenter < (window.innerWidth / (2 * camState.scale)) && !currentFrameNodes.has(key)) {
                        worldMemory.delete(key);
                        nodeHistoryTracker.delete(key);
                        return;
                    }

                    let radarDistance = Math.hypot(dx, dy);
                    if (radarDistance < radarRadius - 2) {
                        const dot = document.createElement('div');
                        let dotSize = Math.max(2, node.r * 0.07);
                        let dotColor = '#ff6666';

                        dot.style.cssText = `
                            position: absolute;
                            left: ${radarRadius + dx - (dotSize / 2)}px;
                            top: ${radarRadius + dy - (dotSize / 2)}px;
                            width: ${dotSize}px;
                            height: ${dotSize}px;
                            background: ${dotColor};
                            border-radius: 50%;
                            z-index: 1;
                        `;
                        memoryLayer.appendChild(dot);
                    }
                });

                currentFrameNodes.forEach((node, key) => {
                    let dx = (node.wx - playerWorldX) * camState.scale * scale;
                    let dy = (node.wy - playerWorldY) * camState.scale * scale;
                    let radarDistance = Math.hypot(dx, dy);

                    if (radarDistance < radarRadius - 2) {
                        const dot = document.createElement('div');
                        let dotSize = Math.min(12, Math.max(3, node.r * 0.08));

                        dot.style.cssText = `
                            position: absolute;
                            left: ${radarRadius + dx - (dotSize / 2)}px;
                            top: ${radarRadius + dy - (dotSize / 2)}px;
                            width: ${dotSize}px;
                            height: ${dotSize}px;
                            background: ${activeLiveColor};
                            border: 0.5px solid rgba(255,255,255,0.8);
                            border-radius: 50%;
                            z-index: 2;
                        `;
                        liveLayer.appendChild(dot);
                    }
                });

                currentFrameNodes.clear();

                const hasVal = stableB.minX !== null && stableB.maxX !== null && stableB.minY !== null && stableB.maxY !== null;
                if (hasVal && (Date.now() - lastCamTime < 2000)) {
                    try {
                        let bMinX = radarRadius + (stableB.minX - playerWorldX) * camState.scale * scale;
                        let bMaxX = radarRadius + (stableB.maxX - playerWorldX) * camState.scale * scale;
                        let bMinY = radarRadius + (stableB.minY - playerWorldY) * camState.scale * scale;
                        let bMaxY = radarRadius + (stableB.maxY - playerWorldY) * camState.scale * scale;

                        radarBoundsPath.setAttribute("d", `M ${bMinX} ${bMinY} L ${bMaxX} ${bMinY} L ${bMaxX} ${bMaxY} L ${bMinX} ${bMaxY} Z`);
                    } catch (e) {
                        radarBoundsPath.setAttribute("d", "");
                    }
                }
            }
        }, 20);

    } catch (ex) {
        console.error("Radar Error:", ex);
    }
})();
