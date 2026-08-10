(function() {
    'use strict';
    try {
        console.log("AdBlocker: جاري تشغيل مانع الإعلانات المرن...");

        const selectors = [
            '#agar-io_300x250', '#agar-io_970x90', '#agar-io_160x600', '#agar-io_160x600_2',
            '#preroll', '#mainui-ads', '#applixir_blocker', '#applixir_vanishing_div',
            '[id^="div-gpt-ad-"]', 'iframe[src*="doubleclick.net"]', 'iframe[src*="applixir.com"]',
            'iframe[src*="adinplay.com"]', 'iframe[src*="googlesyndication.com"]',
            '.agario-promo-container', 'div[class*="aip"]', 'div[id*="aip"]',
            '#google_ads_iframe', 'div[class*="adsbox"]', 'ins.adsbygoogle'
        ];

        // إنشاء عنصر الـ Style للإخفاء المرن
        const style = document.createElement('style');
        style.id = 'ad-blocker-style';
        style.innerHTML = selectors.join(', ') + ' { display: none !important; visibility: hidden !important; height: 0 !important; width: 0 !important; opacity: 0 !important; pointer-events: none !important; }';

        function toggleAdBlock(shouldEnable) {
            const existingStyle = document.getElementById('ad-blocker-style');
            
            if (shouldEnable) {
                // تفعيل الإخفاء (حقن الستايل إذا لم يكن موجوداً)
                if (!existingStyle) {
                    document.head.appendChild(style);
                }
                console.log("AdBlocker: تم إخفاء الإعلانات.");
            } else {
                // إلغاء الحظر وإعادة إظهار الإعلانات فوراً بحذف الستايل
                if (existingStyle) {
                    existingStyle.remove();
                }
                console.log("AdBlocker: تم إظهار الإعلانات.");
            }
        }

        // 1. الاستماع لرسائل المنيو (postMessage)
        window.addEventListener('message', (e) => {
            if (e.data?.type === 'MENU_MOD_UPDATE') {
                if (typeof e.data.adBlockEnabled !== 'undefined') {
                    toggleAdBlock(e.data.adBlockEnabled);
                }
            }
        });

        // 2. التحقق من حالة الزر في المنيو بشكل دوري أو مبدئي
        const checkInterval = setInterval(() => {
            const host = document.getElementById('menu-host');
            const chk = host?.shadowRoot?.getElementById('chk-block-ads');
            if (chk) {
                toggleAdBlock(chk.checked);
            }
        }, 1000);

    } catch (err) { 
        console.error("AdBlocker Error:", err); 
    }
})();
