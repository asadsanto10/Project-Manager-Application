const deboundeHandler = (fn, delay) => {
  let timeOut;
  return (...args) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
export default deboundeHandler;
