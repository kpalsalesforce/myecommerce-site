document.addEventListener('DOMContentLoaded', () => {

    // --- Product Data Map ---
    const PRODUCTS = {
        '1': {
            name: 'Premium Non-Stick Pan',
            price: 69.99,
            description: 'A durable non-stick pan, perfect for everyday cooking. Even heat distribution for optimal results.',
            image: 'https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202529/0082/img12xl.jpg',
            sizes: ['8-inch', '10-inch', '12-inch']
        },
        '2': {
            name: 'Stainless Steel Pot Set',
            price: 189.99,
            description: 'A 5-piece set of high-quality stainless steel pots with glass lids. Induction ready.',
            image: 'https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202524/0017/all-clad-d3-tri-ply-stainless-steel-10-piece-cookware-set-xl.jpg',
            sizes: ['Small Set', 'Medium Set', 'Large Set']
        },
        '3': {
            name: 'Cast Iron Skillet',
            price: 49.99,
            description: 'Pre-seasoned cast iron skillet for perfect searing and baking. A timeless kitchen essential.',
            image: 'https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202544/0019/img3xl.jpg',
            sizes: ['6-inch', '8-inch', '10-inch', '12-inch']
        },
        '4': {
            name: 'Ceramic Baking Dish',
            price: 34.99,
            description: 'Elegant ceramic dish for casseroles and desserts. Oven and microwave safe.',
            image: 'https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202521/0004/img271xl.jpg',
            sizes: ['Small', 'Medium', 'Large']
        },
        '5': {
            name: 'Carbon Steel Wok Pan',
            price: 79.99,
            description: 'High-heat wok for authentic stir-frying. Requires seasoning for best non-stick results.',
            image: 'https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202524/0016/img9xl.jpg',
            sizes: ['12-inch', '14-inch']
        },
        '6': {
            name: 'Reversible Griddle Plate',
            price: 59.99,
            description: 'Cast iron griddle, flat on one side, ridged on the other. Ideal for pancakes, bacon, and grilled sandwiches.',
            image: 'https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202538/0141/img15xl.jpg',
            sizes: ['Standard', 'Large']
        },
    };

    const quickViewModal = document.getElementById('quickViewModal');
    const closeButton = document.querySelector('.close-button');
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');

    // --- Core Modal Control Logic ---

    // This function checks the hash and either opens or closes the modal.
    function handleModalState() {
        const hash = window.location.hash;
        
        if (hash.startsWith('#product-')) {
            const productId = hash.substring(9); 
            const product = PRODUCTS[productId];

            if (product) {
                // 1. Found valid product ID in hash: Open the modal
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

                quickViewModal.style.display = 'flex';
                return;
            }
        }
        
        // 2. Hash is invalid, missing, or product not found: Close the modal
        quickViewModal.style.display = 'none';
    }


    // --- Event Handlers ---

    // 1. Button click sets the hash, which triggers the hashchange listener.
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = event.target.dataset.productId;
            window.location.hash = `product-${productId}`;
        });
    });

    // 2. Close button or background click clears the hash, which triggers the hashchange listener.
    function clearHashAndClose() {
        // Clear the hash without causing a page reload
        history.pushState("", document.title, window.location.pathname + window.location.search);
        // Explicitly call the handler just in case the hashchange event doesn't fire immediately
        handleModalState();
    }
    
    closeButton.addEventListener('click', clearHashAndClose);

    window.addEventListener('click', (event) => {
        if (event.target === quickViewModal) {
            clearHashAndClose();
        }
    });

    // 3. Main hash change listener: Re-run the core logic whenever the hash changes (including back button usage).
    window.addEventListener('hashchange', handleModalState);

    // 4. Initial call: Check the hash when the page first loads (products.html#product-1)
    handleModalState();
});
