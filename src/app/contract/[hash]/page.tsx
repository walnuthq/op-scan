import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import DescriptionListItem from "@/components/lib/description-list-item";
import ContractValidator from "@/components/pages/contract/contract-validator";
import { Hash } from "viem";

type ContractStatus = {
  address: string;
  status: string;
  chainIds: string[];
};

async function getStatusForContract(hash: string): Promise<ContractStatus[]> {
  const chainId = "11155420"; // op sepolia
  const url = `https://sourcify.dev/server/check-by-addresses?addresses=${hash}&chainIds=${chainId}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch status for contract: ${response.statusText}`);
  }
  return response.json();
}

interface ContractPageProps {
  params: {
    hash: Hash;
  };
}

const ContractPage = async ({ params }: ContractPageProps) => {
  const { hash } = params;

  try {
    const statusData = await getStatusForContract(hash);

    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Contract Details
        </h2>
        <Card>
          <CardContent className="p-4">
            <dl>
              <DescriptionListItem title="Contract Hash">{hash}</DescriptionListItem>
              <DescriptionListItem title="Status">{statusData[0].status}</DescriptionListItem>
            </dl>
          </CardContent>
        </Card>

        <ContractValidator hash={hash} initialStatus={statusData[0].status} />
      </main>
    );
  } catch (err) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-4">
        <h1>An error occurred</h1>
        <p>{(err as Error).message}</p>
      </main>
    );
  }
};

export default ContractPage;
