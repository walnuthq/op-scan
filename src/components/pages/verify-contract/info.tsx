import { CompilerType } from "@/lib/types";

const VerifyContractInfo = ({
  step,
  type,
}: {
  step: 1 | 2;
  type?: CompilerType;
}) => (
  <div className="flex w-full flex-col gap-4 lg:w-2/3">
    <p className="text-sm">
      Source code verification provides transparency for users interacting with
      smart contracts. By uploading the source code, OP Scan will match the
      compiled code with that on the blockchain.
    </p>
    {step === 2 && (
      <>
        {type === "solidity-single-file" && (
          <p className="text-sm">
            A simple and structured interface for verifying smart contracts that
            fit in a single file.
          </p>
        )}
        {/*type === "solidity-multiple-files" && (
          <p className="text-sm">
            This is an <strong>experimental</strong> source code verifier which
            supports verification of <strong>multi-part solidity files</strong>{" "}
            (imports).
          </p>
        )*/}
        {type === "solidity-standard-json-input" && (
          <p className="text-sm">
            <strong>Standard Json-Input</strong> is the recommended way to
            interface with the Solidity compiler especially for more complex and
            automated setups.
          </p>
        )}
      </>
    )}
  </div>
);

export default VerifyContractInfo;
