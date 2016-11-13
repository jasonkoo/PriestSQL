/**
	* Created by YueFang on 2016/9/8.
	*/

	//所有的ajax请求'
	window.AJAX_URL = {

		/*header部分*/
		LOGO_OUT:window.CONTEXT_PATH + '/logout',

		/*query页面*/
		GET_CONNECTIONS: window.CONTEXT_PATH  + "/connect/getConnections",
		SAVE_CONNECTION:window.CONTEXT_PATH + "/connect/saveConnection",
		CHECK_CONNECTION:window.CONTEXT_PATH + "/connect/checkConnection",
		GET_CLUSTER_USER:window.CONTEXT_PATH + "/entry/getClusterUser",
		GET_DATABASES:window.CONTEXT_PATH + "/entry/getDataBases",
		GET_TABLES:window.CONTEXT_PATH + "/entry/getTables",
		GET_COLS: window.CONTEXT_PATH + '/entry/getCols',
		GET_SEARCH_TABLES:window.CONTEXT_PATH + 'entry/searchDAT',
		GET_QUERY_HISTORY:window.CONTEXT_PATH + "/getQueryHistory",
		GET_CUSTOM_ENTRY_LIST:window.CONTEXT_PATH + "/entry/getCustomEntryList",
		GET_CUSTOM_ENTRY_BY_ID:window.CONTEXT_PATH + "/entry/getCustomEntryById",
		SAVE_CUSTOM_ENTRY:window.CONTEXT_PATH + "/entry/savaCustomEntry",
		UPDATE_CUSTOM_ENTRY:window.CONTEXT_PATH + "/entry/updateCustomEntry",
		DEL_CUSTOM_ENTRY:window.CONTEXT_PATH + "/entry/delCustomEntry",
		GET_ARTICLES_BY_LENOVO_ID:window.CONTEXT_PATH + "/cc/getArticlesByLenovoID",
		GET_LOGS:window.CONTEXT_PATH + "/logs",
		RUNNING_SQL:window.CONTEXT_PATH + "/applySql",
		CANCEL_JOB: window.CONTEXT_PATH + '/cancelJob',
		DOWNLOAD_FILE:window.CONTEXT_PATH + "/downloadFile",
		SAVE_ARTICLE:window.CONTEXT_PATH + "/cc/savaArticle",
		FORMATE_SQL:window.CONTEXT_PATH + "/formateSql",
		GET_RESULT: window.CONTEXT_PATH + '/query',


		/*定时任务页面*/
		GET_CONNECTIONS: window.CONTEXT_PATH  + "/connect/getConnections",//获取源
		GET_DATABASES:window.CONTEXT_PATH + "/entry/getDataBases",
		GET_QUERYJOB_LIST:window.CONTEXT_PATH + "/queryjob/list",
		GET_QUERYJOB_CREATE:window.CONTEXT_PATH + "/queryjob/create",
		GET_QUERYJOB_EDIT:window.CONTEXT_PATH + "/queryjob/edit",
		GET_QUERYJOB_DELETE:window.CONTEXT_PATH + "/queryjob/delete",
		GET_CLUSTER_USER:window.CONTEXT_PATH + "/entry/getClusterUser",
		GET_QUERYJOB_DISABLE:window.CONTEXT_PATH + "/queryjob/disable",
		GET_QUERYJOB_ENABLE:window.CONTEXT_PATH + "/queryjob/enable",
		GET_QUERYJOB_STOP: window.CONTEXT_PATH + "/queryjob/stop",
		GET_QUERYJOB_RESTART: window.CONTEXT_PATH + "/queryjob/restart",
		GET_QUERYJOB_EXECUTIONHISTORY: window.CONTEXT_PATH + "/queryjob/showExecutionHistory",


		/*file页面*/
		GET_FILE_LIST: window.CONTEXT_PATH + "file/fileList",
		MOVE_FILE: window.CONTEXT_PATH + "file/moveFile",
		COPY_FILE: window.CONTEXT_PATH + "file/copyFile",
		CREATE_FILE: window.CONTEXT_PATH + 'file/createFile',
		CREATE_FOLD: window.CONTEXT_PATH + 'file/createDirectory',
		DOWNLOAD_FILE_FILE: window.CONTEXT_PATH + "file/downloadFile",
		RENAME_FILE_OR_FOLD: window.CONTEXT_PATH + "file/renameFileOrDirectory",
		DELETE_FILE: window.CONTEXT_PATH + "file/deleteFile",
		GET_TARGET_PATH: window.CONTEXT_PATH + "file/targetPath",
		CHECK_FILE:window.CONTEXT_PATH+"file/checkFile"

	};



/*扩展string的方法，以某个字符串开头*/
String.prototype.startWith=function (str){
		var reg=new RegExp("^"+str);
		return reg.test(this);
}



String.prototype.replaceAll = function(s1,s2){
	return this.replace(new RegExp(s1,"gm"),s2);
}
















