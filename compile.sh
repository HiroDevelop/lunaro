#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

mkdir -p build

npx solcjs --bin --abi \
  --base-path . \
  --include-path node_modules \
  -o build \
  contracts/LunaroToken.sol

echo "✅ Compiled:"
ls -1 build | grep 'contracts_LunaroToken_sol_LunaroToken\.\(abi\|bin\)$' || true
