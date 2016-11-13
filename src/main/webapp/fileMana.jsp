<%@ page language="java" contentType="text/html; charset=utf-8"  pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page isELIgnored="false" %>
<%@ page import="java.util.Locale"%>
<%@ page import="java.util.ResourceBundle"%>
<%
	String langType = request.getSession().getAttribute("lang")+"";
	Locale locale = new Locale(langType);

	ResourceBundle i18nString = ResourceBundle.getBundle("i18n.strings", locale);
%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><%=i18nString.getString("projectName")%></title>
	<script type="text/javascript">
		window.Language = "<%=langType%>";
	</script>
	<link href="css/main.css" rel="stylesheet"/>
	<link href="${pageContext.request.contextPath}/js/CodeMirror-master/addon/hint/show-hint.css" rel="stylesheet"/>
	<link href="${pageContext.request.contextPath}/js/CodeMirror-master/lib/codemirror.css" rel="stylesheet"/>
	<script src="${pageContext.request.contextPath}/js/jquery-1.12.0.min.js"></script>
	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
	<!--[if lt IE 9]>
	<script src="${pageContext.request.contextPath}/libs/ie/ie8-responsive-file-warning.js"></script>
	<script src="${pageContext.request.contextPath}/libs/html5shiv/html5shiv.min.js"></script>

	<![endif]-->
</head>
<body>
<header id="public-header" class="container-full" style="z-index: 3;position: relative">
	<div class="header-row-wrap" style="margin-left: auto;margin-right:auto;">
		<div>
			<div class="header-left" style="background-color: #3786c3;height: 60px;width:300px;float:left;">
				<a class="logo-img" href="${pageContext.request.contextPath}/fileMana.jsp">
				</a>
			</div>
			<div class="header-right" style="height: 60px;float:right;">
				<div class="header-right-content">
					<ul class="floatRight">
						<%--<li class="dropdown menu-item floatLeft" id="DropdownUser" style="width:60px!important; border-left: 1px solid #6CBAF7;">
							<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
								<span id="UserSel" style="display: none"></span> <span class="userAppIcon"></span>
							</a>
							<div class="dropdown-menu" id="UserList">
							</div>
						</li>--%>
						<li class="dropdown menu-item floatLeft" style="width:60px!important;padding:5px; border-left: 1px solid #6CBAF7;">
							<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
								<i class="info-icon"></i>
							</a>
							<ul class="dropdown-menu langList  logoOut" id="logoOutBtn" onclick="">
								<li><a href="javascript:;" style="height: 30px;line-height:25px;"><%=i18nString.getString("logout")%></a></li>
							</ul>
						</li>
					</ul>
					<div class="header-right-menu header-right-menu-file"><a href="${pageContext.request.contextPath}/fileMana.jsp" class="menu-item  menu-item-active" style="float:right;width:125px;"><%=i18nString.getString("file")%></a></div>
					<div class="header-right-menu header-right-menu-file"><a href="${pageContext.request.contextPath}/jobList.jsp" class="menu-item" style="float:right;width:125px;"><%=i18nString.getString("job")%></a></div>
					<div class="header-right-menu header-right-menu-file"><a href="${pageContext.request.contextPath}/queryBrowser.jsp" class="menu-item" style="float:right;width:125px;"><%=i18nString.getString("query")%></a></div>
				</div>
			</div>
		</div>
	</div>
</header>

