$(function(){
	var _pathName = window.location.pathname;
	_pathName = _pathName.substring(1, _pathName.lastIndexOf('/'));
	
	window.UserName = $('#UserName').html() + '_' + _pathName + '_';
	
	var ConnId,
		ChromeTab,
		AppList = {},
		TimerResult,
		ErrorTip = {},
		QueryKey = {},
		LogKey = {},
		QueryCountKey = {},
		ErrorStatus = {},
		ErrorStatusDownload = {},
		SuccessLogStatus = {},
		SuccessResultStatus = {},
		QueryUser = {},
		QueryAppName = {},
		QueryDownloadKey = {},
		QueryDownloadFile = {},
		QueryHistory = {},
		QueryStop = {},
		DownloadFile = [],
		Downloading = {},
		SqlParam = {},
		TimerResultTab,
		RunningTab;
	
	function getTimeL(ms) { 
		var day = Math.floor(ms / (60 * 60 * 24 * 1000));
		var hour = Math.floor(ms / (3600 * 1000)) - (day * 24);
		var minute = Math.floor(ms / (60 * 1000)) - (day * 24 * 60) - (hour * 60);
		var second = Math.floor(ms / 1000) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
	    var millisecond =  ms - (day * 24 * 60 * 60 * 1000) - (hour * 60 * 60 * 1000) - (minute * 60 * 1000) - (second * 1000);
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
	    }
	    if(millisecond > 0){
	    	sb.push(millisecond+"ms");  
	    }
	    return sb.join(':');  
	} 
	
	function html_encode(str){   
		  var s = "";   
		  if (str == null) return "null";   
		  if (str.length == 0) return "";   
		  s = str.replace(/&/g, "&amp;");   
		  s = s.replace(/</g, "&lt;");   
		  s = s.replace(/>/g, "&gt;");   
		  s = s.replace(/ /g, "&nbsp;");   
		  s = s.replace(/\'/g, "&#39;");   
		  s = s.replace(/\"/g, "&quot;");   
		  s = s.replace(/\n/g, "<br>");
		  return s;   
	}   
	
	window.getPartitions = function(tableName){
		var _result = '';
		$.ajax({
			url: 'entry/getPartitionsByTblName',
			data: {
				'dbName': $('#DatabaseChosen .fixedVal').val(), 
				'tblName': tableName
			},
			async: false, 
			success: function(data){
				data = data.data;
				var _partitions = [];
				if(data.length > 0){
					$.each(data, function(k, v){
						_partitions.push(v + "=''");
					})
					_result += 'WHERE ' + _partitions.join(' AND ');
				}
			}
		});
		return _result;
	}
	
	function getActiveEditor(){
		return "CodeSql_"+$("#EditTable .cTab.active").data("target").split("e")[1];
	}
	
	function getKeyword(str){
		var _reg = /'(.*?)'/g;
		var arr = str.match(_reg);
		$.each(arr, function(k, v){
			arr[k] = v.replace(new RegExp(/'/g),'')
		})
		return arr;
	}
	
	function hasLimit(errorMsg){
		var str = window[getActiveEditor()].getSelection();
		if(str != ''){
			var _result = [];
			if(window[getActiveEditor()].doc.sel.ranges[0].anchor.line == window[getActiveEditor()].doc.sel.ranges[0].head.line){
				var _ach = window[getActiveEditor()].doc.sel.ranges[0].anchor.ch,
					_hch = window[getActiveEditor()].doc.sel.ranges[0].head.ch,
					_ch = _ach > _hch ? _hch : _ach;
				
				if(errorMsg.split('||').length == 4 || errorMsg.substring(0,2) == '--'){
					_result.push(-_ch);
				}else{
					var arr = str.split(' ');
					var _h = false;
					var _r = 15;
					for(var i = arr.length-1; i!=-1; i--){
						if(_h && arr[i].length >= 5 && arr[i].substring(arr[i].length - 5).toLowerCase() == 'limit'){
							_r = 0;
							break;
						}
						if(arr[i] != ''){
							_h = true;
						}
					}
					_result.push(_r - _ch);
				}
				
			}else{
				_result.push(0);
			}
			
			var _al = window[getActiveEditor()].doc.sel.ranges[0].anchor.line,
				_hl = window[getActiveEditor()].doc.sel.ranges[0].head.line,
				_ll = _al > _hl ? _hl : _al;
			_result.push(_ll);
			return _result;
		}
		
		if(window[getActiveEditor()].doc.size > 1 || errorMsg.split('||').length == 4 || errorMsg.substring(0,2) == '--'){
			return 0;
		}
		str = window[getActiveEditor()].getValue();
		var arr = str.split(' ');
		var _h = false;
		var _result = 15;
		for(var i = arr.length-1; i!=-1; i--){
			if(_h && arr[i].length >= 5 && arr[i].substring(arr[i].length - 5).toLowerCase() == 'limit'){
				_result = 0;
				break;
			}
			if(arr[i] != ''){
				_h = true;
			}
		}
		return _result;
	}
	
	function analyticError(errorMsg){
		var _hasLimit = hasLimit(errorMsg);
		var _dif = _hasLimit,
			_lineDif = 0;
		
		if(typeof _hasLimit == 'object'){
			_dif = _hasLimit[0];
			_lineDif = _hasLimit[1];
		}
		var _posInfo = [];
		var _result = [];
		if(errorMsg.split('||').length == 4){
			var _errorList = errorMsg.split('||');
			_posInfo[0] = parseInt(_errorList[0]) - 1 + _lineDif;
			_posInfo[1] = parseInt(_errorList[1]) - _dif;
			_posInfo[2] = _posInfo[1] + _errorList[2].length;;
			errorMsg = _errorList[3];
		}else if(errorMsg.indexOf('Error 10001') > -1){
			var _error = errorMsg.split(': ');
			_error = _error[_error.length - 1];
			_posInfo = _error.split(' ')[1].split(':');
			_posInfo[0] = parseInt(_posInfo[0]) - 1 + _lineDif;
			_posInfo[1] = parseInt(_posInfo[1]) - _dif;
			
			var _keyword = getKeyword(_error);
			if(_keyword != null){
				_keyword = _keyword[0];
				_result = [1, _keyword];

				_posInfo[2] = window[getActiveEditor()].doc.getLineHandle(_posInfo[0]).text.indexOf(_keyword) + _keyword.length;
			}else{
				_posInfo = [];
			}
		}else if(errorMsg.indexOf('Parse sql error') > -1){
			var _error = errorMsg.split(': ');
			_error = _error[1];
			_posInfo = _error.split(' ')[1].split(':');
			_posInfo[0] = parseInt(_posInfo[0]) - 1 + _lineDif;
			_posInfo[1] = parseInt(_posInfo[1]) - _dif;

			var _keyword = getKeyword(_error);
			if(_keyword != null){
				if(_error.indexOf('EOF') > -1){
					_posInfo[2] = _posInfo[1] + _keyword[1].length;
					_posInfo[1] = _posInfo[1];
				}else if(_error.indexOf('cannot recognize input near') > -1){
					_posInfo[2] = _posInfo[1] + _keyword[0].length;
				}
				_result = [2];
			}else{
				_posInfo = [];
			}
		}else if(errorMsg.indexOf('Error 10004') > -1){
			var _error = errorMsg.split('[Error 10004]: ');
			_error = _error[1];
			_posInfo = _error.split(' ')[1].split(':');
			_posInfo[0] = parseInt(_posInfo[0]) - 1 + _lineDif;
			_posInfo[1] = parseInt(_posInfo[1]) - _dif;

			var _keyword = getKeyword(_error);
			if(_keyword != null){
				_posInfo[2] = _posInfo[1] + _keyword[0].length;
				_result = [2];
			}else{
				_posInfo = [];
			}
		}else if(errorMsg.indexOf('org.apache.spark.sql.AnalysisException') > -1){
			var _error = errorMsg.split(' ');

			_posInfo[0] = parseInt(_error[_error.length - 3]) - 1 + _lineDif;
			_posInfo[1] = parseInt(_error[_error.length - 1]) - _dif;

			var _keyword = getKeyword(errorMsg);
			if(_keyword != null){
				_posInfo[2] = _posInfo[1] + _keyword[0].length;
				_result = [2];
			}else{
				_posInfo = [];
			}
		}
//		if(_posInfo.length > 0 && _posInfo[0] > 0 && _posInfo[1] > 0){
		if(_posInfo.length > 0 && _posInfo[1] >= 0){
			_result = [-1];
			window.CodeRange = window[getActiveEditor()].markText({line: _posInfo[0], ch: _posInfo[1]}, {line: _posInfo[0], ch: _posInfo[2]}, {className: "styled-background"});
			
			var htmlNode = document.createElement("div");
			htmlNode.setAttribute('class', 'alert alert-danger alertEditor');
			if(errorMsg.substring(0,2) == '--'){
				errorMsg = errorMsg.substring(2);
			}
			var text = document.createTextNode(errorMsg);
			
			var iNode = document.createElement("i");
			iNode.setAttribute('class', 'fa fa-warning');
			
			htmlNode.appendChild(iNode);
			htmlNode.appendChild(text);
			
			ErrorTip[getActiveEditor()] = window[getActiveEditor()].addLineWidget(_posInfo[0], htmlNode, {coverGutter: true, noHScroll: true}) 
		}
		return _result;
	}
	
	function codeEditor(textarea) {
		var _thisId = textarea.attr('id');

		function completeAfter(cm, pred) {
			var cur = cm.getCursor();
			if (!pred || pred()) setTimeout(function() {
				if (!cm.state.completionActive)
					cm.showHint({
						completeSingle: false
					});
			}, 100);
			return CodeMirror.Pass;
		}

		function completeIfAfterLt(cm) {
			return completeAfter(cm, function() {
				var cur = cm.getCursor();
				return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) == "<";
			});
		}

		function completeIfInTag(cm) {
			return completeAfter(cm, function() {
				var tok = cm.getTokenAt(cm.getCursor());
				if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
				var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
				return inner.tagName;
			});
		}


		window[_thisId] = CodeMirror.fromTextArea(document.getElementById(_thisId), {
			mode: 'text/x-hive',
			indentWithTabs: true,
			smartIndent: true,
			lineNumbers: true,
			matchBrackets: true,
			autofocus: false,
			styleSelectedText: true,
			extraKeys: {
				"'a'": completeAfter,
				"'b'": completeAfter,
				"'c'": completeAfter,
				"'d'": completeAfter,
				"'e'": completeAfter,
				"'f'": completeAfter,
				"'g'": completeAfter,
				"'h'": completeAfter,
				"'i'": completeAfter,
				"'j'": completeAfter,
				"'k'": completeAfter,
				"'l'": completeAfter,
				"'m'": completeAfter,
				"'n'": completeAfter,
				"'o'": completeAfter,
				"'p'": completeAfter,
				"'q'": completeAfter,
				"'r'": completeAfter,
				"'s'": completeAfter,
				"'t'": completeAfter,
				"'u'": completeAfter,
				"'v'": completeAfter,
				"'w'": completeAfter,
				"'x'": completeAfter,
				"'y'": completeAfter,
				"'z'": completeAfter,
				"'.'": completeAfter,
				"'='": completeIfInTag,
				// ,
				// "Ctrl-Space": "autocomplete",
				"Ctrl-Enter": "autocomplete",

				Tab: function(cm) {
					var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
					cm.replaceSelection(spaces);
				}
			}
		});

		window[_thisId].on('change', function() {
			typeof CodeRange != 'undefined' && CodeRange.clear();
			typeof ErrorTip[getActiveEditor()] != 'undefined' && window[getActiveEditor()].removeLineWidget(ErrorTip[getActiveEditor()]);
			
			store.set(UserName + 'sql', window[getActiveEditor()].getValue());
		})
	}
	
	function resetDom(){
		typeof TimerResult != 'undefined' && clearInterval(TimerResult);
		
		SuccessLogStatus[getActiveEditor()] = false;
		SuccessResultStatus[getActiveEditor()] = false;
		
		$('#EditOpts .btRunSpark').removeClass('hidden');
		$('#EditOpts .btRunHive').removeClass('hidden');
		$('#EditOpts .btStop').addClass('hidden').removeClass('has');
		
		$('#ExportWrap').addClass('hidden');
		$('#ExportAllDataTip').addClass('hidden');
		
		$('#BtnExportAll').removeAttr('data-querykey');
		$('#BtnExportAll').removeAttr('data-file');
		$('#BtnExportAll').removeClass('disabled');
		$('#DownloadLoading').addClass('hidden');
		
		$('#LogCon').html('');
		
		$('#ResultTip').hide();
        $('#ResultTable').show();
        $('#ResultListHeader').html('');
        $('#ResultList').html('');
        $('#ResultListPage').html('');
	}
	
	function setCookieData(){
		$('#CodeSql_1').val(store.get(UserName + 'sql'));
		if(store.get(UserName + 'tabName')){
			$('#EditTable li').eq(0).find('span').html(store.get(UserName + 'tabName'));
			$('#EditTable li').eq(0).find('span').attr('data-id', store.get(UserName + 'tabId'));
			
			$('.cTab-pane.active').find('.btnSave').attr({
				'data-id': store.get(UserName + 'tabId'),
				'data-alias': store.get(UserName + 'tabName')
			})
		}
	}
	
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
		});ssssssss
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
				
				// 查询用户
				$('#UserKeyword').keyup(function(e){
					switch(e.keyCode){
				        case 13: // enters
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
	
	// 数据库连接列表
	function getConnectList(){
//		Util.ajax({
//			url: 'ConnectController/saveConnection',
//			data: {
//				connectName: '测试',
//				connectType: 'mysql',
//				connectUrl: '127.0.0.1',
//				connectUser: 'dujz',
//				connectPwd: 'dujz'
//			},
//			success: function(data){
//				console.log(data)
//			}
//		});
		
		
//		Util.ajax({
//			url: 'ConnectController/saveConnection',
//			data: {
//				connectName: '测试',
//				connectType: 'mysql',
//				connectUrl: '127.0.0.1',
//				connectUser: 'dujz',
//				connectPwd: 'dujz',
//				connectOwner: 'all'
//			},
//			success: function(data){
//				console.log(data)
//			}
//		});
		
		
		Util.ajax({
			url: 'ConnectController/getConnections',
			success: function(data){
				console.log(data);
				
				if(data.data.length > 0){
					var _data = data.data;
					
					var _connSelName = store.get(UserName + 'connSelName') || _data[0].connectName;
					var _connSelId = store.get(UserName + 'connSelId') || _data[0].id;
					
					ConnId = _connSelId;
					
					$('#ConnectChosen').Chosen({
						data: _data,
						selectedVal: [_connSelName],
						chosenConWidth: 237,
						idAlias: 'id',
						nameAlias: 'connectName',
						initCallback: function(){
							getDatabase(_connSelId);
						},
						selectedCallback: function(id, name){
//							store.set(UserName + 'connSelName', name);
//							store.set(UserName + 'connSelId', id);
							
							ConnId = id;
							
							getDatabase();
						}
					})
				}
			}
		})
	}
	
	// 数据库列表
	function getDatabase(){
		var _url = 'entry/getDataBases';
		var _data = {'ConnId': ConnId};
		
		Util.ajax({
			url: _url,
			data: _data,
			success: function(data){
				data = data.data;
				window.DatabaseList = {};
				
				var _dbNameSel = store.get(UserName + 'dbNameSel') || data[0].dbName,
					_dbIdSel = store.get(UserName + 'dbIdSel') || data[0].dbId;
				
				if(data == null || data.length == 0){
					$('#DatabaseChosen').html('--');
					$('#TableList').html('--');
					$('#TableKeyword').addClass('hidden');
					$('#TableListPage').html('')
					
					return;
				}
				$('#DatabaseChosen').Chosen({
					data: data,
					selectedVal: [_dbNameSel],
					chosenConWidth: 237,
					idAlias: 'dbId',
					nameAlias: 'dbName',
					initCallback: function(){
						getTableList(_dbIdSel, _dbNameSel);
					},
					selectedCallback: function(id, name){
//						store.set(UserName + 'dbNameSel', name);
//						store.set(UserName + 'dbIdSel', id);
						getTableList(id, name);
					}
				})
				var _userList = [];
				var _html = '';
				$.each(data, function(k, v){
					DatabaseList[v.dbName] = true;
				})
			}
		})
	}
	
	// 表列表
	function getTableList(dbId, dbName, num){
		var _param = {
			ConnId: ConnId,
			dbId: dbId,
			dbName: dbName,
			page: num || 1, 
			pageSize: 100
		};
		
		var _url = 'entry/getTables';
		
		Util.ajax({
			url: _url,
			data: _param,
			success: function(data){
				data = data.data;
				$('#TableList').scrollTop(0);
				
				var _html = '';
				
				window.db = [];
				$.each(data.rows, function(k, v){
					db.push(v.tblName);
					
					var _partition = v.partitions == null ? '' : v.partitions.join(',');
					_html += '<li data-id="'+v.tblId+'" data-name="'+v.tblName+'" data-partitions="'+_partition+'">'
						+'<a href="javascript:;">'
							+'<i class="fa fa-table"></i>'
							+'<span data-toggle="tooltip" data-placement="top" title="'+v.tblName+'">'+v.tblName+'</span>'
							//	                    +'<a href=""><i class="fa fa-star-o"></i></a>'
						+'</a>'
					+'</li>'
				})
				if(_html == ''){
					$('#TableList').html('--');
					$('#TableKeyword').addClass('hidden');
				}else{
					$('#TableList').html(_html);
					if(data.rows.length > 10){
						$('#TableKeyword').removeClass('hidden');
					}else{
						$('#TableKeyword').addClass('hidden');
					}
				}
				
				if(data.total > 100){
					$('#TableListPage').html('<div class="inner"></div>');
					$('#TableListPage .inner').bootpag({
						total: Math.ceil(data.total / 100),
						page: data.page,
						maxVisible: 5,
						leaps: false
					}).on('page', function(event, num){
						getTableList(dbId, dbName, num);
					});
				}else{
					$('#TableListPage').html('');
				}
			}
		})
	}
	
	// 查询历史列表
	function getQueryHistory(){
		Util.ajax({
			url: 'getQueryHistory',
			success: function(data){
				var _html = '';
				
//				$.each(data.data, function(k, v){
//					_html += '<li data-id="'+v.id+'" data-queryType="'+v.queryType+'" data-logKey="'+v.logKey+'" data-queryCountKey="'+v.queryCountKey+'" data-queryKey="'+v.queryKey+'" data-sql="'+encodeURIComponent(v.sql)+'">'
//	                  +'<a href="javascript:;">'
//	                    +'<i class="fa fa-clock-o" aria-hidden="true"></i>'
//	                    +'<span data-toggle="tooltip" data-placement="top" title="'+v.sql+'">'+v.sql+'</span>'
//	                  +'</a>'
//	                +'</li>'
//				})
//				
//				$('#QueryHistoryList').html(_html);
				
				$.each(data.data, function(k, v){
					var _state,
						_type;
					
					if(v.queryType == 'H'){
						_type = 'MR';
					}else if(v.queryType == 'S'){
						_type = 'Spark';
					}else if(v.queryType == 'M'){
						_type = 'Mysql';
					}else if(v.queryType == 'I'){
						_type = 'Impala';
					}
					
					if(v.runningState == 2){
						_state = '<span class="label label-success">'+$.i18n.prop('success')+'</span>';
					}else if(v.runningState == 1){
						_state = '<span class="label label-info">'+$.i18n.prop('running')+'</span>';
					}else if(v.runningState == 0){
						_state = '<span class="label label-warning">'+$.i18n.prop('killed')+'</span>';
					}else if(v.runningState == -1){
						_state = '<span class="label label-danger">'+$.i18n.prop('failed')+'</span>';
					}
					
					var _sql = v.sql.replace(new RegExp(/"/g),'');
					_html += '<tr>'
						+'<td>'+new Date(v.date).Format("yyyy-MM-dd hh:mm:ss")+'</td>'
						+'<td><div class="sqlCon" title="'+_sql+'"><code>'+_sql.substring(0, 120)+'...</code></div></td>'
						+'<td>'+ _type +'</td>'
						+'<td>'+_state+'</td>'
						+'<td><a href="javascript:;" class="detail" data-appname="'+v.appName+'" data-dbname="'+v.dbName+'" data-state="'+v.runningState+'" data-id="'+v.id+'" data-queryType="'+v.queryType+'" data-logKey="'+v.logKey+'" data-queryCountKey="'+v.queryCountKey+'" data-queryKey="'+v.queryKey+'" data-proxyUser="'+v.proxyUser+'" data-sql="'+encodeURIComponent(v.sql)+'">'+$.i18n.prop('showResult')+'</a></td>'
	                +'</tr>'
				})
				
				$('#HistoryList').html(_html);
			}
		})
	}
	
	// 保存的查询
	function getQueryList(num){
		var _param = {
			type: 2,
			page: num || 1, 
			pageSize: 100
		};
		
		Util.ajax({
			url: 'entry/getCustomEntryList',
			data: _param,
			success: function(data){
				$('#QueryList').scrollTop(0);
				
				if(data.data.total == 0){
					$('#QueryList').html('--'+$.i18n.prop('noResult')+'--');
					return;
				}
				
				data = data.data;
				
				var _html = '';
				$.each(data.rows, function(k, v){
					_html += '<li>'
	                  +'<a href="javascript:;" data-id="'+v.id+'" class="item">'
	                    +'<i class="fa fa-file-code-o"></i>'
	                    +'<span data-toggle="tooltip" data-placement="top" title="'+v.alias+'">'+v.alias+'<label title="'+v.context+'">('+v.context+')</label></span>'
	                  +'</a>'
	                  +'<a href="javascript:;" class="del" data-id="'+v.id+'" title="'+$.i18n.prop('delRecord')+'"><i class="fa fa-trash-o" aria-hidden="true"></i></a>'
	                +'</li>'
				});
				
				$('#QueryList').html(_html);
				
				if(data.total > 100){
					$('#QueryListPage').html('<div class="inner"></div>');
					$('#QueryListPage .inner').bootpag({
			            total: Math.ceil(data.total / 100),
			            page: data.pageIndex,
			            maxVisible: 5
			        }).on('page', function(event, num){
			        	getTableList(dbId, dbName, num);
			        });
				}else{
					$('#QueryListPage').html('');
				}
			}
		})
	}
	
	// 查询结果
	function getResultList(num){
//		if(Downloading[getActiveEditor()]){
//			$('#ExportWrap').removeClass('hidden');
//			$('#BtnExportAll').addClass('disabled');
//			$('#ExportAllDataTip').removeClass('hidden');
//			$('#DownloadLoading').removeClass('hidden');
//			
//			getDownloadFile();
//		}
		
		if((SuccessResultStatus[getActiveEditor()] && typeof num == 'undefined') || QueryKey[getActiveEditor()] == null){
			if($('#ResultList').find('.label-success').length == 0){
				$('#ExportWrap').removeClass('hidden');
			}
			if(!Downloading[getActiveEditor()]){
				return;
			}
		}
		var _param = {
			queryKey: QueryKey[getActiveEditor()],
			queryCountKey: QueryCountKey[getActiveEditor()],
			page: num || 1, 
			pageSize: 100
		};
		
		Util.ajax({
			url: 'query',
			data: _param,
			success: function(data){
				if(data.code == 0){
					if(!ErrorStatus[getActiveEditor()]){
						if(typeof data.data == 'object'){
							swal("Error", data.data[0], "error");
						}else{
							var _result = analyticError(data.data);
							if(_result[0] != -1){
								swal({
									title: "Error",   
									text: data.data,
									type: "error",
									html: true 
								});
							}
						}
					}
					
					$('#EditOpts .btRunSpark').removeClass('hidden');
					$('#EditOpts .btRunHive').removeClass('hidden');
					$('#EditOpts .btStop').addClass('hidden');
					
					typeof TimerResult != 'undefined' && clearInterval(TimerResult);
					
					$('#ResultTip').hide();
					$('#ResultTable').show();
					
					var _errorTxt;
					if(typeof data.data == 'object'){
						_errorTxt = data.data[1];
					}else{
						_errorTxt = data.data;
					}
					
					$('#ResultList').html('<p><span class="label label-danger">'+$.i18n.prop('runError')+'---</span></p>'+_errorTxt.replace(new RegExp(/\n/g),'<br/>'));
					
					ErrorStatus[getActiveEditor()] = true;
					
					return;
				}else if(data.code == 1){
					data = data.data;
					
					var _circleData = true;
					
					if(data == 'processing...'){
						$('#ResultTip').show();
						$('#ResultTable').hide();
						
						$('#EditOpts .btRunSpark').addClass('hidden');
						$('#EditOpts .btRunHive').addClass('hidden');
						$('#EditOpts .btStop').removeClass('hidden');
						
						typeof TimerResult != 'undefined' && clearInterval(TimerResult);
						TimerResult = setInterval(function(){
							typeof TimerResult != 'undefined' && clearInterval(TimerResult);
							getResultList();
						}, 1000);
						
						return false;
					}else{
						typeof TimerResult != 'undefined' && clearInterval(TimerResult);
						SuccessResultStatus[getActiveEditor()] = true;
						$('#ResultTip').hide();
						$('#ResultTable').show();
						
						$('#EditOpts .btRunSpark').removeClass('hidden');
						$('#EditOpts .btRunHive').removeClass('hidden');
						$('#EditOpts .btStop').addClass('hidden');
						
						if(data == 'finished'){
							$('#ResultList').html('<span class="label label-success">'+$.i18n.prop('finishedNoResult')+'!</span>');
							$('#ExportWrap').addClass('hidden');
							return false;
						}
					}
					
					$('#ResultListHeader').html('');
					$('#ResultList').html('');
					$('#ResultListPage').html('');
					
					if(data.rows.length == 0){
						$('#ResultList').html('<span class="label label-success">'+$.i18n.prop('finishedNoResult')+'!</span>');
						$('#ExportWrap').addClass('hidden');
					}else{
						$('#ExportWrap').removeClass('hidden');
						if(data.total == 1000){
							$('#BtnExportAll').removeClass('hidden');
							
							if(QueryDownloadKey[getActiveEditor()] != undefined){
								$('#BtnExportAll').attr('data-querykey', QueryDownloadKey[getActiveEditor()]);
								
								if(QueryDownloadFile[getActiveEditor()] != undefined){
									$('#BtnExportAll').attr('data-file', true);
								}
							}
							if(Downloading[getActiveEditor()]){
								$('#BtnExportAll').addClass('disabled');
								$('#ExportAllDataTip').removeClass('hidden');
								$('#DownloadLoading').removeClass('hidden');
								
								getDownloadFile();
							}
						}else{
							$('#BtnExportAll').addClass('hidden');
						}
					
						var _html = '<th>#</th>';
						var _keyList = [];
						$.each(data.rows[0], function(k, v){
							if(k.indexOf('.') > -1){
								_html += '<th>'+k.split('.')[1]+'</th>';
							}else{
								_html += '<th>'+k+'</th>';
							}
							_keyList.push(k);
						})
						
						$('#ResultListHeader').html('<tr>'+_html+'</tr>');
						
						_html = '';
						$.each(data.rows, function(k, v){
							_html += '<tr><td class="rowNum">'+((k+1)+(data.pageIndex-1)*100)+'</td>';
							
							$.each(_keyList, function(key, val){
								_html += '<td>'+html_encode(v[val])+'</td>';
							});
							
							_html += '</tr>'
						})
						
						$('#ResultList').html(_html);
						
						if(data.total > 0){
							$('#ResultListPage').html('<div class="inner"></div>');
							$('#ResultListPage .inner').bootpag({
								total: Math.ceil(data.total / 100),
								page: data.pageIndex,
								maxVisible: 10
							}).on('page', function(event, num){
								getResultList(num);
							});
						}else{
							$('#ResultListPage').html('');
						}
					}
				}else if(data.code == 3){
					typeof TimerResult != 'undefined' && clearInterval(TimerResult);
					SuccessResultStatus[getActiveEditor()] = true;
					$('#ResultTip').hide();
					$('#ResultTable').show();
					
					$('#EditOpts .btRunSpark').removeClass('hidden');
					$('#EditOpts .btRunHive').removeClass('hidden');
					$('#EditOpts .btStop').addClass('hidden');
					
					$('#ResultList').html('<span class="label label-success">'+$.i18n.prop('dataExpire')+'!</span>');
				}
			}
		})
	}
	
	// 提交下载请求
	function getDownloadKey(){
		var _sql = window[getActiveEditor()].getSelection();
		if(_sql == ''){
			_sql = window[getActiveEditor()].getValue();
		}
		
		$.each(SqlParam[getActiveEditor()], function(k, v){
			var _reg = '/'+k.replace('$', '\\$')+'/g';
			_sql = _sql.replace(eval(_reg), v);
		})
		
		var _param = {
			sql: _sql,
			ConnId: ConnId,
			pageSize: 100,
			dbName: $('#DatabaseChosen .fixedVal').val(),
			queryKey: QueryKey[getActiveEditor()],
			proxyUserName: QueryUser[getActiveEditor()],
			appName: QueryAppName[getActiveEditor()],
			forBigData: 1
		};
		
		Util.ajax({
			url: 'applySql',
			data: _param,
			success: function(data){
				if(data.code == 1){
					QueryDownloadKey[getActiveEditor()] = data.data.queryKey;
					$('#BtnExportAll').attr('data-querykey', data.data.queryKey);
					
					getDownloadFile();
				}else{
					$('#EditOpts .btRunSpark').removeClass('hidden');
					$('#EditOpts .btRunHive').removeClass('hidden');
					$('#EditOpts .btStop').addClass('hidden');
					
					var _result = analyticError(data.data);
					if(_result[0] != -1){
						swal('Error', data.data, 'error');
					}
				}
			}
		});
	}
	
	// 获得下载文件
	function getDownloadFile(){
		var _param = {
			queryKey: QueryDownloadKey[getActiveEditor()],
			queryCountKey: QueryCountKey[getActiveEditor()],
			forBigData: 1
		};
		
		Util.ajax({
			url: 'query',
			data: _param,
			success: function(data){
				if(data.code == 0){
					if(!ErrorStatusDownload[getActiveEditor()]){
						if(typeof data.data == 'object'){
							swal("Error", data.data[0], "error");
						}else{
							swal("Error", data.data, "error");
						}
					}
					
					typeof TimerResult != 'undefined' && clearInterval(TimerResult);
					
					ErrorStatusDownload[getActiveEditor()] = true;
				}else if(data.code == 1){
					data = data.data;
					
					var _circleData = true;
					
					if(data == 'processing...'){
						$('#ExportAllDataTip').removeClass('hidden');
						
						typeof TimerResult != 'undefined' && clearInterval(TimerResult);
						TimerResult = setInterval(function(){
							typeof TimerResult != 'undefined' && clearInterval(TimerResult);
							getDownloadFile();
						}, 1000);
						
					}else{
						typeof TimerResult != 'undefined' && clearInterval(TimerResult);
						$('#ExportAllDataTip').addClass('hidden');
						
						$('#BtnExportAll').attr('data-file', true);
						
						QueryDownloadFile[getActiveEditor()] = true;
						
						$('#ExportAllDataTip').addClass('hidden');
						$('#DownloadLoading').addClass('hidden');
						
						if(DownloadFile.indexOf(QueryKey[getActiveEditor()]) == -1){
							$.exportExcel({
								queryKey: QueryDownloadKey[getActiveEditor()],
								forBigData: 1,
								url: 'downloadFile'
							});
							$('#BtnExportAll').removeClass('disabled');
							DownloadFile.push(QueryKey[getActiveEditor()]);
						}
						Downloading[getActiveEditor()] = false;
					}
				}else if(data.code == 3){
					typeof TimerResult != 'undefined' && clearInterval(TimerResult);
					
					$('#ExportAllDataTip').removeClass('hidden');
					
					typeof TimerResult != 'undefined' && clearInterval(TimerResult);
					TimerResult = setInterval(function(){
						typeof TimerResult != 'undefined' && clearInterval(TimerResult);
						getDownloadFile();
					}, 1000);
				}
				
			}
		})
	}
	
	// 日志信息
	function getResultLog(){
		if(SuccessLogStatus[getActiveEditor()] || QueryKey[getActiveEditor()] == null){
			return;
		}
		RunningTab = getActiveEditor();
		Util.ajax({
			url: 'logs',
			data: {
				logKey: LogKey[getActiveEditor()],
				queryKey: QueryKey[getActiveEditor()],
				queryCountKey: QueryCountKey[getActiveEditor()]
			},
			success: function(data){
				if(RunningTab != getActiveEditor()){
					return;
				}
				if(data.code == 0){
					if(!ErrorStatus[getActiveEditor()]){
						if(typeof data.data == 'object'){
							swal("Error", data.data[0], "error");
						}else{
							var _result = analyticError(data.data);
							if(_result[0] != -1){
								swal({
									title: "Error",   
									text: data.data,
									type: "error",
									html: true 
								});
							}
						}
					}
					ErrorStatus[getActiveEditor()] = true;
					
					$('#EditOpts .btRunSpark').removeClass('hidden');
					$('#EditOpts .btRunHive').removeClass('hidden');
					$('#EditOpts .btStop').addClass('hidden');
					typeof TimerResult != 'undefined' && clearInterval(TimerResult);
					
					var _errorTxt;
					if(typeof data.data == 'object'){
						_errorTxt = data.data[1];
					}else{
						_errorTxt = data.data;
					}
					
					var _startTxt = QueryHistory[getActiveEditor()] ? '' : '<p><span class="label label-primary">'+$.i18n.prop('taskStart')+'---</span></p>';
					$('#LogCon').html(_startTxt);
					
					if(_errorTxt.split('||').length == 4){
						_errorTxt = _errorTxt.split('||')[3];
					}
					
					$('#LogCon').append('<p><span class="label label-danger">'+$.i18n.prop('runError')+'---</span></p>'+_errorTxt.replace(new RegExp(/\n/g),'<br/>'));
					return;
				}else if(data.code == 1){
					var _startTxt = QueryHistory[getActiveEditor()] ? '' : '<p><span class="label label-primary">'+$.i18n.prop('taskStart')+'---</span></p>';
					$('#LogCon').html(_startTxt);
					
					var _logText = '';
					if(data.data != null && data.data != 'there is no available logs'){
						if(data.data.sparkLog != undefined){
							$.each(data.data.sparkLog, function(k, v){
								var _percent;
								
								if(v.percent == '100%'){
									_percent = '<span class="label label-success">100%</span>';
								}else{
									_percent = '<span class="label label-info">' + v.percent + '</span>';
								}
								
								_logText += '<p><b>JobID: '+ v.jobid + '</b>&nbsp;&nbsp;' + _percent + '</p>';
								
								$.each(v.log, function(key, val){
									_logText += val + '<br/>';
								});
								_logText += '<div class="logDivider"></div>';
							})
						}else{
							if(typeof data.data != 'object'){
								_logText = data.data.replace(new RegExp(/\n/g),'<br/>');
							}
						}
					}
					$('#LogCon').append(_logText);
					
					$('#EditOpts .btRunSpark').addClass('hidden');
					$('#EditOpts .btRunHive').addClass('hidden');
					$('#EditOpts .btStop').removeClass('hidden');
				}
				
				if(data.code == 2){
					var _startTxt = QueryHistory[getActiveEditor()] ? '' : '<p><span class="label label-primary">'+$.i18n.prop('taskStart')+'---</span></p>';
					$('#LogCon').html(_startTxt);
					
					var _logText = '',
						_timeText;
					if(data.data != null){
						if(data.data.sparkLog != undefined){
							$.each(data.data.sparkLog, function(k, v){
								var _percent;
								
								if(v.percent == '100%'){
									_percent = '<span class="label label-success">100%</span>';
								}else{
									_percent = '<span class="label label-info">' + v.percent + '</span>';
								}
								
								_logText += '<p><b>JobID: '+ v.jobid + '</b>&nbsp;&nbsp;' + _percent + '</p>';
								
								$.each(v.log, function(key, val){
									_logText += val + '<br/>';
								});
								_logText += '<div class="logDivider"></div>';
							})
							
							
							var _t = data.data['time cost'].split('||');
							var _t1 = parseInt(_t[0]),
								_t2 = parseInt(_t[1] || 0);
							if(_t1 < _t2){
								var _t0 = _t2;
								_t2 = _t1;
								_t1 = _t0;
							}
							
							if(_t2 == 0){
								_timeText = '<p>'+$.i18n.prop('totalTime')+'：<span class="label label-primary">' + getTimeL(_t1) + '</span></p>';
							}else{
								var _t3 = _t1 - _t2;
								_timeText = '<p>'+$.i18n.prop('totalTime')+'：<span class="label label-primary">' + getTimeL(_t1) + '</span>,&nbsp;&nbsp;'+$.i18n.prop('waitTime')+'：<span class="label label-primary">' + getTimeL(_t2) + '</span>, '+$.i18n.prop('runTime')+'：<span class="label label-primary">' + getTimeL(_t3) + '</span></p>';
							}
							
						}else{
							if(typeof data.data != 'object'){
								var _logs = data.data.split('||');
								var _t2 = parseInt(_logs.pop() || 0);
								var _t1 = parseInt(_logs.pop());
								
								if(_t1 < _t2){
									var _t0 = _t2;
									_t2 = _t1;
									_t1 = _t0;
								}
								if(_t2 == 0){
									_timeText = '<p>'+$.i18n.prop('totalTime')+'：<span class="label label-primary">' + getTimeL(_t1) + '</span></p>';
								}else{
									var _t3 = _t1 - _t2;
									_timeText = '<p>'+$.i18n.prop('totalTime')+'：<span class="label label-primary">' + getTimeL(_t1) + '</span>,&nbsp;&nbsp;'+$.i18n.prop('waitTime')+'：<span class="label label-primary">' + getTimeL(_t2) + '</span>, '+$.i18n.prop('runTime')+'：<span class="label label-primary">' + getTimeL(_t3) + '</span></p>';
								}
								
								if(_logs.join('||') != 'there is no available logs'){
									_logText = _logs.join('||').replace(new RegExp(/\n/g),'<br/>');
								}
							}
						}
					}
					
					$('#LogCon').append(_logText);
					
					var _endTxt = '<p style="margin-top: 10px;"><span class="label label-success">'+$.i18n.prop('taskFinished')+'!</span></p>';
					$('#LogCon').append(_endTxt);
					
					$('#LogCon').append(_timeText);
					
					$('#EditOpts .btRunSpark').removeClass('hidden');
					$('#EditOpts .btRunHive').removeClass('hidden');
					$('#EditOpts .btStop').addClass('hidden');
					
					typeof TimerResult != 'undefined' && clearInterval(TimerResult);
					
					SuccessLogStatus[getActiveEditor()] = true;
					
					if(!SuccessResultStatus[getActiveEditor()]){
						setTimeout(function(){
							$('#ResultTab li').eq(1).click();
						}, 500);
					}
				}else{
					typeof TimerResult != 'undefined' && clearInterval(TimerResult);
					TimerResult = setInterval(function(){
						typeof TimerResult != 'undefined' && clearInterval(TimerResult);
						getResultLog();
					}, 1000);
				}
			}
		});
	}
	
	// 查询结果
	function getResult(){
		typeof TimerResult != 'undefined' && clearInterval(TimerResult);
		
		if(typeof QueryKey[getActiveEditor()] == 'undefined'){
			return;
		}
		if($('#ResultTab li.active').data('target') == '#LogCon'){
			$('#ExportWrap').addClass('hidden');
			getResultLog();
		}else if($('#ResultTab li.active').data('target') == '#ResultCon'){
			getResultList();
		}
	}
	
	// 根据id 显示查询 内容
	function getQueryDetail(id){
		Util.ajax({
			url: 'entry/getCustomEntryById',
			data: {id: id},
			success: function(data){
				data = data.data;
				var _stop = false;
				$('#EditTable li').each(function(){
					if($(this).find('span').attr('data-id') == data[0].id){
						$(this).mousedown();
						_stop = true;
						
						setSqlCookie();
						
						return false;
					}	
				})
				
				if(!_stop){
					if($('#EditTable li').length == 5){
						$('#EditTable li.active').click();
					}else{
						$('#AddTab').click();
					}
					
					$('#EditTable .cTab.active').find('span').html(data[0].alias).attr('data-id', data[0].id);
					window[getActiveEditor()].setValue(data[0].context);
					window[getActiveEditor()].setCursor(1, 0);
					
					$('.cTab-pane.active').find('.btnSave').attr({'data-alias': data[0].alias, 'data-id': data[0].id});
					
					setSqlCookie();
				}
			}
		})
	}
	
	// 删除查询
	function delQuery(id){
		Util.ajax({
			url: 'entry/delCustomEntry?id='+id,
			type: 'get',
			success: function(data){
				if(data.code == 1){
					swal($.i18n.prop('delSuccess')+'!', '', 'success');
					getQueryList();
					$('.btnSave').each(function(){
						if($(this).attr('data-id') && $(this).attr('data-id') == id){
							$(this).removeAttr('data-id')
						}
					})
				}else{
					swal("Error", data.data, "error");
				}
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
	
	function getStatusInfo(){
		$.ajax({
			url: 'jobList',
			success: function(data){
				if(data){
					$('#InfoRunning').html(data.RUNNING);
					$('#InfoQueue').html(data.ACCEPTED);
				}
			}
		});
	}
	
	// 设置cookie
	function setSqlCookie(){
		if($('#EditTable li.active').find('span').data('id')){
			store.set(UserName + 'tabName', $('#EditTable li.active').find('span').html());
			store.set(UserName + 'tabId', $('#EditTable li.active').find('span').attr('data-id'));
			store.set(UserName + 'sql', window[getActiveEditor()].getValue());
		}
	}
	
	// 设置参数
	function setSqlParam(){
		var _sql = window[getActiveEditor()].getSelection();
		if(_sql == ''){
			_sql = window[getActiveEditor()].getValue();
		}
		var _paramName = _sql.match(/\$\{[^\}]+\}/g);
		_paramName = _paramName.distinct();
		
		var _html = '';
		
		$.each(_paramName, function(k, v){
			_html += '<div class="paramList">'
            			+'<label>'+v.replace('${', '').replace('}', '')+'</label><input type="text" class="form-control" data-name="'+v+'">'
	            	+'</div>';
		})

		var paramDialog = BootstrapDialog.show({
			title: $.i18n.prop('setParam'),
			cssClass: 'param-dialog',
            message: _html + '<a href="javascript:;" class="btn btn-primary" id="SetParamBtn">'+$.i18n.prop('sure')+'</a>',
            onshown: function(){
            	$('#SetParamBtn').click(function(){
            		var _paramVal = [];
            		
            		var _isPass = true;
            		$('.paramList').each(function(){
            			var _val = $(this).find('.form-control').val();
            			if(_val == ''){
	            			swal('', $.i18n.prop('paramTip')+'！', 'error');
	            			_isPass = false;
	            			return false;
	            		}else{
	            			_paramVal.push(_val);
	            		}
            		})
            		
            		if(_isPass){
            			$.each(_paramName, function(k, v){
                			SqlParam[getActiveEditor()][v] = _paramVal[k];
                		})
                		
                		paramDialog.close();
                		
                		$('#EditOpts .btRunSpark').addClass('hidden');
        				$('#EditOpts .btRunHive').addClass('hidden');
        				$('#EditOpts .btStop').removeClass('hidden');
        				
        				$('.cTab-pane.active').find('.btnRun').click();
            		}
        		})
            }
        });
	}
	
	function stopTask(){
		if(QueryKey[getActiveEditor()] == undefined){
			setTimeout(function(){
				stopTask();
			}, 1000);
			return;
		}else if(QueryKey[getActiveEditor()] == -1){
			swal.close();
			return;
		}
		Util.ajax({
			url: 'cancelJob',
			data: {
				logKey: LogKey[getActiveEditor()],
				queryKey: QueryKey[getActiveEditor()]
			},
			success: function(data){
				if(data.code == 1){
					$('#EditOpts .btRunSpark').removeClass('hidden');
					$('#EditOpts .btRunHive').removeClass('hidden');
					$('#EditOpts .btStop').addClass('hidden');
					
					swal($.i18n.prop('taskKilled'), '', 'success');
					
					$('#LogCon').append('<p style="margin-top: 10px;"><span class="label label-success">'+$.i18n.prop('taskKilled')+'---</span></p>');
					QueryKey[getActiveEditor()] = undefined;
					
					$('#ResultTip').hide();
					$('#ResultTable').show();
					
					$('#ResultList').html('<p style="margin-top: 10px;"><span class="label label-success">'+$.i18n.prop('taskKilled')+'---</span></p>');
				}else{
					swal($.i18n.prop('killFailed'), '', 'error');					
				}
				$('#EditOpts .btStop').removeClass('has');
			}
		});
	}
	
	// 事件绑定
	function bindEvent(){
		// tooltip
		$('[data-toggle="tooltip"]').tooltip();
		
		// tab init
		ChromeTab = $('#EditTable').chromeTab({
			newTabCallback: function(){
				resetDom();
				setSqlCookie();
			},
			changeTabCallback: function(){
				$('#ResultTab li').eq(0).addClass('active');
				$('#ResultTab li').eq(1).removeClass('active');
				$('#ResultTab li').eq(2).removeClass('active');
				$('#LogCon').addClass('active');
				$('#ResultCon').removeClass('active');
				$('#HistoryCon').removeClass('active');
				
				resetDom();
				getResult();
				setSqlCookie();
			},
			closeCallback: function(){
				$('#ResultTab li').eq(0).addClass('active');
				$('#ResultTab li').eq(1).removeClass('active');
				$('#ResultTab li').eq(2).removeClass('active');
				$('#LogCon').addClass('active');
				$('#ResultCon').removeClass('active');
				$('#HistoryCon').removeClass('active');
				resetDom();
				getResult();
				setSqlCookie();
			},
			editorInit: function(textarea){
				codeEditor(textarea);
			}
		});
		
		
		$('#TableList').on('click', 'li', function(){
			var _thisName = $(this).attr('data-name');
			var _thisDB = $('#DatabaseChosen .fixedVal').val();
			var _value = window[getActiveEditor()].getValue();
			
			_value = _value + ' ' + _thisDB + '.' + _thisName + ' ';
			
			
			if($(this).attr('data-partitions') != ''){
				var _partitions = [];
				$.each($(this).attr('data-partitions').split(','), function(k, v){
					_partitions.push(v + "=''");
				})
				_value += 'WHERE ' + _partitions.join(' AND ');
			}
			
			window[getActiveEditor()].setValue(_value);
		})
		
		// 查询表
		$('#TableKeyword').keyup(function(e){
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
				var _keyword = $(this).val();
	
				if(_keyword == ''){
					getTableList($('#DatabaseChosen .fixedId').val(), $('#DatabaseChosen .fixedVal').val());
				}else{
					$('#TableList').scrollTop(0);
	
					var _param = {
						dbId: $('#DatabaseChosen .fixedId').val(),
						tblName: _keyword,
						page: 1,
						pageSize: 100000
					};
					
					Util.ajax({
						url: 'entry/getTables',
						data: _param,
						success: function(data){
							data = data.data;
							$('#TableListPage').scrollTop(0);
							
							var _html = '';
							
							if(data.rows.length == 0){
								_html == 'no result.'
							}else{
								$.each(data.rows, function(k, v){
									var _thisHtml = v.tblName.replace(eval("/("+_keyword+")/gi"), '<b>'+'$1'+'</b>');
									_html += '<li data-id="'+v.tblId+'" data-name="'+v.tblName+'" data-partitions="'+v.partitions.join(',')+'">'
					                  +'<a href="javascript:;">'
					                    +'<i class="fa fa-table"></i>'
					                    +'<span data-toggle="tooltip" data-placement="top" title="'+v.tblName+'">'+ _thisHtml +'</span>'
					                  +'</a>'
					                +'</li>'
								})
							}
							
							$('#TableList').html(_html);
	
							$('#TableListPage').html('<div class="inner"></div>');
						}
					})
				}
			}
		});
		
		// 保存查询
		$('.cTab-content').on('click', '.btnSave', function(){
			var _self = $(this);
			
			var aliasDialog = BootstrapDialog.show({
				title: $.i18n.prop('addAlias'),
				cssClass: 'alias-dialog',
	            message: '<div class=""><input type="text" class="form-control" id="AliasName"><a href="javascript:;" class="btn btn-primary" id="SaveSqlBtn">确定</a></div>',
	            onshown: function(){
	            	if(_self.attr('data-alias')){
	            		$('#AliasName').val(_self.attr('data-alias'));
	            	}
	            	$('#SaveSqlBtn').click(function(){
	            		var _alias = $('#AliasName').val();
	            		
	            		if(_alias == ''){
	            			swal('', $.i18n.prop('aliasNullTip')+'！', 'error');
	            			return;
	            		}else if(_alias.length > 25){
	            			swal('', $.i18n.prop('aliasLangTip')+'！', 'error');
	            			return;
	            		}
	            		
	        			var _param = {
	        				type: _self.parent().find('input[type="radio"]:checked').attr('data-val'),
	        				alias: _alias,
	        				context: window[_self.data('code')].getValue(),
	        				pid: 2
	        			};
	        			
	        			var _url = 'entry/savaCustomEntry';
	        			if(_self.attr('data-id')){
		            		$('#AliasName').val(_self.attr('data-alias'));
		            		$.extend(_param, {id: _self.attr('data-id')});
		            		_url = 'entry/updateCustomEntry';
		            	}
	        			
	        			Util.ajax({
	        				url: _url,
	        				data: _param,
	        				success: function(data){
	        					if(data.code == 1){
	        						aliasDialog.close();
		        					swal('Save Successful!', '', 'success');
		        					
		        					_self.attr('data-alias', _alias);
		        					_self.attr('data-id', data.data);
		        					$('#EditTable .cTab.active').find('span').html(_alias).attr('data-id', data.data);
		        					
		        					getQueryList();
	        					}else{
	        						swal('Error', $.i18n.prop('aliasRepeat')+'！', 'error');
	        					}
	        				}
	        			});
	        		})
	            }
	        });
		})
		
		$('.cTab-content').on('click', '.btnRun', function(){
			typeof CodeRange != 'undefined' && CodeRange.clear();
			
			var _self = $(this);
			var _sql = window[_self.data('code')].getSelection();
			if(_sql == ''){
				_sql = window[_self.data('code')].getValue();
			}
			
			$.each(SqlParam[getActiveEditor()], function(k, v){
				var _reg = '/'+k.replace('$', '\\$')+'/g';
    			_sql = _sql.replace(eval(_reg), v);
    		})
    		
    		QueryStop[getActiveEditor()] = false;
			ErrorStatus[getActiveEditor()] = false;
			
			SuccessLogStatus[getActiveEditor()] = false;
			SuccessResultStatus[getActiveEditor()] = false;
			
			QueryHistory[getActiveEditor()] = false;
			
			$('#ResultTab li').eq(0).addClass('active');
			$('#ResultTab li').eq(1).removeClass('active');
			$('#ResultTab li').eq(2).removeClass('active');
			$('#LogCon').addClass('active');
			$('#ResultCon').removeClass('active');
			$('#HistoryCon').removeClass('active');
			
			$('#ExportWrap').addClass('hidden');
			$('#ExportAllDataTip').addClass('hidden');
			
			$('#BtnExportAll').removeAttr('data-querykey');
			$('#BtnExportAll').removeAttr('data-file');
			$('#BtnExportAll').removeClass('disabled');
			$('#DownloadLoading').addClass('hidden');
			
			QueryDownloadKey[getActiveEditor()] = undefined;
			
			RunningTab = getActiveEditor();
			QueryStop[getActiveEditor()] = undefined;	
			var _param = {
				ConnId: ConnId,
				sql: _sql,
				pageSize: 100,
				dbName: $('#DatabaseChosen .fixedVal').val(),
				proxyUserName: $('#UserSel').data('user'),
				appName: $('#UserSel').data('name')
			};
			
			QueryUser[getActiveEditor()] = $('#UserSel').data('user');
			QueryAppName[getActiveEditor()] = $('#UserSel').data('name');
			
			Util.ajax({
				url: 'applySql',
				data: _param,
				success: function(data){
					if(RunningTab != getActiveEditor()){
						return;
					}
					if(data.code == 1){
						QueryKey[RunningTab] = data.data.queryKey;
						LogKey[RunningTab] = data.data.logKey;
						QueryCountKey[RunningTab] = data.data.queryCountKey;
						
						if(typeof QueryStop[getActiveEditor()] != 'undefined'){
							return;
						}
						$('#ResultListHeader').html('');
						$('#ResultList').html('');
						$('#ResultListPage').html('');
						$('#ResultTip').hide();

						$('#LogCon').html('');
						
						getResult();
						
//						getQueryHistory();
					}else{
						QueryKey[RunningTab] == -1;
						
						$('#EditOpts .btRunSpark').removeClass('hidden');
						$('#EditOpts .btRunHive').removeClass('hidden');
						$('#EditOpts .btStop').addClass('hidden');
						
						var _result = analyticError(data.data);
						if(_result[0] != -1){
							swal('Error', data.data, 'error');
						}
					}
				}
			});
		})
		
		$('.cTab-content').on('click', '.btnStop', function(){
			typeof TimerResult != 'undefined' && clearInterval(TimerResult);
			
			QueryStop[getActiveEditor()] = true;
			
			var _self = $(this);

			var _param = {
				logKey: LogKey[getActiveEditor()]
			};
			
			swal({   
				title: $.i18n.prop('stopping'),   
				text: "",   
				type: "warning",
				showConfirmButton: false
			});
			
			stopTask();
		})
		
		$('#EditOpts .btSave').click(function(){
			$('.cTab-pane.active').find('.btnSave').click();
		})

		$('#EditOpts .btFormat').click(function(){
			var _sql = window[getActiveEditor()].getValue();
			Util.ajax({
				url: 'formateSql',
				data: {
					sql: _sql
				},
				success: function(data){
					var _sql = data.data.replace(new RegExp(/\n    /g),'\n');
					_sql = _sql.substring(1);
					window[getActiveEditor()].setValue(_sql);
				}
			});
		})
		
		$('#EditOpts .btRunSpark').click(function(){
			typeof ErrorTip[getActiveEditor()] != 'undefined' && window[getActiveEditor()].removeLineWidget(ErrorTip[getActiveEditor()]);
			
			var _sql = window[getActiveEditor()].getSelection();
			if(_sql == ''){
				_sql = window[getActiveEditor()].getValue();
			}
			if(_sql == ''){
				return;
			}else if(_sql.match(/\$\{[^\}]+\}/g) != null && _sql.match(/\$\{[^\}]+\}/g).length > 0){
				SqlParam[getActiveEditor()] = {};
				setSqlParam();
			}else{
				$('#EditOpts .btRunSpark').addClass('hidden');
				$('#EditOpts .btRunHive').addClass('hidden');
				$('#EditOpts .btStop').removeClass('hidden');
				
				$('.cTab-pane.active').find('.btnRun').click();
			}
		})
		
		$('#EditOpts .btRunHive').click(function(){
			typeof ErrorTip[getActiveEditor()] != 'undefined' && window[getActiveEditor()].removeLineWidget(ErrorTip[getActiveEditor()]);
			
			var _sql = window[getActiveEditor()].getSelection();
			if(_sql == ''){
				_sql = window[getActiveEditor()].getValue();
			}
			if(_sql == ''){
				return;
			}else if(_sql.match(/\$\{[^\}]+\}/g) != null && _sql.match(/\$\{[^\}]+\}/g).length > 0){
				SqlParam[getActiveEditor()] = {};
				setSqlParam();
			}else{
				$('#EditOpts .btRunSpark').addClass('hidden');
				$('#EditOpts .btRunHive').addClass('hidden');
				$('#EditOpts .btStop').removeClass('hidden');
				
				$('.cTab-pane.active').find('.btnRun').click();
			}
		});
		
		$('#EditOpts .btStop').click(function(){
			if($(this).hasClass('has')){
				return;
			}
			$(this).addClass('has');
			$('.cTab-pane.active').find('.btnStop').click();
		})
		
		$('#EditOpts .btUndo').click(function(){
			window[getActiveEditor()].getHistory();
		})
		
		$('#EditOpts .btRedo').click(function(){
			window[getActiveEditor()].setHistory();
		})
		
		$('#ResultTab li').click(function(){
			typeof TimerResultTab != 'undefined' && clearInterval(TimerResultTab);
			TimerResultTab = setTimeout(function(){
				if($('#ResultTab li.active').data('target') == '#HistoryCon'){
					$('#ExportWrap').addClass('hidden');
					getQueryHistory();
				}else{
					getResult();
				}
			}, 100);
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
		
		$('#QueryList').on('click', '.item', function(){
			getQueryDetail($(this).attr('data-id'));
		})
		
		$('#QueryList').on('click', '.del', function(e){
			delQuery($(this).attr('data-id'));
		})
		
		$('#HistoryList').on('click', '.detail', function(){
			var _index = $(this).data('id'),
				_queryType = $(this).data('querytype'),
				_logKey = $(this).data('logkey'),
				_queryCountKey = $(this).data('querycountkey'),
				_queryKey = $(this).data('querykey'),
				_sql = decodeURIComponent($(this).data('sql')),
				_state = $(this).data('state'),
				_dbName = $(this).data('dbname'),
				_appUser = $(this).data('proxyuser'),
				_appName = $(this).data('appname');
			
			var _stop = false;
			if(_state == 2){
				$('#ResultTab li').eq(1).click();
			}else{
				$('#ResultTab li').eq(0).click();
			}
			$('#DatabaseChosen .fixedText').html(_dbName);
			$('#DatabaseChosen .fixedVal').val(_dbName);
			
			$('#DatabaseChosen .dataListAll li').each(function(){
				if($(this).attr('thisval') == _dbName){
					$('#DatabaseChosen .fixedId').val($(this).attr('thisid'));
					getTableList($(this).attr('thisid'), $(this).attr('thisval'));
					return false;
				}
			});
			
			$('#UserSel').html(AppList[_appUser]).data({'user': _appUser, 'name': _appName});
			
			$('#EditTable li').each(function(){
				if($(this).find('span').html() == $.i18n.prop('queryRecord')+'-'+_index){
					$(this).mousedown();
					_stop = true;
					
					$('.cTab-pane.active').find('.btnSave').removeAttr('data-alias', 'data-id');
					
					$('#EditOpts .btRunSpark').removeClass('hidden');
					$('#EditOpts .btRunHive').removeClass('hidden');
					$('#EditOpts .btStop').addClass('hidden').removeClass('has');
					
					$('#ResultListHeader').html('');
					$('#ResultList').html('');
					$('#ResultListPage').html('');
					$('#ResultTip').hide();
		
					$('#LogCon').html('');
					
					getResult();
					
					setSqlCookie();
					
					return false;
				}	
			})
			
			if(!_stop){
				if($('#EditTable li').length == 5){
					$('#EditTable li.active').click();
				}else{
					$('#AddTab').click();
				}
				
				$('#EditTable .cTab.active').find('span').html($.i18n.prop('queryRecord')+'-'+_index).removeAttr('id');
				window[getActiveEditor()].setValue(_sql);
				window[getActiveEditor()].setCursor(1, 0);
				
				LogKey[getActiveEditor()] = _logKey;
				QueryCountKey[getActiveEditor()] = _queryCountKey;
				QueryKey[getActiveEditor()] = _queryKey;
				QueryHistory[getActiveEditor()] = true;
				
				QueryUser[getActiveEditor()] = _appUser;
	
				
				$('.cTab-pane.active').find('.btnSave').removeAttr('data-alias', 'data-id');
				
				$('#ResultListHeader').html('');
				$('#ResultList').html('');
				$('#ResultListPage').html('');
				$('#ResultTip').hide();
	
				$('#LogCon').html('');
				
				getResult();
				
				setSqlCookie();
			}
		})
		
		
		$('#BtnExport').on('click', function(){
			$.exportExcel({
				queryKey: QueryKey[getActiveEditor()],
				url: 'downloadFile'
			});
		});
		
		$('#BtnExportAll').on('click', function(){
			if($(this).attr('data-querykey')){
				if($(this).attr('data-file')){
					$.exportExcel({
						queryKey: QueryDownloadKey[getActiveEditor()],
						forBigData: 1,
						url: 'downloadFile'
					});
				}else{
					Downloading[getActiveEditor()] = true;
					$(this).addClass('disabled');
					getDownloadFile();
				}
			}else{
				Downloading[getActiveEditor()] = true;
				$(this).addClass('disabled');
				$('#ExportAllDataTip').removeClass('hidden');
				$('#DownloadLoading').removeClass('hidden');
				getDownloadKey();
			}
		});
		
		$('#Logout').click(function(){
			store.set(UserName + 'sql', window[getActiveEditor()].getValue());
			window.location.href = 'logout';
		})
		
		$('#QueryListTab li').click(function(){
			$(this).addClass('active').siblings().removeClass('active');
			$($(this).data('target')).addClass('active').siblings().removeClass('active');
		});
		
		$('#UserList').on('click', 'li', function(){
			if(!$(this).hasClass('keywordSearch')){
				$('#UserSel').html($(this).data('name')).data({'user': $(this).data('user'), 'name': $(this).data('name')});
				store.set(UserName + 'user', $(this).data('user') + '||' + $(this).data('name'));
			}
		})
		
		$('#DropdownUser').click(function(){
			setTimeout(function(){$('#UserKeyword').focus();}, 100)
		})
		
		$('#AddConn').click(function(){
			var _dialog = BootstrapDialog.show({
					title: '添加连接',
					cssClass: 'loadFile-dialog',
					message: '<div class="addValueDialog form-horizontal" id="AddValueDialog" style="margin: 0 15px;font-size: 12px;">'
						+'<div class="form-group">'
							+'<label class="col-sm-3 control-label">连接名</label>'
							+'<div class="col-sm-9">'
								+'<input class="form-control connName" type="text">'
							+'</div>'
						+'</div>'
						
						+'<div class="form-group">'
							+'<label class="col-sm-3 control-label">连接类型</label>'
							+'<div class="col-sm-9">'
								+'<select class="form-control connType">'
									+'<option value="mysql">mysql</option>'
									+'<option value="impala">impala</option>'
									+'<option value="hive">hive</option>'
									+'<option value="spark">spark</option>'
								+'</select>'
							+'</div>'
						+'</div>'
						
						+'<div class="form-group">'
							+'<label class="col-sm-3 control-label">连接url</label>'
							+'<div class="col-sm-9">'
								+'<input class="form-control connUrl" type="text">'
							+'</div>'
						+'</div>'
						
						+'<div class="form-group">'
							+'<label class="col-sm-3 control-label">连接驱动</label>'
							+'<div class="col-sm-9">'
								+'<input class="form-control connDriver" type="text">'
							+'</div>'
						+'</div>'
						
						+'<div class="form-group">'
							+'<label class="col-sm-3 control-label">用户名</label>'
							+'<div class="col-sm-9">'
								+'<input class="form-control connUser" type="text">'
							+'</div>'
						+'</div>'
						
						+'<div class="form-group">'
							+'<label class="col-sm-3 control-label">密码</label>'
							+'<div class="col-sm-9">'
								+'<input class="form-control connPasswd" type="password">'
							+'</div>'
						+'</div>'
						
						
						+'<div class="form-group">'
						+'<label class="col-sm-3 control-label">是否公开</label>'
						+'<div class="col-sm-9">'
							+'<span class="radio" style="display: inline-block; margin-right: 20px;">'
								+'<label>'
								+'<input type="radio" name="optionsRadios" id="optionsRadios1" value="all" checked>公开</label>'
							+'</span>'
							+'<span class="radio" style="display: inline-block; margin-right: 20px;">'
								+'<label>'
								+'<input type="radio" name="optionsRadios" id="optionsRadios2" value="own">不公开</label>'
							+'</span>'
						+'</div>'
						+'</div>'
						
						+'<div class="form-group" style="margin-bottom: 10px; padding-top: 10px;">'
						+'<div class="col-sm-offset-3 col-sm-9">'
						+'<a href="javascript:;" class="btn btn-primary" id="AddNewBtn">'+$.i18n.prop('submit')+'</a>'
						+'</div>'
						+'</div>'
						
						+'</div>',
					onshown: function(){
						$('#AddValueDialog .form-control').keyup(function(e){
							$(this).parents('.form-group').removeClass('has-error');
							$(this).parents('.form-group').find('.errorText').remove();
						})
						
						$('#AddNewBtn').off('click').on('click', function(){
							var _self = $(this);
							
							if($(this).hasClass('disable')){
								return;
							}
							var _next = true;
							
							$('#AddValueDialog .form-control').each(function(){
								if($(this).val() == ''){
									$(this).parent().find('.errorText').remove();
									$(this).parent().append('<div class="errorText">不能为空！</div>');
									$(this).parents('.form-group').addClass('has-error');
								}
							})
							if(!_next){
								return;
							}
							
							$(this).addClass('disable');
							
							Util.ajax({
								url: 'ConnectController/saveConnection',
								data: {
									connectName: $('#AddValueDialog .connName').val(),
									connectType: $('#AddValueDialog .connType').val(),
									connectUrl: $('#AddValueDialog .connUrl').val(),
									connectUser: $('#AddValueDialog .connUser').val(),
									connectPwd: $('#AddValueDialog .connPasswd').val(),
									connectOwner: $("input[name='optionsRadios']:checked").val()
								},
								success: function(data){
									if(data.code == 1){
										swal('Successful!', '', 'success');
										_dialog.close();
										getConnectList();
									}else{
										swal("Error", data.data, "error");
										_self.removeClass('disable');
									}
								}
							});
							
							
						})
					}
				});
		})
	}
	
	function init(){
		setCookieData();
		
		// 连接列表
		getConnectList();
		
		// 应用列表
		getAppList();

		// 数据库列表
//		getDatabase();

		// 保存的查询
		getQueryList();
		
		// 查看反馈
//		getFeedback();
		
		// 任务信息
		getStatusInfo();
		
		setInterval(function(){
			getStatusInfo();
		}, 60000);

		// 绑定事件	
		bindEvent();
	}

	init();
})