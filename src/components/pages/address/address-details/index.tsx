import { formatEther as viemFormatEther } from "viem";
import Link from "next/link";
import EthereumIcon from "@/components/lib/ethereum-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress, formatEther, formatPrice } from "@/lib/utils";
import AddressTokenHoldings from "@/components/pages/address/address-details/address-token-holdings";
import { type TokenHoldings } from "@/components/pages/address/address-details/fetch-token-holdings";
import { type AccountWithTransactionAndToken } from "@/lib/types";
import CopyButton from "@/components/lib/copy-button";
import AddressLink from "@/components/lib/address-link";
import ChainBadge from "@/components/lib/chain-badge";

const AddressDetails = ({
  tokenHoldings,
  balance,
  ethPrice,
  account,
}: {
  tokenHoldings: TokenHoldings;
  balance: bigint;
  ethPrice: number;
  account: AccountWithTransactionAndToken;
}) => {
  const isToken =
    account.erc20Token || account.erc721Token || account.erc1155Token;
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-0.5">
            <span className="text-muted-foreground text-xs font-semibold">
              ETH BALANCE
            </span>
            <div className="flex items-center text-sm font-semibold">
              <EthereumIcon className="mr-1 size-4" />
              {formatEther(balance, 18)} ETH
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-muted-foreground text-xs font-semibold">
              ETH VALUE
            </span>
            <div className="flex items-center gap-1 text-sm font-semibold">
              <span>
                {formatPrice(Number(viemFormatEther(balance)) * ethPrice)}
              </span>
              <span className="text-xs">(@{formatPrice(ethPrice)}/ETH)</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-muted-foreground text-xs font-semibold">
              TOKEN HOLDINGS
            </span>
            <div className="flex items-center">
              <AddressTokenHoldings tokenHoldings={tokenHoldings} />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>More Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {account.transaction && (
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-xs font-semibold">
                {account.bytecode ? "CONTRACT CREATOR" : "FUNDED BY"}
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Link
                  href={`/address/${account.transaction.from}`}
                  className="text-primary text-nowrap hover:brightness-150"
                >
                  {formatAddress(account.transaction.from)}
                </Link>
                <CopyButton
                  content="Copy Address"
                  copy={account.transaction.from}
                />
                <span className="text-nowrap">at txn</span>
                <Link
                  href={`/tx/${account.transactionHash}`}
                  className="text-primary max-w-40 truncate hover:brightness-150"
                >
                  {account.transactionHash}
                </Link>
              </div>
            </div>
          )}
          {isToken && (
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-xs font-semibold">
                TOKEN TRACKER
              </span>
              <div className="flex items-center text-sm font-semibold">
                {account.erc20Token && (
                  <Link
                    href={`/address/${account.erc20Token.address}`}
                    className="text-primary hover:brightness-150"
                  >
                    {account.erc20Token.name} ({account.erc20Token.symbol})
                  </Link>
                )}
                {account.erc721Token && (
                  <Link
                    href={`/address/${account.erc721Token.address}`}
                    className="text-primary hover:brightness-150"
                  >
                    {account.erc721Token.name} ({account.erc721Token.symbol})
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Superchain Info</CardTitle>
        </CardHeader>
        {account.accounts && account.accounts.length > 0 && (
          <CardContent className="space-y-4">
            <p>
              {account.accounts.length} other address
              {account.accounts.length === 1 ? "" : "es"} found on the
              Superchain
            </p>
            <ul>
              {account.accounts.map((account) => (
                <li
                  key={account.rollupConfig.l2ChainId}
                  className="flex items-center gap-1"
                >
                  <ChainBadge name={account.rollupConfig.l2ChainName} />
                  <AddressLink
                    formatted
                    address={account.address}
                    href={`${account.rollupConfig.l2ChainBlockExplorerUrl}/address/${account.address}`}
                  />
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AddressDetails;
