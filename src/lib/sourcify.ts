import solc_0_8_5 from "solc-0.8.5";
import solc_0_8_7 from "solc-0.8.7";
import solc_0_8_18 from "solc-0.8.18";
import solc_0_8_20 from "solc-0.8.20";
import solc_0_8_24 from "solc-0.8.24";
import {
  ISolidityCompiler,
  CompilerOutput,
  JsonInput,
  SourcifyChain,
} from "@ethereum-sourcify/lib-sourcify";
import { l2Chain } from "@/lib/chains";
import { CompilerVersion } from "@/lib/types";

interface SolidityCompiler {
  compile: (solcJsonInput: string) => string;
}

const getSolidityCompiler = (version: CompilerVersion): SolidityCompiler => {
  switch (version) {
    case "0.8.5+commit.a4f2e591": {
      return solc_0_8_5;
    }
    case "0.8.7+commit.e28d00a7": {
      return solc_0_8_7;
    }
    case "0.8.18+commit.87f61d96": {
      return solc_0_8_18;
    }
    case "0.8.20+commit.a1b79de6": {
      return solc_0_8_20;
    }
    default: {
      return solc_0_8_24;
    }
  }
};

class Solc implements ISolidityCompiler {
  async compile(
    version: string,
    solcJsonInput: JsonInput,
    forceEmscripten = false,
  ): Promise<CompilerOutput> {
    const solidityCompiler = getSolidityCompiler(version as CompilerVersion);
    const compiled = solidityCompiler.compile(JSON.stringify(solcJsonInput));
    return JSON.parse(compiled);
  }
}

export const solc = new Solc();

const rpc = [process.env.NEXT_PUBLIC_L2_RPC_URL];
if (process.env.NEXT_PUBLIC_L2_FALLBACK1_RPC_URL) {
  rpc.push(process.env.NEXT_PUBLIC_L2_FALLBACK1_RPC_URL);
}
if (process.env.NEXT_PUBLIC_L2_FALLBACK2_RPC_URL) {
  rpc.push(process.env.NEXT_PUBLIC_L2_FALLBACK2_RPC_URL);
}
if (process.env.NEXT_PUBLIC_L2_FALLBACK3_RPC_URL) {
  rpc.push(process.env.NEXT_PUBLIC_L2_FALLBACK3_RPC_URL);
}

export const sourcifyChain = new SourcifyChain({
  chainId: l2Chain.id,
  name: l2Chain.name,
  rpc,
  supported: true,
});
