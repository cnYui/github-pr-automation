#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
from datetime import datetime, timedelta, timezone
from urllib.parse import quote
from urllib.request import Request, urlopen

DEFAULT_QUERIES = [
    'topic:agent archived:false stars:>50',
    'topic:mcp archived:false stars:>50',
    'topic:cli archived:false stars:>50',
    'topic:developer-tools archived:false stars:>50',
    '"model context protocol" archived:false stars:>50',
]


def request_json(url: str, token: str):
    request = Request(
        url,
        headers={
            'Accept': 'application/vnd.github+json',
            'Authorization': f'Bearer {token}',
            'X-GitHub-Api-Version': '2022-11-28',
        },
    )
    with urlopen(request) as response:
        return json.load(response)


def recent_pushed_after() -> str:
    return (datetime.now(timezone.utc) - timedelta(days=180)).date().isoformat()


def resolve_github_token() -> str:
    environment_token = os.environ.get('GH_TOKEN') or os.environ.get('GITHUB_TOKEN')
    if environment_token:
        return environment_token.strip()

    try:
        result = subprocess.run(
            ['gh', 'auth', 'token'],
            capture_output=True,
            check=True,
            text=True,
        )
    except (FileNotFoundError, subprocess.CalledProcessError):
        raise SystemExit(
            '缺少 GitHub 认证，请设置 GH_TOKEN、GITHUB_TOKEN 或先执行 gh auth login'
        ) from None

    token = result.stdout.strip()
    if not token:
        raise SystemExit('gh auth token 未返回可用认证')
    return token


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--limit', type=int, default=10)
    parser.add_argument('--format', choices=['json', 'markdown'], default='markdown')
    parser.add_argument('--language', action='append', default=[])
    args = parser.parse_args()

    token = resolve_github_token()

    pushed_after = recent_pushed_after()
    languages = args.language or [None]
    seen = {}

    for raw_query in DEFAULT_QUERIES:
        for language in languages:
            language_suffix = f' language:{language}' if language else ''
            search_query = f'{raw_query}{language_suffix} pushed:>={pushed_after}'
            query = quote(search_query)
            data = request_json(
                f'https://api.github.com/search/repositories?q={query}&sort=stars&order=desc&per_page={args.limit}',
                token,
            )

            for item in data.get('items', []):
                seen[item['full_name']] = {
                    'full_name': item['full_name'],
                    'url': item['html_url'],
                    'language': item['language'],
                    'stars': item['stargazers_count'],
                    'pushed_at': item['pushed_at'],
                }

    rows = list(seen.values())[: args.limit]
    if args.format == 'json':
        print(json.dumps(rows, ensure_ascii=False, indent=2))
        return

    for index, row in enumerate(rows, start=1):
        print(
            f"{index}. {row['full_name']} | {row['language']} | "
            f"stars={row['stars']} | pushed={row['pushed_at']}"
        )


if __name__ == '__main__':
    main()
