// Change this to your real WhatsApp number in international format.
// Example format for Sri Lanka: 947XXXXXXXX (no + sign or spaces).
const WHATSAPP_NUMBER = "94773737605";

const categoryNames = {
    all: "All Products",
    mugs: "Mugs Printing",
    frames: "Photo Framing",
    rings: "Rings",
    invitations: "Invitation Cards",
    keytags: "Key Tags"
};

const products = [
    { id: 1, category: "mugs", name: "Custom Photo Mug", price: 900, image: "images/mag.webp", icon: "☕", description: "Customized mug with your favourite photo or design." },
    { id: 2, category: "mugs", name: "Magic Mug", price: 1500, image: "images/magic-mug.jpg", icon: "☕", description: "A creative heat-changing magic mug." },
    { id: 3, category: "mugs", name: "Couple Mug Set", price: 1800, image: "images/couple-mug.jpg", icon: "☕", description: "Matching custom mugs for couples." },
    { id: 4, category: "mugs", name: "Name Design Mug", price: 900, image: "images/name-mug.png", icon: "☕", description: "Personalized name, quote or text mug." },

    { id: 5, category: "frames", name: "Classic Photo Frame(A3)", price: 5000, image: "images/A3frame.png", icon: "🖼️", description: "Elegant frame for your favourite photo." },
    { id: 5, category: "frames", name: "Classic Photo Frame(A4)", price: 2000, image: "images/A4frame.png", icon: "🖼️", description: "Elegant frame for your favourite photo." },
    { id: 5, category: "frames", name: "Classic Photo Frame(A5)", price: 1000, image: "images/A5.png", icon: "🖼️", description: "Elegant frame for your favourite photo." },

    { id: 6, category: "frames", name: "Collage Photo Frame", price: 2000, image: "images/cframe.png", icon: "🖼️", description: "Multiple photos arranged in one beautiful frame." },
    // { id: 7, category: "frames", name: "Wooden Photo Frame", price: 2200, image: "images/frame-3.jpg", icon: "🖼️", description: "Warm wooden style photo frame for your memories." },
    // { id: 8, category: "frames", name: "Custom Wall Frame", price: 3500, image: "images/frame-4.jpg", icon: "🖼️", description: "A custom frame for your wall." },

    { id: 9, category: "rings", name: "Simple Ring", price: 1800, image: "images/Ring.jpg", icon: "💍", description: "A minimal and elegant ring design." },
    // { id: 10, category: "rings", name: "Couple Ring Set", price: 3200, image: "images/ring-2.jpg", icon: "💍", description: "Matching ring set for two." },
    { id: 13, category: "invitations", name: " Invitation card", price: 150, image: "images/invi.webp", icon: "💌", description: "An elegant invitation for your special day." },
    { id: 17, category: "keytags", name: "Photo Key Tag", price: 500, image: "images/key.jpg", icon: "🔑", description: "Carry your favourite photo everywhere." },

];

let activeCategory = "all";
let cart = [];
let selectedProduct = null;

// Turn a number into a price such as Rs. 1,200.
function formatPrice(price) {
    return "Rs. " + Number(price).toLocaleString();
}

// Make an image area. If the photo file is missing, show an emoji instead.
function imageHTML(product) {
    return `
        <img src="${product.image}" alt="${product.name}"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='grid'">
        <div class="image-placeholder" style="display:none">${product.icon}</div>
        <span class="slot-label">PRODUCT PHOTO</span>
    `;
}

// Show products that match the selected category and search text.
function showProducts() {
    const grid = document.getElementById("productGrid");
    const searchText = document.getElementById("searchInput").value.trim().toLowerCase();

    let visibleProducts = products;

    if (activeCategory !== "all") {
        visibleProducts = visibleProducts.filter(function (product) {
            return product.category === activeCategory;
        });
    }

    if (searchText !== "") {
        visibleProducts = visibleProducts.filter(function (product) {
            return product.name.toLowerCase().includes(searchText) ||
                product.description.toLowerCase().includes(searchText) ||
                categoryNames[product.category].toLowerCase().includes(searchText);
        });
    }

    document.getElementById("productTitle").textContent = categoryNames[activeCategory];
    document.getElementById("productCount").textContent = visibleProducts.length + " products";
    document.getElementById("emptyState").classList.toggle("hidden", visibleProducts.length !== 0);

    grid.innerHTML = "";

    visibleProducts.forEach(function (product) {
        const card = document.createElement("article");
        card.className = "product-card";
        card.onclick = function () {
            openProduct(product.id);
        };

        card.innerHTML = `
            <div class="product-image">
                ${imageHTML(product)}
                <div class="hover-text">Custom Your Design &amp; Order</div>
            </div>
            <div class="product-info">
                <div class="product-category">${categoryNames[product.category]}</div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-bottom">
                    <span class="price">${formatPrice(product.price)}</span>
                    <button class="add-btn" type="button">View Product</button>
                </div>
            </div>
        `;

        // Prevent the button click from opening the product twice.
        card.querySelector(".add-btn").onclick = function (event) {
            event.stopPropagation();
            openProduct(product.id);
        };

        grid.appendChild(card);
    });
}

