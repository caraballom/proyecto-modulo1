async function getApi() {
    const base_url= 'https://ecommercebackend.fundamentos-29.repl.co/';
    try{
        const data= await fetch(base_url);
        const res= await (data).json();
        localStorage.setItem('products', JSON.stringify(res));
    return res;
    }
    catch (error) {
        console.log(error),'ha ocurrido un problema';
    }
}
async function dataBase () {
    const db= {
        products: JSON.parse(localStorage.getItem(('products'))) || await getApi() ,
        cart: JSON.parse(localStorage.getItem('cart'))||{},
    }
    return(db)
}
// function handels () {
//     const btn = document.querySelector('.filter__btn');
//     const list= document.querySelector('.filter__list');
//     list.addEventListener('click', function() {
//         list.classList.remove('active') })
//     btn.addEventListener('click', function(){
//         list.classList.toggle('active');
//     });
// }
function cartHandles () {
const btn= document.querySelector(".cart__btn");
const cartModal= document.querySelector(".cart__modal");
    btn.addEventListener('click', function() {
        cartModal.classList.toggle("active")
    })
}
function printProducts (products) {
    const print= document.querySelector('.products');
    let html =''
    for (const item of products) {
        const {image, id, category, price, quantity}= item
        print.innerHTML= html;
        html +=`
        <div id="${id}" class="product">
            <figure class="product__img if${quantity}">
                <img src="${image}" alt="">
            </figure>
            <p class="product__description">
                <span>Categoria: </span>${category}<br>
                <span>Precio: </span>${price} USD<br>
                <span>Cantidad: </span>${quantity} Units<br>
            </p>
            <div class="product__buttons">
                <button class="btn__view">Ver detalle</button>
                <button class="btn__add">Agregar al carrito</button>
            </div></div>
        </div>`
    }
}
function addToCart(db) {
    const add= document.querySelector('.products');
    add.addEventListener('click', (event)=>{
            if ((event.target.classList.contains('btn__add'))){
            const id= +event.target.closest('.product').id;
            const article= db.products.find(element => element.id===id);
            if (article.quantity===0) {
                return alert ('este articulo se encuentra agotado');
            }
            if (article.id in db.cart) {
                if (db.cart[id].amount===db.cart[id].quantity) {
                    return alert ('el producto no se encuentra en existencia')}
                db.cart[article.id].amount+=1;
            } else {
                article.amount=1;
                db.cart[article.id]=article;
            }
            localStorage.setItem('cart', JSON.stringify(db.cart));
        }printCart(db.cart);
        printTotals(db)
    })
}
function printCart (products) {
    const print= document.querySelector('.cart__products');
    let html= '';
    for (const key in products) {
        const {image, id, category, price, quantity, amount}= products[key];
        html+=`
        <div id="${id}" class="cart__product">
            <figure class="cart__product__img">
                <img src="${image}" alt="image product">
            </figure>
            <div class="cart__product__container">
                <p class="cart__product__description">
                    <span>Categoria:</span> ${category}<br>
                    <span>precio:</span> $${price} USD<br>
                    <span>Cantidad:</span> ${quantity} Units<br>
                </p>
                <div class="cart__product__buttons">
                    <ion-icon class="less" name="remove-circle-outline"></ion-icon>
                    <span>${amount}</span>
                    <ion-icon class="plus" name="add-circle-outline"></ion-icon>
                    <ion-icon class="trash" name="trash-outline"></ion-icon>
                </div>
            </div>
        </div>
        `;
    }
    print.innerHTML=html;
}
function handleCart (db) {
    const cart= document.querySelector('.cart__products')
    cart.addEventListener('click', (event) => {
        if (event.target.classList.contains('less')) {
            // console.log('quiero restar');
            const id= +(event.target.closest('.cart__product').id);
            if (db.cart[id].amount===1){
                return alert ('uno, es la cantidad minima que puedes comprar')    
            }
            db.cart[id].amount--;
        }
        if (event.target.classList.contains('plus')) {
            // console.log('quiero sumar');
            const id= +(event.target.closest('.cart__product').id);
            if (db.cart[id].amount===db.cart[id].quantity) {
                return alert('el producto no se encuentra en existencia')    
            }
            db.cart[id].amount++;
        } 
        if (event.target.classList.contains('trash')){
            // console.log('quiero borrar');
            const id= +(event.target.closest('.cart__product').id);
            const response= confirm('esta seguro que desea retirar el producto?');
                if (response) {
                delete db.cart[id];
                }
                else {
                    return;   
            }
        }
    localStorage.setItem('cart', JSON.stringify(db.cart));
    printCart(db.cart);
    printTotals(db); 
    })
}
function printTotals(db) {
    const cartTotal=document.querySelector('.cart__totals div');
    let objects=0
    let totals= 0
    for (const key in db.cart) {
        const{price, amount}= db.cart[key];
        objects+= amount;
        totals+= price*amount;
    }
    let html=`
    <p><span>Cantidad:</span> ${objects}</p>
        <p><span>Total:</span> ${totals} USD</p>`;
    cartTotal.innerHTML=html;
}
function handlesTotals(db) {
    const totals=document.querySelector('.cart__total__button')
    totals.addEventListener('click', () =>{
        if (!(Object.values(db.cart).length)) {
            return alert ('Debes agregar productos antes de realizar una compra')
        }
        const response= confirm ('estas seguro de realizar esta compra?');
        if (!response) {
            return;
        }
        for (const key in db.cart) {
            if ( db.cart[key].id===db.products[key-1].id) {
                db.products[key-1].quantity-=db.cart[key].amount
            }
        }
        db.cart={};
        localStorage.setItem('products', JSON.stringify(db.products));
        localStorage.setItem('cart', JSON.stringify(db.cart))
        printProducts(db.products);
        printCart(db.cart);
        printTotals(db);
        alert ('Gracias por su compra');
    }) 
}
function filterProducts(products) {
        const list= document.querySelectorAll('.options__list')
        list.forEach(option => {    
            option.addEventListener('change', ()=> {
                const selectedValue= option.value   
                if (selectedValue==='todos') {
                    printProducts(products);   
                }
                else if (selectedValue==='shirts') {
                    const shirts = products.filter(element=>(element.category==='shirt'));
                    printProducts(shirts);
                }
                else if  (selectedValue==='sweaters')  {
                    const sweaters=products.filter(element=> element.category==='sweater');
                    printProducts(sweaters);
                }
                else if  (selectedValue==='hoddies')  {
                    const hoddies=products.filter(element=> element.category==='hoddie');
                    printProducts(hoddies);
                }
            })
        })
    }
async function main() {
    const db = await dataBase();
    // handels();
    cartHandles();
    printProducts(db.products);
    addToCart(db);
    printCart(db.cart);
    handleCart(db);
    printTotals(db)
    handlesTotals(db);
    filterProducts(db.products);
}   
main();


    