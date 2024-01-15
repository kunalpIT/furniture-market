const cartContainer = document.querySelector('.cart-container')
const productList = document.querySelector('.product-list');


const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value')
const cartCountInfo = document.getElementById('cart-count-info')

let cartItemID = 1;


function evenlistners() {
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    })
    ///toggle navbar
    document.querySelector('.navbar-toggler')
        .addEventListener('click', () => {
            document.querySelector('.navbar-collapse').classList.
                toggle('show-navbar')
        })

    //show hide cart container
    document.getElementById('cart-btn').addEventListener
        ('click', () => {
            cartContainer.classList.toggle('show-cart-container')
        })

    productList.addEventListener('click', purchaseProduct);

    cartList.addEventListener('click', deleteProduct);
}

evenlistners();

function updateCartInfo() {
    let cartInfo = findCartInfo();
    console.log(cartInfo);
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}

updateCartInfo();

function loadJSON() {
    fetch('furniture.json')
        .then(response => response.json())
        .then(data => {
            let html = ``;
            data.forEach(product => {
                // console.log(product);
                html += `
                <div class="product-item">
                    <div class="product-img">
                        <img src="${product.imgSrc}" alt="${product.name}">
                        <button type="button" class="add-to-cart-btn">
                            <i class="fas fa-shopping-cart"></i>Add to Cart
                        </button>
                    </div>
                    <div class = "product-content">
                    <h3 class = "product-name">${product.name}</h3>
                    <span class = "product-category">${product.category}</span>
                    <p class = "product-price">$${product.price}</p>
                </div>
                </div>
                `
                // console.log(html);

            })
            productList.innerHTML = html
        })
        .catch(err => {
            console.log(err);
        })
}

function purchaseProduct(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        console.log(e.target);
        let product = e.target.parentElement.parentElement;
        console.log(product);
        getProductInfo(product);
    }
}

function getProductInfo(product) {
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        category: product.querySelector('.product-category').textContent,
        price: product.querySelector('.product-price').textContent
    }
    cartItemID++;
    console.log(productInfo);
    addToCartList(productInfo);
    saveProductInLocalStorage(productInfo);
}

function addToCartList(product) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);

    cartItem.innerHTML = `
    <img src="${product.imgSrc}" alt="Product Image">
    <div class="cart-item-info">
        <h3 class="cart-item-name">${product.name}</h3>
        <span class="cart-item-category">${product.category}</span>
        <span class="cart-item-price">${product.price}</span>
    </div>
    <button type="button" class="cart-item-del-btn">
        <i class="fas fa-times"></i>
    </button>
    `;
    cartList.appendChild(cartItem);

}

function saveProductInLocalStorage(item) {
    let products = getProductFromStorage();
    console.log(products);
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}

function getProductFromStorage() {
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : []
}

//load carts products

function loadCart() {
    let products = getProductFromStorage();
    if (products.length < 1) {
        cartItemID = 1;
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
    }
    console.log(cartItemID);
    products.forEach(product => addToCartList(product));
    updateCartInfo();
}


function findCartInfo() {
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1));
        return acc += price;
    }, 0)

    return {
        total: total.toFixed(2),
        productCount: products.length
    }
}

function deleteProduct(e) {
    let cartItem;
    if (e.target.tagName === 'BUTTON') {
        cartItem = e.target.parentElement;
        cartItem.remove();
    } else if (e.target.tagName === 'I') {
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove();
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    })

    localStorage.setItem('products', JSON.stringify(updatedProducts))
    // console.log(cartItem);
    updateCartInfo();
}