const cartBtn = document.querySelector(".navbar__cart-icon");
const backDrop = document.querySelector(".backdrop");
const cartModal = document.querySelector(".cart-box");
const closeModal = document.querySelector(".confirm-btn");
const productDom = document.querySelector(".products");
const cartCounter = document.querySelector(".cart-counter");
const cartTotalPrice = document.querySelector(".cart-total-price");
const cartProducts = document.querySelector(".cart__products");
const clearBtn = document.querySelector(".clear-btn");

import {productsData} from './products.js';
let cart = [];
//get peoducts
class Products {
    getProducts(){
        return productsData ;
    }
}
let buttns = [];

//Display products 
class Ui {
    displayProducts(product){
        let result = "";
        product.forEach(item => {
            result += `
            <div class="product">
            <img class="product__img" src=${item.imagUrl}>
            <div class="product__desc">
                <p class="product-name">${item.title}</p>
                <p class="product-price">${item.price} $</p>
            </div>
            <button class="product__btn btn" data-id = ${item.id}>add to Cart</button>
            </div>
            `
            productDom.innerHTML = result;
            
        });
    }
    getAddBtns(){
        const addBtns = [...document.querySelectorAll(".product__btn")];
        buttns= addBtns;
        
        addBtns.forEach(btn =>{
            const id = btn.dataset.id;
            const isInCart = cart.find( p => p.id === parseInt(id));
            if (isInCart){
                btn.innerText = "In Cart";
                btn.disabled = true;
            }
            btn.addEventListener("click", ()=> {
                btn.innerText = "In Cart";
                btn.disabled = true;
                const addedProduct = {...Storage.getProduct(id) ,  quntity :1};
                cart = [...cart ,addedProduct];

                Storage.saveCart(cart);
                this.setCartValue(cart);
                this.addedCartItem(addedProduct);
            })
        })
    }
    setCartValue(cart){
        let tempCartItem = 0;
        const totalPrice = cart.reduce((acc ,curr) => {
            tempCartItem += curr.quntity;
            return acc + curr.quntity * curr.price;
        },0)

        cartCounter.innerHTML = tempCartItem;
        cartTotalPrice.innerText = `totalPrice : ${totalPrice} $`;
    }
    addedCartItem(cartItem) {
        const div = document.createElement("div");
        div.classList.add("cart__product");
        div.innerHTML =`
        <img src=${cartItem.imagUrl} class="cart-img">
        <div class="cart-disc">
            <p class="cart-product-name">${cartItem.title} </p>
            <p class="cart-product-price">${cartItem.price} $</p>
        </div>
        <div class="cart_counter">
            <i class="fa-solid fa-chevron-up" data-id = ${cartItem.id}></i>
            <p class="cart-quntity">${cartItem.quntity} </p>
            <i class="fa-solid fa-chevron-down" data-id = ${cartItem.id}></i>
        </div>
        <i class="far fa-trash-alt" data-id = ${cartItem.id}></i>
        `
        cartProducts.appendChild(div);
    }
    setupUi() {
        cart = Storage.getCart() || [];
        cart.forEach( cartItem => this.addedCartItem(cartItem));
        this.setCartValue(cart);
        Storage.saveCart(cart); 

    }
    cartLogic() {
        clearBtn.addEventListener("click", ()=> this.claerCart());
        cartProducts.addEventListener("click" , (e)=> {
            if (e.target.classList.contains("fa-chevron-up")){  
                const addQuantity = e.target;
                const addedItem = cart.find( cItem => cItem.id == addQuantity.dataset.id);
                addedItem.quntity ++ ;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                addQuantity.nextElementSibling.innerText = addedItem.quntity;  

            }else if (e.target.classList.contains("fa-trash-alt")){
                const _removeItem = cart.find( c => c.id == e.target.dataset.id);
                this.removeItem(_removeItem.id);
                Storage.saveCart(cart);
                cartProducts.removeChild(e.target.parentElement);


            }else if (e.target.classList.contains("fa-chevron-down")){
                const subQuantity = e.target;
                const subItem = cart.find( cItem => cItem.id == subQuantity.dataset.id);
                if(subItem.quntity == 1){
                    this.removeItem(subItem.id)
                    cartProducts.removeChild(e.target.parentElement.parentElement);
                    return;
                }
                subItem.quntity -- ;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                subQuantity.previousElementSibling.innerText = subItem.quntity;  
            }
        })
    }

    claerCart() {
        cart.forEach( cItem => this.removeItem(cItem.id));
        while(cartProducts.children.length){
            cartProducts.removeChild(cartProducts.children[0])
        }
        closeCart();
    }
    removeItem(id) {
        cart = cart.filter( product => product.id !== Number(id))
        this.setCartValue(cart)
        Storage.saveCart(cart);
        this.getSingleButtn(id);

    }
    getSingleButtn(id) {
        const filterBtn = buttns.find( btn => parseInt(btn.dataset.id) === parseInt(id));
        filterBtn.innerText = " add to cart";
        filterBtn.disabled = false;
    }
}

//Storage
class Storage {
    static saveProduct(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(id) {
        const _product = JSON.parse(localStorage.getItem("products"));
        return _product.find(p => p.id === Number(id))
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    static getCart() {
        return JSON.parse(localStorage.getItem("cart"));
    }
}

document.addEventListener("DOMContentLoaded" , ()=> {
    const products = new Products;
    const productsData = products.getProducts();
    const ui = new Ui;
    ui.setupUi();
    ui.displayProducts(productsData);
    ui.getAddBtns();
    ui.cartLogic();
    Storage.saveProduct(productsData);
})


function closeCart(){
    backDrop.style.display = "none";
    cartModal.style.display = "none";
}

function openCart(){
    backDrop.style.display = "block";
    cartModal.style.display = "block";
}

cartBtn.addEventListener("click", openCart);
closeModal.addEventListener("click", closeCart);
backDrop.addEventListener("click", closeCart);
