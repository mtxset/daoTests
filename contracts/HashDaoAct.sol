pragma solidity 0.4.15;

contract HashDaoAct
{
    struct Proposal 
    {
        uint256 id;
        address proposer;
        uint amount;
        string description;
        Vote[] votes;
        mapping (address => bool) voted;
    }
    
    struct Vote 
    {
        bytes32 previousHash;
        bytes32 voteHash;
        bool inSupport;
        address voter;
    }
    
    Proposal[] public proposals;
    
    function FillProposal
    (
        uint amount,
        string jobDescription
    )
    returns (uint proposalID)
    {
        proposalID = proposals.length++;
        Proposal storage p = proposals[proposalID];
        p.id = proposalID;
        p.proposer = msg.sender;
        p.amount = amount;
        p.description = jobDescription;
    }
        
    function MakeVote(uint proposalID, bool voteState)
    payable
    returns (bytes32)
    {
        
        Proposal storage p = proposals[proposalID]; 
        uint voteID = p.votes.length;
        bytes32 previousHash;
        bytes32 voteHash;
       
        if (voteID == 0)
            previousHash = sha3(uint256(0));
        else 
            previousHash = p.votes[voteID-1].voteHash;

        uint256 voteS = voteState ? 1 : 0;
        //voteHash = sha3(uint256(previousHash), uint256(proposalID), voteS);
        voteHash = sha3( uint256(previousHash));
        //voteHash = sha3(sha3(uint256(0)), uint256(0), voteS);

        voteID = p.votes.length++;
        p.votes[voteID] = Vote
        ({
            previousHash: previousHash,
            voteHash: voteHash,
            inSupport: voteState, 
            voter: msg.sender
        });
        
        return voteHash;
    }
}





