import solc_0_8_29 from "solc-0.8.29";
import solc_0_8_28 from "solc-0.8.28";
import solc_0_8_27 from "solc-0.8.27";
import solc_0_8_26 from "solc-0.8.26";
import solc_0_8_25 from "solc-0.8.25";
import solc_0_8_24 from "solc-0.8.24";
import solc_0_8_23 from "solc-0.8.23";
import solc_0_8_22 from "solc-0.8.22";
import solc_0_8_21 from "solc-0.8.21";
import solc_0_8_20 from "solc-0.8.20";
import solc_0_8_19 from "solc-0.8.19";
import solc_0_8_18 from "solc-0.8.18";
import solc_0_8_17 from "solc-0.8.17";
import solc_0_8_16 from "solc-0.8.16";
import solc_0_8_15 from "solc-0.8.15";
import solc_0_8_14 from "solc-0.8.14";
import solc_0_8_13 from "solc-0.8.13";
import solc_0_8_12 from "solc-0.8.12";
import solc_0_8_11 from "solc-0.8.11";
import solc_0_8_10 from "solc-0.8.10";
import solc_0_8_9 from "solc-0.8.9";
import solc_0_8_8 from "solc-0.8.8";
import solc_0_8_7 from "solc-0.8.7";
import solc_0_8_6 from "solc-0.8.6";
import solc_0_8_5 from "solc-0.8.5";
import solc_0_8_4 from "solc-0.8.4";
import solc_0_8_3 from "solc-0.8.3";
import solc_0_8_2 from "solc-0.8.2";
import solc_0_8_1 from "solc-0.8.1";
import solc_0_8_0 from "solc-0.8.0";
import {
  type ISolidityCompiler,
  type SolidityOutput,
  type JsonInput,
} from "@ethereum-sourcify/lib-sourcify";
import { type SolidityCompilerVersion } from "@/lib/types";

interface SolidityCompiler {
  compile: (solcJsonInput: string) => string;
}

const getSolidityCompiler = (
  version: SolidityCompilerVersion,
): SolidityCompiler => {
  const solidityCompilerVersions = {
    "0.8.29+commit.ab55807c": solc_0_8_29,
    "0.8.28+commit.7893614a": solc_0_8_28,
    "0.8.27+commit.40a35a09": solc_0_8_27,
    "0.8.26+commit.8a97fa7a": solc_0_8_26,
    "0.8.25+commit.b61c2a91": solc_0_8_25,
    "0.8.24+commit.e11b9ed9": solc_0_8_24,
    "0.8.23+commit.f704f362": solc_0_8_23,
    "0.8.22+commit.4fc1097e": solc_0_8_22,
    "0.8.21+commit.d9974bed": solc_0_8_21,
    "0.8.20+commit.a1b79de6": solc_0_8_20,
    "0.8.19+commit.7dd6d404": solc_0_8_19,
    "0.8.18+commit.87f61d96": solc_0_8_18,
    "0.8.17+commit.8df45f5f": solc_0_8_17,
    "0.8.16+commit.07a7930e": solc_0_8_16,
    "0.8.15+commit.e14f2714": solc_0_8_15,
    "0.8.14+commit.80d49f37": solc_0_8_14,
    "0.8.13+commit.abaa5c0e": solc_0_8_13,
    "0.8.12+commit.f00d7308": solc_0_8_12,
    "0.8.11+commit.d7f03943": solc_0_8_11,
    "0.8.10+commit.fc410830": solc_0_8_10,
    "0.8.9+commit.e5eed63a": solc_0_8_9,
    "0.8.8+commit.dddeac2f": solc_0_8_8,
    "0.8.7+commit.e28d00a7": solc_0_8_7,
    "0.8.6+commit.11564f7e": solc_0_8_6,
    "0.8.5+commit.a4f2e591": solc_0_8_5,
    "0.8.4+commit.c7e474f2": solc_0_8_4,
    "0.8.3+commit.8d00100c": solc_0_8_3,
    "0.8.2+commit.661d1103": solc_0_8_2,
    "0.8.1+commit.df193b15": solc_0_8_1,
    "0.8.0+commit.c7dfd78e": solc_0_8_0,
  } as const;
  return solidityCompilerVersions[version];
};

class Solc implements ISolidityCompiler {
  async compile(
    version: string,
    solcJsonInput: JsonInput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    forceEmscripten = false,
  ): Promise<SolidityOutput> {
    const solidityCompiler = getSolidityCompiler(
      version as SolidityCompilerVersion,
    );
    const compiled = solidityCompiler.compile(JSON.stringify(solcJsonInput));
    return JSON.parse(compiled);
  }
}

const solc = new Solc();

export default solc;
