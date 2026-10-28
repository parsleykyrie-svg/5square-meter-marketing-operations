"""Offline real estate content planning and campaign reporting demo.

Uses only fictional fixtures. No ad accounts, publishing or model calls.
"""
import argparse
import csv
import io
import json
from pathlib import Path
from urllib.parse import urlencode


def build_plan(data):
    """Route research briefs to the appropriate specialist, with review gates."""
    out = []
    for item in data['briefs']:
        if item['audience'] not in ('developer', 'broker'):
            raise ValueError('Each brief must identify developer or broker audience')
        if item['market'] not in ('Georgia', 'UAE'):
            raise ValueError('Unsupported market')
        if item['channel'] not in ('linkedin', 'blog', 'facebook', 'x'):
            raise ValueError('Unsupported channel')
        writer = {'linkedin': 'linkedin-content', 'blog': 'copywriter',
                  'facebook': 'social-media', 'x': 'social-media'}[item['channel']]
        sources = item.get('sources', [])
        if not isinstance(sources, list):
            raise ValueError('Sources must be a list')
        out.append({
            'id': item['id'], 'topic': item['topic'], 'market': item['market'],
            'audience': item['audience'], 'channel': item['channel'],
            'handoff': ['content-strategist', 'seo-researcher', writer, 'human-review'],
            'research_status': 'sources-supplied-review-required' if sources else 'research-needed',
            'publication_status': 'draft',
            'languages': ['English', 'Georgian'] if item['market'] == 'Georgia' else ['English'],
            'utm_query': urlencode({'utm_source': item['channel'], 'utm_medium': 'content',
                                     'utm_campaign': item['id'], 'utm_content': item['audience']}),
        })
    return out


def campaign_report(data):
    """Calculate observed demo metrics; missing denominators stay undefined."""
    out = []
    for row in data['campaigns']:
        for key in ('spend', 'impressions', 'clicks', 'leads'):
            if not isinstance(row[key], (int, float)) or isinstance(row[key], bool) or row[key] < 0:
                raise ValueError(f'{key} must be a non-negative number')
        if row['clicks'] > row['impressions']:
            raise ValueError('Clicks cannot exceed impressions in this demo dataset')
        out.append({**row,
                    'ctr_percent': round(row['clicks']/row['impressions']*100, 2) if row['impressions'] else None,
                    'cpc_usd': round(row['spend']/row['clicks'], 2) if row['clicks'] else None,
                    'cpl_usd': round(row['spend']/row['leads'], 2) if row['leads'] else None})
    return out


def csv_report(rows):
    stream = io.StringIO(newline='')
    if not rows:
        return ''
    writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
    writer.writeheader()
    for row in rows:
        writer.writerow({k: ("'"+v if isinstance(v, str) and v.startswith(('=', '+', '-', '@')) else v)
                         for k, v in row.items()})
    return stream.getvalue()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['plan', 'report'])
    parser.add_argument('--input', type=Path, default=Path(__file__).with_name('demo.json'))
    parser.add_argument('--csv', action='store_true', help='Campaign report as CSV')
    args = parser.parse_args()
    if args.csv and args.command != 'report':
        parser.error('--csv is only supported for report')
    try:
        data = json.loads(args.input.read_text())
        result = build_plan(data) if args.command == 'plan' else campaign_report(data)
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.exit(2, f'Input error: {error}\n')
    print(csv_report(result) if args.csv else json.dumps(result, indent=2), end='\n')


if __name__ == '__main__':
    main()
