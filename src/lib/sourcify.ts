import solc_0_8_5 from "solc-0.8.5";
import solc_0_8_7 from "solc-0.8.7";
import solc_0_8_18 from "solc-0.8.18";
import solc_0_8_20 from "solc-0.8.20";
import solc_0_8_24 from "solc-0.8.24";
import solc_0_8_25 from "solc-0.8.25";
import solc_0_8_26 from "solc-0.8.26";
import solc_0_8_27 from "solc-0.8.27";
import solc_0_8_28 from "solc-0.8.28";
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
  const versions = {
    "0.8.28+commit.7893614a": solc_0_8_28,
    "0.8.27+commit.40a35a09": solc_0_8_27,
    "0.8.26+commit.8a97fa7a": solc_0_8_26,
    "0.8.25+commit.b61c2a91": solc_0_8_25,
    "0.8.24+commit.e11b9ed9": solc_0_8_24,
    "0.8.20+commit.a1b79de6": solc_0_8_20,
    "0.8.18+commit.87f61d96": solc_0_8_18,
    "0.8.7+commit.e28d00a7": solc_0_8_7,
    "0.8.5+commit.a4f2e591": solc_0_8_5,
  } as const;
  return versions[version];
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
if (process.env.NEXT_PUBLIC_L2_FALLBACK4_RPC_URL) {
  rpc.push(process.env.NEXT_PUBLIC_L2_FALLBACK4_RPC_URL);
}
if (process.env.NEXT_PUBLIC_L2_FALLBACK5_RPC_URL) {
  rpc.push(process.env.NEXT_PUBLIC_L2_FALLBACK5_RPC_URL);
}

export const sourcifyChain = new SourcifyChain({
  chainId: l2Chain.id,
  name: l2Chain.name,
  rpc,
  supported: true,
});
