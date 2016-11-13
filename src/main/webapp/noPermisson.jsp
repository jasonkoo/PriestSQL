<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>很抱歉，您没有权限访问该页面</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">    
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
</head>

<style type="text/css">
.prompt{position: relative;top: -20px;}
.txt{
    background-color: #a0adc6;
    font-family: '微软雅黑';
    font-size: 24px;
    color: #e6eaf2;
    margin: 5px 0;
    display: inline-block;
    padding: 0 5px;
    height: 35px;
    line-height: 35px;
}
.loginout_box{
    background-color: #b2c9f3;
    box-shadow: inset 0px 1px rgba(0,0,0,.4);
    width: 200px;
    height: 55px;
    display: inline-block;
    line-height: 55px;
    border-radius: 30px;
    color: #ffffff;
    font-family: '微软雅黑';
    font-weight: 700;
    position: relative;
}
.loginout_box .loginout{
    display: inline-block;
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3c99e3', endColorstr='#0b6db8', GradientType=0 );
    background: -webkit-linear-gradient(top, #3c99e3,#0b6db8);
    background: -moz-linear-gradient(top, #3c99e3,#0b6db8);
    background: -o-linear-gradient(top, #3c99e3,#0b6db8);
    background: -ms-linear-gradient(top, #3c99e3,#0b6db8);
    border: 1px solid #134699;
    border-radius: 30px;
    width: 186px;
    height: 43px;
    line-height: 43px;
    margin-top: 5px;
    box-shadow: inset 0px 1px rgba(255,255,255,.7);
}
.loginout_box:hover{
    background-color: #b8ddf6;
}
.loginout_box:hover .loginout{
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#62baff', endColorstr='#0b6db8', GradientType=0 );
    background: -webkit-linear-gradient(top, #62baff,#0b6db8);
    background: -moz-linear-gradient(top, #62baff,#0b6db8);
    background: -o-linear-gradient(top, #62baff,#0b6db8);
    background: -ms-linear-gradient(top, #62baff,#0b6db8);
}
.loginout_box:active{
    background-color: #b2c9f3;
}
.loginout_box:active .loginout{
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0b6db8', endColorstr='#58b1f7', GradientType=0 );
    background: -webkit-linear-gradient(top, #0b6db8,#58b1f7);
    background: -moz-linear-gradient(top, #0b6db8,#58b1f7);
    background: -o-linear-gradient(top, #0b6db8,#58b1f7);
    background: -ms-linear-gradient(top, #0b6db8,#58b1f7);
}
.loginout_box .icon{
    background: url("images/arrlow_right.png") no-repeat;
    overflow: hidden;
    width: 40px;
    height: 35px;
    display: inline-block;
    position: absolute;
    right: 5px;
    top: 10px;
}
.loginout_box .tt{margin-left: -35px;}
</style>

<body style="text-align:center;background-color: #e6eaf2;">
    <div>
        <img src="images/403.png">
    </div>
    <div class="prompt">
        <div><span class="txt">你没有权限访问该页面</span></div>
        <div><span class="txt">请与管理员(Email:yaochen1@lenovo.com)联系</span></div>
    </div>
    <div class="login_out">
        <a href="logout" class="loginout_box">
            <span class="loginout"><span class="tt">切换帐户</span><i class="icon"></i></span>
        </a>
    </div>
</body>
</html>


























<ul class="dataUl dataSource-li">
    <li class="data-dataSource-li dataConnectName">
        <i class="connect-icon dataIcons floatLeft"></i>
        <span class="data-name sourcesName">connect1</span>
    </li>
    <ul class="dataUl dataTable-li ulHide">
        <li class="data-dataBase-li">
            <i class="icon2 server-icon dataIcons floatLeft"></i>
            <span class="data-name sourcesName">Lenovo-kp1</span>
            <i class="icon2 toggle-icon dataIcons floatRight toggle-icon-open"></i>
        </li>
        <ul class="dataUl dataTable-li tableList-max-height ulHide">
            <div class="tableList-more gray" >
                更多 <i class="icon-more"></i>
            </div>
            <div class="tablesListInner">
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table1</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2  tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table2</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table3</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table1</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2  tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table2</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table3</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table1</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2  tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table2</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table3</span>
                </li>
            </div>
        </ul>


    </ul>
    <div class="dotted-hr-noMargin dotted-hr clearFloat"></div>
</ul>
<ul class="dataUl dataSource-li">
    <li class="data-dataSource-li  dataConnectName">
        <i class="connect-icon dataIcons floatLeft"></i>
        <span class="data-name sourcesName">connect1</span>
    </li>
    <ul class="dataUl dataTable-li ulHide">
        <li class="data-dataBase-li">
            <i class="icon2 server-icon dataIcons floatLeft"></i>
            <span class="data-name sourcesName">Lenovo-kp1</span>
            <i class="icon2 toggle-icon dataIcons floatRight toggle-icon-open"></i>
        </li>
        <ul class="dataUl dataTable-li tableList-max-height ulHide">
            <div class="tableList-more gray" >
                更多 <i class="icon-more"></i>
            </div>
            <div class="tablesListInner">
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table1</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2  tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table2</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table3</span>
                </li>
            </div>
        </ul>
    </ul>
    <ul class="dataUl dataTable-li ulHide">
        <li class="data-dataBase-li">
            <i class="icon2 server-icon dataIcons floatLeft"></i>
            <span class="data-name sourcesName">Lenovo-kp1</span>
            <i class="icon2 toggle-icon dataIcons floatRight toggle-icon-open"></i>
        </li>
        <ul class="dataUl dataTable-li tableList-max-height ulHide">
            <div class="tableList-more gray" >
                更多 <i class="icon-more"></i>
            </div>
            <div class="tablesListInner">
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table1</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2  tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table2</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table3</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table1</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2  tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table2</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table3</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table1</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2  tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table2</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table3</span>
                </li>
            </div>
        </ul>
    </ul>
    <div class="dotted-hr-noMargin dotted-hr clearFloat"></div>
</ul>
<ul class="dataUl dataSource-li">
    <li class="data-dataSource-li  dataConnectName">
        <i class="connect-icon dataIcons floatLeft"></i>
        <span class="data-name sourcesName">connect1</span>
    </li>
    <ul class="dataUl dataTable-li ulHide">
        <li class="data-dataBase-li">
            <i class="icon2 server-icon dataIcons floatLeft"></i>
            <span class="data-name sourcesName">Lenovo-kp1</span>
            <i class="icon2 toggle-icon dataIcons floatRight toggle-icon-open"></i>
        </li>
        <ul class="dataUl dataTable-li tableList-max-height ulHide">
            <div class="tableList-more gray" >
                更多 <i class="icon-more"></i>
            </div>
            <div class="tablesListInner">
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table1</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2  tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table2</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table3</span>
                </li>
            </div>
        </ul>
    </ul>
    <ul class="dataUl dataTable-li ulHide">
        <li class="data-dataBase-li">
            <i class="icon2 server-icon dataIcons floatLeft"></i>
            <span class="data-name sourcesName">Lenovo-kp1</span>
            <i class="icon2 toggle-icon dataIcons floatRight toggle-icon-open"></i>
        </li>
        <ul class="dataUl dataTable-li tableList-max-height ulHide">
            <div class="tableList-more gray" >
                更多 <i class="icon-more"></i>
            </div>
            <div class="tablesListInner">
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table1</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2  tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table2</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table3</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table1</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2  tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table2</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table3</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table1</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2  tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table2</span>
                </li>
                <li class="data-dataTable-li">
                    <i class="icon2 tableIcon disable-table-icon dataIcons floatLeft"></i>
                    <span class="data-name tableName">table3</span>
                </li>
            </div>
        </ul>
    </ul>
    <div class="dotted-hr-noMargin dotted-hr clearFloat"></div>
</ul>

