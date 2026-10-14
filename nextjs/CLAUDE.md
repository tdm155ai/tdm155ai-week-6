@AGENTS.md

# TDM 155AI week 6: the app

A Next app that renders the Markdown in `content/` (its README is the home page; `content/a/b.md` is `/a/b`) (`lib/content.mjs`). `/readings` (`app/readings/`) shows `content/readings/` as a docs site: every document in a sidebar, the one you pick beside it, no previous/next pager. `/concepts` (`app/concepts/`) shows `content/concepts/` in two levels: the sidebar lists the categories (its folders), then, inside one, only that category's concepts. Both share `app/components/DocsSidebar.jsx`. `/dictate` (`lib/dictate.mjs`, `app/api/dictate/`) and `/transcribe` (`lib/photos.mjs`, `app/api/transcribe/`) write notes to `content/notebook/` using models on OpenRouter; recordings and photographs stay in the gitignored `_media/`. `/graphics` and a light `/print` came with the copy. See the repo `README.md`.

Keep keys in `.env.local` (gitignored). When it has no `OPENROUTER_API_KEY`, the two capture pages ask for the user's own key (`app/components/ApiKeyField.jsx`), which is kept in the browser and sent per request in the `X-OpenRouter-Key` header; never save or log it on the server.
