const HashDaoAct = artifacts.require("HashDaoAct")
import { expectThrow } from "./helpers/index"
import { expect } from "chai"
import { keccak, sha3num,  sha3withsize } from './helpers/keccak'

let dao = null;
let max = 255; // max string length of all messages
var king; // will use this as owner
var queen;
var jack;
var ace;
var joker;
var magpie;
var gasArray = [];

// Helper functions
function ReturnEventAndArgs(returnVal)
{
    return { eventName: returnVal.logs[0].event, 
             eventArgs: returnVal.logs[0].args.action,
             raw: returnVal }
}

function RandomString(len = null) 
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var r = 0;
    if (len == null)
        r = Math.random() * max;
    else
        r = len;

    for (var i = 0; i < r; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

describe.skip("Helper function tests", async()=>
{
    it("Should create random string", async()=>
    {
        console.log(RandomString());
    })

    it("Should create random string of length 5", async()=>
    {
        console.log(RandomString(5));
    })

    it("Should generate random bool", async()=>
    {
        for (let i = 0; i < 10; i++)
        {
            console.log(Math.random() >= 0.5);
        }
    })
})

describe.skip("Get ABI of function (not)", async()=>
{
    it("Encode", async()=>
    {
        let encoded = (web3.sha3("FillProposal(uint,string)", {encoding: 'hex'})).slice(0, 10);
        console.log(encoded);
    })
})
// -- Helper functions

contract("HashDaoAct", (accounts)=> 
{
    before(async()=>
    {
        king = accounts[0];
        queen = accounts[1];
        jack = accounts[2];
        ace = accounts[3];
        joker = accounts[4];
        magpie = accounts[5];
    })

    describe("Creating proposal", async()=>
    {
        it("Should create proposal", async()=>
        {
            dao = await HashDaoAct.new({from: king});

            let rs = RandomString(); 
            await dao.FillProposal(10, rs);

            let p = await dao.proposals(0);

            expect(p[3]).to.equal(rs);
        })
    })

    describe("Testing hashing", async()=>
    {
        it("Hashes should match", async()=>
        {
            dao = await HashDaoAct.new({from: king});

            let rs = RandomString(255); 
            await dao.FillProposal(10, rs);

            let votePrice = web3.toWei(0.01, "ether");
            
            let voteHash = await dao.MakeVote.call(0, true, {from:king, value:votePrice});
            await dao.MakeVote(0, true, {from:king, value:votePrice});

            let localVoteHash = keccak(keccak(0), 0, 1);
                
            expect(voteHash,
                "Hashes are not equal vote #1")
                .to.equal(localVoteHash);
                
            voteHash = await dao.MakeVote.call(0, false, {from:king, value:votePrice});
            await dao.MakeVote(0, false, {from:king, value:votePrice});
            
            localVoteHash = keccak(voteHash, 0, 0);
                
            expect(voteHash,
                "Hashes are not equal vote #2")
                .to.equal(localVoteHash);

            voteHash = await dao.MakeVote.call(0, false, {from:king, value:votePrice});
            
            localVoteHash = keccak(keccak(0), 0, 0);
                
            expect(voteHash,
                "Hashes are not equal vote #3")
                .to.equal(localVoteHash);
                
        })

        it.only("Hashes should match", async()=>
        {
            
            let hash = "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563";
            let keccakHash = keccak(0);

            dao = await HashDaoAct.new({from: king});
            
            let rs = RandomString(255); 
            await dao.FillProposal(10, rs);

            let votePrice = web3.toWei(0.01, "ether");
            
            let voteHash = await dao.MakeVote.call(0, true, {from:king, value:votePrice});
            await dao.MakeVote(0, true, {from:king, value:votePrice});
            let localVoteHash = keccak(keccak(0));

            expect(voteHash,
                "Hashes are not equal vote #1")
                .to.equal(localVoteHash);

            localVoteHash = keccak(hash);
               
            expect(voteHash,
                "Hashes are not equal vote #2")
                .to.equal(localVoteHash);

            voteHash = await dao.MakeVote.call(0, true, {from:king, value:votePrice});
            localVoteHash = keccak(localVoteHash);

            expect(voteHash,
                "Hashes are not equal vote #3")
                .to.equal(localVoteHash);

        })

    })
})