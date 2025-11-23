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
    const addToCartButton = document.querySelector('.modal-content .add-to-cart-btn'); // New: Select the Add to Cart button in the modal
    const queryButton = document.querySelector('.query-button'); // query button

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

                // Store current product ID on the button for use in sendTextMessage
                addToCartButton.dataset.currentProductId = productId;

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

    // 2. Add to Cart Button Click Handler (Custom function call)
    addToCartButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Get current product details from the modal UI
        const productId = addToCartButton.dataset.currentProductId;
        const productName = document.getElementById('modalProductName').textContent;
        const productSize = document.getElementById('modalProductSize').value;

        // Construct the AgentContext object
        const agentContext = {
            "name": "_AgentContext",
            "value": {
                "valueType": "StructuredValue",
                "value": {
                    // Update currentPage to reflect the product being viewed
                    "currentPage": `products.html#product-${productId} (${productName})`,
                    "search": {
                        "result": "result2",
                        "filters": [
                            "filter1",
                            "filter2"
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
                `I am interested in the ${productName} (Size: ${productSize}). Can you recommend accessories for this?`, 
                [agentContext]
            )
            .then(() => {
                console.log("Successfully sent text message for product ID: " + productId);	
                // Optional: Provide UI feedback (e.g., closing modal or confirmation message)
           //     alert("Product details sent for assistance! (Check Console Log)");
                clearHashAndClose();
            })
            .catch((error) => {
                console.error("Error thrown while sending text message: ", error);
            });
        } else {
            console.warn("embeddedservice_bootstrap API not found. The message could not be sent.");
            alert("API not found. Check console for details.");
        }
    });

    // 3. Close button or background click clears the hash, which triggers the hashchange listener.
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

    // 4. Main hash change listener: Re-run the core logic whenever the hash changes (including back button usage).
    window.addEventListener('hashchange', handleModalState);

    // 5. Initial call: Check the hash when the page first loads (products.html#product-1)
    handleModalState();

    // 6. Query button logic
     queryButton.addEventListener('click', (event) => {
        event.preventDefault();

                 // Construct the AgentContext object
        const agentContext = {
            "name": "_AgentContext",
            "value": {
                "valueType": "StructuredValue",
                "value": {
                    // Update currentPage to reflect the product being viewed
                    "currentPage": `Product Deatail`,
                    "search": {
                        "result": "result2",
                        "filters": [
                            "filter1",
                            "filter2"
                        ],
                        "facets": [
                            "facet1",
                            "facet2"
                        ]
                    }
                }
            }
        };

        // Check if the external service API is available before calling
        if (typeof embeddedservice_bootstrap !== 'undefined' && embeddedservice_bootstrap.utilAPI) {
            
            // Execute the required sendTextMessage function
            embeddedservice_bootstrap.utilAPI.sendTextMessage(
                `Is it dishwasher safe?`, 
                [agentContext]
            )
            .then(() => {
                console.log("Sent the dishwasher Sage message ");	
                // Optional: Provide UI feedback (e.g., closing modal or confirmation message)
           //     alert("Product details sent for assistance! (Check Console Log)");
                clearHashAndClose();
            })
            .catch((error) => {
                console.error("Error thrown while sending text message: ", error);
            });
        } else {
            console.warn("embeddedservice_bootstrap API not found. The message could not be sent.");
            alert("API not found. Check console for details.");
        }
    });
});
