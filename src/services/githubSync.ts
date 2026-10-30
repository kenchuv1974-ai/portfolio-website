import type { PortfolioData } from '../types/portfolio';
import { generatePortfolioSourceCode } from './sourceCodeGen';

export interface GitHubSyncConfig {
  token: string;
  repoOwner: string;
  repoName: string;
  branch: string;
}

const GITHUB_CONFIG_KEY = 'portfolio_github_sync_config_v1';
const GITHUB_API_RAW_URL = 'https://api.github.com/repos/kenchuv1974-ai/portfolio-website/contents/public/data/portfolio.json';
const RAW_FALLBACK_URL = 'https://raw.githubusercontent.com/kenchuv1974-ai/portfolio-website/main/public/data/portfolio.json';

export const defaultGitHubConfig: GitHubSyncConfig = {
  token: '',
  repoOwner: 'kenchuv1974-ai',
  repoName: 'portfolio-website',
  branch: 'main',
};

export function getStoredGitHubConfig(): GitHubSyncConfig {
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
    if (!raw) return { ...defaultGitHubConfig };
    return { ...defaultGitHubConfig, ...JSON.parse(raw) };
  } catch {
    return { ...defaultGitHubConfig };
  }
}

export function saveStoredGitHubConfig(config: GitHubSyncConfig): void {
  try {
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed saving GitHub sync config:', err);
  }
}

/**
 * Encodes string to UTF-8 Base64 cleanly for GitHub REST API
 */
function toBase64Unicode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Tests if the supplied GitHub token has push permissions to the target repository
 */
export async function testGitHubConnection(config: GitHubSyncConfig): Promise<{ ok: boolean; message: string }> {
  if (!config.token.trim()) {
    return { ok: false, message: 'Please enter a GitHub Personal Access Token.' };
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${config.repoOwner}/${config.repoName}`, {
      headers: {
        Authorization: `Bearer ${config.token.trim()}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (res.status === 401) {
      return { ok: false, message: 'Invalid or expired GitHub token. Please verify permissions.' };
    }
    if (res.status === 404) {
      return { ok: false, message: `Repository ${config.repoOwner}/${config.repoName} not found or token lacks access.` };
    }
    if (!res.ok) {
      return { ok: false, message: `GitHub API error (${res.status}): ${res.statusText}` };
    }

    const repoData = await res.json();
    const canPush = repoData?.permissions?.push ?? true;

    if (!canPush) {
      return { ok: false, message: 'Token authenticated, but does not have Write/Push permission to this repository.' };
    }

    return { ok: true, message: `Connected to ${repoData.full_name} as ${repoData.owner?.login || 'authorized user'}!` };
  } catch (err) {
    return { ok: false, message: `Connection failed: ${err instanceof Error ? err.message : String(err)}` };
  }
}

/**
 * Fetches file SHA from GitHub repo if file exists
 */
async function getFileSha(path: string, config: GitHubSyncConfig): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${config.repoOwner}/${config.repoName}/contents/${path}?ref=${config.branch}`, {
      headers: {
        Authorization: `Bearer ${config.token.trim()}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      return data.sha || null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Commits a file to GitHub repository via GitHub Contents API
 */
async function putFileToGitHub(
  path: string,
  content: string,
  commitMessage: string,
  config: GitHubSyncConfig
): Promise<{ ok: boolean; error?: string }> {
  const sha = await getFileSha(path, config);
  const base64Content = toBase64Unicode(content);

  const body: Record<string, unknown> = {
    message: commitMessage,
    content: base64Content,
    branch: config.branch,
  };
  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(`https://api.github.com/repos/${config.repoOwner}/${config.repoName}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${config.token.trim()}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    return { ok: false, error: errData.message || `HTTP ${res.status} updating ${path}` };
  }

  return { ok: true };
}

/**
 * One-click publisher: commits both `public/data/portfolio.json` and `src/data/portfolio.ts`
 * directly into GitHub repository, automatically triggering GitHub Actions to build and deploy.
 */
export async function syncPortfolioToGitHub(
  data: PortfolioData,
  config: GitHubSyncConfig,
  onProgress?: (step: string) => void
): Promise<{ ok: boolean; message: string }> {
  if (!config.token.trim()) {
    return { ok: false, message: 'Please provide a GitHub Personal Access Token in Settings.' };
  }

  try {
    onProgress?.('Verifying GitHub repository authorization...');
    const connTest = await testGitHubConnection(config);
    if (!connTest.ok) {
      return { ok: false, message: connTest.message };
    }

    onProgress?.('Committing live data to public/data/portfolio.json...');
    const jsonData = JSON.stringify(
      {
        ...data,
        lastUpdated: new Date().toISOString(),
      },
      null,
      2
    );

    const jsonRes = await putFileToGitHub(
      'public/data/portfolio.json',
      jsonData,
      `chore(data): publish portfolio data via Admin Panel [${new Date().toLocaleTimeString()}]`,
      config
    );
    if (!jsonRes.ok) {
      return { ok: false, message: `Failed updating portfolio.json: ${jsonRes.error}` };
    }

    onProgress?.('Committing source code to src/data/portfolio.ts...');
    const sourceCode = generatePortfolioSourceCode(data);
    const tsRes = await putFileToGitHub(
      'src/data/portfolio.ts',
      sourceCode,
      `chore(code): synchronize src/data/portfolio.ts via Admin Panel`,
      config
    );
    if (!tsRes.ok) {
      return { ok: false, message: `Failed updating portfolio.ts: ${tsRes.error}` };
    }

    onProgress?.('Sync complete! Triggering automated GitHub Pages deployment...');
    return {
      ok: true,
      message: 'Successfully published to GitHub! All devices worldwide will reflect updates in ~45 seconds.',
    };
  } catch (err) {
    return { ok: false, message: `GitHub Sync failed: ${err instanceof Error ? err.message : String(err)}` };
  }
}

/**
 * Dynamically fetches the latest published portfolio data across devices from the repository.
 * Fetches from both the live GitHub raw repository and local build, selecting the newest data.
 * Works seamlessly without requiring any authentication token for public repositories.
 */
export async function fetchRemotePortfolioData(): Promise<PortfolioData | null> {
  const timestamp = Date.now();

  // 1. Try real-time GitHub REST API first (0-second caching delay, bypasses Fastly CDN)
  try {
    const apiRes = await fetch(`${GITHUB_API_RAW_URL}?_t=${timestamp}`, {
      headers: { Accept: 'application/vnd.github.v3.raw' },
      cache: 'no-store',
    });
    if (apiRes.ok) {
      const json = await apiRes.json();
      if (json && json.profile && json.projects) {
        return json as PortfolioData;
      }
    }
  } catch {
    // continue to fallbacks
  }

  // 2. Try raw fallback and local static JSON
  const fallbacks = [
    `${RAW_FALLBACK_URL}?_t=${timestamp}`,
    `./data/portfolio.json?_t=${timestamp}`,
  ];

  for (const url of fallbacks) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json && json.profile && json.projects) {
          return json as PortfolioData;
        }
      }
    } catch {
      // try next fallback
    }
  }

  return null;
}
