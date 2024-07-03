export const getSignatureBySelector = async (selector: string) => {
  if (selector === "0x") {
    return null;
  }
  try {
    const response = await fetch(
      `https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=${selector}`,
      { cache: "force-cache" },
    );
    const json = await response.json();
    const results = json.results as { id: number; text_signature: string }[];
    if (results.length === 0) {
      return null;
    }
    const [{ text_signature: textSignature }] = results.sort(
      (a, b) => a.id - b.id,
    );
    return textSignature;
  } catch (error) {
    console.error(error);
    return null;
  }
};
