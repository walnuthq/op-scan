export const getSignatureBySelector = async (selector: string) => {
  const response = await fetch(
    `https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=${selector}`,
    { cache: "force-cache" },
  );
  const json = await response.json();
  const results = json.results as { id: number; text_signature: string }[];
  if (results.length === 0) {
    return "";
  }
  const [{ text_signature: textSignature }] = results.sort(
    (a, b) => a.id - b.id,
  );
  return textSignature;
};
