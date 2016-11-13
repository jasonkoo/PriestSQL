<%@ page language="java" contentType="text/html; charset=utf-8"  pageEncoding="utf-8"%>
<%--历史记录--%>
<div class="mask-layout mask history_container">
    <div class="col-sm-4 col-md-4 col-lg-4" style="width: 300px"></div>
    <div class="content">
        <div class="table_container">
            <div class="row">
                <div class="col-sm-11 col-md-11 col-lg-11">
                    <div class="item-head">
                        <div class="item-head-blue"></div>
                        <div class="item-head-body"><%=i18nString.getString("queryHistory")%></div>
                    </div>
                </div>
                <div class="col-sm-1 col-md-1 col-lg-1 btn-closed">
                    <img src="images/mask/img_all.png" alt="cancel" class="floatRight" style="margin-right:20px">
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12 table_div">
                    <div class="table-responsive resultTable">
                        <table class="table table-bordered table-hover table-condensed">
                            <thead>
                            <tr>
                                <th><%=i18nString.getString("history")%></th>
                                <th><%=i18nString.getString("startTime")%></th>
                                <th><%=i18nString.getString("duration")%></th>
                                <th><%=i18nString.getString("operation")%></th>
                            </tr>
                            </thead>
                            <tbody id="HistoryList">

                            </tbody>
                        </table>
                    </div>
                    <div id="ResultListPage" class="tableListPage"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<%--删除sql--%>

<div class="mask-layout mask delete-container" style="z-index: 99">
    <div class="delete_box container">
        <div class="row">
            <div class="col-sm-11 col-md-11 col-lg-11">
            </div>
            <div class="col-sm-1 col-md-1 col-lg-1 btn-closed">
                <img src="images/mask/img_all.png" alt="cancel" class="floatRight">
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12 text-center"  style="margin-top: 10%" >
                <p><%=i18nString.getString("isSureDelete")%>？</p>
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

<%-- 我的查询 --%>
<div class="mask-layout mask myQuery_container">
    <div class="col-sm-4 col-md-4 col-lg-4" style="width: 300px"></div>
    <div class="content">
        <div class="table_container">
            <div class="row">
                <div class="col-sm-11 col-md-11 col-lg-11">
                    <div class="item-head">
                        <div class="item-head-blue"></div>
                        <div class="item-head-body"><%=i18nString.getString("myQuery")%></div>
                    </div>
                </div>
                <div class="col-sm-1 col-md-1 col-lg-1 btn-closed">
                    <img src="images/mask/img_all.png" alt="cancel" class="floatRight" style="margin-right:20px">
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12 table_div">
                    <div class="table-responsive resultTable">
                        <table class="table table-bordered table-hover table-condensed">
                            <thead>
                            <tr>
                                <th style="text-align: center"><%=i18nString.getString("name")%></th>
                                <th width="50%" style="text-align: left"><%=i18nString.getString("sqlSentence")%></th>
                                <th><%=i18nString.getString("operation")%></th>
                            </tr>
                            </thead>
                            <tbody id="myQueryList">

                            </tbody>
                        </table>
                    </div>
                    <div id="queryListPage" class="tableListPage"></div>
                </div>
            </div>
        </div>
    </div>
</div>