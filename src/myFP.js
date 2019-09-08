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
  setValue(newValue) {
    this.value = newValue
    return this
  }
  use(fn) {
    if (Array.isArray(this.value)) {
      const newValue = this.value.map(fn)
      this.setValue(newValue)
    } else {
      const newValue = fn(this.value)
      this.setValue(newValue)
    }
    return this
  }
  pipeUse(...fns){
    const fn = pipe(...fns)
    return this.use(fn)
  }
  chainUse(superFn){

  }
  /**
   * @return {this}
   */
  _selfClone() {
    return new this.constructor(this.value)
  }
  map(fn) {
    return this._selfClone().use(fn)
  }
  pipeMap(...fns){
    const fn = pipe(...fns)
    return this.map(fn)
  }
  chainMap(superFn){

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
