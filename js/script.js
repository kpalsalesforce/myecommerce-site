document.addEventListener('DOMContentLoaded', () => {

    // --- Product Data Map ---
    // In a real application, this data would be fetched from a database or API.
    const PRODUCTS = {
        '1': {
            name: 'Premium Non-Stick Pan',
            price: 69.99,
            description: 'A durable non-stick pan, perfect for everyday cooking. Even heat distribution for optimal results.',
            image: 'https://via.placeholder.com/300x200/ff7f50/ffffff?text=Pan+Quick+View',
            sizes: ['8-inch', '10-inch', '12-inch']
        },
        '2': {
            name: 'Stainless Steel Pot Set',
            price: 189.99,
            description: 'A 5-piece set of high-quality stainless steel pots with glass lids. Induction ready.',
            image: 'https://via.placeholder.com/300x200/6a5acd/ffffff?text=Pot+Set+Quick+View',
            sizes: ['Small Set', 'Medium Set', 'Large Set']
        },
        '3': {
            name: 'Cast Iron Skillet',
            price: 49.99,
            description: 'Pre-seasoned cast iron skillet for perfect searing and baking. A timeless kitchen essential.',
            image: 'https://via.placeholder.com/300x200/a0522d/ffffff?text=Skillet+Quick+View',
            sizes: ['6-inch', '8-inch', '10-inch', '12-inch']
        },
        '4': {
            name: 'Ceramic Baking Dish',
            price: 34.99,
            description: 'Elegant ceramic dish for casseroles and desserts. Oven and microwave safe.',
            image: 'https://via.placeholder.com/300x200/7cb342/ffffff?text=Ceramic+Baking+Dish',
            sizes: ['Small', 'Medium', 'Large']
        },
        '5': {
            name: 'Carbon Steel Wok Pan',
            price: 79.99,
            description: 'High-heat wok for authentic stir-frying. Requires seasoning for best non-stick results.',
            image: 'https://via.placeholder.com/300x200/ffb74d/ffffff?text=Wok+Pan',
            sizes: ['12-inch', '14-inch']
        },
        '6': {
            name: 'Reversible Griddle Plate',
            price: 59.99,
            description: 'Cast iron griddle, flat on one side, ridged on the other. Ideal for pancakes, bacon, and grilled sandwiches.',
            image: 'https://via.placeholder.com/300x200/4fc3f7/ffffff?text=Griddle+Plate',
            sizes: ['Standard', 'Large']
        },
    };

    const quickViewModal = document.getElementById('quickViewModal');
    const closeButton = document.querySelector('.close-button');
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');


    // Function to populate and open the modal based on Product ID
    function openQuickViewModal(productId) {
        const product = PRODUCTS[productId];

        if (!product) {
            console.error('Product not found for ID:', productId);
            return;
        }

        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('modalProductDescription').textContent = product.description;
        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductImage').alt = product.name;

        // Populate options (e.g., sizes)
        const sizeSelect = document.getElementById('modalProductSize');
        sizeSelect.innerHTML = '';
        product.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });

        quickViewModal.style.display = 'flex'; // Use flex to center
    }

    // Function to close the modal and clear the URL hash
    function closeQuickViewModal() {
        quickViewModal.style.display = 'none';
        // Clear the hash from the URL without reloading the page
        if (window.location.hash) {
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
    }

    // Core logic: checks the URL hash and opens/closes the modal
    function handleHashChange() {
        const hash = window.location.hash;
        if (hash.startsWith('#product-')) {
            const productId = hash.substring(9); // Get ID after #product-
            if (PRODUCTS[productId]) {
                openQuickViewModal(productId);
            } else {
                // If ID is invalid, close the modal and clear hash
                closeQuickViewModal();
            }
        } else {
            // If hash is empty or doesn't match the pattern, ensure modal is closed
            quickViewModal.style.display = 'none';
        }
    }


    // 1. Event listener for Quick View buttons: update the URL hash
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = event.target.dataset.productId;
            // Change the URL hash, which triggers the hashchange listener (below)
            window.location.hash = `product-${productId}`;
        });
    });

    // 2. Event listener for the close button and outside clicks: close and clear hash
    closeButton.addEventListener('click', closeQuickViewModal);

    window.addEventListener('click', (event) => {
        if (event.target === quickViewModal) {
            closeQuickViewModal();
        }
    });

    // 3. Initial check on page load and listener for hash changes
    // This allows the modal to open immediately if the page is loaded with a URL like products.html#product-1
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
});
