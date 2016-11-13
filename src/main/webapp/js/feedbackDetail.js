(function(h,q){h.fn.bootpag=function(p){function m(c,b){b=parseInt(b,10);var d,e=0==a.maxVisible?1:a.maxVisible,k=1==a.maxVisible?0:1,n=Math.floor((b-1)/e)*e,f=c.find("li");a.page=b=0>b?0:b>a.total?a.total:b;f.removeClass(a.activeClass);d=1>b-1?1:a.leaps&&b-1>=a.maxVisible?Math.floor((b-1)/e)*e:b-1;a.firstLastUse&&f.first().toggleClass(a.disabledClass,1===b);e=f.first();a.firstLastUse&&(e=e.next());e.toggleClass(a.disabledClass,1===b).attr("data-lp",d).find("a").attr("href",g(d));k=1==a.maxVisible?
0:1;d=b+1>a.total?a.total:a.leaps&&b+1<a.total-a.maxVisible?n+a.maxVisible+k:b+1;e=f.last();a.firstLastUse&&(e=e.prev());e.toggleClass(a.disabledClass,b===a.total).attr("data-lp",d).find("a").attr("href",g(d));f.last().toggleClass(a.disabledClass,b===a.total);e=f.filter("[data-lp="+b+"]");k="."+[a.nextClass,a.prevClass,a.firstClass,a.lastClass].join(",.");if(!e.not(k).length){var m=b<=n?-a.maxVisible:0;f.not(k).each(function(b){d=b+1+n+m;h(this).attr("data-lp",d).toggle(d<=a.total).find("a").html(d).attr("href",
g(d))});e=f.filter("[data-lp="+b+"]")}e.not(k).addClass(a.activeClass);l.data("settings",a)}function g(c){return a.href.replace(a.hrefVariable,c)}var l=this,a=h.extend({total:0,page:1,maxVisible:null,leaps:!0,href:"javascript:void(0);",hrefVariable:"{{number}}",next:"&raquo;",prev:"&laquo;",firstLastUse:!1,first:'<span aria-hidden="true">&larr;</span>',last:'<span aria-hidden="true">&rarr;</span>',wrapClass:"pagination",activeClass:"active",disabledClass:"disabled",nextClass:"next",prevClass:"prev",
lastClass:"last",firstClass:"first"},l.data("settings")||{},p||{});if(0>=a.total)return this;h.isNumeric(a.maxVisible)||a.maxVisible||(a.maxVisible=parseInt(a.total,10));l.data("settings",a);return this.each(function(){var c,b,d=h(this);c=['<ul class="',a.wrapClass,' bootpag">'];a.firstLastUse&&(c=c.concat(['<li data-lp="1" class="',a.firstClass,'"><a href="',g(1),'">',a.first,"</a></li>"]));a.prev&&(c=c.concat(['<li data-lp="1" class="',a.prevClass,'"><a href="',g(1),'">',a.prev,"</a></li>"]));for(b=
1;b<=Math.min(a.total,a.maxVisible);b++)c=c.concat(['<li data-lp="',b,'"><a href="',g(b),'">',b,"</a></li>"]);a.next&&(b=a.leaps&&a.total>a.maxVisible?Math.min(a.maxVisible+1,a.total):2,c=c.concat(['<li data-lp="',b,'" class="',a.nextClass,'"><a href="',g(b),'">',a.next,"</a></li>"]));a.firstLastUse&&(c=c.concat(['<li data-lp="',a.total,'" class="last"><a href="',g(a.total),'">',a.last,"</a></li>"]));c.push("</ul>");d.find("ul.bootpag").remove();d.append(c.join(""));c=d.find("ul.bootpag");d.find("li").click(function(){var b=
h(this);if(!b.hasClass(a.disabledClass)&&!b.hasClass(a.activeClass)){var c=parseInt(b.attr("data-lp"),10);l.find("ul.bootpag").each(function(){m(h(this),c)});l.trigger("page",c)}});m(c,a.page)})}})(jQuery,window);

function getQueryString(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(unescape(r[2])); return null;
}

window.Util = {
		getQueryString: function(name){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		    var r = window.location.search.substr(1).match(reg);
		    if (r != null) return decodeURIComponent(unescape(r[2])); return null;
		},
		ajax: function(opt){
			$.ajax({
				url: opt.url,
	    		type: 'post',
	    		data: opt.data,
	    		success: function(data){
	    			if(data.code == -2){
	    				window.location.href = 'logout';
	    			}else{
	    				opt.success(data);
	    			}
	    		}
			})
		}
	};

var ID = getQueryString('id');

