import { NextApiRequest, NextApiResponse } from 'next';
import keccak256 from 'keccak256';
import { MerkleTree } from 'merkletreejs';
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  const { input } = JSON.parse(req.body);

  const cwd = process.cwd();
  const data = fs.readFileSync(cwd + '/Whitelist/whitelist.json', 'utf8');

  const whitelist = JSON.parse(data)

  const leaves = whitelist.map((x) => keccak256(x));

  const merkleTree = new MerkleTree(leaves, keccak256, {
    sortPairs: true,
  });

  const hashedLeave = keccak256(input);
  const proof = merkleTree.getHexProof(hashedLeave);
  // const root = merkleTree.getHexRoot();
  // const valid = merkleTree.verify(proof, hashedLeave, root);


  return res.status(200).json({
    proof

  })

}
