;(function() {
    'use strict';
    try {
        console.log("Ultra Map Bounds: بدء التشغيل بدون إحداثيات...");

        if (window._ultraMapContainer_v5) {
            window._ultraMapContainer_v5.remove();
        }

        const container = document.createElement('div');
        container.id = 'agar-ultra-smart-container-v5';
        container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 999999; display: none;';
        document.body.appendChild(container);
        window._ultraMapContainer_v5 = container;

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.style.cssText = 'position: absolute; width: 100%; height: 100%;';
        container.appendChild(svg);

        const borderPath = document.createElementNS(svgNS, "path");
        borderPath.setAttribute("fill", "none");
        borderPath.setAttribute("stroke", "#ff3300");
        borderPath.setAttribute("stroke-width", "4");
        svg.appendChild(borderPath);

        let mapB = { minX: null, maxX: null, minY: null, maxY: null };
        let stableB = { minX: null, maxX: null, minY: null, maxY: null };
        let camState = null;
        let lastCamTime = Date.now();

        if (!window._origArcV5) {
            window._origArcV5 = CanvasRenderingContext2D.prototype.arc;
        }

        CanvasRenderingContext2D.prototype.arc = function(x, y, radius, startAngle, endAngle, counterclockwise) {
            if (radius > 0.2 && radius < 1000) {
                try {
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

                    let tr = this.getTransform();
                    if (tr && tr.a > 0) {
                        camState = { scale: tr.a, translateX: tr.e, translateY: tr.f };
                        lastCamTime = Date.now();
                    }
                } catch (e) {}
            }
            return window._origArcV5.call(this, x, y, radius, startAngle, endAngle, counterclockwise);
        };

        function updateView(show) {
            container.style.display = show ? 'block' : 'none';
        }

        setInterval(() => {
            const hostElem = document.getElementById('menu-host');
            const chk = hostElem && hostElem.shadowRoot ? hostElem.shadowRoot.getElementById('chk-enable-map-bounds') : null;
            const isChecked = chk ? chk.checked : false;

            updateView(isChecked);
            if (!isChecked) return;

            const hasVal = stableB.minX !== null && stableB.maxX !== null && stableB.minY !== null && stableB.maxY !== null;

            if (hasVal && camState && (Date.now() - lastCamTime < 2000)) {
                try {
                    const { scale, translateX, translateY } = camState;
                    const minX = stableB.minX * scale + translateX;
                    const maxX = stableB.maxX * scale + translateX;
                    const minY = stableB.minY * scale + translateY;
                    const maxY = stableB.maxY * scale + translateY;

                    borderPath.setAttribute("d", `M ${minX} ${minY} L ${maxX} ${minY} L ${maxX} ${maxY} L ${minX} ${maxY} Z`);
                } catch (err) {}
            }
        }, 15);

        const _unique_map_bound_binder_x99 = setInterval(() => {
            const hostElem = document.getElementById('menu-host');
            if (hostElem && hostElem.shadowRoot) {
                const chk = hostElem.shadowRoot.getElementById('chk-enable-map-bounds');
                if (chk) {
                    updateView(chk.checked);
                    chk.addEventListener('change', (e) => updateView(e.target.checked));
                    clearInterval(_unique_map_bound_binder_x99);
                }
            }
        }, 500);

    } catch (ex) {
        console.error("UltraMap Error:", ex);
    }
})();
