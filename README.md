# Peer Collaboration Project

This project is a Vite + React single-page application and can be deployed on Render as a static site.

## Local development

```bash
npm install
npm run dev
```

## Render deployment

1. Push this repository to GitHub.
2. In Render, create a new `Static Site`.
3. Connect the GitHub repository.
4. Use these settings if Render does not auto-detect `render.yaml`:

```text
Build Command: npm install && npm run build
Publish Directory: dist
```

5. Deploy the site.

`render.yaml` already includes an SPA rewrite so routes like `/login`, `/student`, and `/admin` work after refresh.

## Notes

- The current repository contains a frontend-only mock application.
- Authentication and data are stored in in-memory mock objects, so data resets after a page refresh.
