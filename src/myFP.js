/**
 * 管道函数
 * @param  {...function[]} fns
 * @return {function}
 */
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
/**
 * 判断值的类型
 * @param {*} value
 * @return {'array'}
 */
function typeOf(value) {
  //TODO:完善函数体逻辑
  if(Array.isArray(value)) return 'array'
  if(typeof this.value === 'function') return 'function'
}
/**
 *
 * 产生基本涵子对象
 */
class Functor {
  //TODO:Typescript 中如何 “有作用域地” 判定数据类型？
  constructor(...values) {
    if (values.length === 1) {
      this.value = values[0]
    } else {
      this.value = values
    }
  }
  replaceValue(newValue) {
    //TODO:应用其上的规则，依然应用在新值上
    this.value = newValue
    return this
  }
  /**
   * 对涵子内的值/值们应用单/多个函数
   * @param {function[]} fns
   */
  use(...fns) {
    const fn = pipe(fns)
    if (typeOf(this.value) === 'array') {
      const newValue = this.value.map(fn)
      this.replaceValue(newValue)
    } else if (typeOf(this.value) === 'function') {
      const newValue = fn(this.value)
      this.replaceValue(newValue)
    }
    return this
  }
  /**
   *
   * 克隆涵子内的值/值们
   * @return {this}
   */
  clone() {
    return new this.constructor(this.value)
  }
  /**
   *
   * 对涵子内的值/值们应用单/多个函数，不会应用函数，但返回一个新涵子包裹的值
   * @param {function} fn
   */
  map(fn) {
    return this.clone().use(fn)
  }
  /**
   * 
   * 写入涵子操作步骤
   * @param  {...function[]} fns 
   */
  record(...fns){
    return this
  }
  /**
   * 
   * 应用操作步骤
   * @param  {...function[]} fns 
   */
  run(...fns){
    return this
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
