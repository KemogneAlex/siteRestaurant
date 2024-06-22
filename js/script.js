// Sélection des éléments du DOM
let searchForm = document.querySelector(".search-form-container");
let cart = document.querySelector(".shopping-cart-container");
let signupForm = document.querySelector(".signup-form-container");
let loginForm = document.querySelector(".login-form-container");
let navbar = document.querySelector(".header .navbar");

// Fonction pour obtenir les données du panier de localStorage de manière sécurisée
function getCartData() {
  try {
    let data = localStorage.getItem("cart");
    return JSON.parse(data);
  } catch (e) {
    console.error("Erreur lors de l'accès à localStorage:", e);
    return [];
  }
}

// Fonction pour valider la quantité
function isValidQuantity(quantity) {
  return Number.isInteger(quantity) && quantity > 0;
}

// Fonction pour mettre à jour le prix total d'un article
function updateItemTotal(itemElement, quantity, price) {
  let total = quantity * price;
  itemElement.querySelector(".product-total").textContent =
    total.toFixed(2) + " €";
}

// Fonction pour charger le panier
function loadCart() {
  let cartItemsData = getCartData();
  if (cartItemsData) {
    let cartItemsHTML = cartItemsData.map(createCartItemHTML).join("");
    document.querySelector(
      ".shopping-cart-container .box-container"
    ).innerHTML = cartItemsHTML;
    attachEventListenersToQuantityInputs();
  }
}

// Fonction pour créer le HTML d'un article du panier
function createCartItemHTML(itemData) {
  return `
    <div class="box">
      <i class="fas fa-times" onclick="removeFromCart(this)"></i>
      <img src="${itemData.productImageSrc}" alt="${itemData.productName}">
      <div class="content">
        <h3>${itemData.productName}</h3>
        <span> Quantité : </span>
        <input type="number" value="${
          itemData.quantity
        }" min="1" class="quantity-input">
        <br>
        <span> Prix : </span>
        <span class="price sale-price">${itemData.productPrice} €</span>
        <br>
        <span> Prix total : </span>
        <span class="product-total">${(
          itemData.productPrice * itemData.quantity
        ).toFixed(2)} €</span>
      </div>
    </div>
  `;
}

// Fonction pour attacher les écouteurs d'événements aux entrées de quantité
function attachEventListenersToQuantityInputs() {
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      let quantity = parseInt(this.value, 10);
      if (isValidQuantity(quantity)) {
        let price = parseFloat(
          this.closest(".box").querySelector(".price").textContent
        );
        updateItemTotal(this.closest(".box"), quantity, price);
        saveCartToLocalStorage();
      } else {
        alert("Quantité invalide");
        this.value = 1;
      }
    });
  });
}

// Appel initial pour charger le panier
loadCart();

/**
 * Sauvegarde les articles du panier dans localStorage.
 */
function saveCartToLocalStorage() {
  try {
    let cartItems = document.querySelectorAll(".shopping-cart-container .box");
    let cartItemsData = [];
    cartItems.forEach((item) => {
      let productName = item.querySelector("h3").textContent;
      let productPrice = parseFloat(
        item.querySelector(".sale-price").textContent.replace("€", "")
      ).toFixed(2);
      let productImageSrc = item.querySelector("img").src;
      let quantity = parseInt(item.querySelector(".quantity-input").value, 10);

      cartItemsData.push({
        productName,
        productPrice,
        productImageSrc,
        quantity,
      });
    });
    localStorage.setItem("cart", JSON.stringify(cartItemsData));
  } catch (error) {
    console.error(
      "Erreur lors de la sauvegarde du panier dans localStorage:",
      error
    );
  }
}

/**
 * Affiche une notification à l'utilisateur.
 * @param {string} message - Le message à afficher dans la notification.
 */
