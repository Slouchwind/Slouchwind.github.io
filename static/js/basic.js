//返回选中的文字，将换行符改为空格
function mouseSelect(replace = " ") {
    return window.getSelection().toString().replace(/\n/g, replace);
}

//复制text
function textCopy(text) {
    navigator.clipboard.writeText(text).then(
        function () {
            /*复制成功*/
        }, function () {
            /*复制失败*/
        }
    );
}

//返回文字宽度
function getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var textWidth = context.measureText(text);
    return textWidth.width;
}

function rightMouse() {
    //动态创建ul
    var ul = document.createElement("ul");
    ul.id = "ul";
    ul.className = "rightMouse";
    document.body.appendChild(ul);
    ul = document.getElementById("ul");
    //动态创建右键菜单
    var li = document.createElement("li");
    var liText = ["复制", "搜索", "复制当前页面链接", "重新加载"];
    for (let i = 0; i < liText.length; i++) {
        li = document.createElement("li");
        var text = document.createTextNode(liText[i]);
        li.appendChild(text);
        ul.appendChild(li);
    }
    //禁止选中右键菜单
    ul.onselectstart = function () { return false; }
    //给document添加oncontextmenu事件
    document.oncontextmenu = function () {
        //更改右键菜单宽度
        if (getTextWidth('搜索"' + mouseSelect() + '"', "12px") > 64 && window.getSelection().toString() !== "") {
            if (getTextWidth('搜索"' + mouseSelect() + '"', "12px") < 300) {
                ul.style.width = getTextWidth('搜索"' + mouseSelect() + '"', "12px") + 72 + "px";
            }
            else {
                ul.style.width = "372px";
            }
        }
        else {
            ul.style.width = "136px";
        }
        var lis = document.querySelectorAll("li");
        //没有选中文字时隐藏复制&搜索选项
        if (window.getSelection().toString() !== "") {
            lis[0].style.display = "list-item";
            lis[1].style.display = "list-item";
            lis[1].innerText = '搜索"' + mouseSelect() + '"';
        }
        else {
            lis[0].style.display = "none";
            lis[1].style.display = "none";
        }
        let e = window.event;
        //去除原生右键菜单
        e.preventDefault ? e.preventDefault() : (e = false);
        //获取右键坐标
        let x = e.clientX;
        let y = e.clientY;
        //显示右键菜单
        ul.style.display = "block";
        ul.style.left = x + "px";
        ul.style.top = y + "px";
    }
    //点击左键时删除右键菜单
    document.onclick = function () {
        ul.style.display = "none";
    }
    //给每个li添加onclick的事件
    var lis = ul.querySelectorAll("li");
    lis[0].onclick = function () {
        textCopy(mouseSelect("\n"));
    }
    lis[1].onclick = function () {
        window.open("https://www.baidu.com/s?word=" + mouseSelect(), "_blank");
    }
    lis[2].onclick = function () {
        textCopy(location.href);
    }
    lis[3].onclick = function () {
        location.reload();
    }
}

//返回时间/日期
var getTime = {
    time: function () {
        let date = new Date();
        let h = date.getHours();
        if (h < 10) { h = "0" + h; }
        let m = date.getMinutes();
        if (m < 10) { m = "0" + m; }
        let s = date.getSeconds();
        if (s < 10) { s = "0" + s; }
        return h + ":" + m + ":" + s;
    },
    date: function () {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        if (m < 10) { m = "0" + m; }
        let d = date.getDate();
        if (d < 10) { d = "0" + d; }
        return y + "年" + m + "月" + d + "日";
    }
}

//运营了几天
function runDate() {
    const firstDay = new Date();
    firstDay.setFullYear(2022, 3, 15);
    var nowDay = new Date();
    return Math.round((nowDay - firstDay) / (1 * 24 * 60 * 60 * 1000));
}

//root操作
var root = {
    value: function (name) {
        return document.documentElement.style.getPropertyValue(name.trim());
    },
    replace: function (nameAndValue) {
        var info = nameAndValue.split(":");
        document.documentElement.style.setProperty(info[0].trim(), info[1].trim());
    }
}

function log() {
    let basicCss = "margin:5px 0";
    let colorCss = "color:" + root.value("--main") + ";margin:5px 0";
    console.log(
        "\n" + "%c" + "感谢您的访问♪(･ω･)ﾉ" +
        "\n" + "%c" + "Slouchwind Web  " + "%c" + document.getElementsByTagName("title")[0].innerHTML +
        "\n" + "现在是 " + getTime.date() + " " + getTime.time() +
        "\n" + "春鹄的个人网站" + "%c" + " 已上线 " + runDate() + " 天" +
        "\n",
        basicCss, colorCss, basicCss, colorCss
    );
}

window.onload = () => {
    log();
    rightMouse();
    if (location.hostname.includes("vercel.app")) {
        if (!(location.href.includes(".html")) && location.pathname != "/") {
            location.href += ".html";
        }
    }
    else {
        if (location.href.includes(".html")) {
            location.href = location.href.slice(0, location.href.indexOf(".html"));
        }
    }
}