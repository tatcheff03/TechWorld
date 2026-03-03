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

const navLinks = document.querySelectorAll('#mainNav [data-category]');
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
  //  column wrapper for responsiveness:
  // 1 row on phones, 2 small tablets, 3 laptops, 4 large desktops
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-lg-4 col-xxl-3';

  col.innerHTML = `
    <div class="card h-100 shadow-sm product-card">
      <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
      <div class="card-body d-flex flex-column text-center">
        <h3 class="h6 card-title mb-2">${product.name}</h3>
        <p class="card-text text-secondary small mb-2">${product.description}</p>

        <p class="mb-2">
          <span class="fw-semibold">Price:</span>
          ${
            product.discountPrice
              ? `<span class="text-secondary text-decoration-line-through me-2">$${product.price.toFixed(2)}</span>
                 <span class="text-danger fw-bold">$${product.discountPrice.toFixed(2)}</span>`
              : `<span class="fw-semibold">$${product.price.toFixed(2)}</span>`
          }
        </p>

        <p class="mb-3 d-flex justify-content-center align-items-center gap-2">
  <span class="text-warning">
    ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
  </span>
  <span class="badge text-bg-light border text-dark">${product.rating}/5</span>
</p>

        <button type="button" class="btn btn-primary mt-auto w-100 btn-brand add-to-cart">
          Add to Cart
        </button>
      </div>
    </div>
  `;

  col.querySelector('.add-to-cart').addEventListener('click', () => {
    showCartToast(`${product.name} added to cart!`);
  });

  main.appendChild(col);
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

function showCartToast(message){
    const toastEl= document.getElementById('cartToast');
    const toastBody = document.getElementById('cartToastBody');
    toastBody.textContent = message;

    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2000 });
    toast.show();
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