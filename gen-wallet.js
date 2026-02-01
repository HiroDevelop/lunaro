const { Wallet } = require("ethers");

const wallet = Wallet.createRandom();

console.log("ADDRESS:", wallet.address);
console.log("PRIVATE_KEY:", wallet.privateKey);
console.log("MNEMONIC:", wallet.mnemonic.phrase);
