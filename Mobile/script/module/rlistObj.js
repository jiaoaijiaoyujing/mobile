var rlistObj = Object.create(addressObj);
rlistObj = $.extend(rlistObj,{
	name:'餐厅列表页',
	dom:$('#rlist'),
	offset:0,
	init:function(){
		this.bindEvent();
			
	},
	enter: function(){
		this.dom.show();
		
		this.bannerInfo();

		this.bindEvent(); 

	},
	leave: function(){
		this.dom.hide();
		//移除掉我们的滚动事件
		window.removeEventListener('scroll', this.scrollInfo);		 	
	},
	changename:function(hash){
		var cityname = hash.split('-')[2];
		cityname = decodeURI(cityname);
		$('.rl-header span').html(cityname);
	},
	scrollInfo:function(event){
		var me = rlistObj;
		//console.log(window.scrollY + window.innerHeight === me.dom.height())
		if(window.scrollY + window.innerHeight === me.dom.height()){
			me.offset += 20;
			me.loadInfo(null,true);
		}
	},
	bindEvent:function(){

		var me = this;
		window.addEventListener('scroll', this.scrollInfo);
		var bullets = $("#position li");
		Swipe(document.getElementById('mySwipe'), {
	          auto: 0,
	          continuous: true,
	          disableScroll:false,
	          //loop:true,
	          callback: function(pos) {
	            console.log('滑动结束之后所执行回调函数');
	              var i = bullets.length;
	              while (i--) {
	                  bullets[i].className = ' ';
	              }
	              //为当前小数点实现高亮的处理
	              bullets[pos].className = 'cur';
	          }
	      });	
		$('.list-wrap').on('click','.content-wrap',function(){
			console.log('我被点击了');
			//console.log(this);
			
			//console.log(two);
			window.location.href='#detail-' + this.two + '-' + this.dataset.id + '-' + this.dataset.lat + '-' + this.dataset.lng;
			//console.log(this.dataset.id)
		})

	},
	bannerInfo:function(){
		$.ajax({
			url:'/v2/index_entry',
			type:'get',
			data:{
				geohash:'yb4h6xpb7w6',
				group_type:1,
				flags:'[F]',
			},
			success:function(res){
				var html = '';
				for(var i = 0 ; i < 8; i++){
					html += 
					'<a href="javascript:;" class="ban-wrap">'+
					  '<div class="imgcont">'+
					    '<img src="//fuss10.elemecdn.com/'+ res[i].image_url +'" alt="">'+
					  '</div>'+
					  '<p>'+res[i].title+'</p>'+
					'</a>'
				}
				$('.item1').html(html);
				var ht='';
				for(var i = 8 ; i < res.length ; i++){
					ht += 
					'<a href="javascript:;" class="ban-wrap">'+
					  '<div class="imgcont">'+
					    '<img src="//fuss10.elemecdn.com/'+ res[i].image_url +'" alt="">'+
					  '</div>'+
					  '<p>'+res[i].title+'</p>'+
					'</a>'
				}
				$('.item2').html(ht);
				var two = hash.split('-')[1];
			},
			error:function(){
				console.log('banner信息加载失败')
			}
		})
	},
	loadInfo: function(locObj, flag){
		console.log(locObj)
		locObj = locObj || Store('ele');
		var lat = locObj.lat;
		var lng = locObj.lng;
		var me = this;
		if(!!flag === false) {
			$('.list-wrap').html('');
		}
		//console.log(5)
		$.ajax({
			url: '/shopping/restaurants',
			data: {
				latitude: lat,
				longitude:lng,
				offset:this.offset,
				limit:20,
				//extras[]:activities
				extras:['activities']
			},
			success: function(res){
				//console.log(res); 
				var str = "";
				if(res.length === 0) {
					$('.list-wrap').addClass('overlist')
				}else {
					$('.list-wrap').removeClass('overlist')
				}

				for(var i =0; i < res.length; i++) {
					var imgstr = res[i].image_path;
					//var a = imgstr.substring(0,1);
					var a = imgstr.charAt(0);
					var b = imgstr.substring(1,3);
					var c = imgstr.slice(3);
					var d = imgstr.slice(32);
					var imgpath = a+ '/' + b + '/' + c + '.' + d + '?imageMogr/format/webp/thumbnail/!130x130r/gravity/Center/crop/130x130/';

					str += '<div class="content-wrap" data-id="'+ res[i].id +'"  data-lat="'+ res[i].latitude +'" data-lng="'+ res[i].longitude +'"><div class="img-wrap"><img class="img-cont" src="//fuss10.elemecdn.com/'+ imgpath +'" alt="" /></div><div class="listright"><ul class="res-list"><li>'+ res[i].name+'</li></ul><div class="month">月销'+ res[i].recent_order_num +'单</div><div class="peisong">￥'+res[i].float_minimum_order_amount+'元起送/配送费￥'+res[i].float_delivery_fee+'<span class="spwrap"><span class="mi">'+ res[i].distance +'m</span>/<span class="fenzhong">'+ res[i].order_lead_time +'分钟</span></span></div></div></div>';
					//console.log(res[i])
				}

				$('.list-wrap').append(str);
			}
		})		 	
	},
	loadReslist: function(hash){
		//var locInfo = localStorage.getItem('gyf'); //从本地缓存取数据
		console.log(Store('ele'))
		var locInfo = Store('ele');
		var me = this;
		if(!locInfo) {
			$.ajax({
				url: '/v1/pois/' + hash.split('-')[1],
				type: 'get',
				success: function(res){
					console.log('我获取到了地理数据', res);	
					var obj = {
						lat: res.latitude,
						lng: res.longitude
					};
					Store('ele', obj);
					//localStorage.setItem('gyf', JSON.stringify(obj))
					me.loadInfo(obj);
				}
			})
			return;
		}

		//locInfoObj = JSON.parse(locInfo); //对取出来的缓存字符串进行解析，让其变成真正的对象
		this.loadInfo(locInfo); //加载餐厅列表的信息
		/*var lat = hash.split('-')[1];
		var lng = hash.split('-')[2];*/
			 	
	}
})