/**
 * 为了写的代码更巨可读性而设
 * @param expression 传入的判断
 */
function not(expression: boolean) {
  return !expression
}

/**
 * 
 * 管道函数
 */
function pipe(...fns: Function[]){
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
 * 
 * 判断值的类型
 */
function typeOf(value: any) {
  //TODO:完善函数体逻辑
  if (Array.isArray(value)) return 'array'
  if (typeof this.value === 'function') return 'function'
}

const oo = [
  [3, 0, 53, 5 , 2 , 1],
  [3, 4, 3 , 3 , 2 , 3],
  [3, 4, 3 , 3 , 24, 3],
  [3, 4, 53, 53, 2 , 1],
]