//alert(1)
var addressObj = {
	name:'地址搜索页',
	dom:$('#address'),
	init:function(){
		//模块初始化的方法
		this.bindEvent();//绑定事件用的，所有的事件都卸载bindEvent中
	},
	changeCity:function(hash){
		console.log('城市改变',hash);
		var cityname = hash.split('-')[1] || '上海';
		cityname = decodeURI(cityname);
		$('#changescity').html(cityname);
		this.cityID = hash.split('-')[2];
		//百度城市的id
		this.bcid = hash.split('-')[3];	
	},

	bindEvent:function(){
		var me = this;
		console.log('准备绑定事件');
		var button = $('#query');
		var baidu = $("#baidu");
		//input事件
		$('#keyword').on('input',function(event){
			var word = $("#keyword").val();
			$.ajax({
				url:'/v1/pois',
				data:{
					city_id: me.cityID || 1,
					keyword: word,
					type: 'search'
				},
				type:'get',
				success:function(res){
					console.log('input事件成功');
					var str = '';
					for(var i = 0 ; i < res.length ; i ++){
						str += '<li>'+res[i].name+'</li>'
					}
					$('#list').html(str)
				}
			})
		})
		//点击搜索后的地址和商圈列表进入附近的商家
		$('#list').on('click','li',function(){
			console.log('我被点击了');
			console.log(this);
			var locInfo = {
				lat: this.dataset.lat,
				lng: this.dataset.lng
			}
			Store('ele', locInfo);
			var hc = encodeURI(this.dataset.name);
			window.location.href='#rlist-' + this.dataset.geo +'-'+ hc;
			//console.log(this.dataset.name);
			$('.rl-header span').html(hc);
			
		})
		// 饿了么的搜索
		button.click(function(event){
			console.log('我被查询了');
			var word = $("#keyword").val();
			
			$.ajax({
				//url: '/v1/pois?city_id=1&keyword='+ word  +'&type=search',
				url: '/v1/pois',
				data: {
					city_id:  me.cityID || 1,
					keyword: word,
					type: 'search'
				},
				type: 'get',
				success: function(res){
					console.log('我请求成功了');
					var str = "";
					for(var i =0; i < res.length; i++) {
						str += '<li data-geo="'+ res[i].geohash +'" data-lng="'+ res[i].longitude +'" data-lat="'+ res[i].latitude +'" data-name = "'+  res[i].name +'">'+ res[i].name +'</li>'
						console.log(res[i].name)

					}	
					$("#list").html(str);
				},
				error: function(){
					console.log('我请求失败了');	 	
				}
			})
		});

		//百度外卖的搜索
		baidu.click(function(event){
			console.log('百度外卖搜索');
			var word = $("#keyword").val();
			$.ajax({
				url: '/waimai',
				dataType: 'json',
				data: {
					qt:'poisug',
					wd: word,
					cb:'suggestion_1483600579740',
					cid:me.bcid || 289,
					b:'',
					type:0,
					newmap:1,
					ie:'utf-8'
				},
				success: function(res){
					console.log(res);
					console.log('我请求成功了');
					var str = "";
					for(var i =0; i < res.s.length; i++) {
						str += '<li>'+ res.s[i] +'</li>'
					}	
					$("#list").html(str);	 	
				},
				error: function(res){
					console.log('我请求失败了');	 	
				}
			})	 	
		});

	},
	enter:function(){
		//进入该模块，我们把一个页面作为一个模块
		this.dom.show();
	},
	leave:function(){
		//离开该模块
		this.dom.hide();
	}
}