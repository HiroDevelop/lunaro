const fs = require("fs");
const { ethers } = require("ethers");

function loadArtifact() {
  const abi = JSON.parse(fs.readFileSync("./build/contracts_LunaroToken_sol_LunaroToken.abi", "utf8"));
  const bin = fs.readFileSync("./build/contracts_LunaroToken_sol_LunaroToken.bin", "utf8").trim();
  if (!bin || bin.length < 10) throw new Error("Bytecode is empty. Re-run ./compile.sh");
  return { abi, bytecode: "0x" + bin };
}

async function main() {
  const RPC_URL = process.env.RPC_URL;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!RPC_URL) throw new Error("Missing RPC_URL in .env");
  if (!PRIVATE_KEY) throw new Error("Missing PRIVATE_KEY in .env");

  const { abi, bytecode } = loadArtifact();

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deployer:", wallet.address);
  console.log("Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "ETH");

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();

  const tx = contract.deploymentTransaction();
  console.log("Deploy tx:", tx.hash);

  await contract.waitForDeployment();
  const addr = await contract.getAddress();
  console.log("✅ Deployed at:", addr);

  fs.writeFileSync("./deployed.json", JSON.stringify({
    network: "sepolia",
    address: addr,
    deployer: wallet.address,
    txHash: tx.hash,
    deployedAt: new Date().toISOString()
  }, null, 2));

  console.log("Saved: deployed.json");
}

main().catch((e) => { console.error(e); process.exit(1); });
