const htmlGoToTopButton = `
    <a href="#" class="go-to-top-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
            <path
                d="M22.2064 10.1687L12.8314 0.793739C12.653 0.623038 12.4428 0.489228 12.2126 0.399989C11.7561 0.212455 11.2441 0.212455 10.7876 0.399989C10.5574 0.489228 10.3472 0.623038 10.1689 0.793739L0.793854 10.1687C0.619031 10.3436 0.480355 10.5511 0.385742 10.7795C0.291129 11.0079 0.242432 11.2528 0.242432 11.5C0.242432 11.9993 0.440784 12.4782 0.793854 12.8312C1.14692 13.1843 1.62579 13.3827 2.1251 13.3827C2.62442 13.3827 3.10328 13.1843 3.45635 12.8312L9.6251 6.64374V20.875C9.6251 21.3723 9.82265 21.8492 10.1743 22.2008C10.5259 22.5524 11.0028 22.75 11.5001 22.75C11.9974 22.75 12.4743 22.5524 12.8259 22.2008C13.1776 21.8492 13.3751 21.3723 13.3751 20.875V6.64374L19.5439 12.8312C19.7182 13.007 19.9255 13.1465 20.154 13.2417C20.3825 13.3369 20.6276 13.3859 20.8751 13.3859C21.1226 13.3859 21.3677 13.3369 21.5962 13.2417C21.8247 13.1465 22.032 13.007 22.2064 12.8312C22.3821 12.6569 22.5216 12.4496 22.6168 12.2211C22.712 11.9926 22.761 11.7475 22.761 11.5C22.761 11.2525 22.712 11.0074 22.6168 10.7789C22.5216 10.5504 22.3821 10.343 22.2064 10.1687Z"
                fill="black" />
        </svg>
    </a>
`
const htmlHamburgerButton = `<button id="hamburger-button"></button>`
const svgHamburgerMenu = `
<svg  width="100%" height="100%" viewBox="0 0 242 181" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g id="hamburger"><path d="M241.667,20.885c-0,11.526 -9.358,20.885 -20.885,20.885l-199.897,-0c-11.527,-0 -20.885,-9.359 -20.885,-20.885c0,-11.527 9.358,-20.885 20.885,-20.885l199.897,0c11.527,0 20.885,9.358 20.885,20.885Z" style="fill:currentColor;"/><path d="M241.667,90.306c-0,11.527 -9.358,20.885 -20.885,20.885l-199.897,-0c-11.527,-0 -20.885,-9.358 -20.885,-20.885c0,-11.527 9.358,-20.885 20.885,-20.885l199.897,0c11.527,0 20.885,9.358 20.885,20.885Z" style="fill:currentColor;"/><path d="M241.667,159.727c-0,11.527 -9.358,20.885 -20.885,20.885l-199.897,-0c-11.527,-0 -20.885,-9.358 -20.885,-20.885c0,-11.527 9.358,-20.885 20.885,-20.885l199.897,0c11.527,0 20.885,9.358 20.885,20.885Z" style="fill:currentColor;"/></g></svg>`
const body = document.body
const headerElement = document.querySelector(".header")
headerElement.insertAdjacentHTML("beforeend", htmlHamburgerButton)
const hamburgerButton = document.querySelector("#hamburger-button")
hamburgerButton.insertAdjacentHTML("beforeend", svgHamburgerMenu)
body.insertAdjacentHTML("afterbegin", htmlGoToTopButton)
const currentPage = window.location.pathname 
let mobileActive = "" 
const activeMobileElement = {
    aboutInactive: `<a id="mobile-about" href="/" >about</a>`,
    examplesInactive: `<a id="mobile-examples" href="examples.html">examples</a>`,
    gamesInactive: `<a id="mobile-games" href="games.html">games</a>`,

    activeAbout: `<a id="mobile-about" class="mobile-active">about</a>`,
    activeExamples: `<a id="mobile-examples" class="mobile-active" >examples</a>`,
    activeGames: `<a id="mobile-games" class="mobile-active" >games</a>`,
    about: ``,
    examples: ``, 
    games: ``, 
    setPage(page){
        if(page.includes("examples")){
            this.about = this.aboutInactive
            this.games = this.gamesInactive
            this.examples = this.activeExamples
        }
        else if(page.includes("games")){ 
                this.about = this.aboutInactive
                this.games = this.activeGames
                this.examples = this.examplesInactive
        }else {
            this.about = this.activeAbout
            this.games = this.gamesInactive
            this.examples = this.examplesInactive
        }    
    }
}
activeMobileElement.setPage(currentPage)
const mobileMenu = `
<div class="nav-mobile-container" data-open="false">
        <div id="mobile-title-bar">
                <div id="mobile-logo">
                        <img src="common/img/raylib_logo.png" alt="">
                </div>
                <button id="mobile-close-button"></button>
        </div>
        <nav class="mobile-menu">
                ${activeMobileElement.about}
                ${activeMobileElement.examples}
                ${activeMobileElement.games}
                <a id= "mobile-cheatsheet" href="cheatsheet/cheatsheet.html">cheatsheet</a>
                <a id="mobile-wiki"href="https://github.com/raysan5/raylib/wiki" target="_blank">wiki</a>
        </nav>
        <div id="mobile-social"></div>
</div>
`
body.insertAdjacentHTML("afterbegin", mobileMenu)
const svgCloseButton = `
<svg width="100%" height="100%" viewBox="0 0 168 168" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><rect id="mobile-menu-1" serif:id="mobile menu 1" x="-3078.56" y="-212.563" width="3508.33" height="6633.33" style="fill:none;"/><clip-path id="_clip1"><rect x="-3078.56" y="-212.563" width="3508.33" height="6633.33"/></clip-path><g clip-path="url(#_clip1)"><g id="mobile-nav" serif:id="mobile nav"><g class="hamburger-piece"><path d="M171.441,-21.568c0,11.527 -9.358,20.885 -20.884,20.885l-199.898,0c-11.526,0 -20.884,-9.358 -20.884,-20.885c-0,-11.526 9.358,-20.884 20.884,-20.884l199.898,-0c11.526,-0 20.884,9.358 20.884,20.884Z" style="fill:#727272;"/><path d="M171.441,35.354c0,11.526 -9.358,20.884 -20.884,20.884l-199.898,0c-11.526,0 -20.884,-9.358 -20.884,-20.884c-0,-11.527 9.358,-20.885 20.884,-20.885l199.898,-0c11.526,-0 20.884,9.358 20.884,20.885Z" style="fill:#727272;"/><path d="M171.441,92.275c0,11.526 -9.358,20.884 -20.884,20.884l-199.898,0c-11.526,0 -20.884,-9.358 -20.884,-20.884c-0,-11.527 9.358,-20.885 20.884,-20.885l199.898,-0c11.526,-0 20.884,9.358 20.884,20.885Z" style="fill:#727272;"/></g></g><g id="mobile-menu" serif:id="mobile menu"><rect x="-3095.22" y="-212.563" width="3529.17" height="6633.33" style="fill:#fff;"/><g id="x"><path d="M162.278,5.605c7.473,7.472 7.473,19.606 0,27.079l-129.594,129.594c-7.473,7.473 -19.607,7.473 -27.079,0c-7.473,-7.473 -7.473,-19.606 -0,-27.079l129.594,-129.594c7.473,-7.473 19.606,-7.473 27.079,-0Z" style="fill:#727272;"/><path d="M162.278,162.278c-7.473,7.473 -19.606,7.473 -27.079,0l-129.594,-129.594c-7.473,-7.473 -7.473,-19.607 -0,-27.079c7.472,-7.473 19.606,-7.473 27.079,-0l129.594,129.594c7.473,7.473 7.473,19.606 0,27.079Z" style="fill:#727272;"/></g></g></g></svg>
`;
const mobileCloseButton = document.querySelector("#mobile-close-button");
mobileCloseButton.insertAdjacentHTML("beforeend", svgCloseButton);
mobileCloseButton.addEventListener("click", disableHamburgerNavBar);
hamburgerButton.addEventListener("click", enableHamburgerNavBar);
const mobileSocialsContainer = document.querySelector("#mobile-social");
const mobileNavBar = document.querySelector(".nav-mobile-container")

