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
    <link href="${pageContext.request.contextPath}/css/main.css" rel="stylesheet"/>
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
                <a class="logo-img" href="${pageContext.request.contextPath}/jobList.jsp">
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
                    <div class="header-right-menu header-right-menu-file"><a href="${pageContext.request.contextPath}/fileMana.jsp" class="menu-item" style="float:right;width:125px;"><%=i18nString.getString("file")%></a></div>
                    <div class="header-right-menu header-right-menu-file"><a href="${pageContext.request.contextPath}/jobList.jsp" class="menu-item  menu-item-active" style="float:right;width:125px;"><%=i18nString.getString("job")%></a></div>
                    <div class="header-right-menu header-right-menu-file"><a href="${pageContext.request.contextPath}/queryBrowser.jsp" class="menu-item" style="float:right;width:125px;"><%=i18nString.getString("query")%></a></div>
                </div>
            </div>
        </div>
    </div>
</header>

<main class="main-body">
    <ul class="leftBar">
        <li class="active"><a href="${pageContext.request.contextPath}/jobList.jsp"><span class="icon_job icon_task"></span><%= i18nString.getString("cronJobList")%></a></li>
        <li><a href="${pageContext.request.contextPath}/jobHistory.jsp"><span class="icon_job icon_history"></span><%= i18nString.getString("cronJobHistory")%></a></li>
    </ul>
    <div class="flex-warp open-flex">
        <div class="flex-icon-open">
        </div>
    </div>
    <div class="content">
        <div class="list">
            <div class="page-head">
                <%= i18nString.getString("cronJobList")%>
            </div>
            <div class="page-content">
                <div class="cont-area clearfix">
                    <div class="col-xs-12">
                        <div class="toolbar col-xs-9">
                            <a class="btn btn-success btn-addJob" href="javascript:;"><span class="glyphicon glyphicon-plus"></span> <%= i18nString.getString("crateJob")%></a>
                        </div>
                        <div class="form-group col-xs-3">
                            <div class="input-group">
                                <input id="FileFilter" class="form-control" type="text" placeholder="<%= i18nString.getString("searchJob")%>">
                                <div class="input-group-addon btn-search"><span style="color:#4285f5" class="glyphicon glyphicon-search"></span></div>
                            </div>
                        </div>

                    </div>
                    <div id="table-lst" class="col-xs-12">
                        <table class="table table-bordered table-hover table-condensed">
                            <thead>
                            <tr>
                                <th data-name="id"><%= i18nString.getString("serialNumber")%><span class="triTop"></span><span class="triDown"></span></th>
                                <th data-name="owner"><%= i18nString.getString("createPerson")%><span class="triTop"></span><span class="triDown"></span></th>
                                <th data-name="name"><%= i18nString.getString("taskName")%><span class="triTop"></span><span class="triDown"></span></th>
                                <th data-name="execution"><%= i18nString.getString("nextExecutionTime")%><span class="triTop"></span><span class="triDown"></span></th>
                                <th data-name="executePeriod"><%= i18nString.getString("schedulingStrategy")%><span class="triTop"></span><span class="triDown"></span></th>
                                <th data-name="disable"><%= i18nString.getString("state")%><span class="triTop"></span><span class="triDown"></span></th>
                                <th><%= i18nString.getString("operation")%></th>
                                <th><%= i18nString.getString("executionHistory")%></th>
                            </tr>
                            </thead>
                            <tbody id="job_ListTbody">
                            </tbody>
                        </table>
                        <div id="table-nodata"></div>
                        <div id="job_ListPage" class="tableListPage"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="edit" style="display: none">
            <div class="page-head">
                <%= i18nString.getString("cronJobList")%> >> <span class="edit-type"><%= i18nString.getString("crateJob")%></span>
            </div>
            <div class="page-content">
                <div class="cont-area">
                    <div class="page-header">
                        <h4><%= i18nString.getString("cronCrateJob")%></h4>
                    </div>
                    <div id="dispatch_form" class="form-horizontal">
                        <input type="text" name="id" class="form-control hide" id="jobId">
                        <div class="form-group">
                            <label class="col-sm-2 control-label required"><%= i18nString.getString("jobName")%>：</label>
                            <div class="col-sm-10">
                                <input type="text" name="taskName" class="form-control required" id="jobName" maxlength="30">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label required"><%= i18nString.getString("sqlConnections")%>：</label>
                            <div class="col-sm-10">
                                <select class="form-control" name="connection" id="selectConnections"></select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label required"><%= i18nString.getString("sqlDatabase")%>：</label>
                            <div class="col-sm-10">
                                <select class="form-control" name="database" id="selectDatabase"></select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label required"><%= i18nString.getString("sqlSentence")%>：</label>
                            <div class="col-sm-10">
                                <textarea name="editor" id="editor" placeholder="INSERT OVERWRITE TABLE tmp_table_name PARTITION
