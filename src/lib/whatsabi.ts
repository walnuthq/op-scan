import { whatsabi } from "@shazow/whatsabi";

const signatureLookup = new whatsabi.loaders.MultiSignatureLookup([
  new whatsabi.loaders.FourByteSignatureLookup(),
  new whatsabi.loaders.OpenChainSignatureLookup(),
]);

export const loadFunctions = async (selector: string) => {
  if (selector === "0x") {
    return "";
  }
  const signatures = await signatureLookup.loadFunctions(selector);
  return signatures.length > 0 ? signatures[0] : "";
};

export const loadEvents = async (hash: string) => {
  if (hash === "0x") {
    return "";
  }
  const events = await signatureLookup.loadEvents(hash);
  return events.length > 0 ? events[0] : "";
};
