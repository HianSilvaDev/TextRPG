class Player extends PlayerModel {
  constructor(){

  }

  setPlayer(id)
  {
    this.getPlayer(id) 
  }
  
  getStatus()
  {
    const player = this.data

    return player.status
  }

  getSkills()
  {
    
  }


  getGold()
  {
    
  }
}

export default Player;