# 5square meter marketing operations

A real estate marketing portfolio demonstration of context-driven briefs, specialist role handoffs, research review checkpoints and transparent campaign reporting. It provides browser and Python examples with fictional inputs.

## Browser demo

Serve the root directory with Python 3; no installation or account connection is required:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000.

- Select Georgia or UAE, developer or broker audiences, and LinkedIn, blog, Facebook or X.
- Build a draft plan with strategy, research, writing and human-review handoffs.
- Export the plan with UTM parameters as JSON.
- Edit campaign figures to calculate CTR, CPC, CPL and blended CPL.
- Export the report as CSV. Missing denominators stay undefined.

Run the five JavaScript logic tests with Node.js 18+:

```sh
node --test core.test.mjs
```

## Python demo

Python 3.10+, standard library only:

```sh
cd python
python3 content_ops.py plan
python3 content_ops.py report
python3 content_ops.py report --csv
python3 -m unittest -v
```

## Design and contribution

The workflow draws on marketing automation work for **5square meter**, a B2B real estate project. The separate marketing workspace defines specialised Claude Code agents, shared product and audience context, reusable commands and research labels. This demonstration exposes the planning and measurement concepts without distributing internal product specifications or account data.

The implementation uses AI-assisted development. It is a new portfolio demonstration of those concepts, not a copy of the production platform or evidence that all operational integrations are present here.

## Scope

All bundled campaign metrics, examples and results are fictional. The browser demo processes inputs locally and resets them on refresh. It does not invoke AI agents, generate or publish content, upload creatives, collect leads or connect to advertising accounts. Sources supplied with a brief still require review; presence of a URL is not verification.

Actual MCP campaign execution is separate work and is not claimed as a feature of this demo.

## Related project

[5square meter property inventory](https://github.com/parsleykyrie-svg/5square-meter-property-inventory) demonstrates property discovery, price comparison, shortlists and CSV export.
