
/**
	* Created by shiwenli on 2016/9/7.
	*/


	//ajax 操作句柄
	var ajaxHandler = new xhrFunction();
	//查询文件的setTimeout句柄
	var clearSearchTimeout;
	//点击删除（两个地方的删除都支持）时缓存的需删除的文件的路径
	window.deletePath = "";
	//点击重命名时将需要重命名的文件路径缓存
	window.reNamePath = "";
	//当前路径Html
	var currentPathForFail = {
		html : "",
		url : "/"
	};
	//模拟代理用户和path
	var analogData = {
		PATH : "user/",
		PROXY_USER_NAME : "u_ods_mqm"
	}
	/**
	 * @description 事件处理程序对象
	* */
	var fileEventHander = {
		checkAll : function(){
			util._checkAll();
			util.checkNumCheck();//设置按钮状态是否可用
		},
		checkOne : function(){
			util._checkOne();
			util.checkNumCheck();
		},
		downLoadFile : function(){
			var path = "";
			var dataTr = {};//判断是否是文件夹
			if($(this).attr("name") == "downLoad"){
				dataTr = $(this).parent().parent().parent().parent().data("tr");
				if(dataTr == true){
					util.openInfoDialog($.i18n.prop('notSupportDownloadFolder'));
					return;
				}
				path = util.getCurrentPath() + $(this).parent().prev(".file-name").text() + "/"
			}else{
				path = util.getCheckedPath();

				var _$checked = $(".checkOne:checked");
				var len=_$checked.length;
				for(var i= 0;i<len;i++){
					if($(_$checked[i]).parent().parent().data("tr") == true){
						util.openInfoDialog($.i18n.prop('notSupportDownloadFolder'));
						return;
					}
				}

			}
			if(path){
				asyncRequest.downLoadFileCheck(path);
			}
		},
		renameFile : function(){
			$("#renameName").parent('p').next('p').remove();
			$("#renameFileNameDialog").show();
			//$(".renameTextTip").empty();
			$('#renameName').val("").on('keyup',commonEventHandler.validateInput);
			//显示需要重命名的文件名也在此方法完成
			util.create2ReNamePath(this);
		},
		doReName : function(){
			//特殊字符验证
			$("#renameFileNameDialog").show();
			var _input=$("#renameName").val();
			var r_input = _input.replace(/\s+/g,"");
			if(r_input =="") {
				$("#renameName").parent('p').next('p').remove();
				$("#renameName").parent('p').after("<p class='red-font'>" +  $.i18n.prop('inputValidateValue') + "</p>");
				return false;
			}else if(!util.checkInput("renameName")){
				$("#renameName").parent('p').next('p').remove();
				$("#renameName").parent('p').after("<p class='red-font'>" +  $.i18n.prop('validateSaveQueryInput') + "</p>");
				return false;
			}
			else{
				asyncRequest.reNameFile(window.reNamePath,util.getCurrentPath() + $("#renameName").val() + "/");
			}
		},
		deleteFile : function(){
			$("#deleteFileDialog").show();
			util.create2DeleteFilePath(this);
		},
		doDeleteFile : function(){
			asyncRequest.deleteFile(window.deletePath);
		},
		openFileDir : function(){

		},
		openDir:function(_this){
			var timer = null;
			_this.unbind('click');
			_this.unbind('dblclick');
			_this.bind("click", function () { //单击事件
				clearTimeout(timer);
				var _thisLi = $(this);
				timer = setTimeout(function () { //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
					var currentPath = util.getCurrentPath();
					currentPathForFail.html = $(".page-head").html();
					currentPathForFail.url = currentPath;
					var text = _thisLi.text();
					util.setPath(text);
					var path = currentPath + text + "/";
					asyncRequest.getFileList(path);
				},300);

			})
			_this.bind("dblclick", function () { //双击事件
				clearTimeout(timer); //在双击事件中，先清除前面click事件的时间处理
				})
		},
		searchFile : function(){
			clearSearchTimeout?clearTimeout(clearSearchTimeout):"";
			clearSearchTimeout = setTimeout(function(){
				var searchKey = $.trim($(".searchInput").val());
				asyncRequest.getFilteredList({
					keyWords : searchKey
				});
			},500);
		},
		headerDirClick : function(){

			currentPathForFail.html = $(".page-head").html();
			currentPathForFail.url = util.getCurrentPath();

			var path = "";//跟目录path为空
			if($(this).text() != "Home"){
				path = util.getPath(this);
			}
			util.cutPath(this);
			asyncRequest.getFileList(path);
		},
		hoverIn : function(){
			var _$this = $(this);
			_$this.find(".file-icon-down").removeClass("hidden-icon");
			_$this.find(".file-icon-rename").removeClass("hidden-icon");
			_$this.find(".file-icon-delete").removeClass("hidden-icon");
			_$this.find(".file-icon-open").removeClass("hidden-icon");
		},
		hoverOut : function(){
			var _$this = $(this);
			_$this.find(".file-icon-down").addClass("hidden-icon");
			_$this.find(".file-icon-rename").addClass("hidden-icon");
			_$this.find(".file-icon-delete").addClass("hidden-icon");
			_$this.find(".file-icon-open").addClass("hidden-icon");
		},
		stopDblclick: function () {
			$('.dir-name').unbind('dblclick');
			$('.dir-name').dblclick(function(e){
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		}


	};

	/**
	 * @description 绑定事件
	 * */
	function eventBind(){
		//全选
		$(".check-all").on("click",fileEventHander.checkAll);
		//分选
		$("#file_ListTbody").on("click",".checkOne",fileEventHander.checkOne);
		//下载
		$("#file_ListTbody").on("click",".file-icon-down",fileEventHander.downLoadFile);
		$(".fileDownload").on("click",fileEventHander.downLoadFile);
		//重命名
		$("#file_ListTbody").on("click",".file-icon-rename",fileEventHander.renameFile);
		$(".fileRename").on("click",fileEventHander.renameFile);
		$("#saveRenameFileNameBtn").on("click",fileEventHander.doReName);

		//删除
		$("#file_ListTbody").on("click",".file-icon-delete",fileEventHander.deleteFile);
		$(".fileDelete").on("click",fileEventHander.deleteFile);
		//执行删除动作
		$("#deleteFileBtn").on("click",fileEventHander.doDeleteFile);

		//打开文件所在路径
		$("#file_ListTbody").on("click",".file-icon-down",fileEventHander.openFileDir);
		//目录点击事件（点击进入该目录）
		//$("#file_ListTbody").on("click",".dir-name",fileEventHander.openDir);
		//fileEventHander.stopDblclick();
		//搜索
		$(".searchInput").on("input",fileEventHander.searchFile);
		//面包屑导航点击
		$(".page-head").on("click",".header-dir",fileEventHander.headerDirClick);
		$(".page-head").on("click",".header-dir-home",fileEventHander.headerDirClick);
		//hove效果
		//$("#file_ListTbody").find("tr").hover(fileEventHander.hoverIn,fileEventHander.hoverOut);
	}

	/**
	 * @description 异步请求对象
	 * @type {{loadJobList: Function}}
	 */
	var asyncRequest = {
		//获取文件列表
		getFileList : function(path,num){
			$(".dir-name").unbind('click');
			util.listLoadingState(true);
			util.closeSearchState();
			$(".searchInput").removeAttr("disabled");
			var param ={
				url:window.AJAX_URL.GET_FILE_LIST,
				data:{
					//proxyUserName:"u_ods_mqm",
					page : num || "1",
					pageSize : "20",
					path : path || "/"
				},
				type : "post"
			};
			var doneFun = function(data){
				//data = analog;
				Pace.bar.finish();
				if(data.code == 0){
					//todo 进入目录失败
					util.applyDataForGetListFail(data);
				}else if(data.code == 1){
					if(!data.data.files.total>0){
						util.emptyDirTip($.i18n.prop('emptyDirectory'));
						return;
					}

					util.initPagingContener();

					var rows = data.data.files.rows;
					var html = "";
					for(var i= 0,len=rows.length;i<len;i++){

						rows[i].path.nameTitle = rows[i].path.name;//复制的用于放在title里文件名
						html += util.createTableHtml(rows[i]);
					}
					$("#file_ListTbody").html(html);
					fileEventHander.openDir($(".dir-name"));
					$("#file_ListTbody").find("tr").hover(fileEventHander.hoverIn,fileEventHander.hoverOut);
					$(".check-all").prop("checked",false);
					$(".noData-tip").hide();
					util.checkNumCheck();
					if(data.data.files.total > 20){
						//生成分页
						util._createPaging({
							total : data.data.files.total,
							pageIndex : data.data.files.page,
							fun : asyncRequest.getFileList,
							dataNum : data.data.files.rows.length
						});
					}

				}
			};
			var failFun = function () {
				util.applyDataForGetListFail();
			};
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		},
		getFilteredList : function(args,num){
			util.listLoadingState(false);
			var param ={
				url:window.AJAX_URL.GET_FILE_LIST,
				data:{
					page : num || "1",
					pageSize : "20",
					path : util.getCurrentPath() || "/",
					filefilter : args.keyWords
				},
				type : "post"
			};
			var doneFun = function(data){
				//data = filteredData;
				Pace.bar.finish();
				if(data.code == 0){
					//todo 过滤数据失败
					util.searchState(0,"",false);
					util.fileCommonInfo(data,"searchFailed");
					/*if(data.data != null && data.data.startWith('Permission denied')){
						util.openInfoDialog($.i18n.prop('userNoAuthorization'));
					}
					else{
						util.openInfoDialog( $.i18n.prop('programException'));
					}*/
					//util.applyDataForGetListFail();
				}else if(data.code == 1){
					util.searchState(data.data.files.total, $.trim($(".searchInput").val()),true);
					if(!data.data.files.total>0){
						util.emptyDirTip($.i18n.prop('noSearchData'));
						return;
					}

					util.initPagingContener();

					var rows = data.data.files.rows;
					var html = "";
					var _keyWords = $.trim($(".searchInput").val());
					for(var i= 0,len=rows.length;i<len;i++){
						rows[i].path.nameTitle = rows[i].path.name;//复制的用于放在title里文件名
						rows[i].path.name = rows[i].path.name.replace(_keyWords,('<b class=\"red-filter-name\">' + _keyWords + '</b>'));

						html += util.createTableHtml(rows[i]);
					}
					$("#file_ListTbody").html(html);
					fileEventHander.openDir($(".dir-name"));
					$("#file_ListTbody").find("tr").hover(fileEventHander.hoverIn,fileEventHander.hoverOut);
					$(".check-all").prop("checked",false);
					$(".noData-tip").hide();
					util._checkAll();
					//util.checkNumCheck();
					if(data.data.files.total > 20){
						//生成分页
						util._createPaging({
							total : data.data.files.total,
							pageIndex : data.data.files.page,
							fun : asyncRequest.getFilteredList,
							dataNum : data.data.files.rows.length
						});
					}
				}


			};
			var failFun = function () {
				util.searchState(0,"",false);
			};
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		},
		downLoadFileCheck : function(path){
			var param ={
				url:window.AJAX_URL.CHECK_FILE,
				data:{
					path : commonEventHandler.encodeUrl(path)
				},
				type : "post"
			};
			var doneFun = function (data) {
				Pace.bar.finish();
				if(data.code == 0){
					asyncRequest.downloadFileMaxTip(data);
				}else if(data.code == 1){//可以下载文件
					//todo 下载多个文件时出错，只能下载自己新建的文件夹
					//判断文件的大小，大于30M时不能进行下载
					asyncRequest.downloadFileMaxTip(data);
					asyncRequest.downLoadFile(data.data);
				}
			};
			var failFun = function () {
				setTimeout(function () {
					fileEventHander.openInfoDialog( $.i18n.prop('programException'));
				},500);
			};
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		},
		downLoadFile: function (_path) {

			if($("#ExcelForm").length == 0){
				$(document.body).append('<form target="ExcelIframe" id="ExcelForm">'
					+'<input type="hidden" id="Excel_path" name="path" value="'+ _path +'"/>'
					+'</form><iframe name="ExcelIframe" style="display:none; visibility: hidden;"></iframe>');
			}
			var _form = document.getElementById("ExcelForm");
			_form.method = "post";
			_form.action = window.AJAX_URL.DOWNLOAD_FILE_FILE;
			_form.submit();
		},
		deleteFile : function(path){
			var param ={
				url:window.AJAX_URL.DELETE_FILE,
				data:{
					path : path
				},
				type : "post"
			};
			var doneFun = function (data) {
				Pace.bar.finish();
				if(data.code == 0){
					util.fileCommonInfo(data,"deleteFail");
				}else if(data.code == 1){
					//todo 多个文件/文件夹进行删除时报错,
					util.openInfoDialog( $.i18n.prop('deleteSuccess'));
					asyncRequest.getFileList(util.getCurrentPath());
				}
			};
			var failFun = function () {
				setTimeout(function () {
					fileEventHander.openInfoDialog( $.i18n.prop('programException'));
				},500);
			};
			Pace.restart();
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		},
		downloadFileMaxTip: function (_data) {
			util.fileCommonInfo(_data,"downloadfailed");
			return true;
		},
		reNameFile : function(path,newPath){//todo encodeURIComponent
			//当用户没有修改名称时就不请求后端
			if(path == newPath){
				commonEventHandler.closeDialog();
				return false;
			}
			var param ={
				url:window.AJAX_URL.RENAME_FILE_OR_FOLD,
				data:{
					path : path,
					newPath : newPath
				},
				type : "post"
			};
			var doneFun = function (data) {
				Pace.bar.finish();
				if(data.code == 0){
					util.fileCommonInfo(data,"renameFail");
					//commonEventHandler.openInfoDialog(data.errorMessage+","+$.i18n.prop('renameFail'));
				}else if(data.code == 1){
					util.openInfoDialog( $.i18n.prop('renameSuccess'));
					asyncRequest.getFileList(util.getCurrentPath());
				}
			};
			var failFun = function () {

			};
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		}
	}
	var util = {
		_checkAll : function(){
			$(".checkOne").prop("checked",$(".check-all").is(":checked"));
		},
		_checkOne : function(){
			var checkBoxLen = $(".checkOne").length;
			if($(".checkOne:checked").length == checkBoxLen){
				$(".check-all").prop("checked",true);
			}else{
				$(".check-all").prop("checked",false);
			}
		},
		checkNumCheck :function(){
			var checkedNum = $(".checkOne:checked").length;
			if(checkedNum == 0){//未选中：
				util.clearAllState();
				$(".fileDownload").attr("disabled","disabled");
				$(".fileDelete").attr("disabled","disabled");
				$(".fileRename").attr("disabled","disabled");
				$(".fileMove").attr("disabled","disabled");
				$(".fileCopy").attr("disabled","disabled");
			}else if(checkedNum == 1){//选中1个
				util.clearAllState();
			}else if(checkedNum >1){//选中多个
				util.clearAllState();
				$(".fileRename").attr("disabled","disabled");
			}
		},
		clearAllState : function(){
			var _$btn = $(".toolbar").find("button");
			for(var i= 0,len=_$btn.length;i<len;i++){
				$(_$btn).removeAttr("disabled");
			}
		},
		createTableHtml : function(rowI){
			var html_1 = '<tr data-tr="' + rowI.dir + '">'+
			'<td><input class="checkOne" type="checkbox"></td>'+
			'<td style="text-align: left;">'+
			'<div class="name-wrap"">';

			var html_2;
			if(rowI.dir == true ){
				html_2 = '<span class="file-icon file-icon-view-file"></span>'+
						 '<span class="file-name dir-name"  title="' + rowI.path.nameTitle + '">' + rowI.path.name + '</span>';
			}else{
				html_2 = '<span class="file-icon file-icon-view"></span>'+
						 '<span class="file-name" title="' + rowI.path.nameTitle + '">' + rowI.path.name + '</span>';
			}
			var html_3 = '<span class="file-icon-contener">'+
			'<span class="file-icon file-icon-down hidden-icon" name="downLoad"></span>'+
			'<span class="file-icon file-icon-rename  hidden-icon" name="reName"></span>'+
			'<span class="file-icon file-icon-delete  hidden-icon" name="delete"></span>'+
			'<span class="file-icon file-icon-open  hidden-icon" name="openFileDir" style="display: none"></span>'+
			'</span>'+
			'</div>'+
			'</td>';
			var html4;
			if(rowI.dir == true){
				html4 = '<td class="size"></td>';
			}else{
				html4 = '<td class="size">' + commonEventHandler.sizeFormat(rowI.length) + '</td>';
			}
			var html5 = '<td>' + rowI.permission + '</td>'+
			'<td>' + rowI.modificationTime + '</td>'+
			'</tr>';
			return html_1 + html_2 + html_3 + html4 + html5;
		},
		_createPaging : function(args){
			$('#file_ListPage').html('<div class="inner"></div>');
			$('#file_ListPage .inner').bootpage({
				total:args.total,
				totalPage: Math.ceil(args.total / 20),
				dataNum:args.dataNum,
				page:args.pageIndex,
				maxVisible: 20,
				evt:'queryPageChange'
			});//生成页码
			$('#file_ListPage .inner').on('queryPageChange',function(event,pageNum){
				event.stopPropagation();
				args.fun(util.getCurrentPath(),pageNum.num);
			});//自定义改变页码事件
		},
		/**
		 * @description 获取当前点击的目录名的完整目录，包括点击的目录名
		 * @param _this 点击的目录名所在的标签
		 * @returns {string}
		 */
		getPath : function(_this){
			var that = _this;

			var thisText = $(that).text();
			var _prevAllSpan = $(that).prevAll(".header-dir");
			var path = "";

			for(var i= _prevAllSpan.length-1;i>-1;i--){
				path += $(_prevAllSpan[i]).text() + "/"
			}
			return path + thisText + "/";
		},
		/**
		 * @description 点击表格中的文件夹打开文件夹时在导航栏加上打开的路径
		 * @param text
		 */
		setPath : function(text){
			var html = '<span>&nbsp;>>&nbsp;</span><span class="header-dir" name="' + text + '">' + text + '</span>';
			$(".page-head").append(html);
		},
		/**
		 * @description 获取当前导航栏显示的路径
		 * @returns {string}  以“/”隔开的当前路径，尾部包含“/”
		 */
		getCurrentPath : function(){
			var path = "/";
			var _currentPath = $(".header-dir")
			for(var i= 0,len=_currentPath.length;i<len;i++){
				path += $(_currentPath[i]).text() + "/"
			}
			return path;
		},
		/**
		 * @description 点击导航栏时截断所点击的路径后边的路径，后边的路径不再在导航栏显示
		 * @param _this 当前点击的目录所在的标签
		 */
		cutPath : function(_this){
			var that = _this;
			$(that).nextAll("span").remove();
		},
		/**
		 * @description 获取当前选中的文件或文件夹的路径，多个路径以“||”分隔，每个路径均以“/”结尾
		 * @returns {string}
		 */
		getCheckedPath : function(){
			var _$checked = $(".checkOne:checked");
			var path = "";
			var len=_$checked.length;

			for(var i= 0;i<len;i++){
				path += util.getCurrentPath() + $(_$checked[i]).parent().next().find(".file-name").text() + "/" + "||"
			}
			//if(len == 1){
				path = path.substring(0,path.length-2);
			//}
			return path;
		},
		/**
		 * @description 点击删除时将需删除的文件path存于window.deletePath中
		 * @param _this
		 */
		create2DeleteFilePath : function(_this){
			var that = _this;
			var path = "";
			if($(that).attr("name") == "delete"){
				path = util.getCurrentPath() + $(that).parent().prev(".file-name").text() + "/"
			}else{
				path = util.getCheckedPath();
			}
			window.deletePath = path;
		},

		create2ReNamePath : function(_this){
			var that = _this;
			var path = "";
			if($(that).attr("name") == "reName"){
				var _text = $(that).parent().prev(".file-name").text();
				$("#renameName").val(_text);
				path = util.getCurrentPath() + _text + "/"
			}else{
				$("#renameName").val($(".checkOne:checked").parent().next().find(".file-name").text());
				path = util.getCheckedPath();
			}
			window.reNamePath = path;
		},
		openInfoDialog: function (info) {
			//console.log(info)
			commonEventHandler.openInfoDialog(info);
		},
		/**
		 * @description 进入目录失败时的补救（重新请求进入之前的目录）
		 */
		applyDataForGetListFail : function(data){
			$("#file_ListTbody").html("");
			$(".fileCreate").attr("disabled","disabled");
			$(".searchInput").attr("disabled","disabled");
			if(!data){
				util.openInfoDialog( $.i18n.prop('openDirFall'));
				return;
			}
			util.fileCommonInfo(data,"openDirFall");
			/*
			if(data.errorMessage != null && data.errorMessage.startWith('Permission denied')){
				util.openInfoDialog( $.i18n.prop('openDirFall') + $.i18n.prop('userNoAuthorization'));
			} else{
				util.openInfoDialog( $.i18n.prop('openDirFall'));
			}*/
		},
		/**
		 * 获取选中的文件的大小
		 * @returns {string}
		 */
		getFileSize : function(){
			var _$checked = $(".checkOne:checked");
			var len = _$checked.length;
			var size = "";
			for(var i=0;i<len;i++){
				size += $(_$checked[i]).parent().siblings(".size").text() + "||";
			}
			size = size.substring(0,size.length-2);
			return size;
		},
		/**
		 * @description 文件列表加载时的状态（图标，列表显示空）
		 */
		listLoadingState : function(isGetList){
			var _loadingHtml ='<div class="loadingWarp">'+
								'LOADING' +
								'<div class="loading-big">' +
								'</div>' +
								'</div>';

			$("#file_ListPage").remove();
			$(".check-all").prop("checked",false);
		},
		/**
		 * @description 修改查询时的显示状态
		 */
		searchState : function(total,keyWords,isSuccess){
			total = total || 0;
			keyWords = keyWords || $.i18n.prop('all');
			$(".button-bar").hide();
			$(".search-bar").show();
			if(isSuccess == true){
				$(".search-success").show();
				$("search-fail").hide();
				$(".search-keywords").text(keyWords);
				$(".search-sum").text(total);
			}else if(isSuccess == false){
				$(".search-success").hide();
				$("search-fail").show();
			}
		},
		/**
		 * @description 切换回显示按钮
		 */
		closeSearchState :function(){
			$(".button-bar").show();
			$(".search-bar").hide();
			$(".searchInput").val("");
		},
		/**
		 * @description 初始化分页容器
		 */
		initPagingContener :function(){
			$(".file-table-list").append('<div id="file_ListPage" class="tableListPage"></div>');
		},
		noDataTip : function(text){
			$("#file_ListTbody").html("");
			$(".noData-tip").text(text).show();
		},
		checkInput : function (_inputId) {
			var str =$("#"+_inputId).val();
			var pattern = /^[\.\-_A-Za-z0-9\u4E00-\u9FA5]+$/;  ///^[\w\u4e00-\u9fa5]+$/gi;
			if(pattern.test(str))
			{
				//合法
				return true;
			}
			//非法
			return false;
		},
		fileCommonInfo: function (data,opFail) {
			if(data.code == 0){
				if(data.errorMessage != null && data.errorMessage.startWith('Permission denied')){
					util.openInfoDialog($.i18n.prop(opFail)+" "+$.i18n.prop('userNoAuthorization'));
					return false;
				}
				else if(data.errorMessage != null && data.errorMessage.startWith('The Target Path  Exists')){
					util.openInfoDialog( $.i18n.prop(opFail)+" "+$.i18n.prop('theTargetPathExists'));
					return false;
				}
				/*else if(data.errorMessage != null && data.errorMessage.startWith('NullPointer')){
					//空指针提示
					util.openInfoDialog( $.i18n.prop(opFail)+","+$.i18n.prop('theTargetPathExists'));
					return false;
				}*/
				else if(data.errorMessage != null && data.errorMessage.startWith('Illegal Input Path:too large file')){
					//文件过的提示
					util.openInfoDialog( $.i18n.prop('fileMaxTip'));
					return false;
				}
				else if(data.errorMessage != null && data.errorMessage.startWith('Timed out')){
					//文件过的提示
					util.openInfoDialog( $.i18n.prop('timeOut'));
					return false;
				}
				else{
					util.openInfoDialog( $.i18n.prop(opFail)+" "+$.i18n.prop("systemError"));
					return false;
				}
			}
		},
		emptyDirTip : function(tip){
			util.openInfoDialog(tip);
			$("#file_ListTbody").html("");
		}
	};
	function init(){
		eventBind();
		asyncRequest.getFileList();
	}
$(function(){
	init();
})