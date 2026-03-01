const laptopImages = [
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1026&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1698512475067-74ed7c956c8d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1743456056112-0739a6742135?q=80&w=1122&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

const keyboardImages = [
  "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1544966469-bf6b7b5c0777?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1558050032-160f36233a07?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

const headsetImages = [
  "https://images.unsplash.com/photo-1593112723196-e841f5c60799?q=80&w=734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1764493824817-ba770988de79?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1622473776277-c57c423daf63?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

// generate 45 products with random data
function generateProducts(category, images, count = 45) {
  return Array.from({ length: count }, (_, i) => {
    const price = +(50 + Math.random() * 500).toFixed(2);
    const discountPrice = Math.random() > 0.5 ? +(price *(0.5  + Math.random() * 0.25)).toFixed(2) : null;
    return {
    id: i + 1,
    category: category,
    name: `${category.charAt(0).toUpperCase() + category.slice(1)} Product ${i + 1}`,
    description: `High-quality ${category} product #${i + 1}`,
    price: price,
    discountPrice: discountPrice,
    image: images[Math.floor(Math.random() * images.length)], 
    rating: +(Math.random() * 2 + 3).toFixed(1) 
    };
  });
}

// localStorage for products so not lost on refresh
let products;
if (localStorage.getItem("products")) {
  products = JSON.parse(localStorage.getItem("products"));
} else {
  products = [
    ...generateProducts("laptops", laptopImages),
    ...generateProducts("keyboards", keyboardImages),
    ...generateProducts("headsets", headsetImages)
  ];
  localStorage.setItem("products", JSON.stringify(products));
}