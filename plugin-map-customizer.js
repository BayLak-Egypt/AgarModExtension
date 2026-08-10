;(function() {
    'use strict';
    console.log("Map Customizer: تشغيل زر عكس الألوان...");

    if (!window._originalStrokeMap) {
        window._originalStrokeMap = CanvasRenderingContext2D.prototype.stroke;
    }

    CanvasRenderingContext2D.prototype.stroke = function() {
        const host = document.getElementById('menu-host');
        const isInvertChecked = host && host.shadowRoot && host.shadowRoot.getElementById('chk-invert-colors')?.checked;

        if (isInvertChecked) {
            this.strokeStyle = '#555555';
            this.lineWidth = 1.2;
        }
        return window._originalStrokeMap.apply(this, arguments);
    };

    let bgLayer = document.getElementById('custom-bg-layer');
    if (!bgLayer) {
        bgLayer = document.createElement('div');
        bgLayer.id = 'custom-bg-layer';
        bgLayer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none;';
        document.body.appendChild(bgLayer);
    }

    if (window._mapCustomInterval) clearInterval(window._mapCustomInterval);
    window._mapCustomInterval = setInterval(() => {
        const host = document.getElementById('menu-host');
        if (!host || !host.shadowRoot) return;

        const chk = host.shadowRoot.getElementById('chk-invert-colors');
        const isInvertChecked = chk ? chk.checked : false;

        const canvas = document.getElementById('canvas');

        if (isInvertChecked) {
            if (bgLayer) {
                bgLayer.style.backgroundColor = '#000000';
            }
            if (canvas) {
                canvas.style.backgroundColor = '#000000';
                canvas.style.filter = 'invert(1) hue-rotate(180deg) contrast(120%)';
            }
        } else {
            if (bgLayer) {
                bgLayer.style.backgroundColor = '';
            }
            if (canvas) {
                canvas.style.backgroundColor = '';
                canvas.style.filter = 'none';
            }
        }
    }, 100);

    console.log("✅ تم تجهيز بلجن عكس الألوان بنجاح.");
})();
