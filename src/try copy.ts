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
  value: any
  valueHistory: any[]
  processRecord: any[]
  record: any
  //TODO:Typescript 中如何 “有作用域地” 判定数据类型？
  constructor(...values) {
    if (values.length === 1) {
      this.value = values[0]
    } else {
      this.value = values
    }
    this.valueHistory = [] // 记录值的变换
    this.processRecord = [] //记录步骤
  }
  setValue(newValue) {
    //TODO:应用其上的规则，依然应用在新值上
    const oldValue = this.value
    this.valueHistory.push(oldValue)
    this.value = newValue
    return this
  }

  /**
   * 对涵子内的值/值们应用单/多个函数
   * @param {function[]} fns
   */
  run(...fns) {
    if (fns.length) {
      const fn = pipe(fns)
      if (typeOf(this.value) === 'array') {
        const newValue = this.value.map(fn)
        this.setValue(newValue)
      } else if (typeOf(this.value) === 'function') {
        const newValue = fn(this.value)
        this.setValue(newValue)
      }
    } else {
      return this
    }
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
    return this.clone().run(fn)
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
console.log(new StackFunctor(4).run().run(n => n * n, n => n + 2))
console.log(StackFunctor.prototype)
