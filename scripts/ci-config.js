'use strict';

/*
 * Allow CI (or any environment) to override the published URL and root path
 * without editing `_config.yml`. Useful for GitHub Pages project sites, which
 * are served from a subdirectory.
 *
 *   HEXO_URL=https://user.github.io/repo HEXO_ROOT=/repo/ npm run build
 */
hexo.extend.filter.register('before_generate', function () {
    if (process.env.HEXO_URL) {
        hexo.config.url = process.env.HEXO_URL;
    }
    if (process.env.HEXO_ROOT) {
        hexo.config.root = process.env.HEXO_ROOT;
    }
});