function html_encode(str){   
	  var s = "";   
	  if (str.length == 0) return "";   
	  s = str.replace(/&/g, "&gt;");   
	  s = s.replace(/</g, "&lt;");   
	  s = s.replace(/>/g, "&gt;");   
	  s = s.replace(/ /g, "&nbsp;");   
	  s = s.replace(/\'/g, "&#39;");   
	  s = s.replace(/\"/g, "&quot;");   
	  s = s.replace(/\n/g, "<br>");
	  s = s.replace(/	/g, "  ");
	  return s;   
	}   

$(function(){
	$('#VeriImg').attr('src', 'cd/code');
	
	$('#VeriCode').keyup(function(){
		$('#VeriError').hide();
	})
	
	$('#VeriImg').click(function(){
		$(this).attr('src', 'cd/code?'+new Date().getTime());
	})
	
	
	Util.ajax({
		url: 'cc/getArticleByID',
		data: {
			article_id: ID
		},
		success: function(data){
			$('#ArticleTit').html(data.data.title);
			$('#ArticleTit1').html(data.data.context);
			$('#ArticleUser').html(data.data.lenovoId);
			$('#ArticleDate').html(data.data.date);
			$('#ArticleCon').html(data.data.context);
			$('#ArticleReplyNum').html(data.data.messageCount);
		}
	})
	
	
	function getHot(){
		Util.ajax({
			url: 'cc/getHot',
			success: function(data){
				$.each(data.data, function(k, v){
					$('#ArticleHot').append('<li><i class="icon"></i>'
						+'<a href="forumDetail.html?id='+v.article_id+'" class="tit">' + v.title + '</a>'
						+'<div class="date">' + v.date +'</div>'
					+'</li>')
				})
			}
		})
	}
	
	function circleHtml(data){
		var _html = '';
		if(data.topFloor != undefined){
			_html += '<div class="ref">'
			_html += circleHtml(data.topFloor);
			
			_html += '<div class="tit">引用来自："' + data.topFloor.lenovoId + '" 的评论</div>'
				+'<div class="replyCon">' + data.topFloor.message + '</div>'
				+'</div>';
		}
		return _html;
	}
	
	
	function getList(num){
		Util.ajax({
			url: 'cc/getMessage',
			data: {
				article_id: ID,
				page: num || 1,
				pageSize: 10
			},
			success: function(data){
				$('#ArticleReply').html('');
				$.each(data.data.rows, function(k, v){
					var _html = '';
					
					_html += '<li>'
						+'<div class="floorNum">'+ v.floor + '#</div>'
						+'<div class="tit"><b>' + v.lenovoId + '</b> 发表于：' + v.date + '<a href="javascript:;" class="replyLink">回复此评论</a></div>';
					
					_html += circleHtml(v);
					
					_html += '<div class="replyCon">' + v.message + '</div>'
					_html += '<div class="replyForm">'
							+'<ul>'
							+'<li>'
							+'<textarea class="textarea"></textarea>'
							+'</li>'
							+'<li>'
							+'<a href="javascript:;" class="btn replyBtn" data-id="'+v.message_id+'">Submit</a>'
							+'<a href="javascript:;" class="btn replyClose">Close</a>'
							+'</li>'
							+'</ul>'
							+'</div>'
					+'</li>';
					
					$('#ArticleReply').append(_html);
				})
	
				$('#Page').html('<div class="inner"></div>');
				$('#Page .inner').bootpag({
		            total: Math.ceil(data.data.total/10),
		            page: data.data.pageIndex,
		            maxVisible: 10
		        }).on('page', function(event, num){
		        	getList(num);
		        });
			}
		})
	}
	
	getList();
	getHot();
	
	$('#Reply').click(function(){
//		Util.ajax({
//			url: 'cd/checkCode?code=' + $('#VeriCode').val(),
//			success: function(data){
//				if(data.code == 1){
					Util.ajax({
						url: 'cc/saveMessage',
						data: {
							article_id: ID,
							message: encodeURIComponent(html_encode($('#AddCon').val())),
							top_id: 16
						},
						success: function(data){
							window.scrollTo(0,0);
							getList();
							
							$('#AddCon').val('');
							$('#VeriCode').val('');
							$('#VeriImg').attr('src', 'cd/code?'+new Date().getTime());
						}
					})
//				}else{
//					$('#VeriError').show();
//				}
//			}
//		})
	})
	
	
	$('#ArticleReply').on('click', '.replyLink', function(){
//		if($('.header .menu .userName').length > 0){
			$(this).parents('li').find('.replyForm').show();
//		}else{
//			$(this).parents('li').find('.replyForm').html('<div class="loginTip">您还未登录， <a href="cb/login">登录>></a></div>').show();
//		}
	})
	
	$('#ArticleReply').on('click', '.replyClose', function(){
		$(this).parents('.replyForm').hide();
	})
	
	$('#ArticleReply').on('click', '.replyBtn', function(){
		var _id = $(this).attr('data-id');
		var _text = $(this).parents('li').find('.textarea').val();
		Util.ajax({
			url: 'cc/saveMessage',
			data: {
				article_id: ID,
				message: encodeURIComponent(html_encode(_text)),
				top_id: _id
			},
			success: function(data){
				getList();
			}
		})
	})
	
	
})