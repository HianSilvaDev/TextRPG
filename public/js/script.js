
createElement('header',(element) =>{
  element.innerHTML +=`
    <p class="title">Sombras da <br/> Eternidade</p>
    
    <div class="user">
      <button id="dropbtn"><img src="public/assets/img/arrowLeft.png"></button>
      
      <nav id="content" class="hiddenComponet">
        <ul>
          <li><a href="#" id="config">Configurações</a></li>
          <li>|</li>
          <li><a href="#" id="logout">Sair</a></li>
        </ul>
      </nav>
      
    </div>
  `})

// menu
const drop = document.getElementById('dropbtn')

drop.addEventListener('click', () => {
  const content = document.getElementById('content')
  content.classList.toggle('hiddenComponet')
  content.classList.toggle('show')
})

const btnLogout = document.getElementById('logout');

btnLogout.addEventListener('click', () => {
  fetch('user/logout')
    .then(res => res.json())
    .then((data) => {
      if(data.redirect){
        window.location.href = data.redirect
      }else if(data.error){
        console.log(data.error)
      }
    })
})

function createElement(element, callback)
{
  const newElement = document.createElement(element)
  document.body.insertAdjacentElement('afterbegin',newElement)
  
  callback(newElement)

  return newElement
  
}