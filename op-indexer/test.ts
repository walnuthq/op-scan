import {
  findSolcPlatform,
  getSolcExecutable,
  getSolcJs,
} from "@/lib/compiler/solidity-compiler";

const content = `
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
`;

const main = async () => {
  /* const solcPlatform = findSolcPlatform();
  if (!solcPlatform) {
    return;
  }
  console.log(solcPlatform);
  const solcPath = await getSolcExecutable(
    solcPlatform,
    "0.8.27+commit.40a35a09",
  );
  console.log(solcPath); */
  const solJson = await getSolcJs("0.8.27+commit.40a35a09");
  const solcJsonInput = {
    language: "Solidity",
    sources: {
      "Counter.sol": {
        content,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };
  const inputStringified = JSON.stringify(solcJsonInput);
  const compiled = solJson.compile(inputStringified);
  console.log(compiled);
};

main();
