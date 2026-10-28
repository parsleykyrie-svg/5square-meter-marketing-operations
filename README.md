# 5square meter Marketing Agents

**A Claude Code marketing agent workspace for 5square meter, a B2B real estate platform connecting property developers and brokers.**

This repository contains the actual agent definitions, slash commands and product-context synchronisation script for the Marketing-Agents workspace. The marketing system is configured through Markdown instructions loaded by Claude Code; it is not a browser dashboard or a standalone Python agent runtime.

## Start here

1. Clone this repository and open the folder in Claude Code.
2. Read `CLAUDE.md` for the workspace map and operating conventions.
3. Start with a slash command, for example:

```text
/mkt-strategy build a 4-week content calendar for developer-side Georgia
/mkt-seo write an SEO brief about broker commission disputes in Georgia
/mkt-linkedin create a research-backed post for the Georgia page
/mkt-paid write a Meta Ads brief for broker-side Georgia
/mkt-analyze review this campaign performance: [paste your data]
```

Claude Code runs the named specialist using its agent definition and the context files specified there. Where a command asks for a tool unavailable in your Claude Code configuration, enable the appropriate tool before running the task. Generated drafts and analytics are only as reliable as the supplied evidence and human review.

## The actual agents

| Agent definition | Responsibility | Command |
| --- | --- | --- |
| [content-strategist](.claude/agents/content-strategist.md) | Calendars, campaign briefs, topic clusters and assignments | `/mkt-strategy` |
| [seo-researcher](.claude/agents/seo-researcher.md) | Keyword research, search intent, content gaps and SEO briefs | `/mkt-seo` |
| [copywriter](.claude/agents/copywriter.md) | Emails, articles, landing pages, ads and press releases from briefs | `/mkt-copy` |
| [linkedin-content](.claude/agents/linkedin-content.md) | Posts, carousels, polls, calendars and comment drafts | `/mkt-linkedin` |
| [social-media](.claude/agents/social-media.md) | X and Facebook content, adaptations and engagement drafts | `/mkt-social` |
| [media-buyer](.claude/agents/media-buyer.md) | Campaign planning, audience targeting, budgets and performance reviews | `/mkt-paid` |
| [campaign-analyst](.claude/agents/campaign-analyst.md) | Analyse supplied performance exports and recommend changes | `/mkt-analyze` |
| [ga-expert](.claude/agents/ga-expert.md) | GA4 measurement plans, events, audiences and reporting | `/mkt-ga` |
| [gtm-expert](.claude/agents/gtm-expert.md) | Tag, trigger, variable and data-layer implementation specifications | `/mkt-gtm` |
| [website-optimiser](.claude/agents/website-optimiser.md) | Landing-page audits, funnel analysis and experiment briefs | `/mkt-cro` |

All ten corresponding command files are in [`.claude/commands/`](.claude/commands/).

## How the workflow connects

The agents load shared product, brand, audience and research context. This public copy provides context notes; internal product specifications and the private research collection are excluded. The strategist defines briefs and assignments. SEO research supplies a brief to the copywriter; the LinkedIn and social agents produce channel-specific drafts. The website optimiser can brief the copywriter. The analyst reviews human-supplied campaign data and recommends work for the relevant specialist.

These are instruction-defined handoffs, not an automatic scheduler that executes every role in sequence. The operator invokes commands, supplies data and reviews outputs. The public research index starts without pre-verified claims; factual and legal claims require current primary-source checks before publication. Product specs describe intended behaviour and are not proof of deployed features.

## Files and scripts

| Path | Purpose |
| --- | --- |
| `.claude/agents/` | Original ten specialist definitions |
| `.claude/commands/` | Original ten slash commands that invoke the specialists |
| `context/product/` | Public product context and topic map |
| `context/brand.md` | Voice, messaging and language conventions |
| `context/personas.md` | Separate developer-side and broker-side personas |
| `context/channels.md` | Channel configuration; active-channel table is not yet populated |
| `research/` | Research index and source-review guidance |
| `scripts/sync_product_context.sh` | Copy product context and approved user stories from a local SDLC checkout |
| `scripts/validate_workspace.py` | Added structural checks for commands, agents and context dependencies |
| `work_in_progress/` | Local campaign drafts, briefs and reports; generated files are ignored |
| `output/` | Locally approved deliverables; generated files are ignored |

Sync product context when an authorised local SDLC checkout is available:

```sh
bash scripts/sync_product_context.sh /path/to/SDLC
```

The sync script copies files; it does not fetch a private repository, update a deployed product or invoke an agent. Review the local changes before committing. The detailed user-story backlog is deliberately excluded from this public copy and can be synced locally.

Validate the workspace without credentials or model calls:

```sh
python3 scripts/validate_workspace.py
bash -n scripts/sync_product_context.sh
```

## MCP and campaign execution

The author's operational work includes Google Ads and Meta Ads campaign execution through separately authorised MCP-connected tools. This uploaded workspace contains planning and analysis instructions, not a bundled, authenticated campaign executor. In particular, the analyst consumes data supplied by the operator. No MCP credentials, private account configuration, scheduled publishing service or live advertising integration is distributed here.

## Workspace maintenance

The project name is **5square meter**. The ten specialist definitions, ten commands and context-sync script form the core workspace. The operating guide and structural validator document the structure and check its dependencies.
