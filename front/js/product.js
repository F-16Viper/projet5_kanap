const url = new URL(window.location.href);
const id = url.searchParams.get("id");
const queryString = window.location.search;
let kanapArray = [];

if (localStorage.getItem("kanapArray")) {
    kanapArray = JSON.parse(localStorage.getItem("kanapArray"))
    console.log("KanapArray");
}

if (id != null) {
    let itemPrice = 0;
    let imgUrl, altTxt, articleName;
}
console.log(id);

fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((res) => HandleData(res))

function HandleData(kanap) {
    console.log({kanap});
  const { altTxt, description, colors, imageUrl, name, price, _id } = kanap;
  itemPrice = price;
  imgUrl = imageUrl;
  altText = altTxt;
  articleName = name;
  makeImage(imageUrl, altTxt);
  makeTitle(name);
  makePrice(price);
  makeDescription(description);
  makeColors(colors);
}

function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = altTxt;
    const DivParent = document.querySelector(".item__img")
    
    if (DivParent != null) DivParent.appendChild(image);
        
}

function makeTitle (name) {
    const h1 = document.querySelector("#title");
    if (h1 != null) h1.textContent = name;
}

function makePrice (price) {
    const span = document.querySelector("#price");
    if (span != null) span.textContent = price;

}

function makeDescription (description) {
    const p = document.querySelector("#description");
    if (p != null) p.textContent = description;
}

function makeColors (colors) {
    const select = document.querySelector("#colors");
    if (select != null) {
        colors.forEach((colors) => {
            const option = document.createElement("option");
            option.value = colors;
            option.textContent = colors;
            select.appendChild(option);
        })
    }
}

const button = document.querySelector("#addToCart")

button.addEventListener("click", handleClick)

function handleClick () {
    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value
    checkIfCardValid(color, quantity);
    if (checkIfCardValid(color, quantity)) return
    saveToCard(color, quantity);
    redirectToCard();
}


function saveToCard (color, quantity) {
    const data = {
        id: id,
        color: color,
        quantity: Number(quantity),
        price: itemPrice,
        imageUrl : imgUrl,
        altTxt : altText,
        name : articleName
    }
    kanapArray.push(data)
    kanapArray.forEach((kanap) => console.log(kanapArray.id, kanap.color))
    localStorage.setItem("kanapArray", JSON.stringify(kanapArray));
    
}

function checkIfCardValid(color, quantity) {
    if (color == null || color === "" || quantity == null || quantity === "") {
        alert("please select a quantity")
        return true
    }
}

function redirectToCard() {
    window.location.href = "cart.html";
}