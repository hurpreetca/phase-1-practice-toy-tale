let addToy = false;
/* 
Introduction
*You've got a friend in need! Your friend Andy recently misplaced all their toys! 
Let's write an app that helps Andy keep track of them. For this lab, you will need
to pull together everything you've learned about manipulating the DOM, responding 
to events, and communicating with the server. Specifically, you will need to:

1. Access the list of toys from an API (mocked using JSON Server) and render each 
   of them in a "card" on the page

2. Hook up a form that enables users to add new toys. Create an event listener so 
   that, when the form is submitted, the new toy is persisted to the database and a 
   new card showing the toy is added to the DOM

3. Create an event listener that gives users the ability to click a button to "like" 
   a toy. When the button is clicked, the number of likes should be updated in the 
   database and the updated information should be rendered to the DOM */
function updateLikes(id, newNumberOfLikes){
  fetch(`http://localhost:3000/toys/${id}`, {
  method: "PATCH",
  headers:
  {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  
  body: JSON.stringify({
    "likes": newNumberOfLikes
  })})
}

function createCardElement(toy) {
  //Create Div element
  let card = document.createElement("div");
  // Add CARD class to the element
  card.classList.add("card");

  /*Creating child elements
  <div class="card">
  <h2>Woody</h2>
  <img src="[toy_image_url]" class="toy-avatar" />
  <p>4 Likes</p>
  <button class="like-btn" id="[toy_id]">Like ❤️</button>
  </div> */
  let h2 = document.createElement("h2");
  h2.textContent = toy.name;

  let img = document.createElement("img");
  img.src = toy.image;
  img.classList.add("toy-avatar");

  let p = document.createElement("p");
  p.textContent = `${toy.likes} Likes`;

  let button = document.createElement("button");
  button.addEventListener("click", () => {
   //Update Like element
    p.textContent= `${toy.likes += 1} Likes`
    //patch
    updateLikes(toy.id, toy.likes)
  })
  button.classList.add("like-btn");
  button.id = toy.id;
  button.textContent = "Like ❤️";

  card.append(h2, img, p, button);
  document.getElementById("toy-collection").appendChild(card);
}
function sendItOut(newToy){
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers:
  {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  
  body: JSON.stringify({
    /*This will secretly use all the properties of newToy like 
    "image : newToy.image & name: newToy.name */
    ...newToy,
    "likes": 0
  })})
  .then((response) => response.json())
  .then(responseToy => createCardElement(responseToy))
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => toys.forEach(toy => createCardElement(toy)));

  const form = document
    .querySelector("form.add-toy-form")
  form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));

      sendItOut(formData)
    });

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
