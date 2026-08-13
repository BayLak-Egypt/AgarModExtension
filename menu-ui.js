(function() {
    'use strict';
    if (document.getElementById('menu-host')) return;

    let currentLang = localStorage.getItem('menu_lang') || 'en';
    let allTranslations = {};

    async function loadTranslations() {
        try {
            const url = chrome.runtime.getURL('lang.json');
            const res = await fetch(url);
            allTranslations = await res.json();
            updateUITexts();
        } catch (e) {
            console.error('Failed to load lang.json:', e);
        }
    }

    function updateUITexts() {
        const shadow = document.getElementById('menu-host')?.shadowRoot;
        if (!shadow || !allTranslations[currentLang]) return;

        const langData = allTranslations[currentLang];
        shadow.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (langData[key]) {
                el.textContent = langData[key];
            }
        });

        const flagBtn = shadow.getElementById('lang-flag-btn');
        if (flagBtn) {
            flagBtn.textContent = currentLang === 'ar' ? '🇺🇸 EN' : '🇪🇬 AR';
            flagBtn.title = currentLang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية';
        }
    }

    const plugins = [
        'plugin-helper-lines.js', 
        'plugin-adsblock.js', 
        'plugin-mapbounds.js',
        'plugin-ball-customizer.js',
        'plugin-map-customizer.js',
        'plugin-leaderboard.js',
        'plugin-radar-map.js',
        'agario-custom-bg.js'
    ];
    plugins.forEach(src => {
        const s = document.createElement('script');
        s.src = chrome.runtime.getURL(src);
        (document.head || document.documentElement).appendChild(s);
    });

    const host = document.createElement('div');
    host.id = 'menu-host';
    host.style.cssText = 'position: fixed; z-index: 2147483647; top: 0; left: 0; width: 0; height: 0; pointer-events: none;';
    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({mode: 'open'});
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rgbBorder {
            0% { border-color: #ff0000; box-shadow: 0 0 15px rgba(255, 0, 0, 0.5); }
            33% { border-color: #00ff00; box-shadow: 0 0 15px rgba(0, 255, 0, 0.5); }
            66% { border-color: #0000ff; box-shadow: 0 0 15px rgba(0, 0, 155, 0.5); }
            100% { border-color: #ff0000; box-shadow: 0 0 15px rgba(255, 0, 0, 0.5); }
        }
        * { box-sizing: border-box; font-family: Tahoma, sans-serif; }
        #my-custom-menu {
            position: fixed; top: 50px; left: 20px; width: 320px; min-width: 320px;
            background-color: rgba(8, 12, 20, 0.95); backdrop-filter: blur(10px);
            color: #ffffff; border: 2px solid #4ade80; border-radius: 14px; padding: 18px;
            z-index: 2147483647; animation: rgbBorder 6s infinite linear;
            max-height: 85vh; overflow-y: auto; pointer-events: auto; display: none;
        }
        #my-custom-menu::-webkit-scrollbar { width: 8px; }
        #my-custom-menu::-webkit-scrollbar-track { background: rgba(5, 7, 12, 0.8); border-radius: 4px; }
        #my-custom-menu::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 4px; border: 2px solid rgba(5, 7, 12, 0.8); }
        #my-custom-menu::-webkit-scrollbar-thumb:hover { background: #4ade80; }

        #floating-icon {
            position: fixed; top: 50px; left: 20px; width: 50px; height: 50px;
            background-color: rgba(8, 12, 20, 0.95); backdrop-filter: blur(5px);
            border: 2px solid #4ade80; border-radius: 50%; z-index: 2147483647;
            display: flex; cursor: pointer; align-items: center; justify-content: center;
            animation: rgbBorder 6s infinite linear; color: #ffffff;
            pointer-events: auto; user-select: none; overflow: hidden;
        }
        #floating-icon img { width: 70%; height: 70%; object-fit: contain; pointer-events: none; }
        #floating-icon:hover { transform: scale(1.1); }
        
        .header-container { display: flex; justify-content: space-between; align-items: center; cursor: move; margin-bottom: 8px; }
        .header-left { display: flex; align-items: center; gap: 8px; }
        h2 { font-size: 14px; color: #ffffff; font-weight: bold; margin: 0; white-space: nowrap; }
        
        #lang-flag-btn {
            background-color: #0f172a; color: #38bdf8; border: 1px solid #38bdf8;
            border-radius: 6px; padding: 3px 8px; font-size: 12px; font-weight: bold; cursor: pointer;
            pointer-events: auto !important; transition: all 0.2s; display: flex; align-items: center; gap: 4px;
        }
        #lang-flag-btn:hover { background-color: rgba(56, 189, 248, 0.2); transform: scale(1.05); }

        .minimize-btn { background: transparent; border: none; color: #38bdf8; font-size: 20px; cursor: pointer; font-weight: bold; padding: 0 8px; }
        .minimize-btn:hover { color: #ffffff; }
        hr { border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 10px 0 15px 0; }
        p { font-size: 11px; text-align: center; color: #64748b; margin-top: 12px; margin-bottom: 0; }
        button, input, select, label { pointer-events: auto; cursor: pointer; }

        .section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .section-title svg {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
        }

        #about-modal {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(8, 12, 20, 0.98); backdrop-filter: blur(15px);
            border-radius: 12px; padding: 20px; display: none; flex-direction: column;
            justify-content: space-between; z-index: 2147483648; box-sizing: border-box;
        }
        .about-header { display: flex; justify-content: space-between; align-items: center; cursor: move; }
        .close-about-btn {
            background: rgba(255, 255, 255, 0.1); border: none; color: #ffffff; 
            width: 28px; height: 28px; border-radius: 50%; font-size: 14px; 
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s; pointer-events: auto !important;
        }
        .close-about-btn:hover { background: rgba(255, 0, 0, 0.6); }
        .about-content { text-align: center; margin: auto 0; }
        .social-links {
            display: flex; justify-content: center; gap: 12px; margin-top: 15px; flex-wrap: wrap;
        }
        .social-btn {
            width: 38px; height: 38px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center;
            color: #ffffff; text-decoration: none; transition: all 0.2s;
            pointer-events: auto !important;
        }
        .social-btn img {
            width: 20px; height: 20px; object-fit: contain;
            transition: filter 0.2s ease;
        }
        .social-btn:hover { transform: scale(1.1); background-color: rgba(56, 189, 248, 0.2); border-color: #38bdf8; }
        .social-btn:hover img {
            filter: brightness(0) invert(1);
        }
        
        .about-logo-container {
            width: 80px; height: 80px; margin: 0 auto 12px auto; display: flex;
            align-items: center; justify-content: center; border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .about-logo-container img {
            width: 75%; height: 75%; object-fit: contain; pointer-events: none;
        }

        #btn-about-trigger {
            width: 100%; min-height: 38px; padding: 10px; margin-top: 15px;
            background-color: rgba(255, 255, 255, 0.05); color: #38bdf8;
            border: 1px dashed rgba(56, 189, 248, 0.4); border-radius: 6px;
            cursor: pointer; font-size: 13px; font-weight: bold; transition: all 0.2s; pointer-events: auto !important;
            display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        #btn-about-trigger:hover { background-color: rgba(56, 189, 248, 0.15); border-color: #38bdf8; }
        #btn-about-trigger svg { width: 16px; height: 16px; }

        .extra-action-btns {
            display: flex; gap: 8px; margin-top: 12px; justify-content: center;
        }
        .extra-btn {
            flex: 1; padding: 8px 10px; font-size: 11px; font-weight: bold; border-radius: 6px;
            text-decoration: none; text-align: center; transition: all 0.2s; pointer-events: auto !important;
            display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        }
        .extra-btn svg { width: 14px; height: 14px; }
        
        .blog-btn {
            background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.4);
        }
        .blog-btn:hover { background-color: rgba(59, 130, 246, 0.3); border-color: #3b82f6; color: #fff; }
        
        .donate-btn {
            background-color: rgba(74, 222, 128, 0.15); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.4);
        }
        .donate-btn:hover { background-color: rgba(74, 222, 128, 0.3); border-color: #4ade80; color: #fff; }
    `;
    shadow.appendChild(style);

    const floatingIcon = document.createElement('div');
    floatingIcon.id = 'floating-icon';
    const logoImg = document.createElement('img');
    logoImg.src = chrome.runtime.getURL('logo.png');
    logoImg.alt = 'Logo';
    floatingIcon.appendChild(logoImg);
    shadow.appendChild(floatingIcon);

    const menu = document.createElement('div');
    menu.id = 'my-custom-menu';
    menu.innerHTML = `
        <div class="header-container" id="menu-header">
            <div class="header-left">
                <h2>Menu Mod - v1.1</h2>
                <button id="lang-flag-btn" title="Change Language">🇪🇬 AR</button>
            </div>
            <button class="minimize-btn" id="btn-minimize" title="Minimize">-</button>
        </div>
        <hr>
        
        
        
        
        
        
        
    
    
    
    

        <!-- قسم تخصيص الخريطة والشبكة -->
        <div style="border: 1px solid #3b82f6; border-radius: 10px; padding: 12px; margin-bottom: 14px; background-color: rgba(5, 7, 12, 0.65);">
            <div class="section-title" style="color: #3b82f6;">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 20h2.09l1.61-1.61C9.58 18.8 10.75 19 12 19c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
        
    <span data-i18n="map_custom">الخلفية والشبكة المخصصة</span>

      
    </div>
    
    <!-- زر التفعيل -->
    <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #cbd5e1;">
        <input id="chk-enable-custom-bg" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
        <label for="chk-enable-custom-bg" style="cursor: pointer;" data-i18n="enable_custom_bg">تفعيل الخلفية والشبكة</label>
    </div>

    <!-- نوع الخلفية -->
    <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 5px; font-size: 14px; color: #cbd5e1;">
        <label for="select-bg-type" style="font-size: 13px; color: #94a3b8;" data-i18n="bg_type_label">نوع الخلفية:</label>
        <select id="select-bg-type" style="background-color: #0f172a; color: #fff; border: 1px solid #3b82f6; border-radius: 6px; padding: 6px; cursor: pointer;">
            <option value="solid" data-i18n="bg_solid">لون / أسود</option>
            <option value="url" data-i18n="bg_url">رابط صورة (URL)</option>
            <option value="file" data-i18n="bg_file">رفع صورة من الجهاز</option>
        </select>
    </div>

    <!-- لون الخلفية الصلبة -->
    <div id="group-bg-color" style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: #cbd5e1;">
        <label for="input-bg-color" data-i18n="bg_color_label">لون الخلفية:</label>
        <input id="input-bg-color" type="color" value="#000000" style="cursor: pointer; background: none; border: none; width: 35px; height: 25px;">
        
    </div>

    <!-- رابط الصورة -->
    <div id="group-bg-url" style="margin-top: 10px; display: none; flex-direction: column; gap: 5px; font-size: 13px; color: #cbd5e1;">
        <label for="input-bg-url" data-i18n="bg_url_label">رابط الصورة:</label>
        <input id="input-bg-url" type="text" placeholder="https://example.com/image.jpg" style="width: 100%; padding: 6px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 4px;">
    </div>

    <!-- رفع صورة من الجهاز -->
    <div id="group-bg-file" style="margin-top: 10px; display: none; flex-direction: column; gap: 5px; font-size: 13px; color: #cbd5e1;">
        <label for="input-bg-file" data-i18n="bg_file_label">اختر صورة:</label>
        <input id="input-bg-file" type="file" accept="image/*" style="width: 100%; font-size: 11px; color: #94a3b8; cursor: pointer;">
    </div>

    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 10px 0;">

    <!-- لون الشبكة -->
    <div style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: #cbd5e1;">
        <label for="input-grid-color" data-i18n="grid_color_label">لون الشبكة:</label>
        <input id="input-grid-color" type="color" value="#0066ff" style="cursor: pointer; background: none; border: none; width: 35px; height: 25px;">
    </div>

    <!-- شفافية الشبكة -->
    <div style="margin-top: 10px; font-size: 13px; color: #94a3b8;">
        <span data-i18n="opacity">شفافية</span>: <span id="span-grid-opacity-val">0.4</span>
        <input id="range-grid-opacity" type="range" min="0" max="1" step="0.05" value="0.4" style="width: 100%; margin-top: 5px; accent-color: #3b82f6;">
    </div>

    <!-- حجم مربعات الشبكة -->
    <div style="margin-top: 10px; font-size: 13px; color: #94a3b8;">
        <span data-i18n="size-map">حجم المربعات</span>: <span id="span-grid-size-val">50</span>px
        <input id="range-grid-size" type="range" min="10" max="200" step="5" value="50" style="width: 100%; margin-top: 5px; accent-color: #3b82f6;">
    </div>

    <!-- تخانة خطوط الشبكة -->
    <div style="margin-top: 10px; font-size: 13px; color: #94a3b8;">
        <span data-i18n="size-line-map">حجم خطوط الشبكة</span>: <span id="span-grid-thickness-val">1.5</span>px
        <input id="range-grid-thickness" type="range" min="0.5" max="5" step="0.5" value="1.5" style="width: 100%; margin-top: 5px; accent-color: #3b82f6;">
    </div>
    
     <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 10px 0;">

    
     <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #cbd5e1;">
                <input id="chk-invert-colors" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
                <label for="chk-invert-colors" style="cursor: pointer;" data-i18n="invert_colors">عكس الألوان</label>
            </div>
    
     <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 10px 0;">
     
     
      <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #cbd5e1; margin-bottom: 10px;">
                <input id="chk-hide-leaderboard" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
                <label for="chk-hide-leaderboard" style="cursor: pointer;" data-i18n="hide_leaderboard">إخفاء لوحة الصدارة</label>
            </div>
            <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 5px; font-size: 14px; color: #cbd5e1;">
                <label for="select-theme-style" style="font-size: 13px; color: #94a3b8;" data-i18n="select_theme">اختر ثيم:</label>
                <select id="select-theme-style" style="background-color: #0f172a; color: #fff; border: 1px solid #3b82f6; border-radius: 6px; padding: 6px; cursor: pointer;">
                    <option value="off" data-i18n="theme_off">إيقاف اللوحة الجديدة</option>
                    <option value="neon" data-i18n="theme_neon">1. نيون متوهج (Cyber Neon)</option>
                    <option value="glass" data-i18n="theme_glass">2. عصري شفاف (Glassmorphism)</option>
                    <option value="minimal" data-i18n="theme_minimal">3. مينيمال بسيط (Minimalist)</option>
                    <option value="cyber-red" data-i18n="theme_cyber_red">4. سايبربانك أحمر (Cyberpunk Red)</option>
                    <option value="matrix" data-i18n="theme_matrix">5. أكسون أخضر (Matrix Green)</option>
                    <option value="gold" data-i18n="theme_gold">6. ذهبي فاخر (Royal Gold)</option>
                    <option value="silver" data-i18n="theme_silver">7. فضي معدني (Silver Metal)</option>
                    <option value="purple" data-i18n="theme_purple">8. أرجواني ملكي (Royal Purple)</option>
                    <option value="ocean" data-i18n="theme_ocean">9. أزرق محيطي (Ocean Blue)</option>
                    <option value="lavender" data-i18n="theme_lavender">10. لافندر ناعم (Soft Lavender)</option>
                    <option value="sunset" data-i18n="theme_sunset">11. غروب الشمس (Sunset Gradient)</option>
                    <option value="aurora" data-i18n="theme_aurora">12. شفق قطبي (Aurora Borealis)</option>
                    <option value="volcano" data-i18n="theme_volcano">13. بركان ملتهب (Volcanic Lava)</option>
                    <option value="space" data-i18n="theme_space">14. فضاء عميق (Deep Space)</option>
                    <option value="emerald" data-i18n="theme_emerald">15. جاردن أخضر (Emerald Garden)</option>
                    <option value="pink" data-i18n="theme_pink">16. وردي سكري (Bubblegum Pink)</option>
                    <option value="cappuccino" data-i18n="theme_cappuccino">17. كابتشينو دافئ (Warm Cappuccino)</option>
                    <option value="carbon" data-i18n="theme_carbon">18. كربون داكن (Dark Carbon)</option>
                    <option value="white" data-i18n="theme_white">19. أبيض ناصع (Pure White)</option>
                    <option value="retro" data-i18n="theme_retro">20. ريترو أركيد (Retro Arcade)</option>
                    <option value="halloween" data-i18n="theme_halloween">21. هالوين برتقالي (Halloween Orange)</option>
                    <option value="turquoise" data-i18n="theme_turquoise">22. تركواز منعش (Turquoise Breeze)</option>
                    <option value="sapphire" data-i18n="theme_sapphire">23. ياقوتي أزرق (Sapphire Blue)</option>
                    <option value="jade" data-i18n="theme_jade">24. يشم أخضر (Jade Green)</option>
                    <option value="amber" data-i18n="theme_amber">25. عنبري دافئ (Amber Glow)</option>
                    <option value="lime" data-i18n="theme_lime">26. ليموني ساطع (Lime Electric)</option>
                    <option value="blueberry" data-i18n="theme_blueberry">27. توت أزرق (Blueberry Night)</option>
                    <option value="violet" data-i18n="theme_violet">28. بنفسجي داكن (Deep Violet)</option>
                    <option value="coral" data-i18n="theme_coral">29. مرجاني جذاب (Coral Reef)</option>
                    <option value="copper" data-i18n="theme_copper">30. نحاسي عتيق (Antique Copper)</option>
                    <option value="steel" data-i18n="theme_steel">31. فولاذي بارد (Cold Steel)</option>
                </select>
            </div>
     
     
        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 10px 0;">
     
     
    <!-- زر تفعيل خريطة الرادار -->
    <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #cbd5e1;">
        <input id="chk-enable-radar-map" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
        <label for="chk-enable-radar-map" style="cursor: pointer;" data-i18n="enable_radar">تفعيل خريطة الرادار المصغرة</label>
    </div>

    <!-- قائمة اختيار الثيمات المستقلة للرادار -->
    <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: #cbd5e1;">
        <label for="select-radar-theme" style="font-size: 13px; color: #94a3b8;" data-i18n="radar_theme_label">ثيم خريطة الرادار:</label>
        <select id="select-radar-theme" style="background-color: #0f172a; color: #fff; border: 1px solid #3b82f6; border-radius: 6px; padding: 6px; cursor: pointer;">
            <option value="leaderboard-match" data-i18n="theme_leaderboard_match">مطابق لثيم قائمة الصدارة (Leaderboard)</option>
            <option value="neon" data-i18n="theme_neon">1. نيون متوهج (Cyber Neon)</option>
            <option value="glass" data-i18n="theme_glass">2. عصري شفاف (Glassmorphism)</option>
            <option value="minimal" data-i18n="theme_minimal">3. مينيمال بسيط (Minimalist)</option>
            <option value="cyber-red" data-i18n="theme_cyber_red">4. سايبربانك أحمر (Cyberpunk Red)</option>
            <option value="matrix" data-i18n="theme_matrix">5. أكسون أخضر (Matrix Green)</option>
            <option value="gold" data-i18n="theme_gold">6. ذهبي فاخر (Royal Gold)</option>
            <option value="silver" data-i18n="theme_silver">7. فضي معدني (Silver Metal)</option>
            <option value="purple" data-i18n="theme_purple">8. أرجواني ملكي (Royal Purple)</option>
            <option value="ocean" data-i18n="theme_ocean">9. أزرق محيطي (Ocean Blue)</option>
            <option value="lavender" data-i18n="theme_lavender">10. لافندر ناعم (Soft Lavender)</option>
            <option value="sunset" data-i18n="theme_sunset">11. غروب الشمس (Sunset Gradient)</option>
            <option value="aurora" data-i18n="theme_aurora">12. شفق قطبي (Aurora Borealis)</option>
            <option value="volcano" data-i18n="theme_volcano">13. بركان ملتهب (Volcanic Lava)</option>
            <option value="space" data-i18n="theme_space">14. فضاء عميق (Deep Space)</option>
            <option value="emerald" data-i18n="theme_emerald">15. جاردن أخضر (Emerald Garden)</option>
            <option value="pink" data-i18n="theme_pink">16. وردي سكري (Bubblegum Pink)</option>
            <option value="cappuccino" data-i18n="theme_cappuccino">17. كابتشينو دافئ (Warm Cappuccino)</option>
            <option value="carbon" data-i18n="theme_carbon">18. كربون داكن (Dark Carbon)</option>
            <option value="white" data-i18n="theme_white">19. أبيض ناصع (Pure White)</option>
            <option value="retro" data-i18n="theme_retro">20. ريترو أركيد (Retro Arcade)</option>
            <option value="halloween" data-i18n="theme_halloween">21. هالوين برتقالي (Halloween Orange)</option>
            <option value="turquoise" data-i18n="theme_turquoise">22. تركواز منعش (Turquoise Breeze)</option>
            <option value="sapphire" data-i18n="theme_sapphire">23. ياقوتي أزرق (Sapphire Blue)</option>
            <option value="jade" data-i18n="theme_jade">24. يشم أخضر (Jade Green)</option>
            <option value="amber" data-i18n="theme_amber">25. عنبري دافئ (Amber Glow)</option>
            <option value="lime" data-i18n="theme_lime">26. ليموني ساطع (Lime Electric)</option>
            <option value="blueberry" data-i18n="theme_blueberry">27. توت أزرق (Blueberry Night)</option>
            <option value="violet" data-i18n="theme_violet">28. بنفسجي داكن (Deep Violet)</option>
            <option value="coral" data-i18n="theme_coral">29. مرجاني جذاب (Coral Reef)</option>
            <option value="copper" data-i18n="theme_copper">30. نحاسي عتيق (Antique Copper)</option>
            <option value="steel" data-i18n="theme_steel">31. فولاذي بارد (Cold Steel)</option>
        </select>
    </div>
     
</div>
    
    
    
    
    







        <!-- قسم الكور -->
        <div style="border: 1px solid #10b981; border-radius: 10px; padding: 12px; margin-bottom: 14px; background-color: rgba(5, 7, 12, 0.65);">
        
        
            <div class="section-title" style="color: #10b981;">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                <span data-i18n="custom">تخصيص الكور</span>
            </div>
            <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #cbd5e1;">
                <input id="chk-enable-ball-custom" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
                <label for="chk-enable-ball-custom" style="cursor: pointer;" data-i18n="enable_ball">تفعيل تعديل ألوان الكور</label>
            </div>
            <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 5px; font-size: 13px; color: #cbd5e1;">
                <label for="txt-ball-color" data-i18n="ball_color">لون الكور الثابت</label>
                <input id="txt-ball-color" type="text" placeholder="#ff3333" value="#ff3333" style="width: 100%; padding: 6px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 4px;">
            </div>
            <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #cbd5e1;">
                <input id="chk-rgb-effect" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
                <label for="chk-rgb-effect" style="cursor: pointer;" data-i18n="rgb_effect">تأثير الألوان المتحركة (RGB)</label>
            </div>
                    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 10px 0;">
            
            
            <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #cbd5e1;">
                <input id="chk-enable-helper-lines" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
                <label for="chk-enable-helper-lines" style="cursor: pointer;" data-i18n="enable_helper">تفعيل خطوط التوصيل</label>
            </div>
            <div style="margin-top: 12px; font-size: 13px; color: #94a3b8;">
                <span data-i18n="opacity">شفافية</span>: <span id="opacity-val">70</span>%
                <input id="sld-helper-opacity" type="range" min="1" max="100" value="70" step="1" style="width: 100%; margin-top: 5px; accent-color: #4ade80;">
            </div>
            
          
            
            
        
</div>


        <!-- حدود الخريطة -->
        <div style="border: 1px solid #ff3300; border-radius: 10px; padding: 12px; margin-bottom: 14px; background-color: rgba(5, 7, 12, 0.65);">
            <div class="section-title" style="color: #ff3300;">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span data-i18n="map_bounds">حدود الخريطة</span>
            </div>
            <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #cbd5e1;">
                <input id="chk-enable-map-bounds" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
                <label for="chk-enable-map-bounds" style="cursor: pointer;" data-i18n="enable_bounds">تفعيل خطوط الحدود</label>
            </div>
        </div>

        <!-- مانع الإعلانات -->
        <div style="border: 1px solid #ef4444; border-radius: 10px; padding: 12px; margin-bottom: 14px; background-color: rgba(5, 7, 12, 0.65);">
            <div class="section-title" style="color: #ef4444;">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                <span data-i18n="ad_block">مانع الإعلانات</span>
            </div>
            <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #cbd5e1;">
                <input id="chk-block-ads" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;" checked>
                <label for="chk-block-ads" style="cursor: pointer;" data-i18n="enable_ads">تفعيل حظر الإعلانات</label>
            </div>
        </div>

        <button id="btn-about-trigger" data-i18n="about">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            About
        </button>
        <p data-i18n="toggle_hint">Press F1 to toggle menu</p>

        <!-- نافذة الـ About -->
        <div id="about-modal">
            <div class="about-header" id="about-header">
                <span style="font-size: 15px; font-weight: bold; color: #38bdf8;" data-i18n="about_title">حول السكريبت</span>
                <button class="close-about-btn" id="btn-close-about">✕</button>
            </div>
            <hr style="margin: 10px 0;">
            <div class="about-content">
                <div class="about-logo-container">
                    <img src="${chrome.runtime.getURL('logo.png')}" alt="Logo">
                </div>
                <div style="font-size: 14px; color: #ffffff; line-height: 1.6; margin-bottom: 10px;">
                    This script was created by <br>
                    <span style="color: #38bdf8; font-weight: bold; font-size: 16px; display: block; margin-top: 5px;">baylak</span>
                </div>
                
                <!-- روابط البلوجر والدعم المالي -->
                <div class="extra-action-btns">
                    <a href="http://baylak-egypt.blogspot.com/" target="_blank" class="extra-btn blog-btn">
                        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1 17.93a8 8 0 0 1-6-2.57l3-3a5.94 5.94 0 0 0 3 1v4.57zm0-6.93a4.94 4.94 0 0 1-3-1v-4a4.94 4.94 0 0 1 3-1v6zm2 6.93V15.36a5.94 5.94 0 0 0 3-1l3 3a8 8 0 0 1-6 2.57zm3.93-7.93a4.94 4.94 0 0 1-3 1v-6a4.94 4.94 0 0 1 3 1v4z"/></svg>
                        Blogger
                    </a>
                    <a href="https://baylak-egypt.blogspot.com/p/donate.html" target="_blank" class="extra-btn donate-btn">
                        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        Donate
                    </a>
                </div>

                <!-- الحاوية المسؤولة عن عرض الأيقونات الأخرى -->
                <div class="social-links" id="dynamic-social-links">
                    <span style="font-size: 11px; color: #64748b;">Loading links...</span>
                </div>
            </div>
            <p style="font-size: 10px; color: #64748b; margin-bottom: 10px; text-align: center;">All Rights Reserved © 2026</p>
        </div>
    `;
    shadow.appendChild(menu);

    shadow.getElementById('lang-flag-btn').addEventListener('click', () => {
        currentLang = (currentLang === 'ar') ? 'en' : 'ar';
        localStorage.setItem('menu_lang', currentLang);
        updateUITexts();
    });

    loadTranslations();

    async function fetchSocialLinks() {
        const url = "https://raw.githubusercontent.com/BayLak-Egypt/baylak-egypt.github.io/refs/heads/main/mysocial.txt";
        const socialLinksContainer = shadow.getElementById('dynamic-social-links');
        if (!socialLinksContainer) return;

        const iconsMap = {
            youtube: 'https://api.iconify.design/logos:youtube-icon.svg',
            github: 'https://api.iconify.design/logos:github-icon.svg',
            telegram: 'https://api.iconify.design/logos:telegram.svg',
            twitter: 'https://api.iconify.design/logos:twitter.svg',
            discord: 'https://api.iconify.design/logos:discord-icon.svg',
            facebook: 'https://api.iconify.design/logos:facebook.svg',
            instagram: 'https://api.iconify.design/skill-icons:instagram.svg',
            tiktok: 'https://api.iconify.design/logos:tiktok-icon.svg',
            website: 'https://api.iconify.design/ion:globe-outline.svg'
        };

        const defaultIcon = 'https://api.iconify.design/ion:link-outline.svg';

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch");
            const content = await response.text();

            const regex = /^([\w\-]+)\s*=\s*(\S+)/gm;
            let match;
            let linksHTML = '';

            while ((match = regex.exec(content)) !== null) {
                let platform = match[1].toLowerCase().trim();
                let rawLink = match[2].trim();
                
                let finalLink = rawLink.startsWith('http') ? rawLink : 'https://' + rawLink;
                let iconUrl = iconsMap[platform] || defaultIcon;
                let platformTitle = platform.charAt(0).toUpperCase() + platform.slice(1);

                linksHTML += `<a href="${finalLink}" target="_blank" class="social-btn" title="${platformTitle}"><img src="${iconUrl}" alt="${platform}"></a>`;
            }

            if (linksHTML) {
                socialLinksContainer.innerHTML = linksHTML;
            } else {
                socialLinksContainer.innerHTML = '';
            }
        } catch (err) {
            socialLinksContainer.innerHTML = '';
        }
    }

    fetchSocialLinks();

    function sendSettingsToPage() {
        const chkHelper = shadow.getElementById('chk-enable-helper-lines');
        const sldOpacity = shadow.getElementById('sld-helper-opacity');
        const chkAds = shadow.getElementById('chk-block-ads');
        const chkMapBounds = shadow.getElementById('chk-enable-map-bounds');
        const chkBallCustom = shadow.getElementById('chk-enable-ball-custom');
        const txtBallColor = shadow.getElementById('txt-ball-color');
        const chkRgbEffect = shadow.getElementById('chk-rgb-effect');
        
        window.postMessage({
            type: 'MENU_MOD_UPDATE',
            enabled: chkHelper ? chkHelper.checked : false,
            opacity: sldOpacity ? sldOpacity.value : 70,
            adBlockEnabled: chkAds ? chkAds.checked : true,
            mapBoundsEnabled: chkMapBounds ? chkMapBounds.checked : false,
            ballCustomEnabled: chkBallCustom ? chkBallCustom.checked : false,
            ballColor: txtBallColor ? txtBallColor.value : '#ff3333',
            rgbEffectEnabled: chkRgbEffect ? chkRgbEffect.checked : false
        }, '*');
    }

    const savedLeft = localStorage.getItem('menu_pos_left');
    const savedTop = localStorage.getItem('menu_pos_top');
    if (savedLeft !== null && savedTop !== null) {
        menu.style.left = savedLeft;
        menu.style.top = savedTop;
        floatingIcon.style.left = savedLeft;
        floatingIcon.style.top = savedTop;
    }

    let isMinimized = true;
    let idleTimer = null;

    function showCircle() {
        floatingIcon.style.left = menu.style.left || '20px';
        floatingIcon.style.top = menu.style.top || '50px';
        menu.style.display = 'none';
        floatingIcon.style.display = 'flex';
        isMinimized = true;
        clearTimeout(idleTimer);
    }

    function showMenu() {
        menu.style.left = floatingIcon.style.left || '20px';
        menu.style.top = floatingIcon.style.top || '50px';
        floatingIcon.style.display = 'none';
        menu.style.display = 'block';
        isMinimized = false;
        resetIdleTimer();
    }

    shadow.getElementById('btn-minimize').addEventListener('click', (e) => {
        e.stopPropagation();
        showCircle();
    });

    let isDragging = false, hasMoved = false;
    let startX, startY, startLeft, startTop;

    function makeDraggable(elem, handle) {
        if (!handle) return;
        handle.addEventListener('mousedown', (e) => {
            isDragging = true; hasMoved = false;
            startX = e.clientX; startY = e.clientY;
            const rect = elem.getBoundingClientRect();
            startLeft = rect.left; startTop = rect.top;
            e.stopPropagation();
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX, dy = e.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
            
            let newLeft = Math.max(0, Math.min(startLeft + dx, window.innerWidth - elem.offsetWidth));
            let newTop = Math.max(0, Math.min(startTop + dy, window.innerHeight - elem.offsetHeight));
            
            menu.style.left = newLeft + 'px'; menu.style.top = newTop + 'px';
            floatingIcon.style.left = newLeft + 'px'; floatingIcon.style.top = newTop + 'px';
            localStorage.setItem('menu_pos_left', newLeft + 'px');
            localStorage.setItem('menu_pos_top', newTop + 'px');
        });
        window.addEventListener('mouseup', () => { isDragging = false; });
    }

    makeDraggable(menu, shadow.getElementById('menu-header'));
    makeDraggable(floatingIcon, floatingIcon);

    const aboutModal = shadow.getElementById('about-modal');
    const btnAboutTrigger = shadow.getElementById('btn-about-trigger');
    const btnCloseAbout = shadow.getElementById('btn-close-about');
    const menuHeader = shadow.getElementById('menu-header');
    const hrElement = menu.querySelector('hr');
    const footerText = menu.querySelector('p');
    const pluginBoxes = menu.querySelectorAll('div[style*="border: 1px solid"]');

    if (btnAboutTrigger && aboutModal) {
        btnAboutTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentHeight = menu.offsetHeight;
            menu.style.height = currentHeight + 'px';
            
            if (menuHeader) menuHeader.style.display = 'none';
            if (hrElement) hrElement.style.display = 'none';
            if (footerText) footerText.style.display = 'none';
            pluginBoxes.forEach(box => box.style.display = 'none');
            btnAboutTrigger.style.display = 'none';
            
            aboutModal.style.display = 'flex';
        });

        btnCloseAbout.addEventListener('click', (e) => {
            e.stopPropagation();
            aboutModal.style.display = 'none';
            
            if (menuHeader) menuHeader.style.display = 'flex';
            if (hrElement) hrElement.style.display = 'block';
            if (footerText) footerText.style.display = 'block';
            pluginBoxes.forEach(box => box.style.display = 'block');
            btnAboutTrigger.style.display = 'block';
            
            menu.style.height = '';
        });

        makeDraggable(menu, shadow.getElementById('about-header'));
    }

    floatingIcon.addEventListener('click', () => {
        if (!hasMoved) showMenu();
        hasMoved = false;
    });

    function resetIdleTimer() {
        if (isMinimized) return;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(showCircle, 7000);
    }

    ['mousemove', 'click', 'input', 'change'].forEach(evt => {
        menu.addEventListener(evt, resetIdleTimer);
    });

   shadow.querySelectorAll('input, select').forEach(elem => {
    const savedValue = localStorage.getItem('plugin_state_' + elem.id);
    if (savedValue !== null) {
        if (elem.type === 'checkbox') {
            elem.checked = (savedValue === 'true');
        } else if (elem.type !== 'file') { // تم استثناء حقل الملفات لمنع الخطأ الأمني
            elem.value = savedValue;
        }

        if (elem.id === 'sld-helper-opacity') {
            const opacityVal = shadow.getElementById('opacity-val');
            if (opacityVal) opacityVal.textContent = elem.value;
        }
    }
    
    const saveAndSend = () => {
        // حقول الـ file لا نحتاج لحفظ قيمتها في الـ localStorage لأن المتصفح يمنع ذلك
        if (elem.type === 'file') return;

        const val = elem.type === 'checkbox' ? elem.checked : elem.value;
        localStorage.setItem('plugin_state_' + elem.id, val);
        if (elem.id === 'sld-helper-opacity') {
            const opacityVal = shadow.getElementById('opacity-val');
            if (opacityVal) opacityVal.textContent = elem.value;
        }
        sendSettingsToPage();
        resetIdleTimer();
    };

    elem.addEventListener('input', saveAndSend);
    elem.addEventListener('change', saveAndSend);
});

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F1') {
            e.preventDefault();
            if (menu.style.display === 'none' && floatingIcon.style.display === 'none') showMenu();
            else { menu.style.display = 'none'; floatingIcon.style.display = 'none'; }
        }
    });

    setTimeout(() => {
        sendSettingsToPage();
    }, 1000);
})();
