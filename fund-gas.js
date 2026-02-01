const { ethers } = require("ethers");

function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

(async () => {
  const wallets = require("./lunaro-wallets.json");

  const p = new ethers.JsonRpcProvider(mustEnv("RPC_URL"));
  const deployer = new ethers.Wallet(mustEnv("PRIVATE_KEY"), p);

  // Adjust here if you want
  const MIN_ETH = ethers.parseEther("0.0003");
  const TOPUP_ETH = ethers.parseEther("0.001");

  const targets = [
    ["FOUNDERS", wallets.FOUNDERS.address],
    ["ECOSYSTEM", wallets.ECOSYSTEM.address],
    ["COMMUNITY", wallets.COMMUNITY.address],
    ["RESERVE", wallets.RESERVE.address],
    ["LIQUIDITY", wallets.LIQUIDITY.address],
  ];

  console.log("deployer:", deployer.address);
  console.log("MIN_ETH :", ethers.formatEther(MIN_ETH));
  console.log("TOPUP  :", ethers.formatEther(TOPUP_ETH));
  console.log("");

  for (const [name, addr] of targets) {
    const bal = await p.getBalance(addr);
    const needs = bal < MIN_ETH;

    console.log(name.padEnd(9), addr, "ETH:", ethers.formatEther(bal), needs ? "=> topup" : "OK");

    if (needs) {
      const tx = await deployer.sendTransaction({ to: addr, value: TOPUP_ETH });
      console.log("  tx:", tx.hash);
      const r = await tx.wait();
      console.log("  ✅ block:", r.blockNumber);

      const after = await p.getBalance(addr);
      console.log("  after ETH:", ethers.formatEther(after));
    }
  }
})().catch((e) => {
  console.error("❌ fund-gas.js failed");
  console.error(e.shortMessage || e.reason || e.message || String(e));
  process.exit(1);
});
