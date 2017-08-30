const SDaoAct = artifacts.require("SDaoAct")
import { expectThrow } from "./helpers/index"
import { expect } from "chai"

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

contract("SDaoAct", (accounts)=> 
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
            dao = await SDaoAct.new({from: king});

            let rs = RandomString(); 
            await dao.FillProposal(10, rs);

            let p = await dao.proposals(0);

            expect(p[3]).to.equal(rs);
        })
    })

    describe("Estimate gas consumption for local vote", async()=>
    {
        
        it("voters = X", async()=>
        {
            let X = 10;
            dao = await SDaoAct.new({from: king});

            let rs = RandomString(); 
            await dao.FillProposal(10, rs);

            // let's vote
            let amountOfVoters = X;
            let votePrice = web3.toWei(0.01, "ether");
            let voterSum = 0;

            for (let m = 0; m < amountOfVoters; m++)
            {
                for (let i = 0; i < m; i++)
                {
                    await dao.MakeVote(0, Math.random() >= 0.5, {from:king, value:votePrice});
                }
                voterSum += m;
                let voteGas = await dao.TallyVotes.estimateGas(0);
                let priceInDollah = 0.000000021 * voteGas * 360; 
                console.log(`${voterSum} ${priceInDollah}`);
            }
            console.log(`Amount of voters: ${voterSum}`);
        })

        it("voters = X, delete", async()=>
        {
            let X = 10;
            dao = await SDaoAct.new({from: king});

            let rs = RandomString(); 
            await dao.FillProposal(10, rs);

            let amountOfVoters = X;
            let votePrice = web3.toWei(0.01, "ether");
            let voterSum = 0;

            for (let m = 0; m < amountOfVoters; m++)
            {
                for (let i = 0; i < m; i++)
                {
                    await dao.MakeVote(0, Math.random() >= 0.5, {from:king, value:votePrice});
                }
                voterSum += m;
                let voteGas = await dao.TallyVotes.estimateGas(0);
                let deleteGas = await dao.DeleteProposal.estimateGas(0); 
                await dao.DeletePropsal(0);

                let priceInDollah = 0.000000021 * (voteGas + deleteGas) * 360; 
                console.log(`${m} ${priceInDollah}`);
            }
            console.log(`Amount of voters: ${voterSum}`);
        })

        it("proposals > 0, voters, delete proposal after each tally vote", async()=>
        {
            let X = 10;
            let proposals = 40;
            dao = await SDaoAct.new({from: king});

            let rs = RandomString(255); 

            let amountOfVoters = X;
            let votePrice = web3.toWei(0.01, "ether");

            for (let p = 0; p < proposals; p++)
            { 
                await dao.FillProposal(10, rs);
                for (let m = 0; m < amountOfVoters; m++)
                {
                    for (let i = 0; i < m; i++)
                    {
                        await dao.MakeVote(0, Math.random() >= 0.5, {from:king, value:votePrice});
                    }
                }

                let voteGas = await dao.TallyVotes.estimateGas(0);
                let ret = await dao.TallyVotes.call(0);
                

                let deleteGas = await dao.DeleteProposal.estimateGas(0); 
                await dao.DeleteProposal(0);

                let priceInDollah = 0.000000021 * (voteGas + deleteGas) * 360; 
                console.log(`${ret[0]} ${priceInDollah}`);
            }
        })
    })
})