(function() {
    'use strict';
    
    window.MenuModAbout = {
        generateAboutSection: function() {
            return `
                <button id="btn-about-trigger">About</button>
                <div id="about-modal">
                    <div class="about-header" id="about-header">
                        <span style="font-size: 15px; font-weight: bold; color: #38bdf8;">About Script</span>
                        <button class="close-about-btn" id="btn-close-about">✕</button>
                    </div>
                    <hr style="margin: 10px 0; border: none; border-top: 1px solid rgba(255,255,255,0.15);">
                    <div class="about-content">
                        <div style="font-size: 32px; margin-bottom: 10px;">🛡️</div>
                        <div style="font-size: 14px; color: #ffffff; line-height: 1.6; margin-bottom: 10px;">
                            This script was created by <br>
                            <span style="color: #38bdf8; font-weight: bold; font-size: 16px; display: block; margin-top: 5px;">baylak</span>
                        </div>
                        <div class="social-links" id="dynamic-social-links">
                            <span style="font-size: 11px; color: #64748b;">Loading links...</span>
                        </div>
                    </div>
                    <p style="font-size: 10px; color: #64748b; margin-bottom: 0; text-align: center;">All Rights Reserved © 2026</p>
                </div>
            `;
        },

        getAboutStyles: function() {
            return `
                #about-modal {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(8, 12, 20, 0.98);
                    backdrop-filter: blur(15px);
                    border-radius: 12px; padding: 20px;
                    display: none; flex-direction: column; justify-content: space-between;
                    z-index: 2147483648;
                    box-sizing: border-box;
                }
                .about-header {
                    display: flex; justify-content: space-between; align-items: center; cursor: move;
                }
                .close-about-btn {
                    background: rgba(255, 255, 255, 0.1); border: none; color: #ffffff; 
                    width: 28px; height: 28px; border-radius: 50%; font-size: 14px; 
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s; pointer-events: auto !important;
                }
                .close-about-btn:hover { background: rgba(255, 0, 0, 0.6); }
                .about-content {
                    text-align: center; margin: auto 0;
                }
                .social-links {
                    display: flex; justify-content: center; gap: 12px; margin-top: 15px; flex-wrap: wrap;
                }
                .social-btn {
                    width: 38px; height: 38px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center;
                    color: #ffffff; font-size: 16px; cursor: pointer; text-decoration: none; transition: all 0.2s;
                    pointer-events: auto !important;
                }
                .social-btn:hover { transform: scale(1.1); background-color: rgba(56, 189, 248, 0.2); border-color: #38bdf8; }
                #btn-about-trigger {
                    width: 100%; min-height: 38px; padding: 10px; margin-top: 15px;
                    background-color: rgba(255, 255, 255, 0.05); color: #38bdf8;
                    border: 1px dashed rgba(56, 189, 248, 0.4); border-radius: 6px;
                    cursor: pointer; font-size: 13px; font-weight: bold;
                    transition: all 0.2s; pointer-events: auto !important;
                }
                #btn-about-trigger:hover {
                    background-color: rgba(56, 189, 248, 0.15);
                    border-color: #38bdf8;
                }
            `;
        },

        initAboutLogic: function(shadow, menu, makeDraggable) {
            const aboutModal = shadow.getElementById('about-modal');
            const btnAboutTrigger = shadow.getElementById('btn-about-trigger');
            const btnCloseAbout = shadow.getElementById('btn-close-about');
            const socialLinksContainer = shadow.getElementById('dynamic-social-links');
            
            const menuHeader = shadow.getElementById('menu-header');
            const hrElement = menu.querySelector('hr');
            const footerText = menu.querySelector('p');
            const pluginBoxes = menu.querySelectorAll('div[style*="border: 1px solid"]');

            if (!btnAboutTrigger || !aboutModal) return;

            // دالة لجلب وتنسيق الروابط من GitHub تلقائياً
            async function fetchSocialLinks() {
                const url = "https://raw.githubusercontent.com/BayLak-Egypt/baylak-egypt.github.io/refs/heads/main/mysocial.txt";
                const iconsMap = {
                    youtube: '📺',
                    github: '🐙',
                    telegram: '✈️',
                    twitter: '🐦',
                    discord: '💬',
                    facebook: '📘',
                    instagram: '📷',
                    tiktok: '🎵',
                    website: '🌐'
                };

                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error("Failed to fetch");
                    const content = await response.text();

                    // نفس نمط التعبير المنتظم (Regex) المستخدم في كود بايثون
                    const regex = /^([\w\-]+)\s*=\s*(\S+)/gm;
                    let match;
                    let linksHTML = '';

                    while ((match = regex.exec(content)) !== null) {
                        let platform = match[1].toLowerCase().trim();
                        let rawLink = match[2].trim();
                        
                        // تنظيف الرابط مثل كود بايثون
                        let cleanLink = rawLink.replace(/^(https?:\/\/)?(www\.)?/i, "").replace(/\/+$/, "");
                        let finalLink = rawLink.startsWith('http') ? rawLink : 'https://' + rawLink;
                        let icon = iconsMap[platform] || '🔗';
                        let platformTitle = platform.charAt(0).toUpperCase() + platform.slice(1);

                        linksHTML += `<a href="${finalLink}" target="_blank" class="social-btn" title="${platformTitle}"><span>${icon}</span></a>`;
                    }

                    if (linksHTML) {
                        socialLinksContainer.innerHTML = linksHTML;
                    } else {
                        socialLinksContainer.innerHTML = '<span style="font-size: 11px; color: #ef4444;">⚠️ No social links found.</span>';
                    }
                } catch (err) {
                    socialLinksContainer.innerHTML = '<span style="font-size: 11px; color: #ef4444;">⚠️ Failed to fetch links from GitHub.</span>';
                }
            }

            // تنفيذ جلب الروابط عند بدء التشغيل
            fetchSocialLinks();

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
    };
})();
