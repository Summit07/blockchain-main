const MINE_RATE = 1000; //1s = 1000ms
const INITIAL_DIFFICULTY = 2;

// This is the genisis block means the first block having no any prevHash.

const GENESIS_DATA = {
  timestamp: 1,
  prevHash: "0x000",
  hash: "0x123",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: [],
};
