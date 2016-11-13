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
				<a class="logo-img" href="${pageContext.request.contextPath}/queryBrowser.jsp">
				</a>
			</div>
			<div class="header-right" style="height: 60px;float:right;">
				<div class="header-right-content">

					<%--<div class="header-right-menu header-right-menu-home"><a href="#" class="menu-item" style="float:right;width:70px; border-left: 1px solid #6CBAF7; padding:5px;"><i class="info-icon"></i></a></div>--%>
					<%--<div class="header-right-menu header-right-menu-info"><a href="#" class="menu-item" style="float:right;width:70px;border-left: 1px solid #6CBAF7; padding:5px;"><i class="home-icon"></i></a></div>--%>
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
					<div class="header-right-menu header-right-menu-file"><a href="${pageContext.request.contextPath}/fileMana.jsp" class="menu-item" style="float:right;width:125px;"><%=i18nString.getString("file")%></a></div>
					<div class="header-right-menu header-right-menu-file"><a href="${pageContext.request.contextPath}/jobList.jsp" class="menu-item" style="float:right;width:125px;"><%=i18nString.getString("job")%></a></div>
					<div class="header-right-menu header-right-menu-file"><a href="${pageContext.request.contextPath}/queryBrowser.jsp" class="menu-item menu-item-active" style="float:right;width:125px;"><%=i18nString.getString("query")%></a></div>
				</div>
			</div>
		</div>
	</div>
