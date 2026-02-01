// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LunaroToken
 * @author Hiroyuki Kitagawa
 *
 * Tokenomics:
 * - Total supply: 1,000,000,000 LUNARO
 * - Minted once, distributed once
 */
contract LunaroToken is ERC20, ERC20Burnable, Pausable, Ownable {

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;
    bool public distributed;

    constructor() ERC20("Lunaro Token", "LUNARO") {
        // Ownable() has NO constructor args in OZ 4.9.6
    }

    /**
     * @notice One-time initial distribution
     * @dev Can only be called once by owner
     */
    function initialDistribute(
        address founders,
        address ecosystem,
        address community,
        address reserve,
        address liquidity
    ) external onlyOwner {
        require(!distributed, "Already distributed");

        distributed = true;

        _mint(founders, 200_000_000 * 10 ** 18);   // 20%
        _mint(ecosystem, 300_000_000 * 10 ** 18);  // 30%
        _mint(community, 300_000_000 * 10 ** 18);  // 30%
        _mint(reserve, 150_000_000 * 10 ** 18);    // 15%
        _mint(liquidity, 50_000_000 * 10 ** 18);   // 5%

        require(totalSupply() == MAX_SUPPLY, "Supply mismatch");
    }

    /**
     * @notice Pause all token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Hook required by Pausable
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
