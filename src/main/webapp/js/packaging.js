(function ($) {

    // =========分页==============
    $.fn.extend({
        bootpage:function(obj){
            var total=obj.total,//记录总数
                totalPage=obj.totalPage,//总页数
                currentPage=obj.page,//当前页
                maxPage=obj.maxVisible,//每页最多显示的记录数
                dataNum=obj.dataNum,//每页的记录数
                evtName=obj.evt,//分页点击要触发的方法名
                from='',
                to='',
                dom='';
            dom+='<a href="javascript:;" class="first">首页</a>';
            dom+='<a href="javascript:;" class="prev">&lt上一页</a>';
            dom+='<span>Rows</span>';
            dom+='<span class="from">'+((currentPage-1)*maxPage+1)+'</span>';
            dom+='<span>-</span>';
            dom+='<span class="to">'+((currentPage-1)*maxPage+dataNum)+'</span>';
            dom+='<span>of</span>'
            dom+='<span class="total">'+total+'</span>';
            dom+='<a href="javascript:;" class="next">下一页&gt</a>';
            dom+='<a href="javascript:;" class="last">末页</a>';
            $(this).html(dom);
            var pageChange={
                first:function(){
                    currentPage=1;
                    domHtml();
                    $(this).trigger(evtName,{num:currentPage});
                },
                prev:function(){
                    if(currentPage<=1){
                        currentPage=1;
                    }else{
                        currentPage--;
                        domHtml();
                        $(this).trigger(evtName,{num:currentPage});
                    }
                },
                next:function(){
                    if(currentPage>=totalPage){
                        currentPage=totalPage;
                    }else{
                        currentPage++;
                        domHtml();
                        $(this).trigger(evtName,{num:currentPage});
                    }
                },
                last:function(){
                    currentPage=totalPage;
                    domHtml();
                    $(this).trigger(evtName,{num:currentPage});
                }
            };
            $('.first').on('click',pageChange.first);
            $('.prev').on('click',pageChange.prev);
            $('.next').on('click',pageChange.next);
            $('.last').on('click',pageChange.last);
            var domHtml=function(){
                from=(currentPage-1)*maxPage+1;
                to=(currentPage-1)*maxPage+dataNum*1;
                $('.from').text(from);
                $('.to').text(to);
                $('.total').text(total);
            }
        }
    });
})(jQuery);