"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/cjs/styles/prism";

type ContractFile = {
  name: string;
  path: string;
  content: string;
};

interface ContractValidatorProps {
  hash: string;
  initialStatus: string;
}

const ContractValidator = ({ hash, initialStatus }: ContractValidatorProps) => {
  const chainId = "11155420"; // op sepolia
  const [status, setStatus] = useState(initialStatus);
  const [files, setFiles] = useState<ContractFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metadataFile, setMetadataFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (status === "perfect") {
        try {
          const response = await fetch(
            `https://sourcify.dev/server/files/${chainId}/${hash}`,
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch files for contract: ${response.statusText}`,
            );
          }
          const filesData: ContractFile[] = await response.json();
          setFiles(filesData);
        } catch (err) {
          setError((err as Error).message);
        }
      }
    };

    fetchFiles();
  }, [hash, status]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setMetadataFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!metadataFile) return;
    setIsLoading(true);
    setError(null);

    try {
      const metadataContent = await metadataFile.text();
      const payload = {
        address: hash,
        chain: chainId,
        files: {
          "metadata.json": metadataContent,
        },
      };
      const response = await fetch("https://sourcify.dev/server/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to validate contract: ${response.statusText}`);
      }

      const result = await response.json();
      const validationResult = result.result[0]; // Extract the first result item
      setStatus(validationResult.status);
      if (validationResult.status === "perfect") {
        const filesResponse = await fetch(
          `https://sourcify.dev/server/files/${chainId}/${hash}`,
        );
        const filesData: ContractFile[] = await filesResponse.json();
        setFiles(filesData);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {status !== "perfect" && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">
            Upload metadata.json to validate contract
          </h3>
          <input type="file" accept=".json" onChange={handleFileChange} />
          <button onClick={handleSubmit} className="btn btn-primary mt-2">
            Submit
          </button>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <p>Validating contract, please wait...</p>
        </div>
      )}

      {status === "perfect" &&
        files.map((file, index) => (
          <div key={index} className="mt-4">
            <h3 className="text-xl font-bold">{file.name}</h3>
            <SyntaxHighlighter language="solidity" style={solarizedlight}>
              {file.content}
            </SyntaxHighlighter>
          </div>
        ))}

      {error && (
        <div className="mt-4 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default ContractValidator;
