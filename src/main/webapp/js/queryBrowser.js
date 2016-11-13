/**
 * Created by YueFang on 2016/8/22.
 */

$(function(){
	//ajax 操作句柄
	var eventHandler;
	var ajaxHandler = new xhrFunction();

	//数据表集合
	var tablesArr =[];
	var queryCache = {};
	//选中的数据源
	var currentConnect = {};
	//选中的数据库
	var currentDataBase ={};
	//当前选中的数据表
	var currentTable ={};

	var startTime;
	var intervalTime;
	var crateSucc = false;
	var haveSchema = false;

	/*日志所处阶段*/
	var LOG_STATE = {
		TASK_SUBMIT_SUCCESS : $.i18n.prop('taskSubmitSuccess'),
		TASK_SUBMIT_FAIL : $.i18n.prop('taskSubmitFall'),
		TASK_START_RUNNING : $.i18n.prop('taskStartRunning'),
		TASK_DETAIL_LOG : $.i18n.prop('taskDetallLog'),
		TASK_RUN_SUCCESS :$.i18n.prop('taskRunSuccess'),
		TASK_RUN_FAIL : $.i18n.prop('taskRunFall'),
		TASK_IS_CANCELED : $.i18n.prop('taskIsCanceled')
	};



	/*统一AJAX请求，返回数据data ——code:0错误;1:成功*/
	var ajaxRequest = {
		doSqlQuery : function(queryIndex, downloadAll){
			if(!eventHandler.weatherHaveConnId()){
				return false;
			}
			var _currentDbName ="";
			var _ConnId = "";
			//区分现在是否有选中的表；
			if($('.activeTable').length > 0){
				_currentDbName= $(".activeTable").parent('div').parent('ul').siblings('li').attr('title') ;
				_ConnId = $("._activeConnect").attr('data-id');
			}
			else{
				_currentDbName =$('.activeDataBase').attr('title') || "";
				_ConnId = $("._activeConnect").attr('data-id');
			}
			var _dataEntity = dataEntity["data" + queryIndex];
			_dataEntity.downloadAll = downloadAll;
			var _proxyUserName = "";
			if(currentConnect.connectType == "HIVE" || currentConnect.connectType == "SPARK"){
				_proxyUserName =$("#UserSel").text();
			}

			var param = {
				url : window.AJAX_URL.RUNNING_SQL,
				data:{
					ConnId:_ConnId,
					sql:editor.getValue(),
					pageSize:"100",
					dbName:_currentDbName.replace(/\s+/g,""),
					queryIndex : queryIndex,
					proxyUserName:_proxyUserName
				},
				dataType : "json"
			};

			if (!!_dataEntity.downloadAll) {
				param.data.forBigData = 1;
				param.data.queryKey =  queryCache[queryIndex].queryKey;
			}

			var doneFun = function(data){
				var _queryIndex = data.queryIndex;
				var dataI = "data" + _queryIndex;
				if(data.code == 0){//修改结果显示状态为失败，显示失败日志
					if(!!dataEntity[dataI].downloadAll){
						dataEntity[dataI].isDownloadAllRunning = false;//qpply sql失败意味着下载失败()
					}else {
						dataEntity[dataI].isRunning = "fail";
						dataEntity[dataI].isLeftData = false;
						dataEntity[dataI].searchResult = {};
						dataEntity[dataI].isShowDownBtn = false;
						dataEntity[dataI].isRedColorFont = true;
						dataEntity[dataI].logString = LOG_STATE.TASK_SUBMIT_FAIL + "\n";
						dataEntity[dataI].logString += (!data.errorMessage || data.errorMessage == "there is no available logs") ? "" : data.errorMessage;

						clearInterval(dataEntity[dataI].clearEndTimeOut);
						utilObj.applyRealTimeState(dataEntity[dataI]);
					}
					if($(".query-tab-active").attr("queryIndex") == _queryIndex){
						utilObj.applyDataEntity(dataEntity[dataI]);
						utilObj.applyTableData(dataEntity[dataI]);
					}
				}else if(data.code == 1){//成功拿到查询数据
					var _queryKeys = {
						queryCountKey : data.data.queryCountKey,
						queryKey : data.data.queryKey,
						queryIndex : data.queryIndex
					};
					var _activeTab = $(".query-tab-active");
					var _dataEntity = dataEntity[dataI];
					var queryIdentifier = _queryKeys.queryIndex;
					if (!!_dataEntity.downloadAll) {
						queryIdentifier += "_downloadAll";
					}
					queryCache[queryIdentifier] = _queryKeys;

					_activeTab.attr("queryKey",data.data.queryKey);//存储查询key,用于数据对应时的判断
					if(!_dataEntity.downloadAll){
						//_dataEntity.name = _activeTab.attr("name");
						//_dataEntity.sqlString = editor.getValue();//sql在属性的更新在发出sql时就存入数据模型
						_dataEntity.isRunning = "run";
						_dataEntity.logString = LOG_STATE.TASK_SUBMIT_SUCCESS + "\n" + LOG_STATE.TASK_START_RUNNING + "\n";
						_dataEntity.searchResult = "";

						ajaxRequest.getQueryLog(_queryKeys);
					}
					ajaxRequest.getQueryResults(_queryKeys);
				}
			};
			var failFunc = function(data){
				/*dataEntity["data" + 1].isRunning = "fail";
				 dataEntity["data" + 1].logString = data.responseText || "查询失败！";
				 utilObj.applyDataEntity(dataEntity["data" + 1]);*/
				//console.info(data);
			};
			ajaxHandler.ajaxFun(param,doneFun,failFunc);
		},
		getQueryLog : function(searchLogKeys){
			var param ={
				url:window.AJAX_URL.GET_LOGS,
				data:{
					queryKey:searchLogKeys.queryKey,
					queryCountKey:searchLogKeys.queryCountKey,
					queryIndex:searchLogKeys.queryIndex
				}
			};
			var currentTab = dataEntity["data" + searchLogKeys.queryIndex];
			if (!!currentTab.downloadAll) {
				param.data.forBigData = 1;
				param.data.queryKey =  queryCache[searchLogKeys.queryIndex + "_downloadAll"].queryKey;
				param.data.queryCountKey =  queryCache[searchLogKeys.queryIndex + "_downloadAll"].queryCountKey;
			}

			var doneFun = function(data){

				if(!data.queryIndex){
					return;
				}
				var _queryIndex = data.queryIndex;
				var dataI_DataWillTo = "data" + _queryIndex;//查询出的信息对应的datai

				if(dataEntity[dataI_DataWillTo].isCanceledLog){//点击取消按钮，得到响应为1，此时不再处理取消前发出的请求的响应
					dataEntity[dataI_DataWillTo].isCanceledLog = false;
					return;
				}
				if(dataEntity[dataI_DataWillTo].onceLogMark){//保证字符只被添加一次
					dataEntity[dataI_DataWillTo].logString += LOG_STATE.TASK_DETAIL_LOG + "\n";
					dataEntity[dataI_DataWillTo].onceLogMark = false;
				}
				if(data.code == 0){
					dataEntity[dataI_DataWillTo].isRunning = "fail";
					//dataEntity[dataI_DataWillTo].onceLogMark = true;
					dataEntity[dataI_DataWillTo].isRedColorFont = true;
					dataEntity[dataI_DataWillTo].isLogSlidDown = true;
					dataEntity[dataI_DataWillTo].logString += (!data.errorMessage || data.errorMessage=="there is no available logs")?"":data.errorMessage;
					dataEntity[dataI_DataWillTo].logString += "\n" + LOG_STATE.TASK_RUN_FAIL;
					clearInterval(dataEntity[dataI_DataWillTo].clearEndTimeOut);
				}else if(data.code == 1){//
					//dataEntity[dataI_DataWillTo].onceLogMark = false;
					dataEntity[dataI_DataWillTo].isRunning = "run";
					dataEntity[dataI_DataWillTo].isRedColorFont = false;
					if(data.data.hasOwnProperty("message")){
						dataEntity[dataI_DataWillTo].logString += (!data.data.message || data.data.message=="there is no available logs")?"":data.data.message;
					}
					setTimeout(function(){
						ajaxRequest.getQueryLog(queryCache[_queryIndex]);
					},2000);
				}else if(data.code = 2){//完成
					//dataEntity[dataI_DataWillTo].onceLogMark = true;
					dataEntity[dataI_DataWillTo].isRunning = "ok";
					dataEntity[dataI_DataWillTo].isRedColorFont = false;
					if(data.data.hasOwnProperty("message")){
						dataEntity[dataI_DataWillTo].logString += (!data.data.message || data.data.message=="there is no available logs")?"":data.data.message;
					}
					dataEntity[dataI_DataWillTo].logString += "\n" + LOG_STATE.TASK_RUN_SUCCESS;
					clearInterval(dataEntity[dataI_DataWillTo].clearEndTimeOut);
				}
				utilObj.applyRealTimeState(dataEntity[dataI_DataWillTo]);
				if($(".query-tab-active").attr("queryIndex") == _queryIndex){//如果数据正好是当前活动窗口的数据则更新界面
					utilObj.applyDataEntity(dataEntity[dataI_DataWillTo]);
				}

			};
			var failFun = function(data){
				if(!data.queryIndex){
					return;
				}

				var _queryIndex = data.queryIndex;
				var dataI_DataWillTo = "data" + _queryIndex;//查询出的信息对应的datai

				if(dataEntity[dataI_DataWillTo].isCanceledLog){//点击取消按钮，得到响应为1，此时不再处理取消前发出的请求的响应
					dataEntity[dataI_DataWillTo].isCanceledLog = false;
					return;
				}

				dataEntity[dataI_DataWillTo].isRunning = "fail";
				dataEntity[dataI_DataWillTo].isRedColorFont = true;

				utilObj.applyRealTimeState(dataEntity[dataI_DataWillTo]);
				if($(".query-tab-active").attr("queryIndex") == _queryIndex){//如果数据正好是当前活动窗口的数据则更新界面
					utilObj.applyDataEntity(dataEntity[dataI_DataWillTo]);
				}
			};
			ajaxHandler.ajaxFun(param,doneFun,failFun)
		},
		getQueryResults : function(searchResultsKeys,num){
			var param ={
				url:window.AJAX_URL.GET_RESULT,
				data:{
					queryKey:searchResultsKeys.queryKey,
					queryCountKey:searchResultsKeys.queryCountKey,
					queryIndex:searchResultsKeys.queryIndex || 1,
					page: num || 1,
					pageSize:"100"
				}
			};

			var currentTab = dataEntity["data" + searchResultsKeys.queryIndex];
			if (!!currentTab.downloadAll) {
				param.data.forBigData = 1;
				param.data.queryKey =  queryCache[searchResultsKeys.queryIndex + "_downloadAll"].queryKey;
				param.data.queryCountKey =  queryCache[searchResultsKeys.queryIndex + "_downloadAll"].queryCountKey;
			}

			var doneFun = function(data){

				if(!data.queryIndex){
					return;
				}

				var _queryIndex = data.queryIndex;
				var dataI_DataWillTo = "data" + _queryIndex;

				if(dataEntity[dataI_DataWillTo].isCanceledResult){//点击取消按钮，得到响应为1，此时不再处理取消前发出的请求的响应
					dataEntity[dataI_DataWillTo].isCanceledResult = false;
					return;
				}

				if(data.code == 0){
					if (!!dataEntity[dataI_DataWillTo]) {
						if(dataEntity[dataI_DataWillTo].downloadAll){
							dataEntity[dataI_DataWillTo].isDownloadAllRunning = false;
							if($(".query-tab-active").attr("queryIndex") == _queryIndex){
								dataEntity[dataI_DataWillTo].isLogSlidDown = false;
								utilObj.applyDataEntity(dataEntity[dataI_DataWillTo]);
							}
						}else{
							dataEntity[dataI_DataWillTo].isShowDownBtn = dataEntity[dataI_DataWillTo].downloadAll?true:false;
							dataEntity[dataI_DataWillTo].isRunning = "fail";
							dataEntity[dataI_DataWillTo].isLeftData = false;
							dataEntity[dataI_DataWillTo].searchResult = {};
							dataEntity[dataI_DataWillTo].isRedColorFont = true;
							clearInterval(dataEntity[dataI_DataWillTo].clearEndTimeOut);
						}
					}
				}else if(data.code == 1){
					if(dataEntity[dataI_DataWillTo].downloadAll){
						dataEntity[dataI_DataWillTo].isDownloadAllRunning = true;
					}else{
						dataEntity[dataI_DataWillTo].isRunning = "run";
						dataEntity[dataI_DataWillTo].isRedColorFont = false;
					}
					var queryConfig = queryCache[_queryIndex];
					setTimeout(function(){
						ajaxRequest.getQueryResults(queryConfig);
					}, 2000);
				}else if(data.code = 2){
					if (!!dataEntity[dataI_DataWillTo]) {
						if (!!dataEntity[dataI_DataWillTo].downloadAll) { // 下载所有数据
							$.exportExcel({
								queryKey: queryCache[_queryIndex + "_downloadAll"].queryKey,
								forBigData: 1,
								url: window.AJAX_URL.DOWNLOAD_FILE
							});
							$("#downLoadAll-btn").prop("disabled", false);
							dataEntity[dataI_DataWillTo].isDownloadAllRunning = false;
							dataEntity[dataI_DataWillTo].downloadAll = false;
							clearInterval(dataEntity[dataI_DataWillTo].clearEndTimeOut);
							//dataEntity[dataI_DataWillTo].isRunning = "ok";

							//utilObj.applyRealTimeState(dataEntity[dataI_DataWillTo]);
							if($(".query-tab-active").attr("queryIndex") == _queryIndex){
								//dataEntity[dataI_DataWillTo].isLogSlidDown = false;
								utilObj.applyDataEntity(dataEntity[dataI_DataWillTo]);
							}
						} else {
							var data = data.data;//查询到的数据
							if(data.total == 1000){
								dataEntity[dataI_DataWillTo].isShowDownloadAllBtn = true;
							}
							else{
								dataEntity[dataI_DataWillTo].isShowDownloadAllBtn = false;
							}
							dataEntity[dataI_DataWillTo].isRunning = "ok";
							dataEntity[dataI_DataWillTo].searchResult = data;
							if(Array.isArray(data.rows)){
								dataEntity[dataI_DataWillTo].isShowDownBtn = data.rows.length>0?true:false;
							}else{
								dataEntity[dataI_DataWillTo].isShowDownBtn = false;
							}
							dataEntity[dataI_DataWillTo].isLeftData = false;
							dataEntity[dataI_DataWillTo].isRedColorFont = false;
							dataEntity[dataI_DataWillTo].isLogSlidDown = false;
							clearInterval(dataEntity[dataI_DataWillTo].clearEndTimeOut);

						}
					}
				}
				utilObj.applyRealTimeState(dataEntity[dataI_DataWillTo]);
				if($(".query-tab-active").attr("queryIndex") == _queryIndex){
					utilObj.applyDataEntity(dataEntity[dataI_DataWillTo]);
					utilObj.applyTableData(dataEntity[dataI_DataWillTo]);
				}
			};
			var failFun = function(data){
			};
			ajaxHandler.ajaxFun(param,doneFun,failFun)
		},
		cancelJob:function(){

			var queryIndex = $(".query-tab-active").attr("queryIndex");

			//前端取消，不管取消接口返回的信息，直接取消查询操作
			var tabName = "data" + queryIndex;

			dataEntity[tabName].isCanceledLog = true;
			dataEntity[tabName].isCanceledResult = true;

			dataEntity[tabName].isRunning = "cancel";
			dataEntity[tabName].isLeftData = false;
			dataEntity[tabName].searchResult = {};
			dataEntity[tabName].logString += "\n" + LOG_STATE.TASK_IS_CANCELED;
			dataEntity[tabName].isRedColorFont = false;
			dataEntity[tabName].isShowDownBtn = false;
			dataEntity[tabName].isLogSlidDown = false;
			dataEntity[tabName].isDownloadAllRunning = false;

			dataEntity[tabName].isShowResultsContent = true;
			dataEntity[tabName].isShowResultTitle = true;
			dataEntity[tabName].isShowLogSubstanceContainer = true;
			dataEntity[tabName].isShowLeftDataTitle = false;
			dataEntity[tabName].isShowResultTableContainer = false;
			dataEntity[tabName].isShowInner = false;

			utilObj.applyRealTimeState(dataEntity[tabName]);
			utilObj.applyDataEntity(dataEntity[tabName]);
			//utilObj.applyTableData(dataEntity[tabName]);
			clearInterval(dataEntity[tabName].clearEndTimeOut);

			utilObj.clearDom();

			var param ={
				url:window.AJAX_URL.CANCEL_JOB,
				data:{
					queryKey:$(".query-tab-active").attr("queryKey"),
					queryIndex: queryIndex
				}
			};
			var doneFun = function(data){
				//if(data.code == 1){
					//前端取消，不管取消接口返回的信息，直接取消查询操作
					/*var tabName = "data" + data.queryIndex;

					//dataEntity[tabName].isCanceledLog = true;
					//dataEntity[tabName].isCanceledResult = true;

					dataEntity[tabName].isRunning = "cancel";
					dataEntity[tabName].isLeftData = false;
					dataEntity[tabName].searchResult = {};
					dataEntity[tabName].logString += "\n" + LOG_STATE.TASK_IS_CANCELED;
					dataEntity[tabName].isRedColorFont = false;
					dataEntity[tabName].isShowDownBtn = false;
					dataEntity[tabName].isLogSlidDown = false;
					dataEntity[tabName].isDownloadAllRunning = false;

					dataEntity[tabName].isShowResultsContent = true;
					dataEntity[tabName].isShowResultTitle = true;
					dataEntity[tabName].isShowLogSubstanceContainer = true;
					dataEntity[tabName].isShowLeftDataTitle = false;
					dataEntity[tabName].isShowResultTableContainer = false;
					dataEntity[tabName].isShowInner = false;

					utilObj.applyRealTimeState(dataEntity[tabName]);
					utilObj.applyDataEntity(dataEntity[tabName]);
					//utilObj.applyTableData(dataEntity[tabName]);
					clearInterval(dataEntity[tabName].clearEndTimeOut);

					utilObj.clearDom();*/
				/*}else{
					commonEventHandler.openInfoDialog($.i18n.prop('cancelFail'));
				}*/
			};
			var failFun = function(data){

			};
			ajaxHandler.ajaxFun(param,doneFun,failFun)
		},
		saveThings : function(){
			var queryName =$("#queryName").val();
			queryName   =   queryName.replace(/\s+/g,"");
			if(queryName == ""){
				$(".saveQuery-info").text($.i18n.prop('inputValidateValue'));
				$("#queryName").focus();
				return false;
			}else if(!commonEventHandler.checkInput("queryName")){
				$(".saveQuery-info").text($.i18n.prop('validateSaveQueryInput'));
				$("#queryName").focus();
				return false;
			}
			else{
				var param = {
					url :window.AJAX_URL.SAVE_CUSTOM_ENTRY,
					data:{
						ConnId:currentConnect.ConnId,
						alias:$("#queryName").val(),
						context:editor.getValue("\n")   //sql
					},
					type : "post",
					dataType : "json"
				};
				var doneFun = function(data){
					if(data.code == 1){
						commonEventHandler.openInfoDialog($.i18n.prop('saveQuerySuccess'));
					}
					else if(data.code == 0){
						leftBarEvent.queryCommomInfo(data,"saveQueryFail");
						//commonEventHandler.openInfoDialog($.i18n.prop('saveQueryFail'));
						//commonEventHandler.openInfoDialog($.i18n.prop('saveQueryFail') + "    " + data.errorMessage);
					}
					else if(data.code == -7){
						commonEventHandler.openInfoDialog($.i18n.prop('saveQueryFail'));
						//commonEventHandler.openInfoDialog($.i18n.prop('saveQueryFail') + "    " + data.errorMessage);
					}
				};
				var failFunc = function(data){
					//console.log(data);
				};
				ajaxHandler.ajaxFun(param,doneFun,failFunc);
			}

		},
		formatSql:function(){
			var param = {
				url : window.AJAX_URL.FORMATE_SQL,
				data:{
					sql:editor.getValue()
				},
				type : "post",
				dataType : "json"
			};
			var doneFun = function(data){
				if(data.code == 0){
					leftBarEvent.queryCommomInfo(data,"formatSqlFailed");
					//commonEventHandler.openInfoDialog($.i18n.prop('formatSqlFailed'));
					//commonEventHandler.openInfoDialog(data.errorMessage+","+$.i18n.prop('formatSqlFailed'));
				}else if(data.code = 1){
					editor.setValue(data.data);
				}
			};
			var failFunc = function(data){

			};
			ajaxHandler.ajaxFun(param,doneFun,failFunc);
		},
		saveConnection:function(sendData){
			var param = {
				url:window.AJAX_URL.SAVE_CONNECTION,
				data:sendData
			};
			var doneFun = function(data){
				if(data.code == 1){
					commonEventHandler.closeDialog();
					ajaxRequest.getConnections();
					setTimeout(function () {
						commonEventHandler.openInfoDialog($.i18n.prop('addDatasourceSuccess'));
					},500);
				}
				else if(data.code == 0){
					commonEventHandler.closeDialog();
					setTimeout(function () {
						leftBarEvent.queryCommomInfo(data,"addDatasourceFail");
					//	commonEventHandler.openInfoDialog($.i18n.prop('addDatasourceFail'));
						//commonEventHandler.openInfoDialog(data.errorMessage+','+$.i18n.prop('addDatasourceFail'));
					},500);
				}
			}
			var failFun = function(data){
				//console.info(data);
			}
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		},
		getConnections:function(){
			var param = {
				url:window.AJAX_URL.GET_CONNECTIONS
			};
			var doneFun = function(data){
				if(data.code == 1){
					if(data.data.length == 0){
						$(".notHaveDataSource").show();
						$(".myDataSources").hide();
					}
					else{
						$(".notHaveDataSource").hide();
						$(".myDataSources").show();
						leftBarEvent.createConnect(data.data);
					}

				}
				else if(data.code == 0){
					leftBarEvent.queryCommomInfo(data,'requestDataSourceFailed');
					//commonEventHandler.openInfoDialog($.i18n.prop('requestDataSourceFailed'));
					//commonEventHandler.openInfoDialog(data.errorMessage+","+$.i18n.prop('requestDataSourceFailed'));
				}
			};
			var failFunc = function(data){
				//console.log(data);
			}
			ajaxHandler.ajaxFun(param,doneFun,failFunc);
		},
		checkConnection:function(data,_mark){
			var param = {
				url:window.AJAX_URL.CHECK_CONNECTION,
				data:data,
				type:'POST'
			};
			var _data = data;
			var doneFun = function(data){
				if(data.code == 1){
					if(_mark == "save"){
						ajaxRequest.saveConnection(_data);
					}else{
						$(".checkConnectionInf").html("<span class='successInfo'>"+$.i18n.prop('testConnectionSuccess') +"</span>");
					}
				}
				else if(data.code == 0){
					var errorMessage = leftBarEvent.getErrorMessage(data);
					$(".checkConnectionInf").html("<span class='errorInfo'>"+ errorMessage + $.i18n.prop('testFailed') +"</span>");
				}
			};
			var failFun = function(data){

			};
			ajaxHandler.ajaxFun(param,doneFun,failFun);

		},
		getDataBase:function(countId){
			var param ={
				url:window.AJAX_URL.GET_DATABASES,
				type:'POST',
				data:{
					ConnId:currentConnect.ConnId,
					page:1,
					pageSize:10
				}
			};
			var doneFun = function(data){
				if(data.code == 1){
					leftBarEvent.createDataBases(data.data);
				}
				else if(data.code == 0){
					leftBarEvent.queryCommomInfo(data,'requestDataBaseFailed');
					//commonEventHandler.openInfoDialog($.i18n.prop('requestDataBaseFailed'));
					//commonEventHandler.openInfoDialog(data.errorMessage+" ,"+$.i18n.prop('requestDataBaseFailed'));

				}

			};
			var FailFunc = function (data) {

			};
			ajaxHandler.ajaxFun(param,doneFun,FailFunc)
		},
		getTables:function(_connId,_dbId,_dbName,page){
			if(!eventHandler.weatherHaveConnId()){
				return false;
			}
			var param ={
				url:window.AJAX_URL.GET_TABLES,
				type:'POST',
				data:{
					ConnId:_connId || currentConnect.ConnId,
					dbName:_dbName || currentDataBase.dbName.replace(/\s+/g,""),
					page:page ||1,
					pageSize:6
				}
			};
			var doneFun = function(data){
				if(data.code == 1){
					leftBarEvent.createTables(data.data.rows,data.data.page,data.data.total);

				}
				else if(data.code == 0){
					leftBarEvent.queryCommomInfo(data,'requestDataTableFailed');
					//commonEventHandler.openInfoDialog($.i18n.prop('requestDataTableFailed'));
					//commonEventHandler.openInfoDialog(data.errorMessage+","+$.i18n.prop('requestDataTableFailed'));
				}
			};
			var failFun = function(data){

			}
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		},
		getSearchTables:function(){
			if(!eventHandler.weatherHaveConnId()){
				return false;
			}
			var  searchValue = $('.dataSearchInput').val();
			var param = {
				url:window.AJAX_URL.GET_SEARCH_TABLES,
				data:{
					ConnId:currentConnect.ConnId,
					paramString:searchValue
				}
			};
			var doneFun = function(data){
				if(data.code == 0){
					leftBarEvent.queryCommomInfo(data,'dataTableSearchFailed');
					//commonEventHandler.openInfoDialog($.i18n.prop('dataTableSearchFailed'));
					//commonEventHandler.openInfoDialog(data.errorMessage+","+$.i18n.prop('dataTableSearchFailed'));
				}
				else if(data.code == 1){
					leftBarEvent.createSearchDataBase(data.data);
				}

			};
			var failFun = function(data){

			};
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		},
		getCols:function(){
			if(!eventHandler.weatherHaveConnId()){
				return false;
			}
			var _currentDbName = $(".activeTable").parent('div').parent('ul').siblings('li').attr('title');
			var _ConnId = $("._activeConnect").attr('data-id');
			var _tblId = $(".activeTable").attr('data-id');
			var _tblName =  $(".activeTable").attr('title');

			var currentTable =$(".tableSchema-title-name").attr('title');
			/*if(currentTable == _tblName){
				return false;
			}*/
			var param ={
				url:window.AJAX_URL.GET_COLS,
				type:'POST',
				data:{
					connId:_ConnId,
					dbName:_currentDbName,
					tblId:_tblId,
					tblName:_tblName
				}
			};
			var dataI = "data" + $(".query-tab-active").attr("queryIndex");

			$(".left-data-title").find(".result-load-icon").remove();
			$(".left-data-title").show().empty().append('<div class="float-left result-load-icon result-load-icon-loading" style="display: inline; float:left; margin-top:22px"></div>');

			dataEntity[dataI].isShowResultsContent = false;
			dataEntity[dataI].isShowResultTitle = false;
			dataEntity[dataI].isShowLogSubstanceContainer = false;
			dataEntity[dataI].isShowLeftDataTitle = true;
			dataEntity[dataI].isShowResultTableContainer = false;
			dataEntity[dataI].isShowInner = false;
			utilObj.applyDataEntity(dataEntity[dataI]);

			var doneFun = function(data) {
				if (data.code == 1) {
					if (data.data == null) {
						dataEntity[dataI].isShowResultTableContainer = false;
						dataEntity[dataI].searchResult = null;
						dataEntity[dataI].tableNameHtml = '<h3 class="tableSchema-title-name" title="'+ _tblName +'">' + $.i18n.prop('noDataStructure') + '</h3>';
					} else {
						var title = $.i18n.prop('tableSchema') +" :  " + _tblName;
						dataEntity[dataI].isShowResultTableContainer = true;
						dataEntity[dataI].searchResult = data.data;
						dataEntity[dataI].tableNameHtml = '<h3 class="tableSchema-title-name" title="'+ _tblName +'">' + title + '</h3>';
					}
				} else if (data.code == 0) {
					leftBarEvent.queryCommomInfo(data,'requestDataSheetStructureFailed');
					dataEntity[dataI].searchResult = null;
					dataEntity[dataI].isShowResultTableContainer = false;
				}
				dataEntity[dataI].isLeftData = true;
				$(".left-data-title").find(".result-load-icon").remove();//todo 此处包括数据、图标都应该做多窗口支持（前台传标志向后台，后台返回相同的标志），但此处触发事件进入闭包时存储了对应窗口的数据对象名称，类似实现了多窗口
				utilObj.applyTableData(dataEntity[$(".query-tab-active").attr("name")]);
				utilObj.applyDataEntity(dataEntity[dataI]);
			};
			var failFun = function(data){
			};
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		},
		getQueryHistory:function(){
			var param ={
				url:window.AJAX_URL.GET_QUERY_HISTORY,
				type:'post',
				data : {
					//isHistory : true
				}
			};
			var doneFun = function(data){
				if(data.code == 1){
					var _html='';
					var _state='';
					$.each(data.data,function(k,v){
						var _sql = v.sql.replace(new RegExp(/"|'/g),function(s,$1){
							if(s=='"'){
								return '&quot;';
							}else if(s=="'"){
								return '&apos;';
							}
						});
						switch (v.runningState){
							case -1: _state = '<span class="icon icon_abnormal"></span>';
								break;
							// 暂未给图标
							case 0: _state = '<span class="icon icon_cancel"></span>';
							 break;
							 case 1: _state = '<span class="icon icon_running"></span>';
							 break;
							case 2: _state = '<span class="icon icon_normal"></span>';
								break;
							default:
						}
						_html += '<tr>'
							+'<td title="'+_sql+'"><span>'+_state+'</span><span class="ellipsis">'+_sql+'</span></td>'
							+'<td>'+new Date(v.date).Format("yyyy-MM-dd hh:mm:ss")+'</td>'
							+'<td>' +eventHandler.getTimeDifferent(v.date,v.finishDate)+'</td>'
							+'<td><button class="btn btn-default btn-sm btn-edit" data-title="'+_sql+'" data-state="'+v.runningState+'" data-connid="'+v.connId+'" data-id="'+v.id+'" data-querycountkey="'+v.queryCountKey+'" data-querykey="'+v.queryKey+'">'+'Edit Query</button>'
							+'<button class="btn btn-default btn-sm btn-result" data-title="'+_sql+'" data-state="'+v.runningState+'" data-connid="'+v.connId+'" data-id="'+v.id+'"  data-querycountkey="'+v.queryCountKey+'" data-querykey="'+v.queryKey+'">'+'Result</button></td>'
							+'</tr>'
					});
					$('#HistoryList').html(_html);
					$(".resultTable").show();
				}
				else if(data.code == 0){
					leftBarEvent.queryCommomInfo(data,'requestQueryHistoryFailed');
					//commonEventHandler.openInfoDialog($.i18n.prop('requestQueryHistoryFailed'));
					//commonEventHandler.openInfoDialog(data.errorMessage+","+$.i18n.prop('requestQueryHistoryFailed'));
				}
			};
			var failFun = function(data){

			}
			ajaxHandler.ajaxFun(param,doneFun,failFun);

		},
		getCustomEntryList:function(num){
			var param ={
				url:window.AJAX_URL.GET_CUSTOM_ENTRY_LIST,
				type:'POST',
				data:{
					type: '2',
					page: num||'1',
					pageSize: '10'
				}
			};
			var doneFun = function(data){
				if(data.code == 1){
					$('#myQueryList').empty();
					var html = '';
					var data = data.data
					$.each(data.rows,function(k,v){
						var _sql = v.context.replace(new RegExp(/"|'/g),function(s,$1){
							if(s=='"'){
								return '&quot;';
							}else if(s=="'"){
								return '&apos;';
							}
						});
						html += '<tr>'
							+ '<td >'+ v.alias +'</td>'
							+ '<td title="'+_sql+'" style="text-align: left"><span class="ellipsis">'+ _sql +'</span></td>'
							+ '<td><button class="btn btn-default btn-sm btn-edit" data-sql="'+ _sql+'" data-title="'+v.alias+'">Edit Query</button><button class="btn btn-default btn-sm btn-delete" data-id="'+ v.id+'" data-title="'+ v.alias+'">Delete</button></td>'
					})
					$('#myQueryList').html(html);
					$(".resultTable").show();
					//我的查询删除事件
					/*$('.btn-delete').unbind('click').click(function(){
						eventHandler.deleteQuery();
					});*/
					//$('.btn-delete').unbind('click');

					$('#queryListPage').html('<div class="inner"></div>');
					if(data && data.total > 10) {
						$('#queryListPage .inner').bootpage({
							total: data.total,
							totalPage: Math.ceil(data.total / 10),
							dataNum: data.rows.length,
							page: data.page,
							maxVisible: 10,
							evt: 'queryPageChange'
						});//生成页码
						$('#queryListPage .inner').on('queryPageChange', function (event, pageNum) {
							event.stopPropagation();
							ajaxRequest.getCustomEntryList(pageNum.num);
						});//自定义改变页码事件
					}
				}
				else if(data.code == 0){
					leftBarEvent.queryCommomInfo(data,'requestMyQueryFailed');
					//commonEventHandler.openInfoDialog($.i18n.prop('requestMyQueryFailed'));
					//commonEventHandler.openInfoDialog(data.errorMessage+","+$.i18n.prop('requestMyQueryFailed'));
				}

			};

			var failFun = function(data){

			}
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		},
		getCustomEntryById:function(){

		},
		saveCustomEntry:function(saveContext){

		},
		updateCustomEntry:function(){

		},
		delCustomEntry:function(id){
			var param ={
				url:window.AJAX_URL.DEL_CUSTOM_ENTRY,
				type:'POST',
				data:{
					id: id
				}
			};
			var doneFun = function(data){
				if(data.code == 0){
					leftBarEvent.queryCommomInfo(data,'deleteMyQueryFailed');
					//commonEventHandler.openInfoDialog($.i18n.prop('deleteMyQueryFailed'));
					//commonEventHandler.openInfoDialog(data.errorMessage+","+$.i18n.prop('deleteMyQueryFailed'));
				}
				else if(data.code == 1){
					$('.delete-container').hide(200);
					ajaxRequest.getCustomEntryList();
				}

			};

			var failFun = function(data){

			}
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		},
		getArticlesByLenovoID:function(){

		},
		getLogs:function(){

		},
		runningSql:function(){
			///applySql
		},
		downloadFile:function(){
			$("#downLoad-btn").prop("disabled", true);
			var test_key = $(".query-tab-active").attr("queryKeyForDownload")
			var queryIndex = $(".query-tab-active").attr("queryIndex");
			$.exportExcel({
				queryKey: queryCache[queryIndex].queryKey,
				forBigData: 0,
				url: window.AJAX_URL.DOWNLOAD_FILE
			});
			$("#downLoad-btn").prop("disabled", false);
		},
		downloadFileAll:function(){
			$("#downLoadAll-btn").prop("disabled", true);
			var queryIndex = $(".query-tab-active").attr("queryindex");
			ajaxRequest.doSqlQuery(queryIndex, true);
		},
		savaArticle:function(){

		},
		getArticlesByLenovoID:function(){

		},
		logoout:function(){
			var param = {
				url:window.AJAX_URL.LOGO_OUT
			};
			var doneFun = function(){
				document.location =window.CONTEXT_PATH+"/login.jsp";
			};
			var failFun = function () {

			}
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		}
	}



	/**
	 * 生成表格内容
	 * */
	var result={
		createResult:function(data,_code){
			var _header;
			if(_code == 1){
				data = data;
			}else{
				_header = data.header;
				data = data.rows;
			}
			if (!!data) {
				$('#ResultTable .table').show();
				$('#ResultTable code').remove();
				$('#ResultListHeader').html('');
				$('#ResultList').html('');
				$('#ResultListPage').html('');
				$('.resultTable').scrollTop(0);
				var _html = '';

				if(_code =="1"){
					//调整表结构顺序
					var newData = [];
					$.each(data,function(key,val){
						var _obj ={};
						$.each(val,function(k,v){

							if(val.hasOwnProperty('colName')){
								_obj.colName=val['colName'];
							}
							if(val.hasOwnProperty('colType')){
								_obj.colType=val['colType'];
							}
							if(val.hasOwnProperty('colKey')){
								_obj.colKey=val['colKey'];
							}
							if(val.hasOwnProperty('colIsNull')){
								_obj.colIsNull=val['colIsNull'];
							}
							if(val.hasOwnProperty('colDefault')){
								_obj.colDefault=val['colDefault'];
							}
							if(val.hasOwnProperty('colComment')){
								_obj.colComment=val['colComment'];
							}
							if(val.hasOwnProperty('colExtra')){
								_obj.colExtra=val['colExtra'];
							}

						});
						newData.push(_obj);
					});
					data = newData;
					$.each(data[0], function(k, v){
						if(k.indexOf('.') > -1){
							_html += '<th>'+$.i18n.prop([k.split('.')[1]])+'</th>';
						}else{
							_html += '<th>'+$.i18n.prop([k])+'</th>';
						}
					});

					$('#ResultListHeader').html('<tr>'+_html+'</tr>');//表头
					_html = '';

					$.each(data, function(k, v){
						_html += '<tr>';
						$.each(v, function(key, val){
							var _val ="";
							if(val == null){
								_val = "";
								_html += '<td>'+_val+'</td>';
							}else{
								//格式化返回数据

								val = leftBarEvent.formatResultData(val);
								_val = val.replace(/\n/g,"<br>").replace(/\s+/g,"&nbsp;");
								if(val.length>200){
									_html += '<td style="white-space:normal">'+_val+'</td>';
								}
								else{
									_html += '<td>'+_val+'</td>';
								}
							}

						});
						_html += '</tr>'
					})

				}else if(_code =="2"){
					$.each(_header, function(k, v){
						if(v.indexOf('.') > -1){
							_html += '<th>'+v.split('.')[1]+'</th>';
						}else{
							_html += '<th>'+v+'</th>';
						}
					});

					$('#ResultListHeader').html('<tr>'+_html+'</tr>');//表头
					_html = '';
					$.each(data, function(k, v){
						_html += '<tr>';

						$.each(v, function(key, val){
							var _val =""
							if(val == null){
								_val = val;
								_html += '<td>'+_val+'</td>';
							}else{
								//格式化返回数据

								val = leftBarEvent.formatResultData(val);
								_val = val.replace(/\n/g,"<br>").replace(/\s+/g,"&nbsp;");
								if(val.length>200){
									_html += '<td style="white-space:normal">'+_val+'</td>';
								}
								else{
									_html += '<td>'+_val+'</td>';
								}
							}

						});
						_html += '</tr>'
					})
				}
				$('#ResultList').html(_html);//表格内容
				$(".logCon .resultTable").css('max-height',36*15+37);

				crateSucc = true;
			}
		}
	}




	/**
	 * 侧边栏事件绑定
	 * */
	var leftBarEvent = {
		searchInput: function () {
			if($(".querySearchInput").val().length > 0){
				$(".dataSourceSearch-icon").removeClass("search-inco").addClass('search-icon-blue');
				ajaxRequest.getSearchTables();
			}
			else{
				$(".dataSourceSearch-icon").removeClass("search-icon-blue").addClass('search-inco');
				var countId = $('._activeConnect').attr('data-id');
				ajaxRequest.getDataBase(countId);
			}
		},
		formatResultData: function (data) {
			var _data =data.replaceAll("<","&lt;");
				_data =_data.replaceAll(">","&gt;");
			return _data;
		},
		tableClick:function(_this){
			var timer = null;
			_this.unbind('click');
			_this.unbind('dblclick');
			_this.bind("click", function () { //单击事件
				clearTimeout(timer);
				var _thisLi = $(this);
				timer = setTimeout(function () { //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
					$('.data-dataTable-li').removeClass("activeTable");
					_thisLi.addClass("activeTable");
					$('.tableIcon').addClass("disable-table-icon");
					_thisLi.find('.dataIcons').removeClass("disable-table-icon").addClass("table-active-icon");
					var tableId = $(this).attr('data-id');
					var tableName = $(this).attr('title');
					leftBarEvent.setCurrentTable(tableId,tableName);
					ajaxRequest.getCols();
				},300);

			})
			_this.bind("dblclick", function () { //双击事件
				clearTimeout(timer); //在双击事件中，先清除前面click事件的时间处理
				var _currentConnectType = currentConnect.connectType;
				var _tableName = $(this).attr('title');
				var _currentDbName= $(this).parent('div').parent('ul').siblings('li').attr('title');
				var editorValue='';
				editorValue = "SELECT * FROM "+ _currentDbName +"."+ _tableName;
				editor.setValue(editorValue);
			})
		},
		openDialog:function(){
			leftBarEvent.chooseSourceType();
			$("#addDataSourceDialog").show("200");
			document.getElementById("dialogForm").reset();
			$("label.error").hide();
			$('.checkConnectionInf').text("");
		},
		flexSwitch:function(){
			if($(".dataSourcesOrSetTab").is(":visible")){
				$('.flex-warp').addClass('close-flex').find('.flex-icon-open').addClass('flex-icon-close');
				$(".queryContent").css('margin-left','0');
			}else{
				$('.flex-warp').removeClass('close-flex').addClass('open-flex').find('.flex-icon-close').removeClass('flex-icon-close').addClass('flex-icon-open');;
				$(".queryContent").css('margin-left','300px');
			}
			$(".dataSourcesOrSetTab").toggle(200);
		},
		dataBaseToggle:function(){
			var countId = $(this).attr('data-id');
			var countName = $(this).attr('title');
			var countType =  $(this).attr('data-type');
			leftBarEvent.setCurrentConnect(countId,countName,countType);
			ajaxRequest.getDataBase(countId);
		},
		tableSlideUp:function(){
			$('.data-dataBase-li').removeClass("activeDataBase");
			$(this).addClass('activeDataBase').addClass('tableClose').removeClass('tableOpen');
			$(this).find('.toggle-icon').toggleClass("toggle-icon-close",false);
			$(this).find('.toggle-icon').toggleClass("toggle-icon-open",true);
			$(this).next('ul').slideUp();
		},
		tableSlideDown:function(){
			//请求数据表内容
			$('.data-dataBase-li').removeClass("activeDataBase");
			$(this).addClass('activeDataBase').addClass('tableOpen').removeClass('tableClose');
			$(this).find('.toggle-icon').toggleClass("toggle-icon-close",true);
			$(this).find('.toggle-icon').toggleClass("toggle-icon-open",false);
			var dataBaseId = $(this).attr('data-id');
			var dbName = $(this).text();
			leftBarEvent.setCurrentDataBase(dataBaseId,dbName);
			$(this).next('ul').slideDown();
			if($(this).next('ul').length == 0){
				ajaxRequest.getTables();
			}
		},
		tableToggle:function(){
			/*$('.data-dataBase-li').removeClass("activeDataBase");
			$(this).addClass('activeDataBase');
			if($(this).next('ul').is(":visible")){
				$(this).find('.toggle-icon').toggleClass("toggle-icon-close",false);
				$(this).find('.toggle-icon').toggleClass("toggle-icon-open",true);
				$(this).next('ul').hide();
			}
			else{
				$(this).find('.toggle-icon').toggleClass("toggle-icon-close",true);
				$(this).find('.toggle-icon').toggleClass("toggle-icon-open",false);
				$(this).next('ul').show();
			}
			var dataBaseId = $(this).attr('data-id');
			var dbName = $(this).text();
			leftBarEvent.setCurrentDataBase(dataBaseId,dbName);
			if($(this).next('ul').length ==0){
				ajaxRequest.getTables();

				$(this).unbind('click');
			}
			return false;*/
		},
		menuItemSwitch:function(){
			$(".menu-item").toggleClass("menu-item-active",false);
			$(this).toggleClass("menu-item-active",true);
		},
		saveDataSouce :function(){
			$("#dialogForm").submit();
		},
		createConnect: function (data) {
			$(".connectionsDom").empty();
			if(data != null && data.length >0){
				for(var x =0;x<data.length;x++){
					var html ='<ul class="dataUl dataSource-li">' +
						'<li class="data-dataSource-li dataConnectName" title="'+ data[x].connectName +'" data-id="'+ data[x].id +'" data-type="'+ data[x].connectType +'">' +
						' <i class="connect-icon dataIcons floatLeft"></i>' +
						'<span class="data-name sourcesName">'+ data[x].connectName +'</span>' +
						' </li>';
					$(".connectionsDom").append(html);
				}
				$(".dataConnectName").bind('click',leftBarEvent.dataBaseToggle);
				$(".dataSource-li").after('<div class="dotted-hr clearFloat"></div>');
			}
			else{
				$(".notHaveDataSource").show();
			}
		},
		createDataBases:function(data){
			var _activeConnect =currentConnect.ConnName
			var _activeConnectId =currentConnect.ConnId;
			var _activeConnectType = currentConnect.connectType;
			$(".connectionsDom").empty();
			$('.connectionsDom').append("<div class='_activeConnect connect-name' title=" +_activeConnect +" data-type='"+ _activeConnectType +"' data-id=" +_activeConnectId +">" +
				"<span id='backConnect'></span>" +
				"<i class='activeConnectIcon'></i>" +
				"" + _activeConnect + "</div>");
			$('#backConnect').bind('click',ajaxRequest.getConnections);
			if(data.length == 0) {
				$('.connectionsDom').append("<div class='leftbarText  red-font'>"+ $.i18n.prop('noDataBase')+"</div>");
			}
			else{
				var search_html = '<div class="dataSource-search-input">' +
					' <div class="dataSource-search-input-box">' +
					'<input type="text"  class="querySearchInput searchinput dataSearchInput floatLeft" placeholder="'+ $.i18n.prop('search') +'">' +
					'<div class="icon floatLeft dataSourceSearch-icon search-inco"></div>' +
					' </div>' +
					'</div>';
				$('.connectionsDom').append(search_html);
				$(".querySearchInput").bind('keyup',leftBarEvent.searchInput);
				for(var x=0 ;x<data.length;x++){
					var html ='<ul class="dataUl dataTable-li">' +
						' <li class="data-dataBase-li tableClose"  title="'+ data[x]  +'">' +
						' <i class="icon2 server-icon dataIcons floatLeft"></i>' +
						'<span class="data-name sourcesName">'+ data[x] +'</span>' +
						' <i class="icon2 toggle-icon dataIcons floatRight toggle-icon-open"></i>' +
						'</li>';
					$('.connectionsDom').append(html);
				};
				eventHandler.controlOpBtn();
			}
		},
		createSearchDataBase:function(data){
			$('.dataUl').remove();
			if($.isEmptyObject(data)){
				$('.dataSource-search-input').append("<div class='dataUl' style='margin-top:20px;color:red'>" +
					""+ $.i18n.prop('noRelatedDataBaseAndDataTable')+"</div>");
			}else{
				$.each(data,function(key,value){
					if(value.data.length>0){
						var context= "";
						for(var x=0 ;x<value.data.length;x++){
							var _tableName = leftBarEvent.getSearchIncludeValue(value.data[x].tblName);
							context +='<li class="data-dataTable-li"  title="'+value.data[x].tblName +'">' +
								'<i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>' +
								'<span class="data-name tableName" title="'+ value.data[x].tblName +'">'+ _tableName +'</span>' +
								'</li>';
						}
						var _ulhtml ='<ul class="dataUl dataTable-li tableList-max-height">' +
							' <div class="tablesListInner searchMore">'+ context +'</div>' +
							'</ul>';
						var _dataBaseName = leftBarEvent.getSearchIncludeValue(value.data[0].dbName);
						var html ='<ul class="dataUl dataTable-li">' +
							' <li class="data-dataBase-li tableOpen"  title="'+ value.data[0].dbName +'">' +
							' <i class="icon2 server-icon dataIcons floatLeft"></i>' +
							'<span class="data-name sourcesName">'+ _dataBaseName +'</span>' +
							'<span class="red-font">('+ value.count +')</span>' +
							' <i class="icon2 toggle-icon dataIcons floatRight toggle-icon-close"></i>' +
							'</li>' +
							_ulhtml;
						$('.dataSource-search-input').after(html);
						leftBarEvent.tableClick($(".data-dataTable-li"));
					}
					else{
						var _dataBaseName = leftBarEvent.getSearchIncludeValue(key);
						var html ='<ul class="dataUl dataTable-li">' +
							' <li class="data-dataBase-li"  title="'+ key +'">' +
							' <i class="icon2 server-icon dataIcons floatLeft"></i>' +
							'<span class="data-name sourcesName">'+ _dataBaseName +'</span>' +
							'<span class="red-font">('+ value.count +')</span>' +
							'</li>';
						$('.dataSource-search-input').after(html);
					}
				});
			}
		},
		createTables:function(data,_page,_total){
			if(data.length == 0){
				$('.activeDataBase').after("<ul><li class='leftbarText red-font'>"+ $.i18n.prop('noTables')+"</li></ul>");
			}
			else{
				var _context = "";
				for(var x=0 ;x<data.length;x++){
					_context +='<li class="data-dataTable-li"  title="'+data[x] +'">' +
						'<i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>' +
						'<span class="data-name tableName" title="'+ data[x] +'">'+ data[x] +'</span>' +
						'</li>';
					tablesArr.push(data[x]);
				}
				if(_page >1 ){
					$('.activeDataBase').siblings('ul').find('.tablesListInner').append(_context);
					var dataLiLength = $('.activeDataBase').siblings('ul').find('.tablesListInner').find('li').length;
					$(".tablesListInner").scrollTop((_page -1) * 220);
					if(data.length == 0 || _total == dataLiLength){
						$('.activeDataBase').nextAll("ul").find('.tableList-more').remove();
						$('.activeDataBase').nextAll("ul").find('.tablesListInner').removeClass('moreList').addClass("searchMore");
					}
				}
				else{
					$('.activeDataBase').nextAll('ul').remove();
					var moreClass="";
					var _moreHtml ="";
					if(data.length>5){
						if(data.length == _total){
							moreClass='searchMore';
						}
						else{
							moreClass='moreList';
							_moreHtml = '<div class="tableList-more gray" data-page="'+ _page +'">'+$.i18n.prop("more")
								'<i class="icon-more"></i>' +
								' </div>';
						}
					}
					var html ='<ul class="dataUl dataTable-li tableList-max-height ulHide">' +
						' <div class="tablesListInner '+ moreClass +'">'+ _context + '</div>' +
						_moreHtml +
						'</ul>';
					$('.activeDataBase').after(html);
					$('.activeDataBase').nextAll('ul').toggle();
					$('.tableList-more').unbind('click');
					$('.tableList-more').bind('click',leftBarEvent.getMoreTables);
				}
				leftBarEvent.tableClick($(".data-dataTable-li"));
			}
		},
		getMoreTables:function(){
			var page = $(this).attr('data-page');
			$(".data-dataBase-li").removeClass("activeDataBase");
			$(this).parent('ul').siblings('li').addClass('activeDataBase');
			var dbName =$(this).parent('ul').siblings('li').attr('title');
			var dataBaseId = $(this).parent('ul').siblings('li').attr('data-id');
			var ConnId = currentConnect.ConnId;
			$(this).attr('data-page',parseInt(page)+1);
			ajaxRequest.getTables(ConnId,dataBaseId,dbName,parseInt(page)+1);
		},
		forValidate:function(){
			$("#dialogForm").validate({
				rules: {
					connectName: {
						required: true,
						minlength: 2
					},
					connectUrl: {
						required: true
					},
					connectDriver: {
						required: true
					}
				},
				messages: {
					connectName: {
						required: $.i18n.prop("pleaseEnterADataSourceAilas"),
						minlength:$.i18n.prop("dataSourceAilasMust")
					},
					connectUrl: {
						required:$.i18n.prop("pleaseEnterADataSourceURL")
					},
					connectDriver: {
						required:$.i18n.prop("pleaseEnterADataSourceDriver")
					}
				},
				submitHandler:function(form){
					var data = {
						connectName:$("#connectName").val(),
						connectType:$("#connectType option:selected").val(),
						connectUrl:$("#connectUrl").val(),
						connectDriver:$("#connectDriver").val(),
						connectUser:$("#connectUser").val(),
						connectPwd:$("#connectPwd").val(),
						connectOwner:$("input[name='isOpen']:checked").val()
					};
					ajaxRequest.checkConnection(data,"save");
				}
			});
		},
		checkConnectionFun :function(){
			if($("#dialogForm").valid()){
				var data = {
					connectName:$("#connectName").val(),
					connectType:$("#connectType option:selected").val(),
					connectUrl:$("#connectUrl").val(),
					connectUser:$("#connectUser").val(),
					connectPwd:$("#connectPwd").val(),
					connectOwner:$("input[name='isOpen']:checked").val()
				};
				ajaxRequest.checkConnection(data,"");
			}
			else{
				$("#dialogForm").valid();
			}
		},
		queryHistory:function(){
			$(this).addClass('active').siblings().removeClass('active');
			$('.history_container').show(200);
			$.queryHeight();//每次点击查询先获取窗口高度
			ajaxRequest.getQueryHistory();
		},
		myQuery: function(){
			$(this).addClass('active').siblings().removeClass('active');
			$('.myQuery_container').show(200);
			$.queryHeight();//每次点击查询先获取窗口高度
			ajaxRequest.getCustomEntryList();
		},
		setCurrentConnect:function(connId,connName,connType){
			currentConnect.ConnId = connId;
			currentConnect.ConnName = connName;
			currentConnect.connectType = connType;
		},
		setCurrentDataBase:function(dbId,dbName){
			currentDataBase.dbId = dbId;
			currentDataBase.dbName = dbName;
		},
		setCurrentTable:function(tableId,tableName){
			currentTable.tableId = tableId;
			currentTable.tableName = tableName;
		},
		getSearchIncludeValue :function(origValue){
			var _tableName ="";
			if(origValue.indexOf($(".querySearchInput").val()) > -1){
				var _start =origValue.indexOf($(".querySearchInput").val());
				var _end = $(".querySearchInput").val().length;
				var _resultstr =origValue.slice(_start,_start+_end);
				var _before = origValue.slice(0,_start);
				var _behind = origValue.slice(_start+_end,origValue.length);
				_tableName = _before+"<b class='redColorFont'>"+ _resultstr +"</b>"+_behind;
			}
			else{
				_tableName = origValue;
			}
			return _tableName;
		},
		chooseSourceType:function(){
			if($("#connectType option:selected").val() == "mysql"){
				$("#connectUser").rules("add",{required:true,messages:{required:$.i18n.prop("inputUserName")}});
				$("#connectUser-error").show();
				$(".username-must").show();
				$("#connectPwd").rules("add",{required:true,messages:{required:$.i18n.prop("pleaseInputPassword")}});
				$("#connectPwd-error").show();
			}else{
				$("#connectUser").rules("remove",'required');
				$("#connectUser-error").hide();
				$("#connectPwd").rules('remove','required');
				$("#connectPwd-error").hide();
				$(".username-must").hide();
			}
		},
		queryCommomInfo: function (data,opFail) {
			if(data.errorMessage != null && data.errorMessage.startWith('Timed out')){
				commonEventHandler.openInfoDialog($.i18n.prop('timeOut'));
				return false;
			}
			else if(data.errorMessage != null && data.errorMessage.startWith('Duplicate key')){
				commonEventHandler.openInfoDialog($.i18n.prop('nameRepeat'));
				return false;
			}
			else{
				commonEventHandler.openInfoDialog( $.i18n.prop(opFail));
				return false;
			}
		},
		getErrorMessage: function (data) {
			var _errorMessage="";
			if(data.errorMessage != null && data.errorMessage.startWith('Bad URL format')){
				_errorMessage = $.i18n.prop('connectionAddressFormatError')+"！"
			}
			else if(data.errorMessage !=null && data.errorMessage.startWith("Could not open client transport with JDBC Uri")){
				_errorMessage =$.i18n.prop('connectionAddressFillInError')+"！"
			}
			else if(data.errorMessage !=null && data.errorMessage.startWith("port out of range")){
				_errorMessage =$.i18n.prop('portOutOfRange')+"！"
			}
			else if(data.errorMessage != null && data.errorMessage.startWith('Timed out')){
				_errorMessage =$.i18n.prop('timeOut')+"！"
			}
			else{
				_errorMessage =$.i18n.prop("systemError")+"！";
			}
			return _errorMessage;
		}
	};

	function BindLeftBarEvent() {
		//搜索框搜索事件
		$(".querySearchInput").keyup(leftBarEvent.searchInput);
		//表的单击事件(click)
		//打开对话框
		$('.addDataSourcesBtn').unbind('click').bind('click',leftBarEvent.openDialog);
		//关闭对话框
		$(".close-dialog-icon").unbind('click').bind('click',leftBarEvent.closeDialog);
		//侧边栏的隐藏/显示
		$(".flex-warp").unbind('click').bind('click',leftBarEvent.flexSwitch);
		//数据库的显示/隐藏
		$(".dataConnectName").unbind('click').bind('click',leftBarEvent.dataBaseToggle);
		//菜单栏的active切换
		$(".menu-item").unbind('click').bind('click',leftBarEvent.menuItemSwitch);
		//添加数据库（save）
		$("#saveDataSource").unbind('click').bind('click',leftBarEvent.saveDataSouce);
		//连接测试
		$("#checkConnection").unbind('click').bind('click',leftBarEvent.checkConnectionFun);
		//表单验证
		leftBarEvent.forValidate();
		$('.connectionsDom').on('click','.tableClose',leftBarEvent.tableSlideDown);
		$('.connectionsDom').on('click','.tableOpen',leftBarEvent.tableSlideUp);

		//获取所有的连接
		ajaxRequest.getConnections();
		//初始化高度
		$(".dataSourcesOrSetTab").css('min-height',window.innerHeight - 62);
		$('.flex-warp').css('top',(window.innerHeight-72)/2);
		//获取查询历史记录
		$(".historyQuery").unbind('click').bind('click',leftBarEvent.queryHistory);
		//获取我的查询
		$('.savedQuery').unbind('click').bind('click',leftBarEvent.myQuery);
		//删除我的查询
		$('#myQueryList').on('click','.btn-delete',eventHandler.deleteQuery);
		$("#connectType").on('change',leftBarEvent.chooseSourceType);
		$(".close-dialog-icon").bind('click',commonEventHandler.closeDialog);

	}




//-----------li start-------------
	/**
	 * sql 代码编辑器
	 */
	(function(){
		window.editor = CodeMirror.fromTextArea($("#editor")[0], {
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
		function completeIfInTag(cm) {
			return completeAfter(cm, function() {
				var tok = cm.getTokenAt(cm.getCursor());
				if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
				var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
				return inner.tagName;
			});
		}
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
		editor.on('change', function() {
			var dataI = $(".query-tab-active").attr("name");
			dataEntity[dataI].sqlString = editor.getValue();
			eventHandler.controlOpBtn();
		})
		editor.setSize("100%",110);
		editor.refresh();//动态设置或浏览器变动后保证editor的正确显示
		editor.focus();//give the editor focus
	})()


	/**
	 * @description 数据内存模型
	 * @type {{tabNum: number, data1: {name: string, sqlString: string, isRunning: boolean, logString: string, searchResult: string}}}
	 */
	var dataEntity = {
		tabNum : 1,//建立过的标签的总数，新增加1，删除不变
		// index : 1,//标签切换/添加/删除后更新此index，以对应当前标签的数据
		"data1" : {
			name : "data1",
			sqlString : "",
			isRunning : "notRun",
			logString : "",
			searchResult : {},
			isLeftData : false,
			downloadAll : false,

			isShowDownBtn : false,
			endTimeSecond : 0,
			endTimeSecondId : "endTime1",
			isLogSlidDown : false,
			isCanceledLog : false,
			isCanceledResult : false,
			onceLogMark : true,
			isShowDownloadAllBtn : false,
			isDownloadAllRunning : false,

			isShowResultTitle : false,
			isShowResultsContent : false,
			isShowLogSubstanceContainer : false,
			isShowLeftDataTitle : false,
			isShowResultTableContainer : false,
			isShowInner : false
		}
	};

	/**
	 * @description 事件处理程序对象
	 * @type {{switchTab: Function, addTab: Function, closeTab: Function, searchOrCancel: Function, job: Function, format: Function, store: Function, toLog: Function, downloadAll: Function, download: Function}}
	 */
	//记录拖动的坐标
	var xy ={};
	eventHandler={
		switchTab : function(){
			utilObj.clearDom();

			var _this = $(this);
			$(".query-content-tab").find("li").removeClass("query-tab-active");
			_this.addClass("query-tab-active");
			var _dataI = dataEntity["data" + _this.attr("queryIndex")];
			//切换到新开窗口时有显示多余文字
			utilObj.applyDataEntity(_dataI);
			utilObj.applyTableData(_dataI);
			utilObj.applyRealTimeState(_dataI)
		},
		addTab : function(title){

			utilObj.clearDom();

			var tabLi = $(".query-content-tab").find("li");
			var til = title;
			if( typeof(title)=='object' || title == undefined){
				til = $.i18n.prop('newQueryTab');
			}
			if(tabLi.length < 6){
				tabLi .removeClass("query-tab-active");
				var liHtml= '<li class="query-content-li query-tab-active" name="data' + (++ dataEntity.tabNum) + '" queryIndex="' + dataEntity.tabNum + '"><span class="run-state-icon"></span>'+til+' '+ dataEntity.tabNum + '<span class="run-close-icon"></span></li>';
				$(".query-content-tab").find("ul").append(liHtml);

				//增加时间标签
				var endTimeHtml = '<span class="result-load-endTime" id="endTime' + dataEntity.tabNum + '"></span>';
				$(".search-time-text").after(endTimeHtml);
				$(".result-load-endTime").hide();
				$("#endTime" + dataEntity.tabNum).show();

				var _entityName = "data" + dataEntity.tabNum;
				dataEntity[_entityName] = {
					name : "data" + dataEntity.tabNum, //dataI
					sqlString : "",                     //sql
					isRunning : "notRun",              //执行状态
					logString : "",                     //日志
					searchResult : {},                  //查询结果
					startTimeString : "",              //开始时间
					isShowDownBtn : false,             //是否显示下载按钮的标志   出查询结果数据时显示
					isCanceledLog : false,			//log请求是否取消
					isCanceledResult : false,			//结果请求是否取消
					endTimeSecond : 0,					 //执行时间
					endTimeSecondId : "endTime" + dataEntity.tabNum,		//执行时间internal句柄
					isLogSlidDown : false,			//log是否打开
					onceLogMark : true,				//保证“执行详细日志----”只被添加一次,true:未添加；false:已添加
					isShowDownloadAllBtn : false,	//是否显示下载全部按钮，查询结果大于1000条才显示
					isDownloadAllRunning : false,	//false 下载完成或下载失败，true正在执行下载

					isShowResultsContent : false,    //是否显示结果块的（结果行和日志）
					isShowResultTitle : false,		//是否显示resultTitle(结果行，包括下载按钮的整行)
					isShowLogSubstanceContainer : false,//是否显示日志块

					isShowLeftDataTitle : false,		//是否显示左侧数据标题
					isShowResultTableContainer : false,//是否显示数据表格块（查询结果和左侧数据公用）
					isShowInner : false,				//是否显示分页
					downloadAll : false				//下载全部的标志
				}
				utilObj.applyRealTimeState(dataEntity[_entityName]);
				utilObj.applyDataEntity(dataEntity[_entityName]);
				utilObj.applyTableData(dataEntity[_entityName]);
			}else{
				//超出窗口数量限制
				$("#tabNumMax").show();
			}
		},
		closeTab : function(e){
			e = e || window.event;
			e.stopPropagation();

			utilObj.clearDom();

			var thisLi = $(this).parent();
			var _thisLiName = thisLi.attr("name");
			if(thisLi .siblings().length > 0 ){
				if(thisLi.hasClass("query-tab-active")){
					if(thisLi.nextAll().length > 0){
						var _$next = thisLi.next();
						_$next.addClass("query-tab-active");
						utilObj.applyDataEntity(dataEntity[_$next.attr("name")]);
						utilObj.applyTableData(dataEntity[_$next.attr("name")]);
					}else{
						var _$prev = thisLi.prev();
						_$prev.addClass("query-tab-active");
						utilObj.applyDataEntity(dataEntity[_$prev.attr("name")]);
						utilObj.applyTableData(dataEntity[_$prev.attr("name")]);
					}
				}
				thisLi.remove();
				clearInterval(dataEntity[thisLi.attr("name")].clearEndTimeOut);
				utilObj.deleteDataEntity(dataEntity[thisLi.attr("name")]);
			}else{
				clearInterval(dataEntity[thisLi.attr("name")].clearEndTimeOut);
				dataEntity[_thisLiName] = {
					name : _thisLiName,
					sqlString : "",
					isRunning : "notRun",
					logString : "",
					searchResult : {},
					endTimeSecondId : _thisLiName.replace("data","endTime")
				};
				$(".left-data-title").hide();
				utilObj.applyRealTimeState(dataEntity[_thisLiName])
				utilObj.applyDataEntity(dataEntity[_thisLiName]);
				utilObj.applyTableData(dataEntity[_thisLiName]);
			}
			//utilObj.StopQueryForClose(dataEntity[_thisLiName]);

		},
		searchOrCancel : function(){
			//判断是否选择了数据源
			if(!eventHandler.weatherHaveConnId()){
				return false;
			}
			utilObj.clearDom();
			$('.tableSchema-title-name').remove();
			$('.result-title').show();
			$('.log-substance').show();//显示结果

			var _thisName = $(this).attr("name");
			if(_thisName == "查询"){
				var dataI = $(".query-tab-active",".query-content-tab").attr("name");
				var queryIndex = $(".query-tab-active",".query-content-tab").attr("queryIndex");

				dataEntity[dataI].isLogSlidDown = true;
				dataEntity[dataI].logString = "";
				dataEntity[dataI].isRunning = "run";//点击查询代表查询开始
				dataEntity[dataI].sqlString = editor.getValue();
				dataEntity[dataI].startTimeString = "（" + $.i18n.prop('startTimes') + "：" + utilObj.formatData(new Date()) + "";
				//防止结束时间timer在开始前就被取消时，执行时间仍显示上次的时间，未被更新
				dataEntity[dataI].endTimeSecond = "0";
				dataEntity[dataI].clearEndTimeOut = utilObj.getEndTime(dataEntity[dataI]);
				dataEntity[dataI].isShowDownBtn = false;
				dataEntity[dataI].isShowResultTitle = true;
				dataEntity[dataI].isCanceledLog = false;//查询时重置日志和结果查询取消标志，因为上次取消可能造成标志标志改变（变为已取消（true））
				dataEntity[dataI].isCanceledResult = false;
				dataEntity[dataI].onceLogMark = true;

					//右侧放数据的容器
				dataEntity[dataI].isShowResultsContent = true;
				dataEntity[dataI].isShowResultTitle = true;
				dataEntity[dataI].isShowLogSubstanceContainer = true;
				dataEntity[dataI].isShowLeftDataTitle = false;
				dataEntity[dataI].isShowResultTableContainer = true;
				dataEntity[dataI].isShowInner = true;

				utilObj.applyDataEntity(dataEntity[dataI]);
				utilObj.applyRealTimeState(dataEntity[dataI]);
				ajaxRequest.doSqlQuery(queryIndex);

			}else if(_thisName == "取消"){
				ajaxRequest.cancelJob();
			}
		},
		job : function(){

		},
		format : function(){
			ajaxRequest.formatSql();
		},
		store : function(){
			if(!eventHandler.weatherHaveConnId()){
				return false;
			}
			var nowDate = new Date();
			var queryTabName = "_查询";
			var _time = nowDate.getTime()+queryTabName;
			$("#queryName").val(_time);
			$(".saveQuery-info").empty();
			$("#saveQueryDialog").show();
			$("#queryName").focus();
		},
		toLog : function(){
			if($(".log-substance-container").is(':visible')){
				$(".resultTable").css('height',"400px");
			}
			else{
				$(".resultTable").css('height',"300px");
			}
			$(".log-substance-container").slideToggle();
			dataEntity[$(".query-tab-active").attr("name")].isLogSlidDown = !dataEntity[$(".query-tab-active").attr("name")].isLogSlidDown;
		},
		downloadAll : function(){
			dataEntity[$(".query-tab-active").attr("name")].isDownloadAllRunning = true;
			utilObj.applyDataEntity(dataEntity[$(".query-tab-active").attr("name")]);
			ajaxRequest.downloadFileAll();

		},
		download : function(){
			ajaxRequest.downloadFile()
		},
		controlOpBtn:function(){
			var activeConnect = $("._activeConnect").length;
			var activeQuery=$('.dataSourcesOrSetTab .queryList.active').length;
			var editValue = editor.getValue();
			if((activeConnect>0||activeQuery>0) && editValue != ""){
				$(".queryBtn").prop('disabled',false);
			}
			else{
				$(".queryBtn").prop('disabled',true);
			}
		},
		storeQuery:function(){
			ajaxRequest.saveThings();
		},
		openInfoDialog:function(info){
			commonEventHandler.closeDialog();
			$("#operationInfoDialog").show();
			$("#operationInfoDialog .operationText").text(info);
		},
		onDragStart:function(_e){
			xy.x = _e.pageX;
			xy.y = _e.pageY;
			//拖动时改变editor的高度
			$(document).on('mousemove',eventHandler.onDrag);
			$(document).on('mouseup',eventHandler.onDragend);
		},
		onDrag:function(_e){
			var ab = {
				x: _e.pageX,
				y: _e.pageY,
			};
			if(ab.y - xy.y > 0){
				//向下
				var _sub = ab.y -xy.y;
				var _height = $('.CodeMirror-scroll').height() + _sub;
				editor.setSize('100%',_height);
				xy.y = ab.y;
				xy.x = ab.x;
			}
			else{
				//向上
				var _sub = ab.y -xy.y;
				var _height = $('.CodeMirror-scroll').height() + _sub;
				_height = _height<=100?100:_height;
				editor.setSize('100%',_height);
				xy.y = ab.y;
				xy.x = ab.x;
			}

		},
		onDragend:function(){
			$(document).off('mousemove',eventHandler.onDrag);
		},
		editQuery: function(){
			$('.myQuery_container').hide(200);
			var sql = $(this).data('sql');
			var title = $(this).data('title');
			var tab_nav = $('.query-content-tab ul li');
			var istrue = true;
			for(var i=0;i<tab_nav.length;i++){
				var curr = $(tab_nav[i]).text().trim().split(' ')[0];
				if(curr == title){
					istrue = false;
					return;
				}
			}
			if(istrue){
				if($(".query-content-tab").find("li").length == 6){
					$("#tabNumMax").show();
					return;
				}
				eventHandler.addTab(title);
				editor.setValue(sql);
				if(!$(this).hasClass('btn-result')){
					editor.focus();
				}else{
					$('.btn-query').trigger('click');
				}
			}
		},
		deleteQuery: function(){
			$('.delete-container').show(200);
			var id = $(this).data('id');
			var title = $(this).data('title')
			$('.delete-container #sqlName').html(title)
			eventHandler.deleteSure(id);
		},
		deleteSure: function(id){
			//查确定删除sql事件
			$('.btn-confirm').unbind('click').click(function () {
				ajaxRequest.delCustomEntry(id);
			});
		},
		cancelDel: function(){
			$('.delete-container').hide(200);
		},
		historyBtn:function (e) {
			e.stopPropagation();
			var _index = $(this).data('id'),
				_sql=$(this).data('title'),
				_queryKey=$(this).data('querykey'),
				_queryCountKey=$(this).data('querycountkey'),
				connid=$(this).data('connid'),
				state=$(this).data('state'),
				query_content_li=$('ul .query-content-li'),
				newFlag=true;
			var record='查询记录( '+_index+' )';
			for(var i=0;i<query_content_li.length;i++){
				var sqlVal = $(query_content_li[i]).text().trim().split(' ')[1];
				if(_index == sqlVal){
					newFlag = false;
					break;
				}
			}
			if(newFlag){
				if($(".query-content-tab").find("li").length == 6){
					$("#tabNumMax").show();
					return;
				}
				eventHandler.addTab(record);//新建查询窗口
			}
			editor.setValue(_sql);
			if(!$(this).hasClass('btn-result')){
				$('#ResultTable .table').hide();
				editor.focus();
			}else{
				var queryIndex = $(".query-tab-active").attr('queryIndex');//获取窗口Id
				$(".query-tab-active").attr("queryKey",_queryKey);

				var dataI = "data" + queryIndex;
				dataEntity[dataI].isRunning = "run";//点击查询代表查询开始
				dataEntity[dataI].sqlString = editor.getValue();
				dataEntity[dataI].startTimeString = "（" + $.i18n.prop('startTimes') + "：" + utilObj.formatData(new Date()) + "";
				dataEntity[dataI].clearEndTimeOut = utilObj.getEndTime(dataEntity[dataI]);
				dataEntity[dataI].logString = "";
				dataEntity[dataI].isLogSlidDown = true;

				dataEntity[dataI].isShowResultsContent = true;
				dataEntity[dataI].isShowResultTitle = true;
				dataEntity[dataI].isShowLogSubstanceContainer = true;
				dataEntity[dataI].isShowLeftDataTitle = false;
				dataEntity[dataI].isShowResultTableContainer = true;
				dataEntity[dataI].isShowInner = true;

				var _queryKeys = {
					queryCountKey : _queryCountKey,
					queryKey : _queryKey,
					queryIndex : queryIndex
				};
				queryCache[_queryKeys.queryIndex] = _queryKeys;
				utilObj.applyDataEntity(dataEntity[dataI]);

				ajaxRequest.getQueryLog(_queryKeys);
				ajaxRequest.getQueryResults(_queryKeys);

			}
			$('.history_container').hide(200);
		},
		getTimeDifferent :function(_start,_end){
			if(_end == 0){
				//return "正在执行";
				return $.i18n.prop('running');
			}
			else{
				var date1 = new Date(_start);  //开始时间
				var date2 = new Date(_end);    //结束时间
				var date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数
				var days = Math.floor(date3 / (24 * 3600 * 1000))  //计算出相差天数
				//计算出小时数
				var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
				var hours = Math.floor(leave1 / (3600 * 1000))
				//计算相差分钟数
				var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
				var minutes = Math.floor(leave2 / (60 * 1000))
				//计算相差秒数
				var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
				var seconds = Math.round(leave3 / 1000);
				if(days == 0){
					if(hours==0){
						if(minutes== 0){
							return seconds+"s";
						}
						else{
							return minutes + "m" + seconds+"s";
						}
					}
					else{
						return hours + "h" + minutes + "m" + seconds+"s";
					}
				}
				else{
					return days+"d"+hours + "h" + minutes + "m" + seconds+"s";
				}

			}
		},

		weatherHaveConnId:function(){
			var _ConnId = $("._activeConnect").attr('data-id');
			var _mark = true;
			if(_ConnId == undefined){
				commonEventHandler.openInfoDialog($.i18n.prop('selectDataSource'));
				_mark = false;
			}
			return _mark;
		},
		queryNameChange:function(){
			var queryName =$("#queryName").val();
			queryName   =   queryName.replace(/\s+/g,"");
			if(queryName ==""){
				$(".saveQuery-info").text($.i18n.prop('inputValidateValue'));
				$("#queryName").focus();
			}
			else{
				$(".saveQuery-info").text('');
			}
		}
	};




	/**
	 * @description 事件绑定函数
	 */
	function eventBinding(){
		//sql输入框标签切换
		$(".query-content-tab").on("click","li",eventHandler.switchTab);
		//添加sql输入框
		$(".query-content-tab").on("click",".tab-add",eventHandler.addTab);
		//关闭sql输入框标签
		$(".query-content-tab").on("click",".run-close-icon",eventHandler.closeTab);
		//查询、取消按钮事件处理
		$(".query-content-btn").on("click",".search-cancel",eventHandler.searchOrCancel);
		//job按钮事件处理
		$(".query-content-btn").on("click",".job",eventHandler.job);
		//format sql 事件处理
		$(".query-content-btn").on("click",".format",eventHandler.format);
		//存储查询sql
		$(".query-content-btn").on("click",".store",eventHandler.store);
		$("#saveQueryBtn").bind('click',eventHandler.storeQuery);
		$("#queryName").on('keyup',eventHandler.queryNameChange);
		//log图标点击事件
		$(".result-title").on("click",".log-container",eventHandler.toLog);
		//全部下载按钮事件处理
		$(".result-title").on("click",".downloadAll",eventHandler.downloadAll);
		//下载按钮事件处理
		$(".result-title").on("click",".download",eventHandler.download);
		//记录拖拽开始时的位置
		$('.splitLine').on('mousedown',eventHandler.onDragStart);
		eventHandler.controlOpBtn();
		//我的查询编辑sql事件
		$('#myQueryList').on('click','.btn-edit',eventHandler.editQuery);

		$('.delete-container').on('click','.btn-confirm',eventHandler.cancelDel)
		//查询历史编辑按钮和结果按钮处理
		$('#HistoryList').on('click','.btn-edit,.btn-result',eventHandler.historyBtn);
		//保存按钮添加回车事件
		//eventHandler.enterKey();
	}
	var utilObj = {
		/**
		 * @description  在界面应用对数据模型的切换、新增、修改
		 * @param data  特定的一个标签对应的数据模型
		 */
		applyDataEntity : function(data){
			//if(data.sqlString){
			editor.setValue(data.sqlString);
			// }
			/**
			 * red              ：失败
			 * green            ：成功
			 * gray-state       ：未执行
			 * loading          ：执行中（标签）
			 * cancel           ：取消
			 *
			 * blue             : 执行中（按钮）
			 */
			if(data.isRunning == "run"){
				$(".search-cancel",".query-content-btn").removeClass("btn-success").addClass("btn-danger query-btn-run-color").text($.i18n.prop('cancelText')).attr("name","取消");
				$(".result-load-icon",".result-title").removeClass("result-load-icon-ok result-load-icon-cancel result-load-icon-fail").addClass("result-load-icon-loading");
				$(".result-load-fail-text",".result-title").hide();
			}else if(data.isRunning == "ok"){
				$(".search-cancel",".query-content-btn").removeClass("btn-danger query-btn-run-color").addClass("btn-success").text($.i18n.prop('queryText')).attr("name","查询");
				$(".result-load-icon",".result-title").removeClass("result-load-icon-loading result-load-icon-cancel result-load-icon-fail").addClass("result-load-icon-ok");
				$(".result-load-fail-text",".result-title").hide();
			}else if(data.isRunning == "fail"){
				$(".search-cancel",".query-content-btn").removeClass("btn-danger query-btn-run-color").addClass("btn-success").text($.i18n.prop('queryText')).attr("name","查询");
				$(".result-load-icon",".result-title").removeClass("result-load-icon-ok result-load-icon-cancel result-load-icon-loading").addClass("result-load-icon-fail");
				$(".result-load-fail-text",".result-title").show();
			}else if(data.isRunning == "cancel"){
				$(".search-cancel",".query-content-btn").removeClass("btn-danger query-btn-run-color").addClass("btn-success").text($.i18n.prop('queryText')).attr("name","查询");
				$(".result-load-icon",".result-title").removeClass("result-load-icon-loading result-load-icon-fail result-load-icon-ok").addClass("result-load-icon-cancel");
				$(".result-load-fail-text",".result-title").hide();
			}else if(data.isRunning == "notRun"){
				$(".search-cancel",".query-content-btn").removeClass("btn-danger query-btn-run-color").addClass("btn-success").text($.i18n.prop('queryText')).attr("name","查询");
				//$(".result-load-icon",".result-title").removeClass("result-load-icon-loading").removeClass("result-load-icon-fail").addClass("result-load-icon-ok");
				$(".result-load-fail-text",".result-title").hide();
			}

			//data.logString = "sdjishdjcs\\nsdkcjsjdbc\\nsdhcvhsdvchs\\n";
			if(data.isRedColorFont){//错误日志时需要将换行符\n换成<br>
				data.logString = data.logString.replace(/\\n/g,"<br>");
			}
			$(".log-substance",".log-substance-container").html(data.logString);

			$(".result-load-startTime").text(data.startTimeString);
			//显示查询时间
			$(".result-load-endTime").hide();
			$("#" + data.endTimeSecondId).text(data.endTimeSecond).show();

			//显示下载按钮（包括下载和下载全部）
			if(data.isShowDownBtn){
				$(".download-btn").removeClass("hidden").addClass("show");
			}else{
				$(".download-btn").removeClass("show").addClass("hidden");
			}
			//显示下载全部按钮
			if(data.isShowDownloadAllBtn){
				$("#downAllLoad-btn").removeClass("hidden").addClass("show");
			}else{
				$("#downAllLoad-btn").removeClass("show").addClass("hidden");
			}
			//下载全部是否正在下载
			if(data.isDownloadAllRunning){
				$("#downAllLoad-btn").css("background",'url("../images/loading_GIF.gif") 7px 6px no-repeat')
										.attr("disabled","disabled");
				//下载全部的时候不应该能点击查询按钮
				//$(".search-cancel").attr("disabled","disabled");
										//.css("cursor","not-allowed");
			}else{
				$("#downAllLoad-btn").css("background","")
										.removeAttr("disabled");
				//$(".search-cancel").removeAttr("disabled");
										//.css("cursor","pointer");
			}

			//显示results content。
			if(data.isShowResultsContent){
				$(".result-content").removeClass("hidden").addClass("show");
			}else{
				$(".result-content").removeClass("show").addClass("hidden");
			}
			//是否显示结果和下载按钮的整条
			if(data.isShowResultTitle){
				$(".result-title").show();
			}else{
				$(".result-title").hide();
			}
			//是否显示左侧数据标题
			if(data.isShowLeftDataTitle){
				$(".left-data-title").show();
			}else{
				$(".left-data-title").hide();
			}
			//是否显示数据块（表格块）
			if(data.isShowResultTableContainer){
				$(".result-table-container").show();
			}else{
				$(".result-table-container").hide();
			}
			//是否显示分页
			if(data.isShowInner){
				$(".inner").show();
			}else{
				$(".inner").hide();
			}


			//更新结束时间
			$(".result-load-endTime").text(data.endTime);

			//错误日志红色显示
			//错误日志自动显示
			var $logSubstanceContainer = $(".log-substance-container");
			if(data.isRedColorFont){
				$(".log-substance").addClass("redColorFont");
			}else{
				$(".log-substance").removeClass("redColorFont");
			}

			//是否打开日志框
			var $logSubstanceContainer = $(".log-substance-container");
			if(data.isLogSlidDown){
				if($logSubstanceContainer.is(":visible")){
					//do nothing
				}else{
					$logSubstanceContainer.slideDown();
				}
			}else{
				if($logSubstanceContainer.is(":visible")){
					$logSubstanceContainer.slideUp();
				}else{
					//do nothing
				}
			}
		},
		applyTableData : function(data){
			if(data.isLeftData){
				$(".left-data-title").html(data.tableNameHtml);
				if(data.isRunning == "notRun"){
					$(".left-data-title").show();
				}
				if(data.searchResult == null){
					return;
				}
				result.createResult(data.searchResult,'1');
			}else{
				$(".left-data-title").hide();
				data = data.searchResult;
				if (!!data) {
					if(data.rows && data.rows.length == 0){
						$('#ResultListHeader').html("");
						$('#ResultList').html('<span class="label label-success">'+$.i18n.prop('finishedNoResult')+'!</span>');
						$('#ExportWrap').addClass('hidden');
					}else {
						$('#ExportWrap').removeClass('hidden');
						if (data.total && data.total == 1000) {
							$('#BtnExportAll').removeClass('hidden');
						} else {
							$('#BtnExportAll').addClass('hidden');
						}
						result.createResult(data,'2');
						if(data && data.total > 100){
							$('#ResultListPage').html('<div class="inner"></div>');
							$('#ResultListPage .inner').bootpage({
								total:data.total,
								totalPage: Math.ceil(data.total / 100),
								dataNum:data.rows.length,
								page: data.page,
								maxVisible: 100,
								evt:'resultPageChange'
							});
							$('#ResultListPage .inner').on('resultPageChange',function(event,pageNum){
								event.stopPropagation();
								if(crateSucc){
									crateSucc = false;
									var _queryIndex = $(".query-tab-active").attr("queryIndex");
									ajaxRequest.getQueryResults(queryCache[_queryIndex],pageNum.num);
								}
							});//自定义改变页码事件
						}else{
							/*$('#ResultListPage').html('');
							$('#ResultListHeader').html('');
							$('#ResultList').html('');
							$(".left-data-title").html("");*/
						}
					}
				}
			}
		},
		deleteDataEntity : function(data) {
			delete data;
		},
		formatData : function(time){
			var __month = time.getMonth() + 1;
			var _month = __month<10?("0" + __month):__month;
			var _day = time.getDate()>10?time.getDate():("0" + time.getDate());
			var _hour = time.getHours()<10?("0" + time.getHours()):time.getHours();
			var _minute = time.getMinutes()<10?("0" + time.getMinutes()):time.getMinutes();
			var _seconds = time.getSeconds()<10?("0" + time.getSeconds()):time.getSeconds();
			return  time.getFullYear() + "-" + _month + "-" + _day + " " + _hour + ":" + _minute + ":"  + _seconds;
		},
		getEndTime : function(data){
			var time = 0;
			var  $endTimeI = $("#" + data.endTimeSecondId);
			$endTimeI.text(0.00);
			var clearEndTimeOut = setInterval(function(){
				$endTimeI.text((time += 0.1).toFixed(2));
				data.endTimeSecond = time.toFixed(2);
			},100);
			return clearEndTimeOut;
		},
		/**
		 * @description 在页面应用实时状态
		 * @param data 数据内存模型
		 */
		applyRealTimeState : function(data){
			//应用实时运行状态
			switch (data.isRunning){
				case "run" :
					$("[name='" + data.name + "']").find("span:eq(0)").removeClass("sta-not-run sta-cancel sta-green sta-fail").addClass("sta-loading");
					break;
				case "ok" :
					$("[name='" + data.name + "']").find("span:eq(0)").removeClass("sta-fail sta-cancel sta-not-run sta-loading").addClass("sta-green");
					break;
				case "fail" :
					$("[name='" + data.name + "']").find("span:eq(0)").removeClass("sta-green sta-cancel sta-not-run sta-loading").addClass("sta-fail");
					break;
				case "cancel" :
					$("[name='" + data.name + "']").find("span:eq(0)").removeClass("sta-green sta-fail sta-not-run sta-loading").addClass("sta-cancel");
					break;
				case "notRun" :
					$("[name='" + data.name + "']").find("span:eq(0)").removeClass("sta-green sta-fail sta-cancel sta-loading").addClass("sta-not-run");
					break;
				default :
			}

		},
		clearDom : function(){
			//$(".download-btn").removeClass("show").addClass("hidden");
			$('#ResultListPage').html('');
			$('#ResultListHeader').html('');
			$('#ResultList').html('');
			$(".left-data-title").html("");
		}
	};
	eventBinding();
	BindLeftBarEvent();
//-----------li end---------------

// 点击query弹框高度自适应
	$.extend({
		queryHeight:function () {
			// 计算弹出框高度
			var header_h = $('#public-header').height(),
				win_h = $(window).height();
			dialog_h=win_h - header_h;
			table_h=dialog_h-80;
			$('.myQuery_container .content,.history_container .content').height(dialog_h);
			$('.history_container .resultTable').height(table_h);//历史查询表格高度
			$('.myQuery_container .resultTable').height(table_h-60);//历史查询表格高度
		}
	})


});
