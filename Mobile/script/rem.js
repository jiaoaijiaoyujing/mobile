(function(){
	//自执行函数，目的就是不污染全局环境
	//console.log('进行自适应布局的根元素字体大小的设置');
	//怎么动态计算不同设备下，根元素的字体大小
	//第一步：获取不同设备下的设备的宽度
	var clientWidth = document.documentElement.clientWidth;
	//第二步：为不用设备设置不同的根元素的字体大小
	document.documentElement.style.fontSize = clientWidth * (20/320) + 'px';
	//console.log(document.documentElement.style.fontSize = clientWidth * (10/320) + 'px')
})();