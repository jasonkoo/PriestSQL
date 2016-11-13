$(function(){
	var _pathName = window.location.pathname;
	_pathName = _pathName.substring(1, _pathName.lastIndexOf('/'));
	
	window.UserName = $('#UserName').html() + '_' + _pathName + '_';
	var PathInfo = {};
	var AppList = {};
	var DetailPath;
	var SelPathArr = [];
	var MovePath;
	var MovePathParam = -1;
	var FileSize;
	var Sort = -1;
	
	var ZipType = ['gz', 'deflate', 'bz2', 'tar', 'tgz', 'zip'];
	
	function encodeUrl(url){
		return encodeURIComponent(encodeURIComponent(url));
	}
	
	// 下载文件
	function downloadFile(url, path, proxyUserName, appName) {
	    if($("#ExcelForm").length == 0){
	    	$(document.body).append('<form target="ExcelIframe" id="ExcelForm">'
	    		+'<input type="hidden" id="Excel_path" name="path" />'
	    		+'<input type="hidden" id="Excel_proxyUserName" name="proxyUserName" />'
	    		+'<input type="hidden" id="Excel_appName" name="appName" />'
	    		+'</form><iframe name="ExcelIframe" style="display:none; visibility: hidden;"></iframe>');
	    }
	    $("#Excel_path").val(path);
	    $("#Excel_proxyUserName").val(proxyUserName);
	    $("#Excel_appName").val(appName);
	    
	    var _form = document.getElementById("ExcelForm");
	    _form.method = "post";
	    _form.action = url;
	    _form.submit();
	};
		
	function getFileType(file){
		var _fileType;
		if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|psd|PSD)$/.test(file)){
			_fileType = '<i class="fa fa-file-image-o"></i>';
		}else if(/\.(xls|xlsx|csv)$/.test(file)){
			_fileType = '<i class="fa fa-file-excel-o"></i>';
		}else if(/\.(docx|doc)$/.test(file)){
			_fileType = '<i class="fa fa-file-word-o"></i>';
		}else if(/\.(ppt|pptx)$/.test(file)){
			_fileType = '<i class="fa fa-file-powerpoint-o"></i>';
		}else if(/\.(pdf|PDF)$/.test(file)){
			_fileType = '<i class="fa fa-file-pdf-o"></i>';
		}else if(/\.(rar|zip|tar|cab|uue|jar|iso|z|7-zip|ace|lzh|arj|gzip|bz2|gz|7z|tgz|deflate)$/.test(file)){
			_fileType = '<i class="fa fa-file-zip-o"></i>';
		}else{
			_fileType = '<i class="fa fa-file-o"></i>';
		}
		return _fileType;
	}
	
	function sizeFormat(size){
		size = parseInt(size);
		var result = '';
		if(size > 1024*1024*1024*1024*1024*1024*1024*1024){
			result = (size/(1024*1024*1024*1024*1024*1024*1024*1024)).toFixed(2) + ' YB';
		}else if(size > 1024*1024*1024*1024*1024*1024*1024){
			result = (size/(1024*1024*1024*1024*1024*1024*1024)).toFixed(2) + ' ZB';
		}else if(size > 1024*1024*1024*1024*1024*1024){
			result = (size/(1024*1024*1024*1024*1024*1024)).toFixed(2) + ' EB';
		}else if(size > 1024*1024*1024*1024*1024){
			result = (size/(1024*1024*1024*1024*1024)).toFixed(2) + ' PB';
		}else if(size > 1024*1024*1024*1024){
			result = (size/(1024*1024*1024*1024)).toFixed(2) + ' TB';
		}else if(size > 1024*1024*1024){
			result = (size/(1024*1024*1024)).toFixed(2) + ' GB';
		}else if(size > 1024*1024){
			result = (size/(1024*1024)).toFixed(2) + ' MB';
		}else if(size > 1024){
			result = (size/1024).toFixed(2) + ' KB';
		}else{
			result = size + ' Byte';
		}
		return result;
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
					$('#UserSel').html(store.get(UserName + 'user').split('||')[1]).data({'user': store.get(UserName + 'user').split('||')[0], 'name': store.get(UserName + 'user').split('||')[1]});
				}else{
					$('#UserSel').html(data.data[0].appName).data({'user': data.data[0].appUser, 'name': data.data[0].appName});
				}
				
				getFileList();
				
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
	function getFileList(paths, num){
		$('#FileOpts .btnOpt').addClass('hidden');
		$('#FileOpts .btnNew').addClass('hidden');
		
		$('#FileBrowser').show();
		$('#FileDetail').hide();
		$('#FileFilter').show();
		$('#FilePathSearch').show();
		$('#FilePathGo').show();
		
		var _bcHtml = '<li><a href="fileBrowser.jsp"><i class="fa fa-home"></i> Home</a></li>';
		
		if(paths){
			var _pathList = paths.split('/');
			var _p = '';
			$.each(_pathList, function(k, v){
				if(k < _pathList.length - 1){
//					if(k == _pathList.length - 2){
//						_bcHtml += '<li>'+v+'</li>';
//					}else{
						_p += v + '/';
						_bcHtml += '<li><a href="javascript:;" class="crumbItem" data-path="'+_p+'">'+v+'</a></li>';
//					}
				}
			})
		}
		
		$('#Breadcrumb').html(_bcHtml);
		
		var _param = {
			proxyUserName: $('#UserSel').data('user'),
			appName: $('#UserSel').html(),
			page: num || 1, 
			pageSize: 50
		};
		
		if(Sort != -1){
			$.extend(_param, Sort);
		}
		
		var _url = 'file/fileList';
		if(paths){
			$.extend(_param, {path: encodeUrl(paths)});
		}
		
		if($('#FileFilter').val() != ''){
			$.extend(_param, {filefilter: $('#FileFilter').val()});
		}
		
		Util.ajax({
			url: _url,
			data: _param,
			success: function(data){
				SelPathArr = [];
				
				$('#FileList').scrollTop(0);
				if(data.code == 0){
					$('#TipNull').removeClass('hidden');
					$('#FileListPage').html('');
					$('#FileList').html('');
					return;
				}
				
				$('#TipNull').addClass('hidden');
				
				data = data.data;
				
				var _html = '';
				paths = paths || '';
				
				if(paths != ''){
					var _pathParent = paths.substring(0, paths.length-1);
					_pathParent = _pathParent.substring(0, _pathParent.lastIndexOf('/') + 1);
					
					var _pathInfo = PathInfo[paths] || '||||||||';
					
					_html += '<tr data-dir="true" data-up="true" data-path="'+ _pathParent +'">'
						+'<td width="5%"><a href="javascript:;" class="sel selAll hided" id="SelAll"><i class="fa fa-check"></i></a><i class="fa fa-folder"></i></td>'
						+'<td width="28%"><a href="javascript:;"><i class="fa fa-level-up"></i></a></td>'
						+'<td width="15%"></td>'
						+'<td width="10%">'+ _pathInfo.split('||')[1] +'</td>'
						+'<td width="10%">'+ _pathInfo.split('||')[2] +'</td>'
						+'<td width="10%">'+ _pathInfo.split('||')[3] +'</td>'
						+'<td width="20%">'+ _pathInfo.split('||')[4] +'</td>'
		            +'</tr>'
//		            +'<tr data-path="'+v.path.name+'">'
//		            	+'<td><i class="fa fa-folder"></i></td>'
//						+'<td>.</td>'
//						+'<td></td>'
//						+'<td>'+v.owner+'</td>'
//						+'<td>'+v.group+'</td>'
//						+'<td>'+v.permission+'</td>'
//						+'<td>'+v.modificationTime+'</td>'
//		            +'</tr>'
				}
				
				if(data.buildable){
					$('#FileOpts .btnNew').removeClass('hidden');
				}else{
					$('#FileOpts .btnNew').addClass('hidden');
				}
				
				var _isSelAll = false;
				$.each(data.files.rows, function(k, v){
					var _typeHtml,
						_pathName,
						_size = '',
						_selShow = '';
					if(v.dir){
						_typeHtml = '<i class="fa fa-folder"></i>';
						_pathName = '<a href="javascript:;" class="fileName">'+v.path.name+'</a>';
					}else{
						_typeHtml = getFileType(v.path.name);
						_pathName = '<a href="javascript:;" class="fileName">'+v.path.name+'</a>';
						_size = sizeFormat(v.length);
					}
					
					if(!v.editable){
						_selShow = 'hided';
					}else{
						_isSelAll = true;
					}
					
					_html += '<tr data-dir="'+v.dir+'" data-name="'+v.path.name+'" data-edit="'+v.editable+'" data-path="'+ paths + v.path.name+'/">'
								+'<td width="5%"><a href="javascript:;" class="sel '+_selShow+'" data-edit="'+v.editable+'" data-dir="'+v.dir+'" data-path="'+ paths + v.path.name+'/" data-name="'+ v.path.name +'"><i class="fa fa-check"></i></a>'+_typeHtml+'</td>'
								+'<td width="28%">'+_pathName+'</td>'
								+'<td width="15%">'+_size+'</td>'
								+'<td width="12%">'+v.owner+'</td>'
								+'<td width="10%">'+v.group+'</td>'
								+'<td width="10%">'+v.permission+'</td>'
								+'<td width="20%">'+(v.modificationTime == null ? '--' : v.modificationTime)+'</td>'
			                +'</tr>';
					
					PathInfo[paths + v.path.name + '/'] = v.length + '||' + v.owner + '||' + v.group + '||' + v.permission + '||' + (v.modificationTime == null ? '--' : v.modificationTime);
				});
				
				$('#FileList').html(_html);
				
				if(_isSelAll){
					$('#SelAll').removeClass('hided');
				}
				
				if(data.files.total > 50){
					$('#FileListPage').html('<div class="inner"></div><div class="pageInfo" id="PageInfo"></div>');
					$('#FileListPage .inner').bootpag({
			            total: Math.ceil(data.files.total / 50),
			            page: data.files.pageIndex,
			            maxVisible: 5
			        }).on('page', function(event, num){
			        	getFileList(paths, num);
			        });
					$('#PageInfo').html($.i18n.prop('total')+data.files.total+$.i18n.prop('record'));
				}else{
					$('#FileListPage').html('');
				}
			}
		});
	}
	
	// 获取文件内容
	function getFileDetail(paths, charset, num){
		$('#FileBrowser').hide();
		$('#FileFilter').hide();
		$('#FilePathSearch').hide();
		$('#FilePathGo').hide();
		$('#FileDetail').show();
		
		$('#FileOpts .btnNew').addClass('hidden');
		if(SelPathArr[0].split('||')[3] == 'true'){
			$('#FileOpts .btnOpt').removeClass('hidden');
		}else{
			$('#FileOpts .btnOpt').addClass('hidden');
		}
		
		var _fileName = SelPathArr[0].split('||')[1] + '';
		if(_fileName.lastIndexOf('.') == -1 || ZipType.indexOf(_fileName.substring(_fileName.lastIndexOf('.') + 1)) == -1){
			$('#FileOpts .btnUnzip').addClass('hidden');
		}
		
		$('#FileOpts .btnDownload').removeClass('hidden');
		
		
		var _bcHtml = '<li><a href="fileBrowser.jsp"><i class="fa fa-home"></i> Home</a></li>';
		
		if(paths){
			var _pathList = paths.split('/');
			var _p = '';
			$.each(_pathList, function(k, v){
				if(k < _pathList.length - 1){
					_p += v + '/';
					if(k == _pathList.length - 2){
						_bcHtml += '<li><a href="javascript:;" data-file="true" class="crumbItem" data-path="'+_p+'">'+v+'</a></li>';
					}else{
						_bcHtml += '<li><a href="javascript:;" class="crumbItem" data-path="'+_p+'">'+v+'</a></li>';
					}
					
				}
			})
		}
		
		$('#Breadcrumb').html(_bcHtml);
		
		$.each(PathInfo[paths].split('||'), function(k, v){
			if(k == 0){
				$('#Info_' + k).html(sizeFormat(v));
			}else{
				$('#Info_' + k).html(v);
			}
		})
		
		DetailPath = paths;
		
		getFileDetailCon(paths);
	}
	
	// 文件内容
	function getFileDetailCon(paths, num){
		$('#FileDetailCon').html($.i18n.prop('loading')+'...');
		$('#FileDetailPage').html('');
		var _url = 'file/readFile';
		
		var _param = {
			path: encodeUrl(paths.substring(0, paths.length-1)),
			proxyUserName: $('#UserSel').data('user'),
			appName: $('#UserSel').html(),
			page: num || 1, 
			pageSize: 5120,
			charsetName: $("input[name='charsetRadio']:checked").val()
		};
		
		Util.ajax({
			url: _url,
			data: _param,
			success: function(data){
				$('#FileDetailCon').scrollTop(0);
				
				$('#FileDetailCon').html(data.data);
				
				if(PathInfo[paths].split('||')[0]/5120 > 1){
					$('#FileDetailPage').html('<div class="inner"></div><div class="pageInfo" id="PageDetailInfo"></div>');
					$('#FileDetailPage .inner').bootpag({
			            total: Math.ceil(PathInfo[paths].split('||')[0] / 5120),
			            page: num || 1,
			            maxVisible: 10
			        }).on('page', function(event, num){
			        	getFileDetailCon(paths, num);
			        });
					$('#PageInfo').html($.i18n.prop('total')+Math.ceil(PathInfo[paths].split('||')[0] / 5120)+$.i18n.prop('page'));
				}else{
					$('#FileDetailPage').html('');
				}
			}
		});
	}
	
	function refreshFold(type){
		if($('#FileDetail').is(':visible')){
			if(type == 'rename'){
				$('#Breadcrumb li:last-child a').click();
			}else{
				$('#Breadcrumb li').eq($('#Breadcrumb li').length - 2).find('a').click();
			}
		}else{
			$('#Breadcrumb li:last-child a').click();
		}
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
				
				_html += '<li class="divider"></li><li><a href="javascript:;" id="AddNewFeedbackLink"><i class="fa fa-plus"></i>&nbsp;'+$.i18n.prop('newFeedback')+'</a></li>';
				
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
		
		$('#FileList').on('mouseenter', 'tr', function(){
			$(this).find('.fa-folder').addClass('fa-folder-open');
		})
		$('#FileList').on('mouseleave', 'tr', function(){
			$(this).find('.fa-folder').removeClass('fa-folder-open');
		})
		
		
		$('#FileList').on('click', 'tr', function(){
			$('#FileFilter').val('');
			
			if($(this).data('dir')){
				var _path = $(this).data('path');
				if(_path != ''){
					getFileList(_path);
				}else{
					getFileList();
				}
			}else{
				var _path = $(this).data('path');
				SelPathArr = [$(this).data('path') + '||' + $(this).data('name') + '||' + $(this).data('dir') + '||' + $(this).data('edit')];
				
				getFileDetail(_path);
			}
		})
		
		$('#Breadcrumb').on('click', '.crumbItem', function(){
			$('#FileFilter').val('');
			
			if($(this).data('path') != ''){
				var _path = $(this).data('path');
				if($(this).data('file')){
					getFileDetail(_path);
				}else{
					if(_path != ''){
						getFileList(_path);
					}else{
						getFileList();
					}
				}
			}
		})
		
		$('#UserList').on('click', 'li', function(){
			$('#UserSel').html($(this).data('name')).data({'user': $(this).data('user'), 'name': $(this).data('name')});
			getFileList();
			store.set(UserName + 'user', $(this).data('user') + '||' + $(this).data('name'));
		})
		
		$("input[name='charsetRadio']").click(function(){
			getFileDetailCon(DetailPath);
		})
		
		$('#DownloadFile').click(function(){
			var _type = $('#Info_0').html().split(' ');
			if(_type[1] == 'KB' || _type[1] == 'Byte' || (_type[1] == 'MB' && _type[0] <= 30)){
				downloadFile('file/downloadFile', encodeUrl(DetailPath.substring(0, DetailPath.length-1)),$('#UserSel').data('user'), $('#UserSel').html());
			}else{
				swal('Error!', $.i18n.prop('fileMaxTip')+'！', 'error');
			}
		})
		
		$('#FileList').on('click', '.sel', function(e){
			$('#FileOpts .btnOpt').addClass('hidden');
			SelPathArr = [];
			
			if($(this).hasClass('selAll')){
				if($(this).hasClass('active')){
					$(this).removeClass('active');
					$('#FileList .sel').each(function(k, v){
						if(!$(this).hasClass('selAll') && !$(this).hasClass('hided')){
							$(this).removeClass('active');
							$(this).data('active', false);
						}
					})
				}else{
					$(this).addClass('active');
					$('#FileList .sel').each(function(k, v){
						if(!$(this).hasClass('selAll') && !$(this).hasClass('hided')){
							$(this).addClass('active');
							$(this).data('active', true);
						}
					})
				}
			}else{
				if($(this).data('active')){
					$(this).removeClass('active');
					$(this).data('active', false);
				}else{
					$(this).addClass('active');
					$(this).data('active', true);
				}
			}
				
			var _isZip = true;
			var _selDir = false;
			$('#FileList .sel').each(function(k, v){
				if(!$(this).hasClass('selAll') && $(this).hasClass('active')){
					SelPathArr.push($(this).data('path') + '||' + $(this).data('name') + '||' + $(this).data('dir'));
					if($(this).data('dir')){
						_selDir = true;
					}
					
					var _fileName = $(this).data('name') + '';
					if(_fileName.lastIndexOf('.') == -1 || ZipType.indexOf(_fileName.substring(_fileName.lastIndexOf('.') + 1)) == -1){
						_isZip = false;
					}
				}
			})
			
			if(SelPathArr.length > 0){
				$('#FileOpts .btnOpt').removeClass('hidden');
				
				if(_selDir){
					$('#FileOpts .btnCopy').addClass('hidden');
					$('#FileOpts .btnUnzip').addClass('hidden');
				}
				if(_isZip){
					$('#FileOpts .btnUnzip').removeClass('hidden');
				}else{
					$('#FileOpts .btnUnzip').addClass('hidden');
				}
				if(SelPathArr.length > 1){
					$('#FileOpts .btnRename').addClass('hidden');
					$('#FileOpts .btnLoadFile').addClass('hidden');
				}
			}else{
				$('#FileOpts .btnOpt').addClass('hidden');
			}
			
			e.stopPropagation();
		})
		
		$('#FileOpts .btnOpt').click(function(){
			var _type = $(this).data('type');
			
			if(_type == 'rename'){
				var _name = SelPathArr[0].split('||')[1];
				swal({   
					title: $.i18n.prop('rename'),   
					text: "",   
					type: "input",   
					showCancelButton: true,   
					closeOnConfirm: false,   
					animation: "slide-from-top",   
					inputPlaceholder: $.i18n.prop('name'),
					inputValue: _name
				}, function(inputValue){   
					if (inputValue === false){
						return false;
					}
					
					if (inputValue === "") {     
						swal.showInputError($.i18n.prop('nameNotNull'));     
						return false   
					}
					
					if(inputValue == _name){
						swal.close();
						return;
					}
					
					var _selPath = SelPathArr[0].split('||');
					var _newPath = _selPath[0].substring(0, _selPath[0].length-1);
					_newPath = _newPath.substring(0, _newPath.lastIndexOf('/') + 1);
					Util.ajax({
						url: 'file/renameFileOrDirectory',
						data: {
							path: encodeUrl(_selPath[0].substring(0, _selPath[0].length-1)),
							newPath: encodeUrl(_newPath + inputValue),
							proxyUserName: $('#UserSel').data('user'),
							appName: $('#UserSel').html()
						},
						success: function(data){
							if(data.code == 1){
								swal('Successful!', '', 'success');
								if($('#FileDetail').is(':visible')){
									$('#Breadcrumb li:last-child a').data('path', _newPath + inputValue + '/').html(inputValue);
									PathInfo[_newPath + inputValue + '/'] = PathInfo[_selPath[0]];
									
									var _pInfo = SelPathArr[0].substring(SelPathArr[0].indexOf('||')+2)
									_pInfo = _pInfo.substring(_pInfo.indexOf('||')+2);
								}
								refreshFold('rename');
							}else{
								swal('Error!', data.data, 'error');
							}
						}
					});
				});
			}else if(_type == 'download'){
				var _path = SelPathArr[0].split('||')[0];
				
//				var _type;
//				if($('#FileDetail').is(':visible')){
//					_type = $('#Info_0').html().split(' ');
//				}else{
//					_type = FileSize.split(' ');
//				}
				
				var _selPath = [];
				$.each(SelPathArr, function(k, v){
					var _path = v.split('||')[0];
					_path = _path.substring(0, _path.length-1)
					_selPath.push(_path)
				})
				_selPath = _selPath.join('||');
				
//				if(_type[1] == 'KB' || _type[1] == 'Byte' || (_type[1] == 'MB' && _type[0] <= 30)){
					downloadFile('file/downloadFile', encodeUrl(_selPath), $('#UserSel').data('user'), $('#UserSel').html());
//				}else{
//					swal('Error!', $.i18n.prop('fileMaxTip')+'!', 'error');
//				}
			}else if(_type == 'del'){
				swal({   
					title: $.i18n.prop('deleteConfirm'),
					text: "",   
					type: "warning",   
					showCancelButton: true,   
					confirmButtonText: $.i18n.prop('sure'),   
					cancelButtonText: $.i18n.prop('cancel'),   
					closeOnConfirm: false,   
					closeOnCancel: true 
				}, function(isConfirm){   
					if (isConfirm) {
						var _selPath = [];
						$.each(SelPathArr, function(k, v){
							var _path = v.split('||')[0];
							_path = _path.substring(0, _path.length-1)
							_selPath.push(_path)
						})
						_selPath = _selPath.join('||');
						
//						var _selPath = SelPath.split('||');
						
						var _url;
//						if(_selPath[2]){
//							_url = 'file/deleteDirectory';
//						}else{
							_url = 'file/deleteFile';
//						}
						
						Util.ajax({
							url: _url,
							data: {
								path: encodeUrl(_selPath),
								proxyUserName: $('#UserSel').data('user'),
								appName: $('#UserSel').html()
							},
							success: function(data){
								if(data.code == 1){
									swal('Successful!', '', 'success');
									refreshFold('del');
								}else{
									swal('Error!', data.data, 'error');
								}
							}
						});
					}
				});
			}else if(_type == 'move'){
				var _path = SelPathArr[0].split('||')[0];
				
				swal({   
					title: $.i18n.prop('moveTo'),
					text: '<ul id="treeDemo" class="ztree"></ul>',
					html: true,
					showCancelButton: true,   
					closeOnConfirm: false,   
					animation: "slide-from-top"
				}, function(isConfirm){   
					if (isConfirm) {
						var _selPath = [];
						$.each(SelPathArr, function(k, v){
							var _path = v.split('||')[0];
							_path = _path.substring(0, _path.length-1)
							_selPath.push(_path)
						})
						_selPath = _selPath.join('||');
						
						var _fileName = _selPath[0].substring(0, _selPath[0].length-1);
						_fileName = _fileName.substring(_fileName.lastIndexOf('/') + 1);
						
						swal({   
							title: $.i18n.prop('inProcess'),   
							text: "",   
							imageUrl: 'images/loading.gif',
							showConfirmButton: false
						});
						console.log(MovePath);
						console.log(_selPath)
						Util.ajax({
							url: 'file/moveFile',
							data: {
								path: encodeUrl(_selPath),
								newPath: encodeUrl(MovePath),
								proxyUserName: $('#UserSel').data('user'),
								appName: $('#UserSel').html()
							},
							success: function(data){
								if(data.code == 1){
									swal('Successful!', '', 'success');
								}else{
									swal('Error!', data.data, 'error');
								}
								refreshFold('move');
							}
						});
					}
				});
				

				function filter(treeId, parentNode, childNodes) {
					if (!childNodes) return null;
					var _result = [];
					$.each(childNodes.data, function(k, v){
						if(v.dir){
							if(v.sons != null){
								var _children = [];
								for(var i = 0; i < v.sons.length; i++){
									_children.push({name: v.sons[i].path.name, isParent: true})
								}
								_result.push({name: v.path.name, open: true, children: _children});
							}else{
								_result.push({name: v.path.name, isParent: true});
							}
						}
					})
					return _result;
				}
				
				function beforeAsync(treeId, treeNode) {
					if(treeNode){
						MovePathParam = [];
						$('#' + treeNode.tId).parents('li').each(function(){
							MovePathParam.push($('#' + $(this).attr('id') + '_a').attr('title'));
						})
						MovePathParam.reverse();
						MovePathParam = MovePathParam.join('/') + '/' + treeNode.name + '/';
					}else{
						MovePathParam = -1
					}
				}
				
				function onClick(event, treeId, treeNode){
					MovePath = [];
					$('#' + treeNode.tId).parents('li').each(function(){
						MovePath.push($('#' + $(this).attr('id') + '_a').attr('title'));
					})
					if(MovePath.length == 0){
						alert($.i18n.prop('moveTip'));
					}
					MovePath.reverse();
					MovePath = MovePath.join('/') + '/' + treeNode.name + '/';
				}
				
				var setting = {
					view: {
						selectedMulti: false
					},
					async: {
						enable: true,
						url: 'file/targetPath',
						autoParam: ["id", "name", "level=lv"],
						otherParam: {proxyUserName: $('#UserSel').data('user'), appName: $('#UserSel').html(), path: function(){ return MovePathParam}},
						dataFilter: filter
					},
					callback: {
						beforeAsync: beforeAsync,
						onClick: onClick
					}
				};
				
				$.fn.zTree.init($("#treeDemo"), setting);
			}else if(_type == 'copy'){
				var _path = SelPathArr[0].split('||')[0];
				
				swal({   
					title: $.i18n.prop('copyTo'),
					text: '<ul id="treeDemo" class="ztree"></ul>',
					html: true,
					showCancelButton: true,   
					closeOnConfirm: false,   
					animation: "slide-from-top"
				}, function(isConfirm){   
					if (isConfirm) {
						swal({   
							title: $.i18n.prop('inProcess'),   
							text: "",   
							imageUrl: 'images/loading.gif',
							showConfirmButton: false
						});
						
						var _selPath = SelPathArr[0].split('||');
						var _fileName = _selPath[0].substring(0, _selPath[0].length-1);
						_fileName = _fileName.substring(_fileName.lastIndexOf('/') + 1);
						
						var _selPath = [];
						$.each(SelPathArr, function(k, v){
							var _path = v.split('||')[0];
							_path = _path.substring(0, _path.length-1)
							_selPath.push(_path)
						})
						_selPath = _selPath.join('||');
						
						Util.ajax({
							url: 'file/copyFile',
							data: {
								path: encodeUrl(_selPath),
								newPath: encodeUrl(MovePath),
								proxyUserName: $('#UserSel').data('user'),
								appName: $('#UserSel').html()
							},
							success: function(data){
								if(data.code == 1){
									swal('Successful!', '', 'success');
									refreshFold('move');
								}else{
									swal('Error!', data.data, 'error');
								}
							}
						});
					}
				});
				

				function filter(treeId, parentNode, childNodes) {
					if (!childNodes) return null;
					var _result = [];
					$.each(childNodes.data, function(k, v){
						if(v.dir){
							if(v.sons != null){
								var _children = [];
								for(var i = 0; i < v.sons.length; i++){
									_children.push({name: v.sons[i].path.name, isParent: true})
								}
								_result.push({name: v.path.name, open: true, children: _children});
							}else{
								_result.push({name: v.path.name, isParent: true});
							}
						}
					})
					return _result;
				}
				
				function beforeAsync(treeId, treeNode) {
					if(treeNode){
						MovePathParam = [];
						$('#' + treeNode.tId).parents('li').each(function(){
							MovePathParam.push($('#' + $(this).attr('id') + '_a').attr('title'));
						})
						MovePathParam.reverse();
						MovePathParam = MovePathParam.join('/') + '/' + treeNode.name + '/';
					}else{
						MovePathParam = -1
					}
				}
				
				function onClick(event, treeId, treeNode){
					MovePath = [];
					$('#' + treeNode.tId).parents('li').each(function(){
						MovePath.push($('#' + $(this).attr('id') + '_a').attr('title'));
					})
					if(MovePath.length == 0){
						alert($.i18n.prop('moveTip'));
					}
					MovePath.reverse();
					MovePath = MovePath.join('/') + '/' + treeNode.name + '/';
				}
				
				var setting = {
					view: {
						selectedMulti: false
					},
					async: {
						enable: true,
						url: 'file/targetPath',
						autoParam: ["id", "name", "level=lv"],
						otherParam: {proxyUserName: $('#UserSel').data('user'), appName: $('#UserSel').html(), path: function(){ return MovePathParam}},
						dataFilter: filter
					},
					callback: {
						beforeAsync: beforeAsync,
						onClick: onClick
					}
				};
				
				$.fn.zTree.init($("#treeDemo"), setting);
			}else if(_type == 'unzip'){
				var _path = SelPathArr[0].split('||')[0];
				
				swal({   
					title: $.i18n.prop('uncompressTo'),
					text: '<ul id="treeDemo" class="ztree"></ul>',
					html: true,
					showCancelButton: true,   
					closeOnConfirm: false,   
					animation: "slide-from-top"
				}, function(isConfirm){   
					if (isConfirm) {
						swal({   
							title: $.i18n.prop('inProcess'),   
							text: "",   
							imageUrl: 'images/loading.gif',
							showConfirmButton: false
						});
						
						var _selPath = [];
						$.each(SelPathArr, function(k, v){
							var _path = v.split('||')[0];
							_path = _path.substring(0, _path.length-1)
							_selPath.push(_path)
						})
						_selPath = _selPath.join('||');
						
						Util.ajax({
							url: 'file/uncompressFile',
							data: {
								path: encodeUrl(_selPath),
								newPath: encodeUrl(MovePath),
								proxyUserName: $('#UserSel').data('user'),
								appName: $('#UserSel').html()
							},
							success: function(data){
								if(data.code == 1){
									swal('Successful!', '', 'success');
									refreshFold('move');
								}else{
									swal('Error!', data.data, 'error');
								}
							}
						});
					}
				});
				

				function filter(treeId, parentNode, childNodes) {
					if (!childNodes) return null;
					var _result = [];
					$.each(childNodes.data, function(k, v){
						if(v.dir){
							if(v.sons != null){
								var _children = [];
								for(var i = 0; i < v.sons.length; i++){
									_children.push({name: v.sons[i].path.name, isParent: true})
								}
								_result.push({name: v.path.name, open: true, children: _children});
							}else{
								_result.push({name: v.path.name, isParent: true});
							}
						}
					})
					return _result;
				}
				
				function beforeAsync(treeId, treeNode) {
					if(treeNode){
						MovePathParam = [];
						$('#' + treeNode.tId).parents('li').each(function(){
							MovePathParam.push($('#' + $(this).attr('id') + '_a').attr('title'));
						})
						MovePathParam.reverse();
						MovePathParam = MovePathParam.join('/') + '/' + treeNode.name + '/';
					}else{
						MovePathParam = -1
					}
				}
				
				function onClick(event, treeId, treeNode){
					MovePath = [];
					$('#' + treeNode.tId).parents('li').each(function(){
						MovePath.push($('#' + $(this).attr('id') + '_a').attr('title'));
					})
					if(MovePath.length == 0){
						alert($.i18n.prop('moveTip'));
					}
					MovePath.reverse();
					MovePath = MovePath.join('/') + '/' + treeNode.name + '/';
				}
				
				var setting = {
					view: {
						selectedMulti: false
					},
					async: {
						enable: true,
						url: 'file/targetPath',
						autoParam: ["id", "name", "level=lv"],
						otherParam: {proxyUserName: $('#UserSel').data('user'), appName: $('#UserSel').html(), path: function(){ return MovePathParam}},
						dataFilter: filter
					},
					callback: {
						beforeAsync: beforeAsync,
						onClick: onClick
					}
				};
				
				$.fn.zTree.init($("#treeDemo"), setting);
			}else if(_type == 'loadFile'){
				var _selPath;
				if(SelPathArr[0].split('||')[2] == 'true'){
					_selPath = SelPathArr[0].split('||')[0];
				}else{
					_selPath = SelPathArr[0].split('||')[0];
					_selPath = _selPath.substring(0, _selPath.length-1);
				}
				
				var feedbackNewDialog = BootstrapDialog.show({
					title: $.i18n.prop('loadToTable'),
					cssClass: 'loadFile-dialog',
					message: '<div class="addValueDialog form-horizontal" id="AddValueDialog" style="margin: 0 15px;font-size: 12px;">'
						+'<div class="form-group">'
						+'<label class="col-sm-3 control-label">'+$.i18n.prop('database')+'</label>'
						+'<div class="col-sm-9">'
//						+'<input class="form-control tblName" placeholder="dbName.tableName">'
						+'<div id="DatabaseChosen"></div>'
						+'</div>'
						+'</div>'
						
						+'<div class="form-group">'
						+'<label class="col-sm-3 control-label">'+$.i18n.prop('tableName')+'</label>'
						+'<div class="col-sm-9">'
//						+'<input class="form-control patitionName" placeholder="p_event_date=2016-08-01">'
						+'<div id="TableChosen"></div>'
						+'</div>'
						+'</div>'

						+'<div class="form-group">'
						+'<label class="col-sm-3 control-label">'+$.i18n.prop('partition')+'</label>'
						+'<div class="col-sm-9">'
//						+'<input class="form-control patitionName" placeholder="p_event_date=2016-08-01">'
						+'<div id="PartitionList"></div>'
						+'</div>'
						+'</div>'
						
						+'<div class="form-group">'
						+'<label class="col-sm-3 control-label">'+$.i18n.prop('isOverride')+'</label>'
						+'<div class="col-sm-9">'
							+'<span class="radio" style="display: inline-block; margin-right: 20px;">'
								+'<label>'
								+'<input type="radio" name="optionsRadios" id="optionsRadios1" value="yes" checked>'
								+$.i18n.prop('override')
								+'</label>'
							+'</span>'
							+'<span class="radio" style="display: inline-block; margin-right: 20px;">'
								+'<label>'
								+'<input type="radio" name="optionsRadios" id="optionsRadios2" value="no">'
								+$.i18n.prop('noOverride')
								+'</label>'
							+'</span>'
						+'</div>'
						+'</div>'
						
						+'<div class="form-group" style="margin-bottom: 10px; padding-top: 10px;">'
						+'<div class="col-sm-offset-3 col-sm-9">'
						+'<a href="javascript:;" class="btn btn-primary" id="AddNewFeedbackBtn">'+$.i18n.prop('submit')+'</a>'
						+'</div>'
						+'</div>'
						
						+'</div>',
					onshown: function(){
						Util.ajax({
							url: 'entry/getDataBases',
							data: {},
							success: function(data){
								data = data.data;
								
								var _dbNameSel = data[0].dbName,
									_dbIdSel = data[0].dbId;
								
								
								$('#DatabaseChosen').Chosen({
									data: data,
									selectedVal: [_dbNameSel],
									chosenConWidth: 350,
									idAlias: 'dbId',
									nameAlias: 'dbName',
									initCallback: function(){
										getTableList(_dbIdSel, _dbNameSel);
									},
									selectedCallback: function(id, name){
										getTableList(id, name);
									}
								})
							}
						})
						
						
						// 表列表
						function getTableList(dbId, dbName, num){
							var _param = {
								dbId: dbId,
								page: num || 1, 
								pageSize: 10000
							};
							
							var _url = 'entry/getTables';
							
							Util.ajax({
								url: _url,
								data: _param,
								success: function(data){
									data = data.data.rows;
									window.TableData = data;
									
									
									var _tblIdSel = data[0].tblId,
										_tblNameSel = data[0].tblName;
									
									
									$('#TableChosen').Chosen({
										data: data,
										selectedVal: [_tblNameSel],
										chosenConWidth: 350,
										idAlias: 'tblId',
										nameAlias: 'tblName',
										initCallback: function(){
											getPartitionList(_tblIdSel);
										},
										selectedCallback: function(id, name){
											getPartitionList(id);
										}
									})
									
								}
							})
						}


						// 表列表
						function getPartitionList(tableId){
							var _partitionData;

							$.each(TableData, function(k, v){
								if(v.tblId == tableId){
									_partitionData = v.partitions;
									return false;
								}
							})
							if(_partitionData.length == 0){
								$('#PartitionList').html('');
								$('#PartitionList').parents('.form-group').addClass('hidden');
								return;
							}

							$('#PartitionList').parents('.form-group').removeClass('hidden');
							var _html = '';
							$.each(_partitionData, function(k, v){
								_html += '<div class="item"><input type="text" disabled value="'+v+'" class="form-control pKey" style="display: inline-block; width: 47%"> : <input type="text" class="form-control pVal" style="display: inline-block;width: 50%"></div>'
							})

							$('#PartitionList').html(_html);

							$('#PartitionList .pVal').keyup(function(){
								$(this).parent().removeClass('hasError');
							})
						}

						
						$('#AddNewFeedbackBtn').off('click').on('click', function(){
							$(this).addClass('disable');
							
							var _partition = [];
							var _next = true;
							$('#PartitionList .item').each(function(){
								if($(this).find('.pVal').val() != ''){
									_partition.push($(this).find('.pKey').val() + '=' + $(this).find('.pVal').val())
								}else{
									$(this).addClass('hasError');

									swal("Error", $.i18n.prop('partitionNotNull')+'!', "error");
									_next = false;
								}
							})


							if(!_next){
								return;
							}
							
							swal({   
								title: $.i18n.prop('inProcess'),   
								text: "",   
								imageUrl: 'images/loading.gif',
								showConfirmButton: false
							});
							
							Util.ajax({
								url: 'file/loadFileToHive',
								data: {
									path: _selPath,
									tblName: $('#DatabaseChosen .fixedVal').val()+'.'+$('#TableChosen .fixedVal').val(),
									patitionName: _partition.join(','),
									overrite: $("input[name='optionsRadios']:checked").val(),
									proxyUserName: $('#UserSel').data('user'),
									appName: $('#UserSel').data('name')
								},
								success: function(data){
									if(data.code == 1){
										swal('Successful!', '', 'success');
										feedbackNewDialog.close();
										refreshFold();
									}else{
										swal("Error", data.data, "error");
									}
								}
							});	
						})
					}
				});
			}
		})
		
		
		
		$('#FileOpts .btnNew').click(function(){
			var _type = $(this).data('type');
			var _pathParent = $('#Breadcrumb li:last-child a').data('path');
			
			if(_type == 'file'){
				swal({   
					title: $.i18n.prop('newFile'),   
					text: "",   
					type: "input",   
					showCancelButton: true,   
					closeOnConfirm: false,   
					animation: "slide-from-top",   
					inputPlaceholder: $.i18n.prop('fileName')
				}, function(inputValue){   
					if (inputValue === false){
						return false;
					}
					
					if (inputValue === "") {     
						swal.showInputError("You need to write something!");     
						return false   
					}
					
					Util.ajax({
						url: 'file/createFile',
						data: {
							path: encodeUrl(_pathParent + inputValue),
							proxyUserName: $('#UserSel').data('user'),
							appName: $('#UserSel').html()
						},
						success: function(data){
							if(data.code == 1){
								swal('Successful!', '', 'success');
								
								refreshFold();
							}else{
								swal('Error!', data.data, 'error');
							}
						}
					});
				});
			}else if(_type == 'fold'){
				swal({   
					title: $.i18n.prop('newFold'),   
					text: "",   
					type: "input",   
					showCancelButton: true,   
					closeOnConfirm: false,   
					animation: "slide-from-top",   
					inputPlaceholder: $.i18n.prop('fold')
				}, function(inputValue){   
					if (inputValue === false){
						return false;
					}
					
					if (inputValue === "") {     
						swal.showInputError("You need to write something!");     
						return false   
					}
					
					Util.ajax({
						url: 'file/createDirectory',
						data: {
							path: encodeUrl(_pathParent + inputValue),
							proxyUserName: $('#UserSel').data('user'),
							appName: $('#UserSel').html()
						},
						success: function(data){
							if(data.code == 1){
								swal('Successful!', '', 'success');
								
								refreshFold();
							}else{
								swal('Error!', data.data, 'error');
							}
						}
					});
				});
			}
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
		        	var _path = $('#Breadcrumb li:last-child a').data('path');
					if(_path != undefined){
						getFileList(_path);
					}else{
						getFileList();
					}
			}
		});
		
		$('#FilePathGo').click(function(e){
			var _val = $('#FilePathSearch').val();
			if(_val != '' && _val.substring(_val.length - 1) != '/'){
				_val += '/'
			}
			getFileList(_val);
		});
		
		$('#TableHeader th').click(function(){
			var _sort = $(this).data('sort');
			if(_sort){
				if(_sort == 'desc'){
					$(this).data('sort', 'asc');
					$(this).find('i').removeClass('fa-sort-desc').addClass('fa-sort-asc');
					_sort = 'asc';
				}else{
					$(this).data('sort', 'desc');
					$(this).find('i').removeClass('fa-sort-asc').addClass('fa-sort-desc');
					_sort = 'desc';
				}
			}else{
				$(this).data('sort', 'asc');
				$(this).find('i').addClass('fa-sort-asc');
				_sort = 'asc';
			}
			var _type = $(this).data('type');
			Sort = {orderBy: _type, orderRule: _sort};
			
			refreshFold();
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