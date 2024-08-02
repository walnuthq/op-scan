type FourByteSignatureResult = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    id: number;
    created_at: string;
    text_signature: string;
    hex_signature: string;
    bytes_signature: string;
  }[];
};

type OpenChainSignatureResult = {
  ok: boolean;
  result: {
    event: Record<string, { name: string; filtered: boolean }[] | null>;
    function: Record<string, { name: string; filtered: boolean }[] | null>;
  };
};

const loadFunctionsFromFourByte = async (selector: string) => {
  if (selector === "0x") {
    return "";
  }
  const response = await fetch(
    `https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=${selector}`,
    {
      cache: "force-cache",
    },
  );
  const json = await response.json();
  const { results } = json as FourByteSignatureResult;
  if (results.length === 0) {
    return "";
  }
  const { text_signature: textSignature } = results[results.length - 1];
  return textSignature;
};

const loadFunctionsFromOpenChain = async (selector: string) => {
  if (selector === "0x") {
    return "";
  }
  const response = await fetch(
    `https://api.openchain.xyz/signature-database/v1/lookup?function=${selector}`,
    {
      cache: "force-cache",
    },
  );
  const json = await response.json();
  const { result } = json as OpenChainSignatureResult;
  const results = result.function[selector];
  if (results === null || results.length === 0) {
    return "";
  }
  const { name } = results[results.length - 1];
  return name;
};

export const loadFunctions = async (selector: string) => {
  if (selector === "0x") {
    return "";
  }
  const fallback = () => {
    try {
      return loadFunctionsFromOpenChain(selector);
    } catch (error) {
      console.error(error);
      return "";
    }
  };
  try {
    const signature = await loadFunctionsFromFourByte(selector);
    if (signature === "") {
      return fallback();
    }
    return signature;
  } catch (error) {
    return fallback();
  }
};

const loadEventsFromFourByte = async (hash: string) => {
  if (hash === "0x") {
    return "";
  }
  const response = await fetch(
    `https://www.4byte.directory/api/v1/event-signatures/?format=json&hex_signature=${hash}`,
    {
      cache: "force-cache",
    },
  );
  const json = await response.json();
  const { results } = json as FourByteSignatureResult;
  if (results.length === 0) {
    return "";
  }
  const { text_signature: textSignature } = results[results.length - 1];
  return textSignature;
};

const loadEventsFromOpenChain = async (hash: string) => {
  if (hash === "0x") {
    return "";
  }
  const response = await fetch(
    `https://api.openchain.xyz/signature-database/v1/lookup?event=${hash}`,
    {
      cache: "force-cache",
    },
  );
  const json = await response.json();
  const { result } = json as OpenChainSignatureResult;
  const results = result.event[hash];
  if (results === null || results.length === 0) {
    return "";
  }
  const { name } = results[results.length - 1];
  return name;
};

export const loadEvents = async (hash: string) => {
  if (hash === "0x") {
    return "";
  }
  const fallback = () => {
    try {
      return loadEventsFromOpenChain(hash);
    } catch (error) {
      console.error(error);
      return "";
    }
  };
  try {
    const signature = await loadEventsFromFourByte(hash);
    if (signature === "") {
      return fallback();
    }
    return signature;
  } catch (error) {
    return fallback();
  }
};