<main class="main-body">
	<%--<ul class="leftBar" style="display: none">
	</ul>
	<div class="flex-warp" style="display: none">
		<div class="flex-icon-open">
		</div>
	</div>--%>
	<div class="content" style="margin: 0px;">
		<div class="list">
			<div class="page-head">
				<sapn class="header-dir-home">Home</sapn>
				<%--<span>&nbsp;>>&nbsp;</span><span class="header-dir" name="user">user</span>
				<span>&nbsp;>>&nbsp;</span><span class="header-dir" name="file_1">file_1</span>--%>
			</div>
			<div class="page-content">
				<div class="cont-area">
					<div class="toolbar" style="display: inline-block;width:100%">
						<div class="floatLeft button-bar">
							<button class="btn btn-sm btn-default fileCreate file-btn"><%=i18nString.getString("newFold")%></button>
							<%--<button class="btn btn-sm btn-default fileUpload file-btn" ><%=i18nString.getString("uploadFile")%></button>--%>
							<button class="btn btn-sm btn-default fileDownload file-btn" ><%=i18nString.getString("download")%></button>
							<button class="btn btn-sm btn-default fileDelete file-btn"><%=i18nString.getString("del")%></button>
							<button class="btn btn-sm btn-default fileRename file-btn"><%=i18nString.getString("rename")%></button>
							<button class="btn btn-sm btn-default fileMove file-btn" ><%=i18nString.getString("move")%></button>
							<button class="btn btn-sm btn-default fileCopy file-btn" ><%=i18nString.getString("copy")%></button>
						</div>
						<div class="floatLeft search-bar" style="display: none">
							<div class="search-success" style="display: none">
								<span><%= i18nString.getString("searchText")%></span><span class="red-filter-name search-keywords"></span><span><%= i18nString.getString("allText")%></span><span class="red-filter-name search-sum"></span><span>个</span>
							</div>
							<div class="search-fail" style="display: none">
								<span class="red-filter-name"><%= i18nString.getString("filterFailed")%></span>
							</div>
						</div>
						<div class="search floatRight">
							<input type="text" class="floatLeft searchInput" style="border: none;width: 250px;padding-left: 4px;outline: none" placeholder="<%= i18nString.getString("searchInputePlaceHolder")%>"/>
							<div class="floatRight fileSearch hint--bottom" style="background-color: #F3F3F3" aria-label="<%=i18nString.getString("search")%>"></div>
						</div>

					</div>
					<div class="clearFloat file-table-list">
						<table class="table table-bordered table-hover table-condensed">
							<thead>
								<tr><th><input class="check-all" type="checkbox"></th><th style="text-align: left;width: 100px;"><div class="name-wrap"><%= i18nString.getString("tableFileName")%></div></th><th><%= i18nString.getString("tableFileSize")%></th><th><%= i18nString.getString("tableFileAuthority")%></th><th><%= i18nString.getString("tableFileUpdateData")%></th></tr>
							</thead>
							<tbody id="file_ListTbody">
							</tbody>
						</table>
						<div id="file_ListPage" class="tableListPage"></div>
						<div class="red-filter-name noData-tip" style="display:none"></div>
					</div>
				</div>
			</div>
		</div>

	</div>
</main>



<!--create file  information dialog-->
<div class="mask-layout" style="display:none" id="createFoldDialog">
	<div class="report-dialog-ask">
		<div class="report-dialog-ask-heading">
			<div class="close-dialog-icon icon"></div>
		</div>
		<div class="report-dialog-ask-body">
			<div class="report-dialog-ask-body-conent">
				<div class="createDataSourceModel">
					<div class='dialog-body-header'><%= i18nString.getString("newFold")%></div>
					<div class="" style="height: 10px;"></div>
					<p><input type="text" class="form-input" name='foldName' id="foldName" maxlength="20" autofocus="autofocus" placeholder="<%=i18nString.getString("placeEnterAFolderName")%>"/></p>
					<div class="" style="height: 20px;"></div>
				</div>
			</div>
		</div>
		<div class="report-dialog-ask-footer overflow-hidden">
			<button class="public-btn report-dialog-btn btn-cancel floatRight close-dialog-icon close-dialog" >
				<%= i18nString.getString("cancel")%>
			</button>
			<button class="public-btn report-dialog-btn btn-save floatRight" id="createFoldBtn">
				<%= i18nString.getString("save")%>
			</button>
		</div>
	</div>
</div>

<!--rename file name information dialog-->
<div class="mask-layout" style="display:none" id="renameFileNameDialog">
	<div class="report-dialog-ask">
		<div class="report-dialog-ask-heading">
			<div class="close-dialog-icon icon"></div>
		</div>
		<div class="report-dialog-ask-body">
			<div class="report-dialog-ask-body-conent">
				<div class="createDataSourceModel">
					<div class='dialog-body-header'><%= i18nString.getString("rename")%></div>
					<div class="" style="height: 10px;"></div>
					<p><input type="text" class="form-input" name='renameName' id="renameName" maxlength="20" autofocus="autofocus"/></p>
					<p class="red-font renameTextTip">

					</p>
					<div class="" style="height: 20px;"></div>
				</div>
			</div>
		</div>
		<div class="report-dialog-ask-footer overflow-hidden">
			<button class="public-btn report-dialog-btn btn-cancel floatRight close-dialog-icon close-dialog" >
				<%= i18nString.getString("cancel")%>
			</button>
			<button class="public-btn report-dialog-btn btn-save floatRight close-dialog-icon" id="saveRenameFileNameBtn">
				<%= i18nString.getString("save")%>
			</button>
		</div>
	</div>
</div>


