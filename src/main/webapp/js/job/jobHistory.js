
$(function(){
    var ajaxHandler = new xhrFunction();
    var date=[];
    var iCount,isClear = false;
    var jobHistory = {
        init: function(){
            var me = this;
            me._init();
            me._bind();
        },
        _init: function(){
            var me = this;
            var href_param=(window.location.href).split('?')[1];
            me.queryJobHistory(1,'','',href_param);
        },
        _bind: function(){
            var me=this;
            $('.btn-search').on('click',me.fileFilter);//搜索
            $('.date2')[0].onChange=function(sel){
                var getDateParam = function(){
                    return sel;
                };
                date= getDateParam();
                me.queryJobHistory(1)
            };
            $('.table th').on('click',function(){
                var name = $(this).data('name'),type = '';
                var $up = $(this).find('.triTop'),$down =  $(this).find('.triDown');
                var filter = $('#FileFilter').val();
                if(!$up.is(':visible') && !$down.is(':visible')){
                    $down.css('display','inline-block');
                    type = ' asc';
                }else if(!$down.is(':hidden')){
                    $up.css('display','inline-block');
                    $down.css('display','none');
                    type = ' desc';
                }else if(!$up.is(':hidden')){
                    $up.css('display','none');
                    $down.css('display','inline-block');
                    type = ' asc';
                }
                me.queryJobHistory(1,filter,name+type);
            });
            $('#job_historyTbody').on('click','.icon_history',me.queryJobLog);//日志
            $('#job_historyTbody').on('click','.icon_restart',me.queryJobRestart);//执行
            $('#job_historyTbody').on('click','.icon_stop',me.queryJobStop);//停止
            $('#job_historyTbody').on('click','.close',function(){
                $(this).closest('div').slideUp();
            });
        },
        queryJobHistory:function (num,search,sort,href_param) {
            var me=this;
            var startDate=date[0],endDate=date[1];
            var _data={
                page:num||1,
                pageSize:10,
            };
            if(date.length!=0){
                _data.startDate=startDate;
                _data.endDate=endDate;
            }
            if(search != undefined && search != ''){
                _data.searchKey = search
            }
            if(sort != undefined&&sort!=''){
                _data.sortColumns = sort
            }
            if(href_param!=undefined){
                var queryId=href_param.split('=')[1];
                _data.queryId = queryId
            }
            var param ={
                url:window.AJAX_URL.GET_QUERYJOB_EXECUTIONHISTORY,
                type:'post',
                data:_data
            };
            var doneFun = function(data){
                var newData=data.data;
                if(data.code == 0){ //失败
                    commonEventHandler.openInfoDialog(data.errorMessage);
                }else if(data.code == 1){//成功
                    if(newData.rows.length == 0 || newData.rows == []|| $.isEmptyObject(newData.rows)) {
                        $('#table-nodata').show();
                        commonEventHandler.fillNodataHtml("table-nodata");
                        return;
                    }else{
                        $('#table-nodata').hide();
                    }
                    var _html='';
                    if(isClear){
                        if(newData.rows[0].duration!=0){
                            window.clearInterval(iCount);
                            isClear = false;
                        }
                    }
                    $.each(newData.rows,function(k,v){
                        var executeState='',title = '';
                        var classN='';
                        switch (v.executeState){
                            case 'RUNNING':executeState = $.i18n.prop('iconRunning');
                                classN='icon_stop';title = $.i18n.prop('iconRunning');
                                break;
                            case 'STOPPED':executeState = $.i18n.prop('iconStop');
                                classN='icon_restart';title = $.i18n.prop('iconRestart');
                                break;
                            case 'CANCELLED':executeState = $.i18n.prop('iconCancel');
                                classN='icon_restart';title = $.i18n.prop('iconRestart');
                                break;
                            case 'SUCCESS':executeState = $.i18n.prop('iconSuccess');
                                classN='icon_restart';title = $.i18n.prop('iconRestart');
                                break;
                            case 'FAILED':executeState = $.i18n.prop('iconFailed');
                                classN='icon_restart';title = $.i18n.prop('iconRestart');
                                break;
                            default:executeState="";
                        }
                        var duration = '';
                        if(v.duration!=0){
                            duration = me.getTimeDuration(v.duration);
                        }
                        classN = v.queryEntity.disable?'icon_restart_gray':classN;
                        var stratDate = v.startDate == null ? '': new Date(v.startDate).Format("yyyy-MM-dd hh:mm:ss");
                        var endDate = v.endDate == null ? '': new Date(v.endDate).Format("yyyy-MM-dd hh:mm:ss");
                        _html+='<tr id="'+v.id+'"><td>'+v.id+'</td>';
                        _html+='<td title="'+v.name+'">'+v.name+'</td>';
                        _html+='<td>'+stratDate+'</td>';
                        _html+='<td>'+endDate+'</td>';
                        _html+='<td>'+duration+'</td>'
                        _html+='<td>'+executeState+'</td>'
                        _html+='<td class="operation" data-name="'+v.name+'">';
                        if(v.log!=null){
                            _html+='<span class="icon_job icon_history" title="'+$.i18n.prop('jobHistoryLog')+'"></span>';
                            _html+='<div class="popwin"><p class="grayRow"><span class="close">×</span></p><p class="con">'+v.log+'</p><p class="grayRow bot"></p></div>';
                        }else{
                            _html+='<span class="icon_job icon_history_gray"></span>';
                        }
                        _html+='<span class="icon_job '+classN+'" title="'+title+'" data-queryid="'+v.queryId+'" data-id="'+v.id+'"></span>';
                        _html+='</td></tr>';
                    });
                    $('#job_historyTbody').html(_html);
                    $('#job_historyPage').html('<div class="inner"></div>');
                    if(newData&&newData.total>=10){
                        $('#job_historyPage .inner').bootpage({
                            total:newData.total,
                            totalPage: Math.ceil(newData.total / 10),
                            dataNum:newData.rows.length,
                            page:newData.page,
                            maxVisible: 10,
                            evt:'queryPageChange'
                        });//生成页码
                        $('#job_historyPage .inner').on('queryPageChange',function(event,pageNum){
                            event.stopPropagation();
                            jobHistory.queryJobHistory(pageNum.num,search,sort,href_param);
                        });//自定义改变页码事件
                    }
                };
            };
            var failFun = function(data){};
            ajaxHandler.ajaxFun(param,doneFun,failFun);
        },
        //日志
        queryJobLog:function () {
           var width=$('#job_historyTbody').innerWidth();
           $('.popwin').css('width',width);
            var $tip = $(this).siblings('div');
            if($tip.is(':visible')){
                $tip.slideUp(200);
            }else{
                $tip.slideDown(200);
            }
        },
        //重启
        queryJobRestart:function () {
            $('.mask').show(200);
            $('#executeName').html($.i18n.prop('jobHistoryRestart'));
            //var id = $(this).data('id');
            var queryId = $(this).data('queryid');
            $('.btn-confirm').unbind('click').on('click',function(){
                var param ={
                    url:window.AJAX_URL.GET_QUERYJOB_RESTART,
                    data:{
                        id:queryId
                    }
                };
                var doneFun = function(data){
                    $('.delete-container').hide(200);
                    if(data.code==0){
                        commonEventHandler.openInfoDialog(data.errorMessage);
                    }else if(data.code==1){
                        jobHistory.queryJobHistory(1);
                        window.clearInterval(iCount);
                        iCount = window.setInterval(function(){
                            isClear = true;
                            jobHistory.queryJobHistory(1)
                        },5000);
                    }
                };
                var failFun = function () {};
                ajaxHandler.ajaxFun(param,doneFun,failFun);
            });
        },
        //停止执行任务
        queryJobStop:function () {
            $('.mask').show(200);
            $('#executeName').text($.i18n.prop('jobHistoryStop'));
            var id = $(this).data('id');
            var queryId = $(this).data('queryid');
            $('.btn-confirm').unbind('click').on('click',function(){
                var param ={
                    url:window.AJAX_URL.GET_QUERYJOB_STOP,
                    data:{
                        id:id,
                        jobId:queryId
                    }
                };
                var doneFun = function(data){
                    $('.mask').hide(200);
                    if(data.code==0){
                        commonEventHandler.openInfoDialog(data.errorMessage);
                    }else if(data.code==1){
                        window.clearInterval(iCount);
                        jobHistory.queryJobHistory(1);
                    }
                };
                var failFun = function () {};
                ajaxHandler.ajaxFun(param,doneFun,failFun);
            });
        },
        //搜索
        fileFilter:function () {
            var search = $('#FileFilter').val();
            var reg = new RegExp("^[^<>`~!/@\#}$%:;)(^{&*=|'+]+$");
            if(!reg.test(search) && search != ''){
                return;
            }
            jobHistory.queryJobHistory(1,search);
        },
        getTimeDuration :function(duration){
            if(!!duration){
                var date3 = new Date(duration)  //时间差的毫秒数
                var days = Math.floor(date3 / (24 * 3600 * 1000))  //计算出相差天数
                //计算出小时数
                var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
                var hours = Math.floor(leave1 / (3600 * 1000))
                //计算相差分钟数
                var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
                var minutes = Math.floor(leave2 / (60 * 1000))
                //计算相差秒数
                var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
                var seconds = Math.round(leave3 / 1000);
                if(hours==0){
                    if(minutes== 0){
                        return seconds+"s";
                    }
                    else{
                        return minutes + "m" + seconds+"s";
                    }
                }
                else{
                    return hours + "h" + minutes + "m" + seconds+"s";
                }
            }
        }
    }
    jobHistory.init();
})
