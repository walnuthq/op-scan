export interface DecodedArgs {
  function: string;
  topics: string[];
  data: string;
  decoded: { hex: string; number: string; address: string }[];
}

export interface FormattedLog {
  eventName: string;
  method: string;
  args: DecodedArgs;
  transactionHash: string;
  blockNumber: bigint;
  timestamp: {
    distance: string;
    utc: string;
    utcWithTz: string;
    originalTimestamp: bigint;
  };
}

export interface ABIEventExtended {
  type: string;
  hash: string;
  inputs?: any[];
}
