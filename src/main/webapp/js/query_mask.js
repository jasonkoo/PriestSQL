/**
 * Created by Administrator on 2016/8/26.
 */
$(function(){

    $('.history_container').on('click', '.btn-closed', function () {
        $('.history_container').hide(200);
    });

    $('.myQuery_container').on('click', '.btn-closed', function () {
        $('.myQuery_container').hide(200);
    });

    $('.delete-container').on('click', '.btn-cancel,.btn-closed', function () {
        $('.delete-container').hide(200);
    })
})
