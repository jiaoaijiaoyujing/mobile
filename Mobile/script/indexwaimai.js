function Store(nameSpace, data){
	//多态  用同一个API,去实现不同方法（存、取操作）
	if(data) {
		//存操作
		localStorage.setItem(nameSpace, JSON.stringify(data));
		return;
	}
	return JSON.parse(localStorage.getItem(nameSpace))	 	
}

//创建一个hash值 与模块 映射关系表
var hashMap = {
	address:addressObj,
	citylist:citylistObj,
	rlist:rlistObj,
	detail:detailObj
}
var cacheMap = {
	//判断模块是否初始化的映射关系表
}
var prevModule = null;//前一个模块
var curModule = null;//当前模块

function routeController(hash){
	var khash = '';
	var module = hashMap[hash] || hashMap['address'];
	if(hash.indexOf('address') !== -1) {
		module = addressObj;
		khash = 'address';
		module.changeCity(hash); //改变城市
	}

	if(hash.indexOf('rlist') !== -1){
		module = rlistObj;
		khash = 'rlist';
		module.loadReslist(hash); //加载餐厅列表
		module.changename(hash);
	}
	if(hash.indexOf('detail') !== -1){
		module = detailObj;
		khash = 'detail';
		module.loadInfo(hash);
	}
	prevModule = curModule;//前一个模块等于现在的模块
	curModule = module;//当前模块等于hashMap[hash]的页面
	if(prevModule){
		prevModule.leave()
	}
	curModule.enter();
	//curModule.init();//执行当前模块的初始化操作
	if(!cacheMap[khash]) {
		//该模块没有被初始化过
		curModule.init();
		cacheMap[khash] = true;
		/*cacheMap = {
			address-天津: true,
			address-上海: true,
			address: true
		}*/
	}
	//curModule.init(); //执行当前模块的初始化操作
	
}
if(location.hash){
	var hash = location.hash.slice(1);
	routeController(hash)
}else{
	routeController('address')
}
window.onhashchange = function(){
	var hash = location.hash.slice(1);//支持负数的下标
	//var hash = location.hash.substring(1);//其他的和slice的功能都一样，用于数组、字符串的截取
	//console.log(location.hash.substring(1))
	routeController(hash)
}