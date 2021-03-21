/**
 * Promise.all 方法的实现
 * @description 并发请求，都 resolve 返回一个数组，只要有一个 reject 就返回失败结果
 */
const all = function(iterable) {
    return new Promise((resolve, reject) => {
        let count = iterable.length,
            ans = new Array(count);
        for (let i in iterable) {
            const v = iterable[i];
            if (typeof v === 'object' && typeof v.then === 'function') {
                v.then(res => {
                    ans[i] = res;
                    if (--count === 0) resolve(ans);
                }, err => {
                    reject(err);
                })
            } else {
                ans[i] = res;
                if (--count === 0) resolve(ans);
            }
        }
    })
}

/**
 * Promise.race 方法的实现
 * @description race 意思就是比赛，谁的状态先改变就返回谁，不管 resolve 还是 reject
 */
const race = function(iterbale) {
    return new Promise((resolve, reject) => {
        for (let i in iterbale) {
            const v = iterbale[i];
            if (typeof v === 'object' && typeof v.then === 'function') {
                v.then(res => {
                    resolve(res);
                }, err => {
                    reject(err);
                })
            } else {
                resolve(v);
            }
        }
    })
}

/**
 * Function.prototype.call 方法的实现
 * @description 接受一个对象，作为函数执行的上下文
 * @param {Object} ctx 上下文对象 
 * @param  {...any} newArgs 函数的参数
 * @returns 
 */
Function.prototype.newCall = function(ctx, ...newArgs) {
    // 总结一下只有三步，向对象中插入属性，执行函数保存结果，删除属性
    // 属性 p 名字可以是任意的（不与已有的属性重复）
    // JS 函数实际上是一种特殊的对象，这里的 this 指代函数表达式
    // const person = () => console.log('这是 person 函数');
    // person.newCall();
    // 可以看作在 person 对象上调用 newCall 方法
    // 因此毫无疑问 newCall 中的 this 指代 person （因为是由 person 去调用的）
    // 由于 person 实际上是一个函数，因此 this 指代 person 的函数表达式
    let ctx = ctx || window;
    ctx.p = this;
    let result = ctx.p(...newArgs);
    delete ctx.p;
    return result
}


/**
 * Function.prototype.apply 方法的实现
 * @description 与 call 方法基本一样，只不过只有两个参数，第二个参数是一个数组
 * @param {Object} ctx 上下文对象
 * @param {Array} newArgs 函数的参数，装在数组里面
 * @returns 
 */
Function.prototype.newApply = function(ctx, newArgs) {
    let ctx = ctx || window;
    ctx.p = this;
    let result = ctx.p(...newArgs);
    delete ctx.p;
    return result;
}

/**
 * Function.prototype.bind 方法的实现
 * @description 返回一个待执行函数，具有柯里化特性，new 调用时传入的上下文对象失效
 * @param {Object} ctx 上下文对象
 * @param  {...any} arr 函数的参数
 * @returns 
 */
Function.prototype.newBind = function(ctx, ...arr) {
    var that = this, // 返回的是一个匿名函数，容易造成 this 丢失，这边使用闭包保存一下
        // arr = arguments, // 这样写不好，ctx 也在里面
        o = function() {},
        newf = function() {
            var arr2 = arguments; // 第二次接收参数
            if (this instanceof o) {
                // 通过 new 关键字调用的，传入的上下文对象失效
                that.apply(this, [...arr, ...arr2]);
            } else {
                // 没有通过 new 调用，使用传入的上下文对象
                that.apply(ctx, [...arr, ...arr2]);
            }
        }
    // 因为返回一个待执行函数，所以需要将原型对象传递下去
    // 直接 newf.prototype = that.prototype 会导致原型链污染
    // 所以需要借助一个空函数进行传递
    // 在这里 new o 和 new o() 等价的
    // 只有需要传参，或者需要访问 new 出来对象的属性的情况下，才需要加括号
    o.prototype = that.prototype;
    newf.prototype = new o;
    return newf;
}

/**
 * 浅拷贝的实现
 */
function shallowCopy(source) {
    let target = {};
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target
}

/**
 * 深拷贝的实现
 * @description 如果使用 JSON.parse(JSON.stingify(source)) ，函数类型、undefined、Symbol值会被忽略
 * @description 下面是一种简单的递归实现，null会被忽略，如果有循环引用的问题，会导致递归栈溢出
 */
function deepCopy(source) {
    let target = Array.isArray(source) ? [] : {};
    for(let key in source) {
        // 意思就是__proto__上面的属性不进行拷贝
        // 不直接用 source.hasOwnProperty(key) 是因为 source 有可能是数组
		if(Object.prototype.hasOwnProperty.call(source, key)) {
			if(typeof source[key] === 'object') {
                // 如果是引用类型就进行递归调用
				target[key] = deepCopy(source[key]);
			} else {
                // 如果是基本类型就直接进行赋值
				target[key] = source[key];
			}
		}
	}
	return target
}

/**
 * instanceof 的实现
 * @param {Object} left 实例对象
 * @param {Function} right 构造函数
 * @returns 
 */
function new_instance_of(left, right) {
    let rightProto = right.prototype, // 获取构造函数原型对象
        leftValue = left.__proto__; // 获取实例对象的 proto 指针
    // 原型链的终点是 null
    while (leftValue !== null) {
        // 如果 proto 指向构造函数原型对象
        if (leftValue === rightProto) {
            return true;
        }
        // 继续沿着原型链向上查找
        leftValue = leftValue.__proto__;
    }
    return false;
}

/**
 * new 的实现
 * @param {Function} Func 构造函数
 * @param {any} args 传给构造函数的参数
 * @returns 
 */
function myNew(Func, args) {
    // 第一步，创建空对象
    let obj = new Object();
    // 第二步，链接原型
    obj.__proto__= Func.prototype;
    // 第三步，绑定this，执行构造函数代码
    let result = Func.apply(obj, args);
    // 第四步，确保返回一个对象
    // 如果构造函数没有返回值，即undefined，或者返回基本类型，new 操作都返回新创建的实例对象
    // 如果构造函数返回一个引用类型，new 操作返回构造函数的返回值，this所引用的值就会被丢弃了，也就是new操作符无效
    return result instanceof Object ? result : obj;
}

/**
 * Object.create 的实现
 * @description 就是原型式继承，创建一个空对象，用传入的对象作为原型
 */
function simulateCreate(proto) {
    var F = function() {};
    F.prototype = proto;
    return new F();
}

/**
 * debounce 方法的实现（非立即执行版）
 */
function debounce(func, wait) {
    let timer;
    return function() {
        let that = this;
        let args = arguments;

        // 如果已经有定时器，就清除掉，重新开始计时
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            func.apply(that, args);
        }, wait)
    }
}

/**
 * throttle 方法的实现
 */
 function throttle(func, wait) {
    let timeout;
    return function() {
      let that = this;
      let args = arguments;
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(that, args)
        }, wait)
      }
    }
}
