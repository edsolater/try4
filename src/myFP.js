function pipe(...fns) {
  if (fns.length === 0) {
    return any => any
  } else if (fns.length === 1) {
    return fns[0]
  } else {
    const _pipe = (fn1, fn2) => (...args) => fn2(fn1(...args))
    return fns.reduce(_pipe)
  }
}
class Functor {
  //TODO:Typescript 中如何 “有作用域地” 判定数据类型？
  constructor(...values) {
    function isOne(value) {
      if (value.length === 1) {
        return true
      } else {
        return false
      }
    }
    this._isOne = isOne(values)
    if (this._isOne) {
      this.value = values[0]
    } else {
      this.value = values
    }
  }
  /**
   * @return {this}
   */
  selfClone() {
    return new this.constructor(this.value)
  }
  /**
   * @return {this}
   */
  use(...fns) {
    const fn = pipe(...fns)
    if (this._isOne) {
      this.value = fn(this.value)
    } else {
      this.value = this.value.map(fn)
    }
    return this
  }
  /**
   * @return {this}
   */
  map(...fns) {
    return this.selfClone().use(...fns)
  }
  /**
   * @return {this}
   */
  mutate(newValue) {
    this.value = newValue
    return this
  }
}
class StackFunctor extends Functor {
  constructor(value) {
    super(value)
    this.value = value
  }
}
const b = new StackFunctor({ a: [1] })
const c = b.map(({ a }) => ({ a: a.concat(2) }))
console.log('c: ', c)
console.log('b: ', b)
console.log(new StackFunctor(4).use(n => n * n, n => n + 2))
