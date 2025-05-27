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
    } else if (pageTitle.includes("Unsere Kollektion - Alle Produkte")) { // Shop overview page
        document.title = `Unsere Kollektion - Alle Produkte - ${brandName}`;
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
    // Get the current file name or default to 'index.html' for root path
    let currentPath = window.location.pathname.split("/").pop();
    if (currentPath === "" || currentPath === "/") { // If root path
        currentPath = 'index.html';
    }
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Get the file name from the link, default to 'index.html' for root or empty hrefs
        let linkPath = linkHref.split("/").pop().split("#")[0];
        if (linkPath === "" && (linkHref === "/" || linkHref === "index.html")) {
            linkPath = 'index.html';
        }

        // Remove active class from all first to ensure clean state for full page links
        // link.classList.remove('active'); // Let scroll logic handle homepage section active states

        if (linkPath === currentPath) {
            // For direct page matches (like blog.html, shop.html), add 'active'
            // For index.html, the scroll logic will handle section-specific active states
            if (currentPath !== 'index.html') {
                link.classList.add('active');
            }
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
            const sectionTop = section.offsetTop - navbarHeight - 50; 
            if (pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref.startsWith('#') || linkHref.startsWith('index.html#')) {
                link.classList.remove('active'); 
                if (linkHref.split('#')[1] === currentSectionId) {
                    link.classList.add('active');
                }
            }
        });
    }
    
    if (isHomepage && sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', changeNavOnScroll);
        changeNavOnScroll(); 
    }


    // --- Size Chart Modal Logic (for register-drop.html) ---
    const sizeChartModal = document.getElementById("sizeChartModal");
    const openSizeChartBtn = document.getElementById("openSizeChartBtn");
    const closeModalBtns = document.querySelectorAll(".close-modal-btn"); 

    if (openSizeChartBtn && sizeChartModal) { 
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

    if (registrationForm && formMessage) { 
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

    // --- Journal Articles ---
    const articlesJsonPath = 'blog/data/articles.json'; 
    const articlesBasePath = 'blog/articles/'; 
    const blogImagesBasePath = 'images/blog/'; 

    // Load Latest Journal Articles on Homepage
    const journalGridHome = document.getElementById('journalGridHome');
    async function loadLatestJournalArticles() {
        if (!journalGridHome) return; 

        try {
            const response = await fetch(articlesJsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, trying to fetch ${articlesJsonPath}`);
            }
            const articles = await response.json();
            articles.sort((a, b) => b.id - a.id); 
            const articlesToShow = articles.slice(0, 2); 

            if (articlesToShow.length > 0) {
                journalGridHome.innerHTML = ''; 
                articlesToShow.forEach(article => {
                    const postElement = document.createElement('article');
                    postElement.classList.add('journal-post');
                    const imageUrl = `${blogImagesBasePath}${article.image}`; 
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
            console.error("Konnte Journal-Artikel nicht laden (Homepage):", error);
            if (journalGridHome) { 
                 journalGridHome.innerHTML = '<p>Fehler beim Laden der Artikel. Bitte überprüfe die Konsole für Details.</p>';
            }
        }
    }
    if (journalGridHome) {
        loadLatestJournalArticles();
    }

    // Load All Journal Articles on blog.html
    const blogListContainer = document.getElementById('blogListContainer');
    async function loadAllJournalArticles() {
        if (!blogListContainer) return; 

        try {
            const response = await fetch(articlesJsonPath); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, trying to fetch ${articlesJsonPath}`);
            }
            const articles = await response.json();
            articles.sort((a, b) => b.id - a.id);

            if (articles.length > 0) {
                blogListContainer.innerHTML = ''; 
                articles.forEach(article => {
                    const articleElement = document.createElement('article');
                    articleElement.classList.add('blog-list-item'); 
                    const imageUrl = `${blogImagesBasePath}${article.image}`; 
                    const articleUrl = `${articlesBasePath}${article.fileName}`; 
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
            if (blogListContainer) { 
                blogListContainer.innerHTML = '<p>Fehler beim Laden der Artikel. Bitte versuche es später erneut.</p>';
            }
        }
    }
    if (blogListContainer) {
        loadAllJournalArticles();
    }

    // --- Shop Products ---
    const productsJsonPath = 'blog/data/products.json'; // Assuming products.json is in the same data folder as articles.json
                                                     // Change to 'data/products.json' if you created a separate data folder in root
    const productImagesBasePath = 'images/products/'; 
    const productListContainer = document.getElementById('productListContainer');

    async function loadAllProducts() {
        if (!productListContainer) return; 

        try {
            const response = await fetch(productsJsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, trying to fetch ${productsJsonPath}`);
            }
            const products = await response.json();

            // Optional: Default sorting if needed, e.g., by name or a 'featured' flag
            // products.sort((a, b) => a.name.localeCompare(b.name));

            if (products.length > 0) {
                productListContainer.innerHTML = ''; 
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card-list-item'); 

                    const imageUrl = `${productImagesBasePath}${product.image}`;
                    // Link to the future detail page - ensure you create a 'products' subfolder for these HTML files
                    const productDetailUrl = `products/${product.detailsPage}`; 

                    productCard.innerHTML = `
                        <a href="${productDetailUrl}" class="product-image-link">
                            <img src="${imageUrl}" alt="${product.name}">
                        </a>
                        <div class="product-info">
                            <h3><a href="${productDetailUrl}">${product.name}</a></h3>
                            <p class="product-category">${product.category}</p>
                            <p class="product-short-desc">${product.shortDescription}</p>
                            <p class="price">${product.price.toFixed(2).replace('.', ',')} €</p>
                            <a href="${productDetailUrl}" class="btn btn-secondary">Details ansehen</a>
                            <!-- <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">In den Warenkorb</button> -->
                        </div>
                    `;
                    productListContainer.appendChild(productCard);
                });
            } else {
                productListContainer.innerHTML = '<p>Momentan sind keine Produkte verfügbar.</p>';
            }
        } catch (error) {
            console.error("Konnte Produkte nicht laden (Shop-Seite):", error);
            if (productListContainer) {
                productListContainer.innerHTML = '<p>Fehler beim Laden der Produkte. Bitte versuche es später erneut.</p>';
            }
        }
    }
    if (productListContainer) {
        loadAllProducts();
    }

}); // End of DOMContentLoaded