import expandGlobs from 'clix/lib/expand-globs';
import execp from './common/execp';

export const parseFiles = async cmd => {
  const files = await execp(cmd);
  return files.trim().split('\n');
};

export const getModifiedAndNewFiles = async ({ branch = 'master', resolvePaths } = {}) => {
  let files = [];

  files = files.concat(await parseFiles(`git diff ${branch} --name-only --relative`));
  files = files.concat(await parseFiles('git ls-files --other --exclude-standard'));

  files = expandGlobs(files, { resolvePaths });

  const jsFiles = files.filter(file => file.match(/\.js$/) && !file.match(/static\//) && !file.match(/public\//) && !file.match(/\.eslintrc\.js/));

  const cssFiles = files.filter(file => (file.match(/\.scss$/) || file.match(/\.css$/) || file.match(/\.less$/)) && !file.match(/static/));

  return {
    all: jsFiles.concat(cssFiles),
    js: jsFiles,
    css: cssFiles,
  };
};
