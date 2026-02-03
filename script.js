/* =========================================
   GLOBAL FONKSİYONLAR (HTML'den Erişilenler)
   Bu fonksiyon dışarıda olmalı ki onclick çalışsın.
   ========================================= */
async function changeLanguage(lang) {
    try {
        // 1. JSON Dosyasını Çek
        const response = await fetch(`./lang/${lang}.json`);
        
        if (!response.ok) {
            throw new Error(`Dil dosyası bulunamadı: ${lang}`);
        }

        const translations = await response.json();

        // 2. Arapça için Yön ve Font Ayarları (RTL)
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.lang = 'ar';
            document.body.style.fontFamily = "'Tajawal', Arial, sans-serif";
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.lang = lang;
            document.body.style.fontFamily = "Arial, Helvetica, sans-serif";
        }

        // 3. Header'daki Dil Yazısını Güncelle
        const currentLangSpan = document.getElementById('current-lang');
        if (currentLangSpan) {
            currentLangSpan.textContent = lang.toUpperCase();
        }

        // 4. Metinleri Değiştir
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[key];
                } else {
                    element.innerHTML = translations[key]; 
                }
            }
        });

    } catch (error) {
        console.error("Dil değiştirilirken hata oluştu:", error);
    }
}

/* =========================================
   DOM YÜKLENDİKTEN SONRA ÇALIŞACAKLAR
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {

    // Sayfa ilk açıldığında varsayılan dil Türkçe olsun
    changeLanguage('tr');

    /* =======================
       HERO TEXT ANIMATION
    ======================= */
    const video = document.getElementById("bgVideo");
    const heroText = document.querySelector(".hero-text");

    if (video && heroText) {
        let textShown = false;
        video.addEventListener("timeupdate", () => {
            if (video.currentTime >= 6 && !textShown) {
                heroText.classList.add("show");
                textShown = true;
            }
        });
    }

    /* =======================
       HEADER SCROLL EFFECT
    ======================= */
    const header = document.querySelector(".header");
    if (header) {
        const logo = header.querySelector(".logo");
        const navLinks = header.querySelectorAll(".nav a");

        window.addEventListener("scroll", () => {
            const scrollPassed = window.scrollY > window.innerHeight - 80;
            // Arka planı CSS'teki lacivert tonuna uyumlu hale getirebilirsin veya böyle kalabilir
            header.style.background = scrollPassed ? "rgba(5, 10, 24, 0.95)" : "rgba(5, 10, 24, 0.75)";
            // Logoyu neon efektiyle uyumlu bırakmak için renk değişimini iptal edebiliriz veya güncelleyebiliriz
            // Fütüristik tema için beyaz/neon kalması daha iyidir:
            // logo.style.color = scrollPassed ? "#fff" : "#fff"; 
        });
    }

    /* =======================
       ABOUT STATISTICS COUNTERS
    ======================= */
    const counters = document.querySelectorAll(".stat-number");
    const statsSection = document.querySelector(".about-stats");
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;

        counters.forEach(counter => {
            const target = +counter.dataset.target;
            const duration = 2500;
            const startTime = performance.now();

            function update(time) {
                const progress = Math.min((time - startTime) / duration, 1);
                counter.textContent = Math.floor(progress * target);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    if (statsSection) {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) animateCounters();
        }, { threshold: 0.6 });
        observer.observe(statsSection);
    }

    /* =======================
       SERVICES CARDS ANIMATION
    ======================= */
    const serviceCards = document.querySelectorAll(".service-card");
    if (serviceCards.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add("show");
            });
        }, { threshold: 0.2 });

        serviceCards.forEach(card => observer.observe(card));
    }

    /* =======================
       CONTACT FORM VALIDATION
    ======================= */
    const form = document.querySelector(".contact-form-box form");
    const successMessage = document.querySelector(".form-success");
    const checkbox = document.querySelector(".checkbox input");
    const checkboxError = document.querySelector(".checkbox-error");

    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            let isValid = true;
            const inputs = form.querySelectorAll("input, textarea");

            inputs.forEach(input => {
                if (input.type !== "checkbox" && !input.value.trim()) {
                    isValid = false;
                    input.style.borderBottomColor = "#d93025";
                } else {
                    input.style.borderBottomColor = "rgba(0, 242, 255, 0.3)"; // Tema rengine uygun sınır
                }
            });

            if (!checkbox.checked) {
                isValid = false;
                checkboxError.style.display = "block";
            } else {
                checkboxError.style.display = "none";
            }

            if (!isValid) return;

            successMessage.classList.add("show");
            form.reset();

            setTimeout(() => {
                successMessage.classList.remove("show");
                successMessage.classList.add("hide"); // Animasyonlu kapanış için
            }, 3000);
            
        });
    }
});