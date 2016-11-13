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
<title>PriestSQL Hue</title>
<script type="text/javascript">
window.Language = "<%=langType%>";
</script>
<link rel="stylesheet" href="css/common.min.css?20160616">

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
				<li style="margin-right: 10px;font-size: 18px;"><a href="http://priest.lenovo.com"><span class="glyphicon glyphicon-home" aria-hidden="true"></span></a></li>
				<li><a href="index.jsp">Query</a></li>
				<li><a href="fileBrowser.jsp">File Browser</a></li>
				<li class="active"><a href="jobBrowser.jsp">Job Browser</a></li>
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
						<span class="glyphicon glyphicon-off" aria-hidden="true"></span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>

<div class="container mainCon">
	<div class="fileBreadcrumb">
		<div class="fileFilter">
			<%=i18nString.getString("nameSearch")%>：<input type="text" class="form-control filePathSearch" id="FileFilter" placeholder="<%=i18nString.getString("name")%>" style="margin-left: 0">
		</div>
		<div style="float: right; margin-top: 4px; margin-right: 10px;" id="FileOpts">
			<div style="float: left; line-height: 30px;"><%=i18nString.getString("runStatus")%>：</div>
			<div class="btn-group btn-group-sm">
				<a href="javascript:;" class="btn btn-default btn-success" data-type="FINISHED"><%=i18nString.getString("success")%></a>
				<a href="javascript:;" class="btn btn-default btn-info" data-type="RUNNING"><%=i18nString.getString("running")%></a>
				<a href="javascript:;" class="btn btn-default btn-danger" data-type="FAILED"><%=i18nString.getString("failed")%></a>
				<a href="javascript:;" class="btn btn-default btn-warning" data-type="KILLED"><%=i18nString.getString("killed")%></a>
			</div>
		</div>
	</div>
	<div class="row" id="FileBrowser">
		<div class="fileBrowser jobListTable">
			<table class="table table-hover"> 
				<thead> 
					<tr> 
						<th width="15%">ID</th>
						<th width="18%"><%=i18nString.getString("name")%></th> 
						<th width="10%"><%=i18nString.getString("type")%></th> 
						<th width="8%"><%=i18nString.getString("status")%></th> 
						<th width="7%"><%=i18nString.getString("process")%></th> 
						<th width="8%"><%=i18nString.getString("queue")%></th> 
						<th width="8%"><%=i18nString.getString("runTime")%></th> 
						<th width="8%"><%=i18nString.getString("startTime")%></th> 
						<th width="8%"><%=i18nString.getString("endTime")%></th> 
						<th width="10%"><%=i18nString.getString("option")%></th> 
					</tr> 
				</thead> 
			</table>
			
			<div class="fileListTable jobs">
				<table class="table table-hover"> 
					<tbody id="FileList"></tbody> 
				</table>
			</div>
		</div>
		<div class="tipNull hidden" id="TipNull"><i class="fa fa-exclamation-triangle"></i> <%=i18nString.getString("jobNullTip")%>！</div>
		<div id="FileListPage" class="tableListPage fileListPage"></div>
	</div>
</div>

<script src="js/jquery-1.12.0.min.js"></script>
<script src="js/common.min.js?20160518"></script>
<script src="js/jobBrowser.min.js?20160630"></script>
</body>
</html>