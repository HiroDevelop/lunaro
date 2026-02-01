const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const bal = await provider.getBalance(wallet.address);
  console.log("ADDRESS:", wallet.address);
  console.log("BALANCE:", ethers.formatEther(bal), "ETH");
}
main().catch(console.error);
