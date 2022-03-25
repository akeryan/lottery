//npm install @truffle/hdwallet-provider@2.0.1
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider (
	'trumpet version make receive hamster kind enact rival retreat major age disease',
	'https://rinkeby.infura.io/v3/2746ba6598ec4f94a629c6e9fc27232a'
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log('attempting to deploy from account', accounts[0]);

	const result = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({data: bytecode, arguments: ['Hi world']})
		.send({ gas: '1000000', from: accounts[0] });

	console.log('contract deployed to:', result.options.address);
	provider.engine.stop();	
};
deploy();