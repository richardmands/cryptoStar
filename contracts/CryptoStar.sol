// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../react-app/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CryptoStar is ERC721 {

    constructor() ERC721("RMCryptoStar", "RMCS") {}

    struct Star {
        string name;
    }

    struct SwapStar {
        uint256 id;
        address from;
        address to;
    }

    mapping(uint256 => Star) public idToStar;
    mapping(uint256 => uint256) public idToPrice;
    mapping(uint256 => address) public idToRequest;

    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public { // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        idToStar[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping

        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Request Purchase Permission
    function requestPurchasePermission(uint256 _tokenId) public {
        idToRequest[_tokenId] = msg.sender;
    }

    function declineRequest(uint256 _tokenId) public {
        idToRequest[_tokenId] = address(0);
    }
    
    // Exchange Stars
    function exchangeStars(SwapStar[] memory stars) public {
        for (uint256 index = 0; index < stars.length; index++) {
            SwapStar memory star = stars[index];
            transferFrom(payable(star.from), payable(star.to), star.id);
        }
    }
  
    // Exchange Stars
    function transferStar(address _receiver, uint256 _tokenId ) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't transfer a Star you don't own");
        approve(_receiver, _tokenId);
        transferFrom(msg.sender, _receiver, _tokenId);
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping idToPrice, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sell a Star you don't own");
        idToPrice[_tokenId] = _price;
    }

    // Buy star. Buyer must be pre approved by seller.
    function buyStar(uint256 _tokenId) public payable {
        require(idToPrice[_tokenId] > 0, "The Star should be up for sale");
        
        uint256 starCost = idToPrice[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        
        transferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        idToRequest[_tokenId] = address(0);
        idToPrice[_tokenId] = 0;
        address payable ownerAddressPayable = payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        
        if(msg.value > starCost) {
            payable(msg.sender).transfer(msg.value - starCost);
        }
    }
}