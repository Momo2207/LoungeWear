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

    // Update document title based on the current page
    const pageTitle = document.title;
    if (pageTitle.includes("Loungewear Reimagined")) { // Homepage
        document.title = `${brandName} - Loungewear Reimagined`;
    } else if (pageTitle.includes("Registrierung Erster Drop")) { // Registration page
        document.title = `Registrierung Erster Drop - ${brandName}`;
    } else if (pageTitle.includes("Unser Journal - Alle Artikel")) { // Blog overview page
        document.title = `Unser Journal - Alle Artikel - ${brandName}`;
    }
    // Individual article page titles are typically set in their respective HTML templates.


    // Mobile Navigation Toggle
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll(".nav-menu .nav-link").forEach(n => n.addEventListener("click", () => {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
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
            if (targetId === "#") { // Prevent jump for placeholder links
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

    // Navbar active link highlighting
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const currentPath = window.location.pathname.split("/").pop() || 'index.html'; // Gets file like "blog.html" or defaults to "index.html" for root

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const linkPath = linkHref.split("/").pop().split("#")[0] || 'index.html'; // Get file name from link, default to index.html for root links like "/"

        // Remove active class from all links first to ensure only one is active for full page links
        if (linkPath === currentPath) {
             // link.classList.add('active'); // This is now handled by the scroll logic for homepage, and CSS for direct page match
        } else {
            // link.classList.remove('active');
        }
    });
    
    // Scroll-based active link for homepage sections
    const sections = document.querySelectorAll('main section[id]');
    const isHomepage = currentPath === 'index.html';

    function changeNavOnScroll() {
        if (!isHomepage) return;

        let currentSectionId = '';
        const navbarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
        
        sections.forEach(section => {
            // Adjust offset for better accuracy; navbarHeight and a bit more
            const sectionTop = section.offsetTop - navbarHeight - 50; 
            if (pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            // Only apply active state to homepage section links (e.g., #shop, index.html#shop)
            if (linkHref.startsWith('#') || linkHref.startsWith('index.html#')) {
                link.classList.remove('active'); // Remove from all section links first
                if (linkHref.split('#')[1] === currentSectionId) {
                    link.classList.add('active');
                }
            }
        });
    }
    
    if (isHomepage && sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', changeNavOnScroll);
        changeNavOnScroll(); // Initial check on page load
    }


    // --- Size Chart Modal Logic (for register-drop.html) ---
    const sizeChartModal = document.getElementById("sizeChartModal");
    const openSizeChartBtn = document.getElementById("openSizeChartBtn");
    const closeModalBtns = document.querySelectorAll(".close-modal-btn"); // Handles multiple close buttons (text or SVG)

    if (openSizeChartBtn && sizeChartModal) { // Check if these elements exist on the current page
        openSizeChartBtn.onclick = function() {
            sizeChartModal.style.display = "block";
        }

        closeModalBtns.forEach(btn => {
            btn.onclick = function() {
                sizeChartModal.style.display = "none";
            }
        });

        // Close modal when clicking outside of the modal content
        window.onclick = function(event) {
            if (event.target == sizeChartModal) {
                sizeChartModal.style.display = "none";
            }
        }
    }


    // --- Drop Registration Form Handling (for register-drop.html) ---
    const registrationForm = document.getElementById('dropRegistrationForm');
    const formMessage = document.getElementById('form-message');

    if (registrationForm && formMessage) { // Check if these elements exist
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission for this demo
            
            const firstName = document.getElementById('firstName').value;
            const email = document.getElementById('email').value;
            const dataPrivacy = document.getElementById('dataPrivacy').checked;

            if (!firstName || !email || !dataPrivacy) {
                formMessage.textContent = 'Bitte fülle alle Pflichtfelder aus und akzeptiere die Datenschutzerklärung.';
                formMessage.className = 'form-message error';
                return;
            }
            
            // Simulate form submission
            formMessage.textContent = `Danke, ${firstName}! Du bist für den Drop registriert. Wir halten dich auf dem Laufenden.`;
            formMessage.className = 'form-message success';
            registrationForm.reset(); // Clear the form
        });
    }

    // --- Journal Articles ---
    const articlesJsonPath = 'blog/data/articles.json'; // Path relative to the HTML file's location
    const articlesBasePath = 'blog/articles/'; 
    const imagesBasePath = 'images/blog/'; 

    // Load Latest Journal Articles on Homepage
    const journalGridHome = document.getElementById('journalGridHome');
    async function loadLatestJournalArticles() {
        if (!journalGridHome) return; // Only run if the homepage journal grid exists

        try {
            const response = await fetch(articlesJsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, trying to fetch ${articlesJsonPath}`);
            }
            const articles = await response.json();
            
            // Sort by ID descending (newest first assuming higher ID is newer)
            articles.sort((a, b) => b.id - a.id); 
            
            const articlesToShow = articles.slice(0, 2); // Show the 2 newest articles

            if (articlesToShow.length > 0) {
                journalGridHome.innerHTML = ''; // Clear loading text or old articles
                articlesToShow.forEach(article => {
                    const postElement = document.createElement('article');
                    postElement.classList.add('journal-post');
                    
                    const imageUrl = `${imagesBasePath}${article.image}`; // Path relative to HTML root
                    const articleUrl = `${articlesBasePath}${article.fileName}`; // Path relative to HTML root

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
            console.error("Konnte Journal-Artikel nicht laden (Homepage):", error);
            if (journalGridHome) { // Check again in case of error during processing
                 journalGridHome.innerHTML = '<p>Fehler beim Laden der Artikel. Bitte überprüfe die Konsole für Details.</p>';
            }
        }
    }
    // Call the function if on the homepage
    if (journalGridHome) {
        loadLatestJournalArticles();
    }

    // Load All Journal Articles on blog.html
    const blogListContainer = document.getElementById('blogListContainer');
    async function loadAllJournalArticles() {
        if (!blogListContainer) return; // Only run if the blog list container exists (on blog.html)

        try {
            const response = await fetch(articlesJsonPath); // Same JSON path
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, trying to fetch ${articlesJsonPath}`);
            }
            const articles = await response.json();

            // Sort by ID descending (newest first)
            articles.sort((a, b) => b.id - a.id);

            if (articles.length > 0) {
                blogListContainer.innerHTML = ''; // Clear loading text
                articles.forEach(article => {
                    const articleElement = document.createElement('article');
                    articleElement.classList.add('blog-list-item'); 
                    
                    const imageUrl = `${imagesBasePath}${article.image}`; // Path relative to HTML root
                    const articleUrl = `${articlesBasePath}${article.fileName}`; // Path relative to HTML root

                    articleElement.innerHTML = `
                        <div class="blog-list-item-image">
                            <a href="${articleUrl}">
                                <img src="${imageUrl}" alt="${article.title}">
                            </a>
                        </div>
                        <div class="blog-list-item-content">
                            <h2><a href="${articleUrl}">${article.title}</a></h2>
                            <p class="blog-list-item-meta">
                                <span class="date">${new Date(article.date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </p>
                            <p class="blog-list-item-excerpt">${article.previewText}</p>
                            <a href="${articleUrl}" class="btn btn-outline btn-small">Weiterlesen</a>
                        </div>
                    `;
                    blogListContainer.appendChild(articleElement);
                });
            } else {
                blogListContainer.innerHTML = '<p>Momentan sind keine Artikel verfügbar.</p>';
            }

        } catch (error) {
            console.error("Konnte alle Journal-Artikel nicht laden (Blog-Seite):", error);
            if (blogListContainer) { // Check again
                blogListContainer.innerHTML = '<p>Fehler beim Laden der Artikel. Bitte versuche es später erneut.</p>';
            }
        }
    }

    // Call the function if on blog.html
    if (blogListContainer) {
        loadAllJournalArticles();
    }

}); // End of DOMContentLoaded