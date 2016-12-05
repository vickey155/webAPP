;
$(function () {
    $("input[type=date]").on("input",function(){
        if($(this).val().length>0){
            $(this).addClass("full");
        }
        else{
            $(this).removeClass("full");
        }
    });
    function insertTitle(path){
        var test1 = path.lastIndexOf("/");  //对路径进行截取
        var test2 = path.lastIndexOf("\\");  //对路径进行截取
        var test= Math.max(test1, test2)
        if(test<0){
           return path;
        }else{
            return path.substring(test + 1);
        }
    }
    $("input[type=file]").on("change",function(){
        var inputWrapper = $(this).closest('.inputFile');
        if($(this).val() !== ''){
            var fileName = insertTitle($(this).val());
            inputWrapper.find('span').html(fileName);
        }
        else{
            inputWrapper.find('span').html('上传图片');
        }
    });

    $(document).on('change','select',function () {
        var self = $(this);
        var selectedVal = $.trim(self.find("option:selected").val());
        if(selectedVal === '' && self.hasClass('selected')){
             self.removeClass('selected');
        }
        else if(selectedVal != '' && !self.hasClass('selected')){
            self.addClass('selected');
        }
    });
   //地区联动
    $(".region-select").regionSelect();
  //申请页有无隐藏
   if($(".loan-applay-second")[0]){
      $(".filter-select").each(function(){
          var self = $(this);
          self.on('change',function(){
              var selectedOpt = self.find("option:selected");
              var selectedVal = $.trim(selectedOpt.val());
              var isHide = selectedOpt.data("hide");
              console.log(typeof isHide);
              var secHide = self.closest('.bg-white').find(".sec-hide");
              if(isHide == true || selectedVal === ''){
                  secHide.hide();
              }
              else{
                  secHide.show();
              }
          });
      });


   }

   //下拉刷新
    if($("#scrollWrap")[0]){
        var myScroll,
            downIcon = $("#down-icon"),
            upIcon = $("#up-icon");
        myScroll = new IScroll("#scrollWrap",{probeType: 3, mouseWheel: true});
        myScroll.on("scroll",function(){
            var y = this.y,
                maxY = this.maxScrollY - y,
                downHasClass = downIcon.hasClass("reverse_icon"),
                upHasClass = upIcon.hasClass("reverse_icon");

            if(y >= 40){
                !downHasClass && downIcon.addClass("reverse_icon");
                return "";
            }else if(y < 40 && y > 0){
                downHasClass && downIcon.removeClass("reverse_icon");
                return "";
            }

            if(maxY >= 40){
                !upHasClass && upIcon.addClass("reverse_icon");
                return "";
            }else if(maxY < 40 && maxY >=0){
                upHasClass && upIcon.removeClass("reverse_icon");
                return "";
            }
        });

        myScroll.on("slideDown",function(){
            if(this.y > 40){
                alert("slideDown");
                upIcon.removeClass("reverse_icon")
            }
        });

        myScroll.on("slideUp",function(){
            if(this.maxScrollY - this.y > 40){
                alert("slideUp");
                upIcon.removeClass("reverse_icon")
            }
        });
    }











})
    






