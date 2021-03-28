const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[2];
    let user2 = accounts[3];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[4];
    let user2 = accounts[5];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[6];
    let user2 = accounts[7];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
  });

it('can add the star name and star symbol properly', async() => {
    let tokenNameProvided = 'Storken';
    let tokenSymbolProvided = 'STR';
    let instance = await StarNotary.deployed();
    let tokenId = 6;
    await instance.createStar('Random star', tokenId, {from: accounts[0]});
    assert.equal(await instance.name(), tokenNameProvided);
    assert.equal(await instance.symbol(), tokenSymbolProvided);
});


it('lets 2 users exchange stars', async() => {
    let tokenIdStarOne = 7;
    let tokenIdStartwo = 8;
    let userOne = accounts[8];
    let instance = await StarNotary.deployed();
    await instance.createStar('Random star one', tokenIdStarOne, {from: userOne});
    await instance.createStar('Random star two', tokenIdStartwo, {from: owner});
    await instance.exchangeStars(tokenIdStarOne, tokenIdStartwo);
    assert.equal(await instance.ownerOf.call(tokenIdStarOne), owner);
    assert.equal(await instance.ownerOf.call(tokenIdStartwo), userOne);
});

it('lets a user transfer a star', async() => {
    let tokenId = 9;
    let transferUser = accounts[9];
    let instance = await StarNotary.deployed();
    await instance.createStar('Random star', tokenId, { from: owner });
    await instance.transferStar(transferUser, tokenId)

});

it('lookUptokenIdToStarInfo test', async() => {
    let tokenId = 10;
    let starName = 'Test Star'
    let instance = await StarNotary.deployed();
    await instance.createStar(starName, tokenId, {from: accounts[0]})
    assert.equal(await instance.lookUptokenIdToStarInfo(tokenId), starName)
});
