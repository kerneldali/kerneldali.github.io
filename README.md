# Dali's blog

A personal technical blog built with [Hexo](https://hexo.io) and a customized
[Pure](https://github.com/renbaoshuo/hexo-theme-pure) theme, styled after
[eversinc33.com](https://eversinc33.com) (dark neon, post-row index, typing navbar).

Topics: reverse engineering, networking, web security and cloud security.

The first entry, **Reading a VMProtect Virtualized Function: From Entry Stub to VM Exit**,
is a full walkthrough of a VMProtect 3.9.4 virtualized function with interactive assembly labs.

## Requirements

- Node.js 18+ (CI uses 20)
- npm

## Quick start

```bash
npm install
npm run server      # http://localhost:4000
```

Build the static site into `public/`:

```bash
npm run build
```

## Project structure

```
_config.yml                 Site config (title, url, permalink, theme)
scripts/ci-config.js        Lets CI override url/root via env vars
bundle.cjs                  Exports the study post as one self-contained HTML file
themes/pure/
  _config.yml               Logo, typed strings, menus, footer
  layout/
    layout.ejs              Generic page shell (navbar + body + footer)
    index.ejs               Home post list
    post.ejs                Post page (title, meta, contents, next/prev)
    about.ejs               About page
    archive.ejs, tag.ejs, tags.ejs
    _includes/
      head.ejs              <head>, fonts, stylesheets (study assets only on study posts)
      navbar.ejs            Logo, typing effect, icon nav buttons
      footer.ejs            Footer, back-to-top, study scripts
source/
  _posts/inside-the-vm.html The VMProtect article (front-matter flag: study: true)
  about/index.md            About page content
  tags/index.md             Tags index
  css/theme.css             The neon theme
  css/site.css              Site tweaks
  css/article.css           Fits the study content into the standard post card
  study.css, study.js       Interactive article labs
  assembly-*.js             Whole-article instruction explorers
  images/dali-logo.png      Logo / favicon
public/                     Generated output (git-ignored)
```

## Writing a new post

```bash
npx hexo new post "My new post"
```

Posts live in `source/_posts/`. The permalink is `:title/` (see `_config.yml`).
Markdown is rendered by `hexo-renderer-marked`; the VMProtect article is raw HTML
with `study: true` so the interactive styles and scripts are loaded only there.

## Customize

- **Site identity**: edit `_config.yml` (`title`, `subtitle`, `description`, `url`, `author`).
- **Branding and nav**: edit `themes/pure/_config.yml` (`logo`, `favicon`, `typed`, `menus`, `footer`).
- **Colors**: the palette lives in `:root` at the top of `source/css/theme.css`.
- **Logo**: replace `source/images/dali-logo.png`.
- **Headings font**: the reference site uses a display font ("Akira"). A 800-weight
  Open Sans fallback is used here; add an `@font-face` in `source/css/theme.css` to change it.

## Deploy to GitHub Pages

A workflow is included at `.github/workflows/pages.yml`.

1. Push this project to a GitHub repository (the repo root should be this folder).
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` (or `master`). The workflow builds and publishes `public/`.

The workflow computes `root` and `url` automatically:

- User site (`<user>.github.io`): served at `/`
- Project site (`<user>.github.io/<repo>/`): served at `/<repo>/`

To build locally for a project site, override the same variables:

```bash
HEXO_URL=https://user.github.io/repo HEXO_ROOT=/repo/ npm run build
```

Alternatively, edit `url` and `root` directly in `_config.yml` and run `npm run build`.

## Standalone article export

`npm run export` inlines the built study post into a single
`VMProtect_Study_Guide.html` at the project root (git-ignored). Run `npm run build`
first.

## Credits

- Theme: [renbaoshuo/hexo-theme-pure](https://github.com/renbaoshuo/hexo-theme-pure)
- Static site generator: [Hexo](https://hexo.io)
- Layout and visual reference: [eversinc33.com](https://eversinc33.com)
