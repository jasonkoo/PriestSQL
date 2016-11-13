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
<title>Priest SQL</title>
<script type="text/javascript">
window.Language = "<%=langType%>";
</script>
<link rel="stylesheet" href="css/common.min.css?2016060201">
<link rel="stylesheet" href="css/zTreeStyle.css?20160518">

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
<script src="libs/ie/ie8-responsive-file-warning.js"></script>
<script src="libs/html5shiv/html5shiv.min.js"></script>
<![endif]-->
</head>
<body>
<nav class="navbar navbar-inverse">
	<div class="container">
		<div class="navbar-header">
			<a class="navbar-brand" href="index.jsp"><img src="images/logo.png"></a>
		</div>
		<div id="navbar" class="navbar-collapse collapse">
			<ul class="nav navbar-nav">
				<li style="margin-right: 10px;font-size: 18px;"><a href="http://priest.lenovo.com"><span class="glyphicon glyphicon-home"></span></a></li>
				<li><a href="index.jsp">Query</a></li>
				<li class="active"><a href="fileBrowser.jsp">File Browser</a></li>
				<li><a href="jobBrowser.jsp">Job Browser</a></li>
			</ul>

			<ul class="nav navbar-nav navbar-right">
				<li class="dropdown" id="DropdownUser">
	              <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
	              	<span id="UserSel"></span> <span class="caret"></span>
	              </a>
	              <div class="dropdown-menu" id="UserList"></div>
	            </li>
				<li><a href="javascript:;" class="userName"><i class="glyphicon glyphicon-user"></i> <span id="UserName">${username}</span></a></li>
				
				<li class="dropdown">
					<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
						<%if("zh".equals(langType)){ %>中文(简体)<%}else{%>English<%} %>
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu langList" id="LanguageChange">
						<li><a href="javascript:;" data-type="zh">中文(简体)</a></li>
						<li><a href="javascript:;" data-type="en">English</a></li>
					</ul>
				</li>

				<li>
					<a href="javascript:;" class="logout" id="Logout" title="<%=i18nString.getString("logout")%>">
						<span class="glyphicon glyphicon-off"></span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>

<div class="container mainCon">
	<div class="fileBreadcrumb">
		<ol class="breadcrumb" id="Breadcrumb">
		  <li><a href="fileList"><i class="fa fa-home" aria-hidden="true"></i> Home</a></li>
		</ol>
		
		<div class="fileFilter">
			<input type="text" class="form-control" id="FileFilter" placeholder="<%=i18nString.getString("fileSearchTip")%>" style="margin-left: 0px;">
			<input type="text" class="form-control filePathSearch" id="FilePathSearch" placeholder="<%=i18nString.getString("pathTip")%>" style="margin-left: 30px;">
			<a href="javascript:;" class="btn btn-default btn-sm filePathGo" id="FilePathGo"><%=i18nString.getString("goto")%></a>
		</div>
		<div class="fileOpts" id="FileOpts">
			<a href="javascript:;" class="btn btn-default btn-sm btnOpt hidden" data-type="move"><i class="fa fa-random"></i> <%=i18nString.getString("move")%></a>
			<a href="javascript:;" class="btn btn-default btn-sm btnOpt hidden" data-type="rename"><i class="fa fa-font"></i> <%=i18nString.getString("rename")%></a>
			<a href="javascript:;" class="btn btn-default btn-sm btnOpt btnDownload hidden" data-type="download"><i class="fa fa-download" aria-hidden="true"></i> <%=i18nString.getString("download")%></a>
			<a href="javascript:;" class="btn btn-default btn-sm btnOpt hidden" data-type="del"><i class="fa fa-trash-o"></i> <%=i18nString.getString("delete")%></a>
			
			<a href="javascript:;" class="btn btn-default btn-sm btnNew btnNewFile hidden" data-type="file"><i class="fa fa-file-o"></i> <%=i18nString.getString("newFile")%></a>
			<a href="javascript:;" class="btn btn-default btn-sm btnNew hidden" data-type="fold"><i class="fa fa-folder-o"></i> <%=i18nString.getString("newFold")%></a>
		</div>
	</div>
	<div class="row" id="FileBrowser">
		<div class="fileBrowser">
			<table class="table table-hover"> 
				<thead> 
					<tr> 
						<th width="5%"></th>
						<th width="28%"><%=i18nString.getString("name")%></th> 
						<th width="15%"><%=i18nString.getString("size")%></th> 
						<th width="12%"><%=i18nString.getString("user")%></th> 
						<th width="10%"><%=i18nString.getString("group")%></th> 
						<th width="10%"><%=i18nString.getString("permission")%></th> 
						<th width="20%"><%=i18nString.getString("date")%></th> 
					</tr> 
				</thead> 
			</table>
			
			<div class="fileListTable">
				<table class="table table-hover"> 
					<tbody id="FileList"></tbody> 
				</table>
			</div>
		</div>
		<div class="tipNull hidden" id="TipNull"><i class="fa fa-exclamation-triangle"></i> <%=i18nString.getString("fileNullTip")%>!</div>
		<div id="FileListPage" class="tableListPage fileListPage"></div>
	</div>
	
	<div class="row" id="FileDetail" style="display: none;">
		<div class="col-md-3 menuLeft">
			<div class="panel panel-default">
				<div class="panel-heading"><i class="fa fa-info-circle"></i><%=i18nString.getString("info")%></div>
				<div class="list-group list-group-info">
					<div class="list-group-item">
						<p class="infoText"><label><%=i18nString.getString("size")%>：</label><span id="Info_0"></span></p>
					</div>
					<div class="list-group-item">
						<p class="infoText"><label><%=i18nString.getString("user")%>：</label><span id="Info_1"></span></p>
					</div>
					<div class="list-group-item">
						<p class="infoText"><label><%=i18nString.getString("group")%>：</label><span id="Info_2"></span></p>
					</div>
					<div class="list-group-item">
						<p class="infoText"><label><%=i18nString.getString("permission")%>：</label><span id="Info_3"></span></p>
					</div>
					<div class="list-group-item">
						<p class="infoText"><label><%=i18nString.getString("modification")%>：</label><span id="Info_4"></span></p>
					</div>
				</div>
			</div>
		</div>
		

		<div class="col-md-9 rightCon">
			<div class="panel panel-default">
				<div class="panel-heading"><i class="fa fa-file-text-o"></i>&nbsp;<%=i18nString.getString("fileCon")%>
					<div class="fileDetailOpts">
						<span><%=i18nString.getString("encoding")%>：</span>
						<label class="radio-inline">
							<input type="radio" name="charsetRadio" id="charsetRadio1" value="UTF-8" checked> UTF-8
						</label>
						<label class="radio-inline">
							<input type="radio" name="charsetRadio" id="charsetRadio2" value="GBK"> GBK
						</label>
						
						<a href="javascript:;" class="btn btn-default btn-xs hidden" id="DownloadFile"><i class="fa fa-download" aria-hidden="true"></i> <%=i18nString.getString("download")%></a>
					</div>
				</div>
				<div class="panel-body">
					<div class="detailCon" id="FileDetailCon"></div>
					<div id="FileDetailPage" class="tableListPage"></div>
				</div>
			</div>
		</div>
	</div>
	
</div>

<script src="js/jquery-1.12.0.min.js"></script>
<script src="js/editor.min.js?20160518"></script>
<script src="js/common.min.js?20160816"></script>
<script src="js/jquery.ztree.core.js?20160518"></script>
<script src="js/fileBrowser.min.js?20160816"></script>

</body>
</html>