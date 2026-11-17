const dishes = [
  { id: "chow-mein", name: "Chicken chow mein", description: "Wok-tossed noodles, chicken & crisp vegetables", cuisine: "Chinese", image: "photo-1585032226651-759b368d7246", price: 225, tag: "WOK FAVOURITE" },
  { id: "dumplings", name: "Pork dumplings", description: "Pan-seared bites with a savoury dipping sauce", cuisine: "Chinese", image: "photo-1563245372-f21724e3856d", price: 185, tag: "MADE TO SHARE" },
  { id: "teriyaki", name: "Chicken teriyaki bowl", description: "Glazed chicken, rice & fresh greens", cuisine: "Japanese", image: "photo-1546069901-ba9599a7e63c", price: 245, tag: "HOUSE PICK" },
  { id: "sushi", name: "California maki", description: "Crab stick, avocado & cucumber · 8 pcs", cuisine: "Japanese", image: "photo-1579871494447-9811cf80d66c", price: 210, tag: "8 PIECES" },
  { id: "ramen", name: "Miso ramen", description: "Rich miso broth, noodles, egg & spring onion", cuisine: "Japanese", image: "photo-1569718212165-3a8278d5f624", price: 270, tag: "COMFORT BOWL" },
  { id: "bibimbap", name: "Veggie bibimbap", description: "Rice bowl with colourful vegetables & sesame", cuisine: "Korean", image: "photo-1512621776951-a57141f2eefd", price: 235, tag: "VEGGIE PICK" },
  { id: "milk-tea", name: "Classic milk tea", description: "Creamy, chilled & just the right amount of sweet", cuisine: "Drinks", image: "photo-1558857563-b371033873b8", price: 110, tag: "CHILLED" },
  { id: "spring-rolls", name: "Crispy spring rolls", description: "Golden vegetable rolls · 4 pcs", cuisine: "Drinks", image: "photo-1547592180-85f173990554", price: 125, tag: "CRUNCHY SIDE" }
];

const basketKey = "lea-asian-kitchen-basket-v1";
const peso = amount => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(amount);

function readBasket() {
  try {
    const value = JSON.parse(localStorage.getItem(basketKey) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch (error) {
    console.warn("Could not read the sample basket.", error);
    return {};
  }
}

function saveBasket(basket) {
  try {
    localStorage.setItem(basketKey, JSON.stringify(basket));
  } catch (error) {
    console.warn("Could not save the sample basket.", error);
    showNotice("Your basket could not be saved in this browser.");
  }
}

function showNotice(message) {
  let notice = document.querySelector(".site-notice");
  if (!notice) {
    notice = document.createElement("div");
    notice.className = "site-notice";
    notice.setAttribute("role", "status");
    document.body.append(notice);
  }
  notice.textContent = message;
  window.clearTimeout(showNotice.timeout);
  showNotice.timeout = window.setTimeout(() => notice.remove(), 2600);
}

function updateBasketCount() {
  const basket = readBasket();
  const count = Object.values(basket).reduce((sum, quantity) => sum + (Number(quantity) || 0), 0);
  document.getElementById("basket-count").textContent = `(${count})`;
}

function renderDishes(filter = "All") {
  const grid = document.getElementById("product-grid");
  const visible = dishes.filter(dish => filter === "All" || dish.cuisine === filter);
  grid.innerHTML = visible.map(dish => `
    <article class="product-card">
      <div class="product-image"><img src="https://images.unsplash.com/${dish.image}?auto=format&fit=crop&w=650&q=80" alt="${dish.name}" loading="lazy"><span class="product-tag">${dish.tag}</span></div>
      <div class="product-info"><p class="product-cuisine">${dish.cuisine}</p><h3>${dish.name}</h3><p class="product-description">${dish.description}</p><div class="product-bottom"><strong class="product-price">${peso(dish.price)}</strong><button class="add-button" type="button" data-add="${dish.id}" aria-label="Add ${dish.name} to basket">Add to basket <span aria-hidden="true">+</span></button></div></div>
    </article>`).join("");

  grid.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => {
    const basket = readBasket();
    basket[button.dataset.add] = (Number(basket[button.dataset.add]) || 0) + 1;
    saveBasket(basket);
    updateBasketCount();
    renderBasket();
    showNotice(`${dishes.find(dish => dish.id === button.dataset.add).name} added to your basket`);
  }));
}

function renderBasket() {
  const container = document.getElementById("basket-items");
  if (!container) return;
  const basket = readBasket();
  const entries = dishes.filter(dish => Number(basket[dish.id]) > 0);
  const total = entries.reduce((sum, dish) => sum + dish.price * (Number(basket[dish.id]) || 0), 0);
  container.innerHTML = entries.length ? entries.map(dish => `
    <div class="basket-row"><img src="https://images.unsplash.com/${dish.image}?auto=format&fit=crop&w=120&q=75" alt="" loading="lazy"><div><strong>${dish.name}</strong><small>${peso(dish.price)} each</small></div><div class="quantity-control"><button type="button" data-change="-1" data-id="${dish.id}" aria-label="Remove one ${dish.name}">−</button><span>${Number(basket[dish.id])}</span><button type="button" data-change="1" data-id="${dish.id}" aria-label="Add one ${dish.name}">+</button></div></div>`).join("") : '<p class="basket-empty">Your basket is empty for now. Browse the menu and add a dish you love.</p>';
  document.getElementById("basket-total-amount").textContent = peso(total);
  container.querySelectorAll("[data-change]").forEach(button => button.addEventListener("click", () => {
    const current = readBasket();
    const next = (Number(current[button.dataset.id]) || 0) + Number(button.dataset.change);
    if (next > 0) current[button.dataset.id] = next;
    else delete current[button.dataset.id];
    saveBasket(current);
    updateBasketCount();
    renderBasket();
  }));
}

function initFilters() {
  const buttons = document.querySelectorAll(".filter-button");
  buttons.forEach(button => button.addEventListener("click", () => {
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderDishes(button.dataset.filter);
  }));
}

function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-navigation");
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    toggle.querySelector("span").textContent = isOpen ? "Menu" : "Close";
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    toggle.querySelector("span").textContent = "Menu";
  }));
}

function initOrderForm() {
  document.getElementById("order-form").addEventListener("submit", event => {
    event.preventDefault();
    const feedback = document.getElementById("order-feedback");
    const basket = readBasket();
    const quantity = Object.values(basket).reduce((sum, value) => sum + (Number(value) || 0), 0);
    if (!quantity) {
      feedback.textContent = "Your basket is empty. Add a dish from the menu first.";
      return;
    }
    const name = new FormData(event.currentTarget).get("name").trim();
    feedback.textContent = `Thanks, ${name}! Your sample order is ready for review. This demo does not send or place real orders.`;
    event.currentTarget.reset();
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
renderDishes();
renderBasket();
updateBasketCount();
initFilters();
initMobileMenu();
initOrderForm();
