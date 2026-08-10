(function() {
    'use strict';
    let pluginEnabled = false;
    let sliderOpacity = 70;

    window.addEventListener('message', (e) => {
        if (e.data?.type === 'MENU_MOD_UPDATE') {
            pluginEnabled = e.data.enabled;
            sliderOpacity = e.data.opacity;
        }
    });

    function initHelperLines() {
        if (!document.body) {
            setTimeout(initHelperLines, 50);
            return;
        }

        if (document.getElementById('agar-helper-lines-container')) return;

        const container = document.createElement('div');
        container.id = 'agar-helper-lines-container';
        container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 999999;';
        document.body.appendChild(container);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.cssText = 'width: 100%; height: 100%; position: absolute;';
        container.appendChild(svg);

        const dot = document.createElement('div');
        dot.style.cssText = 'position: absolute; left: 50%; top: 50%; width: 12px; height: 12px; background: #ff3333; border: 2px solid #fff; border-radius: 50%; transform: translate(-50%, -50%); display: none; z-index: 1000000;';
        container.appendChild(dot);

        if (!window._originalArcHelper) {
            window._originalArcHelper = CanvasRenderingContext2D.prototype.arc;
        }

        let nodes = [];

        CanvasRenderingContext2D.prototype.arc = function(x, y, r, sa, ea, cc) {
            if (pluginEnabled && r > 5 && r < 300) {
                try {
                    const tr = this.getTransform();
                    if (tr && tr.a > 0) {
                        const sx = x * tr.a + y * tr.c + tr.e;
                        const sy = x * tr.b + tr.d * y + tr.f;
                        if (sx >= 0 && sx <= window.innerWidth && sy >= 0 && sy <= window.innerHeight) {
                            nodes.push({x: sx, y: sy});
                        }
                    }
                } catch (e) {}
            }
            return window._originalArcHelper.call(this, x, y, r, sa, ea, cc);
        };

        setInterval(() => {
            while (svg.firstChild) svg.removeChild(svg.firstChild);
            
            const oldBoxes = container.querySelectorAll('.helper-box');
            oldBoxes.forEach(b => b.remove());

            if (!pluginEnabled) {
                dot.style.display = 'none';
                nodes = [];
                return;
            }

            dot.style.display = 'block';
            const cx = window.innerWidth / 2, cy = window.innerHeight / 2;

            nodes.forEach(n => {
                if (Math.hypot(n.x - cx, n.y - cy) > 20) {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", cx);
                    line.setAttribute("y1", cy);
                    line.setAttribute("x2", n.x);
                    line.setAttribute("y2", n.y);
                    line.setAttribute("stroke", `rgba(74, 222, 128, ${sliderOpacity / 100})`);
                    line.setAttribute("stroke-width", "2");
                    svg.appendChild(line);

                    const box = document.createElement('div');
                    box.className = 'helper-box';
                    box.style.cssText = `position: absolute; left: ${n.x - 7}px; top: ${n.y - 7}px; width: 14px; height: 14px; border: 2px solid #ff5050; background-color: rgba(255, 80, 80, 0.6);`;
                    container.appendChild(box);
                }
            });
            nodes = [];
        }, 15);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHelperLines);
    } else {
        initHelperLines();
    }
})();