mobileSocialsContainer.insertAdjacentHTML("beforeend",
    `<a id="mobile-twitter" href="https://www.twitter.com/raysan5" target="_blank" aria-label="raysan5's Twitter"><img src="common/img/icon_twitter.png" /></a>
    <a id="mobile-discord" href="https://discord.gg/raylib" target="_blank" aria-label="raylib discord"><img src="common/img/icon_discord.png" ></a>
    <a id="mobile-twitch" href="https://www.twitch.tv/raysan5" target="_blank" aria-label="raysan5 twitch channel"><img src="common/img/icon_twitch.png" /></a>
    <a id="mobile-kofi" href="https://ko-fi.com/raysan5" target="_blank" aria-label="raylib coffee page for support"><img src="common/img/icon_kofi.png" /></a>
    <a id="mobile-itchio" href="https://raysan5.itch.io" target="_blank" aria-label="raylib itch.io page"><img src="common/img/icon_itchio.png" ></a>
    <a id="mobile-handmade" href="https://raylib.handmade.network/" target="_blank" aria-label="raylib handmadenetwork"><img src="common/img/icon_handmade.png" /></a>
    <a id="mobile-reddit" href="https://www.reddit.com/r/raylib/" target="_blank" aria-label="raylib reddit"><img src ="common/img/icon_reddit.png"/></a>
    <a id="mobile-youtube" href="https://www.youtube.com/c/raylib" target="_blank" aria-label="raylib youtube channel"><img src="common/img/icon_youtube.png" /></a>
    <a id="mobile-patreon" href="https://www.patreon.com/raylib" target="_blank" aria-label="ray's patreon page"><img src="common/img/icon_patreon.png" /></a>
    <a id="mobile-redbubble" href="https://www.redbubble.com/shop/ap/78130012" target="_blank" aria-label="red bubble"><img src="common/img/icon_redbubble.png" /></a>
    <a id="mobile-github" href="https://github.com/raysan5/raylib" target="_blank" aria-label="raylib's github"><img src="common/img/icon_github.png" /></a>`
);
function enableHamburgerNavBar(){
    mobileNavBar.setAttribute("data-open", "true");
    body.style.height = "100%"
    body.style.overflowY = "hidden"
}
function disableHamburgerNavBar(){    
    mobileNavBar.setAttribute("data-open", "false");
    body.style.height = "unset"
    body.style.overflowY = "unset"
}

const goToTopButton = document.querySelector(".go-to-top-button");
window.addEventListener("scroll", toggleGoToTopButton);
function toggleGoToTopButton()
{
    if(goToTopButton !== null){
        if (window.scrollY <= 200)
        {
            goToTopButton.style.display = "none"; 
            goToTopButton.classList.remove("spring-anim-class");
        }
        else
        {
            goToTopButton.style.display = "flex";
            goToTopButton.classList.add("spring-anim-class");
        }
    }
}