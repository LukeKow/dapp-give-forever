const hre = require("hardhat");

async function main() {
  const GiveForever = await hre.ethers.getContractFactory("GiveForever");
  const giveForever = await GiveForever.deploy();

  await giveForever.deployed();

  console.log("GiveForever deployed to:", giveForever.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });