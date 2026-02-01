const fs = require("fs");
const { ethers } = require("ethers");

async function main() {
  if (!fs.existsSync("deployed.json")) {
    throw new Error("deployed.json not found. Deploy first: node deploy.js");
  }

  const deployed = JSON.parse(fs.readFileSync("deployed.json", "utf8"));
  const addr = deployed.address;
  if (!addr) throw new Error("deployed.json missing .address");

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const code = await provider.getCode(addr);

  console.log("CONTRACT:", addr);
  console.log("CODE SIZE:", (code.length - 2) / 2, "bytes");
  console.log(code !== "0x" ? "✅ Deployed contract exists" : "❌ No code at address");
}

main().catch((e) => {
  console.error("VERIFY FAIL:", e.message || e);
  process.exit(1);
});