</header>
<main id="dataMan-body">
	<div class="container-full clearFloat querymainContent" style=" position: relative;overflow: hidden;">
		<div class="dataSourcesOrSetTab">
			<div class="" style="height:10px;">
			</div>
			<div class="queryList historyQuery">
				<i class="historyQuery-icon"></i>
                    <span>
                       <%=i18nString.getString("queryHistory")%>
                    </span>
			</div>
			<div class="queryList savedQuery">
				<i class="savedQuery-icon"></i>
				<%=i18nString.getString("myQuery")%>
			</div>
			<%--<div class="dotted-hr clearFloat"></div>
			<div class="dataSource-search-input">
				<div class="dataSource-search-input-box">
					<input type="text"  class="querySearchInput searchinput dataSearchInput floatLeft" placeholder="搜索">
					<div class="icon floatLeft dataSourceSearch-icon search-inco"></div>
				</div>
			</div>--%>
			<div class="dotted-hr clearFloat"></div>
			<div style="padding:0 20px;margin:10px auto;color:#bababa" class="myDataSources">
				<%=i18nString.getString("mySource")%>
			</div>
			<div class="notHaveDataSource">
				<p class="createDataSource addDataSourcesBtn">
					+ <%= i18nString.getString("addDataSource")%>
				</p>
			</div>
			<div class="connectionsDom">


			</div>

			<div class="addDataSource  addDataSourcesBtn">
				<i class="addSource-icon "></i><%= i18nString.getString("add")%>
			</div>
		</div>
		<div class="flex-warp">
			<div class="flex-icon-open">
			</div>
		</div>
		<div class="queryContent">
			<!--query start-->

			<div class="query-titleand-tab">

				<p class="query-content-title"><%= i18nString.getString("newQuery")%></p>

				<div class="query-content-tab">
					<ul>
						<li class="query-content-li query-tab-active" name="data1" queryIndex="1">
							<span class="run-state-icon sta-not-run"></span><!--green:运行完成的class-->
							<%= i18nString.getString("newQuery")%>1
							<span class="run-close-icon"></span>
						</li>
					</ul>
					<div class="tab-add">+</div>
				</div>
			</div>
			<div class="query-content">
				<div class="">
					<div class="query-content-sql">
						<textarea id="editor" name="editor" placeholder="SELECT * FROM xxx"></textarea>
					</div>

					<div class="query-content-btn"><!--btn-danger: sql正在查询时的class-->
						<button type="button" class="btn btn-sm btn-query btn-success search-cancel queryBtn" name="查询"><%= i18nString.getString("query")%></button>
						<button type="button" class="btn btn-default btn-sm btn-sfj store queryBtn"><%= i18nString.getString("save")%></button>
						<button type="button" class="btn btn-default btn-sm btn-sfj format queryBtn"><%= i18nString.getString("format")%></button>
						<%--<button type="button" class="btn btn-default btn-sm btn-sfj job queryBtn"><%= i18nString.getString("job")%></button>--%>
					</div>
					<!--结果-->
					<div class="line-separ">
						<div class="splitLine" draggable="true">

						</div>
					</div>
					<div class="result-content hidden">
						<!--结果标题-->
						<div class="result-title">
							<div class="float-left result-title-name"><%= i18nString.getString("queryResults")%></div><!-- result-load-icon-ok:Results加载完成过时的class-->
							<div class="float-left result-load-icon result-load-icon-ok"></div>
							<div class="float-left result-load-fail-text"><%= i18nString.getString("resultFail")%></div>
							<div class="float-left result-load-time">
								<span class="result-load-startTime"></span>
								<span class="search-time-text"><%= i18nString.getString("searchTime")%></span>
								<span class="result-load-endTime" id="endTime1"></span>
								<span class="search-time-S"><%= i18nString.getString("searchTimeSecond")%></span>
							</div>
							<div class="log-container">
								<div class="float-left result-load-icon to-log"></div>
								<div class="float-left to-log-text"><%= i18nString.getString("log")%></div>
							</div>
							<div class="download-btn hidden">
								<button type="button" class="float-right btn btn-default btn-sm btn-sfj downloadAll" id="downAllLoad-btn" data-type="0"><%= i18nString.getString("downloadAll")%></button>
								<button type="button" class="float-right btn btn-default btn-sm btn-sfj download" id="downLoad-btn" data-type="1"><%= i18nString.getString("download")%></button>
							</div>
						</div>
						<!--日志-->
						<div class="log-substance-container">
                                <pre class="log-substance">
                                </pre>
						</div>

					</div>
					<!--左侧预览数据-->
					<div>
						<div class="left-data-title"></div>
						<div class="result-table-container logCon" id="ResultCon">
							<div id="ResultTip" class="resultLoading" style="display:none;"><%=i18nString.getString("running")%>...</div>
							<div id="ResultWrap">
								<div class="table-responsive resultTable" id="ResultTable">
									<table class="table table-bordered table-hover table-condensed">
										<thead id="ResultListHeader"></thead>
											<tbody id="ResultList"></tbody>
									</table>
								</div>
								<div id="ResultListPage" class="tableListPage"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--query end-->
		</div>
	</div>


	<!--add DataSources-->
	<div class="mask-layout" style="display:none" id="addDataSourceDialog">
		<div class="report-dialog-ask" >
				<div class="report-dialog-ask-heading">
					<div class="close-dialog-icon icon"></div>
				</div>
			<form id="dialogForm" action="#">
				<div class="report-dialog-ask-body">
					<div class="report-dialog-ask-body-conent">
						<div class="createDataSourceModel">
							<div class='dialog-body-header'><%= i18nString.getString("addDataSource")%></div>
							<div style="height:10px;"></div>
							<p><span class="form-input-name"><span class="red-font">*</span><%= i18nString.getString("connectionName")%>:</span><input type="text" class="form-input" name='connectName' id="connectName" autofocus="autofocus"/></p>
							<p><span class="form-input-name"><span class="red-font">*</span><%= i18nString.getString("connectionType")%>:</span><select class="form-input"  name='connectType' id="connectType">
								<option value="mysql">mysql</option>
								<option value="impala">impala</option>
								<option value="spark">spark</option>
								<option value="hive">hive</option>
								<option value="postgresql">postgresql</option>
							</select>
							</p>
							<p><span class="form-input-name"><span class="red-font">*</span><%= i18nString.getString("connectionURL")%>:</span><input type="text" class="form-input" name='connectUrl' id="connectUrl" required/></p>
							<%--<p><span class="form-input-name"><span class="red-font">*</span><%= i18nString.getString("connectionDriver")%>:</span><input type="text" class="form-input"  name='connectDriver' id="connectDriver" required/></p>--%>
							<p><span class="form-input-name"><span class="red-font username-must">*</span><%= i18nString.getString("username")%>:</span><input type="text" class="form-input" name='connectUser' id="connectUser"/></p>
							<p><span class="form-input-name"><span class="red-font username-must">*</span><%= i18nString.getString("password")%>:</span><input type="password" class="form-input" name='connectPwd' id="connectPwd"/></p>
							<%--<div class=""><label class="form-input-name">是否公开</label><div class="col-sm-9"><span class="radio" style="display: inline-block; margin-right: 20px;"><label><input type="radio" name="optionsRadios" id="optionsRadios1" value="all" checked="">公开</label></span><span class="radio" style="display: inline-block; margin-right: 20px;"><label><input type="radio" name="optionsRadios" id="optionsRadios2" value="own">不公开</label></span></div></div>--%>
							<p><span class="form-input-name"><span class="red-font">*</span><%= i18nString.getString("whetherOpen")%>:</span><span style="width:200px;display: inline-block;text-align: left"><input type="radio" class="radio_style" id="open" name="isOpen" value="all" checked /><label for="open"><%= i18nString.getString("Open")%></label><input type="radio"  class="radio_style" name="isOpen" id="private" value="own"/><label for="private"><%= i18nString.getString("private")%></label></span><span style="width:100px;display: inline-block;"></span></p>
							<div style="min-height: 20px;" class="checkConnectionInf">
							</div>
						</div>
					</div>
				</div>
			</form>
				<div class="report-dialog-ask-footer overflow-hidden">
					<button class="public-btn report-dialog-btn btn-cancel floatLeft" id="checkConnection">
						<%= i18nString.getString("connectionTest")%>
					</button>
					<button class="public-btn report-dialog-btn btn-cancel floatRight close-dialog-icon close-dialog" type="button">
						<%= i18nString.getString("cancel")%>
					</button>
					<button class="public-btn report-dialog-btn btn-save floatRight" id="saveDataSource">
						<%= i18nString.getString("save")%>
					</button>
				</div>
		</div>
	</div>

	<%--history dialog--%>
    <%@include file="query_mask.jsp"%>
	<%--history dialog--%>

	<!--saveQuery information dialog-->
	<div class="mask-layout" style="display:none" id="saveQueryDialog">
		<div class="report-dialog-ask">
			<div class="report-dialog-ask-heading">
				<div class="close-dialog-icon icon"></div>
			</div>
			<div class="report-dialog-ask-body">
				<div class="report-dialog-ask-body-conent">
					<div class="createDataSourceModel">
						<div class="" style="height: 30px;"></div>
						<%--<div class='dialog-body-header'><%= i18nString.getString("saveQuery")%></div>--%>
						<p class="saveQuerySql"><span class="form-input-name" style="width:100px;"><%= i18nString.getString("fileName")%>:</span>
							<input type="text" class="form-input" name='queryName' id="queryName" maxlength="20" autofocus="autofocus"/></p>
						<p class="red-font saveQuery-info"></p>
						<div class="" style="height: 30px;"></div>
					</div>
				</div>
			</div>
			<div class="report-dialog-ask-footer overflow-hidden">
				<button class="public-btn report-dialog-btn btn-cancel floatRight close-dialog-icon close-dialog" >
					<%= i18nString.getString("cancel")%>
				</button>
				<button class="public-btn report-dialog-btn btn-save floatRight" id="saveQueryBtn">
					<%= i18nString.getString("save")%>
				</button>
			</div>
		</div>
	</div>
	<!--窗口数量超限提示-->
	<div class="mask-layout" style="display:none" id="tabNumMax">
		<div class="report-dialog-ask">
			<div class="report-dialog-ask-heading">
				<div class="close-dialog-icon icon"></div>
			</div>
			<div class="report-dialog-ask-body">
				<div class="report-dialog-ask-body-conent">
					<div class="createDataSourceModel">
						<div class='dialog-body-header'></div>
						<p>
							<%= i18nString.getString("tabNumMaxTip")%>
						</p>
					</div>
				</div>
			</div>
			<div class="report-dialog-ask-footer overflow-hidden">
				<button class="public-btn report-dialog-btn btn-save floatRight  close-dialog-icon" >
					<%= i18nString.getString("tabNumMaxConfirm")%>
				</button>

			</div>
		</div>
	</div>

</main>
<script type="text/javascript">
	window.CONTEXT_PATH = "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/js/common.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ajaxHandler.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/dialogPlug.js"></script>
<script src="${pageContext.request.contextPath}/js/priestsql-common.js"></script>
<script src="${pageContext.request.contextPath}/js/CodeMirror-master/lib/codemirror.js"></script>
<script src="${pageContext.request.contextPath}/js/CodeMirror-master/addon/display/placeholder.js"></script>
<script src="${pageContext.request.contextPath}/js/CodeMirror-master/addon/hint/show-hint.js"></script>
<script src="${pageContext.request.contextPath}/js/CodeMirror-master/addon/hint/sql-hint.js"></script>
<script src="${pageContext.request.contextPath}/js/CodeMirror-master/mode/sql/sql.js"></script>
<script src="${pageContext.request.contextPath}/js/packaging.js"></script><%--分页--%>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/query_mask.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/queryBrowser.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.validate.js"></script>
</body>
</html>


