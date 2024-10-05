var url2 = "https://do.pishock.com/api/apioperate";
var url = "https://jsonplaceholder.typicode.com/albums/2/photos";
var divCounter = 0;

function fadeOut(ev) {
    var ele = ev.currentTarget;
    ele.style.transition = 'opacity 0.5s';
    ele.style.opacity = '0';
    let timer = setTimeout(function() {
      minusCounter();
      ele.remove();
      clearInterval(timer)
    }, 300);
}
  
function minusCounter(){
    divCounter--;
    var counterElement = document.getElementById('counter');
    counterElement.textContent = "Number of photos being displayed: " + divCounter;
}

function buildCard(data){
    var cardDiv = document.createElement("div");
    cardDiv.setAttribute('class', 'box-card');
    var imgTag = document.createElement('img');
    imgTag.setAttribute('class', "box-img");
    imgTag.setAttribute('src', data.thumbnailUrl);
    var titleTag = document.createElement('p');
    titleTag.setAttribute('class', 'box-title');
    titleTag.appendChild(document.createTextNode(data.title));
    var idTag = document.createElement('p');
    idTag.setAttribute('class', 'box-id');
    idTag.appendChild(document.createTextNode(data.id));
    var boxDiv = document.createElement("div");
    boxDiv.setAttribute('class', 'box-info');
    boxDiv.appendChild(titleTag);
    boxDiv.appendChild(idTag);
    cardDiv.appendChild(imgTag);
    cardDiv.appendChild(boxDiv);
    cardDiv.addEventListener("click", fadeOut);
    divCounter++;
    return cardDiv;
}

async function fetchWithDOMAPI(){
    try{
       var response = await fetch(url);
       var data = await response.json();
       console.log(data);
       var elements = data.map(buildCard);
       document.getElementById('box-list').append(...elements);

       var counterElement = document.getElementById('counter');
       counterElement.textContent = "Number of photos being displayed: " + divCounter;
    } catch (error) {
        console.log(error);
    }
}
console.log(url.response);
fetchWithDOMAPI();
