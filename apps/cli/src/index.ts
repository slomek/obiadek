#!/usr/bin/env node

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const API_URL = process.env.OBIADEK_API_URL ?? 'http://localhost:3001';
const USERNAME = process.env.OBIADEK_USERNAME;
const PASSWORD = process.env.OBIADEK_PASSWORD;

const CONFIG_DIR = join(homedir(), '.config', 'obiadek');
const TOKEN_FILE = join(CONFIG_DIR, 'token.json');

interface TokenCache {
  token: string;
  expiresAt: number;
}

function readCachedToken(): string | null {
  if (!existsSync(TOKEN_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(TOKEN_FILE, 'utf-8')) as TokenCache;
    // Require at least 1 minute left before expiry
    if (Date.now() < data.expiresAt - 60_000) return data.token;
    return null;
  } catch {
    return null;
  }
}

function saveToken(token: string): void {
  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString()) as { exp: number };
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(TOKEN_FILE, JSON.stringify({ token, expiresAt: payload.exp * 1000 }));
}

async function login(): Promise<string> {
  if (!USERNAME || !PASSWORD) {
    console.error(
      'Error: OBIADEK_USERNAME and OBIADEK_PASSWORD environment variables must be set'
    );
    process.exit(1);
  }

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  if (!res.ok) {
    const err = (await res.json()) as { error: string };
    console.error(`Login failed: ${err.error}`);
    process.exit(1);
  }

  const { token } = (await res.json()) as { token: string };
  saveToken(token);
  return token;
}

async function getToken(): Promise<string> {
  return readCachedToken() ?? login();
}

async function fetchGroceryDescription(token: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/trello/grocery-description`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    // Cached token was rejected — force a fresh login and retry once
    const freshToken = await login();
    const retry = await fetch(`${API_URL}/api/trello/grocery-description`, {
      headers: { Authorization: `Bearer ${freshToken}` },
    });
    if (!retry.ok) {
      const err = (await retry.json()) as { error: string };
      console.error(`Failed to fetch groceries: ${err.error}`);
      process.exit(1);
    }
    const { description } = (await retry.json()) as { description: string };
    return description;
  }

  if (!res.ok) {
    const err = (await res.json()) as { error: string };
    console.error(`Failed to fetch groceries: ${err.error}`);
    process.exit(1);
  }

  const { description } = (await res.json()) as { description: string };
  return description;
}

async function main(): Promise<void> {
  const token = await getToken();
  const description = await fetchGroceryDescription(token);

  const { default: clipboardy } = await import('clipboardy');
  await clipboardy.write(description);

  console.log('Grocery list copied to clipboard!');
}

main().catch((err: unknown) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
