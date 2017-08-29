pragma solidity 0.4.15;

contract SDaoAct
{
    struct Proposal 
    {
        uint256 id;
        address proposer;
        uint amount;
        string description;
        Comment[] comments;
        Vote[] votes;
        mapping (address => bool) voted;
    }
    
    struct Comment
    {
        string message;
        address commenter;
    }
    
    struct Vote 
    {
        bool inSupport;
        address voter;
    }
    
    Proposal[] public proposals;
    
    function DeleteProposal(uint proposalID)
    {
        delete proposals[proposalID];
    }
    
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
    
    function MakeComment(uint proposalID, string message)
    returns (uint256 commentID)
    {
        Proposal storage p = proposals[proposalID];
        
        commentID = p.comments.length++;
        p.comments[commentID] = Comment({message: message, commenter: msg.sender});
    }
    
    function MakeVote(uint proposalID, bool voteState)
    payable
    returns (uint256 voteID)
    {
       Proposal storage p = proposals[proposalID]; 
       
       voteID = p.votes.length++;
       p.votes[voteID] = Vote({inSupport: voteState, voter: msg.sender});
    }

    function TallyVotes(uint proposalID)
    returns(uint yea, uint nah)
    {
        Proposal storage p = proposals[proposalID]; 

        for (uint i = 0; i < p.votes.length; ++i) 
        {
            Vote storage v = p.votes[i];

            if (v.inSupport)
                yea++;
            else 
                nah++;
        } 
    }
}