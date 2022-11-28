// 1. console.error() 打印错误日志
console.error('错误')

// 2. console.time() 和 console.timeEnd() 计算耗时
const doSomething = () => console.log('测试')
const measureDoingSomething = () => {
  console.time('doSomething()')
  //做点事，并测量所需的时间。
  doSomething()
  console.timeEnd('doSomething()')
}
measureDoingSomething()

// 3. console.count() 不仅打印日志, 还打印日志的执行次数
const oranges = ['橙子', '橙子']
const apples = ['苹果']
oranges.forEach((fruit) => {
  console.count(fruit)
})
apples.forEach((fruit) => {
  console.count(fruit)
})
