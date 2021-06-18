const {
    accounts: { issuer },
    serverUrl
} = require('./config.json');

const { Server, Networks, TransactionBuilder, Keypair, Operation, AuthClawbackEnabledFlag, AuthRevocableFlag } = require('stellar-sdk');
const server = new Server(serverUrl);

const setClawBackAsset = async() => {

    const txOptions = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.TESTNET
    }

    const issuerAccount = await server.loadAccount(issuer.publicKey);

    const setOptionData = {
        setFlags: AuthClawbackEnabledFlag | AuthRevocableFlag
    }

    const transaction = new TransactionBuilder(issuerAccount, txOptions)
        .addOperation(Operation.setOptions(setOptionData))
        .setTimeout(0)
        .build();

    transaction.sign(Keypair.fromSecret(issuer.secret));

    await server.submitTransaction(transaction);

}

setClawBackAsset()
    .then(console.log("Enabled Clawback option to Issuer Account"))
    .catch(e => {
        console.log("Error Again", e);
        throw e;
    })