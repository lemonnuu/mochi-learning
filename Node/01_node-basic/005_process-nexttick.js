setTimeout(() => {
  console.log('setTimeout')
  process.nextTick(() => {
    console.log('nextTick3')
  })
  queueMicrotask(() => {
    console.log('microTask4')
  })
}, 0)
queueMicrotask(() => {
  console.log('microTask1')
  process.nextTick(() => {
    console.log('nextTick2')
  })
  queueMicrotask(() => {
    console.log('microTask3')
  })
})

queueMicrotask(() => {
  console.log('microTask2')
})

process.nextTick(() => {
  console.log('nextTick1')
})

console.log('1')

// 搞不明白
