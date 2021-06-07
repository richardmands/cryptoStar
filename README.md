# cryptoStar
My Version of Udacity Crypto Star Dapp

# Submission Info
### ERC721 Token Name - RMCryptoStar
### ERC721 Token Symbl - RMCS
### Working App on Netlify
https://cryptostar.netlify.app/
### Contract on Rinkeby
https://rinkeby.etherscan.io/address/0xd1d6F822FD86682F6b00F4489E1410b3B466052b
### Token on Rinkeby
https://rinkeby.etherscan.io/token/0xd1d6F822FD86682F6b00F4489E1410b3B466052b
### Truffle v5.3.6
### @openzeppelin/contracts v4.1.0

## Notes for Reviewer
- I renamed `lookUptokenIdToStarInfo` to `idToStar` and didn't include a function as it's a public mapping so doesn't need a specific method.
- App doesn't look up stars, it displays a set of cards that display information for each card. See `react-app/src/useStar.js` for how star info is collected.
