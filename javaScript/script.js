const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItensContainer = document.getElementById("cart-itens")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkou-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCaunter = document.getElementById("cart-count")
const addressInput = document.getElementById("adress")
const addressWarn = document.getElementById("adress-warn")

let cart = [];


// abrir o modal do carrinho
cartBtn.addEventListener("click",function () {
    updateCartModal();
    cartModal.style.display = "flex"
})

// fecar o modal quaando clicar fora

cartModal.addEventListener("click",function name(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
})

//botao fechar

closeModalBtn.addEventListener("click",function(){
    cartModal.style.display="none";
})

//colocar item no carrinho
menu.addEventListener("click",function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton){
        const name = parentButton.getAttribute("data-name")
        const price  = parseFloat(parentButton.getAttribute("data-price"))
        addtocart(name,price)
      
    }

})
function addtocart(name,price) {
    const existinItem = cart.find(item => item.name == name)

    if(existinItem){
        existinItem.quantity += 1
        return;
    }else{
        cart.push({
            name,
            price,
            quantity:1,
        })
    }
    updateCartModal()
 
}

///atualiza o carrinho

function updateCartModal(){
    cartItensContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElemente = document.createElement("div");
        cartItemElemente.classList.add("flex", "justify-between","mb-4", "flex-col")

        cartItemElemente.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class=" font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class=" font-medium mt-2" id="priceUnit">R$${item.price.toFixed(3)}</p>            
                </div>   
                
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>       
        `
        total += item.price * item.quantity;
        cartItensContainer.appendChild(cartItemElemente)
    })
    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });
    
  
    
    cartCaunter.innerHTML = cart.length;
   // <div></div>
   // <p></p>
}
//função para remover itens
cartItensContainer.addEventListener("click",function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)
    if (index != -1) {
        const item = cart[index]
        
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return
        }
        cart.splice(index, 1)
        updateCartModal();
    }
}
addressInput.addEventListener("input",function(event){
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

   
})
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkStoreOpen();
    if(!isOpen){
        Toastify({
            text: "Ops! A loja esta fechada no momento",
            duration: 5000,           
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            
          }).showToast();
        
        return;
        
    }

    if(cart.length ===0)return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }
    // enviar para whasaapp
    const cartItems = cart.map((item)=>{
        return(
            `${item.name} 
             Quantidade: ${item.quantity} Preço: R$${item.price}  |  `
        )
    }).join("")
    const massage = encodeURIComponent(cartItems)
    const phone = "19983134611"
    window.open(`https://wa.me/${phone}?text=${massage} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();



})
function checkStoreOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 7 && hora < 23;
}

//verificando se a loja esta em horario de funcionamento
const spanItem = document.getElementById("date-span")
const isOpen = checkStoreOpen();

if (isOpen) {
    spanItem.classList.remove(" bg-red-500");
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500")
    
}


