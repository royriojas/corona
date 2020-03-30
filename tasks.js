import { subtle } from 'clix-logger/logger';

import { getModifiedAndNewFiles } from './src/resources/git-helper';
import { BROWSER_SYNC_PORT } from './src/backend/config/config';

const wrapInQuotes = arr => arr.map(entry => `'${entry}'`).join(' ');

const tasks = {
  'css:check': {
    cmd: ({ args }) => {
      const cmd = ['cssbrush --cache-id css-files '];
      if (!args.fix) {
        cmd.push(' --check-only');
      }

      const dirs = wrapInQuotes(['src/**/*.less']);

      if (args.file) {
        const files = !Array.isArray(args.file) ? [args.file] : args.file;
        cmd.push(`${wrapInQuotes(files)}`);
      } else {
        cmd.push(` ${dirs}`);
      }

      return cmd.join(' ');
    },
  },
  eslint: {
    cmd: async ({ args }) => {
      const cmd = ['eslint --cache --cache-location node_modules/.cache/ -f friendly '];

      if (args.fix) {
        cmd.push(' --fix');
      }

      const dirs = wrapInQuotes(['./src/**/*.js', 'tasks.js']);

      if (args.file) {
        const files = !Array.isArray(args.file) ? [args.file] : args.file;
        cmd.push(`${wrapInQuotes(files)}`);
      } else {
        cmd.push(` ${dirs}`);
      }

      if (args.filter || args.byIssue) {
        cmd.push(' -- ');
      }

      if (args.filter) {
        cmd.push(` --eff-filter ${args.filter}`);
      }

      if (args.byIssue) {
        cmd.push(' --eff-by-issue');
      }

      return cmd.join(' ');
    },
  },
  autofix: {
    cmd: './bnr check --fix',
  },
  check: {
    cmd: async ({ args }) => {
      const eslintCommand = ['./bnr eslint'];
      const cssCheckCommand = ['./bnr css:check'];

      if (args.fix) {
        eslintCommand.push('--fix');
        cssCheckCommand.push('--fix');
      }

      const commands = [];

      if (args.changedOnly) {
        const { js, css, all } = await getModifiedAndNewFiles();

        subtle('Modified files: ', all);

        if (js.length > 0) {
          eslintCommand.push(js.map(file => `--file ${file}`).join(' '));
          commands.push(eslintCommand.join(' '));
        }

        if (css.length > 0) {
          cssCheckCommand.push(css.map(file => `--file ${file}`).join(' '));
          commands.push(cssCheckCommand.join(' '));
        }
      } else {
        commands.push(eslintCommand.join(' '), cssCheckCommand.join(' '));
      }

      return commands;
    },
  },
  'build:backend': {
    cmd: ({ args }) => {
      const env = {};
      if (args.production) {
        env.NODE_ENV = 'production';
      }
      return {
        cmd: ['babel src/backend -d dist/backend --copy-files'],
        env,
      };
    },
  },
  serve: {
    cmd: () => {
      const ip = require('ip').address(); // eslint-disable-line global-require

      return {
        cmd: `browser-sync start -s 'public' --files './public/dist/*' --files './src/backend/*' --no-notify --host ${ip} --port ${BROWSER_SYNC_PORT} --no-open`,
      };
    },
  },
  'server:start': {
    cmd: ({ args }) => {
      let command = 'nodemon --exec babel-node ./src/backend/bin/app.js --watch src/backend';

      const env = {};

      if (args.production) {
        env.NODE_ENV = 'production';
        command = 'node ./dist/backend/bin/app.js';
      }

      return {
        env,
        cmd: [command],
      };
    },
  },
};

module.exports = tasks;
