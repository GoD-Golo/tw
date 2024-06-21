// JavaScript for hamburger menu

const hamburger = document.querySelector(".hamburger-icon");
const nav = document.querySelector(".hamburger");

hamburger.addEventListener("click", function () {
  console.log("clicked");
  nav.classList.toggle("active");
});

// Produse
document.addEventListener("DOMContentLoaded", () => {
  const filterButton = document.getElementById("filter-button");
  const sortAscButton = document.getElementById("sort-asc");
  const sortDescButton = document.getElementById("sort-desc");
  const calcButton = document.getElementById("calc-button");
  const resetButton = document.getElementById("reset-button");

  const nameFilter = document.getElementById("name-filter");
  const descriptionFilter = document.getElementById("description-filter");
  const newsFilter = document.getElementById("news-filter");
  const priceRange = document.getElementById("price-range");
  const priceRangeValue = document.getElementById("price-range-value");
  const categoryFilter = document.getElementById("category-filter");
  const textareaFilter = document.getElementById("textarea-filter");

  priceRange.addEventListener("input", () => {
    priceRangeValue.textContent = priceRange.value;
  });

  filterButton.addEventListener("click", () => {
    const name = nameFilter.value.toLowerCase();
    const description = descriptionFilter.value.toLowerCase();
    const isNew = newsFilter.checked;
    const maxPrice = parseFloat(priceRange.value);
    const category = categoryFilter.value;
    const fullDescription = textareaFilter.value.toLowerCase();
    const products = document.querySelectorAll(".product-item");

    products.forEach((product) => {
      const productName = product
        .querySelector(".product-name")
        .textContent.toLowerCase();
      const productDescription = product
        .querySelector(".product-description")
        .textContent.toLowerCase();
      const isNewProduct = product.getAttribute("data-is-new") === "true";
      const productPrice = parseFloat(
        product.querySelector("li:nth-child(1)").textContent.split(": ")[1]
      );
      const productCategory = product
        .querySelector(".product-category")
        .textContent.split(": ")[1]
        .toLowerCase();
      const productFullDescription = product
        .querySelector(".product-description")
        .textContent.toLowerCase();

      const matchesName = productName.includes(name);
      const matchesDescription = productDescription.includes(description);
      const matchesNew = !isNew || isNewProduct;
      const matchesPrice = productPrice <= maxPrice;
      const matchesCategory =
        !category || productCategory === category.toLowerCase();
      const matchesFullDescription =
        productFullDescription.includes(fullDescription);

      if (
        matchesName &&
        matchesDescription &&
        matchesNew &&
        matchesPrice &&
        matchesCategory &&
        matchesFullDescription
      ) {
        product.style.display = "";
      } else {
        product.style.display = "none";
      }
    });
  });

  sortAscButton.addEventListener("click", () => {
    sortProducts(true);
  });

  sortDescButton.addEventListener("click", () => {
    sortProducts(false);
  });

  calcButton.addEventListener("click", () => {
    const products = document.querySelectorAll(".product-item");
    let totalPrice = 0;
    let count = 0;

    products.forEach((product) => {
      if (product.style.display !== "none") {
        const productPrice = parseFloat(
          product.querySelector("li:nth-child(1)").textContent.split(": ")[1]
        );
        totalPrice += productPrice;
        count++;
      }
    });

    const avgPrice = totalPrice / count;
    const calcDiv = document.createElement("div");
    calcDiv.textContent = `Prețul mediu: ${avgPrice.toFixed(2)}`;
    calcDiv.style.position = "fixed";
    calcDiv.style.bottom = "10px";
    calcDiv.style.right = "10px";
    calcDiv.style.backgroundColor = "white";
    calcDiv.style.border = "1px solid black";
    calcDiv.style.padding = "10px";

    document.body.appendChild(calcDiv);

    setTimeout(() => {
      calcDiv.remove();
    }, 2000);
  });

  resetButton.addEventListener("click", () => {
    if (confirm("Ești sigur că vrei să resetezi filtrele?")) {
      nameFilter.value = "";
      descriptionFilter.value = "";
      newsFilter.checked = false;
      priceRange.value = 500;
      priceRangeValue.textContent = 500;
      categoryFilter.value = "";
      textareaFilter.value = "";

      const products = document.querySelectorAll(".product-item");
      products.forEach((product) => {
        product.style.display = "";
      });
    }
  });

  function sortProducts(asc) {
    const productContainer = document.getElementById("product-container");
    const products = Array.from(
      productContainer.querySelectorAll(".product-item")
    );

    products.sort((a, b) => {
      const nameA = a.querySelector(".product-name").textContent;
      const nameB = b.querySelector(".product-name").textContent;
      if (nameA < nameB) return asc ? -1 : 1;
      if (nameA > nameB) return asc ? 1 : -1;
      return 0;
    });

    products.forEach((product) => productContainer.appendChild(product));
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const productItems = document.querySelectorAll(".product-item");

  productItems.forEach((item) => {
    item.children[0].children[0].addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      console.log(productId);
      window.location.href = `/produs/${productId}`;
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Verifică tema stocată în localStorage
  const currentTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(currentTheme + "-mode");

  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Setează iconul corespunzător
  if (currentTheme === "dark") {
    themeIcon.classList.remove("bi-sun");
    themeIcon.classList.add("bi-moon");
  } else {
    themeIcon.classList.remove("bi-moon");
    themeIcon.classList.add("bi-sun");
  }

  themeToggleBtn.addEventListener("click", function () {
    let theme = "light";
    if (document.body.classList.contains("light-mode")) {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      themeIcon.classList.remove("bi-sun");
      themeIcon.classList.add("bi-moon");
      theme = "dark";
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      themeIcon.classList.remove("bi-moon");
      themeIcon.classList.add("bi-sun");
    }
    // Salvează tema în localStorage
    localStorage.setItem("theme", theme);
  });
});

// Handle accordion state
const accordions = document.querySelectorAll(".accordion-collapse");
accordions.forEach((accordion) => {
  const id = accordion.getAttribute("id");
  const isOpen = localStorage.getItem(id);
  if (isOpen === "true") {
    accordion.classList.add("show");
  }
  accordion.addEventListener("shown.bs.collapse", () => {
    localStorage.setItem(id, "true");
  });
  accordion.addEventListener("hidden.bs.collapse", () => {
    localStorage.setItem(id, "false");
  });
});

// animatie banner si cookies
document.addEventListener("DOMContentLoaded", (event) => {
  const banner = document.getElementById("banner");
  const okCookiesButton = document.getElementById("ok_cookies");

  // Funcții pentru manipularea cookie-urilor
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length, c.length);
      }
    }
    return "";
  }

  function deleteCookie(name) {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  function deleteAllCookies() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  // Verifică dacă cookie-ul pentru acceptarea bannerului există
  if (!getCookie("accept_cookies")) {
    banner.classList.add("show");
  }

  // Setează cookie-ul și ascunde bannerul la click pe butonul "Ok"
  okCookiesButton.addEventListener("click", () => {
    setCookie("accept_cookies", "true", 0.5); // Expiră după 12 ore
    banner.style.display = "none";
  });

  // Setează alte cookie-uri
  function setLastVisitedProduct(productId) {
    setCookie("last_visited_product", productId, 1); // Expiră după 1 zi
  }

  function setLastFilters(filters) {
    setCookie("last_filters", JSON.stringify(filters), 1); // Expiră după 1 zi
  }

  function setLastPage(page) {
    setCookie("last_page", page, 1); // Expiră după 1 zi
  }

  // Exemplu de setare a altor cookie-uri
  const productId = 123; // Înlocuiește cu ID-ul real al produsului
  setLastVisitedProduct(productId);

  const filters = { price: 100, category: "Electronics" }; // Înlocuiește cu filtrele reale
  setLastFilters(filters);

  const lastPage = "home"; // Înlocuiește cu pagina reală
  setLastPage(lastPage);

  // Afișează informații referitoare la cookie-uri în UI
  const lastVisitedProduct = getCookie("last_visited_product");
  const lastFilters = getCookie("last_filters");
  const lastPageVisited = getCookie("last_page");

  if (lastVisitedProduct) {
    console.log("Ultimul produs accesat:", lastVisitedProduct);
    // Afișează informația în UI, de exemplu în pagina de profil a utilizatorului
  }

  if (lastFilters) {
    console.log("Ultimele filtre setate:", JSON.parse(lastFilters));
    // Afișează informația în UI, de exemplu în pagina de produse
  }

  if (lastPageVisited) {
    console.log("Ultima pagină accesată:", lastPageVisited);
    // Afișează informația în UI, de exemplu pe prima pagină
  }

  // Funcții disponibile global
  window.deleteCookie = deleteCookie;
  window.deleteAllCookies = deleteAllCookies;
});

document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    const parola = document.getElementById("parola").value;
    const reintroducereParola = document.getElementById(
      "reintroducere_parola"
    ).value;

    if (parola !== reintroducereParola) {
      alert("Parolele nu se potrivesc!");
      event.preventDefault();
      return;
    }

    const parolaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{2,})(?=.*\.).{8,}$/;
    if (!parolaRegex.test(parola)) {
      alert(
        "Parola trebuie să conțină minim o literă mare, o literă mică, 2 cifre și caracterul punct."
      );
      event.preventDefault();
    }
  });
