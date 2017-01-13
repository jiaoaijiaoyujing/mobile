
var detailObj = Object.create(addressObj);
detailObj = $.extend(detailObj,{
	name:'餐厅详情页',
	dom:$('#detail'),
	init:function(){
		this.bindEvent();
	},
	bindEvent:function(){
		var me = this;
		$('.navlist').on('click','li',function(){
			console.log('我是li我被点击了');
			$(this).addClass('active');
			$(this).siblings().removeClass('active');
			var selector = '[data-title="'+ this.innerHTML +'"]';
			var curelem = $(selector).get(0);
			//console.log(selector);
			//console.log(this.innerHTML);
			//console.log( $(selector).get(0));
			rightScroll.scrollToElement(curelem, 500);
		});
		$('.carhuiimg').on('click',function(){
			$('.carmessage').toggle();
		});
		$('.cont-right').on('click','.plus',function(){
			var Total = 0;
			//console.log(this);
			$(this).siblings('.num').css('display','inline-block');
			$(this).siblings('.minus').css('display','inline-block');
			$('.car').addClass('caractive');
			$('.carhuiimg').addClass('gwcactive');
			$('.carnum').css('display','inline-block');
			var curNumDom = $(this).closest('.food-detail').find('.num');
			//console.log(curNumDom)
			var curPrice =  $(this).closest('.food-detail').find('.price').text(); //获取当前的价格
			var curNum = +curNumDom.text();
			curNum++;
			curNumDom.text(curNum);
			//console.log(curPrice)
			//console.log(curNumDom.text())
			//var oneTotalPrice = curPrice*curNum;
			//console.log(oneTotalPrice);//单个商品的总价
			me.carTotalSnum();
		});
		$('.cont-right').on('click','.minus',function(){
			//console.log(this);
			var curNumDom = $(this).closest('.food-detail').find('.num');
			var curPrice =  $(this).closest('.food-detail').find('.price').text(); //获取当前的价格
			var curNum = +curNumDom.text();
			curNum--;
			curNumDom.text(curNum);
			console.log(curPrice);
			console.log(curNumDom.text());
			if(curNumDom.text() == 0){
				$(this).siblings('.num').css('display','none');
				$(this).css('display','none');
				/*$('.car').removeClass('caractive');
				$('.carhuiimg').removeClass('gwcactive');
				$('.carnum').css('display','none');*/
			}
			me.carTotalSnum();
		})
	},
	loadInfo: function(hash){
		this.id = hash.split('-')[2];
		this.lat = hash.split('-')[3];
		this.lng = hash.split('-')[4];
		this.loadHeaderInfo(); 	//加载餐厅头部信息
		this.loadResInfo();    //加载餐厅详情页信息
	},
	loadHeaderInfo: function(){
		console.log(1)
		$.ajax({
			url:'/shopping/restaurant/' + this.id,
			data:{
				extras:['activities','album','license','identification','statistics'],
				latitude:this.lat,
				longitude:this.lng
			},
			success:function(res){
				console.log('获取头部信息对了');
				console.log(res);
				var html = '';
				var activities = res.activities[0].description;
				var imgstr = res.image_path;
				//console.log(imgstr);
				var a = imgstr.substring(0,1);
				var b = imgstr.substring(1,3);
				var c = imgstr.slice(3);
				var d = imgstr.slice(32);
				var imgpath = a+ '/' + b + '/' + c + '.' + d;
				
				html +=
				'<div class="header-top">'+
					'<div class="headtop-wrap">'+
						'<img src="https://fuss10.elemecdn.com/'+ imgpath +'?imageMogr/quality/80/format/webp/" alt="">'+
						'<div class="headtop-right">'+
							'<h3>'+ res.name +'</h3>'+
							'<p>'+
								'<span>'+ res.order_lead_time +'分钟送达/</span>'+
								'<span>'+ res.piecewise_agent_fee.tips +'</span>'+
							'</p>'+
							'<div>'+ activities +'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="header-bot">'+
					'<div>'+
						'<span>公告</span>'+
						'<b>'+ res.promotion_info +'欢迎光临，用餐高峰期请提前下单，谢谢。</b>'+
					'</div>'+
				'</div>';
				$('.header').html(html);
				$('.header').css('background-image','url(https://fuss10.elemecdn.com/'+ imgpath +'?imageMogr/quality/80/format/webp/thumbnail/!40p/blur/50x40/')
			},
			error:function(){
				console.log('获取头部信息失败了');
			}
		})
	},
	renderLeftPane: function(res){
		//渲染左边导航条部分	
		var str = "";
		for(var i = 0; i < res.length; i++) {
			str += '<li class="tit-cont">'+ res[i].name +'</li>'
		}
		$('.navlist').html(str);
	},
	renderSingleList: function(res){
		var str = "";	
		for(var i = 0 ; i < res.length; i++) {
			//console.log(res[i].name)
			//获取图片
			if(res[i].image_path != null){
				var imgstr = res[i].image_path;
				var a = imgstr.substring(0,1);
				var b = imgstr.substring(1,3);
				var c = imgstr.slice(3);
				var d = imgstr.slice(32);
				var imgpath = a+ '/' + b + '/' + c + '.' + d;
			}else{
				var imgpath = '';
			}
			if(res[i].specfoods[0].original_price){
				str += 
				'<div class="food-info">'+
						'<span class="img-info">'+
							'<img src="//fuss10.elemecdn.com/'+ imgpath +'?imageMogr/thumbnail/140x140/format/webp/quality/85" alt="">'+
						'</span>'+
						'<div class="food-detail">'+
							'<h3>'+ res[i].name +'</h3>'+
							'<p>'+res[i].description+'</p>'+
							'<p>'+res[i].tips+'</p>'+
							'<div>'+
							'<b class="fuhao">￥</b>'+
								'<span class="price">'+res[i].specfoods[0].price+'</span>'+
								'<span class="spice">￥'+res[i].specfoods[0].original_price+'</span>'+
								'<span class="num-area">'+
									'<span class="minus">-</span>'+
									'<span class="num">0</span>'+
									'<span class="plus">+</span>'+
								'</span>'+
							'</div>'+
						'</div>'+
					'</div>'
			}else{
				str += 
				'<div class="food-info">'+
					'<span class="img-info">'+
						'<img src="//fuss10.elemecdn.com/'+ imgpath +'?imageMogr/thumbnail/140x140/format/webp/quality/85" alt="">'+
					'</span>'+
					'<div class="food-detail">'+
						'<h3>'+ res[i].name +'</h3>'+
						'<p>'+res[i].description+'</p>'+
						'<p>'+res[i].tips+'</p>'+
						'<div>'+
						'<b class="fuhao">￥</b>'+
							'<span class="price">'+res[i].specfoods[0].price+'</span>'+
							'<span class="num-area">'+
								'<span class="minus">-</span>'+
								'<span class="num">0</span>'+
								'<span class="plus">+</span>'+
							'</span>'+
						'</div>'+
					'</div>'+
				'</div>'
			}
			//console.log(res[i].specfoods[0].price);
			//console.log(res[i].specfoods[0].original_price);
			//console.log(res[i].specfoods[0].original_price == null)
		}
		return str;	 	
	},
	renderRightPane: function(res){
		//渲染右边实物详情的部分	
		var str = "";
		for(var i = 0; i < res.length; i++) {
			str += 
			'<div class="food-item">'+
				'<h2 data-title="'+ res[i].name +'">'+ res[i].name +'</h2>'+
				this.renderSingleList(res[i].foods)+
			'</div>';

		}
		$('.foodlist').html(str);

		//初始化滚动条
		window.leftScroll = new IScroll('.cont-left',{
			scrollbars:false,//不显示滚动条
			preventDefault:false,//不阻止点击事件
			bounce:false//不让其弹动
		});
		window.rightScroll = new IScroll('.cont-right',{
			scrollbars:false,
			preventDefault:false,
			bounce:false,
			probeType:2//设置滚动条的灵敏度,监听滚动的事件,1迟钝2中等3灵敏，但是灵敏，手机的负担越大
		});
		//获取每一个食品主题的对应高度，用一个数组缓存起来
		this.cacheMaplist = [];
		var num = 0;
		var me = this;
		$('.food-item').each(function(index,value){
			num += $(value).height();
			me.cacheMaplist.push(num);
		})
		//console.log(me.cacheMaplist)//[855, 1075, 1295, 1477, 2853, 3166, 3906, 4162, 5505, 6005, 6898, 7305, 7993, 8587, 9275, 9401, 9564]
		var leftItem = $('.navlist').find('li');
		
		rightScroll.on('scroll', function(event){
			console.log('我正在滚动'); 	
			//console.log('disty-->', rightScroll.distY);
			//console.log('y-->', rightScroll.y);//rightScroll.y的值最接近
			//console.log('pointY-->', rightScroll.pointY);
			//[876, 1170, 1620, 3660, 4208, 4766, 6212, 7288, 7550, 8330]
			for(var i =0; i < me.cacheMaplist.length; i++) {
				// 10 >= 876  0
				if(Math.abs(rightScroll.y) <= me.cacheMaplist[i]) {
					leftItem.removeClass('active');
					leftItem.eq(i).addClass('active');
					break;
				}
			}
		})
	},
	loadResInfo: function(){
		var me = this;
		$.ajax({
			url: '/shopping/v2/menu?restaurant_id=' + this.id,
			success: function(res){
				console.log(res);
				me.renderLeftPane(res);
				me.renderRightPane(res);
			},
			error: function(){
				console.log('failed');
			}
		})	 	
	},
	carTotalSnum:function(){
		//购物车的总数量c_num、总价格Total
		var c_num = 0;
		var Total = 0;
		var $num = $('.num');
		var $price = $('.price');
		for(var i = 0 ; i < $num.length ; i++){
			c_num += Number($num.eq(i).html());
		}	
		$('.carnum').html(c_num);
	}
})