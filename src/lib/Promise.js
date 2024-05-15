export function createPromise() {
  let temp_resolve = null;
  let temp_reject = null;

  const promise = new Promise((resolve, reject) => {
    temp_resolve = resolve;
    temp_reject = reject;
  });

  promise.resolve = temp_resolve;
  promise.reject = temp_reject;

  return promise;
};