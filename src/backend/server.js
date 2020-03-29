import Twig from 'twig';
import express from 'express';
import path from 'path';
import serveStatic from 'serve-static';
import favicon from 'serve-favicon';
import httpProxy from 'http-proxy';
import http from 'http';

import { BROWSER_SYNC_PORT, APP_PORT, IS_PRODUCTION } from './config/config';
import { createDeferred } from './common/deferred';

Twig.cache(false);

const addMinIfNeeded = resource => {
  if (IS_PRODUCTION) {
    resource = resource.replace(/\.js$|\.css$/i, '.min$&');
  }

  return resource;
};

const _renderView = async ({ getView, getData }) => {
  if (getData && typeof getData !== 'function') throw new Error('getData is not a function');
  if (typeof getView !== 'function') throw new Error('getView is not a function');

  const vendorResource = addMinIfNeeded('/dist/vendor.js');
  const jsResource = addMinIfNeeded('/dist/corona.js');
  const cssResource = addMinIfNeeded('/dist/corona.css');

  const data = getData ? getData() || {} : {};

  const view = getView();
  if (!view) throw new Error('view not defined');

  const templateFile = path.join(__dirname, './views/', view);

  const dfd = createDeferred();

  Twig.renderFile(
    templateFile,
    {
      jsResource,
      cssResource,
      vendorResource,
      dev: !IS_PRODUCTION,
      ...data,
    },
    (err, html) => {
      if (err) {
        dfd.reject(err);
        return;
      }
      dfd.resolve(html);
    },
  );

  return dfd;
};

const renderView = async (req, res, next, { getView, getData } = {}) => {
  try {
    const html = await _renderView({
      getView,
      getData,
    });
    res.status(200).send(html);
  } catch (err) {
    next(err);
  }
};

export const startServer = () => {
  const app = express();

  app.use(
    favicon(path.join(__dirname, '../../public/assets/favicon', 'favicon.ico'), {
      maxAge: '1y',
    }),
  );

  const setHeaders = res => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  };

  app.use(
    serveStatic(path.join(__dirname, '../../public'), {
      maxAge: '0',
      setHeaders,
    }),
  );

  let proxy;

  if (!IS_PRODUCTION) {
    proxy = httpProxy.createProxyServer({
      target: `http://localhost:${BROWSER_SYNC_PORT}`,
      ws: true,
    });

    proxy.on('error', (error, req, res) => {
      console.error({ error }, 'proxy error');

      if (!res.headersSent) {
        res.writeHead(500, {
          'content-type': 'application/json',
        });
      }

      const json = {
        error: 'proxy_error',
        reason: error.message,
      };

      res.end(JSON.stringify(json));
    });

    // Proxy to browser-sync
    app.use('/browser-sync', (req, res) => {
      req.url = `/browser-sync/${req.url}`;
      proxy.web(req, res);
    });
  }

  app.get('/:templateName?', async (req, res, next) => {
    renderView(req, res, next, {
      getView: () => {
        const { templateName = 'home' } = req.params;
        if (!templateName.match(/home/)) {
          throw new Error(`Route not allowed: ${templateName}`);
        }

        return `${templateName}.twig`;
      },
    });
  });

  const server = http.createServer(app).listen(APP_PORT, () => console.log(`>>> app started on port ${APP_PORT}`));

  if (!IS_PRODUCTION) {
    server.on('upgrade', (req, socket) => {
      proxy && proxy.ws(req, socket);
    });
  }
};
