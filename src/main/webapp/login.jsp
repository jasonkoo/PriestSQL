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
<title>PriestSQL</title>
<script type="text/javascript">
window.Language = "<%=langType%>";
</script>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/common.min.css?20160630">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/login.css">

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
<script src="libs/ie/ie8-responsive-file-warning.js"></script>
<script src="libs/html5shiv/html5shiv.min.js"></script>
<![endif]-->
</head>
<body>
<div class="container-full" style="overflow: hidden">
	<!--导航条-->
		<header id="public-header" class=" header">
			<div class="header-row-wrap">
				<div class="row">
					<div class="col-sm-4 col-md-4 col-lg-4">
						<a href="${pageContext.request.contextPath}/login.jsp" class="logo-img"><img src="${pageContext.request.contextPath}/images/login/logo_login.PNG" alt=""></a>
					</div>
					<div class="col-sm-6 col-md-6 col-lg-6">
						<ul class="nav navbar-nav" style="margin-top: 6px;float: right">
							<%--<li><a href="#">首页</a></li>
							<li><a href="#"><span>|</span></a></li>
							<li><a href="#">关于Priest SQL</a></li>
							<li><a href="#"><span>|</span></a></li>--%>
							<li ><a href="${pageContext.request.contextPath}/document/leapsql.doc" download="<%= i18nString.getString("leapSqlUseManual")%>.doc"><%= i18nString.getString("helpAmdDocument")%></a></li>
						</ul>
					</div>
				</div>
			</div>
		</header>
		<div id="banner">
			<div class="row">
				<div class="col-sm-12 col-md-12 col-lg-12 banner">
					<form class="form-signin" id="FormLogin">
						<img src="${pageContext.request.contextPath}/images/login/logo_icon.PNG" alt="logo">
						<div class="form-group">
							<label for="username" class="sr-only"><%= i18nString.getString("username")%></label>
							<div class="input-group">
								<div class="username_icon icon"></div>
								<span>|</span>
								<input type="text" class="form-control loginName" name="userName" id="username" placeholder="<%= i18nString.getString("username")%>" required autofocus>
							</div>
						</div>
						<div class="form-group">
							<label for="password" class="sr-only"><%= i18nString.getString("password")%></label>
							<div class="input-group">
								<div class="password_icon icon"></div>
								<span>|</span>
								<input type="password" class="form-control passWord" id="password" name="password" placeholder="<%= i18nString.getString("password")%>" required>
							</div>
						</div>
						<div class="btn" id="FormLoginBtn" style="outline:none;line-height: 40px;"><%= i18nString.getString("login")%></div>

					</form>

				</div>
			</div>
		</div>
		<div class="col-sm-12 col-md-12 col-lg-12" style="height:100px;">
			<p class="copyright">Copyright:1998~2016 Lenovo Croup Limited Beijing ICP 05000462</p>
		</div>
</div>
<script type="text/javascript">
	window.CONTEXT_PATH="${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/js/jquery-1.12.0.min.js"></script>
<script src="${pageContext.request.contextPath}/js/common.min.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.validate.js"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/login.js" ></script>
</body>
</html>
