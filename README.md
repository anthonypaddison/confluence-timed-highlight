# Timed Highlight for Confluence

A self-deployed Confluence Cloud macro that highlights plain text through an expiry date, then displays it normally.

## What it does

Insert **Timed Highlight** while editing a Confluence page, enter text and an expiry date, then publish the page. The highlight and `New until DATE` cue remain through that date in the viewer's timezone. Subsequent renders leave the text without emphasis.

Plain text only: no rich formatting, links, mentions, inline code or conversion of selected page content. Expiry is evaluated on render; an already-open page needs a refresh after the date changes. Invalid dates or timezones fail to ordinary text. There are no timers or notifications.

## Architecture and permissions

Forge UI Kit, native inline macro, Node.js 24 runtime. `useConfig()` reads the macro's text/date; `useProductContext()` supplies locale/timezone. There are no app backend functions, resolver, remote, Forge Storage, external datastore, REST calls, events, scheduled triggers or external egress.

```yaml
permissions:
  scopes: []
```

## Privacy

Text and expiry date remain in the macro's Confluence page configuration, which can also remain in page history. Treat configuration as ordinary page content, not a secret store. The app has no application logging, analytics or external service. Confluence/Forge permissions and platform data handling still apply; this is an architectural description, not a compliance certification.

## Setup: register and deploy your own copy

Prerequisites: Node.js **24.x**, its bundled npm, a supported [Forge CLI](https://developer.atlassian.com/platform/forge/getting-started/), your own Atlassian developer account/Developer Space and a Confluence Cloud development site where you can install apps. Atlassian's current CLI supports Node 22/24; this repository targets 24.

1. Fork this repository and clone your fork (or clone this repository to work locally):

   ```sh
   git clone https://github.com/anthonypaddison/confluence-timed-highlight.git
   cd confluence-timed-highlight
   npm ci --ignore-scripts
   npm test
   ```

2. Install the CLI if needed with `npm install -g @forge/cli`. Run `forge login` and `forge whoami` using **your own** account. Never put tokens in this repository. Review any provider terms/billing prompts yourself; this project does not require buying a service.

3. Register **your copy once**:

   ```sh
   forge developer-spaces list --json
   forge register --developer-space-id YOUR_DEVELOPER_SPACE_ID "My Timed Highlight"
   ```

   The ID currently in `manifest.yml` is a non-secret reference identity, **not an app you should deploy or install**. Registration must replace it with your own app ARI. Read back the manifest and confirm it differs from `a58a3f46-cb40-451d-bb9f-987fc5cb29af` before continuing. Do not run registration again after success: [re-registering creates a new identity](https://developer.atlassian.com/platform/forge/cli-reference/register/) and disconnects this checkout from its previous environments/settings. Do not commit credentials.

4. Validate, then deploy/install only to your own development site:

   ```sh
   forge lint
   forge deploy --environment development
   forge install --environment development --site YOUR_SITE.atlassian.net --product confluence
   ```

5. On a disposable page, check insertion/configuration, editing, an expiry date in the future and one in the past. Refresh the page to re-evaluate expiry. Subsequent changes use `forge deploy --environment development`; use `forge install --upgrade` with the same environment/site/product when an installation upgrade is required. Do not register again.

There is no paid Marketplace licence check, hosted service or shared installation link. You own your fork, Forge app and platform usage. Stay within your provider's free limits; no free-hosting guarantee is made.

## Local checks

```sh
npm test
npm run lint:forge
npm audit
```

The tests cover inclusive expiry, invalid dates, timezone boundaries and date labels. See [dependency notes](docs/dependencies.md) for the understood moderate advisory and dependency licence boundaries.

## Screenshots

Old Marketplace captures are not included. Use the short development-site checks above to view your own installation.

## Status and maintenance

Open-source reference implementation. No commercial Marketplace listing is maintained.

Originally developed as a Caffeine & Cashflow Forge utility. Commercial Marketplace publication was discontinued and the source is now provided as an open-source reference implementation.

This project is provided as-is. There is no guaranteed support, maintenance schedule, SLA or feature roadmap. Forks are welcome; pull requests may be reviewed at the owner's discretion, without a response or merge commitment. Issues are disabled to avoid implying a support service.

This is an independent project, not an official Atlassian product or an endorsement by Atlassian.

## Licence

Original project source and documentation: [MIT](LICENSE), copyright Anthony Paddison. Dependencies remain under their own licences, including Atlassian Developer Terms for the Forge SDK; they are not relicensed as MIT. No SDK code, third-party artwork or fonts are vendored here.
