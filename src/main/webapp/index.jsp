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
<link rel="stylesheet" href="css/common.min.css?20160630">

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
				<li class="active"><a href="index.jsp">Query</a></li>
				<li><a href="fileBrowser.jsp">File Browser</a></li>
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
	<div class="row">
		<div class="col-md-3 menuLeft">
			<div class="panel panel-default">
				<div class="panel-heading">
					<i class="fa fa-database"></i>数据
					<a href="javascript:;" style="float: right; line-height:20px; font-size: 12px;" id="AddConn"><i class="fa fa-plus"></i>添加连接</a>
				</div>
				<div class="panel-body leftBody">
					
					<div class="form-group"> 
						<label for="exampleInputEmail1">连接：</label> 
						<div id="ConnectChosen" style="margin-bottom: 15px;"></div>
					</div>
					
					<div class="form-group"> 
						<label for="exampleInputEmail1">数据库：</label> 
						<div id="DatabaseChosen"></div>
					</div>
					
					<div class="form-group"> 
						<label for="exampleInputEmail1">表：</label>
						
						<div class="tableWrap">
							<input type="text" class="form-control tableSearch hidden" id="TableKeyword" placeholder="Table Search...">
							<ul class="tableList listTable" id="TableList"></ul>
							<div id="TableListPage" class="tableListPage"></div>
						</div>
					</div>
				</div>
			</div>
			
			<div class="panel panel-default">
				<div class="panel-heading"><i class="fa fa-file-code-o"></i> <%=i18nString.getString("myQuery")%></div>
				<div class="panel-body leftBody">
					<ul class="tableList queryList" id="QueryList"></ul>
					<div id="QueryListPage" class="tableListPage"></div>
				</div>
			</div>
			
		</div>

		<div class="col-md-9 rightCon">
			<div class="panel panel-default">
				<div class="panel-heading"><%=i18nString.getString("queryEditor")%></div>
				<div class="editOpts" id="EditOpts">
					<ul>
						<li><a href="javascript:;" class="btSave"><i class="fa fa-floppy-o"></i><%=i18nString.getString("save")%></a></li>
						<li><a href="javascript:;" class="btFormat"><i class="fa fa-indent"></i><%=i18nString.getString("format")%></a></li>
						<li><a href="javascript:;" class="btRun btRunSpark"><i class="fa fa-play"></i><%=i18nString.getString("runSpark")%></a></li>
						<li><a href="javascript:;" class="btStop hidden"><i class="fa fa-stop"></i><%=i18nString.getString("stop")%></a></li>
					</ul>
					<div class="helps">
						<span class="tips">
							<span class="glyphicon glyphicon-exclamation-sign"></span> <%=i18nString.getString("queryTipTxt")%>
						</span>
						<a href="document/notice-for-use-new-hue.pdf" class="docs" target="_blank">
							<span class="glyphicon glyphicon-book"></span> <%=i18nString.getString("queryTip")%>
						</a>
					</div>
				</div>
				
				<div class="cTabs">
					<ul id="EditTable">
						<li class="cTab active" data-target="#Page1"><span><%=i18nString.getString("newQuery")%>1</span>
							<button type="button" class="closeTab">×</button>
						</li>
					</ul>
					<a href="javascript:;" class="addTab" id="AddTab" data-index="1">+</a>
				</div>
				<div class="cTab-content">
					<div class="cTab-pane active" id="Page1">
						<textarea class="codeSql" id="CodeSql_1" name="code" placeholder="<%=i18nString.getString("editorPlaceholder")%>"></textarea>
						<div class="runBtn btn-group-sm">
							<button type="button" class="btn btn-primary btnRun" data-index="1" data-code="CodeSql_1">执行</button>
							<button type="button" class="btn btn-primary btnSave" data-index="1" data-code="CodeSql_1">保存</button>
							<button type="button" class="btn btn-primary btnStop" data-index="1" data-code="CodeSql_1">停止</button>
						</div>
					</div>
				</div>
			</div>

			<div class="alert alert-info" role="alert">
				<%=i18nString.getString("status1")%>: <span class="label label-primary" id="InfoRunning">--</span> <%=i18nString.getString("status2")%>，
				<span class="label label-primary" id="InfoQueue">--</span> <%=i18nString.getString("status3")%>。
			</div>

			<ul class="nav nav-tabs" id="ResultTab">
				<li data-toggle="tab" data-target="#LogCon" class="active"><a href="javascript:;"><%=i18nString.getString("queryLogs")%></a></li>
				<li data-toggle="tab" data-target="#ResultCon"><a href="javascript:;"><%=i18nString.getString("queryResult")%></a></li>
				<li data-toggle="tab" data-target="#HistoryCon"><a href="javascript:;"><%=i18nString.getString("queryHistory")%></a></li>
			</ul>
			<div class="exportWrap hidden" id="ExportWrap">
				<div id="ExportAllDataTip" class="exportAllDataTip hidden"><span class="glyphicon glyphicon-exclamation-sign"></span> <%=i18nString.getString("downloadTip")%>！</div>
				<div class="btn-group btn-group-sm btnGroupExport" id="BtnGroupExport">
					<button type="button" class="btn btn-default" id="BtnExport"><%=i18nString.getString("exportResult")%></button>
					<button type="button" class="btn btn-default" id="BtnExportAll"><%=i18nString.getString("downloadAll")%><i class="fa fa-spinner fa-pulse hidden" id="DownloadLoading"></i></button>
				</div>
			</div>

			<div class="tab-content">
				<div class="tab-pane logCon active" id="LogCon">
				</div>
				<div class="tab-pane logCon" id="ResultCon">
					<div id="ResultTip" class="resultLoading" style="display:none;"><%=i18nString.getString("running")%>...</div>

					<div id="ResultWrap">
						<div class="table-responsive resultTable" id="ResultTable">
							<table class="table table-hover">
								<thead id="ResultListHeader"></thead>
								<tbody id="ResultList"></tbody>
							</table>
						</div>
						<div id="ResultListPage" class="tableListPage"></div>
					</div>
				</div>
				
				<div class="tab-pane logCon" id="HistoryCon">
					<div class="table-responsive">
						<table class="table table-hover">
							<thead><th><%=i18nString.getString("time")%></th><th>SQL</th><th><%=i18nString.getString("type")%></th><th><%=i18nString.getString("status")%></th><th><%=i18nString.getString("result")%></th></thead>
							<tbody id="HistoryList"></tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script src="js/jquery-1.12.0.min.js"></script>
<script src="js/editor.min.js?20160518"></script>
<script src="js/common.min.js?20160816"></script>
<script src="js/index.min.js?20160816"></script>

</body>
</html>
