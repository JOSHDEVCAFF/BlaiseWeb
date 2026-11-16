const navigation = [
  ["01", "Pantry Items", "index.html", "pantry"],
  ["02", "About Us", "about.html", "about", [
    ["Company Profile", "profile.html", "profile"],
    ["Organization Chart", "org-chart.html", "org-chart"],
    ["History", "history.html", "history"]
  ]],
  ["03", "Programs & Services", "services.html", "services"],
  ["04", "Contact", "contact.html", "contact"],
  ["05", "FAQ", "faq.html", "faq"],
  ["06", "Portfolio", "portfolio.html", "portfolio"],
  ["07", "Featured Supplies", "index.html#pantry-items", "supplies"],
  ["08", "Pickup Request", "checkout.html", "checkout"],
  ["09", "Donations & Support", "payment.html", "payment"]
];

const products = [
  {id:"seasonal-produce",name:"Seasonal produce box",detail:"A mix of local fruit & veg · 1 box",category:"Produce",image:"photo-1540420773420-3366772f4999",tag:"FRESH PICK",priceCents:400},
  {id:"carrots",name:"Garden carrots",detail:"Fresh bunch · locally grown",category:"Produce",image:"photo-1445282768818-728615cc910a",tag:"LOCAL",priceCents:100},
  {id:"oats",name:"Rolled oats",detail:"Whole grain · 900 g bag",category:"Pantry",image:"photo-1574323347407-f5e1ad6d020b",tag:"PANTRY",priceCents:150},
  {id:"tomatoes",name:"Chopped tomatoes",detail:"No salt added · 796 ml can",category:"Pantry",image:"photo-1547592180-85f173990554",tag:"VEGAN",priceCents:75},
  {id:"eggs",name:"Farm fresh eggs",detail:"Free range · 6 pack",category:"Chilled",image:"photo-1518569656558-1f25e69d93d7",tag:"CHILLED",priceCents:200},
  {id:"lentils",name:"Red lentils",detail:"Plant protein · 500 g bag",category:"Pantry",image:"photo-1515543904379-3d757afe72e4",tag:"VEGAN",priceCents:125},
  {id:"bread",name:"Whole grain bread",detail:"Freshly baked · 1 loaf",category:"Essentials",image:"photo-1509440159596-0249088772ff",tag:"BAKERY",priceCents:150},
  {id:"milk",name:"Shelf-stable oat drink",detail:"Dairy-free · 1 L carton",category:"Chilled",image:"photo-1550583724-b2692b85b150",tag:"DAIRY-FREE",priceCents:200}
];

