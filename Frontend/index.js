  /* DOM ELEMENTS */
const shoeList = document.getElementById("shoe-list");
const formContainer = document.getElementById("form-container");

const cardBody = document.querySelector(".card-body");
const shoeImage = document.getElementById("shoe-image");
const shoeName = document.getElementById("shoe-name");
const shoeDescription = document.getElementById("shoe-description");
const shoePrice = document.getElementById("shoe-price");
const reviewsList = document.getElementById("reviews-list");

let reviewForm;
let currentShoe;

  /* EVENT LISTENERS */
shoeList.addEventListener("click", handleShoeClick);

  /* EVENT HANDLERS */
function handleShoeClick(event) {
  if (event.target.className === "list-group-item") {
    let clickedShoe = allShoes.find( shoe => shoe.id === parseInt(event.target.id));
    renderShoeToMainController(clickedShoe);
  }
};

function handleFormSubmit(event) {
  event.preventDefault();

  newReview = {
    content: reviewField.value
  };
  postReviewToShoe(newReview);
  renderShoeToMainController(currentShoe);
};

  /* FETCHES */
// initial fetch of all shoes
let allShoes = []
const initialShoeFetch = function() {
  fetch('http://localhost:3000/shoes')
  .then( response => response.json() )
  .then( json => {
    allShoes = json;
    renderShoeToMainController(allShoes[0]);
    renderAllShoes(json);
  })
};

// POST fetch to add new review to shoe
const postReviewToShoe = function(review) {
  fetch(`http://localhost:3000/shoes/${currentShoe.id}/reviews`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(review)
  })
};

  /* RENDER FUNCTIONS */
// render all shoes to sidebar initially
function renderOneShoe(shoe) {
  shoeLi = document.createElement("li");
  shoeLi.id = shoe.id;
  shoeLi.className = "list-group-item";
  shoeLi.textContent = shoe.name;

  shoeList.append(shoeLi);
};
function renderAllShoes(shoes) {
  shoes.forEach( shoe => renderOneShoe(shoe) );
};

// render one shoe to the main controller body
function renderShoeToMainController(shoe) {
  currentShoe = shoe;
  shoeImage.src = `${shoe.image}`;
  shoeName.innerText = shoe.name;
  shoeDescription.innerText = shoe.description;
  shoePrice.innerText = shoe.price;
  formContainer.innerHTML = `
    <form id="new-review">
    <div class="form-group">
      <textarea class="form-control" id="review-content" rows="3"></textarea>
      <input type="submit" class="btn btn-primary"></input>
    </div>
    </form>`

  reviewForm = document.getElementById("new-review");
  reviewField = document.querySelector(".form-control");
  reviewForm.addEventListener("submit", handleFormSubmit);

  let shoeReviews = shoe.reviews;
  clearChildren(reviewsList);
  shoeReviews.forEach( review => renderOneReview(review) )
};
// render one review under shoe; used for iterating through all reviews
function renderOneReview(review) {
  let reviewLi = document.createElement("li");
  reviewLi.id = review.id;
  reviewLi.className = "list-group-item";
  reviewLi.innerText = review.content;

  reviewsList.append(reviewLi);
};

  /* MISC FUNCTIONS */
// clears all children of an element
function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

  /* INITIAL RUNNERS */
initialShoeFetch();