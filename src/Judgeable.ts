/**
 * 使IF中的条件判断语句更具可读性
 */
export class Judgeable {
  /**
   * 判断自己是否符合次接口
   * @param adjectiveFeature 传入的implement字符串
   */
  is(adjectiveFeature: string) {
    return Boolean(this instanceof eval(adjectiveFeature))
  }
  has(nounFeature: string) {
    return Boolean(this[nounFeature])
  }
}
