;
$(function () {
    $("input[type=date]").on("input", function () {
        if ($(this).val().length > 0) {
            $(this).addClass("full");
        } else {
            $(this).removeClass("full");
        }
    });
    $("input[type=file]").on("change", function () {
        if ($(this).val() !== '') {
            // alert(0);
            var fileName = $(this).val();
            $(this).closest('.inputFile').attr('placeholder', fileName);
        } else {
            $(this).closest('.inputFile').attr('placeholder', '上传图片');
        }
    });

    $(document).on('change', 'select', function () {
        var self = $(this);
        var selectedVal = $.trim(self.find("option:selected").val());
        if (selectedVal === '' && self.hasClass('selected')) {
            self.removeClass('selected');
        } else if (selectedVal != '' && !self.hasClass('selected')) {
            self.addClass('selected');
        }
    });
    //地区联动
    $(".region-select").regionSelect();
    //申请页有无隐藏
    if ($(".loan-applay-second")[0]) {
        $(".filter-select").each(function () {
            var self = $(this);
            self.on('change', function () {
                var selectedOpt = self.find("option:selected");
                var selectedVal = $.trim(selectedOpt.val());
                var isHide = selectedOpt.data("hide");
                console.log(typeof isHide);
                var secHide = self.closest('.bg-white').find(".sec-hide");
                if (isHide == true || selectedVal === '') {
                    secHide.hide();
                } else {
                    secHide.show();
                }
            });
        });
    }
});