(part)SELECT * FROM table_name LIMIT 1;"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label required"><%= i18nString.getString("schedulingCycle")%>：</label>
                            <div class="col-sm-10">
                                <select id="cycle" class="form-control">
                                    <option value="按小时调度" selected="selected"><%= i18nString.getString("hourCycle")%></option>
                                    <option value="按天调度"><%= i18nString.getString("dayCycle")%></option>
                                    <option value="按周调度"><%= i18nString.getString("weekCycle")%></option>
                                    <option value="按月调度"><%= i18nString.getString("monthCycle")%></option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group hour">
                            <label class="col-sm-2 control-label required"><%= i18nString.getString("hourImplement")%>：</label>
                            <div class="col-sm-10">
                                <select class="form-control" id="selectMinutes"></select><%= i18nString.getString("minuteImplement")%>
                            </div>
                        </div>
                        <div class="form-group day" style="display:none">
                            <label class="col-sm-2 control-label required"><%= i18nString.getString("dayImplement")%>：</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control required time" readonly="readonly">
                            </div>
                        </div>
                        <div class="form-group week" style="display:none">
                            <label class="col-sm-2 control-label required"><%= i18nString.getString("weekImplement")%>：</label>
                            <div class="col-sm-10">
                                <div class="day-lst">
                                    <label for="day1"><input type="checkbox" value="2" id="day1"><%= i18nString.getString("monday")%></label>
                                    <label for="day2"><input type="checkbox" value="3" id="day2"><%= i18nString.getString("tuesday")%></label>
                                    <label for="day3"><input type="checkbox" value="4" id="day3"><%= i18nString.getString("wednesday")%></label>
                                    <label for="day4"><input type="checkbox" value="5" id="day4"><%= i18nString.getString("thursday")%></label>
                                    <label for="day5"><input type="checkbox" value="6" id="day5"><%= i18nString.getString("friday")%></label>
                                    <label for="day6"><input type="checkbox" value="7" id="day6"><%= i18nString.getString("saturday")%></label>
                                    <label for="day7"><input type="checkbox" value="1" id="day7"><%= i18nString.getString("sunday")%></label>
                                </div>
                                <input type="text" class="form-control required time" readonly="readonly">
                            </div>
                        </div>
                        <div class="form-group month" style="display:none">
                            <label class="col-sm-2 control-label required"><%= i18nString.getString("monthImplement")%>：</label>
                            <div class="col-sm-10">
                                <select class="form-control" id="selectDay" style="margin-bottom: 20px"></select><%= i18nString.getString("numberImplement")%>
                                <input type="text" class="form-control required time" readonly="readonly">
                            </div>
                        </div>
                        <div class="form-group hide">
                            <input type="text" class="form-control" name="Param_cron" id="Param_cron">
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label"><%= i18nString.getString("describe")%>：</label>
                            <div class="col-sm-10">
                                <textarea class="form-control" id='describe' name="describe" maxlength="200" rows="5"></textarea>
                                <span id="entered">0</span>/<span id="counter">200</span>
                            </div>
                        </div>
                        <div class="form-group form-tool">
                            <label class="col-sm-2 control-label"></label>
                            <div class="col-sm-10">
                                <button type="button" class="btn btn-success" id="btn_save"><span class="glyphicon glyphicon-floppy-save"></span> <%= i18nString.getString("save")%></button>
                                <button type="button" class="btn btn-success" id="btn_update" style="display:none"><span class="glyphicon glyphicon-floppy-save"></span> <%= i18nString.getString("save")%></button>
                                <button type="button" class="btn btn-default" id="btn_cancel"><span class="glyphicon glyphicon-log-out"></span> <%= i18nString.getString("cancel")%></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</main>





<%--删除定时任务--%>
<div class="mask-layout mask delete-container" style="z-index: 99">
    <div class="delete_box container">
        <div class="row">
            <div class="col-sm-11 col-md-11 col-lg-11">
            </div>
            <div class="col-sm-1 col-md-1 col-lg-1 btn-closed">
                <img src="images/mask/img_all.png" alt="cancel" class="floatRight">
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12 text-center"  style="margin-top: 10%" >
                <p><%=i18nString.getString("isSureDelete")%> "<span class="jobName">priest Demo_02</span>"?</p>
                <p class="warn"><%=i18nString.getString("deleteWillNotRetrieve")%>！</p>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12 btn_group">
                <div class="col-sm-7 col-md-7 col-lg-7"></div>
                <div class="col-sm-5 col-md-5 col-lg-5">
                    <button class="public-btn report-dialog-btn btn-save btn-confirm"><%=i18nString.getString("sure")%></button>
                    <button class="public-btn report-dialog-btn btn-cancel"><%=i18nString.getString("cancel")%></button>
                </div>
            </div>
        </div>
    </div>
</div>
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
<script src="${pageContext.request.contextPath}/js/editor.js"></script>
<script src="${pageContext.request.contextPath}/js/packaging.js"></script><%--分页--%>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/query_mask.js"></script><%--遮罩--%>
<script src="${pageContext.request.contextPath}/js/job/jobList.js"></script>
</body>
</html>

