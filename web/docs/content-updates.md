# Updating existing content

Run `pnpm update:content` from `web/` to apply the recorded content corrections to
the existing SQLite database named by `DATABASE_URL`. The command reads `.env` when
present and uses the repository’s configured Node.js runtime. Back up the database
before applying updates.

The updater removes Katherine Selby’s team record and marks the PSILOCD study as
complete. Study fields change only when they still match the original imported
text; editor changes and the remaining study details are preserved. Historical
blog posts and uploaded files are unchanged. Repeating the command is safe.

Deployment copies the updater alongside the standalone application and runs it as
the `orchard` service user before restarting the site. It uses
`/srv/orchard/app.env` and resolves relative database paths from `/srv/orchard/app`.
An update failure stops deployment before the restart.

To run it manually on an existing deployment:

```bash
cd /srv/orchard/app
runuser -u orchard -- node --experimental-sqlite --env-file=/srv/orchard/app.env scripts/update-content.mjs
```

The updater requires an existing local `file:` database and runs its changes in a
single transaction. It does not create a database or rebuild collections. Use
`pnpm seed` only when intentionally replacing all database content.
