const prisma = require("./prismaClient");

const createUser = async (name, email, hashedPassword, classe) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        player: {
          create: {
            name: name,
            class: classe.class,
            hp: classe.hp,
            mp: classe.mp,
            strength: classe.strength,
            defense: classe.defense,
            dexterity: classe.dexterity,
            resistance: classe.resistence,
            intelligence: classe.intelligence,
            luck: classe.luck,
          },
        },
      },
    });
    console.log("User created in database:", newUser);
    return newUser;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

async function getUserByEmail(emailOrName) {
  console.log(emailOrName);
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ name: emailOrName }, { email: emailOrName }],
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createUser,
  getUserByEmail,
};
