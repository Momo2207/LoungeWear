// --- BRAND NAME VARIABLE ---
const brandName = "Blueberry Moon";
const brandDomain = "blueberrymoon.com";
// --- ENDE BRAND NAME VARIABLE ---


document.addEventListener('DOMContentLoaded', function() {

    // Update Brand Name in HTML elements
    const brandNameElements = document.querySelectorAll('.brand-name-js');
    brandNameElements.forEach(el => {
        el.textContent = brandName;
    });

    const brandDomainElements = document.querySelectorAll('.brand-domain-js');
    brandDomainElements.forEach(el => {
        el.textContent = brandDomain;
    });

    // Update document title
    if (document.title.includes("Loungewear Reimagined")) { // Homepage
        document.title = `${brandName} - Loungewear Reimagined`;
    } else if (document.title.includes("Registrierung Erster Drop")) { // Registration page
        document.title = `Registrierung Erster Drop - ${brandName}`;
    }
    // For individual article pages, the title is set in their respective HTML templates.
    // If an article template has a JS-driven title, it would be:
    // else if (document.querySelector('.blog-article-full')) { // Check if it's an article page
    //    const articleTitleElement = document.querySelector('.blog-article-full h1');
    //    if (articleTitleElement) document.title = `${articleTitleElement.textContent} - ${brandName} Journal`;
    // }


    // Mobile Navigation Toggle
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        document.querySelectorAll(".nav-menu .nav-link").forEach(n => n.addEventListener("click", (e) => {
            const href = n.getAttribute('href');
            // Close menu if it's a same-page anchor link or a link to another page
            if (navMenu.classList.contains('active')) {
                 // If it's a link to another page (not starting with # or is index.html#), let it navigate
                if (!href.startsWith('#') && !href.includes('index.html#')) {
                    // Allow default navigation and menu will close if page reloads
                } else { // For same-page anchors
                    hamburger.classList.remove("active");
                    navMenu.classList.remove("active");
                }
            }
        }));
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#") { 
                e.preventDefault(); 
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar active link highlighting based on scroll (for homepage sections)
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const isHomepage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') || window.location.pathname === '';


    function changeNavOnScroll() {
        if (!isHomepage) return; // Only run on homepage

        let currentSectionId = '';
        const navbarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100; // Adjusted offset
            if (pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.includes('#') && linkHref.split('#')[1] === currentSectionId) {
                link.classList.add('active');
            }
        });
    }
    
    if (sections.length > 0 && navLinks.length > 0 && isHomepage) {
        window.addEventListener('scroll', changeNavOnScroll);
        changeNavOnScroll(); // Initial check
    }


    // --- Size Chart Modal Logic (for register-drop.html) ---
    const sizeChartModal = document.getElementById("sizeChartModal");
    const openSizeChartBtn = document.getElementById("openSizeChartBtn");
    const closeModalBtns = document.querySelectorAll(".close-modal-btn"); // Can be multiple (X icon, SVG)

    if (openSizeChartBtn && sizeChartModal) { // Check if elements exist on the current page
        openSizeChartBtn.onclick = function() {
            sizeChartModal.style.display = "block";
        }

        closeModalBtns.forEach(btn => {
            btn.onclick = function() {
                sizeChartModal.style.display = "none";
            }
        });

        window.onclick = function(event) {
            if (event.target == sizeChartModal) {
                sizeChartModal.style.display = "none";
            }
        }
    }


    // --- Drop Registration Form Handling (for register-drop.html) ---
    const registrationForm = document.getElementById('dropRegistrationForm');
    const formMessage = document.getElementById('form-message');

    if (registrationForm && formMessage) { // Check if elements exist
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const firstName = document.getElementById('firstName').value;
            const email = document.getElementById('email').value;
            const dataPrivacy = document.getElementById('dataPrivacy').checked;

            if (!firstName || !email || !dataPrivacy) {
                formMessage.textContent = 'Bitte fülle alle Pflichtfelder aus und akzeptiere die Datenschutzerklärung.';
                formMessage.className = 'form-message error';
                return;
            }
            
            formMessage.textContent = `Danke, ${firstName}! Du bist für den Drop registriert. Wir halten dich auf dem Laufenden.`;
            formMessage.className = 'form-message success';
            registrationForm.reset(); 
        });
    }

    // --- Load Journal Articles on Homepage ---
    const journalGridHome = document.getElementById('journalGridHome');
    const articlesJsonPath = 'blog/data/articles.json';
    const articlesBasePath = 'blog/articles/'; 
    const imagesBasePath = 'images/blog/'; 

    async function loadLatestJournalArticles() {
        if (!journalGridHome) return; 

        try {
            const response = await fetch(articlesJsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, trying to fetch ${articlesJsonPath}`);
            }
            const articles = await response.json();
            
            // Sort by ID descending (newest first if ID is incremental)
            // If your JSON is already sorted with newest first, this isn't strictly necessary
            articles.sort((a, b) => b.id - a.id); 

            const articlesToShow = articles.slice(0, 2); // Show the 2 newest articles

            if (articlesToShow.length > 0) {
                journalGridHome.innerHTML = ''; 
                articlesToShow.forEach(article => {
                    const postElement = document.createElement('article');
                    postElement.classList.add('journal-post');
                    // Ensure image path is correct
                    const imageUrl = `${imagesBasePath}${article.image}`;
                    const articleUrl = `${articlesBasePath}${article.fileName}`;

                    postElement.innerHTML = `
                        <a href="${articleUrl}" class="post-thumbnail-link">
                            <img src="${imageUrl}" alt="${article.title}" class="post-thumbnail">
                        </a>
                        <div class="post-content">
                            <h3><a href="${articleUrl}">${article.title}</a></h3>
                            <p class="post-date">${new Date(article.date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p class="post-preview">${article.previewText}</p>
                            <a href="${articleUrl}" class="read-more-btn">Weiterlesen →</a>
                        </div>
                    `;
                    journalGridHome.appendChild(postElement);
                });
            } else {
                journalGridHome.innerHTML = '<p>Momentan keine Artikel verfügbar.</p>';
            }

        } catch (error) {
            console.error("Konnte Journal-Artikel nicht laden:", error);
            if (journalGridHome) {
                 journalGridHome.innerHTML = '<p>Fehler beim Laden der Artikel. Bitte überprüfe die Konsole für Details.</p>';
            }
        }
    }

    if (journalGridHome) { // Only call if on a page with this element (i.e., homepage)
        loadLatestJournalArticles();
    }

}); // End of DOMContentLoaded