export const normalizeData = (arr) => {
  return arr.reduce((acc, item) => {
    return { ...acc, [item._id]: item };
  }, {});
};

export const denormalizeData = (obj) => {
  return Object.values(obj);
};

export const currencyFormat = (num = 0, symbol = "", decimales = 2) => {
  let format = /[$]/;
  if (format.test(num)) {
    num = num.replace(symbol, decimales);
  }
  num = parseFloat(num).toFixed(decimales);
  let str = num.toString().split(".");
  if (str[0].length >= 4) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, `${symbol}1,`);
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, `${symbol}1 `);
  }
  let result = str.join(".");
  result = `${symbol} ${result}`;
  return result;
};

export const toNumber = (num = 0) => {
  let format = /[$]/;
  if (format.test(num)) {
    num = num.replace("/[$]/", "");
  }
  num = parseFloat(num);
  return num;
};