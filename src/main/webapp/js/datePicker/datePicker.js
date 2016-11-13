$(function(){
	 
	 /** 
	 * 时间对象的格式化; 
	 */  
	Date.prototype.format = function(format) {  
	    /* 
	     * eg:format="yyyy-MM-dd hh:mm:ss"; 
	     */  
	    var o = {  
	        "M+" : this.getMonth() + 1, // month  
	        "d+" : this.getDate(), // day  
	        "h+" : this.getHours(), // hour  
	        "m+" : this.getMinutes(), // minute  
	        "s+" : this.getSeconds(), // second  
	        "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter  
	        "S" : this.getMilliseconds()  
	        // millisecond  
	    }  
	  
	    if (/(y+)/.test(format)) {  
	        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4  
	                        - RegExp.$1.length));  
	    }  
	  
	    for (var k in o) {  
	        if (new RegExp("(" + k + ")").test(format)) {  
	            format = format.replace(RegExp.$1, RegExp.$1.length == 1  
	                            ? o[k]  
	                            : ("00" + o[k]).substr(("" + o[k]).length));  
	        }  
	    }  
	    return format;  
	}
	
	var nian = "年";
	var yue = "月";
	var ri = "日";


	var $1 = $;
	if( typeof(__$) != "undefined" ){
		$1 = __$;
	}

    var laydate = LD(window);
    var laydate2 = LD(window);

	$1('.date2').each(function(){
		var t = this;
		var custBtn = $1(t).find('.btn-r1:last');
		var hasZdy = $(custBtn).find('.lbl').length;
		var e1 = e2 = custBtn[0];
		var noclose = true;
		var ref1, ref2 ;
		function setCustomizeDRP(input, range){
			if(hasZdy==0){
				return;
			}
			e1['d1']=range[0];
			e2['d2']=range[1];
			input.click(function(){
	           function show1(max, start){
	                return laydate({
	                    elem: e1,
	                    max:max,
	                    elemv:'d1',
	                    isclear: false,
	                    issure: false,
	                    istoday: false,
	                    choose:function(d){
	                        ref2 = show2(d);
	                   },
	                    bfclose:function(reason){
	                        return noclose&&reason!='docclk';
	                    }
	                });
	            }

	            function show2(min, start){
	                return laydate2({
	                    elem: e2,
	                    min:min,
	                    elemv:'d2',
	                    isclear: false,
	                    istoday: false,
	                    choose:function(d){
	                        ref1 = show1(d);
	                   },
	                    bfclose:function(reason){
	                        return noclose&&reason!='docclk';
	                    },
	                    atfollow:function(box, tgtRect){
	                    	var objLeft= tgtRect.left;
	                    	if(objLeft>550){
	                        	objLeft = 550;
	                        }
	                        box.style.left = ((objLeft + box.offsetWidth + 3) + 'px');
	                    },
	                    okclick:function(d){
	                        noclose=false;
	                        if( ref1 ){
	                         ref1.close();
	                        }
	                        if( ref2 ){
	                         ref2.close();
	                        }
	                        noclose=true;

	                        var from = e1['d1'];
	                        var to = e2['d2'];
							input.siblings().removeClass('active dd');
							input.addClass('active');
							input.attr( 'v', (from||to)?(from +','+ to):'' );
							onSelect();
	                    }
	                });
	            }
	            ref1 = show1(e2['d2']);
	            ref2 = show2(e1['d1']);
           });
            noclose=false;
            if(ref1){
	            ref1.close();
            }
            if (ref2) {
           	 	ref2.close();
            }
            noclose=true;
		}
		//setCustomizeDRP(custBtn,[]);

		$1(t).find('.btn-r1').click(function(){
			//var dtfs = $1(this).find('.dtfs');
			var range = getDate();
			setCustomizeDRP( custBtn, range );
			return;
			//if( dtfs.length == 0){
			//	$1(this).siblings().removeClass('active dd');
			//	$1(this).addClass('active');
			//	var range = onSelect();
			//	setCustomizeDRP( custBtn, range );
			//	return;
			//}
		});

		$1(t).find('.btn-r1 .dtfs').on('click', function(evt){
			var target = evt.target;
			var clickOkBtn = $1(target).hasClass('ok');
			var clickCCBtn = $1(target).hasClass('cc');

			if( clickOkBtn || clickCCBtn ){
				var mainBtn = $1(target).parent().parent().parent();
				if( clickCCBtn ){
					mainBtn.removeClass('dd');
				} else  if(clickOkBtn){
					var val = mainBtn.attr('v');
					if( val ){
						mainBtn.removeClass('dd');
						mainBtn.siblings().removeClass('active');
						mainBtn.addClass('active');
					}
					
					onSelect();
				}
			}
			return false;
		});
		
		function onSelect(  ){
			var range = getDate();
			try{
				if( $.isFunction( t.onChange ) ){
					t.onChange( range );
				}
			}catch(e){
				
			}

			var curBtn = $1(t).find('.btn-r1.active');
			var dtfs = curBtn.find('.dtfs');
			var zdy = '自定义';
			var dao = ' 到 ';
			if( dtfs.length == 0){
				$1(t).find('.btn-r1 .lbl').html(zdy);
			} else {
				$1(t).find('.btn-r1 .lbl').html(range.join(dao));
			}
			return range;
		}
		t.getDateRange=function(){
			return getDate();
		}
		

		function getDate(){
			var curBtn = $1(t).find('.btn-r1.active');
			var today = new Date();
			var y = today.getFullYear();
			var m = today.getMonth();
			var d = today.getDate();
			if( curBtn.length == 1 ){
				
				var today = new Date();
				var from1 = (new Date( today.getTime() - 1*24*3600*1000 )).format('yyyy-MM-dd');
				var from7 = (new Date( today.getTime() - 7*24*3600*1000 )).format('yyyy-MM-dd');
				var from30 = (new Date( today.getTime() - 30*24*3600*1000 )).format('yyyy-MM-dd');
				//var from30 = (new Date( (m>=1?y:y-1), m>=1?m-1:11, d)).format('yyyy-MM-dd');
				var from360 = (new Date( y-1, m, d)).format('yyyy-MM-dd');
				today.setDate(today.getDate());
				var to = today.format('yyyy-MM-dd');

				var v = curBtn.attr('v');
				if( v=='last1'){
					return [from1, to];
				} else if( v == 'last7'){
					return [from7, to];
				} else if( v == 'last30'){
					return [from30, to];
				} else if( v == 'last365'){
					return [from360, to];
				} else if( v == 'last'){
					return [window.startDate||from360, to];
				} else {
					return v ? v.split(',') : "";
				}
			}
		}

		function daysOfMonth( y, m ){
			return 32-new Date( y, m, 32).getDate();
		}

	});
});
