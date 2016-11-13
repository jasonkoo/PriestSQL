/**
 * Created by YueFang on 2016/9/14.
 */


;(function ($,window,document) {

    var DialogPulg = function (config) {
        var _this = this;
        this.config = {
            headerCloseIcon:true,
            dialogType:'info',
            header:{
                _class:"headerClass",
                html: $.i18n.prop('operateTip'),
            },
            height:"auto",
            width:'auto',
            //对话框提示消息
            content:{
                html:"",
                _class:'centerContent'
            },
            //按钮配置
            footer:{
                html:"",
                _class:null,
                buttons:[{
                    _class:"btn-cancel floatRight",
                    text:$.i18n.prop('cancel'),
                    callback: function () {

                    }
                },{
                    _class:"btn-save floatRight",
                    text:$.i18n.prop('sure'),
                    callback: function () {

                    }
                }]
            },
            //延迟设置
            delay:null,
            //类型设置
            maskOpacity:null,
        };
        //扩展默认参数
        if(config && $.isPlainObject(config)){
            this.config =$.extend({},this.config,config);
        }else{
            this.isConfig = true;
        }

        //创建Dom结构
        this.body = $('body');
        //创建mask
        this.mask = $('<div class="dialog-mask">');
        //创建container
        this.container = $('<div class="dialog-cotainer">');
        //创建closeicon
        this.closeIcon = $('<div class="close-icon"></div>');
        //创建header
        this.header = $(' <div class="dialog-header"></div>');
        //创建content
        this.content = $('<div class="dialog-content">');
        //创建footer
        this.footer = $('<div class="dialog-footer">');

        //渲染Dom

        if($(".dialog-mask").is(":visible")){
            $(".dialog-content").html(this.config.content.html);
        }else{
            this.create();
        }
    };
    DialogPulg.prototype ={
        create:function(){
            var _this_ = this,
                config = this.config,
                mask = this.mask,
                container = this.container,
                closeIcon = this.closeIcon,
                header = this.header,
                content = this.content,
                footer = this.footer,
                body = this.body;

            //添加header的关闭图标
            if(config.headerCloseIcon){
                closeIcon.bind('click', function () {
                    _this_.close();
                })
                container.append(closeIcon);
            }
            // 添加header部分
            if(config.header != null){
                this.createHeader(header,config.header);
                container.append(header);
            }
            //container样式
            if(config.height != "auto"){
                container.height(config.height);
            }
            if(config.width !="auto"){
                container.width(config.width);
            }
            if(config.maskOpacity != null){
                mask.css('background',"rgba(0,0,0,"+ config.maskOpacity +")");
            }
            //创建主体内容
            if(config.content != null){
                content.addClass(config.content._class)
                container.append(content.html(config.content.html));
            }
            //创建footer部分内容
            if(config.footer != null){
                footer.html(config.footer.html);
                footer.addClass(config.footer._class);
                if(config.dialogType =='info'){
                    var buttons=[{
                        _class:"btn-save floatRight",
                        text:$.i18n.prop('sure'),
                        callback: function () {

                        }}];
                    this.createBtns(footer,buttons);
                }
                else if(config.footer.buttons != null){
                    this.createBtns(footer,config.footer.buttons);
                }
                container.append(footer);
            }
            body.append(mask.append(container));
        },
        createHeader: function (header,headerConfig) {
            header.html(headerConfig.html);
            header.addClass(headerConfig._class);
        },
        createBtns: function (footer,buttons) {
            var _this_ = this;
            $(buttons).each(function (i) {
                var type = this._class,
                    text = this.text,
                    callback = this.callback,
                    _class = 'class="'+type+'"';
                var _btn = $("<button class='public-btn "+ type  +"'>"+ text +"</button>");
                if(callback){
                    _btn.unbind('click').bind('click',function(){
                        callback();
                        _this_.close();
                    });
                }else{
                    _this_.close();
                }
                footer.append(_btn);
            })
        },
        close: function () {
            var mask = this.mask;
            mask.remove();
        }
    };
    window.DialogPulg = DialogPulg;

})(jQuery,window,document)
