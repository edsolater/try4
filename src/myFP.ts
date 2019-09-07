function isOne<T>(value: T[]) {
  if (value.length === 1) {
    return true;
  } else {
    return false;
  }
}
function pipe(...fns) {
  //TODO:
  let pipedFunction;
  return pipedFunction;
}
class Functor<T> {
  value: T | T[];
  _isOne: boolean;
  //TODO:Typescript 中如何分辨数据类型？
  constructor(...value: T[]) {
    if (isOne(value)) {
      this.value = value;
      this._isOne = true;
    } else {
      this.value = value[0];
      this._isOne = false;
    }
  }
  map(fn) {
    if (this._isOne) {
      return fn(this.value);
    } else {
      return this.value.map(fn);
    }
  }
  pipeMap(...fns) {
    const pipeFns = pipe(fns);
    if (this._isOne) {
      return pipeFns(this.value);
    } else {
      return this.value.map(pipeFns);
    }
  }
}
