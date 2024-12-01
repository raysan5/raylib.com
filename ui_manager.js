const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
        <path
            d="M22.2064 10.1687L12.8314 0.793739C12.653 0.623038 12.4428 0.489228 12.2126 0.399989C11.7561 0.212455 11.2441 0.212455 10.7876 0.399989C10.5574 0.489228 10.3472 0.623038 10.1689 0.793739L0.793854 10.1687C0.619031 10.3436 0.480355 10.5511 0.385742 10.7795C0.291129 11.0079 0.242432 11.2528 0.242432 11.5C0.242432 11.9993 0.440784 12.4782 0.793854 12.8312C1.14692 13.1843 1.62579 13.3827 2.1251 13.3827C2.62442 13.3827 3.10328 13.1843 3.45635 12.8312L9.6251 6.64374V20.875C9.6251 21.3723 9.82265 21.8492 10.1743 22.2008C10.5259 22.5524 11.0028 22.75 11.5001 22.75C11.9974 22.75 12.4743 22.5524 12.8259 22.2008C13.1776 21.8492 13.3751 21.3723 13.3751 20.875V6.64374L19.5439 12.8312C19.7182 13.007 19.9255 13.1465 20.154 13.2417C20.3825 13.3369 20.6276 13.3859 20.8751 13.3859C21.1226 13.3859 21.3677 13.3369 21.5962 13.2417C21.8247 13.1465 22.032 13.007 22.2064 12.8312C22.3821 12.6569 22.5216 12.4496 22.6168 12.2211C22.712 11.9926 22.761 11.7475 22.761 11.5C22.761 11.2525 22.712 11.0074 22.6168 10.7789C22.5216 10.5504 22.3821 10.343 22.2064 10.1687Z"
            fill="black" />
        </svg>
        `;
class GoToTopButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    // this.classList.add('go-to-top-button');
    const style = document.createElement("style");
    style.textContent = `
            @keyframes springAnim{
                0%{transform:scale(0)}
                30%{transform:scale(1.8)}
                50%{transform:scale(.9)}
                100%{transform:scale(1)}
            }
            
            :host{
                --button-size: 60px;
                display: none;
                position: fixed;
                bottom: 100px;
                right:5dvw;
                z-index: 1000;
                // padding: 50px;
                width: var(--button-size);
                height: var(--button-size);
                align-items: center;
                justify-content: center;
                // transform-origin: 50% 50%;
                border-radius: 50%;
                background-color: rgb(255, 255, 255);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                transition: scale 0.2s ease-in-out;
            }
            :host(.spring-anim-class){
                display:flex;
                animation:springAnim .6s forwards;
            }
            :host(:hover){cursor:pointer; scale: 1.4;}
            @media print{&:host{display:none;}}
        `;
    this.href = "#";
    const svgElem = document.createElement("template");
    svgElem.innerHTML = svg;
    shadow.appendChild(svgElem.content.cloneNode(true));
    shadow.appendChild(style);
  }
  connectedCallback() {
    this.addEventListener("click", () => {
      window.scrollTo(0, 0);
    });
    window.addEventListener("scroll", () => {
        this.classList.toggle("spring-anim-class", window.scrollY > 200);
    })
  }
}
customElements.define("go-to-top-button", GoToTopButton);
