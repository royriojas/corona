const tryRequire = (pkgName, defaultValue) => {
  let ret;
  try {
    ret = require(pkgName); // eslint-disable-line global-require
  } catch (ex) {
    console.error('could not require:', pkgName);
    if (defaultValue) {
      ret = defaultValue;
    }
  }
  return ret;
};

export default tryRequire;
