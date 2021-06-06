const CryptoStar = artifacts.require("./CryptoStar.sol");

contract("CryptoStar", accounts => {
  before(async () => {
    owner = accounts[0]
    console.log("🚀 ~ owner", owner)
    cryptoStar = await CryptoStar.deployed()
    stars = [
        {
          id: 101,
          name: "Twinkle",
          price:  web3.utils.toWei(".01", "ether")
        }, 
        {
          id: 102,
          name: "Winkle",
          price: web3.utils.toWei(".02", "ether")
        }, 
        {
          id: 103,
          name: "Sprinkle",
          price: web3.utils.toWei(".03", "ether"),
          updatedPrice: web3.utils.toWei(".07", "ether")
        },
        {
          id: 104,
          name: "Finkle",
        },
        {
          id: 105,
          name: "Binkle",
        },
        {
          id: 106,
          name: "Rinkle",
        }
      ]
  })
  
  describe("CryptoStar functions correctly", () => {
    before("See accounts", async () => {
      console.log("🚀 ~ accounts", accounts)
    })

    it("deploys with the correct name and symbol", async () => {
      const tokenName = await cryptoStar.name()
      console.log("🚀 ~ tokenName", tokenName)
      const symbol = await cryptoStar.symbol()
      console.log("🚀 ~ symbol", symbol)
      assert.equal(tokenName, "RMCryptoStar", "Wrong token name");
      assert.equal(symbol, "RMCS", "Wrong token symbol");
    })
  
    it("createStar()", async () => {
      await cryptoStar.createStar(stars[0].name, stars[0].id);
      await cryptoStar.createStar(stars[1].name, stars[1].id);
      await cryptoStar.createStar(stars[2].name, stars[2].id);
      const name = await cryptoStar.idToStar(stars[1].id)
      console.log("🚀 ~ name", name)
      assert.equal(name, stars[1].name, "Wrong star name");
      
      try {
        await cryptoStar.createStar(stars[0].name, stars[0].id);
      } catch (error) {
        console.log("🚀 ~ error", error.reason)
        assert.equal(error.reason, 'ERC721: token already minted', "Wrong error message");
      }
    });
    
    // Transfer stars between accounts[4] tand accounts[5]
    it("exchangeStars()", async () => {
      // user1 makes two stars
      const user1 = accounts[4]
      await cryptoStar.createStar(stars[3].name, stars[3].id, { from : user1});
      const owner1 = await cryptoStar.ownerOf(stars[3].id)
      assert.equal(user1, owner1, "Wrong owner")
      await cryptoStar.createStar(stars[4].name, stars[4].id, { from : user1});
      const owner2 = await cryptoStar.ownerOf(stars[4].id)
      assert.equal(user1, owner2, "Wrong owner")
      
      // user 2 makes 1 star
      const user2 = accounts[5]
      await cryptoStar.createStar(stars[5].name, stars[5].id, { from : user2});
      const owner3 = await cryptoStar.ownerOf(stars[5].id)
      assert.equal(user2, owner3, "Wrong owner")

      // approve each other
      await cryptoStar.setApprovalForAll(user2, true, { from: user1})
      await cryptoStar.setApprovalForAll(user1, true, { from: user2})

      // do the exchange
      const starsToExchange = [
        {id: stars[3].id, from: user1, to: user2},
        {id: stars[4].id, from: user1, to: user2},
        {id: stars[5].id, from: user2, to: user1},
      ]
      await cryptoStar.exchangeStars(starsToExchange, { from : user1})

      const owner1New = await cryptoStar.ownerOf(stars[3].id)
      assert.equal(user2, owner1New, "Wrong owner")
      const owner2New = await cryptoStar.ownerOf(stars[4].id)
      assert.equal(user2, owner2New, "Wrong owner")
      const owner3New = await cryptoStar.ownerOf(stars[5].id)
      assert.equal(user1, owner3New, "Wrong owner")
    });
    
    // Transfer stars[0] to accounts[3]
    it("transferStar()", async () => {
      const receiver = accounts[3]
      const owner = await cryptoStar.ownerOf(stars[0].id)
      assert.equal(accounts[0], owner, "Wrong owner")
      
      await cryptoStar.transferStar(receiver, stars[0].id)
      const newOwner = await cryptoStar.ownerOf(stars[0].id)
      assert.equal(accounts[3], newOwner, "Wrong owner")
    });
    
    it("putStarUpForSale()", async () => {
      await cryptoStar.putStarUpForSale(stars[2].id, stars[2].price)
      let price = await cryptoStar.idToPrice(stars[2].id)
      console.log("🚀 ~ price", price)
      assert.equal(price, stars[2].price, "Wrong star price");
      
      const newPrice = stars[2].updatedPrice
      await cryptoStar.putStarUpForSale(stars[2].id, newPrice)
      price = await cryptoStar.idToPrice(stars[2].id)
      console.log("🚀 ~ price", price)
      assert.equal(price, newPrice, "Wrong star price");
    });
    
    
    it("buyStar()", async () => {
      const account2Balance = await web3.eth.getBalance(accounts[2]);
      console.log("🚀 ~ account2Balance", account2Balance)
      await cryptoStar.approve(accounts[2], stars[2].id, {from: accounts[0], gasPrice: 0})
      
      try {
        await cryptoStar.buyStar(stars[2].id, {from: accounts[2], gasPrice: 0, value: 1}) 
      } catch (error) {
        console.log("🚀 ~ error", error.reason)
        assert.equal(error.reason, 'You need to have enough Ether', "Wrong error message"); 
      }

      await cryptoStar.buyStar(stars[2].id, {from: accounts[2], gasPrice: 0, value: web3.utils.toWei(".1", "ether")}) 
      assert.equal(await cryptoStar.ownerOf.call(stars[2].id), accounts[2]);
      
      const updatedAccount2Balance = await web3.eth.getBalance(accounts[2]);
      console.log("🚀 ~ updatedAccount2Balance", updatedAccount2Balance)
      const actualdiff = Number(account2Balance) - Number(updatedAccount2Balance)
      console.log("🚀 ~ actualdiff", actualdiff)
      const expectedDiff = Number(stars[2].updatedPrice)
      console.log("🚀 ~ expectedDiff", expectedDiff)
      assert.equal(actualdiff, expectedDiff, "Balance not reduced by correct amount");
    });  
  })
});
