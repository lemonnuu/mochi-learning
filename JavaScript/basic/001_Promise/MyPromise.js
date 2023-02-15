// promise 三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// 辅助函数
const isFunction = (target) => typeof target === 'function'
const isObject = (target) => typeof target === 'object'

class MyPromise {
  // 初始状态为 pending
  _status = PENDING
  // 成功回调队列
  _fulfilledCallbackQueue = []
  // 失败回调队列
  _rejectedCallbackQueue = []

  constructor(executor) {
    this.value = undefined
    this.reason = undefined

    try {
      // 同步执行 执行器函数, 参数为 resolve 函数和 reject 函数
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      // 如果函数执行期间抛出错误, 直接 reject
      this.reject(error)
    }
  }

  // 状态获取函数
  get promiseState() {
    return this._status
  }

  // 状态设置函数
  set promiseState(newState) {
    this._status = newState
    // 当状态改变时, 获取存储的回调遍历执行, 如果是同步改变状态, 回调队列为空
    switch (newState) {
      case FULFILLED:
        this._fulfilledCallbackQueue.forEach((callback) => callback())
        break
      case REJECTED:
        this._rejectedCallbackQueue.forEach((callback) => callback())
        break
    }
  }

  // resolve 与 reject 函数的职责就是更改状态与保存 value 或 reason
  resolve(value) {
    // 如果状态不为 pending, 直接 return, 不让修改
    if (this.promiseState !== PENDING) return
    this.value = value
    this.promiseState = FULFILLED
  }

  reject(reason) {
    if (this.promiseState !== PENDING) return
    this.reason = reason
    this.promiseState = REJECTED
  }

  then(onFulfilled, onRejected) {
    // 当 onFulfilled 不是一个函数时, 赋予默认值, 直接透传返回 value
    const realOnFulfilled = isFunction(onFulfilled)
      ? onFulfilled
      : (value) => {
          return value
        }
    // 当 onRejected 不是一个函数时, 赋予默认值, 直接透传抛出错误 reason
    const realOnRejected = isFunction(onRejected)
      ? onRejected
      : (reason) => {
          throw reason
        }
    // then 返回一个新的 promise
    const promise2 = new MyPromise((resolve, reject) => {
      // then 里 onFulfilled 与 onRejected 的执行都是微任务
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value)
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            // 回调执行期间抛出错误, 新的 promise 直接 reject
            reject(error)
          }
        })
      }
      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason)
            // 回调函数的结果值交给 resolvePromise 函数解析, 注意 onFulfilled 和 onRejected 都一样
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }
      switch (this.promiseState) {
        // 如果是同步改变状态, 也就是当前状态为 fulfilled 或 rejected, 直接执行相应回调
        case FULFILLED:
          fulfilledMicrotask()
          break
        case REJECTED:
          rejectedMicrotask()
          break
        // pending 状态先将回调函数存储起来, 待状态改变使用
        case PENDING:
          this._fulfilledCallbackQueue.push(fulfilledMicrotask)
          this._rejectedCallbackQueue.push(rejectedMicrotask)
          break
      }
    })
    return promise2
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(callBack) {
    return this.then(
      (value) => MyPromise.resolve(callBack()).then(() => value),
      (reason) =>
        MyPromise.reject(callBack()).then(() => {
          throw reason
        })
    )
  }

  resolvePromise(promise2, x, resolve, reject) {
    // 如果 promise2 和返回值 x 相等, 直接 reject 一个 TypeError 错误
    if (promise2 === x) {
      return reject(new TypeError('This promise and the value are the same!'))
    }
    // 如果返回值 x 是 Promise 实例, 则调用 then 方法继续解析
    if (x instanceof MyPromise) {
      // 这里注意就好, 又是一个微任务
      queueMicrotask(() => {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject)
        }, reject)
      })
    } else if (isObject(x) || isFunction(x)) {
      // 如果返回值 x 是一个对象或者函数
      // 如果 x 为 null 直接 resolve x
      if (x == null) {
        return resolve(x)
      }
      // 取 x 上的 then 属性
      let then = null
      try {
        then = x.then
      } catch (error) {
        // 如果取得过程中抛出错误, 直接 reject 错误
        return reject(error)
      }
      // 判断 then 是否是函数, 如果不是直接 resolve x
      if (isFunction(then)) {
        let called = false
        try {
          then.call(
            x,
            (y) => {
              // 如果回调函数被调用, 直接 return, 否则, 继续解析
              if (called) return
              called = true
              this.resolvePromise(promise2, y, resolve, reject)
            },
            (r) => {
              // 如果回调函数被调用, 直接 return, 否则, 直接 reject reason
              if (called) return
              called = true
              reject(r)
            }
          )
        } catch (error) {
          // 如果回调函数被调用, 直接 return, 否则, reject 错误
          if (called) return
          reject(error)
        }
      } else {
        // 否则, resolve 返回值 x
        resolve(x)
      }
    } else {
      // 否则, resolve 返回值 x
      resolve(x)
    }
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise((resolve) => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason))
  }

  static all(promiseArray) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promiseArray)) {
        return reject(new TypeError('The params must be an array!'))
      }
      const promiseArrayLength = promiseArray.length
      if (promiseArrayLength === 0) {
        return resolve([])
      }
      const res = []
      let count = 0
      for (let i = 0; i < promiseArrayLength; i++) {
        MyPromise.resolve(promiseArray[i])
          .then((value) => {
            count++
            res[i] = value
            if (count === promiseArrayLength) {
              resolve(res)
            }
          })
          .catch((reason) => {
            reject(reason)
          })
      }
    })
  }
}

MyPromise.deferred = function () {
  let result = {}
  result.promise = new MyPromise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

module.exports = MyPromise
