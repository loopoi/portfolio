'use strict'

const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', ()=>{
    // Make navbar transparent when it is on scroll
    if (window.scrollY > navbarHeight){
        navbar.classList.add('navbar--dark');
    } else {
        navbar.classList.remove('navbar--dark')
    }
})


// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
    const target = event.target;
    const link = target.dataset.link;
    if (link == null){
        return;
    }
    navbarMenu.classList.remove('open');
    scrollInfoView(link);
    selectnavItem(target);
})


// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', ()=>{
    navbarMenu.classList.toggle('open');
})


// Handle click on "contact me" button on home
const contactMe = document.querySelector('.home__contact');
contactMe.addEventListener('click', (event)=>{
    const target = event.target;
    const link = target.dataset.link;
    scrollInfoView(link);
});

function scrollInfoView(selector){
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    selectnavItem(navItems[sectionIds.indexOf(selector)]);
}

const elemHome = document.querySelector('.home__container');
const homeHeight = elemHome.getBoundingClientRect().height;
document.addEventListener('scroll', ()=>{
    elemHome.style.opacity = 1 - (window.scrollY / homeHeight);
})


// Show arrow up button when scrolling down
const arrowUp = document.querySelector('.arrow__up');
document.addEventListener('scroll', () =>{
    if (window.scrollY > homeHeight/2){
        arrowUp.classList.add('visible');
    } else {
        arrowUp.classList.remove('visible');
    }
})

arrowUp.addEventListener('click', ()=>{
    scrollInfoView('#home')
})

const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');

workBtnContainer.addEventListener('click', (e)=>{
    const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
    if(filter == null){
        return;
    }

    // remove selection from the pervious item and select the new one
    const active = document.querySelector('.category__btn.selected');
    active.classList.remove('selected');
    const target = e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;

    target.classList.add('selected')

    projectContainer.classList.add('anim-out');
    setTimeout(()=>{
        projects.forEach((project) => {
            if (filter === '*' || project.dataset.type === filter){
                project.classList.remove('invisible');
            }
            else{
                project.classList.add('invisible');
            }
        })
        projectContainer.classList.remove('anim-out');
    }, 300)
})

// 1. 모든 섹션 요소와 메뉴 아이템들을 가져온다
// 2. IntersectionObserver 를 이용해서 모든 세션들을 관찰한다.
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다
const sectionIds = ['#home', '#about', '#skills', '#work', '#testimonials', '#contact'];

const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(id => document.querySelector(`[data-link="${id}"]`));

let selectedNavIndex = 0;
let selectednavItem = navItems[0];

function selectnavItem(selected){
    selectednavItem.classList.remove('active');
    selectednavItem = selected;
    selectednavItem.classList.add('active');
}

const observerOtions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3,
}
const observerCollback = (entries, observer) => {
    entries.forEach(entry => {
        if(!entry.isIntersecting && entry.intersectionRatio > 0){
            const index = sectionIds.indexOf(`#${entry.target.id}`);
            // 스크롤링이 아래로 되어서 페이지가 올라옴
            if(entry.boundingClientRect.y < 0) {
                selectedNavIndex = index + 1;
            } else {
                selectedNavIndex = index - 1;
            }
        }
    })
}
const observer = new IntersectionObserver(observerCollback, observerOtions);
sections.forEach(section => observer.observe(section))

window.addEventListener('wheel', ()=>{
    if(window.scrollY === 0){
        selectedNavIndex = 0;
    } else if (window.scrollY + window.innerHeight === document.body.clientHeight) {
        selectedNavIndex = navItems.length - 1;
    }
    selectnavItem(navItems[selectedNavIndex]);
});