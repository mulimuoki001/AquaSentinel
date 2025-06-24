import fs from "fs";

const file = "activeTokens.json";

export function loadActiveTokens(): Record<
  string,
  { token: string; expirationTime: number }
> {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  const data = fs.readFileSync(file, "utf8").trim();
  return data ? JSON.parse(data) : {};
}

export function saveActiveTokens(tokens: any) {
  fs.writeFileSync(file, JSON.stringify(tokens, null, 2));
}
export function removeActiveTokens() {
  fs.writeFileSync(file, "{}");
}

export function getActiveToken(userId: number): string | undefined {
  const tokens = loadActiveTokens();
  return tokens[userId]?.token;
}

export function setActiveToken(
  userId: number,
  token: string,
  expirationTime: number
) {
  const tokens = loadActiveTokens();
  tokens[userId] = { token, expirationTime };
  saveActiveTokens(tokens);
}
export function removeActiveToken(token: string) {
  const tokens = loadActiveTokens();
  const key = Object.keys(tokens).find((key) => tokens[key].token === token);
  if (key) {
    delete tokens[key];
    saveActiveTokens(tokens);
  } else {
    console.log("Token not found");
  }
}
