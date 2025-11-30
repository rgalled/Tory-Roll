
addEventListener("DOMContentLoaded", (event) => {
    document.querySelector(".button-cart").addEventListener("click", (e) => {
        let carrito = document.querySelector(".Carrito")

        const style = window.getComputedStyle(carrito);

        if (style.display == "flex") {
            carrito.style.display = 'none';
        } else {
            carrito.style.display = 'flex';
        }


    })


    document.querySelector("footer").addEventListener("click", (e) => {
        let ClientOrder = document.querySelector(".ClientOrderGestor")
        console.log(ClientOrder);
        const style = window.getComputedStyle(ClientOrder);

        if (style.display == "block") {
            ClientOrder.style.display = 'none';
        } else {
            ClientOrder.style.display = 'block';
        }


    })


    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("close")) {
            if (e.target.parentElement.classList.contains("cross")) {
                let truecross = e.target.parentElement
                if (truecross.parentElement.classList.contains("Carrito-header")) {

                    let carrito = document.querySelector(".Carrito")
                    carrito.style.display = 'none';
                }
                if (truecross.parentElement.classList.contains("ClientOrderHeader")) {
                    let ClientOrder = document.querySelector(".ClientOrderGestor")
                    ClientOrder.style.display = 'none';
                }
            } else {
                if (e.target.parentElement.classList.contains("Carrito-header")) {

                    let carrito = document.querySelector(".Carrito")
                    carrito.style.display = 'none';
                }
                if (e.target.parentElement.classList.contains("ClientOrderHeader")) {
                    let ClientOrder = document.querySelector(".ClientOrderGestor")
                    ClientOrder.style.display = 'none';
                }
            }
        }
    });
})