var userAppInf;
var ajaxHandler = new xhrFunction();
var commonEventHandler = {
	logout: function () {
		var param = {
			url:window.AJAX_URL.LOGO_OUT,
			type:'POST'
		};
		var doneFun = function(){
			document.location =window.CONTEXT_PATH+"/login.jsp";
		};
		var failFun = function () {

		}
		ajaxHandler.ajaxFun(param,doneFun,failFun);
	},
	closeDialog: function () {
		$('.mask-layout').hide();
	},
	openInfoDialog:function(info){
		commonEventHandler.closeDialog()
		var d = new DialogPulg({
			header:{
				html:"操作提示",
				_class:"headerClass"
			},
			content:{
				html:info,
				_class:'centerContent'
			},

		})
		/*commonEventHandler.closeDialog();
		$("#operationInfoDialog").show();
		$(".operationText").text(info);*/
	},
	checkInput : function (_inputId) {
		var str =$("#"+_inputId).val();
		var pattern = /^[_A-Za-z0-9\u4E00-\u9FA5]+$/;
		if(pattern.test(str))
		{
			//合法
			return true;
		}
		//非法
		return false;
	},
	getClusterUser:function(){
		var param = {
			url:window.AJAX_URL.GET_CLUSTER_USER,
			type:'POST',
			dataType:'json'
		};
		var doneFun = function(data){
			if(data.code ==1){
				var userAppList= data.data;
				if(userAppList.length>0){
					for(var x= 0;x<userAppList.length;x++){
						var _user='<li data-user="'+ userAppList[x].userName +'"><a href="javascript:;">'+ userAppList[x].userName +'</a></li>';
						$("#UserList").append(_user);
						commonEventHandler.userAppClick();
					}
					$('#UserSel').html('hive');
				}
				else{
					$("#UserList").html('<li><a href="javascript:;">无代理用户</a></li>');
				}
			}
			else if(data.code == 0){
				commonEventHandler.openInfoDialog($.i18n.prop('failedToObtainUserAgent'));
			}
		};
		var failFun = function(data){

		};
		ajaxHandler.ajaxFun(param,doneFun,failFun)
	},
	encodeUrl:function(url){
		return encodeURIComponent(encodeURIComponent(url));
	},
	userAppClick:function(){
		$('#UserList').on('click', 'li', function(){
			$('#UserSel').html($(this).attr('data-user'));
			$('#UserList').find('li').removeClass("userListActive");
			$(this).addClass('userListActive');
		});
	},
	getChooseUserApp: function () {
		userAppInf.userApp = $('#UserSel').text();
	},
	enterKey: function () {
		//键盘的enter事件
		$('.form-input').bind('keyup', function (event) {
			if (event.keyCode == "13") {
				//回车执行查询
				var _btn = $(this).parents('.mask-layout').find('.btn-save');
				$(_btn).trigger('click')
			}
		});
	},
	sizeFormat:function(size){
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
	},
	/**
	 * 验证inout的内容是否为空
	 * */
	validateInput: function () {
		var _input=$(this).val();
		_input = _input.replace(/\s+/g,"");
		var _mark = true;
		if(_input == ""){
			$(this).parent('p').next('p').empty();
			$(this).parent('p').after("<p class='red-font'>"+ $.i18n.prop('inputValidateValue') +"</p>");
			_mark = false;
		}else{
			$(this).parent('p').next('p').empty();
			_mark = true;
		}
		return _mark;
	},
	jobCommon: function(){
		$('.leftBar,.content').height($(window).height()-62);
		$(".querymainContent").css('min-height',$(window).height()-62);
		$('.page-content').height($(window).height()-103);
		$('.cont-area').css('min-height',$(window).height()-143);
		window.onresize = function(){
			$('.leftBar,.content').height($(window).height()-62);
			$('.page-content').height($(window).height()-103);
			$('.cont-area').css('min-height',$(window).height()-143);
		};
		$('.flex-warp').on('click',function(){
			if($(".leftBar").is(":visible")){
				$('.flex-warp').addClass('close-flex').find('.flex-icon-open').addClass('flex-icon-close');
				$(".content").css('margin-left','0');
			}else{
				$('.flex-warp').removeClass('close-flex').addClass('open-flex').find('.flex-icon-close').removeClass('flex-icon-close').addClass('flex-icon-open');;
				$(".content").css('margin-left','300px');
			}
			$(".leftBar").toggle(200);
		})
	},
	queryCommon: function () {
		window.onscroll=function(){
			$(".dataSourcesOrSetTab").css('min-height',$("#dataMan-body").height());
			var _hhh = $(window).height()- 62-45;
			$(".addDataSource").css('top',$(document).scrollTop()+_hhh);
		};
		window.onresize=function(){
			var _hhh = $(window).height()- 62-45;
			$(".dataSourcesOrSetTab").css('min-height', $(window).height());
			$(".addDataSource").css('top',$(document).scrollTop()+_hhh);
		};
		window.onclick = function () {
			var hh = $(window).height()- 62-45;
			$(".addDataSource").css('top',$(document).scrollTop()+hh);
		};
		$(function () {
			var _hhh = $(window).height()- 62-45;
			$(".addDataSource").css('top',$(document).scrollTop()+_hhh);
		})
	},
	fillNodataHtml: function(id){
		var  _html="";
		_html+="<div class='nodata'>";
		_html+="<div class='nodata-pic'></div>";
		_html+="</div>";
		$("#"+id).html(_html);
	}
};


$(function () {
	function eventBind(){
		//绑定退出按钮
		$("#logoOutBtn").on('click',commonEventHandler.logout);
		//绑定关闭对话框
		$(".close-dialog-icon").bind('click',commonEventHandler.closeDialog);
		//enter事件保存
		commonEventHandler.enterKey();
		//定时任务公共方法
		commonEventHandler.jobCommon();
		//query公共方法
		commonEventHandler.queryCommon();
	}

	eventBind();
})





