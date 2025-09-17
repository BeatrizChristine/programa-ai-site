const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

var menu = document.querySelector('#menu_icon');
var navbar = document.querySelector('.navbar');
var home = document.querySelector('#Home');
var about = document.querySelector('#About');
var crono = document.querySelector('#Cronograma');
var sair = document.querySelector('#Logout');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('open')
}

function aboutpage() {
    window.location.href = 'navbar/About/about.html';
}

function cronopage() {
    window.location.href = 'navbar/Cronograma/crono.html';
}

function logout() {
  // Inicialize o Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
    auth.signOut()
        .then(function () {
            // Logout bem-sucedido, redirecione para a tela de login
            window.location.href = '../index.html';
        })
        .catch(function (error) {
            // Tratar erros de logout, se necessário
            console.log(error);
        });
}

function perfil(){
    window.location.href = 'navbar/Perfil/perfil.html'
}


let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;


let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

/*rolagem inifnita
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});
*/

carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});


carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// botão
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");

    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; 
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // 
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // 
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // 
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return;
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);