    function openInfoDialog(info){
        $("#operationInfoDialog").show();
        $(".operationText").text(info);
    }



    function xhrFunction(){}
    xhrFunction._ajaxDef = function(param){
        return $.ajax({
            url : param.url,
            data : param.data || {},
            type : param.type || "post",
            dataType : param.dataType,
            async : param.async ||true,
            complete:function(data){
                try {
                    var _reultData =JSON.parse(data.responseText);
                    switch (_reultData.code){
                        case -1:
                            document.location =window.CONTEXT_PATH+"/login.jsp";
                            break;
                        case -2:
                            // 没有权限
                            setTimeout(function () {
                                openInfoDialog(_reultData.errorMessage);
                            },500);
                            break;
                        case -5:
                            // 非法参数
                            setTimeout(function () {
                                openInfoDialog(_reultData.errorMessage);
                            },500);
                            break;
                        case -6:
                            //其他非成功状态异常码
                            setTimeout(function () {
                                openInfoDialog(_reultData.errorMessage);
                            },500);
                            break;
                    }
                } catch (e) {
                    openInfoDialog($.i18n.prop('programException'))
                }

            }
        });
    };
    xhrFunction.prototype = {
        constructor : xhrFunction,
        ajaxFun : function(param,doneFun,failFunc){
            $.when(xhrFunction._ajaxDef(param)).then(doneFun,failFunc);
        }
    }

