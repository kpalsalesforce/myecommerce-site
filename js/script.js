document.addEventListener('DOMContentLoaded', () => {

    // --- Product Data Map ---
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
    const detailAddToCartButton = document.getElementById('detailAddToCart'); // New: Add to Cart on Detail Page
    const modalAddToCartButton = document.querySelector('.modal-content .add-to-cart-btn'); // Add to Cart button inside the modal

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

                // Store current product ID on the modal button
                modalAddToCartButton.dataset.currentProductId = productId;

                quickViewModal.style.display = 'flex';
                return;
            }
        }
        
        // 2. Hash is invalid, missing, or product not found: Close the modal
        quickViewModal.style.display = 'none';
    }


    // --- Event Handlers ---

    // 1. Product Listing Page: Quick View buttons set the hash.
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = event.target.dataset.productId;
            window.location.hash = `product-${productId}`;
        });
    });

    // 2. Product Detail Page: Add to Cart button sets the hash for Product ID 1.
    if (detailAddToCartButton) {
        detailAddToCartButton.addEventListener('click', (event) => {
            event.preventDefault();
            // Hardcode product ID 1, as this page is for the Non-Stick Pan demo
            window.location.hash = 'product-1'; 
        });
    }


    // 3. Modal's Add to Cart Button Click Handler (External Service Call)
    modalAddToCartButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Get current product details from the modal UI
        const productId = modalAddToCartButton.dataset.currentProductId;
        const productName = document.getElementById('modalProductName').textContent;
        const productSize = document.getElementById('modalProductSize').value;

        // Construct the AgentContext object
        const agentContext = {
            "name": "_AgentContext",
            "value": {
                "valueType": "StructuredValue",
                "value": {
                    "currentPage": `Product Detail: ${productName} (ID: ${productId})`,
                    "search": {
                        "result": "modal-quick-view-opened",
                        "filters": [
                            "size:" + productSize
                        ],
                        "facets": [
                            "facet1",
                            "facet2"
                        ]
                    },
                    // Add current product selection details
                    "productSelection": {
                        "id": productId,
                        "name": productName,
                        "size": productSize
                    }
                }
            }
        };

        // Check if the external service API is available before calling
        if (typeof embeddedservice_bootstrap !== 'undefined' && embeddedservice_bootstrap.utilAPI) {
            
            // Execute the required sendTextMessage function
            embeddedservice_bootstrap.utilAPI.sendTextMessage(
                `I added the ${productName} (Size: ${productSize}) to my cart and need assistance with my order.`, 
                [agentContext]
            )
            .then(() => {
                console.log("Successfully sent text message for product ID: " + productId);	
                alert(`Added ${productName} to cart and notified assistance!`);
                clearHashAndClose();
            })
            .catch((error) => {
                console.error("Error thrown while sending text message: ", error);
            });
        } else {
            console.warn("embeddedservice_bootstrap API not found. The message could not be sent.");
            alert("Added to Cart! (API Integration Placeholder) Check console for details.");
            clearHashAndClose();
        }
    });

    // 4. Close button or background click clears the hash, which triggers the hashchange listener.
    function clearHashAndClose() {
        // Clear the hash without causing a page reload
        history.pushState("", document.title, window.location.pathname + window.location.search);
        handleModalState();
    }
    
    closeButton.addEventListener('click', clearHashAndClose);

    window.addEventListener('click', (event) => {
        if (event.target === quickViewModal) {
            clearHashAndClose();
        }
    });

    // 5. Main hash change listener: Re-run the core logic whenever the hash changes (including back button usage).
    window.addEventListener('hashchange', handleModalState);

    // 6. Initial call: Check the hash when the page first loads
    handleModalState();
});
