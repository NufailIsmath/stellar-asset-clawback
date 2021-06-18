const {
    accounts: { issuer, payee },
    serverUrl
} = require('./config.json');

const { Server, Networks, TransactionBuilder, Keypair, Operation, Asset, Transaction } = require('stellar-sdk');
const server = new Server(serverUrl);

const isseAssetandPayment = async() => {

    const issuerAccount = await server.loadAccount(issuer.publicKey);

    const clawBackAsset = new Asset("NIFTRON", issuer.publicKey);

    const txOptions = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.TESTNET
    }

    const changeTrustOpt = {
        asset: clawBackAsset,
        source: payee.publicKey

    }

    const paymentOpt = {
        destination: payee.publicKey,
        asset: clawBackAsset,
        amount: "500",
        source: issuer.publicKey
    }

    const transaction = new TransactionBuilder(issuerAccount, txOptions)
        .addOperation(Operation.changeTrust(changeTrustOpt))
        .addOperation(Operation.payment(paymentOpt))
        .setTimeout(0)
        .build();


    transaction.sign(Keypair.fromSecret(issuer.secret))
    transaction.sign(Keypair.fromSecret(payee.secret))
        /* const xdr = transaction.toXDR();

        console.log(xdr) */


    try {
        await server.submitTransaction(transaction)
    } catch (e) {
        console.log(e.message)
        console.log(e.response.data.extras.result_codes.operations)
    }
}

isseAssetandPayment()
    .then(console.log("Created Asset and made Payment"))
    .catch(e => {
        console.log("Error Again", e.response.data.extras.result_codes);
        throw e;
    })