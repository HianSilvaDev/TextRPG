const container = document.querySelector('.container');

let Region;


function chooseForm(name){
  switch (name){
    case 'region':
      container.innerHTML = regionForm;
      container.classList.add("FormRegion")
      break
    case 'cordinates':
      container.classList.add("CordinatesForm")
      container.innerHTML = cordinatesForm;
      break
    case 'enemy': 
      container.innerHTML = `<img src="https://img.freepik.com/premium-photo/otzarreta-beech-forest-gorbea-natural-park-spain_138213-206.jpg?w=740" alt="Imagem"/>`
    default:
      break
  }
}












const img = [
  "https://img.freepik.com/free-photo/old-beech-forest-spain_181624-40499.jpg?t=st=1720191436~exp=1720195036~hmac=0b4dc107f0c56da5a66898040086e6ea69a1937904f2e3691fdf7097e6e27c29&w=740",
  "https://img.freepik.com/free-photo/old-beech-forest-autunm_181624-29633.jpg?t=st=1720191216~exp=1720194816~hmac=995ad122fba676ce8749706fb543542663d698c3fd7719a62c94af978e9cd75f&w=740",
  "https://img.freepik.com/premium-photo/otzarreta-beech-forest-gorbea-natural-park-spain_138213-206.jpg?w=740"
]

function regionFormHandler(){
  document.getElementById('regionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const descriptions = document.getElementById('descriptions').value.split(';').map(description => description.trim());
    const images = document.getElementById('images').value.split(';').map(image => image.trim());
    console.log('Nome:', name);
    console.log('Descrições:', descriptions);
    console.log('Imagens:', images);
  });
}



const regionForm = ` <h2>Criar Nova Região</h2>
    <form id="regionForm">
      <label for="name">Nome da Região:</label>
      <input type="text" id="name" name="name" required>
      
      <label for="descriptions">Descrições (separadas por semi-colon):</label>
      <textarea id="descriptions" name="descriptions" rows="4"></textarea>
      
      <label for="images">Imagens (URLs separadas por semi-colon):</label>
      <textarea id="images" name="images" rows="4"></textarea>
      
      <button type="submit">Criar Região</button>
    </form>` 

const cordinatesForm =
  ` <h2>Criar Nova Área de Terreno</h2>
    <form id="terrainForm">
      <label for="name">Nome da Área:</label>
      <input type="text" id="name" name="name" required>
      
      <label for="startX">Início X:</label>
      <input type="number" id="startX" name="startX" value="-50" required>
      
      <label for="startY">Início Y:</label>
      <input type="number" id="startY" name="startY" value="-50" required>
      
      <label for="endX">Fim X:</label>
      <input type="number" id="endX" name="endX" value="50" required>
      
      <label for="endY">Fim Y:</label>
      <input type="number" id="endY" name="endY" value="50" required>
      
      <button type="submit">Criar Área de Terreno</button>
    </form>`



function getRegion(){
  fetch("/map/getByCordinates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      x: 0,
      y: 0
    })
  }).then(res => res.json())
    .then(data => {
      console.log(data);
    })
}