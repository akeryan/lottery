
const path = require('path'); // we are using here path standard module (instead of directly 'showing' the path) in order to guarantie cross-platform compatability
const fs = require ('fs'); // 'fs' stands for 'file system', which is Node.js's standard module
const solc = require('solc'); // 'solc' is a solidity compiler


const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol'); // "__dirname" (with 2 underscores) is a constant that is set to the current working directory (in our case it is Inbox directory)
// we'll read the raw source code of our smart contract into the 'source' variable
const source = fs.readFileSync(lotteryPath, 'utf8'); // 'utf8' is the encoding of the file we are reading, in our case Inbox.sol has utf8 encoding

module.exports = solc.compile(source, 1).contracts[':Lottery']; //this command compiles the 'source' file. The second argumend specifies the number of contracts we inted to compile. In our case we have only 1 contract
// in the above commande we can see the result of the compilation by wrapping it inside console.log()
// In order to make the results of the compilation accessable for further processing we are exporting them with 'module.exports'
// In order to export only the needed components of the Inbox contract we call 'contracts' method and specify ':Inbox'
// By doing so we export only the bytecode and the ABI of the Inbox contract.

