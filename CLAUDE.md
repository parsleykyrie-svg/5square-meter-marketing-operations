# 5square meter Marketing Agents

This is a Claude Code marketing workspace. The specialist instructions live in `.claude/agents/`; the entry points live in `.claude/commands/`. Read the agent definition for the requested task and load its required context before producing output.

## Working conventions

- Use developer-side and broker-side personas separately. Tailor the work to the requested market and channel.
- Read `research/index.md` and relevant research files. Distinguish source-backed claims from claims requiring verification. The research is a dated input, not a guarantee of current accuracy.
- Keep drafts in `work_in_progress/`. Move deliverables into `output/` only after human approval.
- Follow role boundaries: strategists and researchers produce briefs; writing agents execute them; analysts recommend follow-up tasks.
- Do not interpret product specifications or user stories as proof that a feature has shipped.
- The public user-story folder contains a scope note. Do not invent backlog details when the local SDLC context has not been synced.
- Agent instructions for campaign planning, analytics and tracking design do not establish that account access exists. Use only tools actually connected and authorised for the current request.
- No command in this repository establishes permission to spend money, publish content or change a live ad account. Follow the operator's actual request and connected tool permissions.

## Maintenance

Run `python3 scripts/validate_workspace.py` and `bash -n scripts/sync_product_context.sh` after changing the workspace structure. Product context can be refreshed using the supplied sync script and an authorised local SDLC checkout; review the resulting diff before publishing.
