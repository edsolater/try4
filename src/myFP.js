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
    if (values.length === 1) {
      this.value = values[0]
    } else {
      this.value = values
    }
  }
  setby(newValue) {
    this.value = newValue
    return this
  }
  use(...fns) {
    const fn = pipe(...fns)
    if (Array.isArray(this.value)) {
      const newValue = this.value.map(fn)
      this.setby(newValue)
    } else {
      const newValue = fn(this.value)
      this.setby(newValue)
    }
    return this
  }
  /**
   * @return {this}
   */
  _selfClone() {
    return new this.constructor(this.value)
  }
  /**
   * a shortcut
   */
  map(...fns) {
    return this._selfClone().use(...fns)
  }
}
class StackFunctor extends Functor {
  constructor(value) {
    super(value)
  }
}
const b = new StackFunctor({ a: [1] })
const c = b.map(({ a }) => ({ a: a.concat(2) }))
console.log('c: ', c)
console.log('b: ', b)
console.log(new StackFunctor(4).use().use(n => n * n, n => n + 2))
console.log(StackFunctor.prototype)
