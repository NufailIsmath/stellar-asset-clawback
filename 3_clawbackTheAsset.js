const {
    accounts: { issuer, payee },
    serverUrl
} = require('./config.json');

const { Server, Networks, TransactionBuilder, Keypair, Operation, Asset } = require('stellar-sdk');
const server = new Server(serverUrl);

const clawbackTheAsset = async() => {

    const issuerAccount = await server.loadAccount(issuer.publicKey);
    const clawBackAsset = new Asset("NIFTRON", issuer.publicKey)

    const txOptions = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.TESTNET
    }

    const clawbackOpt = {
        asset: clawBackAsset,
        from: payee.publicKey,
        amount: "250"
    }

    const transaction = new TransactionBuilder(issuerAccount, txOptions)
        .addOperation(Operation.clawback(clawbackOpt))
        .setTimeout(0)
        .build();

    transaction.sign(Keypair.fromSecret(issuer.secret))

    try {
        await server.submitTransaction(transaction)
    } catch (e) {
        console.log(e.message)
        console.log(e.response.data.extras.result_codes.operations)
    }
}

clawbackTheAsset()
    .then(console.log("Clawback theasset successfully"))
    .catch(e => {
        console.log("Error Again", e.response.data.extras.result_codes);
        throw e;
    })