// Declare Solidity version
pragma solidity ^0.5.0;

// Declare smart contract
contract Marketplace {
    // Declare state variables to
    // (be stored on the blockchain)
    string public name;
    uint256 public productCount = 0;
    mapping(uint256 => Product) public products; // ~ hash tables with key-value pairs

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address payable owner;
        address[] subscribers;
        uint256 subscribersCount;
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        address[] subscribers,
        uint256 subscribersCount
    );

    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        address[] subscribers,
        uint256 subscribersCount
    );

    constructor() public {
        name = "Marketplace";
    }

    function createProduct(string memory _name, uint256 _price) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid price
        require(_price > 0);

        // Increment product count
        productCount++;

        // Initiate an empty array of subscribers
        address[] memory _subscribers;
        uint256 _subscribersCount = 0;

        // Create the product and add it to the mapping
        products[productCount] = Product(
            productCount,
            _name,
            _price,
            msg.sender, // wallet address of the user creating the product
            _subscribers,
            _subscribersCount
        );

        // Emit ProductCreated event
        // External subscribers can listen for this event to verify
        // that a product was created on the blockchain
        emit ProductCreated(
            productCount,
            _name,
            _price,
            msg.sender,
            _subscribers,
            _subscribersCount
        );
    }

    function purchaseProduct(uint256 _id) public payable {
        // Fetch the product from the mapping and create a new copy of it in memory
        Product memory _product = products[_id];
        // Fetch the owner (a seller to be)
        address payable _seller = _product.owner;

        // Make sure the product has a valid id
        require(_product.id > 0 && _product.id <= productCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _product.price);
        // Require that the product hasn't been purchased already by the same buyer
        bool alreadyPurchased = false;
        /*for (uint i = 0; i < _product.subscribersCount - 1; i++) {
            if (_product.subscribers[i] == msg.sender) {
                alreadyPurchased = true;
            }
        }*/
        require(!alreadyPurchased);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);

        // Add the buyer to the subscribers list
        //_product.subscribers[_product.subscribersCount] = msg.sender;
        //_product.subscribersCount++;

        // Update the product
        products[_id] = _product;
        // Pay the seller by sending them Ether
        address(_seller).transfer(msg.value);

        // Emit ProductPurchased event
        // External subscribers can listen for this event to verify
        // that a product was purchased on the blockchain
        emit ProductPurchased(
            productCount,
            _product.name,
            _product.price,
            _product.owner,
            _product.subscribers,
            _product.subscribersCount
        );
    }
}
