import { formatEther as viemFormatEther } from "viem";
import Link from "next/link";
import EthereumIcon from "@/components/lib/ethereum-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress, formatEther, formatPrice } from "@/lib/utils";
import AddressTokenHoldings from "@/components/pages/address/address-details/address-token-holdings";
import { TokenHoldings } from "@/components/pages/address/address-details/fetch-token-holdings";
import { AccountWithTransactionAndToken } from "@/lib/types";
import CopyButton from "@/components/lib/copy-button";

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
            <span className="text-xs font-semibold text-muted-foreground">
              ETH BALANCE
            </span>
            <div className="flex items-center text-sm font-semibold">
              <EthereumIcon className="mr-1 size-4" />
              {formatEther(balance, 18)} ETH
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-muted-foreground">
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
            <span className="text-xs font-semibold text-muted-foreground">
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
              <span className="text-xs font-semibold text-muted-foreground">
                {account.bytecode ? "CONTRACT CREATOR" : "FUNDED BY"}
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Link
                  href={`/address/${account.transaction.from}`}
                  className="text-nowrap text-primary hover:brightness-150"
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
                  className="max-w-40 truncate text-primary hover:brightness-150"
                >
                  {account.transactionHash}
                </Link>
              </div>
            </div>
          )}
          {isToken && (
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-muted-foreground">
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
          <CardTitle>Multichain Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4"></CardContent>
      </Card>
    </div>
  );
};

export default AddressDetails;
