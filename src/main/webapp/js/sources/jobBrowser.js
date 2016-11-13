$(function(){
	var _pathName = window.location.pathname;
	_pathName = _pathName.substring(1, _pathName.lastIndexOf('/'));
	
	window.UserName = $('#UserName').html() + '_' + _pathName + '_';
	var AppList = {};
	
	function getTimeL(ms) { 
		var day = Math.floor(ms / (60 * 60 * 24 * 1000));
		var hour = Math.floor(ms / (3600 * 1000)) - (day * 24);
		var minute = Math.floor(ms / (60 * 1000)) - (day * 24 * 60) - (hour * 60);
		var second = Math.floor(ms / 1000) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
	      
	    var sb = [];  
	    if(day > 0) {  
	        sb.push(day+"d");  
	    }  
	    if(hour > 0) {  
	        sb.push(hour+"h");  
	    }  
	    if(minute > 0) {  
	        sb.push(minute+"m");  
	    }  
	    if(second > 0) {  
	        sb.push(second+"s");  
	    }else{
	    	sb.push("0s");
	    }
	    return sb.join(':');  
	} 
	
	// 应用列表
	function getAppList(){
		Util.ajax({
			url: 'entry/getApplication',
			success: function(data){
				var _html = '<div class="keywordSearch"><input type="text" class="form-control" id="UserKeyword" placeholder="Search..."></div><ul class="dropdownMenu">';
				$.each(data.data, function(k, v){
					_html += '<li data-user="'+v.appUser+'" data-name="'+v.appName+'"><a href="javascript:;">'+v.appName+'</a></li>';
					AppList[v.appUser] = v.appName;
				});
				
				_html += '</ul>'
				
				$('#UserList').html(_html);
				if(store.get(UserName + 'user') && AppList[store.get(UserName + 'user').split('||')[0]] != undefined){
					$('#UserSel').html(store.get(UserName + 'user').split('||')[1]).data('user', store.get(UserName + 'user').split('||')[0]);
				}else{
					$('#UserSel').html(data.data[0].appName).data('user', data.data[0].appUser);
				}
				
				getJobList();
				
				// 查询用户
				$('#UserKeyword').keyup(function(e){
					switch(e.keyCode){
				        case 13: // enter
				        case 16: // shift
				        case 17: // ctrl
				        case 37: // left
				        case 38: // up
				        case 39: // right
				        case 40: // down
				            break;
				        case 27: // esc
				            break;
				        default:
				        	$('#UserList').scrollTop(0);
					    	$('#UserList li').each(function(){
					    		if(!$(this).hasClass('keywordSearch')){
					    			var _keyword = $('#UserKeyword').val();
					    			var _thisHtml = $(this).attr('data-name');
				                    if(_keyword != ''){
				                    	if(RegExp(_keyword, "i").test($(this).attr('data-name'))){
				                    		_thisHtml = _thisHtml.replace(eval("/("+_keyword+")/gi"), '<span class="key">'+'$1'+'</span>');
				                    		$(this).find('a').html(_thisHtml);
					                    	$(this).show();
					                    }else{
					                    	$(this).hide();
					                    }
				                    }else{
				                    	_thisHtml = _thisHtml.replace('<span class="key">', '');
				                    	_thisHtml = _thisHtml.replace('</span>', '');
			                    		$(this).find('a').html(_thisHtml);
			                    		$(this).show();
				                    }
					    		}
					    	})
			        }
				});
			}
		})
	}
	
	// 获取路径
	function getJobList(num){
		var _param = {
			proxyUserName: $('#UserSel').data('user'),
			page: num || 1, 
			pageSize: 50
		};
		
		var _url = 'job/list';
		
		if($('#FileFilter').val() != ''){
			$.extend(_param, {paramString: $('#FileFilter').val()})
		}
		if($('#FileOpts').find('.active').length > 0){
			$.extend(_param, {runningState: $('#FileOpts').find('.active').data('type')})
		}
		
		Util.ajax({
			url: _url,
			data: _param,
			success: function(data){
				$('#FileList').scrollTop(0);
				data = data.data;
				
				if(data.rows.length == 0){
					$('#TipNull').removeClass('hidden');
					$('#FileList').html('');
					$('#FileListPage').html('');
					return;
				}
				
				$('#TipNull').addClass('hidden');
				var _html = '';

				$.each(data.rows, function(k, v){
					var _delHtml = v.terminable ? '<a href="javascript:;" class="btn btn-primary btn-xs stopJob" data-id="'+v.appId+'">Stop</a>' : '';
							
					var _state = '';
					if(v.state == 'FINISHED'){
						_state = '<span class="label label-success">'+v.state+'</span>';
					}else if(v.state == 'RUNNING'){
						_state = '<span class="label label-info">'+v.state+'</span>';
					}else if(v.state == 'KILLED'){
						_state = '<span class="label label-warning">'+v.state+'</span>';
					}else if(v.state == 'FAILED'){
						_state = '<span class="label label-danger">'+v.state+'</span>';
					}
					
					var _runTime = '',
						_finishiTime = '';
					if(v.finishiTime != 0){
						_runTime = getTimeL(v.finishiTime - v.submitTime);
						_finishiTime = new Date(v.finishiTime).Format("yyyy-MM-dd hh:mm:ss");
					}
					
					_html += '<tr>'
								+'<td width="15%">'+v.appId+'</td>'
								+'<td width="18%">'+v.name+'</td>'
								+'<td width="10%">'+v.applicationType+'</td>'  
								+'<td width="8%">'+_state+'</td>'  
								+'<td width="7%">'+(v.process*100).toFixed(2)+'%</td>'  
								+'<td width="8%">'+v.queue+'</td>'  
								+'<td width="8%">'+ _runTime +'</td>'  
								+'<td width="8%">'+new Date(v.submitTime).Format("yyyy-MM-dd hh:mm:ss")+'</td>'  
								+'<td width="8%">'+ _finishiTime +'</td>'  
								+'<td width="10%">'+_delHtml+'</td>' 
							+'</tr>';
				});
				
				
				$('#FileList').html(_html);
				
				if(data.total > 50){
					$('#FileListPage').html('<div class="inner"></div><div class="pageInfo" id="PageInfo"></div>');
					$('#FileListPage .inner').bootpag({
			            total: Math.ceil(data.total / 50),
			            page: data.pageIndex,
			            maxVisible: 5
			        }).on('page', function(event, num){
			        	getJobList(num);
			        });
					$('#PageInfo').html($.i18n.prop('total')+data.total+$.i18n.prop('record'));
				}else{
					$('#FileListPage').html('');
				}
			}
		});
	}
	
	// 获取反馈内容
	function getFeedback(){
		Util.ajax({
			url: 'cc/getArticlesByLenovoID',
			data: {
				page: 1,
				pageSize: 1000
			},
			success: function(data){
				if(data.data.rows.length == 0){
					return;
				}else{
					$('#FeedbackMenu').addClass('hasFeed');
				}
				var _html = '';
				
				$.each(data.data.rows, function(k, v){
					var _reply = '';
					
					if(v.messageCount > 0){
						_reply = '<span class="badge">'+$.i18n.prop('replied')+'</span>';
					}
					var _replyTxt = v.messages[0] || '';
					_html += '<li><a href="javascript:;" data-id="'+v.article_id+'" data-reply="'+ _replyTxt +'">'+ _reply + '<span class="tit">' + v.context+'</span></a></li>'
				})
				
				_html += '<li class="divider"></li><li><a href="javascript:;" id="AddNewFeedbackLink"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;'+$.i18n.prop('newFeedback')+'</a></li>';
				
				$('#FeedbackList').html(_html);
				
				$('#AddNewFeedbackLink').click(function(){
					newFeedback();
				})
			}
		});
	}
	
	// 发表反馈弹出框
	function newFeedback(){
		var feedbackNewDialog = BootstrapDialog.show({
			title: $.i18n.prop('feedback'),
			cssClass: 'feedback-dialog',
			message: '<div class="addValueDialog" id="AddValueDialog">'
				+'<textarea class="form-control feedbackText" placeholder="'+$.i18n.prop('feedbackPlaceholder')+'" style="height:150px"></textarea>'
				+'<div class="btnWrap"><a href="javascript:;" class="btn btn-primary" id="AddNewFeedbackBtn">'+$.i18n.prop('submit')+'</a></div>'
				+'</div>',
			onshown: function(){
				$('#AddNewFeedbackBtn').off('click').on('click', function(){
					$(this).addClass('disable');
					
					var _text = $('#AddValueDialog .feedbackText').val();
					
					if(_text == ''){
						swal("Error", $.i18n.prop('feedbackNullTip')+'!', "error");
						$('#AddNewFeedbackBtn').removeClass('disable');
						return;
					}
					
					Util.ajax({
						url: 'cc/savaArticle',
						data: {
							title: '',
							keyword: '',
							context: encodeURIComponent(_text)
						},
						success: function(data){
							if(data.code == 1){
								swal($.i18n.prop('addSuccess')+'!', '', 'success');
								getFeedback();
								
								feedbackNewDialog.close();
							}else{
								swal("Error", data.data, "error");
								$('#AddNewFeedbackBtn').removeClass('disable');
							}
						}
					});	
				})
			}
		});
	}
	
	
	// 事件绑定
	function bindEvent(){
		$('#Logout').click(function(){
			window.location.href = 'logout';
		})
		
		$('#UserList').on('click', 'li', function(){
			$('#UserSel').html($(this).data('name')).data('user', $(this).data('user'));
			getJobList();
			store.set(UserName + 'user', $(this).data('user') + '||' + $(this).data('name'));
		})
		
		
		
		$('#FeedbackList').on('click', 'a', function(){
			if($(this).attr('id') == 'AddNewFeedbackLink'){
				return;
			}
			var _id = $(this).attr('data-id');
			var _reply = $(this).attr('data-reply');
			var _con = $(this).find('.tit').html();
			
			var _message;
			if(_reply != ''){
				_message = '<div class="addValueDialog" id="AddValueDialog">'
					+'<h4>'+$.i18n.prop('feedbackCon')+'</h4>'
					+'<div class="feedCon">'+_con+'</div>'
					+'<h4>'+$.i18n.prop('adminReply')+'</h4>'
					+'<div class="replyCon">'+_reply+'</div>'
					+'<div class="btnWrap"><a href="javascript:;" class="btn btn-primary" id="AddNewCloseBtn">'+$.i18n.prop('close')+'</a></div>'
					+'</div>'
			}else{
				_message = '<div class="addValueDialog" id="AddValueDialog">'
					+'<div class="feedCon">'+_con+'</div>'
					+'<div class="btnWrap"><a href="javascript:;" class="btn btn-primary" id="AddNewCloseBtn">'+$.i18n.prop('close')+'</a></div>'
					+'</div>'
			}
			
			var feedbackDetailDialog = BootstrapDialog.show({
				title: $.i18n.prop('feedbackDetail'),
				cssClass: 'feedback-dialog',
	            message: _message,
	            onshown: function(){
					$('#AddNewCloseBtn').off('click').on('click', function(){
						feedbackDetailDialog.close();
					})
	            }
	        });
		})
		
		$('#FeedbackMenu').on('click', function(){
			if($(this).hasClass('hasFeed')){
				return;
			}
			
			newFeedback();
		});
		
		$('#DropdownUser').click(function(){
			setTimeout(function(){$('#UserKeyword').focus();}, 100)
		})
		
		$('#FileFilter').keyup(function(e){
			switch(e.keyCode){
		        case 13: // enter
		        case 16: // shift
		        case 17: // ctrl
		        case 37: // left
		        case 38: // up
		        case 39: // right
		        case 40: // down
		            break;
		        case 27: // esc
		            break;
		        default:
					getJobList();
			}
		});
		
		$('#FileOpts .btn').click(function(){
			$(this).toggleClass('active');
			$(this).siblings().removeClass('active');
			getJobList();
		})
	}
	
	function init(){
		getAppList();
		
		// 查看反馈
//		getFeedback();

		// 绑定事件	
		bindEvent();
	}

	init();
})