<!--moveFile  dialog-->
<div class="mask-layout" style="display:none" id="moveFileDialog">
	<div class="report-dialog-ask">
		<div class="report-dialog-ask-heading">
			<div class="close-dialog-icon icon close-dialog"></div>
		</div>
		<div class="report-dialog-ask-body">
			<div class="report-dialog-ask-body-conent">
				<div class="createDataSourceModel">
					<div class='dialog-body-header'><%= i18nString.getString("moveTo")%></div>
					<div class="" style="height: 10px;"></div>
						<div class="treeContent">
							<ul id="tree" class="ztree" style="">

							</ul>
						</div>
					<div class="" style="height: 20px;"></div>
				</div>
			</div>
		</div>
		<div class="report-dialog-ask-footer overflow-hidden">

			<button class="public-btn report-dialog-btn btn-cancel floatRight close-dialog-icon close-dialog" >
				<%= i18nString.getString("cancel")%>
			</button>
			<button class="public-btn report-dialog-btn btn-save floatRight close-dialog-icon" id="saveMoveFileBtn">
				<%= i18nString.getString("sure")%>
			</button>
			<div class="floatRight red-font chooseInfor" style="height: 40px;line-height: 40px;"></div>
		</div>
	</div>
</div>

<!--deleteFileDialog  dialog-->
<div class="mask-layout" style="display:none" id="deleteFileDialog">
	<div class="report-dialog-ask">
		<div class="report-dialog-ask-heading">
			<div class="close-dialog-icon icon close-dialog"></div>
		</div>
		<div class="report-dialog-ask-body">
			<div class="report-dialog-ask-body-conent">
				<div class="createDataSourceModel">
					<div class="" style="height: 10px;"></div>
					<p>
						<%=i18nString.getString("isSureDelete")%>？
						<%--<span class="delete-file-name">"Demo-sql-4"</span>--%>
					</p>
					<p class="red-font">
						<%=i18nString.getString("deleteWillNotRetrieve")%>！
					</p>
					<div class="" style="height: 20px;"></div>
				</div>
			</div>
		</div>
		<div class="report-dialog-ask-footer overflow-hidden">
			<button class="public-btn report-dialog-btn btn-cancel floatRight close-dialog-icon close-dialog" >
				<%= i18nString.getString("cancel")%>
			</button>
			<button class="public-btn report-dialog-btn btn-save floatRight close-dialog-icon" id="deleteFileBtn">
				<%= i18nString.getString("sure")%>
			</button>
		</div>
	</div>
</div>


<script type="text/javascript">
	window.CONTEXT_PATH = "${pageContext.request.contextPath}";
 /*   window.MESSAGES_CACHE = {
			createFoldFail:'<%= i18nString.getString("createFoldFail")%>',
			createFoldSuccess:'<%= i18nString.getString("createFoldSuccess")%>',
			moveFail:'<%= i18nString.getString("moveFail")%>',
			moveSuccess:'<%= i18nString.getString("moveSuccess")%>',
			copyFail:'<%= i18nString.getString("copyFail")%>',
			copySuccess:'<%= i18nString.getString("copySuccess")%>',
			deleteFail:'<%= i18nString.getString("deleteFail")%>',
			deleteSuccess:'<%= i18nString.getString("deleteSuccess")%>',
			renameFail:'<%= i18nString.getString("renameFail")%>',
			renameSuccess:'<%= i18nString.getString("renameSuccess")%>',
			copyTo:'<%= i18nString.getString("copyTo")%>',
			moveTo:'<%= i18nString.getString("moveTo")%>',
			programException:'<%= i18nString.getString("programException")%>',
			inputValidateValue:'<%= i18nString.getString("inputValidateValue")%>',
			validateSaveQueryInput:'<%= i18nString.getString("validateSaveQueryInput")%>',
			fileMaxTip:'<%= i18nString.getString("fileMaxTip")%>',
			getFileListFailed:'<%= i18nString.getString("getFileListFailed")%>',
		goToDirectionError:'<%= i18nString.getString("goToDirectionError")%>'
	}*/
	window.onscroll=function(){
		$('.leftBar,.content').height($(window).height()-62);
	}
	window.onresize=function(){
		$('.leftBar,.content').height($(window).height()-62);
	}
</script>

<script src="${pageContext.request.contextPath}/js/common.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/loadingProgress.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ajaxHandler.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/dialogPlug.js"></script>
<script src="${pageContext.request.contextPath}/js/packaging.js"></script><%--分页--%>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/query_mask.js"></script>
<script src="${pageContext.request.contextPath}/js/ztree/jquery.ztree.all.min.js"></script>
<script src="${pageContext.request.contextPath}/js/priestsql-common.js"></script>
<script src="${pageContext.request.contextPath}/js/file/fileMana_content.js"></script>
<script src="${pageContext.request.contextPath}/js/file/fileMana.js"></script>


</body>
</html>


