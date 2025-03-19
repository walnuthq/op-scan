import {
  IVyperCompiler,
  VyperOutput,
  VyperJsonInput,
} from "@ethereum-sourcify/lib-sourcify";

interface VyperCompiler {
  compile: (vyperJsonInput: string) => string;
}

const getVyperCompiler = (version: string): VyperCompiler => {
  console.info(version);
  const compiler = {
    compile(vyperJsonInput: string) {
      console.info(vyperJsonInput);
      return "";
    },
  };
  return compiler;
};

class Vyper implements IVyperCompiler {
  async compile(
    version: string,
    vyperJsonInput: VyperJsonInput,
  ): Promise<VyperOutput> {
    const vyperCompiler = getVyperCompiler(version);
    const compiled = vyperCompiler.compile(JSON.stringify(vyperJsonInput));
    return JSON.parse(compiled);
  }
}

const vyper = new Vyper();

export default vyper;
