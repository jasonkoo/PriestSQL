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
                <a class="logo-img" href="${pageContext.request.contextPath}/jobHistory.jsp">
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
        <li><a href="${pageContext.request.contextPath}/jobList.jsp"><span class="icon_job icon_task"></span><%= i18nString.getString("cronJobList")%></a></li>
        <li class="active"><a href="${pageContext.request.contextPath}/jobHistory.jsp"><span class="icon_job icon_history"></span><%= i18nString.getString("cronJobHistory")%></a></li>
    </ul>
    <div class="flex-warp open-flex">
        <div class="flex-icon-open">
        </div>
    </div>
    <div class="content">
        <div class="page-head">
            <%= i18nString.getString("cronJobList")%>
        </div>
        <div class="page-content">
            <div class="cont-area clearfix">
                <div class="col-sm-12">
                    <div class="date2 col-xs-9">
                        <button class="btn-r1 active" v="last30"><span class="lbl"><%= i18nString.getString("jobHistoryChooseTime")%></span><span class="triTop"></span><span class="ard"></span>
                            <div class="dtfs"></div>
                        </button>
                    </div>
                    <div class="form-group col-xs-3">
                        <div class="input-group">
                            <input id="FileFilter" class="form-control" type="text" placeholder="<%= i18nString.getString("jobHistoryKeyword")%>">
                            <div class="input-group-addon btn-search"><span style="color:#4285f5" class="glyphicon glyphicon-search"></span></div>
                        </div>
                    </div>
                </div>
                <div id="table-lst" class="col-xs-12">
                    <table id="job_history" class="table table-bordered table-hover table-condensed">
                        <thead id="job_historyThead">
                        <tr>
                            <th width="5%" data-name="id"><%= i18nString.getString("jobHistoryColNumber")%><span class="triTop"></span><span class="triDown"></span></th>
                            <th width="20%" data-name="name"><%= i18nString.getString("jobHistoryTaskName")%><span class="triTop"></span><span class="triDown"></span></th>
                            <th width="20%"  data-name="startDate"><%= i18nString.getString("jobHistoryStartDate")%><span class="triTop"></span><span class="triDown"></span></th>
                            <th width="20%" data-name="endDate"><%= i18nString.getString("jobHistoryEndDate")%><span class="triTop"></span><span class="triDown"></span></th>
                            <th width="10%" data-name="duration"><%= i18nString.getString("jobHistoryDuration")%><span class="triTop"></span><span class="triDown"></span></th>
                            <th width="10%" data-name="executeState"><%= i18nString.getString("jobHistoryExecuteState")%><span class="triTop"></span><span class="triDown"></span></th>
                            <th><%= i18nString.getString("jobHistoryOperation")%></th>
                        </tr>
                        </thead>
                        <tbody id="job_historyTbody"></tbody>
                    </table>
                    <div id="table-nodata"></div>
                    <div id="job_historyPage" class="tableListPage"></div>
                </div>
            </div>
        </div>
    </div>
</main>





<%--重启定时任务--%>
<div class="mask-layout mask delete-container" style="z-index: 99">
    <div class="delete_box container">
        <div class="row">
            <div class="col-sm-11 col-md-11 col-lg-11">
            </div>
            <div class="col-sm-1 col-md-1 col-lg-1 btn-closed">
                <img src="images/mask/img_all.png" alt="cancel" class="floatRight">
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12 text-center"  style="margin-top: 10%" >
                <p id="executeName"></p>
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
<script src="${pageContext.request.contextPath}/js/packaging.js"></script><%--分页--%>
<script src="${pageContext.request.contextPath}/js/datePicker/ld.js"></script>
<script src="${pageContext.request.contextPath}/js/datePicker/datePicker.js"></script>
<script src="${pageContext.request.contextPath}/js/query_mask.js"></script>
<script src="${pageContext.request.contextPath}/js/job/jobHistory.js"></script>
</body>
</html>

