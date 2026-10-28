"""Validate the workspace structure without invoking models or account tools."""
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
agents = {p.stem: p for p in (root / '.claude/agents').glob('*.md')}
commands = list((root / '.claude/commands').glob('*.md'))
errors = []
if len(agents) != 10 or len(commands) != 10:
    errors.append(f'Expected 10 agents and 10 commands, got {len(agents)} and {len(commands)}')
for path in commands:
    match = re.search(r'Invoke the `([^`]+)` agent', path.read_text())
    if not match or match[1] not in agents:
        errors.append(f'{path.name}: missing agent target')
for name, path in agents.items():
    text = path.read_text()
    if not re.search(rf'^name: {re.escape(name)}$', text, re.M):
        errors.append(f'{name}: frontmatter name does not match filename')
    for relative in re.findall(r'(?<![\w/])(?:context|research)/[A-Za-z0-9_./-]+\.md', text):
        if not (root / relative).is_file():
            errors.append(f'{name}: missing required context {relative}')
for relative in ['context/product/project_idea.md','context/product/business_logic.md',
                 'context/product/service_mapping.md','scripts/sync_product_context.sh',
                 'work_in_progress','output']:
    if not (root / relative).exists():
        errors.append(f'Missing workspace path {relative}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'Validated {len(agents)} original agents, {len(commands)} commands and required context paths.')