function showNotification(message) {
  let notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialisation des éléments interactifs après le chargement du DOM
document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("search-btn");
  const cartBtn = document.getElementById("cart-btn");
  const searchFormContainer = document.querySelector(".search-form-container");
  const shoppingCartContainer = document.querySelector(
    ".shopping-cart-container"
  );
  const loginBtn = document.getElementById("login-btn");
  const createAccountLink = document.getElementById("create-account-link");
  const loginFormContainer = document.querySelector(".login-form-container");
  const signupFormContainer = document.querySelector(".signup-form-container");
  const containers = [
    searchFormContainer,
    shoppingCartContainer,
    loginFormContainer,
    signupFormContainer,
  ];

  searchBtn.addEventListener("click", function () {
    toggleVisibility(searchFormContainer);
  });

  cartBtn.addEventListener("click", function () {
    toggleVisibility(shoppingCartContainer);
  });

  loginBtn.addEventListener("click", function () {
    toggleVisibility(loginFormContainer);
  });

  createAccountLink.addEventListener("click", function (event) {
    event.preventDefault();
    loginFormContainer.classList.add("hidden");
    toggleVisibility(signupFormContainer);
  });

  function closeAllContainers(exceptElement) {
    containers.forEach(function (container) {
      if (container !== exceptElement) {
        container.classList.add("hidden");
        container.classList.remove("active");
        container.setAttribute("hidden", "");
      }
    });
  }
  function toggleVisibility(element) {
    if (
      element.classList.contains("hidden") ||
      element.hasAttribute("hidden")
    ) {
      closeAllContainers(element);
      element.classList.remove("hidden");
      element.removeAttribute("hidden");
      element.classList.add("active");
    } else {
      element.classList.add("hidden");
      element.classList.remove("active");
      element.setAttribute("hidden", "");
    }
  }

  // Effet parallaxe pour l'image d'accueil
  const homeElement = document.querySelector(".home");
  const parallaxImage = homeElement.querySelector(".home-parallax-img");

  homeElement.onmousemove = (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 90;
    const y = (window.innerHeight - e.pageY * 2) / 90;
    parallaxImage.style.transform = `translateX(${y}px) translateY(${x}px)`;
  };

  homeElement.onmouseleave = () => {
    parallaxImage.style.transform = `translateX(0px) translateY(0px)`;
  };

  // Initialisation du panier comme vide
  const cartItemsContainer = document.querySelector(
    ".shopping-cart-container .box-container"
  );
  cartItemsContainer.innerHTML = "";

  // Fermer la barre de navigation lors du défilement
  window.onscroll = () => {
    closeAllContainers();
  };

  // Appel des fonctions nécessaires après le chargement complet de la page.
  attachEventListenersToButtons();
  attachEventListenersToQuantityInputs();
  validateQuantityInputs();
  updateCart();
});

/**
 * Ferme tous les conteneurs actifs sauf celui spécifié.
 * @param {HTMLElement} except - L'élément à ne pas fermer.
 */
function closeAllContainers(except) {
  let containers = [searchForm, cart, loginForm, signupForm, navbar];
  containers.forEach((container) => {
    if (except !== container) {
      container.classList.remove("active");
      container.classList.add("hidden");
    }
  });
}

