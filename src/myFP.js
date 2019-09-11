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
  if (Array.isArray(value)) return 'array'
  if (typeof this.value === 'function') return 'function'
}
/**
 *
 * 产生基本涵子对象
 */
class Functor {
  //TODO:Typescript 中如何 “有作用域地” 判定数据类型？
  constructor(...values) {
    if (values.length === 1) {
      this._value = values[0]
    } else {
      this._value = values
    }
    this.history = [{ value: this._value, use: [] }] // 记录一切过程
  }
  set value(newValue) {
    //TODO:应用其上的规则，依然应用在新值上
    this.history.push({ value: newValue, use: [] })
    this._value = newValue
    return this
  }
  get value() {
    return this._value
  }
  /**
   *
   * 克隆涵子内的值/值们，克隆默认不包含历时记录
   * @return {this}
   */
  clone({ history = false } = {}) {
    const newWrappedValue = new this.constructor(this._value)
    if (history === true) {
      newWrappedValue.history = this.history.slice()
    }
    return newWrappedValue
  }
  /**
   * 对涵子内的值/值们应用单/多个函数
   * @param {function[]} fns
   */
  use(...fns) {
    if (fns.length) {
      // 记录传入的fns
      const recordedProcess = this.history[this.history.length - 1].use
      fns.forEach(fn => recordedProcess.push(fn))

      //使用
      const fn = pipe(fns)
      let newValue
      if (typeOf(this._value) === 'array') {
        newValue = []
        for (const element of this._value) {
          newValue.push(fn(element))
        }
      } else if (typeOf(this._value) === 'function') {
        newValue = fn(element)
      }
      this.value = newValue
    }
    return this
  }
  /**
   *  只是个快捷方式
   * 对涵子内的值/值们应用单/多个函数，不会应用函数，但返回一个新涵子包裹的值
   * @param {function} fn
   */
  map(...fns) {
    return this.clone().use(...fns)
  }
  /**
   *
   * 写入涵子操作步骤
   * @param  {...function[]} fns
   */
  setProcessRecord(...fns) {
    return this
  }
  /**
   *
   * 应用操作步骤
   * @param  {...function[]} fns
   */
  applyProcessRecord(...fns) {
    return this
  }
  /**
   *
   * 清除record中的步骤记录
   */
  clearProcessRecord() {
    this.record = null
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
