import { NextRequest, NextResponse } from "next/server";
import {
  ISolidityCompiler,
  CompilerOutput,
  JsonInput,
} from "@ethereum-sourcify/lib-sourcify";
import { solidityCompiler } from "@/lib/compiler/solidity-compiler";

class Solc implements ISolidityCompiler {
  async compile(
    version: string,
    solcJsonInput: JsonInput,
    forceEmscripten: boolean = false,
  ): Promise<CompilerOutput> {
    return await solidityCompiler(version, solcJsonInput, forceEmscripten);
  }
}
const solc = new Solc();

export const GET = async (request: NextRequest) => {
  return NextResponse.json({ ok: true });
};