// Select a category and refresh the products.
function filterCategory(category) {
    activeCategory = category;

    document.querySelectorAll(".category").forEach(function (button) {
        button.classList.toggle("active", button.dataset.category === category);
    });

    showProducts();
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

document.querySelectorAll(".category").forEach(function (button) {
    button.addEventListener("click", function () {
        filterCategory(button.dataset.category);
    });
});

// Find a product and display its details.
function openProduct(id) {
    selectedProduct = products.find(function (product) {
        return product.id === id;
    });

    if (!selectedProduct) {
        return;
    }

    const imageArea = document.getElementById("modalImageArea");
    imageArea.innerHTML = `
        <img src="${selectedProduct.image}" alt="${selectedProduct.name}"
            onerror="this.style.display='none'; this.parentElement.textContent='${selectedProduct.icon}'">
    `;

    document.getElementById("modalCategory").textContent = categoryNames[selectedProduct.category];
    document.getElementById("modalName").textContent = selectedProduct.name;
    document.getElementById("modalDescription").textContent = selectedProduct.description;
    document.getElementById("modalPrice").textContent = formatPrice(selectedProduct.price);

    const message = "Hello AM Creative! I want to order: " + selectedProduct.name +
        " - " + formatPrice(selectedProduct.price) + ". Please send me more details.";
    document.getElementById("modalWhatsapp").href =
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);

    document.getElementById("modalAddButton").onclick = function () {
        addToCart(selectedProduct.id);
        closeProduct();
    };

    document.getElementById("productModal").classList.remove("hidden");
}

function closeProduct() {
    document.getElementById("productModal").classList.add("hidden");
}

function closeProductOnBackdrop(event) {
    if (event.target.id === "productModal") {
        closeProduct();
    }
}

// Add a product to the cart.
function addToCart(id) {
    const product = products.find(function (item) {
        return item.id === id;
    });

    if (product) {
        cart.push(product);
    }

    updateCartCount();
}

function updateCartCount() {
    document.getElementById("cartCount").textContent = cart.length;
}

// Show the cart and calculate its total.
function openCart() {
    renderCart();
    document.getElementById("cartModal").classList.remove("hidden");
}

function closeCart() {
    document.getElementById("cartModal").classList.add("hidden");
}

function closeCartOnBackdrop(event) {
    if (event.target.id === "cartModal") {
        closeCart();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");
    const whatsappButton = document.getElementById("cartWhatsapp");

    if (cart.length === 0) {
        container.innerHTML = "<p class='empty-state'>Your cart is empty.</p>";
        totalElement.textContent = "Rs. 0";
        whatsappButton.style.display = "none";
        return;
    }

    whatsappButton.style.display = "block";
    container.innerHTML = "";
    let total = 0;

    cart.forEach(function (product, index) {
        total = total + product.price;
        const row = document.createElement("div");
        row.className = "cart-row";
        row.innerHTML = `
            <div><strong>${product.name}</strong><br><small>${categoryNames[product.category]}</small></div>
            <strong>${formatPrice(product.price)}</strong>
            <button class="remove-btn" type="button">Remove</button>
        `;
        row.querySelector(".remove-btn").onclick = function () {
            removeFromCart(index);
        };
        container.appendChild(row);
    });

    totalElement.textContent = formatPrice(total);

    let message = "Hello AM Creative! I want to order these products:\n\n";
    cart.forEach(function (product, index) {
        message += (index + 1) + ". " + product.name + " - " + formatPrice(product.price) + "\n";
    });
    message += "\nTotal: " + formatPrice(total) + "\nPlease confirm my order.";

    whatsappButton.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

// Close either modal with the Escape key.
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeProduct();
        closeCart();
    }
});

// Display all products when the page first opens.
showProducts();
