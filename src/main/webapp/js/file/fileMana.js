/**
 * Created by YueFang on 2016/9/7.
 */

$(function () {
	var MovePathParam;

	/**
	 * ajax请求
	 * */
	var fileAjaxRequst = {

		/**
		 *请求文件目录
		 * */
		getTargetPath: function () {

			var setting = {
				view: {
					selectedMulti: false,
					showLine: false
				},
				async: {
					enable: true,
					url:window.AJAX_URL.GET_TARGET_PATH,
					autoParam: ["id", "name", "level=lv"],
					otherParam: {
								path: function()
								{ return MovePathParam}
							},
					dataFilter: fileEventHander.ztreeFilter
				},
				callback: {
					beforeClick: function (treeId, treeNode) {
						$(".chooseInfor").empty();
						var zTree = $.fn.zTree.getZTreeObj("tree");
						if (treeNode.isParent) {
							zTree.expandNode(treeNode);
						}
						MovePathParam = [];
						$('#' + treeNode.tId).parents('li').each(function(){
							MovePathParam.push($('#' + $(this).attr('id') + '_a').attr('title'));
						})
						MovePathParam.reverse();
						if(MovePathParam.length == 0){
							MovePathParam = treeNode.name + '/';
						}
						else{
							MovePathParam = MovePathParam.join('/') + '/' + treeNode.name + '/';
						}
					},
					beforeAsync:fileEventHander.ztreeBeforeAsync,
					onAsyncSuccess: fileEventHander.zTreeOnAsyncSuccess
				}
			};
			$.fn.zTree.init($("#tree"), setting);
		},


		/**
		 * 创建文件夹请求
		 * */
		createFold: function () {
			//判断是否填写了名称
			var _input=$("#foldName").val();
			var r_input = _input.replace(/\s+/g,"");
			if(r_input =="") {
				$("#foldName").parent('p').next('p').remove();
				$("#foldName").parent('p').after("<p class='red-font'>" + $.i18n.prop("inputValidateValue") + "</p>");
				return false;
			}else if(!commonEventHandler.checkInput("foldName")){
				$("#foldName").parent('p').next('p').remove();
				$("#foldName").parent('p').after("<p class='red-font'>" + $.i18n.prop('validateSaveQueryInput') + "</p>");
				return false;
			}
			else{
				var param = {
					url:  window.AJAX_URL.CREATE_FOLD,
					type:"POST",
					data: {
						path:commonEventHandler.encodeUrl(util.getCurrentPath()+_input)
					}
				};
				var doneFun = function (data) {
					Pace.bar.finish();
					if(data.code == 0){
						//创建文件夹失败
						util.fileCommonInfo(data,"createFoldFail");
						//util.openInfoDialog(data.errorMessage+","+$.i18n.prop('createFoldFail'));
					}
					else if(data.code ==1){
						//创建成功后，刷新当前路径，重新
						/*todo 刷新当前目录信息*/
						asyncRequest.getFileList(util.getCurrentPath);
						setTimeout(function () {
							commonEventHandler.openInfoDialog($.i18n.prop('createFoldSuccess'));
						},500);

					}
				};
				var failFun = function (data) {
					setTimeout(function () {
						commonEventHandler.openInfoDialog($.i18n.prop('programException'));
					},500);
				};
				$("#createFoldBtn").unbind('click');
				ajaxHandler.ajaxFun(param,doneFun,failFun);
			}
		},


		/**
		 * 移动文件/文件夹
		 * */
		moveFile: function () {
			/*todo 获取参数*/
			//console.log(util.getCheckedPath());
			//console.log(MovePathParam);
			if(MovePathParam == "/"){
				$(".chooseInfor").empty();
				$(".chooseInfor").text($.i18n.prop('pleaseSelectTargetPath'));
				return false;
			}
			var param ={
				url: window.AJAX_URL.MOVE_FILE,
				type:"POST",
				data:{
					path:commonEventHandler.encodeUrl(util.getCheckedPath()),
					newPath:commonEventHandler.encodeUrl(MovePathParam)
				}
			};
			var doneFun = function (data) {
				Pace.bar.finish();
				if(data.code == 0){
					util.fileCommonInfo(data,"moveFail");
					//util.openInfoDialog(data.errorMessage+","+$.i18n.prop('moveFail'));

				}
				else if(data.code == 1){

					asyncRequest.getFileList(util.getCurrentPath);
					setTimeout(function () {
						commonEventHandler.openInfoDialog( $.i18n.prop('moveSuccess'));
					},500);
				}
			};
			var failFun = function (data) {
				setTimeout(function () {
					commonEventHandler.openInfoDialog( $.i18n.prop('programException'));
				},500);
			};
			//显示进度条
			Pace.restart();
			$("#saveMoveFileBtn").unbind('click');
			ajaxHandler.ajaxFun(param,doneFun,failFun);
		},

		/**
		 * 复制文件/文件夹
		 * */
		copyFile: function () {
			/*todo 获取参数*/
			//console.log(util.getCheckedPath());
			//console.log(MovePathParam);
			if(MovePathParam == "/"){
				$(".chooseInfor").empty();
				$(".chooseInfor").text($.i18n.prop('pleaseSelectTargetPath'));
				return false;
			}
			var param ={
				url: window.AJAX_URL.COPY_FILE,
				type:"POST",
				data:{
					path:commonEventHandler.encodeUrl(util.getCheckedPath()),
					newPath:commonEventHandler.encodeUrl(MovePathParam)
				}
			};
			var doneFun = function (data) {
				Pace.bar.finish();
				if(data.code == 0){
					/*复制失败后的提示*/
					util.fileCommonInfo(data,"copyFail");
					//util.openInfoDialog(data.errorMessage+","+$.i18n.prop('copyFail'));

				}else if(data.code == 1){
					/*todo 复制成功后的操作,刷新目录,getFileList*/
					asyncRequest.getFileList(util.getCurrentPath);
					setTimeout(function () {
						commonEventHandler.openInfoDialog($.i18n.prop('copySuccess'));
					},500);
				}
			};
			var failFun = function (data) {
				setTimeout(function () {
					commonEventHandler.openInfoDialog( $.i18n.prop('programException'));
				},500);
			};
			//显示进度条
			Pace.restart();
			$("#saveMoveFileBtn").unbind('click');
			ajaxHandler.ajaxFun(param,doneFun,failFun)
		}
	};










	/**
	 * @param 事件处理程序对象
	 * */
	var fileEventHander = {


		/**
		 * 打开创建文件夹框
		 * */
		openFileCreate: function () {
			$("#createFoldDialog").show();
			$('#foldName').val("").on('keyup',commonEventHandler.validateInput);
			$("#createFoldBtn").unbind('click');
			$("#createFoldBtn").on('click',fileAjaxRequst.createFold);
			$("#foldName").focus();
		},



		/**
		 * 打开上传文件/文件夹框
		 * */
		openFileUpload: function () {

		},


		/**
		 * 打开移动文件/文件夹框
		 * */
		openFileMove: function () {
			$("#moveFileDialog").find(".dialog-body-header").text($.i18n.prop('moveTo'));
			$("#moveFileDialog").show();
			$(".chooseInfor").empty();
			$("#saveMoveFileBtn").unbind('click').on('click',fileAjaxRequst.moveFile);
			$(".loadingWarp").remove();
			var _loadingHtml ='<div class="loadingWarp" style="margin:20px auto">'+
				'LOADING' +
				'<div class="loading-big">' +
				'</div>' +
				'</div>';
			//$(".treeContent").prepend(_loadingHtml);
			fileAjaxRequst.getTargetPath();
		},


		/**
		 * 打开复制文件/文件夹框
		 * */
		openFileCopy: function () {
			$("#moveFileDialog").find(".dialog-body-header").text( $.i18n.prop('copyTo'));
			$("#moveFileDialog").show();
			$(".loadingWarp").remove();
			$(".chooseInfor").empty();
			var _loadingHtml ='<div class="loadingWarp" style="margin:20px auto">'+
				'LOADING' +
				'<div class="loading-big">' +
				'</div>' +
				'</div>';
			//$(".treeContent").prepend(_loadingHtml);
			//$(".treeContent").prepend('<span class="icon icon_running loading-tree"></span>');
			$("#saveMoveFileBtn").unbind('click').on('click',fileAjaxRequst.copyFile);
			fileAjaxRequst.getTargetPath();
		},


		/**
		 * 打开提示信息框
		 * */
		openInfoDialog: function (info) {
			commonEventHandler.closeDialog();
			$("#openFileInforDialog").show();
			$(".operationText").text(info);
		},


		/**
		 * 格式化文件目录数据
		 * */
		ztreeFilter:function(treeId, parentNode, childNodes){
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
		},

		/**
		 * 异步请求文件目录之前修改当前目录的路径
		 * */
		ztreeBeforeAsync: function (treeId, treeNode) {
			if(treeNode){
				MovePathParam = [];
				$('#' + treeNode.tId).parents('li').each(function(){
					MovePathParam.push($('#' + $(this).attr('id') + '_a').attr('title'));
				})
				MovePathParam.reverse();
				MovePathParam = MovePathParam.join('/') + '/' + treeNode.name + '/';
			}else{
				MovePathParam = '/';
			}
		},



		/**
		 * 异步请求文件目录之后取消loading图标
		 * */
		zTreeOnAsyncSuccess:function(){
			$(".loadingWarp").remove();
		},

	};

	/**
	 * 绑定事件
	 * */
	function eventBind() {
		//新建文件
		$(".fileCreate").on('click', fileEventHander.openFileCreate);
		//上传文件
		$(".fileUpload").on('click', fileEventHander.openFileUpload);
		//移动文件
		$(".fileMove").on('click', fileEventHander.openFileMove);
		//复制文件
		$(".fileCopy").on('click', fileEventHander.openFileCopy);
	}

	eventBind();



})
