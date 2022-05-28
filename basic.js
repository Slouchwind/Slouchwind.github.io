"use strict";//使用严格模式

/*函数定义*/


//获取屏幕高&宽
var getWindow = {
	width: function () {
		var w;
		w = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth;
		return w;
	},
	height: function () {
		let h;
		h = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;
		return h;
	}
}

//返回一言(诗词)
var res;
async function hitokoto() {
	res = await fetch("https://v1.hitokoto.cn/?c=i&encode=json").then(res => res.json());
	console.log("\n%c" + res.hitokoto + "\n%c    ————" + res.from + "\n", "color:" + root.value("--main") + ";margin:5px 0", "margin:5px 0");
	if (document.getElementById("hitokoto") == undefined) {
		var hitokotoP = document.createElement("p");
		hitokotoP.id = "hitokoto";
		document.getElementById("bottom").appendChild(hitokotoP);
	}
	document.getElementById("hitokoto").innerHTML = res.hitokoto;
}

//右键菜单
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

//判断是否为移动端
function isPhone() {
	var info = navigator.userAgent;
	var sencePhone = /mobile/i.test(info);
	return sencePhone;
}

//返回文字宽度
function getTextWidth(text, font) {
	var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	var context = canvas.getContext("2d");
	context.font = font;
	var textWidth = context.measureText(text);
	return textWidth.width;
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

//创建/替换时间&日期
var doWtihTime = {
	create: function () {
		var time = document.createElement("p");
		var date = document.createElement("p");
		time.id = "theTime";
		date.id = "date";
		document.getElementById("time").appendChild(time);
		document.getElementById("time").appendChild(date);
	},
	replace: function () {
		if (document.getElementById("time") !== undefined) {
			document.getElementById("theTime").innerText = getTime.time();
			document.getElementById("date").innerText = getTime.date();
		}
	}
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

//浅色/深色模式配色
function turnMainColor(code = 1) {
	if (code == 1) {
		root.replace("--main: #719fe3");
		root.replace("--main-hover: #96bbf1");
		root.replace("--main-active: #4c7dd6");
		root.replace("--main-bg: #1c1c1c");
		root.replace("--main-color: #ffffff");
		root.replace("--right-bg: #2525258f");
		root.replace("--right-hover: #00000040");
		root.replace("--right-shadow: #000000b3");
		root.replace("--scroll-bg: #2b2b2b");
		root.replace("--scroll-line-bg: #575757");
		root.replace("--head-bg: #1c1c1c7d");
		root.replace("--head-shadow: #0a0a0abd");
		root.replace("--card-bg: #292929");
		root.replace("--card-shadow: #111111");
	}
	if (code == 2) {
		root.replace("--main: #719fe3");
		root.replace("--main-hover: #96bbf1");
		root.replace("--main-active: #4c7dd6");
		root.replace("--main-bg: #ffffff");
		root.replace("--main-color: #000000");
		root.replace("--right-bg: #ffffffab");
		root.replace("--right-hover: #0000001b");
		root.replace("--right-shadow: #00000057");
		root.replace("--scroll-bg: #d1d1d1");
		root.replace("--scroll-line-bg: #929292");
		root.replace("--head-bg: #ffffff12");
		root.replace("--head-shadow: #00000057");
		root.replace("--card-bg: #ffffff");
		root.replace("--card-shadow: #989898");
	}
}

//重复执行判断+切换配色
function forTurnMainColor() {
	turnMainColor(localStorage.color == 3 ? window.matchMedia("(prefers-color-scheme: dark)").matches ? 1 : 2 : localStorage.color);
	setTimeout("forTurnMainColor()", 0);
}

//配色模式图片切换
function mainColor() {
	var img = document.getElementById("color");
	var imgSrc = [
		"https://m.xiguacity.cn/post/6042be99fef5f8753d6c03c1/b60fa262-cfc1-406d-814c-2ffaf63baaf0.svg",//dark
		"https://m.xiguacity.cn/post/6042be99fef5f8753d6c03c1/5c2cac44-609e-490e-ade0-78db98454575.svg",//light
		"https://m.xiguacity.cn/post/6042be99fef5f8753d6c03c1/bfb1f419-05e8-45bd-ab38-4e79d6b40e04.svg"//system
	];
	var imgTitle = [
		"切换到「浅色主题」",
		"切换到「跟随系统」",
		"切换到「深色主题」"
	]
	img.src = imgSrc[localStorage.color - 1];
	img.title = imgTitle[localStorage.color - 1];
	img.onclick = function () {
		if (img.src == imgSrc[0]) {
			img.src = imgSrc[1];
			img.title = imgTitle[1];
			localStorage.color = 2;
		}
		else {
			if (img.src == imgSrc[1]) {
				img.src = imgSrc[2];
				img.title = imgTitle[2];
				localStorage.color = 3;
			}
			else {
				if (img.src == imgSrc[2]) {
					img.src = imgSrc[0];
					img.title = imgTitle[0];
					localStorage.color = 1;
				}
			}
		}
	}
}

//控制台输出
var log = {
	main: function () {
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
}

//运营了几天
function runDate() {
	const firstDay = new Date();
	firstDay.setFullYear(2022, 3, 15);
	var nowDay = new Date();
	return Math.round((nowDay - firstDay) / (1 * 24 * 60 * 60 * 1000));
}

//滚动Y到
function unlinedScrollY(doneY, speed = 2) {
	for (let y = scrollY; Math.abs(y - doneY) <= 0.1; y += (doneY - y) / speed) {
		scrollTo(scrollX, y);
	}
}

/*主要代码*/

//去除网址.html的后缀
if (location.href.indexOf(".html") != "-1") {
	location.href = location.href.slice(0, location.href.indexOf(".html"));
}
//页面加载完成后执行
window.onload = function () {
	localStorage.color = localStorage.color || 3;
	forTurnMainColor();
	mainColor();
	rightMouse();
	if (isPhone() && getWindow.width() < 520) {
		document.getElementById("time").remove();
	}
	else {
		doWtihTime.create();
		setInterval("doWtihTime.replace();", 0);
	}
	document.getElementsByClassName("head")[0].onselectstart = function () { return false; }
	document.getElementById("bottom").onselectstart = function () { return false; }
	log.main();
	hitokoto();
	document.body.style.overflow = "auto";
	document.getElementById("load").remove();
}