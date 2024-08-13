const { create } = require("domain");
const prisma = require("./prismaClient.js");

async function update(player) {
  try {
    await prisma.player.update({
      where: {
        userId: player.userId,
      },
      data: formatPlayerToBack(player),
    });
  } catch (err) {
    console.log(err);
  }
}

async function getbyId(id) {
  try {
    let player = await prisma.player.findUnique({
      where: {
        userId: id,
      },
      include: {
        inventory: {
          include: {
            item: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
    return formatPlayerToFront(player);
  } catch (err) {
    console.log(err);
  }
}

async function skillsActions(actionsArray) {
  const selectedActions = selectTypes(actionsArray);

  try {
    await skillsHandler(selectedActions);
    console.log("Ações concluídas com sucesso.");
  } catch (error) {
    console.error("Erro ao manipular as skills:", error);
  }
}

async function itensActions(actionsArray) {
  const selectedActions = selectTypesForItens(actionsArray);

  try {
    await itensHandler(selectedActions);
    console.log("Ações concluídas com sucesso.");
  } catch (error) {
    console.error("Erro ao manipular os itens:", error);
  }
}

// Funções Secundarias
// Tratamento de Skills:
function selectTypes(array) {
  let dell = [];
  let createA = [];
  let update = [];
  array.forEach((a) => {
    switch (a.action) {
      case "DELETE":
        dell.push(a);
        break;
      case "CREATE":
        createA.push(a);
        break;
      case "UPDATE":
        update.push(a);
        break;
      default:
        throw new Error(`A ação a.action é inválida, portanto será ignorada.`);
        break;
    }
    return {
      dell,
      createA,
      update,
    };
  });
}

async function skillsHandler(arrays) {
  const deletePromises = arrays.dell.map((s) =>
    prisma.playerSkill
      .delete({
        where: {
          skillId: s.skillId,
          playerId: s.playerId,
        },
      })
      .catch((error) => ({ error, action: s }))
  );

  const createPromise = prisma.playerSkill
    .createMany({
      data: arrays.createA,
    })
    .catch((error) => ({ error, action: arrays.createA }));

  const updatePromises = arrays.update.map((s) =>
    prisma.playerSkill
      .update({
        where: {
          skillId: s.skillId,
          playerId: s.playerId,
        },
        data: s,
      })
      .catch((error) => ({ error, action: s }))
  );

  const results = await Promise.allSettled([
    ...deletePromises,
    createPromise,
    ...updatePromises,
  ]);

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(
        "Falha na operação:",
        result.reason.action,
        result.reason.error
      );
    }
  });
}

// Tratamento de Itens:
// Recebe um array com todas as ações realizadas no front e retorna um objeto contendo um array para cada uma das tres operações: (CREATE, DELETE E UPDATE)
function selectTypesForItens(array) {
  let dell = [];
  let createA = [];
  let update = [];
  array.forEach((a) => {
    switch (a.action) {
      case "DELETE":
        dell.push(a);
        break;
      case "CREATE":
        createA.push(a);
        break;
      case "UPDATE":
        update.push(a);
        break;
      default:
        throw new Error(`A ação a.action é inválida, portanto será ignorada.`);
        break;
    }
    return {
      dell,
      createA,
      update,
    };
  });
}

// Recebe o objeto retornado pela função "selectTypesForItens" e execulta cada uma das respectivas ações
// Usa Promise.allSettled para que cada ação seja execultada mesmo que alguma falhe
// Verica os resultados e em caso de erro, exibe-o no console
async function itensHandler(arrays) {
  const deletePromise = arrays.dell.map((s) => {
    prisma.playerItens
      .delete({
        where: {
          playerId: s.playerId,
          itemId: itemId,
        },
      })
      .catch((error) => ({ error, action: s }));
  });

  const createPromise = prisma.playerItens
    .createMany({
      data: arrays.createA,
    })
    .catch((error) => ({ error, action: arrays.createA }));

  const updatePromises = arrays.update.map((s) => {
    prisma.playerItens
      .update({
        where: {
          playerId: s.playerId,
          itemId: s.itemId,
        },
        data: s,
      })
      .catch((error) => ({ error, action: s }));
  });

  const results = await Promise.allSettled(
    ...createPromise,
    ...deletePromise,
    ...updatePromises
  );

  results.forEach((result) => {
    if (result.status == "rejected") {
      console.error(
        "Falha na operação:",
        result.reason.action,
        result.reason.error
      );
    }
  });
}

// formata o usuario reorganizando sua estrutura para melhor utilização no front.
function formatPlayerToFront(player) {
  let inventory = player.inventory.map((i) => {
    return {
      ...i.item,
      isEquiped: i.equiped,
      qtd: i.qtd,
      itemId: i.itemId,
    };
  });

  let skills = player.skills.map((s) => {
    return {
      ...s.skill,
      isEquiped: s.equiped,
      skillId: s.skillId,
    };
  });
  return {
    ...player,
    skills,
    inventory,
  };
}
// Formata o usuario, eliminando campos para a função update.
function formatPlayerToBack(player) {
  let newPlayer = player;
  delete newPlayer.inventory;
  delete newPlayer.skills;
  delete newPlayer.userId;
  delete newPlayer.name;
  delete newPlayer.class;
  return newPlayer;
}

module.exports = {
  getbyId,
  update,
  skillsActions,
  itensActions,
};
