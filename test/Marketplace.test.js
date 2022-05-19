// Tests to simulate client-side interaction with the smart contract
// based on Mocha testing framework

/* eslint-disable no-undef */
const Marketplace = artifacts.require("./Marketplace.sol");

// Import chai assertion library
require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Marketplace", ([deployer, seller, buyer]) => {
  let marketplace;

  // Before-hook deploys a contract before each test runs
  before(async () => {
    marketplace = await Marketplace.deployed();
  });

  // Contract deployment tests
  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await marketplace.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await marketplace.name();
      assert.equal(name, "Marketplace");
    });
  });

  // Product creation tests
  describe("products", async () => {
    let result, productCount;

    // Before-hook creates a product before each test runs
    before(async () => {
      result = await marketplace.createProduct(
        "C# course",
        web3.utils.toWei("1", "Ether"),
        { from: seller }
      );
      productCount = await marketplace.productCount();
    });

    it("creates products", async () => {
      // SUCCESS
      assert.equal(productCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), productCount.toNumber(),"id is correct");
      assert.equal(event.name, "C# course", "name is correct");
      assert.equal(event.price, "1000000000000000000", "price is correct");
      assert.equal(event.owner, seller, "owner is correct");

      // FAILURE: Product must have a name
      await marketplace.createProduct("", web3.utils.toWei("1", "Ether"),{ from: seller })
        .should.be.rejected;
      // FAILURE: Product must have a price
      await marketplace.createProduct("C# course", 0, { from: seller })
        .should.be.rejected;
    });

    it("sells products", async () => {
      // Track the seller balance before purchase
      let oldSellerBalance;
      oldSellerBalance = await web3.eth.getBalance(seller);
      oldSellerBalance = new web3.utils.BN(oldSellerBalance);

      // SUCCESS: Buyer makes purchase
      result = await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether"),
      });

      // Check logs
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), productCount.toNumber(),"id is correct");
      assert.equal(event.name, "C# course", "name is correct");
      assert.equal(event.price, "1000000000000000000", "price is correct");
      assert.equal(event.owner, seller, "owner is correct");

      // Check that seller received funds
      let newSellerBalance;
      newSellerBalance = await web3.eth.getBalance(seller);
      newSellerBalance = new web3.utils.BN(newSellerBalance);

      let price;
      price = web3.utils.toWei("1", "Ether");
      price = new web3.utils.BN(price);

      const expectedBalance = oldSellerBalance.add(price);

      assert.equal(newSellerBalance.toString(), expectedBalance.toString(), "Ether has been transferred correctly");

      // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
      await marketplace.purchaseProduct(99, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected; 
      // FAILURE: Buyer tries to buy without enough ether
      await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("0.5", "Ether"),
      }).should.be.rejected;
    });
  });
});
