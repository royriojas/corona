export const createDeferred = () => {
  let resolve;
  let reject;

  const promise = new Promise((resolver, rejector) => {
    resolve = resolver;
    reject = rejector;
  });

  promise.resolve = (...args) => {
    resolve(...args);
  };

  promise.reject = (...args) => {
    reject(...args);
  };

  return promise;
};
