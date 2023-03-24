const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const fs = require("fs")
// const cwd = process.cwd();
const data = fs.readFileSync('../Whitelist/whitelist.json', 'utf8');

const whitelist = JSON.parse(data)

const leaves = whitelist.map((x) => keccak256(x));

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getHexRoot();
const leaf = keccak256('0x7c73b6bd1d9e484397f7ed4704ab1b6af888c325');
const proof = tree.getHexProof(leaf);

console.log(root); //0xe4d077bb973063a680d206b8db2614982f70bb613c8330b1e75608c6c2570a97
console.log(leaf);
console.log(proof);
console.log(tree.toString());
