const categoryDetails = {
    laptops: {
        title: "Laptops",
        description: "Browse our collection of high-performance laptops for work, gaming, and everyday productivity."
    },
    keyboards: {
        title: "Keyboards",
        description: "Discover mechanical, wireless, and ergonomic keyboards for every setup."
    },
    headsets: {
        title: "Headsets",
        description: "Experience crystal clear sound with our premium wired and wireless headsets."
    }
};

const navLinks = document.querySelectorAll('.category-menu a');
const main= document.getElementById('main');

const products_per_row = 4;
const rows_per_page = 5;
const page_size = products_per_row * rows_per_page; 
const loadMoreBtn = document.getElementById('loadMore');

let shownProducts = 0; // track alr. shown
let currCategory = sessionStorage.getItem('category') || 'laptops';


function updateCategoryInfo() {
    const title = document.getElementById('categoryTitle');
    const description = document.getElementById('categoryDesc');
    title.textContent = categoryDetails[currCategory].title;
    description.textContent = categoryDetails[currCategory].description;
}

function renderProducts() {
    // filter products per current category
    const filtered = products.filter(p => p.category === currCategory);
    const next_products = filtered.slice(shownProducts, shownProducts + page_size); // select next batch to show

    const counter = document.getElementById('productCount');
    counter.textContent = `${Math.min(shownProducts + next_products.length, filtered.length)} out of ${filtered.length} products shown.`;
    
    // loop through and create product cards for each item
    next_products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
        <div class="product-image">
        <img src="${product.image}" alt="${product.name}" />
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>
            Price: 
            ${product.discountPrice
                    ? `<span class="original-price">$${product.price.toFixed(2)}</span> 
                <span class="discounted-price">$${product.discountPrice.toFixed(2)}</span>`
                    : `$${product.price.toFixed(2)}`
                }
        </p>
        <p>Rating: ${product.rating} ⭐</p>
        <button class="add-to-cart">Add to Cart</button>
        `;

        // add to cart success message
        card.querySelector('.add-to-cart').addEventListener('click', () => {
            alert(`${product.name} added to cart!`);
        });

        main.appendChild(card);

 
    });

        // add the number of newly loaded products to the total shown
        shownProducts+=next_products.length; 
        // show btn if more products remain
        loadMoreBtn.style.display = shownProducts < filtered.length ?'block' : 'none'; 
    
}

// listener for load more btn
loadMoreBtn.addEventListener('click', renderProducts);

// category switch
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

    navLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');

        currCategory = link.dataset.category;
        sessionStorage.setItem('category', currCategory);

        main.innerHTML = ''; // clear grid
        shownProducts = 0; // for new category start over

        updateCategoryInfo();
        renderProducts();
    });
});



// underlines active category
navLinks.forEach(link => {
    if (link.dataset.category === currCategory) {
        link.classList.add('active');
    }
});

// initial load of 1st batch
updateCategoryInfo();  
renderProducts(); 