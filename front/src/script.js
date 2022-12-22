const URL = "http://localhost:3000/api/products";
const items = document.querySelector("#items");

//on appelle la fonction getProducts
getProducts(URL);

function getProducts(URL) {
  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayProduct(data);
    });
}

//fonction displayProduct pour afficher les kanaps
function displayProduct(data) {
  data.forEach((element) => {
    const anchor = document.createElement("a");
    anchor.href = "product.html?id=" + element._id;
    const article = document.createElement("article");
    const img = document.createElement("img");
    img.src = element.imageUrl;
    //alt de l'image
    img.setAttribute("alt", element.altTxt);
    console.log(article);
    const Title = document.createElement("h3");
    Title.classList.add("productName");
    Title.textContent = element.name;
    const pg = document.createElement("p");
    pg.classList.add("productDescription");
    pg.textContent = element.description;
    article.appendChild(img);
    article.appendChild(Title);
    article.appendChild(pg);

    anchor.appendChild(article);

    items.appendChild(anchor);
    //items.innerHTML += `<h2>${element.name}</h2>`;
  });
  const imageUrl = data[0].imageUrl;
  console.log("url de l'image", imageUrl);
  /*
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.text = "un super canard";
    const items = document.querySelector("#items");
    if (items != null) {
        items.appendChild(anchor);
        console.log("cc");
    }*/
}
