const fs = require("fs");
const { ethers } = require("ethers");

async function main() {
  const RPC_URL = process.env.RPC_URL;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const TOKEN = process.env.TOKEN;

  if (!RPC_URL) throw new Error("Set RPC_URL");
  if (!PRIVATE_KEY) throw new Error("Set PRIVATE_KEY");
  if (!TOKEN) throw new Error("Set TOKEN=deployed_contract_address");

  // set these env vars too
  const FOUNDERS = process.env.FOUNDERS;
  const ECOSYSTEM = process.env.ECOSYSTEM;
  const COMMUNITY = process.env.COMMUNITY;
  const RESERVE = process.env.RESERVE;
  const LIQUIDITY = process.env.LIQUIDITY;

  for (const [k, v] of Object.entries({ FOUNDERS, ECOSYSTEM, COMMUNITY, RESERVE, LIQUIDITY })) {
    if (!v) throw new Error("Missing env: " + k);
  }

  const abi = JSON.parse(
    fs.readFileSync("./build/contracts_LunaroToken_sol_LunaroToken.abi", "utf8")
  );

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const token = new ethers.Contract(TOKEN, abi, wallet);

  console.log("Caller:", wallet.address);
  console.log("Token:", TOKEN);

  const tx = await token.initialDistribute(FOUNDERS, ECOSYSTEM, COMMUNITY, RESERVE, LIQUIDITY);
  console.log("Tx:", tx.hash);
  await tx.wait();
  console.log("✅ Distribution complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
