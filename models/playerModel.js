const prisma = require("./prismaClient.js");

async function getbyId(id){
  try{
    let player = await prisma.player.findUnique({
      where: {
        userId: id
      }
      return player
    })
  }catch(err){
    console.log(err);
  }
}
module.exports = {
  getbyId
}
