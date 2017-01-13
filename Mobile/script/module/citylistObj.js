var citylistObj = Object.create(addressObj);
citylistObj = $.extend(citylistObj,{
	name:'城市选择页',
	dom:$('#citylist'),
	baiduCityMap:{},
	init:function(){
		this.loadBaiduCity();
		this.posi_city();
		
		this.bindEvent();
	},
	bindEvent:function(){
		$('.louti').on('click','a',function(){
			console.log('我是字母我被点击了');
			var selector = "[data-city='"+ this.innerHTML +"']";
			//selector = [data-city="A"]
			var offsetTop = $(selector).offset().top;

			window.scrollTo(0, offsetTop);
		})
	},

	posi_city:function(){
		//获取定位城市的数据
		$.ajax({
			url:'/v1/cities',
			data:{
				type:'guess'
			},
			type:'get',
			success:function(res){
				console.log('定位城市加载成功');
				var str = '';
				str = res.name;
				$('#city').html(str);
			},
			error:function(){
				console.log('定位城市加载失败');
			}
		})
	},		
	hot_city:function(){
		//获取热门城市的数据
		var me = this;
		$.ajax({
			url:'/v1/cities',
			data:{
				type:'hot'
			},
			type:'get',
			success:function(res){
				console.log('热门城市加载成功');

				var str = '';
				for(var i = 0 ; i < res.length ; i ++){
					var hc = encodeURI(res[i].name);
					//console.log(me.baiduCityMap);
					var bcid = me.baiduCityMap[res[i].name];
					//console.log(bcid)
					//console.log(res[i]);
					str += '<a href="#address-'+hc+'-'+res[i].id+'-'+bcid+'">'+res[i].name+'</a>';
				}
				$('#hotcity').html(str);
			},
			error:function(){
				console.log('热门城市加载失败')
			}
		})
	},
	louti_city:function(arr){
		var str = '';
		for(var i = 0 ; i < arr.length ; i ++){
			//console.log(arr[i])
			str += '<a href="javascript:;">'+ arr[i] +'</a>'
		}
		$('.louti').html(str);
	},
	xiangqing_city:function(arr){
		var me = this;
		var str = '';
		for(var i = 0 ; i < arr.length ;i ++){
			var hc = encodeURI(arr[i].name);
			//console.log(arr[i].name)
			var bcid = me.baiduCityMap[arr[i].name];
			//console.log(bcid)
			/*if(bcid == undefined){
				continue;
			}*/
			str += '<a href="#address-'+hc+'-'+ arr[i].id +'-'+bcid+'">'+ arr[i].name +'</a>'
		}
		return str;
		console.log(str)
	},
	letter_city:function(){
		var me = this;
		//获取所有城市的数据
		$.ajax({
			url:'/v1/cities',
			data:{
				type:'group'
			},
			type:'get',
			success:function(res){
				console.log(res);
				console.log('所有字母开头城市加载成功');
				var arr = [];
				for(var key in res){
					arr.push(key);
				};
				arr.sort();
				//console.log(arr);
				me.louti_city(arr);
				//以上城市首字母排序已经获取到
				var str = '';
				for(var i = 1 ; i < arr.length ; i++){
					//console.log(res[arr[i]])
					str += 
					'<div class="letter_wrap">'+
						'<p class="letters" data-city="'+ arr[i] +'">'+arr[i]+'</p>'+
						'<div class="hotcity" id="lettercity">'+
							me.xiangqing_city(res[arr[i]])+
						'</div>'+
					'</div>';
				} 
				$('.All-wrap').html(str);
			},
			error:function(){
				console.log('所有字母开头城市加载失败');
			}
		})
	},
	loadBaiduCity: function(){
		var me = this;
		$.ajax({
			url: '/waimai?qt=getcitylist&format=1&t=1483686354642',
			dataType: 'json',
			success: function(res){
				//console.log(res); 
				var arr = [];
				var map = res.result.city_list;
				for(var key in map){
					//key 是 ABCDE
					//map[key] 就相当于 Array[50]
					arr = arr.concat(map[key])
				}
				//console.log(arr); //把所有的城市 都转变成了一维的数组

				//将一维的数组 转变成 对象（城市名与城市id互相映射的对象）
				var baiduCityMap = {};
				for(var i =0; i < arr.length; i++) {
					//动态进行对象的创建
					baiduCityMap[arr[i].name] = arr[i].code;
				}
				me.baiduCityMap = baiduCityMap;
				me.hot_city();
				me.letter_city();

			},
			error: function(){
				console.log('百度城市错误');	 	
			}
		})		 	
	},
})