/**
 * Created by Administrator on 2016/8/26.
 */
String.prototype.startWith=function (str){
    var reg=new RegExp("^"+str);
    return reg.test(this);
}
$(function(){
    $("#FormLogin").validate({
        rules: {
            userName: {
                required: true
            },
            password: {
                required: true
            }
        },
        messages: {
            userName: {
                required:"请输入用户名",
            },
            password: {
                required:"请输入用户密码"
            }
        },
        errorClass:"loginError",
        errorPlacement: function(error, element) {
            element.parent(".input-group").after(error)
        },
        submitHandler:function(form){
            login.signIn();
        }
    })


    var login={
        signIn:function(){
            var username=$('#FormLogin .loginName').val();
            var password=$('#FormLogin .passWord').val();
            $.ajax({
                url: 'login',
                type:"post",
                data: {
                    'username':username,
                    'password':password
                },
                success: function(data){
                    if(data.code == 0){
                        if(data.errorMessage != null && data.errorMessage.startWith('Timed out')){
                            $(".loginFailed").remove();
                            $(".form-group:last").append("<label class='loginFailed red-font'>请求超时！</label>");
                           // return false;
                        }
                        else if(data.errorMessage != null && data.errorMessage.startWith('login failed')){
                            $(".loginFailed").remove();
                            $(".form-group:last").append("<label class='loginFailed red-font'>用户名或密码错误!</label>");
                            //return false;
                        }
                        else{
                            $(".loginFailed").remove();
                            $(".form-group:last").append("<label class='loginFailed red-font'>系统错误!</label>");
                            //return false;
                        }
                    }
                    else if(data.code == 1){
                        window.location.href = 'queryBrowser.jsp';
                    }
                },
                error:function(data){
                    $(".loginFailed").remove();
                    $(".form-group:last").append("<label class='loginFailed red-font'>登录失败, 系统错误!</label>");
                    return false;
                }
            });
        }
    };
     $('#password').on('keyup',function(e){
         $(".loginFailed").remove();
         var evt=e||window.e;
         var username=$('#FormLogin .loginName').val();
         if(evt.keyCode=='13'&&username!=""){
             $("#FormLogin").submit();
         }
     });
    $("#username").on('keyup', function (e) {
            $(".loginFailed").remove();
            var evt=e||window.e;
            var password=$('#FormLogin .password').val();
            if(evt.keyCode=='13'&&password!=""){
                $("#FormLogin").submit();
            }
    })
    $('#FormLoginBtn').unbind('click').on('click', function () {
        $("#FormLogin").submit();
    });
})