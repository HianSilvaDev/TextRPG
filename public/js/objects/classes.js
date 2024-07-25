export const swordsman = {
  class: "Espadachim",
  hp: 100,
  mp: 80,
  strength: 10,
  defense: 10,
  dexterity: 10,
  resistence: 10,
  intelligence: 10,
  luck: 1,
  skills: [
    {
      type: "fisico",
      name: "corte pesado",
      describe: "um ataque de espada fortacido",
      power: 10,
      manaCost: 0,
      cooldown: 0,
      duration: 0,
      effectType: "damage"
    }
  ],
  inventory: [
    {
      type: "armor",
      name: "espada de madeira",
      damage: "10",
      quant: 1
    },
    {
      type: "consumivel",
      name: "poção de vida",
      quant: 2
    },
    {
      type: "consumivel",
      name: "poção de mana",
      quant: 2
    }
  ]
}

export const archer = {
  class: "Arqueiro",
  hp: 100,
  mp: 80,
  strength: 10,
  defense: 10,
  dexterity: 10,
  resistence: 10,
  intelligence: 10,
  luck: 1,
  skills: [
    {
      type: "fisico",
      name: "disparo de flecha",
      describe: "um ataque de flecha forte",
      power: 10,
      manaCost: 0,
      cooldown: 0,
      duration: 0,
      effectType: "damage"
    }
  ],
  inventory: [
    {
      type: "armor",
      name: "arco velho",
      damage: "10",
      quant: 1
    },
    {
      type: "consumivel",
      name: "poção de vida",
      quant: 2
    },
    {
      type: "consumivel",
      name: "poção de mana",
      quant: 2
    }
  ]
}

export const mage = {
  class: "Mago",
  hp: 100,
  mp: 80,
  strength: 10,
  defense: 10,
  dexterity: 10,
  resistence: 10,
  intelligence: 10,
  luck: 1,
  skills: [
    {
      type: "magico",               
      name: "Fireball",       
      description: "Arremessa uma bola de fogo que causa dano em um unico inimigo",
      power: 50,                 
      manaCost: 20,          
      cooldown: 5,
      duration: 0,      
      effectType: "damage"
    }
  ],
  inventory: [
        {
      type: "armor",
      name: "cajado velho",
      damage: "10",
      quant: 1
    },
    {
      type: "consumivel",
      name: "poção de vida",
      quant: 2
    },
    {
      type: "consumivel",
      name: "poção de mana",
      quant: 2
    }
  ]
}

export const barbarian = {
  class: "Barbáro",
  hp: 100,
  mp: 80,
  strength: 10,
  defense: 10,
  dexterity: 10,
  resistence: 10,
  intelligence: 10,
  luck: 1,
  skils: [
    {
      type: "fisico",
      name: "machadada leve",
      describe: "um ataque de machado fortacido",
      power: 10,
      manaCost: 0,
      cooldown: 0,
      duration: 0,
      effectType: "damage"
    }
  ],
  inventory: [
    {
      type: "arma",
      name: "machado de madeira",
      damage: "10",
      quant: 1
    },
    {
      type: "consumivel",
      name: "poção de vida",
      quant: 2
    },
    {
      type: "consumivel",
      name: "poção de mana",
      quant: 2
    }
  ]
}