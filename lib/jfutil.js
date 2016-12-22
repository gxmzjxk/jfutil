/**
 *  @author Xiaokun.Jiang
 *  @reference ：Linxl
 *  @desc 实用工具方法，和对 原型链的扩展
 *  @version 1.0
 */
'use strict';
function isNumber(value) {
    return typeof value === 'number';
}
function likeNumber(value) {
    var tmp = +value;
    if (!isNaN(tmp)) {
        return true;
    } else {
        return false;
    }
}
function isFunction(a) {
    return Object.prototype.toString.call(a) == "[object Function]";
}
function isObject(a) {
    return a instanceof Object;
}
function isArray(a) {
    return a instanceof Array;
}
function likeArray(a) {
    return typeof a.length == "number";
}
//复制数组
Array.prototype.copy = function () {
    return this.concat();//更稳定，对WebKit更友好
    // return this.slice();
};
//判断是否为空(空对象，空数组，空字符串，false,0,"0");
Object.prototype.isEmpty = function () {
    if (this instanceof Object) {
        return false;
    } else {
        if (this) {
            return false;
        } else {
            return true;
        }
    }
};
Date.prototype.format = function (format) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

var JFUtil = {
    ready: function (callback) {
        if (/complete|loaded|interactive/.test(document.readyState)) {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                callback();
            }, false);
        }
    },
    /**
     *
     * @param a : dom
     * @param c : type
     * @param b : cal
     */
    addHandler: function (a, c, b) {
        if (c.indexOf(" ") != -1) {
            var e = c.split(" ");
            e.each(function (g, f) {
                a.addEventListener(f, b, false);
                // a[f + ""] = b
            });
        } else {
            a.addEventListener(c, b, false);
            // a[c + ""] = b
        }
    },
    /**
     *
     * @param a : domList
     * @param b : type
     */
    removeHandler: function (a, b) {
        if (b.indexOf(" ") != -1) {
            var c = b.split(" ");
            c.each(function (f, e) {
                if (typeof a[e + ""] == "function") {
                    if (a.removeEventListener) {
                        a.removeEventListener(e, a[e + ""], false);
                    } else {
                        if (a.dettachEvent) {
                            a.dettachEvent("on" + e, a[e + ""]);
                        } else {
                            a["on" + e] = null;
                        }
                    }
                }
                a[e + ""] = null;
            });
        } else {
            if (typeof a[b + ""] == "function") {
                if (a.removeEventListener) {
                    a.removeEventListener(b, a[b + ""], false);
                } else {
                    if (a.dettachEvent) {
                        a.dettachEvent("on" + b, a[b + ""]);
                    } else {
                        a["on" + b] = null;
                    }
                }
            }
            a[b + ""] = null;
        }
    },
    /**
     * @desc    将伪数组 转成 真数组
     * @param c
     * @returns {*}
     */
    realArray: function (c) {
        try {
            return Array.prototype.slice.call(c);
        } catch (e) {
            var ret = [];
            for (var i = 0, len = c.length; i < len; i++) {
                ret[i] = (c[i]);
            }
            return ret;
        }
    },
    /**
     * @param e
     * @returns {boolean}
     * @desc 判断是否为空(空对象，空数组，空字符串，false, 0, "0")
     */
    isEmpty: function (e) {
        if (typeof e === 'object') {
            if (e instanceof Array) {
                //数组会自带一个length，同时加上一些原型方法
                if (e.length > 0) {
                    return !1;
                } else {
                    return !0;
                }
            } else {
                var t;
                for (t in e) {
                    //继承的原型方法，过滤掉
                    if (e.hasOwnProperty(t)) {
                        return !1;
                    }
                }
                return !0;
            }
        } else {
            if (e) {
                return !1;
            } else {
                return !0;
            }
        }

    },
    data: function (dom, key) {
        var dataKey = "data-" + key;
        return dom.getAttribute(dataKey);
    },
    /**
     * data : arrList:Array
     * keys : String or Array
     * eg : keys : [
     {'key': 'value', 'reverse': false},
     {'key': 'grade', 'reverse': true}
     ]
     * reverse : 全局配置：置为TRUE 表示 - 对最终结果进行倒排
     * @returns {*}
     */
    multiSort: function () {
        var arrList, keyList, sortType = true;
        if (arguments[0].reverse) {//是否逆序，默认正序
            sortType = false;
        }
        if (isArray(arguments[0].data)) {
            arrList = arguments[0].data.copy();
        } else {
            console.warn("multiSort only support Array");
            return [];
        }
        keyList = arguments[0].keys;
        arrList.sort(function (a, b) {
            //返回比较标志符
            var retFlag = 0;
            if (isArray(keyList)) {
                // var jumpFlag = false;//是否结束比较
                retFlag = (function () {
                    var bolReverse = false;//是否倒序
                    var strKey = '';//需要比较的key
                    var breakFlag = false;//是否已经判断出大小
                    var retCompareFlag = 0;//比较结果
                    for (var i = 0, len = keyList.length; i < len; i++) {
                        bolReverse = keyList[i].reverse;
                        strKey = keyList[i].key;
                        if (a[strKey] > b[strKey]) {
                            retCompareFlag = 1;
                            breakFlag = true;
                        } else if (a[strKey] < b[strKey]) {
                            retCompareFlag = -1;
                            breakFlag = true;
                        }
                        if (breakFlag) {
                            if (bolReverse) {
                                return 0 - retCompareFlag;
                            } else {
                                return retCompareFlag;
                            }
                        } else {
                            if (i == len - 1) {
                                return retCompareFlag;
                            }
                        }
                    }

                })();

            } else {
                if (a[keyList] > b[keyList]) {
                    retFlag = 1;
                } else if (a[keyList] < b[keyList]) {
                    retFlag = -1;
                }
            }
            if (!sortType) {
                retFlag = 0 - retFlag;
            }
            return retFlag;
        });

        return arrList;
    },
    /**
     * @desc    获取元素 盒子模型 的信息
     * @param element
     * @returns {{top: Number, left: Number, right: Number, bottom: Number, width: (Number|number), height: (Number|number)}}
     */
    getRectBoxObj: function (element) {
        var box = element.getBoundingClientRect();
        var top = box.top;         // 元素上边距离页面上边的距离
        var right = box.right;       // 元素右边距离页面左边的距离
        var bottom = box.bottom;      // 元素下边距离页面上边的距离
        var left = box.left;        // 元素左边距离页面左边的距离
        var width = box.width || right - left;     //元素自身的宽度
        var height = box.height || bottom - top;     //元素自身的高度
        return {'top': top, 'left': left, 'right': right, 'bottom': bottom, 'width': width, 'height': height};
    },
    /**
     * @desc 判断是否滑到屏幕底端，支持Android/ios和PC
     * @param distanceY
     * @param cal
     */
    reachBottom: function (distanceY, cal) {
        var scrollTop = 0,
            clientHeight = 0,
            scrollHeight = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        } else {
            clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }
        scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        if (distanceY < -50 && scrollTop + clientHeight + 50 >= scrollHeight) {
            cal();
        }
    },

};