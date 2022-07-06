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

window.onload = () => {
    rightMouse();
}