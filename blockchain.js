const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
    //Transaction ko call kerna hai
  }

  addBlock({ data }) {
    //{transaction, senderPublicKey, signature}
    const newBlock = Block.mineBlock({
      prevBlock: this.chain[this.chain.length - 1],
      data, //add transaction instead of data
    });
    this.chain.push(newBlock);
  }

  // always select the longest chain .'. use replaceChain
  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain is not longer");
      return;
    }
    //first validate the block then update
    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain is not valid");
      return;
    }

    // now all ok then update
    this.chain = chain;
  }

  static isValidChain(chain) {
    // Check if chain zero is = to the genesis block
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      // you can not compare two different bock instanceces therefore use Json.Stringify to compare
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, prevHash, hash, nonce, difficulty, data } = chain[i];
      const lastDifficulty = chain[i - 1].difficulty;
      const realLastHash = chain[i - 1].hash;

      if (prevHash !== realLastHash) return false;

      const validatedHash = cryptoHash(
        timestamp,
        prevHash,
        nonce,
        difficulty,
        data
      );

      if (hash !== validatedHash) return false;
      //check the difficulty so that no-One can manuipulate the difficulty
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }
    return true;
  }
}

class Transaction {
  constructor(amount, senderPublicKey, recieverPublicKey) {
    this.amount = amount;
    this.senderPublicKey = senderPublicKey;
    this.recieverPublicKey = recieverPublicKey;
  }

  // convert the data of the class to json so that
  // it can be converted into a hash

  toString() {
    return JSON.stringify(this);
  }
}

// class Wallet {
//   constructor() {
//     const keys = crypto.generateKeyPairSync("rsa", {
//       modulusLength: 2048,
//       publicKeyEncoding: { type: "spki", format: "pem" },
//       privateKeyEncoding: { type: "pkcs8", format: "pem" },
//     });

//     this.privateKey = keys.privateKey;
//     this.publicKey = keys.publicKey;
//   }

//   send(amount, recieverPublicKey) {
//     const transaction = new Transaction(
//       amount,
//       this.publicKey,
//       recieverPublicKey
//     );

//     const shaSign = crypto.createSign("SHA256");
//     // add the transaction json
//     shaSign.update(transaction.toString()).end();
//     // sign the SHA with the private key
//     const signature = shaSign.sign(this.privateKey);

//     Chain.instance.insertBlock(transaction, this.publicKey, signature);
//   }
// }

// const itachi = new Wallet();
// const madara = new Wallet();
// const orochimaru = new Wallet();

// itachi.send(50, madara.publicKey);
// madara.send(23, orochimaru.publicKey);
// orochimaru.send(5, madara.publicKey);

// const blockchain = new Blockchain();
// blockchain.addBlock({ data: "Block1" });
// blockchain.addBlock({ data: "Block2" }); // check the new block or second block
// const result = Blockchain.isValidChain(blockchain.chain);
// console.log(blockchain.chain);
// console.log(result);
// //console.log(blockchain);
module.exports = Blockchain;
