const prisma = require("./prismaClient");

async function getByName(regionName) {
  try {
    const region = await prisma.region.findUnique({
      where: {
        name: regionName,
      },
      include: {
        EventPhrase: true,
      },
    });
    return region;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getByName,
};
