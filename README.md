# jfutil
实用工具类

### 丶多维数组的排序


    var testData = [
        {name: 'Edward', value: 21, grade: 1, time: 10},
        {name: 'Sharpe', value: 37, grade: 2, time: 2},
        {name: 'And', value: 45, grade: 3, time: 3},
        {name: 'The', value: -12, grade: 2, time: 4},
        {name: 'Magnetic', value: 0, grade: 1, time: 5},
        {name: 'Zeros', value: 37, grade: 2, time: 1},
        {name: 'Google', value: 37, grade: 3, time: 100}
    ];

    var tmp7 = JFUtil.multiSort({
        data: testData,
        keys: [
            {
                'key': 'value',
                'reverse': false
            },
            {
                'key': 'grade',
                'reverse': true
            },
            {
                'key': 'time',
                'reverse': false
            },
            {
                'key': 'name',
                'reverse': false
            }
        ],
        reverse: true
    });

### 丶通过distanceY判断是否到底端

    var dom = document.querySelector('.box-container');
    var tmpY = 0, distanceY = 0;
    JFUtil.addHandler(dom, 'touchstart', function (e) {
        tmpY = e.changedTouches[0].clientY;
    });
    JFUtil.addHandler(dom, 'touchend', function (e) {
        distanceY = e.changedTouches[0].clientY - tmpY;
        JFUtil.reachBottom(distanceY, function () {
            alert("到底了~~~");
        })
    });

### 杂项

1.日期格式化：

    var now = new Date().format('yyyy-MM-dd hh:mm:ss');

2.伪数组转真数组

    var arr1 = JFUtil.realArray(document.querySelectorAll('span'));

3.复制数组，（浅拷贝）非引用拷贝

    var arr2 = [1, 2, -3, 4, -11];
        var copy2 = arr2.copy();

4.判断变量是否为空，空对象和空数组均认为是空

    var obj = {};
        console.log(JFUtil.isEmpty(obj));//true

5.获取 元素的 盒子模型

    var box = JFUtil.getRectBoxObj(document.querySelector('#box-container'));

6. 判断一个变量 能否转成 数值


    var nnn1 = '158';
    var nnn2 = '158c';
        var nnn3 = 123;
        console.log(likeNumber(nnn1));//true
        console.log(likeNumber(nnn2));//false
        console.log(likeNumber(nnn3));//true