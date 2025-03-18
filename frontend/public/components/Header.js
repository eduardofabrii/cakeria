class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <header class="header">
        <div class="container">
          <div class="logo-container">
            <img src="/assets/logo_cakeria.png" alt="Cakeria Logo" class="header-logo">
          </div>
          
          <nav class="nav-bar">
            <ul class="nav-links">
              <li><a href="/" class="nav-link" data-route="home"><i class="fa-solid fa-home"></i> Home</a></li>
              <li><a href="/produtos" class="nav-link" id="nav-produtos" data-route="produtos"><i class="fa-solid fa-cake-candles"></i> Produtos</a></li>
              <li><a href="/categorias" class="nav-link" id="nav-categorias" data-route="categorias"><i class="fa-solid fa-tags"></i> Categorias</a></li>
            </ul>
          </nav>
          
          <div class="auth-buttons">
            <button class="login-btn" data-route="login">
              <i class="fa-solid fa-user"></i> Login
            </button>
          </div>
          
          <button class="menu-toggle" aria-label="Menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
        </div>
        <div class="overlay"></div>
      </header>
    `;
  }

  async connectedCallback() {
    try {
      // Carregar o HTML do arquivo separado
      const response = await fetch("/components/Header.html");
      if (!response.ok) {
        throw new Error(
          `Erro ao carregar o template do Header: ${response.status}`
        );
      }

      const html = await response.text();
      this.innerHTML = html;

      // Configurar os event listeners depois que o HTML foi carregado
      this.setupEventListeners();
      this.highlightCurrentPage();
    } catch (error) {
      console.error("Não foi possível carregar o componente Header:", error);
      this.innerHTML = "<p>Erro ao carregar o componente Header</p>";
    }
  }

  setupEventListeners() {
    const links = this.querySelectorAll(".nav-link");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const route = link.getAttribute("data-route");

        // Remover classe 'active' de todos os links
        links.forEach((l) => l.classList.remove("active"));

        // Adicionar classe 'active' ao link clicado
        link.classList.add("active");
        
        // Fechar o menu mobile se estiver aberto
        this.closeMenu();

        // Navegar para a rota
        if (route === "home") {
          window.location.href = "/";
        } else if (route === "produtos") {
          window.navegarParaProdutos();
        } else if (route === "categorias") {
          window.navegarParaCategorias();
        }
      });
    });

    const navItems = this.querySelectorAll(".nav-link, .login-btn");
    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const route = item.getAttribute("data-route");

        // Remover classe 'active' de todos os links
        navItems.forEach((l) => l.classList.remove("active"));

        // Adicionar classe 'active' ao item clicado
        item.classList.add("active");

        // Navegar para a rota
        this.navigateToRoute(route);
      });
    });

    // Adicionar eventos para os botões de autenticação
    const loginBtn = this.querySelector(".login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        this.closeMenu();
        window.navegarParaLogin();
      });
    }

    // Melhorado toggle do menu mobile com overlay
    this.setupMobileMenu();
  }
  
  setupMobileMenu() {
    const menuToggle = this.querySelector(".menu-toggle");
    const navBar = this.querySelector(".nav-bar");
    const overlay = this.querySelector(".overlay");
    
    if (menuToggle && navBar && overlay) {
      menuToggle.addEventListener("click", () => {
        this.toggleMenu();
      });
      
      // Fechar menu ao clicar no overlay
      overlay.addEventListener("click", () => {
        this.closeMenu();
      });
      
      // Fechar menu ao pressionar ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeMenu();
        }
      });
      
      // Ajustar menu ao redimensionar a janela
      window.addEventListener("resize", () => {
        if (window.innerWidth > 900 && navBar.classList.contains("active")) {
          this.closeMenu();
        }
      });
    }
  }
  
  toggleMenu() {
    const navBar = this.querySelector(".nav-bar");
    const menuToggle = this.querySelector(".menu-toggle");
    const overlay = this.querySelector(".overlay");
    
    navBar.classList.toggle("active");
    menuToggle.classList.toggle("active");
    overlay.classList.toggle("active");
    
    if (navBar.classList.contains("active")) {
      document.body.style.overflow = "hidden"; // Impedir rolagem
    } else {
      document.body.style.overflow = ""; // Restaurar rolagem
    }
  }
  
  closeMenu() {
    const navBar = this.querySelector(".nav-bar");
    const menuToggle = this.querySelector(".menu-toggle");
    const overlay = this.querySelector(".overlay");
    
    if (navBar && navBar.classList.contains("active")) {
      navBar.classList.remove("active");
      menuToggle.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = ""; // Restaurar rolagem
    }
  }

  navigateToRoute(route) {
    switch (route) {
      case "home":
        window.location.href = "/";
        break;
      case "produtos":
        window.navegarParaProdutos();
        break;
      case "categorias":
        window.navegarParaCategorias();
        break;
      case "login":
        window.navegarParaLogin();
        break;
      case "registro":
        window.navegarParaRegistro();
        break;
      default:
        console.warn(`Rota desconhecida: ${route}`);
    }
  }

  highlightCurrentPage() {
    const path = window.location.pathname;
    const links = this.querySelectorAll(".nav-link");

    links.forEach((link) => {
      link.classList.remove("active");

      if (
        (path === "/" && link.getAttribute("data-route") === "home") ||
        (path.includes("/produtos") &&
          link.getAttribute("data-route") === "produtos") ||
        (path.includes("/categorias") &&
          link.getAttribute("data-route") === "categorias")
      ) {
        link.classList.add("active");
      }
    });

    const navItems = this.querySelectorAll(".nav-link, .login-btn");

    navItems.forEach((item) => {
      item.classList.remove("active");

      const route = item.getAttribute("data-route");
      if (
        (path === "/" && route === "home") ||
        (path.includes("/produtos") && route === "produtos") ||
        (path.includes("/categorias") && route === "categorias") ||
        (path.includes("/login") && route === "login")
      ) {
        item.classList.add("active");
      }
    });
  }
}

customElements.define("header-component", Header);