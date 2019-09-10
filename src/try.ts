// Foo的作用为：
// 初始化一个数组
// 如果这个数组是一元的（内含一个元素），则装入唯一的元素
// 如果这个数组是多元的（内含多个元素），则装入整个数组

// 问题，如何让typescript判断出被赋值的a包含一个元素还是一个变量

class Foo<T> {
  constructor(args:T[]){
    // if(args is Unary){
    //   this.value = args[0]
    // } else{
    //   this.value = args
    // }
  }
}
const a = new Foo(['hi'])
a.value. //TOFIX: 此处需要typescript自动提示
'hi'.