import {swordsman, archer, mage, barbarian} from './objects/classes.js';

fetch("/user", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: 'Junin',
    email: 'junin@gameplays.com',
    password: '123456',
    classe: mage,
  })
}).then(res => res.json())
  .then((data) => {
    if(data.error){
      console.log(data.error)
      createAlert(data.error)
    }
    console.log('ok')
  })

// Controle dos Formulários
const loginForm = document.getElementById('loginForm');
const cadForm = document.getElementById('cadForm');
const initDiv = document.getElementById('init');
const closebtn = document.getElementById('closeForm');

function dropForm(a){
  if(a === "login"){
    initDiv.style.display = "none";
    cadForm.style.display = "none";
    loginForm.style.display = "block";
    closebtn.style.display = "block";
  }
  if(a === "cadastro"){
    initDiv.style.display = "none";
    loginForm.style.display = "none";
    cadForm.style.display = "flex";
    closebtn.style.display = "block";
  }
}

window.dropForm = dropForm

closebtn.addEventListener("click", () => {
  cadForm.style.display = "none";
  loginForm.style.display = "none";
  closebtn.style.display = "none";
  initDiv.style.display = "block";
})

// Escolha de classes
const cards = document.querySelectorAll('.card');
let job;
let currentJob;

cards.forEach(card => card.addEventListener(
  'click', () => {
    highlightCard(card)
    job = card.getAttribute('data-value');
    setJob(job)
  }
))



// Validação e Envio de Formularios
const btnLogin = document.getElementById('loginSubmit')
const btnRegister = document.getElementById('btnRegister')


if(btnLogin)
{
  btnLogin.addEventListener('click', () => {
    const nome = document.getElementById('login_nome')
    const senha = document.getElementById('login_senha')

    if(nome.value === '' || senha.value === '')
    {
      createAlert('Preencha todos os campos')
      return
    }

    if (nome.value.length < 3) {
      createAlert('Nome deve ter no mínimo 3 caracteres')
      nome.focus()
      return
    }

    if (senha.value.length < 6) {
      createAlert('Senha deve ter no mínimo 6 caracteres')
      senha.focus()
      return
    }

    let user = {
      name: nome.value,
      password: senha.value
    }
    const body = JSON.stringify(user)
    fetch('user/login',{
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: body
    }).then((res) => res.json())
      .then((data) => {
        if(data.error){
          console.log(data.error)
          createAlert(data.error)
        }
        if(data.redirect){
          window.location.href = data.redirect
        }
      })
  })
}

if(btnRegister)
{
  
  btnRegister.addEventListener('click', () => {
    const nome = document.getElementById('cad_nome')
    const senha = document.getElementById('cad_senha')
    const email = document.getElementById('cad_email')

    if(nome.value === '' || senha.value === '' || email.value === '')
    {
      createAlert('Preencha todos os campos')
      return
    }

    if(!currentJob){
      createAlert('Selecione uma classe')
      console.log(currentJob)
      return
    }

    if (nome.value.length < 3) {
      createAlert('Nome deve ter no mínimo 3 caracteres')
      nome.focus()
      return
    }

    if (senha.value.length < 6) {
      createAlert('Senha deve ter no mínimo 6 caracteres')
      senha.focus()
      return
    }
    if(email.value.length < 3 || !email.value.includes("@") || !email.value.includes('.com')) {
      createAlert("Insira um email válido!")
      email.focus()
      return
    }

    let user = {
      name: nome.value,
      password: senha.value,
      email: email.value, 
    }
    
    const body = JSON.stringify(user)
    fetch('/user',{
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: body
    }).then((res) => res.json())
      .then((data) => {
        if(data.error){
          createAlert(data.error)
        }else{
          createPlayer(user);
        }
      })
  })
}

function createAlert(msg)
{
  const alert = document.createElement('span')
  alert.className = 'alert'
  alert.innerHTML = msg
  document.body.appendChild(alert)

  setTimeout(() => {
    alert.remove()
  }, 3000)
}

function setJob(job){
  switch(job){
    case "swordsman":
      currentJob = swordsman
      break
    case "archer":
      currentJob = archer
      break
    case "mage":
      currentJob = mage
      break
    case "barbarian":
      currentJob = barbarian
      break
    default:
      currentJob = null
      break
  }
}

function highlightCard(selectedCard) {
  cards.forEach(card => card.classList.remove('chosen'));
  selectedCard.classList.add('chosen');
}


function createPlayer(user){
  fetch("/player/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      classe: currentJob,
      name: user.nome
    })
  }).then(res => res.json())
    .then((data) => {
      if(data.error){
        console.log(data.error)
        createAlert(data.error)
      }
      if(data.message){
        window.location = "/home"
      }
    })
}
