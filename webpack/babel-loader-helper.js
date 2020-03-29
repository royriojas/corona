const { defaultBrowserTargets } = require( '../resources/browserTargets' );

const enhancePresetForBrowser = ( envPreset, browserTargets ) => {
  const presetConfig = envPreset[1];
  presetConfig.modules = false;
  presetConfig.useBuiltIns = 'entry';
  presetConfig.corejs = 3;
  presetConfig.targets = {};

  if ( browserTargets ) {
    presetConfig.targets.browsers = browserTargets;
  }
};

module.exports = {
  getBabelLoaderOptions: ( {
    id,
    hot,
    browserTargets = defaultBrowserTargets,
  } ) => {
    const babelConfig = require( '../babel.config' ); // eslint-disable-line global-require

    const envPreset = babelConfig.presets[0];

    enhancePresetForBrowser( envPreset, browserTargets );
    enhancePresetForBrowser(
      babelConfig.overrides[0].presets[0],
      browserTargets
    );

    const cfg = {
      babelrc: false, // this is important to prevent babel from trying to use the babelrc
      presets: babelConfig.presets,
      cacheDirectory: !id ? true : `node_modules/.cache/babel-loader-${id}`,
      plugins: babelConfig.plugins,
      overrides: babelConfig.overrides,
    };

    if ( hot ) {
      cfg.plugins = cfg.plugins.concat( ['react-hot-loader/babel'] );
    }

    return cfg;
  },
};
