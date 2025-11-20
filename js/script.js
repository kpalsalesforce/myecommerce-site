document.addEventListener('DOMContentLoaded', () => {
    const quickViewModal = document.getElementById('quickViewModal');
    const closeButton = document.querySelector('.close-button');
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');

    // Function to open the modal
    function openQuickViewModal(product) {
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('modalProductDescription').textContent = product.description;
        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductImage').alt = product.name;

        // Clear existing options and add new ones (example: sizes)
        const sizeSelect = document.getElementById('modalProductSize');
        sizeSelect.innerHTML = ''; // Clear previous options
        product.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });

        quickViewModal.style.display = 'flex'; // Use flex to center
    }

    // Event listeners for Quick View buttons
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // In a real app, you'd fetch product data by ID
            // For this static demo, we'll hardcode some data
            const productId = event.target.dataset.productId;
            let productData = {};

            switch(productId) {
                case '1':
                    productData = {
                        name: 'Premium Non-Stick Pan',
                        price: 69.99,
                        description: 'A durable non-stick pan, perfect for everyday cooking. Even heat distribution for optimal results.',
                        image: 'https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202529/0082/img12xl.jpg',
                        sizes: ['8-inch', '10-inch', '12-inch']
                    };
                    break;
                case '2':
                    productData = {
                        name: 'Stainless Steel Pot Set',
                        price: 189.99,
                        description: 'A 5-piece set of high-quality stainless steel pots with glass lids. Induction ready.',
                        image: 'https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202524/0017/all-clad-d3-tri-ply-stainless-steel-10-piece-cookware-set-xl.jpg',
                        sizes: ['Small Set', 'Medium Set', 'Large Set']
                    };
                    break;
                case '3':
                    productData = {
                        name: 'Cast Iron Skillet',
                        price: 49.99,
                        description: 'Pre-seasoned cast iron skillet for perfect searing and baking. A timeless kitchen essential.',
                        image: 'https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202544/0019/img3xl.jpg',
                        sizes: ['6-inch', '8-inch', '10-inch', '12-inch']
                    };
                    break;
                default:
                    productData = {
                        name: 'Unknown Product',
                        price: 0.00,
                        description: 'Product details are not available.',
                        image: 'https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202521/0004/img271xl.jpg',
                        sizes: ['N/A']
                    };
            }
            openQuickViewModal(productData);
        });
    });

    // Event listener for the close button
    closeButton.addEventListener('click', () => {
        quickViewModal.style.display = 'none';
    });

    // Close the modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === quickViewModal) {
            quickViewModal.style.display = 'none';
        }
    });
});