const formatPrice = priceCents => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(priceCents/100);
function getBasket(){
  try{
    const stored=JSON.parse(localStorage.getItem("neighbourhood-pantry-basket")||"{}");
    return stored&&typeof stored==="object"&&!Array.isArray(stored)?stored:{};
  }catch(error){
    console.error("Could not read the pantry basket from local storage.",error);
    return {};
  }
}
function saveBasket(basket){
  try{localStorage.setItem("neighbourhood-pantry-basket",JSON.stringify(basket))}
  catch(error){console.error("Could not save the pantry basket.",error);showNotice("Your basket could not be saved in this browser.")}
}
function basketCount(){return Object.values(getBasket()).reduce((sum,value)=>sum+(Number(value)||0),0)}
function renderSharedLayout(){
  const page=document.body.dataset.page||"pantry";
  const header=document.getElementById("site-header");
  if(header)header.innerHTML=`<header class="topbar"><a class="brand" href="index.html" aria-label="Neighbourhood Pantry home"><span class="brand-mark" aria-hidden="true">✳</span><span><span class="brand-name">Neighbourhood Pantry</span><span class="brand-tagline">Nourishing our community</span></span></a><div class="header-hours"><span class="status-dot"></span><span><strong>Open today</strong> · 9:00 AM–4:00 PM</span></div><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">☰ <span>Menu</span></button><a class="basket-link" href="checkout.html">Your Basket <span id="basket-count">(${basketCount()})</span> →</a></header>`;
  const nav=document.getElementById("site-nav");
  if(nav)nav.innerHTML=`<nav class="side-nav" id="primary-navigation" aria-label="Main navigation"><p class="nav-label">A place for everyone</p><ol class="nav-list">${navigation.map(([number,label,url,key,children])=>{const aboutCurrent=key==="about"&&["about","profile","org-chart","history"].includes(page);const submenu=children?`<ol class="nav-sublist">${children.map(([childLabel,childUrl,childKey])=>`<li><a href="${childUrl}" ${page===childKey?"aria-current=\"page\"":""}>${childLabel}</a></li>`).join("")}</ol>`:"";return `<li class="${children?`nav-group${aboutCurrent?" nav-group-current":""}`:""}"><a href="${url}" ${page===key?"aria-current=\"page\"":""}><span>${number}</span>${label}</a>${submenu}</li>`}).join("")}</ol><div class="nav-bottom"><p>Good food is better when it’s shared.</p><a class="text-link" href="payment.html">Support the pantry <span>→</span></a></div></nav>`;
  const aside=document.getElementById("site-aside");
  if(aside)aside.innerHTML=page==="portfolio"?`<aside class="info-aside portfolio-aside"><section class="aside-card"><p class="aside-title">A little note</p><h2>Practice.<br>Learn.<br>Repeat.</h2><p class="aside-copy">Each project is another chance to explore, try new skills, and make something of my own.</p></section><section class="aside-card"><p class="aside-title">On this page</p><a class="portfolio-aside-link" href="#activities-title">01 &nbsp; Activities</a><a class="portfolio-aside-link" href="#exercises-title">02 &nbsp; Coding exercises</a></section></aside>`:`<aside class="info-aside"><section class="aside-card"><p class="aside-title">How pickup works</p><div class="steps"><div class="step"><span class="step-number">01</span><div><strong>Choose your items</strong><p>Take what your household can use.</p></div></div><div class="step"><span class="step-number">02</span><div><strong>Pick a time</strong><p>We’ll have your basket ready.</p></div></div><div class="step"><span class="step-number">03</span><div><strong>Come as you are</strong><p>Affordable groceries, no judgement. Just neighbours.</p></div></div></div></section><section class="aside-card"><p class="aside-title">Give what you can</p><p class="aside-copy">Food, time, or a little support—all of it makes a difference.</p><p style="margin:12px 0 0"><a class="donation-link" href="payment.html">Ways to support →</a></p></section><section class="aside-card"><p class="aside-title">Find us here</p><p class="contact-small">Mandaue City, Cebu PH Centro<br><a href="tel:+15550140142">(555) 014-0142</a></p></section></aside>`;
  const footer=document.getElementById("site-footer");
  if(footer)footer.innerHTML=`<footer class="site-footer"><span>© ${new Date().getFullYear()} Neighbourhood Pantry · Nourishing our community</span><div class="footer-links"><a href="faq.html">FAQs</a><a href="contact.html">Contact</a><a href="payment.html">Give support</a></div></footer>`;
  document.querySelector(".menu-toggle")?.addEventListener("click",event=>{
    const button=event.currentTarget;
    const menu=document.getElementById("primary-navigation");
    const open=button.getAttribute("aria-expanded")==="true";
    button.setAttribute("aria-expanded",String(!open));
    menu.classList.toggle("is-open",!open);
    button.querySelector("span").textContent=open?"Menu":"Close";
  });
}
function updateBasketCount(){
  const count=document.getElementById("basket-count");
  if(count)count.textContent=`(${basketCount()})`;
}
function showNotice(message){
  let notice=document.querySelector(".site-notice");
  if(!notice){notice=document.createElement("div");notice.className="site-notice";notice.setAttribute("role","status");Object.assign(notice.style,{position:"fixed",bottom:"18px",left:"50%",transform:"translateX(-50%)",zIndex:"20",padding:"11px 16px",background:"#20352c",color:"#fff",fontSize:"12px",boxShadow:"0 5px 22px #0002"});document.body.appendChild(notice)}
  notice.textContent=message;
  window.setTimeout(()=>notice.remove(),2800);
}
function renderProducts(filter="All"){
  const grid=document.getElementById("product-grid");
  if(!grid)return;
  const available=products.filter(product=>filter==="All"||product.category===filter);
  grid.innerHTML=available.map(product=>`<article class="product-card"><div class="product-image"><img src="https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=600&q=80" alt="${product.name}" loading="lazy"><span class="product-tag">${product.tag}</span></div><div class="product-info"><h3>${product.name}</h3><p>${product.detail}</p><div class="product-bottom"><span class="availability">● Available today</span><span class="product-price">${formatPrice(product.priceCents)}</span><button class="add-button" type="button" data-add="${product.id}">+ Add to basket</button></div></div></article>`).join("")||"<p class=\"empty-products\">No items in this category just now. Try another shelf.</p>";
  grid.querySelectorAll("[data-add]").forEach(button=>button.addEventListener("click",()=>{
    const basket=getBasket();basket[button.dataset.add]=(Number(basket[button.dataset.add])||0)+1;saveBasket(basket);updateBasketCount();button.textContent="✓ Added";window.setTimeout(()=>{if(button.isConnected)button.textContent="+ Add to basket"},1100);
  }));
}
function renderCheckout(){
  const container=document.getElementById("basket-items");
  if(!container)return;
  const basket=getBasket();
  const entries=products.filter(product=>Number(basket[product.id])>0);
  const totalCents=entries.reduce((total,product)=>total+product.priceCents*(Number(basket[product.id])||0),0);
  container.innerHTML=entries.length?entries.map(product=>`<div class="basket-row"><img src="https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=120&q=75" alt=""><div><strong>${product.name}</strong><small>${product.detail}</small><span class="basket-item-price">${formatPrice(product.priceCents)} each</span></div><div class="quantity-control"><button type="button" data-change="-1" data-id="${product.id}" aria-label="Remove one ${product.name}">−</button><span>${Number(basket[product.id])}</span><button type="button" data-change="1" data-id="${product.id}" aria-label="Add one ${product.name}">+</button></div></div>`).join(""):"<p class=\"basket-empty\">Your basket is waiting for something good. <a href=\"index.html#pantry-items\">Browse the pantry →</a></p>";
  document.getElementById("basket-total-amount").textContent=formatPrice(totalCents);
  container.querySelectorAll("[data-change]").forEach(button=>button.addEventListener("click",()=>{
    const current=getBasket();const next=(Number(current[button.dataset.id])||0)+Number(button.dataset.change);
    if(next>0)current[button.dataset.id]=next;else delete current[button.dataset.id];
    saveBasket(current);updateBasketCount();renderCheckout();
  }));
}
function initFilters(){
  const buttons=document.querySelectorAll(".filter-button");
  buttons.forEach(button=>button.addEventListener("click",()=>{
    buttons.forEach(item=>item.classList.remove("active"));button.classList.add("active");renderProducts(button.dataset.filter);
  }));
}
function initActivityPagination(){
  [
    {grid:"activity-grid",previous:"activity-prev",next:"activity-next",count:"activity-count"},
    {grid:"exercise-grid",previous:"exercise-prev",next:"exercise-next",count:"exercise-count"}
  ].forEach(({grid,previous,next,count})=>{
    const container=document.getElementById(grid);
    if(!container)return;
    const cards=[...container.querySelectorAll(".showcase-card")];
    const previousButton=document.getElementById(previous),nextButton=document.getElementById(next),counter=document.getElementById(count);
    let start=0;
    function display(){
      const pageSize=window.matchMedia("(max-width: 760px)").matches?1:3;
      const lastStart=Math.max(0,Math.ceil(cards.length/pageSize)*pageSize-pageSize);
      cards.forEach((card,index)=>card.classList.toggle("showcase-visible",index>=start&&index<start+pageSize));
      counter.textContent=`${String(start+1).padStart(2,"0")}–${String(Math.min(start+pageSize,cards.length)).padStart(2,"0")} / ${String(cards.length).padStart(2,"0")}`;
      previousButton.disabled=start===0;
      nextButton.disabled=start>=lastStart;
    }
    previousButton.addEventListener("click",()=>{if(start>0){start=Math.max(0,start-(window.matchMedia("(max-width: 760px)").matches?1:3));display()}});
    nextButton.addEventListener("click",()=>{const pageSize=window.matchMedia("(max-width: 760px)").matches?1:3;const lastStart=Math.max(0,Math.ceil(cards.length/pageSize)*pageSize-pageSize);if(start<lastStart){start=Math.min(lastStart,start+pageSize);display()}});
    window.addEventListener("resize",()=>{start=0;display()});
    display();
  });
}
function initForms(){
  const contact=document.getElementById("contact-form");
  contact?.addEventListener("submit",event=>{event.preventDefault();document.getElementById("contact-feedback").textContent="Thanks for reaching out. This demo form is ready to connect to your inbox.";contact.reset()});
  const pickup=document.getElementById("pickup-form");
  pickup?.addEventListener("submit",event=>{
    event.preventDefault();
    const items=basketCount();
    document.getElementById("pickup-feedback").textContent=items?"Your pickup request is noted in this demo. Our team will be in touch to confirm.":"Please add at least one pantry item before requesting a pickup.";
    if(items){pickup.reset();try{localStorage.removeItem("neighbourhood-pantry-basket")}catch(error){console.error("Could not clear the pantry basket.",error)}updateBasketCount();renderCheckout()}
  });
  const donation=document.getElementById("donation-form");
  donation?.addEventListener("submit",event=>{event.preventDefault();const amount=new FormData(donation).get("amount");document.getElementById("donation-feedback").textContent=`Thank you for offering a $${amount} gift. This demo does not process payments; our team will follow up.`;donation.reset()});
}
renderSharedLayout();
renderProducts();
initFilters();
renderCheckout();
initActivityPagination();
initForms();
