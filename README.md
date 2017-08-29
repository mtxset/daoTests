# daoTests
Testing gas and time resource consumption for simple dao platform

# Things to consider

Bools
-----
Bools are naturally set to false so it would be cheaper to use false for most expected outcome 

(remix - by 15064) (need confirmation) price of gas is 20 gWei so toEther(20 gWei) * 15064) * 354 (ether price) = 0.111985776 dollars cheaper to use false

![Alt text](/img/chart.png?raw=true)
Showing relation between votes with true and gas used.

String
------

String message length should be hardcoded to as small as possible length; pricePerChar = 64 (excluding everything else)

Tally votes
-----------

Price of function which counts votes depending against voter count

![Alt text](/img/graph01.png?raw=true)
Showing relation between votes and fee for vote check

Calculating votes could be done outside contract/wallet but in order to to stay to prove validity let everyone do that.

When checking proposals, votes, comments cheapest way is to use database which replicates blockchain, to make sure they their sync is valid merkle tree should be build for votes.

Proposals (need more tests)
---------
 
There should be only one proposal running on contract and deleted after execution. If one is not enough another should be created
thus allowing updates and fixes.


