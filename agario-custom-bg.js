(function() {
    'use strict';
    try {
        console.log("Ultra Custom Background & Grid: التشغيل النهائي لتصحيح لون الشبكة...");

        let customImage = null;

        function getRgbaColor(hex, alpha) {
            let c = hex.replace('#', '');
            if (c.length === 3) c = c.split('').map(x => x + x).join('');
            let num = parseInt(c, 16);
            return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
        }

        function updateBgTypeVisibility(shadow, val) {
            const groupColor = shadow.getElementById('group-bg-color');
            const groupUrl = shadow.getElementById('group-bg-url');
            const groupFile = shadow.getElementById('group-bg-file');

            if (groupColor) groupColor.style.display = (val === 'solid') ? 'flex' : 'none';
            if (groupUrl) groupUrl.style.display = (val === 'url') ? 'flex' : 'none';
            if (groupFile) groupFile.style.display = (val === 'file') ? 'flex' : 'none';
        }

        // دالة لتفعيل أو تعطيل باقي عناصر القائمة بناءً على حالة زر التفعيل الرئيسي
        function updateElementsState(shadow, isEnabled) {
            const elementsToToggle = [
                'select-bg-type',
                'input-bg-color',
                'input-bg-url',
                'input-bg-file',
                'input-grid-color',
                'range-grid-opacity',
                'range-grid-size',
                'range-grid-thickness'
            ];

            elementsToToggle.forEach(id => {
                const el = shadow.getElementById(id);
                if (el) {
                    el.disabled = !isEnabled;
                    // إضافة تأثير بصري اختياري (شفافية خفيفة عند التعطيل)
                    el.style.opacity = isEnabled ? '1' : '0.5';
                    el.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
                }
            });
        }

        function loadSavedSettings(shadow) {
            if (!shadow) return;
            
            const chk = shadow.getElementById('chk-enable-custom-bg');
            const selectType = shadow.getElementById('select-bg-type');
            const inputColor = shadow.getElementById('input-bg-color');
            const inputUrl = shadow.getElementById('input-bg-url');
            const inputGridColor = shadow.getElementById('input-grid-color');
            const rangeOpacity = shadow.getElementById('range-grid-opacity');
            const rangeSize = shadow.getElementById('range-grid-size');
            const rangeThickness = shadow.getElementById('range-grid-thickness');
            
            const spanOpacityVal = shadow.getElementById('span-grid-opacity-val');
            const spanSizeVal = shadow.getElementById('span-grid-size-val');
            const spanThicknessVal = shadow.getElementById('span-grid-thickness-val');

            let isEnabled = false;
            if (chk && localStorage.getItem('custom_bg_enabled') !== null) {
                isEnabled = localStorage.getItem('custom_bg_enabled') === 'true';
                chk.checked = isEnabled;
            }
            
            // تطبيق حالة التعطيل/التفعيل عند التحميل
            updateElementsState(shadow, isEnabled);
            
            if (selectType) {
                const savedType = localStorage.getItem('custom_bg_type') || 'solid';
                selectType.value = savedType;
                updateBgTypeVisibility(shadow, savedType);
            }

            if (inputColor && localStorage.getItem('custom_bg_color')) {
                inputColor.value = localStorage.getItem('custom_bg_color');
            }

            if (inputUrl && localStorage.getItem('custom_bg_url')) {
                inputUrl.value = localStorage.getItem('custom_bg_url');
                if (inputUrl.value) {
                    customImage = new Image();
                    customImage.crossOrigin = "anonymous";
                    customImage.src = inputUrl.value;
                }
            }

            if (inputGridColor && localStorage.getItem('custom_grid_color')) {
                inputGridColor.value = localStorage.getItem('custom_grid_color');
            }

            if (rangeOpacity && localStorage.getItem('custom_grid_opacity')) {
                rangeOpacity.value = localStorage.getItem('custom_grid_opacity');
                if (spanOpacityVal) spanOpacityVal.innerText = rangeOpacity.value;
            }

            if (rangeSize && localStorage.getItem('custom_grid_size')) {
                rangeSize.value = localStorage.getItem('custom_grid_size');
                if (spanSizeVal) spanSizeVal.innerText = rangeSize.value;
            }

            if (rangeThickness && localStorage.getItem('custom_grid_thickness')) {
                rangeThickness.value = localStorage.getItem('custom_grid_thickness');
                if (spanThicknessVal) spanThicknessVal.innerText = rangeThickness.value;
            }
        }

        if (!window._origFillRectCustom) {
            window._origFillRectCustom = CanvasRenderingContext2D.prototype.fillRect;
        }

        function bindMenuEvents() {
            const hostElem = document.getElementById('menu-host');
            if (!hostElem || !hostElem.shadowRoot) {
                setTimeout(bindMenuEvents, 200);
                return;
            }

            const shadow = hostElem.shadowRoot;
            loadSavedSettings(shadow);

            shadow.addEventListener('change', (e) => {
                const targetId = e.target.id;

                if (targetId === 'chk-enable-custom-bg') {
                    const isChecked = e.target.checked;
                    localStorage.setItem('custom_bg_enabled', isChecked);
                    updateElementsState(shadow, isChecked); // تحديث حالة العناصر فور التغيير
                }
                if (targetId === 'select-bg-type') {
                    const val = e.target.value;
                    localStorage.setItem('custom_bg_type', val);
                    updateBgTypeVisibility(shadow, val);
                }
                if (targetId === 'input-bg-color') {
                    localStorage.setItem('custom_bg_color', e.target.value);
                }
                if (targetId === 'input-grid-color') {
                    localStorage.setItem('custom_grid_color', e.target.value);
                }
                if (targetId === 'input-bg-file') {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(evt) {
                            customImage = new Image();
                            customImage.src = evt.target.result;
                            localStorage.setItem('custom_bg_data_url', evt.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            });

            shadow.addEventListener('input', (e) => {
                const targetId = e.target.id;

                if (targetId === 'input-grid-color') {
                    localStorage.setItem('custom_grid_color', e.target.value);
                }
                if (targetId === 'range-grid-opacity') {
                    localStorage.setItem('custom_grid_opacity', e.target.value);
                    const spanVal = shadow.getElementById('span-grid-opacity-val');
                    if (spanVal) spanVal.innerText = e.target.value;
                }
                if (targetId === 'range-grid-size') {
                    localStorage.setItem('custom_grid_size', e.target.value);
                    const spanVal = shadow.getElementById('span-grid-size-val');
                    if (spanVal) spanVal.innerText = e.target.value;
                }
                if (targetId === 'range-grid-thickness') {
                    localStorage.setItem('custom_grid_thickness', e.target.value);
                    const spanVal = shadow.getElementById('span-grid-thickness-val');
                    if (spanVal) spanVal.innerText = e.target.value;
                }
                if (targetId === 'input-bg-url') {
                    const url = e.target.value;
                    localStorage.setItem('custom_bg_url', url);
                    if (url) {
                        customImage = new Image();
                        customImage.crossOrigin = "anonymous";
                        customImage.src = url;
                    }
                }
            });

            if (!customImage && localStorage.getItem('custom_bg_data_url')) {
                customImage = new Image();
                customImage.src = localStorage.getItem('custom_bg_data_url');
            }

            console.log("=== تم ربط أحداث الألوان والشبكة بنجاح! ===");
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bindMenuEvents);
        } else {
            bindMenuEvents();
        }

        CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
            const hostElem = document.getElementById('menu-host');
            const shadow = hostElem && hostElem.shadowRoot ? hostElem.shadowRoot : null;
            const chk = shadow ? shadow.getElementById('chk-enable-custom-bg') : null;
            
            const isEnabled = chk ? chk.checked : (localStorage.getItem('custom_bg_enabled') === 'true');

            if (isEnabled && w > 500 && h > 500) {
                const tr = this.getTransform();

                const bgType = shadow && shadow.getElementById('select-bg-type') ? shadow.getElementById('select-bg-type').value : (localStorage.getItem('custom_bg_type') || 'solid');
                const bgColor = shadow && shadow.getElementById('input-bg-color') ? shadow.getElementById('input-bg-color').value : (localStorage.getItem('custom_bg_color') || '#000000');
                
                const gridColorHex = shadow && shadow.getElementById('input-grid-color') ? shadow.getElementById('input-grid-color').value : (localStorage.getItem('custom_grid_color') || '#0066ff');
                
                const gridOpacity = shadow && shadow.getElementById('range-grid-opacity') ? parseFloat(shadow.getElementById('range-grid-opacity').value) : parseFloat(localStorage.getItem('custom_grid_opacity') || '0.4');
                const baseGridSize = shadow && shadow.getElementById('range-grid-size') ? parseFloat(shadow.getElementById('range-grid-size').value) : parseFloat(localStorage.getItem('custom_grid_size') || '50');
                const gridThickness = shadow && shadow.getElementById('range-grid-thickness') ? parseFloat(shadow.getElementById('range-grid-thickness').value) : parseFloat(localStorage.getItem('custom_grid_thickness') || '1.5');

                this.save();
                this.setTransform(1, 0, 0, 1, 0, 0);
                if (bgType === 'solid' || !customImage) {
                    this.fillStyle =bgColor;
                    window._origFillRectCustom.call(this, 0, 0, this.canvas.width, this.canvas.height);
                } else if (customImage && customImage.complete) {
                    this.drawImage(customImage, 0, 0, this.canvas.width, this.canvas.height);
                }
                this.restore();

                if (gridOpacity > 0) {
                    this.save();
                    this.setTransform(1, 0, 0, 1, 0, 0);
                    this.strokeStyle = getRgbaColor(gridColorHex, gridOpacity);
                    this.lineWidth = gridThickness;

                    const gridSize = baseGridSize * (tr.a > 0 ? tr.a : 1);
                    const offsetX = tr.e % gridSize;
                    const offsetY = tr.f % gridSize;

                    this.beginPath();
                    for (let xGrid = offsetX; xGrid <= this.canvas.width; xGrid += gridSize) {
                        this.moveTo(xGrid, 0);
                        this.lineTo(xGrid, this.canvas.height);
                    }
                    for (let yGrid = offsetY; yGrid <= this.canvas.height; yGrid += gridSize) {
                        this.moveTo(0, yGrid);
                        this.lineTo(this.canvas.width, yGrid);
                    }
                    this.stroke();
                    this.restore();
                }

                return;
            }
            return window._origFillRectCustom.apply(this, arguments);
        };
    } catch (ex) {
        console.error("Custom Menu Settings Error:", ex);
    }
})();
