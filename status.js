const { ethers } = require("ethers");
const fs = require("fs");

function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

(async () => {
  const abi = JSON.parse(
    fs.readFileSync("./build/contracts_LunaroToken_sol_LunaroToken.abi", "utf8")
  );
  const wallets = require("./lunaro-wallets.json");

  const rpc = mustEnv("RPC_URL");
  const contractAddr = mustEnv("LUNARO_CONTRACT");
  const deployerPk = mustEnv("PRIVATE_KEY");

  const p = new ethers.JsonRpcProvider(rpc);
  const c = new ethers.Contract(contractAddr, abi, p);

  const net = await p.getNetwork();
  const dec = await c.decimals();

  console.log("network :", net.name, "chainId", net.chainId.toString());
  console.log("contract:", contractAddr);
  console.log("owner   :", await c.owner());
  console.log("paused  :", await c.paused());
  console.log("name    :", await c.name());
  console.log("symbol  :", await c.symbol());

  const ts = await c.totalSupply();
  console.log("supply  :", ethers.formatUnits(ts, dec));

  // addresses to display
  const entries = [
    ["DEPLOYER", new ethers.Wallet(deployerPk).address],
    ["FOUNDERS", wallets.FOUNDERS.address],
    ["ECOSYSTEM", wallets.ECOSYSTEM.address],
    ["COMMUNITY", wallets.COMMUNITY.address],
    ["RESERVE", wallets.RESERVE.address],
    ["LIQUIDITY", wallets.LIQUIDITY.address],
  ];

  console.log("\nBalances:");
  for (const [label, addr] of entries) {
    const eth = await p.getBalance(addr);
    const lun = await c.balanceOf(addr);
    console.log(
      label.padEnd(9),
      addr,
      "| ETH", ethers.formatEther(eth),
      "| LUNARO", ethers.formatUnits(lun, dec)
    );
  }
})().catch((e) => {
  console.error("❌ status.js failed");
  console.error(e.shortMessage || e.reason || e.message || String(e));
  process.exit(1);
});
