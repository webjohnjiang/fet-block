// 技巧：自杀式函数状态记录。

let getPrototypeOf = function (obj) {
  if (Object.setPrototypeOf) {
    getPrototypeOf = Object.getPrototypeOf;
  } else {
    getPrototypeOf = function (obj) {
      return obj.__proto__;
    }
  }
  return getPrototypeOf(obj);
}

export { getPrototypeOf }