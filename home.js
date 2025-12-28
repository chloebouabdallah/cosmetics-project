const menuToggle = document.getElementById('menu-toggle');
const navOverlay = document.getElementById('nav-overlay');

menuToggle.addEventListener('click', () => {
  navOverlay.classList.toggle('active');
  menuToggle.classList.toggle('active');

  // Toggle icon between ☰ and ✖
  if (menuToggle.classList.contains('active')) {
    menuToggle.innerHTML = "&times;";
  } else {
    menuToggle.innerHTML = "&#9776;";
  }
});




  document.querySelector(".email-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = e.target.querySelector("input").value;
  alert("Thanks for subscribing with: " + email);
  e.target.reset(); // clear the field
});




const revealElements = document.querySelectorAll('.scroll-reveal');

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
  el.classList.add('revealed');
} else {
  el.classList.remove('revealed');
}

  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); 

document.addEventListener('DOMContentLoaded', () => {
  const cartDrawer = document.getElementById('cartDrawer');
  const closeCartBtn = document.getElementById('closeCart');
  const iconCart = document.querySelector('.icon-cart');
  const emptyState = document.getElementById('emptyState');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartButtons = document.querySelectorAll('.cart');
  const cartCounter = document.querySelector('.icon-cart span');

  let cartCount = 0;

  // Create cart item element
  function createCartItem({ name, price, imgSrc, quantity }) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${imgSrc}" alt="${name}" class="cart-img">
      <div class="cart-info">
        <p><strong>${name}</strong></p>
        <p>$${price.toFixed(2)}</p>
        <div class="qty-controls">
          <button class="minus">-</button>
          <input type="number" value="${quantity}" readonly>
          <button class="plus">+</button>
        </div>
      </div>
      <p class="cart-total">$${(price * quantity).toFixed(2)}</p>
      <div class="bin">
        <ion-icon name="trash-bin-outline"></ion-icon>
      </div>
    `;
    attachCartItemEvents(cartItem, price);
    return cartItem;
  }

  function attachCartItemEvents(cartItem, price) {
    const input = cartItem.querySelector('input');
    const minusBtn = cartItem.querySelector('.minus');
    const plusBtn = cartItem.querySelector('.plus');
    const total = cartItem.querySelector('.cart-total');

    minusBtn.addEventListener('click', () => {
      let qty = parseInt(input.value);
      if (qty > 1) {
        qty--;
        input.value = qty;
        total.textContent = `$${(qty * price).toFixed(2)}`;
        updateEstimatedTotal();
        saveCartToLocalStorage();
      }
    });

    plusBtn.addEventListener('click', () => {
      let qty = parseInt(input.value);
      qty++;
      input.value = qty;
      total.textContent = `$${(qty * price).toFixed(2)}`;
      updateEstimatedTotal();
      saveCartToLocalStorage();
    });

    cartItem.querySelector('.bin').addEventListener('click', () => {
      cartItem.remove();
      cartCount--;
      cartCounter.textContent = cartCount;
      updateEstimatedTotal();
      updateEmptyState();
      saveCartToLocalStorage();
    });
  }

  function updateEstimatedTotal() {
    let newTotal = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
      const itemPrice = parseFloat(item.querySelector('.cart-total').textContent.replace('$', ''));
      newTotal += itemPrice;
    });
    document.getElementById('estimatedTotal').textContent = `$${newTotal.toFixed(2)} USD`;
  }

  function updateEmptyState() {
    if (cartItemsContainer.children.length === 0) {
      emptyState.style.display = 'block';
      cartItemsContainer.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      cartItemsContainer.style.display = 'block';
    }
  }

  function saveCartToLocalStorage() {
    const items = [];
    document.querySelectorAll('.cart-item').forEach(item => {
      const name = item.querySelector('.cart-info strong').textContent;
      const price = parseFloat(item.querySelector('.cart-info p:nth-child(2)').textContent.replace('$', ''));
      const imgSrc = item.querySelector('.cart-img').src;
      const quantity = parseInt(item.querySelector('input').value);
      items.push({ name, price, imgSrc, quantity });
    });
    localStorage.setItem('cartItems', JSON.stringify(items));
  }

  function loadCartFromLocalStorage() {
    const savedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    savedItems.forEach(data => {
      const cartItem = createCartItem(data);
      cartItemsContainer.appendChild(cartItem);
      cartCount += 1;
    });
    cartCounter.textContent = cartCount;
    updateEstimatedTotal();
    updateEmptyState();
  }

  // Open/close cart drawer
  iconCart.addEventListener('click', () => {
    cartDrawer.classList.add('open');
  });

  closeCartBtn.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
  });

  // Add new product to cart from buttons
  cartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      const imgSrc = button.getAttribute('data-img');

      const existingItems = Array.from(cartItemsContainer.children);
      const alreadyInCart = existingItems.some(item =>
        item.querySelector('.cart-info strong').textContent === name
      );

      if (alreadyInCart) {
        alert("This item is already in your cart.");
        return;
      }

      const newItem = createCartItem({ name, price, imgSrc, quantity: 1 });
      cartItemsContainer.appendChild(newItem);
      cartCount++;
      cartCounter.textContent = cartCount;
      updateEstimatedTotal();
      updateEmptyState();
      saveCartToLocalStorage();
    });
  });

  loadCartFromLocalStorage();
});

function addToCart(productId, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    if (!cart[productId]) {
        cart[productId] = { quantity: 1, price: price };
    } else {
        cart[productId].quantity += 1;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}


 
