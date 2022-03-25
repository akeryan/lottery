const assert = require('assert'); //'assert' is Node.js's standard library, which we'll be using for making assertions about tests
const ganache = require('ganache-cli'); //will serve us as a local test network
const { beforeEach } = require('mocha');
const Web3 = require('web3'); //here Web3 is with capital letter since it signifies a constructor 
const web3 = new Web3(ganache.provider()); //here web3 is with lower letter signifying an instance of Web3 and attempt to connect to a local network ganache-cli through the provider
//provider plays a role of a bridge in between web3 and the block chain (in our case ganache-cli)
const { interface, bytecode } = require ('../compile');

let accounts;
let inbox;

beforeEach(async () => {
	//get a list of all accounts
	accounts = await web3.eth.getAccounts();

	//use one of those accounts to deploy the contract
	lottery = await new web3.eth.Contract(JSON.parse(interface)) // here we say to create a Contract object (in the js space)
		.deploy({ data: bytecode }) // here we say to create a "real" object 
		.send({ from: accounts[0], gas: '1000000'}); // here where the Contract "real" object is deployed
}); // "inbox" is the representation of the contract deployed on the chain. 
	// Through "inbox" you interact with the functionality of the contract

describe ('Lottery', () => {
	it ('deploys a contract', () => {
		assert.ok(lottery.options.address);
	});

	it ('allows one account to enter', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('0.02', 'ether')
		});

		const players = await lottery.methods.getPlayers().call({
			from: accounts[0] 
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(1, players.length);
	});

	it ('allows multiple account to enter', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('0.02', 'ether')
		});

		await lottery.methods.enter().send({
			from: accounts[1],
			value: web3.utils.toWei('0.02', 'ether')
		});

		await lottery.methods.enter().send({
			from: accounts[2],
			value: web3.utils.toWei('0.02', 'ether')
		});

		const players = await lottery.methods.getPlayers().call({
			from: accounts[0] 
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(accounts[1], players[1]);
		assert.equal(accounts[2], players[2]);
		assert.equal(3, players.length);
	});

	it('requires a minimum amount of ether to enter', async () => {
		try {
			await lottery.methods.enter().send({
				from: accounts[0],
				value: 200
			});
			assert(false);
		} catch (err) {
			assert(err);
		}
	});

	
	it('only manager can call pickWinner', async () => {
		try {
			await lottery.methods.pickWinner().send({
				from: account[0]
			});	
			assert(false);
		} catch (err) {
			assert(err);
		}	
	});

	it('sends money to the winner and resets the players array', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei ('2', 'ether')
		});
		const initialBalance = await web3.eth.getBalance(accounts[0]);
		await lottery.methods.pickWinner().send({ from:accounts[0]});
		const finalBalance = await web3.eth.getBalance(accounts[0]);
		const difference = finalBalance - initialBalance;
		assert(difference > web3.utils.toWei('1.8', 'ether')); 
	});

});

