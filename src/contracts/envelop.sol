// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RedEnvelope is Ownable {
    IERC20 public token; // Use an ERC-20 token for red envelope value
    uint256 public numberOfRedEnvelopes;

    struct RedEnvelopeData {
        uint256 amount;
        uint256 totalRecipients;
        bool isClaimed;
        mapping(address => uint256) claims;
    }

    mapping(bytes32 => RedEnvelopeData) public redEnvelopes;

    event RedEnvelopeCreated(bytes32 indexed envelopeId, uint256 amount, uint256 totalRecipients);
    event RedEnvelopeDistributed(bytes32 indexed envelopeId, address[] recipients);
    event RedEnvelopeRandomized(bytes32 indexed envelopeId);
    event RedEnvelopeClaimed(bytes32 indexed envelopeId, address recipient, uint256 amountClaimed);

    constructor(address _token) {
        token = IERC20(_token);
    }

    function createRedEnvelope(bytes32 envelopeId, uint256 amount, uint256 totalRecipients) public onlyOwner {
        require(redEnvelopes[envelopeId].amount == 0, "Red envelope already exists");

        RedEnvelopeData storage envelope = redEnvelopes[envelopeId];
        envelope.amount = amount;
        envelope.totalRecipients = totalRecipients;
        envelope.isClaimed = false;
        numberOfRedEnvelopes++;
        // require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed"); // Transfer tokens to the contract
        emit RedEnvelopeCreated(envelopeId, amount, totalRecipients);
    }

    // Get the number of red envelopes
    function getNumberOfRedEnvelopes() public view returns (uint256) {
        return numberOfRedEnvelopes;
    }

    // Get the envelope ID at a specific index
    function getEnvelopeIdAtIndex(uint256 index) public view returns (bytes32) {
        require(index < numberOfRedEnvelopes, "Index out of range");
        bytes32[] memory keys = new bytes32[](numberOfRedEnvelopes);
        uint256 i;
        for (i = 0; i < numberOfRedEnvelopes; i++) {
            keys[i] = keccak256(abi.encodePacked(i)); // Generate a unique key for each envelope
        }
        return keys[index];
    }

    // Get the envelope amount for a given envelope ID
    function getEnvelopeAmount(bytes32 envelopeId) public view returns (uint256) {
        return redEnvelopes[envelopeId].amount;
    }

    // Get the total recipients for a given envelope ID
    function getEnvelopeTotalRecipients(bytes32 envelopeId) public view returns (uint256) {
        return redEnvelopes[envelopeId].totalRecipients;
    }

    function distributeRedEnvelope(bytes32 envelopeId, address[] memory recipients) public onlyOwner {
        RedEnvelopeData storage envelope = redEnvelopes[envelopeId];
        require(envelope.amount > 0, "Red envelope does not exist");
        require(!envelope.isClaimed, "Red envelope has already been claimed");

        require(recipients.length <= envelope.totalRecipients, "Too many recipients");

        uint256 amountPerRecipient = envelope.amount / recipients.length;

        for (uint256 i = 0; i < recipients.length; i++) {
            envelope.claims[recipients[i]] = amountPerRecipient;
        }

        emit RedEnvelopeDistributed(envelopeId, recipients);
    }


    function randomizeDistribution(bytes32 envelopeId) public onlyOwner {
        RedEnvelopeData storage envelope = redEnvelopes[envelopeId];
        require(envelope.amount > 0, "Red envelope does not exist");
        require(!envelope.isClaimed, "Red envelope has already been claimed");

        // Implement fair and transparent randomization logic here, if needed



        emit RedEnvelopeRandomized(envelopeId);
    }

    function claimRedEnvelope(bytes32 envelopeId) public {
        RedEnvelopeData storage envelope = redEnvelopes[envelopeId];
        require(envelope.amount > 0, "Red envelope does not exist");
        require(!envelope.isClaimed, "Red envelope has already been claimed");
        require(envelope.claims[msg.sender] > 0, "You are not a recipient of this red envelope");

        uint256 amountToClaim = envelope.claims[msg.sender];
        envelope.claims[msg.sender] = 0; // Mark the recipient as claimed

        token.transfer(msg.sender, amountToClaim);
        emit RedEnvelopeClaimed(envelopeId, msg.sender, amountToClaim);
    }
}