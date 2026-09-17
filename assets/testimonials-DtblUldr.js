import"./modulepreload-polyfill-3xzlJT5O.js";import{t as e}from"./tours-data-CcOkLPxJ.js";document.addEventListener(`DOMContentLoaded`,()=>{let t=document.querySelector(`.navbar`);t&&window.addEventListener(`scroll`,()=>{window.scrollY>50?t.classList.add(`scrolled`):t.classList.remove(`scrolled`)});let n=document.querySelectorAll(`.fade-in`),r=new IntersectionObserver((e,t)=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`appear`),t.unobserve(e.target))})},{threshold:.15,rootMargin:`0px 0px -50px 0px`});n.forEach(e=>r.observe(e));let i=document.querySelector(`.homepage .travel-showcase .sliding-cards-grid`);if(i){let e,t=()=>{let e=i.querySelector(`.sliding-card`);if(!e)return;let t=parseFloat(getComputedStyle(i).gap)||0,n=e.getBoundingClientRect().width+t,r=i.scrollLeft+i.clientWidth>=i.scrollWidth-8;i.scrollTo({left:r?0:i.scrollLeft+n,behavior:`smooth`})},n=()=>{window.clearInterval(e),e=window.setInterval(t,4200)},r=()=>window.clearInterval(e);n(),i.addEventListener(`mouseenter`,r),i.addEventListener(`mouseleave`,n),i.addEventListener(`focusin`,r),i.addEventListener(`focusout`,n)}let a=document.querySelector(`.mobile-menu-btn`),o=document.querySelector(`.nav-links`);a&&o&&a.addEventListener(`click`,()=>o.classList.toggle(`active`)),window.location.pathname.includes(`tour-details.html`)&&(()=>{let t=e[new URLSearchParams(window.location.search).get(`tour`)];if(!t)return;let n=document.querySelector(`.page-header h1`),i=document.querySelector(`.header-subtitle`),a=document.querySelector(`.page-header`);n&&(n.textContent=t.title),i&&(i.textContent=t.subtitle),a&&(a.style.backgroundImage=`linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${t.heroImg}')`);let o=document.querySelector(`.tour-overview-text`);o&&(o.textContent=t.description);let s=document.querySelector(`.places-list`);s&&(s.innerHTML=t.places.map(e=>`
        <div class="place-premium-card fade-in">
          <div class="place-img">
            <img src="${e.img}" alt="${e.name}">
          </div>
          <div class="place-info">
            <h4>${e.name}</h4>
            <p>${e.desc}</p>
          </div>
        </div>
      `).join(``),s.querySelectorAll(`.fade-in`).forEach(e=>r.observe(e)));let c=document.querySelector(`.wa-booking-btn`);c&&(c.href=`https://wa.me/918111844058?text=${encodeURIComponent(`Hi Heartenza Services! I am interested in booking the ${t.title} package.`)}`)})();let s=document.getElementById(`bookingModal`),c=document.querySelectorAll(`.trigger-booking-modal`),l=document.querySelector(`.close-modal`),u=document.getElementById(`bookingForm`);if(s&&c){c.forEach(e=>{e.addEventListener(`click`,e=>{e.preventDefault(),s.classList.add(`active`),document.body.style.overflow=`hidden`})});let e=()=>{s.classList.remove(`active`),document.body.style.overflow=`auto`};l&&l.addEventListener(`click`,e),window.addEventListener(`click`,t=>{t.target===s&&e()}),document.querySelectorAll(`.accordion-header`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.type===`checkbox`||t.target.classList.contains(`checkmark`)||e.parentElement.classList.toggle(`active`)})}),document.querySelectorAll(`.dest-checkbox`).forEach(e=>{e.addEventListener(`change`,()=>{e.closest(`.accordion-item`).querySelectorAll(`input[name="places"]`).forEach(t=>{t.checked=e.checked})})})}u&&u.addEventListener(`submit`,e=>{e.preventDefault();let t=new FormData(u),n=t.get(`fullName`),r=t.get(`email`),i=t.get(`city`),a=t.get(`country`),o=t.get(`startDate`),c=t.get(`endDate`),l=t.get(`category`),d=t.get(`budget`),f=``;if(document.querySelectorAll(`.accordion-item`).forEach(e=>{let t=e.querySelector(`.dest-checkbox`),n=e.querySelectorAll(`input[name="places"]:checked`);if(t.checked||n.length>0){let e=t.value,r=Array.from(n).map(e=>e.value).join(`, `);f+=`\n      - ${e} : ${r||`All Places`}`}}),!f){alert(`Please select at least one destination or place.`);return}let p=`Hello, I would like to book a tour:

*Name:* ${n}  
*Email:* ${r}  
*Location:* ${i}, ${a}  

*Destinations:* ${f}

*Travel Dates:* ${o} to ${c}  

*Travel Type:* ${l}  
*Budget:* ${d}  

Please assist me with the booking.`,m=`https://wa.me/918111844058?text=${encodeURIComponent(p)}`;window.open(m,`_blank`),s.classList.remove(`active`),document.body.style.overflow=`auto`,u.reset()}),window.addEventListener(`load`,()=>{let e=document.getElementById(`loader-wrapper`);e&&setTimeout(()=>{e.classList.add(`loaded`)},500)})});