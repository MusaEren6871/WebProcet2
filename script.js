document.addEventListener("DOMContentLoaded", () => {

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
            header.style.background = scrollPassed ? "#ff6969ff" : "transparent";
            logo.style.color = scrollPassed ? "#111" : "#fff";
            navLinks.forEach(a => a.style.color = scrollPassed ? "#111" : "#fff");
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
                    input.style.borderBottomColor = "#000";
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

            setTimeout(() => successMessage.classList.remove("show"), 3000);
            
        });
    }

});

