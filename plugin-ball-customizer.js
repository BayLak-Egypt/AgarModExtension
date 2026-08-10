;(function() {
    'use strict';
    console.log("Ball Customizer: تفعيل الالتقاط الشامل لكل الأحجام والزووم...");

    if (!window._originalFillBall) {
        window._originalFillBall = CanvasRenderingContext2D.prototype.fill;
        window._originalArcBall = CanvasRenderingContext2D.prototype.arc;
    }

    let isDrawingCircle = false;
    let rgbHue = 0;

    // التقاط أي عملية رسم دائرة أو كرة بغض النظر عن الحجم أو الزووم
    CanvasRenderingContext2D.prototype.arc = function(x, y, radius, startAngle, endAngle, counterclockwise) {
        const host = document.getElementById('menu-host');
        const isEnabled = host && host.shadowRoot && host.shadowRoot.getElementById('chk-enable-ball-custom')?.checked;

        if (isEnabled) {
            isDrawingCircle = true;
        } else {
            isDrawingCircle = false;
        }
        return window._originalArcBall.apply(this, arguments);
    };

    CanvasRenderingContext2D.prototype.fill = function() {
        const host = document.getElementById('menu-host');
        if (host && host.shadowRoot) {
            const isEnabled = host.shadowRoot.getElementById('chk-enable-ball-custom')?.checked;
            const isRgbChecked = host.shadowRoot.getElementById('chk-rgb-effect')?.checked;
            const colorInput = host.shadowRoot.getElementById('txt-ball-color');

            if (isEnabled && isDrawingCircle) {
                if (isRgbChecked) {
                    rgbHue = (rgbHue + 0.1) % 360;
                    this.fillStyle = `hsl(${rgbHue}, 35%, 50%)`;
                } else if (colorInput) {
                    let val = colorInput.value ? colorInput.value.trim() : '';
                    this.fillStyle = val !== '' ? val : '#ff3333';
                }
            }
        }
        isDrawingCircle = false;
        return window._originalFillBall.apply(this, arguments);
    };

    if (window._ballInterval) clearInterval(window._ballInterval);
    window._ballInterval = setInterval(() => {
        const host = document.getElementById('menu-host');
        if (!host || !host.shadowRoot) return;

        const chkEnable = host.shadowRoot.getElementById('chk-enable-ball-custom');
        const colorInput = host.shadowRoot.getElementById('txt-ball-color');
        const chkRgb = host.shadowRoot.getElementById('chk-rgb-effect');

        const isEnabled = chkEnable ? chkEnable.checked : false;

        if (colorInput && (!colorInput.value || colorInput.value.trim() === '')) {
            colorInput.value = '#ff3333';
        }

        if (colorInput) {
            colorInput.disabled = !isEnabled;
            colorInput.style.opacity = isEnabled ? '1' : '0.4';
            colorInput.style.cursor = isEnabled ? 'text' : 'not-allowed';
        }
        if (chkRgb) {
            const rgbContainer = chkRgb.closest('label') || chkRgb.parentElement;
            if (rgbContainer) {
                rgbContainer.style.opacity = isEnabled ? '1' : '0.4';
                rgbContainer.style.pointerEvents = isEnabled ? 'auto' : 'none';
            }
        }
    }, 150);

    console.log("✅ تم التحديث بنجاح ليشمل كل الأحجام والزووم.");
})();
