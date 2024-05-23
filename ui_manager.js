const backToTopButton = document.querySelector(".back-to-top-arrow");
const mobileNavBar = document.querySelector(".nav-mobile-container");
const mobileCloseButton = document.querySelector("#mobile-close-button");
const hamburgerButton = document.querySelector("#hamburger-button");
const mobileSocialsContainer = document.querySelector("#mobile-social");
const svgCloseButton = `
<svg width="100%" height="100%" viewBox="0 0 168 168" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><rect id="mobile-menu-1" serif:id="mobile menu 1" x="-3078.56" y="-212.563" width="3508.33" height="6633.33" style="fill:none;"/><clip-path id="_clip1"><rect x="-3078.56" y="-212.563" width="3508.33" height="6633.33"/></clip-path><g clip-path="url(#_clip1)"><g id="mobile-nav" serif:id="mobile nav"><g class="hamburger-piece"><path d="M171.441,-21.568c0,11.527 -9.358,20.885 -20.884,20.885l-199.898,0c-11.526,0 -20.884,-9.358 -20.884,-20.885c-0,-11.526 9.358,-20.884 20.884,-20.884l199.898,-0c11.526,-0 20.884,9.358 20.884,20.884Z" style="fill:#727272;"/><path d="M171.441,35.354c0,11.526 -9.358,20.884 -20.884,20.884l-199.898,0c-11.526,0 -20.884,-9.358 -20.884,-20.884c-0,-11.527 9.358,-20.885 20.884,-20.885l199.898,-0c11.526,-0 20.884,9.358 20.884,20.885Z" style="fill:#727272;"/><path d="M171.441,92.275c0,11.526 -9.358,20.884 -20.884,20.884l-199.898,0c-11.526,0 -20.884,-9.358 -20.884,-20.884c-0,-11.527 9.358,-20.885 20.884,-20.885l199.898,-0c11.526,-0 20.884,9.358 20.884,20.885Z" style="fill:#727272;"/></g></g><g id="mobile-menu" serif:id="mobile menu"><rect x="-3095.22" y="-212.563" width="3529.17" height="6633.33" style="fill:#fff;"/><g id="x"><path d="M162.278,5.605c7.473,7.472 7.473,19.606 0,27.079l-129.594,129.594c-7.473,7.473 -19.607,7.473 -27.079,0c-7.473,-7.473 -7.473,-19.606 -0,-27.079l129.594,-129.594c7.473,-7.473 19.606,-7.473 27.079,-0Z" style="fill:#727272;"/><path d="M162.278,162.278c-7.473,7.473 -19.606,7.473 -27.079,0l-129.594,-129.594c-7.473,-7.473 -7.473,-19.607 -0,-27.079c7.472,-7.473 19.606,-7.473 27.079,-0l129.594,129.594c7.473,7.473 7.473,19.606 0,27.079Z" style="fill:#727272;"/></g></g></g></svg>
`;
const svgHamburgerMenu = `
<svg  width="100%" height="100%" viewBox="0 0 242 181" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g id="hamburger"><path d="M241.667,20.885c-0,11.526 -9.358,20.885 -20.885,20.885l-199.897,-0c-11.527,-0 -20.885,-9.359 -20.885,-20.885c0,-11.527 9.358,-20.885 20.885,-20.885l199.897,0c11.527,0 20.885,9.358 20.885,20.885Z" style="fill:currentColor;"/><path d="M241.667,90.306c-0,11.527 -9.358,20.885 -20.885,20.885l-199.897,-0c-11.527,-0 -20.885,-9.358 -20.885,-20.885c0,-11.527 9.358,-20.885 20.885,-20.885l199.897,0c11.527,0 20.885,9.358 20.885,20.885Z" style="fill:currentColor;"/><path d="M241.667,159.727c-0,11.527 -9.358,20.885 -20.885,20.885l-199.897,-0c-11.527,-0 -20.885,-9.358 -20.885,-20.885c0,-11.527 9.358,-20.885 20.885,-20.885l199.897,0c11.527,0 20.885,9.358 20.885,20.885Z" style="fill:currentColor;"/></g></svg>`

hamburgerButton.insertAdjacentHTML("beforeend", svgHamburgerMenu);
mobileCloseButton.insertAdjacentHTML("beforeend", svgCloseButton);
mobileCloseButton.addEventListener("click", disableHamburgerNavBar);
hamburgerButton.addEventListener("click", enableHamburgerNavBar);

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
}
function disableHamburgerNavBar(){    
    mobileNavBar.setAttribute("data-open", "false");
}
window.addEventListener("scroll", toggleGoToTopButton);

function toggleGoToTopButton()
{
    if (window.scrollY <= 200)
    {
        backToTopButton.style.display = "none"; 
        backToTopButton.classList.remove("spring-anim-class");
    }
    else
    {
        backToTopButton.style.display = "flex";
        backToTopButton.classList.add("spring-anim-class");
    }
}

