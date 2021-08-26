# Decentralized_Thrift_System

# The idea

Traditionally, there's this corperative/Thrift practice,  where say 5 persons come together and contriubute funds for one person per week/month or as they
 wish and the rounds conitnues till all 5 persons has recieved the contributions.

There are 2 main issues with this system

1.  The money contributed is usually kept with someone till its complete for claim by the person who is next- now this current holder can choose to run away 
with the funds or have it spent-(a centralized holder)

2.  for instance, the person who collects the first round of contribution(or any round) can decide to mischieviously not contribute again or perhaps due to circumstances


So here's why I wanted to to build a dApp to solve these issues

1. Since its built on the blockchain, there's no one holding the funds, the contract does and the funds gets disbursed automatically to the person whose next as soon as deposit 
by everyone on the "corperative purse group " is made. Every member after depositing votes for a group member to recieve funds(including the person being voted for)(the frontend
has a chat room where all members can discuss and agree on who takes at a time)

2. The no.2 isssue stated above can also arise in on the  blockchain hence we're introducing the place of collateral, a user will have to deposit some collateral
 to be able to join "a corperative purse", the collateral is calculated with the formula => number of group members * contribution_amount;. The person who creates a purse has 
the liberty to state number of people he wants, time-intervals(maybe weekly) and contribution amount, asides this, he has no other right. 

By depositing collateral, that way you're sure going to keep depositing till every rounds of contribution for that group is completed

Now, here's the catch- users collateral wont just lie down doing nothing- they will be put in a lending/borrowing pool, that way thier funds help them accumulate some yields- 
so eventually, after all rounds of contriubution from a "purse group" is completed, you can withdraw your collateral with yields.

In this case, we implemented Suhsi's BentoBox.

We also have a swap contract, interacting with the uniswapV2 router. The aim of this is to have users swap to the stable this platform accepts incase they dont have it,
however for liquidity issues, the current functionality on the swap is to swap ETh(or any base token of the chain the contract is deployed on) for an erc20 token.

There's a contract called purseFactory, it handles the deployment of each purse as every purse is a contract and it selfdestructs after all rounds of contribution is done.

There are quiet some use cases and functionalities yet to be implemented, say for instance, a user who has deposited funds for first round and ofcourse collateral(its required
upon joining a purse), then for some reasons, maybe circumstances, the person is no longer seen to come back to make deposits, ofcourse, the collaterals will cover for this- 
however, we're working on how best to automate this and keep it decentralized as much as possible.

swap address on Matic maiinet - 0x7c1905Bd06E08067a4Bd780C2AD34d2306bc0375

purseFactory address on matic mainnet - 0x388Bce2B9c1759912944fE42057415910203125A


