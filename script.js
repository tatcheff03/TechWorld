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

let filtered = {
    brands: [],
    minPrice: 0,
    maxPrice: 1000,
    minRating: 3
};

let selectedSort = 'Alphabetical (A-Z)'; // default 
const sortSelect = document.getElementById('sortSelect');

sortSelect.addEventListener("change", (e) => {
    selectedSort = e.target.value;
    resetView();
    renderProducts();
});

document.querySelector('.filters').addEventListener('input', (e) => {
    // respond to checkboxes, number inputs or the rating select
    if (e.target.matches('input[type="checkbox"], input[type="number"], select')) {

        // Get checked brand checkboxes
        const checkedBrands = Array.from(document.querySelectorAll('.filters input[type="checkbox"]:checked'))
            .map(cb => cb.value.trim().toLowerCase());

        //update filtered object
        filtered = {
            brands: checkedBrands,
            minPrice: +document.getElementById('minPrice').value || 0,
            maxPrice: +document.getElementById('maxPrice').value || Infinity,
            minRating: +document.getElementById('minRating').value || 0
        };

        // auto-sort by Low→High if price range filter applied 
        if (selectedSort === 'Alphabetical (A-Z)' && 
            (filtered.minPrice > 0 || filtered.maxPrice < Infinity)) {
            selectedSort = 'Price (Low to High)';
            sortSelect.value = selectedSort; // update dropdown 
        }

        // Re-render products
        resetView();
        renderProducts();
    }
});

const navLinks = document.querySelectorAll('.category-menu a');
const main= document.getElementById('main');

const products_per_row = 4;
const rows_per_page = 5;
const page_size = products_per_row * rows_per_page; 
const loadMoreBtn = document.getElementById('loadMore');

let shownProducts = 0; // track alr. shown
let currCategory = sessionStorage.getItem('category') || 'laptops';


function renderBrandFilters() {
    const container = document.querySelector('.filters .brand-checkboxes'); // checkboxes container for brands
    container.innerHTML = ''; // clear brand checkboxes
    const brands = categoryBrands[currCategory]; // get brands for current category 

    // add new checkboxes for each brand (for current category)
   brands.forEach(brand => {
        const label = document.createElement('label');
        label.classList.add('brand-checkbox');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'brand';
        input.value = brand;

        label.appendChild(input);
        label.append(` ${brand}`);

        container.appendChild(label);
       
    });
}

function updateCategoryInfo() {
    const title = document.getElementById('categoryTitle');
    const description = document.getElementById('categoryDesc');
    title.textContent = categoryDetails[currCategory].title;
    description.textContent = categoryDetails[currCategory].description;
}

function renderProducts() {
    // current category filter
    let categoryProducts = products.filter(p => p.category === currCategory);
    let filteredProducts = filterProd(categoryProducts, filtered); // apply filtering by the selected side option
    let sortedProducts = sortProd(filteredProducts, selectedSort); // sort by selected dropdown option
    const next_products = sortedProducts.slice(shownProducts, shownProducts + page_size); // select next batch to show

    // update counter
    const counter = document.getElementById('productCount');
    counter.textContent = `${Math.min(shownProducts + next_products.length, sortedProducts.length)} out of ${sortedProducts.length} products shown.`;

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
    shownProducts += next_products.length;
    // show btn if more products remain
    loadMoreBtn.style.display = shownProducts < sortedProducts.length ? 'block' : 'none';

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

        // reset filters 
        filtered.brands = []; 
        filtered.minPrice = 0;
        filtered.maxPrice = 1000;
        filtered.minRating = 3;

        // reset to default sort
        selectedSort = 'Alphabetical (A-Z)';
        sortSelect.value = selectedSort; 

        // reset dom inputs to match defaults
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('minRating').value = 3;
        document.querySelectorAll('.filters input[type="checkbox"]').forEach(cb => cb.checked = false);


       

        updateCategoryInfo();
        renderBrandFilters();
        resetView();
        renderProducts();
    });
});


function resetView(){
    main.innerHTML = ''; 
    shownProducts = 0;
}


// underlines active category
navLinks.forEach(link => {
    if (link.dataset.category === currCategory) {
        link.classList.add('active');
    }
});

// initial load of 1st batch
updateCategoryInfo();
renderBrandFilters();
renderProducts(); 