// Fonction pour ajouter des produits au panier
function addToCart(event) {
  event.preventDefault();
  let button = event.target;

  // Trouver le conteneur du produit
  let productContainer = button.closest(".box");
  if (!productContainer) {
    console.error("Conteneur du produit introuvable.");
    return;
  }

  // Récupérer le nom du produit
  let productName = productContainer.querySelector("h3").textContent.trim();

  // Vérifier si le produit est déjà dans le panier
  if (isProductInCart(productName)) {
    alert("Ce produit est déjà dans votre panier !");
    return;
  }

  // Récupérer le prix du produit
  let productPriceElement = productContainer.querySelector(".price");
  if (!productPriceElement) {
    console.error("Élément de prix introuvable.");
    return;
  }
  let productPrice = parseFloat(
    productPriceElement.textContent.replace("€", "").trim()
  );

  // Récupérer l'image du produit
  let productImageElement = productContainer.querySelector(".image img");
  if (!productImageElement) {
    console.error("Élément d'image du produit introuvable.");
    return;
  }
  let productImageSrc = productImageElement.src.trim();

  // Construire l'élément HTML du panier
  let cartItemsContainer = document.querySelector(
    ".shopping-cart-container .box-container"
  );
  if (!cartItemsContainer) {
    console.error("Conteneur des articles du panier introuvable.");
    return;
  }

  let cartItemHTML = `
    <div class="box">
      <a href="#" class="fas fa-times" onclick="removeFromCart(this); event.preventDefault();"></a>
      <img src="${productImageSrc}" alt="${productName}">
      <div class="content">
        <h3>${productName}</h3>
        <span> Quantité : </span>
        <input type="number" value="1" min="1" class="quantity-input">
        <br>
        <span> Prix : </span>
        <span class="price">${productPrice.toFixed(2)} €</span>
        <br>
        <span> Prix total : </span>
        <span class="product-total">${productPrice.toFixed(2)} €</span>
      </div>
    </div>
  `;

  cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);

  attachEventListenersToQuantityInputs();
  saveCartToLocalStorage();
  showNotification("Produit ajouté au panier avec succès !");
}

// Fonction pour supprimer des produits du panier
function removeFromCart(element) {
  let cartItem = element.closest(".box");
  if (!cartItem) {
    console.error("Élément du panier introuvable.");
    return;
  }

  cartItem.remove();

  saveCartToLocalStorage();
  updateCart();
  showNotification("Produit retiré du panier avec succès !");
}

// Fonction pour vérifier si un produit est déjà dans le panier
function isProductInCart(productName) {
  let cartItems = document.querySelectorAll(".shopping-cart-container .box h3");
  for (let item of cartItems) {
    if (item.textContent.trim() === productName) {
      return true;
    }
  }
  return false;
}

// Fonction pour mettre à jour les quantités et les totaux des produits dans le panier
function updateCart() {
  let cartItemsContainer = document.querySelector(
    ".shopping-cart-container .box-container"
  );
  if (!cartItemsContainer) {
    console.error("Conteneur des articles du panier introuvable.");
    return;
  }

  let cartItems = cartItemsContainer.querySelectorAll(".box");
  let cartTotal = 0;
  cartItems.forEach((cartItem) => {
    let quantityInput = cartItem.querySelector(".quantity-input");
    let priceElement = cartItem.querySelector(".price");
    let totalElement = cartItem.querySelector(".product-total");

    if (!quantityInput || !priceElement || !totalElement) {
      console.error("Élément de quantité, de prix ou de total introuvable.");
      return;
    }

    let quantity = parseInt(quantityInput.value);
    let price = parseFloat(priceElement.textContent.replace("€", "").trim());
    let total = quantity * price;

    totalElement.textContent = total.toFixed(2) + " €";
    cartTotal += total;
  });

  let cartTotalElement = document.querySelector(".cart-total .total span");
  if (cartTotalElement) {
    cartTotalElement.textContent = cartTotal.toFixed(2) + " €";
  }
}

// Fonction pour attacher des écouteurs d'événements aux nouvelles entrées de quantité
function attachEventListenersToQuantityInputs() {
  document
    .querySelectorAll(".shopping-cart-container .quantity-input")
    .forEach((input) => {
      input.addEventListener("input", () => {
        if (parseInt(input.value) < 1) {
          input.value = 1;
        }
        updateCart();
        saveCartToLocalStorage();
      });
    });
}

// Fonction pour enregistrer le panier dans le localStorage
function saveCartToLocalStorage() {
  let cartItems = document.querySelector(
    ".shopping-cart-container .box-container"
  ).innerHTML;
  localStorage.setItem("cartItems", cartItems);
}

// Fonction pour afficher une notification
function showNotification(message) {
  alert(message);
}
document.addEventListener("DOMContentLoaded", () => {
  attachEventListenersToQuantityInputs();
  updateCart();
});
