import {swordsman, archer, mage, barbarian} from './objects/classes.js';

window.dropForm = dropForm

// Controle dos Formulários
const initDiv = document.getElementById('init');
const loginForm = document.getElementById('loginForm');
const cadForm = document.getElementById('registerForm');
const closebtn = document.getElementById('closeBtn');

function dropForm(a){
  switch (a) {
    case 'login':
      initDiv.style.display = "none";
      cadForm.style.display = "none";
      loginForm.style.display = "flex";
      closebtn.style.display = "block";
      break;
    
    case 'cadastro':
      initDiv.style.display = "none";
      loginForm.style.display = "none";
      cadForm.style.display = "grid";
      closebtn.style.display = "block";
      break;
  
    default:
      initDiv.style.display = "flex";
      loginForm.style.display = "none";
      cadForm.style.display = "none";
      closebtn.style.display = "none";
      break;
  }
}

closebtn.addEventListener("click", () => {
  cadForm.style.display = "none";
  loginForm.style.display = "none";
  closebtn.style.display = "none";
  initDiv.style.display = "flex";
})

// Escolha de classes
const cards = document.querySelectorAll('.card');
let job;
let currentJob;

cards.forEach(card => card.addEventListener('click', () => {
    highlightCard(card)
    job = card.getAttribute('data-value');
    setJob(job)
  }
))

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

// validando formularios
const btnLogin = document.getElementById('loginSubmit')
const btnRegister = document.getElementById('registerSubmit')

if(btnLogin)
{
  btnLogin.addEventListener('click', () => {
    const name      = document.getElementById('userLogin')
    const password  = document.getElementById('passwordLogin')

    if(name.value === '' || password.value === '')
    {
      createAlert('Preencha todos os campos')
      return
    }

    let user = {
      name: name.value,
      password: password.value
    }

    const body = JSON.stringify(user)
    fetch('user/login',{
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: body
    }).then((res) => res.json())
      .then((data) => {
        if(data.error){
          createAlert(data.error)
          return
        }
        // if(data.redirect){
          window.location.href = '/home'
        // }
      })
  })
}

if(btnRegister)
{
  
  btnRegister.addEventListener('click', () => {
    console.log('ok')

    const name = document.getElementById('userNameRegister')
    const email = document.getElementById('emailRegister')
    const password = document.getElementById('passwordRegister')
    const passwordAgain = document.getElementById('passwordAgain')

    if(name.value === '' || password.value === '' || passwordAgain.value === '' ||email.value === '')
    {
      createAlert('Preencha todos os campos')
      return
    }

    if(!currentJob){
      createAlert('Selecione uma classe')
      console.log(currentJob)
      return
    }

    if (name.value.length < 3) 
    {
      createAlert('Nome deve ter no mínimo 3 caracteres')
      name.focus()
      return
    }

    if (password.value.length < 6) 
    {
      createAlert('Senha deve ter no mínimo 6 caracteres')
      password.focus()
      return
    }

    if(passwordAgain.value !== password.value)
    {
      createAlert('As senhas devem ser iguais!')
      passwordAgain.focus
      return
    }

    if(email.value.length < 6 || !email.value.includes("@")) 
    {
      createAlert("Insira um email válido!")
      email.focus()
      return
    }

    const emailExplode = (text)=>{
      const explode = text.split('@')

      if(explode[1].length < 2)
      {
        createAlert("Insira um email válido!")
        email.focus()
        return
      }
    }

    emailExplode(email.value)
    

    let user = {
      name: name.value,
      password: password.value,
      email: email.value, 
      class: currentJob
    }
    
    // const body = JSON.stringify(user)
    // fetch('/user/create',{
    //   method: 'POST',
    //   headers: {'content-type': 'application/json'},
    //   body: JSON.stringify({
    //     name: user.name,
    //     password: user.password,
    //     email: user.email,
    //     class: user.class
    //   })
    // }).then((res) => res.json())
    //   .then((data) => {
    //     if(data.error){
    //       createAlert(data.error)
    //     }else{
          
    //     }
    //   })
  })
}

function createAlert(msg)
{
  const alert = document.createElement('span')
  alert.className = 'alert'
  alert.innerText = msg
  document.body.insertAdjacentElement('afterbegin',alert)

  setTimeout(() => {
    alert.remove()
  }, 3000)
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