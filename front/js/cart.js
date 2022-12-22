let cart = [];
retrieveItemFromCart()

cart.forEach((item) => displayItem(item))

function retrieveItemFromCart() {
    const numberOfItems = localStorage.length;
    for (let i = 0; i <= numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i)) || ""
        const itemObject = JSON.parse(item)
        cart.push(itemObject);
    }
}

function displayItem (item) {
    const article = makeArticle(item);
    const imageDiv = makeImageDiv(item);
    article.appendChild(imageDiv);

    makeCartContent(item)
    displayArticle(article)
}



function makeCartContent(item) {
    const cardItemContent = document.createElement("div")
    cardItemContent.classList.add("cart__item__content")

    const descriptions = makeDescriptions(item)
    //const settings = makeSettings()
    
    cardItemContent.appendChild(descriptions)
    //cardItemContent.appendChild(settings)
}

/*function makeSettings(item) {
    return ""
}*/

function makeDescriptions(item) {
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.name

    const p = document.createElement("p")
    p.textContent = item.color

    const p2 = document.createElement("p")
    p2.textContent = item.price + " €"

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)

    return description
}


function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article)
}

function makeArticle (item) {
    const article  = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color 
    return article
}

function makeImageDiv(item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt
    div.appendChild(image)
    
    return div
}
