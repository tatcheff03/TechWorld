// sorting
function sortProd(products, option) {
    const sorted = [...products];

    switch (option) {
        case "Alphabetical (A-Z)":
            return sorted.sort((a, b) => {
                const [nameA, numA] = a.name.match(/([^\d]+)(\d+)/).slice(1);// split product- model and number
                const [nameB, numB] = b.name.match(/([^\d]+)(\d+)/).slice(1);

                const modelCompare = nameA.localeCompare(nameB);// compare model names 
                return modelCompare !== 0 ? modelCompare : parseInt(numA) - parseInt(numB);// sort by model number if same model
            });

        case "Alphabetical (Z-A)":
            return sorted.sort((a, b) => {
                const [nameA, numA] = a.name.match(/([^\d]+)(\d+)/).slice(1);
                const [nameB, numB] = b.name.match(/([^\d]+)(\d+)/).slice(1);

                const modelCompare = nameB.localeCompare(nameA);
                return modelCompare !== 0 ? modelCompare : parseInt(numB) - parseInt(numA);
            });

        case "Price (Low to High)":
            return sorted.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)); // use discounted price if it has 

        case "Price (High to Low)":
            return sorted.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    }

    return sorted;
}