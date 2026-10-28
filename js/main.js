/**
 * PORTFOLIO OFFICIEL - MADIENG GUEYE
 * Développeur Web & Mobile | Sénégal
 * Fichier : js/main.js
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ==========================================================================
       1. PAGE LOADER
       ========================================================================== */
    const pageLoader = document.getElementById("pageLoader");
    if (pageLoader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                pageLoader.classList.add("loaded");
                setTimeout(() => {
                    pageLoader.remove();
                }, 500);
            }, 300);
        });
    }

    /* ==========================================================================
       GESTION DU THÈME SOMBRE / CLAIR (DARK MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById("themeToggle");
    const storedTheme = localStorage.getItem("mg_portfolio_theme");

    const applyTheme = (theme) => {
        if (theme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
    };

    if (storedTheme === "dark") {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = document.documentElement.getAttribute("data-theme") === "dark";
            const newTheme = isDark ? "light" : "dark";
            applyTheme(newTheme);
            localStorage.setItem("mg_portfolio_theme", newTheme);
        });
    }

    /* ==========================================================================
       2. GESTION DE LA NAVBAR AU SCROLL & MENU MOBILE
       ========================================================================== */
    const navbar = document.getElementById("mainNavbar");
    const navbarCollapse = document.getElementById("navbarContent");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const sections = document.querySelectorAll("section[id]");

    const handleNavbarScroll = () => {
        const scrollY = window.scrollY;

        // Effet opacité / verre lors du scroll
        if (navbar) {
            if (scrollY > 40) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }

        // Active link spy
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // Fermeture automatique du menu mobile lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navbarCollapse && navbarCollapse.classList.contains("show")) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });

    /* ==========================================================================
       3. EFFET DE FRAPPE TYPING HERO
       ========================================================================== */
    const typingElement = document.querySelector(".typing-text");
    if (typingElement) {
        const roles = [
            "Développeur Web & Mobile",
            "Créateur de solutions numériques"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 90;
        const deletingSpeed = 45;
        const delayBetweenRoles = 2200;

        const typeEffect = () => {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let nextSpeed = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                nextSpeed = delayBetweenRoles;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                nextSpeed = 400;
            }

            setTimeout(typeEffect, nextSpeed);
        };

        // Lancement avec un léger délai après chargement
        setTimeout(typeEffect, 600);
    }

    /* ==========================================================================
       4. FILTRES INTERACTIFS DE PROJETS
       ========================================================================== */
    const filterTabs = document.querySelectorAll(".filter-tab");
    const projectItems = document.querySelectorAll(".project-item");

    if (filterTabs.length > 0 && projectItems.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                // Changer l'onglet actif
                filterTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");

                const filterValue = tab.getAttribute("data-filter");

                projectItems.forEach(item => {
                    const category = item.getAttribute("data-category");

                    if (filterValue === "all" || category === filterValue) {
                        item.classList.remove("hidden");
                        item.style.opacity = "0";
                        item.style.transform = "translateY(12px)";
                        setTimeout(() => {
                            item.style.opacity = "1";
                            item.style.transform = "translateY(0)";
                        }, 50);
                    } else {
                        item.classList.add("hidden");
                    }
                });
            });
        });
    }

    /* ==========================================================================
       5. FORMULAIRE DE CONTACT & VALIDATION TEMPS RÉEL
       ========================================================================== */
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        const nameField = document.getElementById("name");
        const emailField = document.getElementById("email");
        const subjectField = document.getElementById("subject");
        const messageField = document.getElementById("message");

        const validateField = (field, condition) => {
            const group = field.closest(".input-field-group");
            if (!group) return true;

            if (condition) {
                group.classList.remove("has-error");
                return true;
            } else {
                group.classList.add("has-error");
                return false;
            }
        };

        const isValidEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        };

        // Validation en direct lors de la saisie
        [nameField, subjectField, messageField].forEach(field => {
            if (field) {
                field.addEventListener("input", () => {
                    validateField(field, field.value.trim().length > 1);
                });
            }
        });

        if (emailField) {
            emailField.addEventListener("input", () => {
                validateField(emailField, isValidEmail(emailField.value));
            });
        }

        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const isNameValid = validateField(nameField, nameField.value.trim().length > 1);
            const isEmailValid = validateField(emailField, isValidEmail(emailField.value));
            const isSubjectValid = validateField(subjectField, subjectField.value.trim().length > 1);
            const isMessageValid = validateField(messageField, messageField.value.trim().length > 4);

            if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
                showToast("Veuillez remplir correctement tous les champs.", "error");
                return;
            }

            const name = nameField.value.trim();
            const email = emailField.value.trim();
            const subject = subjectField.value.trim();
            const message = messageField.value.trim();

            // Numéro WhatsApp officiel de Madieng
            const phone = "221782705824";
            const whatsappText = 
                `Bonjour Madieng GUEYE,%0A%0A` +
                `*Nouveau message depuis votre portfolio :*%0A` +
                `• *Nom :* ${encodeURIComponent(name)}%0A` +
                `• *Email :* ${encodeURIComponent(email)}%0A` +
                `• *Sujet :* ${encodeURIComponent(subject)}%0A%0A` +
                `*Message :*%0A${encodeURIComponent(message)}`;

            const whatsappUrl = `https://wa.me/${phone}?text=${whatsappText}`;

            // Ouvrir WhatsApp
            window.open(whatsappUrl, "_blank");

            // Feedback et réinitialisation
            contactForm.reset();
            showToast("Votre message est prêt. Redirection vers WhatsApp...", "success");
        });
    }

    /* ==========================================================================
       6. SYSTÈME DE NOTIFICATION TOAST
       ========================================================================== */
    function showToast(message, type = "success") {
        const existingToast = document.querySelector(".custom-toast");
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement("div");
        toast.className = `custom-toast ${type}`;
        toast.innerHTML = `
            <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} toast-icon"></i>
            <span class="toast-text">${message}</span>
            <button type="button" class="toast-close" aria-label="Fermer"><i class="bi bi-x"></i></button>
        `;

        document.body.appendChild(toast);

        // Déclencher l'animation d'entrée
        requestAnimationFrame(() => {
            toast.classList.add("show");
        });

        const closeBtn = toast.querySelector(".toast-close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                toast.classList.remove("show");
                setTimeout(() => toast.remove(), 300);
            });
        }

        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove("show");
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    /* ==========================================================================
       7. BOUTON RETOUR EN HAUT (BACK TO TOP)
       ========================================================================== */
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 450) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        }, { passive: true });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* ==========================================================================
       8. ANIMATION D'APPARITION AU DÉFILEMENT (INTERSECTION OBSERVER)
       ========================================================================== */
    const animatedElements = document.querySelectorAll(
        ".section-header, .about-card-banner, .about-main-text, .timeline-step, .skill-card, .project-card-clean, .service-card-premium, .contact-card-wrapper"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px"
        });

        animatedElements.forEach(el => {
            el.classList.add("fade-up-element");
            observer.observe(el);
        });
    }

    /* ==========================================================================
       9. MISE À JOUR AUTOMATIQUE DE L'ANNÉE DU FOOTER
       ========================================================================== */
    const currentYearEl = document.getElementById("currentYear");
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
});