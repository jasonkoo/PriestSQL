$(function(){

    $.fn.extend({
        datepicker: function(options){
            var opts = $.extend(options);
            return this.each(function(){
                var obj = $(this);
                var minuteValue = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
                var hourValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
                if( !obj.visulized ){
                    visulize($(obj),opts);
                    obj.visulized = true;
                }
                var $hure = $(obj).next('.cycle-datepicker').find('.hour-lst');
                $.each(hourValue,function(k,v){
                    var html = '<li data-value="'+v+'">'+v+'</li>';
                    $hure.append(html);
                });
                var $minute = $(obj).next('.cycle-datepicker').find('.minute-lst');
                $.each(minuteValue,function(k,v){
                    var html = '<li data-value="'+v+'">'+v+'</li>';
                    $minute.append(html);
                });
            });

            function visulize(objNode){
                var $dp_cont = $('<div class="cycle-datepicker"><span class="title">快速选择</span></div>');
                var $dp_lst = $('<div class="date-lst"><ul class="hour-lst"></ul><ul class="minute-lst"></ul></div>');
                var $dp_custom = $('<div class="custom"><label>时间：</label><input type="text" id="hour"/>：<input type="text" id="minute"/></div>');
                var $dp_footer = $('<div class="footer"><a class="btn-sure" href="javascript:;">确定</a></div>');
                $dp_cont.append($dp_lst);
                $dp_cont.append($dp_custom);
                $dp_cont.append($dp_footer);
                objNode.after($dp_cont);

                objNode.on('click',function(e){
                    var parent = $(this).closest('.form-group').get(0).className.split(' ')[1];
                    if($dp_cont.is(":hidden")){
                        $dp_cont.show();
                        var val = $(this).val();
                        if(val!=''){
                            var time = val.split(':'),
                                hour = time[0]* 1,
                                minute = time[1]*1;
                            $('.'+parent+' .hour-lst li,.'+parent+' .minute-lst li').removeClass('active');
                            $('.'+parent+' .hour-lst li[data-value="'+hour+'"]').addClass('active');
                            $('.'+parent+' .minute-lst li[data-value="'+minute+'"]').addClass('active');
                            var index = $('.'+parent+' .minute-lst li[data-value="'+minute+'"]').index();
                            $('.'+parent+' .hour-lst').scrollTop(hour*30);
                            $('.'+parent+' .minute-lst').scrollTop(index*30);
                        }else{
                            $('.'+parent+' .hour-lst li,.'+parent+' .minute-lst li').removeClass('active');
                            $('.'+parent+' .hour-lst,.'+parent+' .minute-lst').scrollTop(0);
                        }
                    }else{
                        $dp_cont.hide();
                    }
                    $(document).one("click", function(){
                        $dp_cont.hide();
                    });
                    e.stopPropagation();
                });

                $dp_lst.on('click','ul li',function(){
                    $(this).addClass('active').siblings().removeClass('active');
                });

                $dp_footer.on('click','.btn-sure',function(e){
                    $dp_cont.hide();
                    var input_h = $dp_custom.find('#hour').val(),
                        input_m = $dp_custom.find('#minute').val();
                    var h_active = $dp_lst.find('.hour-lst li.active'),
                        m_active = $dp_lst.find('.minute-lst li.active');
                    var hour = 0, minute = 0;
                    if(input_h!='' && input_m!=''){
                        hour = input_h;
                        minute = input_m;
                    }else if(h_active.length>0 && m_active.length>0){
                        hour = h_active.data('value');
                        minute = m_active.data('value');
                    }
                    objNode.val(hour+':'+minute);
                    var btn_sure = $dp_footer.find('.btn-sure')[0];
                    if( btn_sure.onChange ){
                        try{
                            btn_sure.onChange(hour+':'+minute);
                        }catch(e){}
                    }
                });

                $dp_cont.on('click',function(e){
                    e.stopPropagation();
                })

            }
        }
    });
    var b = ["0", "0", "*", "*", "*", "?"];
    var ajaxHandler = new xhrFunction();
    var dataMap = [];
    var jobList = {
        init: function(){
            var me = this;
            me._init();
            me._bind();
        },
        _init: function(){
            var me = this;
            me.loadJobList();
            me.loadConnections(); //初始化数据源
        },
        _bind: function(){
            var me = this;
            // 添加任务
            $('.btn-addJob').bind('click',function(){
                $('.list,#btn_update').hide();
                $('.edit,#btn_save').show();
                $('.edit-type').html($.i18n.prop('crateJob'));
                $('.page-content').scrollTop(0);
                editor.refresh();//动态设置或浏览器变动后保证editor的正确显示
                editor.focus();//give the editor focus
                me.validate();//添加验证
            });

            $("#Param_cron").val('0 1 * * * ?'); //设置默认值
            $('.time').datepicker(); //初始化时间控件

            $('#cycle').change(function(){
                var $cron = $("#Param_cron");
                var sel_val = $(this).val();
                switch(sel_val){
                    case "按小时调度" :
                        $cron.val('0 1 * * * ?');
                        $('.day,.week,.month').hide();
                        $('.hour').show();
                        b = ["0", "1", "*", "*", "*", "?"];
                        me.hourDate();
                        break;
                    case "按天调度" :
                        $cron.val('0 0 0 * * ?');
                        $('.hour,.week,.month').hide();
                        $('.day').show();
                        b = ["0", "0", "0", "*", "*", "?"];
                        me.timeChage('day');
                        break;
                    case "按周调度" :
                        $cron.val('0 0 0 ? * 1');
                        $('.hour,.day,.month').hide();
                        $('.week').show();
                        b = ["0", "0", "0", "?", "*", "1"];
                        me.timeChage('week');
                        break;
                    case "按月调度" :
                        $cron.val('0 0 0 1 * ?');
                        $('.hour,.day,.week').hide();
                        $('.month').show();
                        b = ["0", "0", "0", "1", "*", "?"];
                        $('#selectDay').empty();
                        var _html='';
                        for(var i=1;i<=31;i++){
                            _html+='<option value="'+i+'">'+i+'</option>';
                        }
                        $('#selectDay').html(_html);
                        me.timeChage('month');
                        break;
                    default: $cron.val('0 1 * * * ?');
                }
            });
            $("#selectConnections").on('change',function(){
                    var connectId = $(this).val();
                    me.loadDatabase(connectId,'');
            });
            $('#describe').on('keyup',function(){
                $('#entered').text($(this).val().length);
                $('#counter').text(200-$(this).val().length);
            })
            $('#btn_save').on('click',me.dataSave); //保存
            $('#btn_cancel').on('click',me.dataCancel);
            $('#btn_update').on('click',me.dataUpdate); //修改
            $('.btn-search').on('click',me.searchList); //搜索

            $('#job_ListTbody').on('click','.icon_edit',me.dataEdit);//编辑
            $('#job_ListTbody').on('click','.icon_stop',function(){//禁用定时任务
                var id = $(this).data('id');
                me.operationTask(id,'disabled');
            });
            $('#job_ListTbody').on('click','.icon_start',function(){//启用定时任务
                var id = $(this).data('id');
                me.operationTask(id,'enable');
            });
            $('#job_ListTbody').on('click','.icon_delete',me.dataDelete);//删除
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
                me.loadJobList(1,filter,name+type);
            })
            me.hourDate(); // 初始化按小时调度
        },
        timeChage: function(type){
            $('.time').val(''); //清空调度时间
            $('.day-lst input[type="checkbox"]').attr("checked",false);
            $('.form-group:visible .cycle-datepicker .btn-sure')[0].onChange = function(sel){
                var time = sel.split(':'),
                    hour = time[0],
                    minute = time[1];
                b[1] = minute;
                b[2] = hour;
                if(type=='week'){
                    var str = ''
                    $('.day-lst input[type=checkbox]').each(function(){
                        if(this.checked){
                            str += $(this).val()+','
                        }
                    });
                    str = str.substring(0, str.length - 1);
                    b[5] = str;
                }else if(type=='month'){
                    var val = $('.month select').val();
                    b[3] = val;
                }
                var cron=b.join(" ").toString();
                $('#Param_cron').val(cron);
            }
        },
        hourDate: function(){
            $('#selectMinutes').empty();
            var _html='';
            for(var i=1;i<60;i++){
                if(i==1){
                    _html+='<option value="'+i+'" selected="selected">'+i+'</option>';
                }else{
                    _html+='<option value="'+i+'">'+i+'</option>';
                }
            }
            $('#selectMinutes').html(_html).on('change',function(){
                var val = $(this).val();
                b[1] = val =='' ? '1' : val;
                var cron=b.join(" ").toString();
                $('#Param_cron').val(cron);
            });
        },
        userAppClick:function(){
            $('#UserList').on('click', 'li', function(){
                $('#UserSel').html($(this).attr('data-user'));
                $('#UserList').find('li').removeClass("userListActive");
                $(this).addClass('userListActive')
            });
        },
        // 搜索
        searchList: function(){
            var search = $('#FileFilter').val();
            var reg = new RegExp("^[^<>`~!/@\#}$%:;)(^{&*=|'+]+$");
            if(!reg.test(search) && search != ''){
                return;
            }
            jobList.loadJobList(1,search);
        },
        //获取数据
        loadJobList: function(num,search,sort){
            var me = this;
            var _data = {
                page:num||1,
                pageSize:10
            }
            if(search != undefined && search != ''){
                _data.searchKey = search
            }
            if(sort != undefined){
                _data.sortColumns = sort
            }
            var param ={
                url:window.AJAX_URL.GET_QUERYJOB_LIST,
                data:_data,
                dataType : "json"
            };
            var doneFun = function(data){
                var newData=data.data;
                if(data.code == 0){
                    commonEventHandler.openInfoDialog(data.errorMessage);
                }else if(data.code == 1){
                    if(newData.rows.length == 0 || newData.rows == []|| $.isEmptyObject(newData.rows)) {
                        $('#table-nodata').show();
                        commonEventHandler.fillNodataHtml("table-nodata");
                        return;
                    }else{
                        $('#table-nodata').hide();
                    }
                    var _html='';
                    dataMap = newData.rows;
                    $.each(newData.rows,function(k,v){
                        var disable = '',isVisible = '';
                        if(v.disable){
                            disable = $.i18n.prop('jobListDisabled');
                            isVisible = 'icon_edit_gray';
                        }else{
                            disable = $.i18n.prop('jobListEnable');
                            isVisible = 'icon_edit';
                        }
                        var execution = v.execution == null ? '': new Date(v.execution).Format("yyyy-MM-dd hh:mm:ss");
                        _html+='<tr><td>'+ v.id+'</td>';
                        _html+='<td>'+ v.owner+'</td>';
                        _html+='<td>'+ v.name+'</td>';
                        _html+='<td>'+ execution+'</td>';
                        _html+='<td>'+v.executePeriod+'</td>';
                        _html+='<td>'+ disable +'</td>';
                        _html+='<td><a href="javascript:;" title="'+$.i18n.prop('jobListEdit')+'" class="icon_job '+isVisible+'" data-id="'+ v.id+'"></a><a href="javascript:;" title="'+$.i18n.prop('jobListDelete')+'" class="icon_job icon_delete" data-id="'+ v.id+'" data-title="'+ v.name+'"></a>';
                        if(v.disable){
                            _html+='<a href="javascript:;" title="'+$.i18n.prop('jobListEnable')+'" class="icon_job icon_start" data-id="'+ v.id+'" ></a>';
                        }else{
                            _html+='<a href="javascript:;" title="'+$.i18n.prop('jobListDisabled')+'" class="icon_job icon_stop" data-id="'+ v.id+'" ></a>';
                        }
                        _html+='</td><td><a href="/jobHistory.jsp?queryId='+ v.id+'" title="'+$.i18n.prop('jobListHistory')+'" class="icon_job icon_history"></a></td></tr>';
                    });
                    $('#job_ListTbody').html(_html);
                    $('#job_ListPage').html('<div class="inner"></div>');
                    if(newData&&newData.total>=10){
                        $('#job_ListPage .inner').bootpage({
                            total:newData.total,
                            totalPage: Math.ceil(newData.total / 10),
                            dataNum:newData.rows.length,
                            page:newData.page,
                            maxVisible: 10,
                            evt:'queryPageChange'
                        });//生成页码
                        $('#job_ListPage .inner').on('queryPageChange',function(event,pageNum){
                            event.stopPropagation();
                            me.loadJobList(pageNum.num,search,sort);
                        });//自定义改变页码事件
                    }
                };
            };
            var failFun = function () {

            }
            ajaxHandler.ajaxFun(param,doneFun,failFun);
        },
        //获取数据源
        loadConnections:function(){
            var me=this;
            var param = {
                url:window.AJAX_URL.GET_CONNECTIONS
            };
            var doneFun = function(data){
                if(data.code == 0){
                    commonEventHandler.openInfoDialog(data.errorMessage);
                }else if(data.code == 1){
                    var data = data.data;
                    $("#selectConnections").empty();
                    if(data != null && data.length >0){
                        var _html='',index=0;
                        $.each(data,function (k,v) {
                            if(v.connectType=='hive' || v.connectType=='spark'){
                                if(index==0){
                                    _html+='<option value="'+v.id+'" selected="selected">'+v.connectName+'</option>';
                                    jobList.loadDatabase(v.id,'');
                                    index = 1;
                                }else{
                                    _html+='<option value="'+v.id+'">'+v.connectName+'</option>'
                                }
                            }

                        });
                        $("#selectConnections").html(_html);
                    }
                }
            };
            var failFunc = function(data){
            }
            ajaxHandler.ajaxFun(param,doneFun,failFunc);
        },
        //获取数据源对应的库
        loadDatabase:function(ConnId,id){
            var me=this;
            var param = {
                url:window.AJAX_URL.GET_DATABASES,
                type:'POST',
                data:{
                    ConnId:ConnId,
                    page:1,
                    pageSize:10
                },
                dataType : "json"
            };
            var doneFun = function(data){
                if(data.code == 0){
                    $("#selectDatabase").empty();
                    if(id!=''){
                        $.each(dataMap,function(k,v){
                            if(v.id == id){
                                var _html='<option value="'+ v.databaseName+'">'+v.databaseName+'</option>';
                                $("#selectDatabase").html(_html);
                            }
                        })
                        me.bulidEditData(id)
                    }
                }else if(data.code == 1){
                    var data = data.data;
                    $("#selectDatabase").empty();
                    if(data != null && data.length >0){
                        var _html='';
                        $.each(data,function (k,v) {
                            _html+='<option value="'+ v+'">'+v+'</option>'
                        });
                        $("#selectDatabase").html(_html);
                        if(id!=''){
                            me.bulidEditData(id)
                        }
                    }else{
                        $("#selectDatabase").empty();
                    }
                }
            };
            var failFunc = function(data){
                console.log(data);
            }
            ajaxHandler.ajaxFun(param,doneFun,failFunc);
        },
        //表单验证
        validate: function(){
            $("#dispatch_form .form-control").blur(function(){
                var $parent = $(this).parent();
                $parent.find(".formtips").remove();
                $('.day-lst').find(".formtips").remove();
                //var reg = new RegExp("[~'!@#$%^&*()||+=:]");
                var reg = new RegExp("^[^<>`~!/@\#}$%:;)(^{&*=|'+]+$");
                // 验证必填
                if($(this).is(".required") && $(this).closest('.form-group').is(':visible')){
                    if(this.value == ""){
                        $parent.append('<span class="formtips onError">'+$.i18n.prop('jobFormRequired')+'</span>');
                    };
                    if(this.id=="jobName" && this.value != ""){
                        if(!reg.test(this.value)){
                            $parent.append('<span class="formtips onError">'+$.i18n.prop('jobListFormat')+'</span>');
                        }
                    }
                }
                if(this.id=='describe'&& this.value != ""){
                    if(!reg.test(this.value)){
                        $parent.append('<span class="formtips onError">'+$.i18n.prop('jobListFormat')+'</span>');
                    }
                }
                if($('.day-lst').closest('.form-group').is(':visible')){
                    var check = $('.day-lst input:checkbox:checked').length;
                    if(check==0){
                        $('.day-lst').append('<span class="formtips onError">'+$.i18n.prop('jobFormRequired')+'</span>');
                    }
                }
            }).keyup(function(){
                $(this).triggerHandler("blur");
            }).focus(function(){
                $(this).triggerHandler("blur");
            });
        },
        //保存数据
        dataSave:function () {
            $("#dispatch_form input.required").trigger('blur');
            var sql = editor.getValue();
            $('#editor').parent().find(".formtips").remove();
            if(sql == ''){
                $('#editor').parent().append('<span class="formtips onError">'+$.i18n.prop('jobFormRequired')+'</span>');
            }
            var numError = $('#dispatch_form .onError').length;
            if(numError){
                return false;
            }
            var _data = jobList.getFromValue('save');
            var param = {
                url:window.AJAX_URL.GET_QUERYJOB_CREATE,
                type:'POST',
                data:_data,
                dataType : "json"
            };
            console.log(param.data)
            var doneFun = function(data){
                if(data.code == 0){
                    commonEventHandler.openInfoDialog(data.errorMessage);
                }else if(data.code == 1){
                    window.location.reload(); // 重新获取列表
                    var data = data.data;
                    $("#selectConnections").empty();
                    if(data != null && data.length >0){
                        var _html='';
                        $.each(data,function (k,v) {
                            _html+='<option value="'+v.id+'">'+v.connectName+'</option>'
                        });
                        $("#selectConnections").html(_html);
                    }
                }
            };
            var failFunc = function(data){
            }
            ajaxHandler.ajaxFun(param,doneFun,failFunc);
        },
        //编辑数据
        dataEdit:function () {
            $('.list,#btn_save').hide();
            $('.edit,#btn_update').show();
            $('.edit-type').html($.i18n.prop('jobListEdit'));
            $('.page-content').scrollTop(0);
            var id = $(this).data('id');
            //jobList.bulidEditData(id);
            $.each(dataMap,function(k,v){
                if(v.id == id){
                     jobList.loadDatabase(v.datasourceId,id);
                }
            })
            jobList.validate();//添加验证
        },
        bulidEditData: function(id){
            $.each(dataMap,function(k,v){
                if(v.id == id){
                    $('#jobId').val(v.id);
                    $('#jobName').val(v.name).attr('readonly','readonly'); //任务名称
                    editor.setSize("50%",160);
                    editor.refresh();//动态设置或浏览器变动后保证editor的正确显示
                    editor.focus();//give the editor focus
                    editor.setValue(v.sql);//需要执行的SQL语句
                    $('#selectConnections').val(v.datasourceId); //数据源ID
                    $('#selectDatabase').val(v.databaseName); //数据库
                    $('#cycle').val(v.executePeriod).trigger('change'); //调度周期
                    $('#Param_cron').val(v.cronExpr); //调度表达式（eg. * 0/5 * * * ?）
                    $('#describe').val(v.description); //描述信息
                    $('#entered').text($('#describe').val().length);
                    $('#counter').text(200-$('#describe').val().length);
                    var state = JSON.parse(v.periodConfig);
                    switch(state['type']){
                        case 'hour':
                            $('#selectMinutes').val(state.time);
                            break;
                        case 'day':
                            $('.day .time').val(state.time);
                            break;
                        case 'week':
                            var check_val = state.day.split(',');
                            for(var i=0;i<check_val.length;i++){
                                var $check = $('.day-lst input[value="'+ check_val[i] +'"]');
                                if($check.length>0){
                                    $check.prop('checked',true);
                                };
                            }
                            $('.week .time').val(state.time);
                            break;
                        case 'month':
                            $('#selectDay').val(state.day);
                            $('.month .time').val(state.time);
                            break;
                    }
                }
            });
        },
        dataUpdate: function(){
            $("#dispatch_form input.required").trigger('blur');
            var sql = editor.getValue();
            $('#editor').parent().find(".formtips").remove();
            if(sql == ''){
                $('#editor').parent().append('<span class="formtips onError">'+$.i18n.prop('jobFormRequired')+'</span>');
            }
            var numError = $('#dispatch_form .onError').length;
            if(numError){
                return false;
            }
            var _data = jobList.getFromValue('edit');
            var param = {
                url:window.AJAX_URL.GET_QUERYJOB_EDIT,
                type:'POST',
                data:_data,
                dataType : "json"
            };
            var doneFun = function(data){
                if(data.code == 0){
                    commonEventHandler.openInfoDialog(data.errorMessage);
                }
                else if(data.code == 1){
                    window.location.reload(); // 重新获取列表
                }
            };
            var failFunc = function(data){
                console.log(data);
            }
            ajaxHandler.ajaxFun(param,doneFun,failFunc);
        },
        //删除数据
        dataDelete:function(){
            $('.delete-container').show(200);
            var jobId = $(this).data('id');
            var title = $(this).data('title');
            $('.delete-container .jobName').html(title);
            $('.btn-confirm').unbind('click').on('click',function () {
                var param = {
                    url:window.AJAX_URL.GET_QUERYJOB_DELETE,
                    data:{ id:jobId }
                };
                var doneFun = function(data){
                    if(data.code == 0){
                        commonEventHandler.openInfoDialog(data.errorMessage);
                    }
                    else if(data.code == 1){
                        $('.delete-container').hide(200);
                        jobList.loadJobList();
                    }
                };
                var failFunc = function(data){
                }
                ajaxHandler.ajaxFun(param,doneFun,failFunc);
            })
        },
        //取消
        dataCancel:function(){
            $('.list,#btn_save').show();
            $('.edit,#btn_update').hide();
            $('#jobName').removeAttr('readonly');
            var connection_first = $('#selectConnections option:first').val(),
                cycle_first = $('#cycle option:first').val();
            $('#jobName').val('');//任务名称
            editor.setValue('');//需要执行的SQL语句
            $('#selectConnections').val(connection_first).trigger('change');//数据源ID
            $("#cycle").val(cycle_first).trigger('change'); //调度周期
            $('#describe').val(''); //描述信息
        },
        operationTask:function(id,type){
            var me = this;
            var jobId = id;
            var _url = type=='disabled'?window.AJAX_URL.GET_QUERYJOB_DISABLE:window.AJAX_URL.GET_QUERYJOB_ENABLE
            var param = {
                url: _url,
                data:{ id:jobId }
            };
            var doneFun = function(data){
                if(data.code == 0){
                    commonEventHandler.openInfoDialog(data.errorMessage);
                }
                else if(data.code == 1){
                    me.loadJobList();
                }
            };
            var failFunc = function(data){
            }
            ajaxHandler.ajaxFun(param,doneFun,failFunc);
        },
        getFromValue: function(type){
            var me = this;
            var id = $('#jobId').val(),//任务ID
                name = $('#jobName').val(),//任务名称
                editor_sql = editor.getValue(),//需要执行的SQL语句
                conid = $('#selectConnections').val(),//数据源ID
                database = $("#selectDatabase").val(), //数据库名称
                cycle = $("#cycle").val(), //调度周期
                param_cron = $('#Param_cron').val(),//调度表达式（eg. * 0/5 * * * ?）
                describe = $('#describe').val(); //描述信息
            var state = me.getState(cycle);
            var _data = {};
            var strat = editor_sql.indexOf('$'),
                end = editor_sql.indexOf('}')+1,
                variable = '';
            if(strat>=0 && end>=0){
                variable = editor_sql.substring(strat,end)+'=${today}';
            }
            if(type == 'save'){
                _data = {
                    name:name,//任务名称
                    sql:editor_sql,//需要执行的SQL语句
                    variables:variable,  //SQL语句中的变量（可选参数）
                    datasourceId:conid,	//数据源ID
                    databaseName:database, //数据库名称
                    executePeriod: cycle, //调度周期
                    cronExpr:param_cron,//调度表达式（eg. * 0/5 * * * ?）
                    proxyUser:'',	    //代理用户
                    periodConfig:state,
                    description:describe   //描述信息
                }
            }else{
                _data = {
                    id:id,
                    name:name,//任务名称
                    sql:editor_sql,//需要执行的SQL语句
                    variables:variable,  //SQL语句中的变量（可选参数）
                    datasourceId:conid,	//数据源ID
                    databaseName:database, //数据库名称
                    executePeriod: cycle, //调度周期
                    cronExpr:param_cron,//调度表达式（eg. * 0/5 * * * ?）
                    proxyUser:'',	    //代理用户
                    periodConfig:state,
                    description:describe   //描述信息
                }
            }
            return _data;
        },
        getState: function(type){
            var state_json = {}
            switch(type){
                case '按小时调度':
                    var time = $('#selectMinutes').val();
                    state_json = {'type':'hour','time':time};
                    break;
                case '按天调度':
                    var time = $('.day .time').val();
                    state_json = {'type':'day','time':time};
                    break;
                case '按周调度':
                    var day = '';
                    $('.day-lst input[type="checkbox"]:checked').each(function(){
                        day += $(this).val()+','
                    });
                    day = day.substr(0,day.length-1);
                    var time = $('.week .time').val();
                    state_json = {'type':'week','day':day,'time':time};
                    break;
                case '按月调度':
                    var day = $('#selectDay').val(),
                        time = $('.month .time').val();
                    state_json = {'type':'month','day':day,'time':time};
                    break;
            }

            return JSON.stringify(state_json);
        }
    }
    jobList.init();
})