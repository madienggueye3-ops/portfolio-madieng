document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navbar = document.querySelector(".navbar");
    const loader = document.querySelector(".page-loader");
    const backToTop = document.querySelector("#backToTop");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );
    const contactForm = document.querySelector("#contactForm");

    /* ================================
       PAGE LOADER
    ================================= */

    window.addEventListener("load", () => {
        setTimeout(() => {
            if (loader) {
                loader.classList.add("loaded");
            }

            document.body.classList.add("page-loaded");
        }, 500);
    });

    /* ================================
       NAVBAR
    ================================= */

    const handleNavbar = () => {
        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    handleNavbar();

    window.addEventListener("scroll", handleNavbar, {
        passive: true
    });

    /* ================================
       MOBILE MENU
    ================================= */

    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (
                navbarCollapse &&
                navbarCollapse.classList.contains("show") &&
                navbarToggler
            ) {
                navbarToggler.click();
            }
        });
    });

    /* ================================
       ACTIVE NAVIGATION
    ================================= */

    const updateActiveNav = () => {
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    };

    updateActiveNav();

    window.addEventListener("scroll", updateActiveNav, {
        passive: true
    });

    /* ================================
       SCROLL REVEAL
    ================================= */

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                        observerInstance.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("active");
        });
    }

    /* ================================
       STAGGER ANIMATIONS
    ================================= */

    const animatedGroups = [
        ".skills-grid .skill-card",
        ".projects-grid .project-card",
        ".services-grid .service-card"
    ];

    animatedGroups.forEach((selector) => {
        const elements = document.querySelectorAll(selector);

        elements.forEach((element, index) => {
            element.style.transitionDelay = `${index * 0.08}s`;
            element.classList.add("reveal");
        });
    });

    /* ================================
       BACK TO TOP
    ================================= */

    const handleBackToTop = () => {
        if (!backToTop) return;

        if (window.scrollY > 500) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    };

    handleBackToTop();

    window.addEventListener("scroll", handleBackToTop, {
        passive: true
    });

    if (backToTop) {
        backToTop.addEventListener("click", (event) => {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* ================================
       SMOOTH ANCHOR SCROLL
    ================================= */

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const navbarHeight = navbar
                ? navbar.offsetHeight
                : 80;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });

    /* ================================
       CONTACT FORM
    ================================= */

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.querySelector("#name");
            const email = document.querySelector("#email");
            const subject = document.querySelector("#subject");
            const message = document.querySelector("#message");

            if (!name || !email || !subject || !message) {
                return;
            }

            if (
                name.value.trim() === "" ||
                email.value.trim() === "" ||
                subject.value.trim() === "" ||
                message.value.trim() === ""
            ) {
                showFormMessage(
                    "Veuillez remplir tous les champs.",
                    "error"
                );

                return;
            }

            if (!isValidEmail(email.value.trim())) {
                showFormMessage(
                    "Veuillez entrer une adresse e-mail valide.",
                    "error"
                );

                return;
            }

            const whatsappNumber = "221782705824";

            const whatsappMessage =
                `Bonjour Madieng,%0A%0A` +
                `Nom : ${encodeURIComponent(name.value.trim())}%0A` +
                `Email : ${encodeURIComponent(email.value.trim())}%0A` +
                `Sujet : ${encodeURIComponent(subject.value.trim())}%0A%0A` +
                `Message :%0A${encodeURIComponent(message.value.trim())}`;

            const whatsappUrl =
                `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

            showFormMessage(
                "Votre message est prêt. Vous allez être redirigé vers WhatsApp.",
                "success"
            );

            setTimeout(() => {
                window.open(whatsappUrl, "_blank");
            }, 900);
        });
    }

    function isValidEmail(email) {
        const pattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return pattern.test(email);
    }

    function showFormMessage(message, type) {
        let messageElement =
            document.querySelector(".form-message");

        if (!messageElement) {
            messageElement =
                document.createElement("div");

            messageElement.className =
                "form-message";

            contactForm.appendChild(messageElement);
        }

        messageElement.textContent = message;

        messageElement.classList.remove(
            "success",
            "error"
        );

        messageElement.classList.add(type);

        setTimeout(() => {
            messageElement.classList.remove(
                "success",
                "error"
            );
        }, 5000);
    }

    /* ================================
       INPUT FOCUS EFFECT
    ================================= */

    const formInputs = document.querySelectorAll(
        ".form-group input, .form-group textarea"
    );

    formInputs.forEach((input) => {
        input.addEventListener("focus", () => {
            const wrapper =
                input.closest(
                    ".input-wrapper, .textarea-wrapper"
                );

            if (wrapper) {
                wrapper.classList.add("focused");
            }
        });

        input.addEventListener("blur", () => {
            const wrapper =
                input.closest(
                    ".input-wrapper, .textarea-wrapper"
                );

            if (wrapper) {
                wrapper.classList.remove("focused");
            }
        });
    });

    /* ================================
       YEAR
    ================================= */

    const currentYear =
        document.querySelector("#currentYear");

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

    /* ================================
       PROJECT CARD IMAGE FALLBACK
    ================================= */

    const projectImages =
        document.querySelectorAll(".project-image img");

    projectImages.forEach((image) => {
        image.addEventListener("error", () => {
            image.style.display = "none";

            const container =
                image.closest(".project-image");

            if (!container) return;

            container.classList.add("image-error");

            const fallback =
                document.createElement("div");

            fallback.className =
                "project-image-fallback";

            fallback.innerHTML = `
                <i class="bi bi-code-slash"></i>
                <span>Projet Web</span>
            `;

            container.appendChild(fallback);
        });
    });

    /* ================================
       PROFILE IMAGE FALLBACK
    ================================= */

    const profileImage =
        document.querySelector(".profile-image");

    if (profileImage) {
        profileImage.addEventListener("error", () => {
            profileImage.style.display = "none";

            const wrapper =
                profileImage.closest(
                    ".profile-image-wrapper"
                );

            if (!wrapper) return;

            wrapper.classList.add(
                "profile-image-error"
            );

            const fallback =
                document.createElement("div");

            fallback.className =
                "profile-fallback";

            fallback.innerHTML = `
                <i class="bi bi-person"></i>
                <span>Madieng GUEYE</span>
            `;

            wrapper.appendChild(fallback);
        });
    }

    /* ================================
       PARALLAX HERO
    ================================= */

    const heroVisual =
        document.querySelector(".hero-visual");

    const floatingElements =
        document.querySelectorAll(
            ".floating-tech, .code-card"
        );

    if (
        heroVisual &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {
        heroVisual.addEventListener(
            "mousemove",
            (event) => {
                const rect =
                    heroVisual.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;

                floatingElements.forEach(
                    (element, index) => {
                        const strength =
                            (index + 1) * 5;

                        element.style.transform =
                            `translate(${x * strength}px, ${y * strength}px)`;
                    }
                );
            }
        );

        heroVisual.addEventListener(
            "mouseleave",
            () => {
                floatingElements.forEach(
                    (element) => {
                        element.style.transform = "";
                    }
                );
            }
        );
    }

    /* ================================
       CURRENT YEAR
    ================================= */

    const footerYear =
        document.querySelector(
            ".footer-year"
        );

    if (footerYear) {
        footerYear.textContent =
            new Date().getFullYear();
    }
});