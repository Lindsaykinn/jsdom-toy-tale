let addToy = false;
let toysCollection = document.getElementById('toy-collection')

const baseUrl = 'http://localhost:3000'


function getToys(){
  fetch(baseUrl + '/toys')
  .then(function(resp){
    return resp.json();
  })
  .then(function(toys){
    toys.forEach(toy => {
      renderToys(toy)
    })
  })
}

function submitToy(toy_data){
  fetch(baseUrl + "/toys", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      'name': toy_data.name.value,
      'image': toy_data.image.value,
      'likes': 0
    })
  })
  .then(resp => resp.json())
  .then((toy_object) => {
    let new_toy = renderToys(toy_object)
    toysCollection.append(new_toy)
  })
}

function renderToys(toy){
  
  let cardDiv = document.createElement('div');
  cardDiv.className = 'card'
  let name = document.createElement('h2');
  let image = document.createElement('img');
  image.className = 'toy-avatar';
  image.setAttribute('src', toy.image)
  let likes = document.createElement('p');
  let button = document.createElement('button');
  button.className = 'like-btn';
  button.setAttribute('id', toy.id)
  
  
  name.innerText = toy.name;
  likes.innerText = `${toy.likes} likes`;
  button.innerText = 'like'
  button.addEventListener('click', function(e){
    console.log(e.target.dataset);
    likeToy(e)
  })
  
  cardDiv.append(name, image, likes, button)
  toysCollection.append(cardDiv)
  
}

function likeToy(e){
  e.preventDefault();
  let more = parseInt(e.target.previousElementSibling.innerText) + 1
  
  fetch(baseUrl + `/toys/${e.target.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": more
    })
  })
  .then(resp=>resp.json())
  .then((object=> {
    e.target.previousElementSibling.innerText = `${more} likes`;
  }))
  
  
}

document.addEventListener("DOMContentLoaded", () => {
  getToys();
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener('submit', event =>{
        event.preventDefault();
        submitToy(event.target)
      })
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});