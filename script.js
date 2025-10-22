let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: 'Smartphone X', image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAACBJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAD8G8AAAADq3WAAAAABJRU5ErkJggg==', price: 25000, discount: 19999, description: 'Latest smartphone with advanced features.', category: 'Smartphones' },
    { id: 2, name: 'Wireless Earbuds', image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAACBJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAD8G8AAAADq3WAAAAABJRU5ErkJggg==', price: 5000, discount: 3999, description: 'High-quality wireless audio.', category: 'Accessories' },
    { id: 3, name: 'Laptop Pro', image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAACBJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAD8G8AAAADq3WAAAAABJRU5ErkJggg==', price: 80000, discount: 64999, description: 'Powerful laptop for professionals.', category: 'Laptops' },
    { id: 4, name: 'Smartwatch Z', image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAACBJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAD8G8AAAADq3WAAAAABJRU5ErkJggg==', price: 15000, discount: 12999, description: 'Advanced fitness tracking.', category: 'Accessories' },
    { id: 5, name: 'Tablet Air', image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAACBJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAD8G8AAAADq3WAAAAABJRU5ErkJggg==', price: 35000, discount: 29999, description: 'Lightweight and powerful tablet.', category: 'Laptops' },
    { id: 6, name: 'Smartphone Y', image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAACBJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAD8G8AAAADq3WAAAAABJRU5ErkJggg==', price: 30000, discount: 24999, description: 'High-performance smartphone.', category: 'Smartphones' },
    { id: 7, name: 'Headphones Pro', image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAACBJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAD8G8AAAADq3WAAAAABJRU5ErkJggg==', price: 8000, discount: 6999, description: 'Noise-cancelling headphones.', category: 'Accessories' }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const productsPerPage = 6;
let currentPage = 1;
const ADMIN_PASSWORD = 'admin123'; // Hardcoded for simplicity; use secure methods in production
const SHIPPING_CHARGES = {
    'goa': 200,
    'default': 300 // All other states and union territories
};

function saveProducts() {
    try {
        localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
        showMessage('Error saving products to local storage.', 'error');
    }
}

function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        showMessage('Error saving cart to local storage.', 'error');
    }
}

function clearCart() {
    try {
        cart = [];
        saveCart();
        updateCartCount();
        if (document.getElementById('cart-items')) {
            renderCart();
        }
    } catch (error) {
        showMessage('Error clearing cart.', 'error');
    }
}

function showMessage(text, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function isAdminAuthenticated() {
    return localStorage.getItem('adminAuthenticated') === 'true';
}

function setAdminAuthenticated(status) {
    localStorage.setItem('adminAuthenticated', status);
}

function updateAdminLinkVisibility() {
    try {
        const adminLinks = document.querySelectorAll('#admin-link');
        adminLinks.forEach(link => {
            link.style.display = isAdminAuthenticated() ? 'block' : 'none';
        });
    } catch (error) {
        showMessage('Error updating admin link visibility.', 'error');
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    try {
        const password = document.getElementById('admin-password').value;
        if (password === ADMIN_PASSWORD) {
            setAdminAuthenticated(true);
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('admin-section').style.display = 'block';
            updateAdminLinkVisibility();
            showMessage('Admin login successful.', 'success');
        } else {
            showMessage('Incorrect password.', 'error');
        }
    } catch (error) {
        showMessage('Error during login.', 'error');
    }
}

function handleAdminLogout() {
    try {
        setAdminAuthenticated(false);
        updateAdminLinkVisibility();
        window.location.href = 'index.html';
        showMessage('Admin logged out successfully.', 'success');
    } catch (error) {
        showMessage('Error during logout.', 'error');
    }
}

function checkAdminAccess() {
    try {
        if (window.location.pathname.endsWith('admin.html') && !isAdminAuthenticated()) {
            document.getElementById('login-modal').style.display = 'flex';
            document.getElementById('admin-section').style.display = 'none';
        } else if (window.location.pathname.endsWith('admin.html')) {
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('admin-section').style.display = 'block';
        }
    } catch (error) {
        showMessage('Error checking admin access.', 'error');
    }
}

function updateCartCount() {
    try {
        const cartCounts = document.querySelectorAll('#cart-count');
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounts.forEach(countElement => {
            countElement.textContent = count;
        });
    } catch (error) {
        showMessage('Error updating cart count.', 'error');
    }
}

function getShippingCharge() {
    try {
        const location = document.getElementById('shipping-location')?.value || 'default';
        const pickupCheckbox = document.getElementById('pickup-checkbox');
        if (location === 'goa' && pickupCheckbox?.checked) {
            return 0; // Free shipping for pickup in Goa
        }
        return SHIPPING_CHARGES[location] || SHIPPING_CHARGES['default'];
    } catch (error) {
        showMessage('Error retrieving shipping charge.', 'error');
        return SHIPPING_CHARGES['default'];
    }
}

function formatLocationName(location) {
    return location
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function renderProducts(gridId, limit = products.length, filteredProducts = products, page = 1) {
    try {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        const start = (page - 1) * productsPerPage;
        const end = start + (gridId === 'product-grid' ? productsPerPage : limit);
        grid.innerHTML = '';
        filteredProducts.slice(start, end).forEach(product => {
            if (!product || !product.id) throw new Error('Invalid product data.');
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p><span class="product-price">₹${product.price.toFixed(2)}</span> <span class="product-discount">₹${product.discount.toFixed(2)}</span></p>
                    <p>${product.description}</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            grid.appendChild(card);
        });

        if (gridId === 'product-grid') {
            renderPagination(filteredProducts.length);
        }
    } catch (error) {
        showMessage('Error rendering products.', 'error');
    }
}

function renderPagination(totalProducts) {
    try {
        const pageNumbersContainer = document.getElementById('page-numbers');
        if (!pageNumbersContainer) return;

        const pageCount = Math.ceil(totalProducts / productsPerPage);
        pageNumbersContainer.innerHTML = '';

        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement('span');
            pageButton.classList.add('page-number');
            if (i === currentPage) pageButton.classList.add('active');
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                filterAndSortProducts();
            });
            pageNumbersContainer.appendChild(pageButton);
        }

        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === pageCount;
    } catch (error) {
        showMessage('Error rendering pagination.', 'error');
    }
}

function filterAndSortProducts() {
    try {
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        const category = document.getElementById('category-filter')?.value || 'all';
        const minPrice = parseFloat(document.getElementById('min-price')?.value) || 0;
        const maxPrice = parseFloat(document.getElementById('max-price')?.value) || Infinity;
        const sortBy = document.getElementById('sort-by')?.value || 'default';

        if (minPrice < 0 || maxPrice < 0) {
            throw new Error('Price values cannot be negative.');
        }
        if (minPrice > maxPrice && maxPrice !== Infinity) {
            throw new Error('Minimum price cannot be greater than maximum price.');
        }

        let filteredProducts = products.filter(product => {
            if (!product) return false;
            return product.name.toLowerCase().includes(searchTerm) &&
                   (category === 'all' || product.category === category) &&
                   product.discount >= minPrice &&
                   product.discount <= maxPrice;
        });

        if (sortBy === 'name-asc') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'name-desc') {
            filteredProducts.sort((a, b) => b.name.localeCompare(b.name));
        } else if (sortBy === 'price-asc') {
            filteredProducts.sort((a, b) => a.discount - b.discount);
        } else if (sortBy === 'price-desc') {
            filteredProducts.sort((a, b) => b.discount - a.discount);
        }

        renderProducts('product-grid', productsPerPage, filteredProducts, currentPage);
        return filteredProducts;
    } catch (error) {
        showMessage(error.message || 'Error applying filters or sorting.', 'error');
        return products;
    }
}

function renderCart() {
    try {
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;
        cartItems.innerHTML = '';
        let subtotal = 0;
        cart.forEach(item => {
            if (!item || !item.id) throw new Error('Invalid cart item.');
            const product = products.find(p => p.id === item.id);
            if (!product) throw new Error(`Product with ID ${item.id} not found.`);
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-info">
                    <h3>${product.name}</h3>
                    <p>₹${product.discount.toFixed(2)} x <input type="number" class="quantity" value="${item.quantity}" min="1" data-id="${item.id}"> = ₹${(product.discount * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            `;
            cartItems.appendChild(cartItem);
            subtotal += product.discount * item.quantity;
        });
        const shippingCharge = getShippingCharge();
        const total = subtotal + shippingCharge;
        document.getElementById('subtotal-price').textContent = subtotal.toFixed(2);
        document.getElementById('shipping-price').textContent = shippingCharge.toFixed(2);
        document.getElementById('total-price').textContent = total.toFixed(2);

        // Show/hide pickup option based on shipping location
        const location = document.getElementById('shipping-location')?.value || 'default';
        const pickupOption = document.getElementById('pickup-option');
        if (pickupOption) {
            pickupOption.style.display = location === 'goa' ? 'flex' : 'none';
        }
    } catch (error) {
        showMessage('Error rendering cart.', 'error');
    }
}

function handleAddToCart(e) {
    try {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.dataset.id);
            if (!id) throw new Error('Invalid product ID.');
            const product = products.find(p => p.id === id);
            if (!product) throw new Error('Product not found.');
            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ id, quantity: 1 });
            }
            saveCart();
            updateCartCount();
            showMessage(`Product "${product.name}" added to cart successfully.`, 'success');
        }
    } catch (error) {
        showMessage('Error adding product to cart.', 'error');
    }
}

function handleCartChanges(e) {
    try {
        if (e.target.classList.contains('remove-item')) {
            const id = parseInt(e.target.dataset.id);
            if (!id) throw new Error('Invalid product ID.');
            const product = products.find(p => p.id === id);
            if (!product) throw new Error('Product not found.');
            cart = cart.filter(item => item.id !== id);
            saveCart();
            renderCart();
            updateCartCount();
            showMessage(`Product "${product.name}" removed from cart successfully.`, 'success');
        } else if (e.target.classList.contains('quantity')) {
            const id = parseInt(e.target.dataset.id);
            if (!id) throw new Error('Invalid product ID.');
            const item = cart.find(item => item.id === id);
            if (!item) throw new Error('Cart item not found.');
            item.quantity = parseInt(e.target.value) || 1;
            if (item.quantity < 1) item.quantity = 1;
            saveCart();
            renderCart();
            updateCartCount();
            showMessage('Cart updated successfully.', 'success');
        }
    } catch (error) {
        showMessage('Error updating cart.', 'error');
    }
}

function handleOrderNow() {
    try {
        if (cart.length === 0) {
            throw new Error('Cart is empty. Add products to order.');
        }
        const location = document.getElementById('shipping-location')?.value || 'default';
        const address = document.getElementById('shipping-address')?.value.trim() || 'Not provided';
        const pickupCheckbox = document.getElementById('pickup-checkbox');
        const isPickup = location === 'goa' && pickupCheckbox?.checked;
        const shippingCharge = getShippingCharge();
        const formattedLocation = formatLocationName(location);
        let message = `Hello! I'd like to order:\n`;
        let subtotal = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) throw new Error(`Product with ID ${item.id} not found.`);
            message += `Product: ${product.name}\nQuantity: ${item.quantity}\nDiscounted Price: ₹${product.discount.toFixed(2)}\n\n`;
            subtotal += product.discount * item.quantity;
        });
        message += `Subtotal: ₹${subtotal.toFixed(2)}\n`;
        message += `Shipping Location: ${formattedLocation}\n`;
        message += `Shipping Address: ${address}\n`;
        message += `Pickup from Dealer: ${isPickup ? 'Yes' : 'No'}\n`;
        message += `Shipping Charge: ₹${shippingCharge.toFixed(2)}\n`;
        message += `Total: ₹${(subtotal + shippingCharge).toFixed(2)}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/919545690700?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        clearCart(); // Clear cart after successful order
        showMessage('Order sent successfully.', 'success');
    } catch (error) {
        showMessage(error.message || 'Error processing order.', 'error');
    }
}

function handleAdminForm(e) {
    e.preventDefault();
    try {
        const id = parseInt(document.getElementById('product-id').value) || null;
        const name = document.getElementById('product-name').value.trim();
        const imageInput = document.getElementById('product-image');
        const price = parseFloat(document.getElementById('product-price').value);
        const discount = parseFloat(document.getElementById('product-discount').value);
        const description = document.getElementById('product-description').value.trim();
        const imagePreview = document.getElementById('image-preview');

        // Input validation
        if (!name || !description) {
            throw new Error('Product name and description are required.');
        }
        if (isNaN(price) || price <= 0) {
            throw new Error('Price must be a positive number.');
        }
        if (isNaN(discount) || discount <= 0) {
            throw new Error('Discount price must be a positive number.');
        }
        if (discount > price) {
            throw new Error('Discount price cannot be greater than original price.');
        }

        const processForm = (imageData) => {
            if (id) {
                // Update existing product
                const product = products.find(p => p.id === id);
                if (!product) throw new Error('Product not found.');
                product.name = name;
                product.image = imageData || product.image; // Keep existing image if none uploaded
                product.price = price;
                product.discount = discount;
                product.description = description;
                saveProducts();
                renderAdminProducts();
                renderProducts('featured-grid', 3);
                renderProducts('product-grid', productsPerPage, products, currentPage);
                e.target.reset();
                document.getElementById('product-id').value = '';
                document.getElementById('form-submit').textContent = 'Add Product';
                imagePreview.style.display = 'none';
                imagePreview.src = '';
                showMessage('Product updated successfully.', 'success');
            } else {
                // Add new product
                if (!imageData) throw new Error('Image is required for new products.');
                const newProduct = {
                    id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
                    name,
                    image: imageData,
                    price,
                    discount,
                    description,
                    category: 'Smartphones' // Default category; requires form modification for dynamic input
                };
                products.push(newProduct);
                saveProducts();
                renderAdminProducts();
                renderProducts('featured-grid', 3);
                renderProducts('product-grid', productsPerPage, products, currentPage);
                e.target.reset();
                document.getElementById('product-id').value = '';
                document.getElementById('form-submit').textContent = 'Add Product';
                imagePreview.style.display = 'none';
                imagePreview.src = '';
                showMessage('Product added successfully.', 'success');
            }
        };

        if (imageInput.files && imageInput.files[0]) {
            const file = imageInput.files[0];
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                throw new Error('Image must be a .jpg, .jpeg, .png, or .gif file.');
            }
            const reader = new FileReader();
            reader.onload = () => {
                imagePreview.src = reader.result;
                imagePreview.style.display = 'block';
                processForm(reader.result);
            };
            reader.onerror = () => {
                throw new Error('Error reading image file.');
            };
            reader.readAsDataURL(file);
        } else if (id) {
            // Allow updating without changing the image
            processForm(null);
        } else {
            throw new Error('Image is required for new products.');
        }
    } catch (error) {
        showMessage(error.message || 'Error processing product.', 'error');
    }
}

function handleAdminActions(e) {
    try {
        if (e.target.classList.contains('delete-product')) {
            const id = parseInt(e.target.dataset.id);
            if (!id) throw new Error('Invalid product ID.');
            const product = products.find(p => p.id === id);
            if (!product) throw new Error('Product not found.');
            products = products.filter(p => p.id !== id);
            saveProducts();
            renderAdminProducts();
            renderProducts('featured-grid', 3);
            currentPage = 1; // Reset to first page after product deletion
            renderProducts('product-grid', productsPerPage, products, currentPage);
            showMessage(`Product "${product.name}" deleted successfully.`, 'success');
        } else if (e.target.classList.contains('edit-product')) {
            const id = parseInt(e.target.dataset.id);
            if (!id) throw new Error('Invalid product ID.');
            const product = products.find(p => p.id === id);
            if (!product) throw new Error('Product not found.');
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-image').value = ''; // File inputs can't be pre-filled
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-discount').value = product.discount;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-id').value = product.id;
            document.getElementById('form-submit').textContent = 'Update Product';
            const imagePreview = document.getElementById('image-preview');
            imagePreview.src = product.image;
            imagePreview.style.display = 'block';
        }
    } catch (error) {
        showMessage('Error handling admin action.', 'error');
    }
}

function handleImagePreview() {
    try {
        const imageInput = document.getElementById('product-image');
        const imagePreview = document.getElementById('image-preview');
        if (imageInput.files && imageInput.files[0]) {
            const file = imageInput.files[0];
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                showMessage('Image must be a .jpg, .jpeg, .png, or .gif file.', 'error');
                imageInput.value = '';
                imagePreview.style.display = 'none';
                imagePreview.src = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                imagePreview.src = reader.result;
                imagePreview.style.display = 'block';
            };
            reader.onerror = () => {
                showMessage('Error reading image file.', 'error');
                imagePreview.style.display = 'none';
                imagePreview.src = '';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none';
            imagePreview.src = '';
        }
    } catch (error) {
        showMessage('Error handling image preview.', 'error');
    }
}

function renderAdminProducts() {
    try {
        const adminProducts = document.getElementById('admin-products');
        if (!adminProducts) return;
        adminProducts.innerHTML = '<h3>Existing Products</h3>';
        products.forEach(product => {
            if (!product || !product.id) throw new Error('Invalid product data.');
            const div = document.createElement('div');
            div.classList.add('admin-product');
            div.innerHTML = `
                <span>${product.name} - ₹${product.discount.toFixed(2)} (${product.category})</span>
                <button class="edit-product" data-id="${product.id}">Edit</button>
                <button class="delete-product" data-id="${product.id}">Delete</button>
            `;
            adminProducts.appendChild(div);
        });
    } catch (error) {
        showMessage('Error rendering admin products.', 'error');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        updateCartCount();
        updateAdminLinkVisibility();
        checkAdminAccess();

        if (document.getElementById('login-form')) {
            document.getElementById('login-form').addEventListener('submit', handleAdminLogin);
        }
        if (document.getElementById('logout-btn')) {
            document.getElementById('logout-btn').addEventListener('click', handleAdminLogout);
        }
        if (document.getElementById('featured-grid')) renderProducts('featured-grid', 3);
        if (document.getElementById('product-grid')) {
            renderProducts('product-grid', productsPerPage, products, currentPage);
            document.getElementById('search-input')?.addEventListener('input', () => {
                currentPage = 1; // Reset to first page on new search
                filterAndSortProducts();
            });
            document.getElementById('category-filter')?.addEventListener('change', () => {
                currentPage = 1; // Reset to first page on filter change
                filterAndSortProducts();
            });
            document.getElementById('apply-filter')?.addEventListener('click', () => {
                currentPage = 1; // Reset to first page on filter apply
                filterAndSortProducts();
            });
            document.getElementById('sort-by')?.addEventListener('change', () => {
                currentPage = 1; // Reset to first page on sort change
                filterAndSortProducts();
            });
            document.getElementById('prev-page')?.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    filterAndSortProducts();
                }
            });
            document.getElementById('next-page')?.addEventListener('click', () => {
                const filteredProducts = filterAndSortProducts();
                const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
                if (currentPage < pageCount) {
                    currentPage++;
                    filterAndSortProducts();
                }
            });
        }
        if (document.getElementById('cart-items')) {
            renderCart();
            document.getElementById('cart-items').addEventListener('change', handleCartChanges);
            document.getElementById('cart-items').addEventListener('click', handleCartChanges);
            document.getElementById('order-now').addEventListener('click', handleOrderNow);
            document.getElementById('shipping-location')?.addEventListener('change', () => {
                renderCart();
                showMessage('Shipping location updated.', 'success');
            });
            document.getElementById('pickup-checkbox')?.addEventListener('change', () => {
                renderCart();
                showMessage('Pickup option updated.', 'success');
            });
        }
        if (document.getElementById('product-form')) {
            document.getElementById('product-form').addEventListener('submit', handleAdminForm);
            document.getElementById('admin-products').addEventListener('click', handleAdminActions);
            document.getElementById('product-image').addEventListener('change', handleImagePreview);
            renderAdminProducts();
        }
        document.body.addEventListener('click', handleAddToCart);
    } catch (error) {
        showMessage('Error initializing page.', 'error');
    }
});