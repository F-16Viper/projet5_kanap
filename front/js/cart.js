
let kanapArray = [];

if (localStorage.getItem("kanapArray")) {
    kanapArray = JSON.parse(localStorage.getItem("kanapArray"))
}



kanapArray.forEach((item) => displayItem(item))

const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e))

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

    const cardItemContent = makeCartContent(item)
    article.appendChild(cardItemContent)

    displayArticle(article)
    displayTotalPrice()
    displayTotalQuantity()
}

function displayTotalQuantity() {
    const totalQuantity = document.querySelector("#totalQuantity")
    const total = kanapArray.reduce((total, item) => total + item.quantity, 0)
    totalQuantity.textContent = total
}

function displayTotalPrice() {
    let total = 0
    const totalPrice = document.querySelector("#totalPrice")
       
    kanapArray.forEach(item => {
        const totalUnitPrice = item.price * item.quantity
        total += totalUnitPrice
    })
    totalPrice.textContent = total
}


function makeCartContent(item) {
    const cardItemContent = document.createElement("div")
    cardItemContent.classList.add("cart__item__content")

    const descriptions = makeDescriptions(item)
    const settings = makeSettings(item)
    
    cardItemContent.appendChild(descriptions)
    cardItemContent.appendChild(settings)

    return cardItemContent
}

function makeSettings(item) {

    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")
    addQuantityToSettings(settings, item)
    addDeleteToSettings(settings)
    return settings
}

function addDeleteToSettings(settings) {
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    div.addEventListener("click", () => deleteItem(item))

    const p = document.createElement("p")
    p.textContent = "supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

/*function deleteItem(item) {
    const itemToDelete = kanapArray.findIndex(
        (product) => product.id === item.id && product.color === item.color)
    kanapArray.splice(itemToDelete, 1)
    console.log(kanapArray);
    
    displayTotalPrice()
    displayTotalQuantity()
    deleteDataFromCache(item)
    deleteArticleFromPage(item)

}

function deleteArticleFromPage(item) {
    const articleToDelete = document.querySelector(`article[data-id="${item.id}"][data-color="${item.color}"]`)
    articleToDelete.remove()
}

function deleteDataFromCache(item) {
    const key = `${item.id}-${item.color}`
    console.log("on retire la", key);
    localStorage.removeItem(key)
}*/



function addQuantityToSettings(settings, item) {
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")

    const p = document.createElement("p")
    p.textContent = "Qté : "
    quantity.appendChild(p)
    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuatity")
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity
    input.addEventListener("input", ()=> updatePriceAndQuantity(item.id, input.value, item))


    quantity.appendChild(input)
    settings.appendChild(quantity)
}

function updatePriceAndQuantity(id, newValue, item) {
   const itemToUpdate = kanapArray.find((item) => item.id === id)
    itemToUpdate.quantity = Number(newValue)
    item.quantity = itemToUpdate.quantity
    displayTotalQuantity()
    displayTotalPrice()
    saveTheNewData(item)
}

function saveTheNewData(item) {
    const dataToSave = JSON.stringify(item)
    localStorage.setItem(item.id, dataToSave)
}

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

function submitForm(e) {
    e.preventDefault()
    if (kanapArray.length === 0) {
        alert("please select items to buy")
        return 
    }

    if (validateForm()) return
    if (isEmailInvalid()) return

    const body = makeBody()
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((data) => {
            const orderId = data.orderId
            window.location.href = "/html/confirmation.html" + "?orderId=" + orderId
            return console.log(data)
        })
        .catch((err) => console.log(err))
}

function validateForm() {
    const form = document.querySelector(".cart__order__form")
    const inputs = form.querySelectorAll("input")
    inputs.forEach((input) => {
        if (input.value === "") {
           alert("please fill all the fields")
            return true
        }
        return false
    })
}

function isEmailInvalid() {
    const email = document.querySelector("#email").value
    const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
    if (regex.test(email) === false) {
        alert("Please enter valid email")
        return true
    }

    return false
}

function makeBody() {
    const form = document.querySelector(".cart__oder__form")
    const firstName = form.elements.firstName.value;
    const lastName = form.elements.lastName.value;
    const adress = form.elements.adress.value;
    const city = form.elements.city.value;
    const email = form.elements.email.value;
    const body = {
        contact: {
            firstName: firstName,
            lastName: lastName,
            adress: adress,
            city: city,
            email: email
        },
        products: getIdsFromCache()
    }
    return body
}

function getIdsFromCache() {
    const numberOfProducts = localStorage.length
    const ids = []
    for (let i = 0; i < numberOfProducts; i++) {
        const key = localStorage.key(i)
        const id = key.split("-")[0]
        ids.push(id)
    }

    return ids
}

