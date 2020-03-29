export default function thenify(fn, ctx) {
  const wrap = (...args) =>
    new Promise((resolve, reject) => {
      args.push((err, ...rest) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(...rest);
      });
      fn.apply(ctx, args);
    });

  return wrap;
}
