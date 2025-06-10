import fs from "fs";

const file = "activeTokens.json";

export function loadActiveTokens(): Record<string, string> {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  const data = fs.readFileSync(file, "utf8").trim();
  return data ? JSON.parse(data) : {};
}

export function removeActiveTokens() {
  fs.writeFileSync(file, "{}");
}

export function saveActiveTokens(tokens: Record<string, string>) {
  fs.writeFileSync(file, JSON.stringify(tokens, null, 2));
}

export function getActiveToken(userId: number): string | undefined {
  return loadActiveTokens()[userId];
}

export function setActiveToken(userId: number, token: string) {
  const tokens = loadActiveTokens();
  tokens[userId] = token;
  saveActiveTokens(tokens);
}

export function removeActiveToken(userId: number) {
  const tokens = loadActiveTokens();
  delete tokens[userId];
  saveActiveTokens(tokens);
}
