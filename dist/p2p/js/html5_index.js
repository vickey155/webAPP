var yinp_tip     = "请验证滑动验证码!";
var name_tip     = '有必须项没有填写';
var mobile_tip   = '请输入正确的手机号';
var username_tip = '请输入正确的姓名';
var yzm_tip      = '请输入职位';
var email_tip    = '请输入正确的邮箱格式';
var money        = 0;
var mcodeUrl     = app_web_site+'Html5/VerifyLoginServlet';//获取验证码
var mh5Url       = app_web_site+'Html5';//Html5 index页面
var cityUrl      = app_web_site+"Html5/city";//获取所有城市列表

Zepto(function($){
    var aType   = '';
    var strType = '';
    var step = '';
    FastClick.attach(document.body);

    //生成option列表
    createSelect = function(arr,obj,msg){
        var opt =' <option value="-1" selected="selected">请选择</option>';
        $.each(arr, function(index, item){
            if(msg=='99'){
                opt += "<option value='"+item.id+"'>" + item.val +"</option>";
            }else{
                opt += "<option value='"+item+"'>" + item + msg +"</option>";
            }
        });
        $('#'+obj).html(opt);
    };

    //初始化页面参数
    initConfig = function (ctype){
        if(ctype=='personal'){
            //personal
            var selectArr = ["cpMillion","cpThousand","work_year","work_month","use_company","credit_card","salary_bank_private","is_fund","is_security","house_type","profession"];
            $.each(selectArr, function(index, item){
                var dataType = $("#"+item).attr('data-type');
                switch(dataType){
                    case '2' : 
                        var narr = config_obj.apply_pub.date_range[0].val.split(',');
                        createSelect(narr,item,'年');
                        break;
                    case '3' : 
                        var yarr = config_obj.apply_pub.date_range[1].val.split(',');           
                        createSelect(yarr,item,'月');
                        break;
                    case '4' :
                        var srArrWan = config_obj.personal.salary_bank_public[0].val.split(',');
                        createSelect(srArrWan,item,'万');
                        break;
                    case '5' :
                        var srArrQian = config_obj.personal.salary_bank_public[1].val.split(',');
                        createSelect(srArrQian,item,'千');
                        break;
                    default:
                        var def = eval("config_obj.personal."+item);
                        createSelect(def,item,'99');
                }
            });
        }else if(ctype=='company'){
            //company
            var selectArr_company = ["qi_company_house_type","csMillion","csThousand","qi_cpMillion","qi_cpThousand","qy_year","qy_month","qi_use_company","qi_has_debt","qi_industry","qi_has_loan","qi_marriage"];
            $.each(selectArr_company, function(index, item){
                var dataCompType = $("#"+item).attr('data-type');
                switch(dataCompType){
                    case '2' : 
                        var narr = config_obj.apply_pub.date_range[0].val.split(',');
                        createSelect(narr,item,'年');
                        break;
                    case '3' : 
                        var yarr = config_obj.apply_pub.date_range[1].val.split(',');           
                        createSelect(yarr,item,'月');
                        break;
                    case '4' :
                        var srArrWan = config_obj.company.salary_bank_public[0].val.split(',');
                        createSelect(srArrWan,item,'万');
                        break;
                    case '5' :
                        var srArrQian = config_obj.company.salary_bank_public[1].val.split(',');
                        createSelect(srArrQian,item,'千');
                        break;
                    case '6' :
                        var qi_marriage = config_obj.apply_pub.marriage;
                        createSelect(qi_marriage,item,'99');
                        break;               
                    default:
                        var def = eval("config_obj.company."+item.substring(3));
                        createSelect(def,item,'99');
                }
            });
        }else{
            var selectPubArr = ["w_money","q_money","year","month","marriage","carType","qi_year","qi_month","qi_carType"];
            $.each(selectPubArr, function(index, item){
                var dataPubType = $("#"+item).attr('data-type');
                switch(dataPubType){
                    case '0' :
                        var arr = config_obj.apply_pub.money[0].val.split(',');
                        createSelect(arr,item,'万');
                        break;
                    case '1' :
                        var qarr = config_obj.apply_pub.money[1].val.split(',');
                        createSelect(qarr,item,'千');
                        break;
                    case '2' : 
                        var narr = config_obj.apply_pub.date_range[0].val.split(',');
                        createSelect(narr,item,'年');
                        break;
                    case '3' : 
                        var yarr = config_obj.apply_pub.date_range[1].val.split(',');           
                        createSelect(yarr,item,'月');
                        break;
                    case '6' :
                        var marriage = config_obj.apply_pub.marriage;
                        createSelect(marriage,item,'99');
                        break;
                    case '7' :
                        var car_type = config_obj.apply_pub.car_type;
                        createSelect(car_type,item,'99');
                        break;
                }
            });
        }
        $('select').UISelect();
    }
    
    //选择不同类型 初始化参数不同
    $('#appyType').on('change', function(e){
        aType   = parseInt($(this).val());
        strType = (aType==1)?'personal':'company';
        initConfig(strType);    //初始化页面参数   
        $("#oneStep").attr("data-type",aType);
    });
    initConfig('pub');//初始化第一页内容

    //计算机构随机数 ----------------------------------start------------------------------------
    jigou_rand = function(){
        var numState = 0;
        var nowNum;
        var oldNum;
        oldNum = $('#jigou_'+strType).html();
        $('body').on('change', '.detail select', function () {
            $(this).attr('data-state', numState);
            var state = $(this).attr('data-state');
            var id = $(this).attr('id');
            nowNum = parseInt($('#jigou_'+strType).html());
            if (id == 'has_debt' || id=='qi_has_debt' || (id == 'house_type' && $('#is_fund').length >0)) {
                getRandom(id, nowNum, state, 10, 20);
                $(this).attr('data-state', 0);
                numState = 0;
            }
            if (id == 'industry' ||  id=='qi_industry' || ($('#is_fund').length > 0 && id == 'carType')) {
                getRandom(id, nowNum, state, 20, 30);
                $(this).attr('data-state', 0);
                numState = 0;
            }
            //geren  house_type carType is_fund is_security marriage profession
            if (id == 'is_fund' || id == 'is_security') {
                getRandom(id, nowNum, state, 30, 40);
                $(this).attr('data-state', 0);
                numState = 0;
            }

            if (id == 'marriage' || id =='qi_marriage') {
                getRandom(id, nowNum, state, 40, 50);
                $(this).attr('data-state', 0);
                numState = 0;
            }
            if (id == 'has_loan' || id=='qi_has_loan' || id == 'profession') {
                getRandom(id, nowNum, state, 50, 80);
                $(this).attr('data-state', 0);
                numState = 0;
            }
        });
    }

    getRandom = function (obj, nowNum, state, min, max) {
        if ($('#' + obj).val() > 0) {
            if (state == 0) {
                nowNum += GetRandomNum(min, max);
                var maxNum = GetRandomNum(150, 200);
                nowNum = (nowNum > 200) ? maxNum : nowNum;
                $('#jigou_'+strType).html(nowNum);
                $('#' + obj).attr('data-state', 1);
                numState = 1;
                return false;
            }
        } else {
            nowNum -= GetRandomNum(min, max);
            nowNum = ((nowNum < oldNum) || (nowNum < 0)) ? oldNum : nowNum;
            $('#jigou_'+strType).html(nowNum);
            $('#' + obj).attr('data-state', 0);
            numState = 0;
            return false;
        }
    }
    //计算机构随机数 ----------------------------------end------------------------------------
    
    //send verify_code
    var iTime = 60, oTime = null;
    $('#getcode').click(function () {
        $("#getcode").attr("disabled", true); 
        var mobile = $("#phone").val();
        var token  = $("#smstk").val();
        var appid  = $("#appid").val();
        var username  = $("#username").val();
        var geetest_challenge = $(".geetest_challenge").val();
        var geetest_validate  = $(".geetest_validate").val();
        var geetest_seccode   = $(".geetest_seccode").val();

        if(username==''){
            alert('有必须项没有填写');
            $("#getcode").removeAttr("disabled"); 
            return false;
        }else if(!checkChname(username)){
            alert('请输入正确的姓名');
            $("#getcode").removeAttr("disabled");
            return false;
        }

        if(mobile==''){
            alert('有必须项没有填写');
            $("#getcode").removeAttr("disabled"); 
            return false;
        }else if(!checkMobile(mobile)){
            alert('请输入正确的手机号');
            $("#getcode").removeAttr("disabled");
            return false;
        }

            $.post('/Html5/VerifyLoginServlet',{geetest_challenge:geetest_challenge,geetest_validate:geetest_validate,geetest_seccode:geetest_seccode,'mobile': mobile,'token':token,'appid':appid},function (yzmdata) {
                if(yzmdata.rs_code!=1000){
                    geetestObj.refresh();
                    alert('请滑动图形验证码');
                    $("#getcode").removeAttr("disabled"); 
                }else{
                    $(".geetest_validate").val(geetest_validate);
                    $(".geetest_challenge").val(geetest_challenge);
                    $(".geetest_seccode").val(geetest_seccode);
                    if (mobile!='') {
	                    if (yzmdata.rs_code != 1000) {
	                        $("#getcode").removeAttr("disabled"); 
	                        alert(yzmdata.rs_msg);
	                        breakCode();
	                    } else {
	                        oTime = setInterval(function () {
	                            if (iTime < 1) {
	                                $('#waiting').attr('id', 'getcode');
	                                $('#getcode').html('获取验证码');
	                                clearInterval(oTime);
	                                iTime = 60;
	                                $("#getcode").css('color', '#232323');
	                                $("#getcode").removeAttr("disabled");
	                            } else {
	                                $('#getcode').attr('id', 'waiting');
	                                $('#waiting').html('重新获取(' + iTime + ')');
	                                $('#waiting').css('color', '');
	                                iTime--;
	                            }
	                        }, 1000);
	                    }
                    }else{
                        $("#getcode").removeAttr("disabled"); 
                        var username = $('#username').val();
                        if(!checkChname(username)){
                            $("#username").css('color','red');
                            $("#username").val(username_tip);
                            alert('姓名必须填写');
                        }else if(!checkMobile(mobile)){
                            $("#phone").css('color','red');
                            $("#phone").val(mobile_tip);
                        }
                    }
                }
            });
        
    });

    //第一步
    $("#oneStep").on('click',function(){
        var res = checkData();//验证表单数据并返回数据
        res['verify_code'] = $("#verify_code").val();
        res['step']        = '1';
        res['channel']     = $("#channel").val();
        if(res){
/*           if($("#pic_verify").val()==''){
               alert(yinp_tip);
               return false;
           }*/
            if(!checkYzm($('.yzm').val())){
                alert('手机验证码有误');
                return false;
            }
            $(".loading_cover").show();
            //ajax-入库
            $.post(mh5Url, res, function (data) {
                console.log(data);
                if (data.rs_code != 1000 ) {
                    $(".loading_cover").hide();
                    alert(data.rs_msg);
                } else {
                    $(".loading_cover").hide();
                    if(data.details.url==''){
                        var stepObj = "step_"+strType+data.details.step;
                        step = data.details.step;
                        $("#"+stepObj).attr('data-id',data.details.iu_id);
                        $('#firstStep').hide();
                        $("#banner").hide();
                        $("#navBanner").hide();
                        $('#'+strType+aType).show();                               
                    }else{
                        $('.wrap').hide();
                        $("#gerenppsuccess").show();
                        $("#ppurl").attr('href',data.details.url,'_blank');
                        setTimeout(function () {                      
                            window.location.href=data.details.url;
                        }, 2000);
                    }
                }  
            });
        }else{
            $(".loading_cover").hide();
        }
    });

    //二三步
    $(".upbut").on('click',function(){
        var nowDom = $(this);
        var html_val = '下一步';
        if(nowDom.attr('next')=='1'){
            return false;
        }else{
            nowDom.attr('next', '1').html("提交中..");
        }
        var res = checkData();//验证表单数据并返回数据
        if(res==false){
            nowDom.html(html_val).attr('next', '0');
        }
        res['iu_id']   = $("#step_"+strType+step).attr('data-id');
        res['step']    = step;
        res['type']    = aType;
        res['channel'] = $("#channel").val();
        if(res){
            $(".loading_cover").show();
            //ajax-入库
            $.post(mh5Url, res, function (data) {
                console.log();
                if (data.rs_code != 1000) {
                    $(".loading_cover").hide();
                    alert(data.rs_msg);
                    nowDom.html(html_val).attr('next', '0');
                } else {
                    $(".loading_cover").hide();
                    if(data.details.url==''){
                        var stepObj = "step_"+strType+data.details.step;
                        step = data.details.step;
                        $("#"+stepObj).attr('data-id',data.details.iu_id);
                        if(data.details.step =='3'){
                            $('#jigou_'+strType).html(Math.floor(Math.random() * 10+1));   //初始化1-10之间
                            jigou_rand();
                        }
                        if(data.details.step =='4'){
                            $("#"+strType+"3").hide();
                            var preType   = (strType=='company')?'qi_':'';
                            var moneyQian = (parseInt($("#q_money").val()) >0)?$("#q_money").val():'0';
                            if($("#w_money").val() < 0 ){
                                var dkje      = moneyQian+'千';
                            }else{
                                var dkje      = $("#w_money").val()+'.'+moneyQian+'万';
                            }
                            //var dkje      = $("#w_money").val()+'.'+moneyQian;
                            $("#amount-num").html(dkje);
                            var show_money_num = Math.ceil(dkje*10000/(90000000/100));
                            if(show_money_num>100) show_money_num=100;
                            if(show_money_num<1) show_money_num=1;
                            $(".progress").css('width', show_money_num+'%');
                            var qixian = parseInt((($("#year").val())*12))+parseInt($("#month").val());
                            if(qixian<0){
                                qixian = parseInt($("#month").val());
                            }
                            
                            if(parseInt($("#month").val())<0){
                                qixian = parseInt((($("#year").val())*12));
                            }
                             //机构数
                            $("#jgnum").html(GetRandomNum(0,200));
                            $("#month-num").html(qixian);
                            $("#fourStep").show();
                        }else{
                            $('#'+strType+aType).hide();
                            $("#"+strType+"3").show();
                        }
                        $("#banner").hide();
                        $("#navBanner").hide();
                        /*var lastJigou = $('#jigou_'+strType).html();
                        $("#jgnum").html(lastJigou);*/
                    }else{
                        $('.wrap').hide();
                        if(data.details.url=='http://m.niiwoo.com/regist/regTmj.html?s=haodai'){
                            $("#cqdaisuccess").show();
                            $("#cqurl").attr('href',data.details.url,'_blank');  
                        }else{
                            $("#gerenppsuccess").show();
                            $("#ppurl").attr('href',data.details.url,'_blank');
                        }
                        setTimeout(function () {                      
                            window.location.href=data.details.url;
                        }, 2000);
                    }
                }
            });
        }
        
    });

    //上一步
    $(".prevstep").on('click',function(){
        var nowDom = $("#"+$(this).attr('uppage'));
        step=step-1;
        $("#"+strType+"3").hide();
        $("#"+strType+aType).show();
        nowDom.html("下一步").attr('next', '0');
    });

    //加载城市事件
    $('body').on('click', '#zone_ids,#gr_zone_ids', function () {
        var zid = $(this).attr('id');
        if ($('.container').length == 0) {
            $.ajax({
                type: "POST",
                url: cityUrl,
                dataType: 'json',
                beforeSend: function () {
                    $('.body1').hide();
                    $('<section class="body2"><div class="container"><p id="loadText" style="text-align: center;line-height: ' + $(window).height() + 'px">加载中......</p></div></section>').appendTo('body');
                    //$('.container').css('min-height', $(window).height() + 'px');
                },
                error: function () {
                    $('.body1').show();
                    $('.body2').remove();
                    alert('加载失败，请重试！');
                },
                success: function (data) {
                    $('#loadText').remove();
                    initCity(data, zid);
                }
            });
        } else {
            $('.body2,.letter').show();
            $('.body1').hide();
            $('body').scrollTop(0);
        }
    });

    //----------------------选择城市 start -----------------------------------------
    $('body').on('click', '.city-list p', function () {
        var type = $('.container').data('type');
        //$('#' + type).html($(this).html()).attr('data-id', $(this).attr('data-id'));
        $('#zone_ids').html($(this).html()).attr('data-id', $(this).attr('data-id'));
        $('#gr_zone_ids').html($(this).html()).attr('data-id', $(this).attr('data-id'));
        $('.body2,.letter').hide();
        $('.body1').show();
        $('body').scrollTop(190);
    });

    // $('body').on('click', '.letter a', function () {
    //     var s = $(this).html();
    //     $(window).scrollTop($('#' + s + '1').offset().top);
    // });
    //----------------------选择城市 end -----------------------------------------
    
    //姓名
    $('.username').focus(function(){
        if($(this).val() == username_tip){
            $(this).css('color','#333');
            $(this).val('');
        }
    });

    //验证码
    $('.yinp').focus(function(){
        if($(this).val() == yinp_tip){
            $(this).css('color','#333');
            $(this).val('');
        }
    });

    //手机号码 获得焦点
    $('.mobile').focus(function(){
        if($(this).val() == mobile_tip){
            $(this).css('color','#333');
            $(this).val('');
        }
    });

    //个人身份证号码
    $('#iden_card').focus(function(){
        if($(this).val() == '请输入正确的身份证号码'){
            $(this).css('color','#333');
            $(this).val('');
        }
    });

    //企业身份证号码
    $('#q_iden_card').focus(function(){
        if($(this).val() == '请输入正确的身份证号码'){
            $(this).css('color','#333');
            $(this).val('');
        }
    });

    //姓名 失去焦点
    $('.username').blur(function(){
        if(!checkChname($(this).val())){
            $(this).css('color','red');
            $(this).val(username_tip);
        }
    });

    //手机号码 
    $('.mobile').blur(function(){
        if(!checkMobile($(this).val())){
            $(this).css('color','red');
            $(this).val(mobile_tip);
        }
    });
    
    //贷款期限
    $('#year,#qi_year').change(function(){
        if($(this).val() >= 30){
            $('#month,#qi_month').parent('.sel2').hide();
        }else{
            $('#month,#qi_month').parent('.sel2').css({'transform-origin':'none','transform':'none','display':'block'});
        }
    });

    //贷款额度
    $('#w_money').change(function(){
        if($(this).val() >= 10){
            $('#q_money').parent('.sel2').hide();
        }else{
            $('#q_money').parent('.sel2').css({'transform-origin':'none','transform':'none','display':'block'});
        }
    });

    //个人计算 预估可贷款
    $('#personal1 .detail select').change(function(){
        var money     = initMoney();
        var money_num = 0;
        var income    = parseInt(($('#cpMillion').val() > 0 ? $('#cpMillion').val() : 0) * 10000) + parseInt(($('#cpThousand').val() > 0 ? $('#cpThousand').val() : 0) * 1000);
        var work_time = parseInt(($('#work_year').val() > 0 ? $('#work_year').val() : 0) * 12) + parseInt($('#work_month').val() > 0 ? $('#work_month').val() : 0);
        var issue     = parseInt($('#salary_bank_private').val() > 0 ? $('#salary_bank_private').val() : 0);
        var id        = $(this).attr('id');
        
        if(id == 'cpMillion'){
            income = parseInt(($(this).val() > 0 ? $(this).val() : 0) * 10000) + parseInt(($('#cpThousand').val() > 0 ? $('#cpThousand').val() : 0) * 1000);
        }else if(id == 'cpThousand'){
            income = parseInt(($(this).val() >= 0 ? $(this).val() : 0) * 1000) + parseInt(($('#cpMillion').val() > 0 ? $('#cpMillion').val() : 0) * 10000);
        }else if(id == 'work_year'){
            work_time = parseInt(($(this).val() > 0 ? $(this).val() : 0) * 12) + parseInt($('#work_month').val() > 0 ? $('#work_month').val() : 0);
        }else if(id == 'work_month'){
            work_time = parseInt($(this).val() > 0 ? $(this).val() : 0) + parseInt(($('#work_year').val() > 0 ? $('#work_year').val() : 0) * 12);
        }else if(id == 'salary_bank_private'){
            issue = parseInt($(this).val() > 0 ? $(this).val() : 0);
        }
        
        if(income < 4000){
            income_b = 0.9;
        }else if(income >= 4000 && income < 8000){
            income_b = 1;
        }else if(income >= 8000 && income < 15000){
            income_b = 1.1;
        }else if(income >= 15000){
            income_b = 1.2;
        }
        if(work_time < 3){
            work_time_b = 0.8;
        }else if(work_time >= 3 && work_time <= 5){
            work_time_b = 0.9;
        }else if(work_time >=6 && work_time <= 11){
            work_time_b = 1;
        }else if(work_time >= 12 && work_time <= 36){
            work_time_b = 1.1;
        }else if(work_time >= 37 && work_time <= 84){
            work_time_b = 1.2;
        }else if(work_time > 84){
            work_time_b = 1.3;
        }
        if(issue == 1 || issue == 2){
            issue_b = 1;
        }else if(issue == 3){
            issue_b = 0.9;
        }else if(issue == 4){
            issue_b = 0.8;
        }else{
            issue_b = 0.8;
        }
        money_num = Math.round((money * income_b * work_time_b * issue_b) * 1.5);
        //console.log('z='+money_num+' money='+money+' income_b='+income_b+' work_time_b='+work_time_b+' issue_b='+issue_b);
        if(money_num >= money){
            money_num = money;
        }
        $('.money ins').html(money_num);
        
    });
    
    //企业计算 预估可贷款
    $('#company2 .detail select').change(function(){
        var money     = initMoney();
        var money_num = 0;
        var house     = parseInt($('#qi_company_house_type').val());
        var car       = parseInt($('#qi_carType').val());
        var license   = parseInt(($('#qy_year').val() > 0 ? $('#qy_year').val() : 0) * 12)  + parseInt($('#qy_month').val() > 0 ? $('#qy_month').val() : 0);
        var id        = $(this).attr('id');
        
        if(id == 'qi_company_house_type'){
            house = parseInt($(this).val());
        }else if(id == 'qi_carType'){
            car = parseInt($(this).val());
        }else if(id == 'qy_year'){
            license = parseInt(($(this).val() > 0 ? $(this).val() : 0) * 12)  + parseInt($('#qy_month').val() > 0 ? $('#qy_month').val() : 0);
        }else if(id == 'qy_month'){
            license = parseInt($(this).val() > 0 ? $(this).val() : 0) + parseInt(($('#qy_year').val() > 0 ? $('#qy_year').val() : 0) * 12);
        }
        
        if(house == 1){
            house_b = 0.8;
        }else if(house == 2){
            house_b = 1;
        }else if(house == 3){
            house_b = 0.9;
        }else if(house == 4){
            house_b = 1.3;
        }else if(house == 5){
            house_b = 1.2;
        }else if(house == 6){
            house_b = 1.2;
        }else if(house == 7){
            house_b = 1.1;
        }else{//其他
            house_b = 0.8;
        }
        if(car == 1){
            car_b = 0.9;
        }else if(car == 2){
            car_b = 1.1;
        }else if(car == 3){
            car_b = 1;
        }else{
            car_b = 0.9;
        }
        if(license <= 12){
            license_b = 0.9;
        }else if(license > 12 && license <= 36){
            license_b = 1;
        }else if(license > 36 && license <= 60){
            license_b = 1.1;
        }else if(license > 60 && license <= 120){
            license_b = 1.2;
        }else{
            license_b = 1.3;
        }
        money_num = Math.round((money * house_b * car_b * license_b) * 1.5);
        //console.log('money='+money+' house_b='+house_b+' car_b='+car_b+' license_b='+license_b);
        if(money_num >= money){
            money_num = money;
        }
        $('.money ins').html(money_num);

    });  
});

//获取指定随机数
function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return parseInt(Min + Math.round(Rand * Range));
}

//初始化城市
function initCity(data, id) {
    $('.container').data('type', id);
    if ($('.container').find('.city').length > 0) {
        $('.body2,.letter').show();
        $('.body1').hide();
        $('body').scrollTop(0);
    } else {
        var str = '<div class="city">', strLetter = '<div class="letter"><ul>';
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var cityCon = '<div class="city-list" id="' + key + '1">',
                    strCon = '<span class="city-letter">' + key + '</span>';
                strLetter += '<li><a href="#' + key + '1">' + key + '</a></li>';
                $.each(data[key], function (i, item) {
                    strCon += '<p data-id="' + item.zone_id + '">' + item.zone_name + '</p>'
                });
                cityCon = cityCon + strCon + '</div>';
                str += cityCon;
            }
        }
        str = str + '</div>';
        strLetter += '</ul></div>';
        $('.container').html(str/* + strLetter*/);
        $('body').append(strLetter);
    }
}

//初始化金额
function initMoney(){
    var w_money = parseInt($('#w_money option:selected').val());
    var q_money = parseInt($('#q_money option:selected').val());
    if(w_money <= 0){w_money = 0;}
    if(q_money <= 0){q_money = 0;}
    return w_money * 10000 + q_money * 1000;
}

//刷新图片验证码函数
function breakCode(){
    $('#affCode_yzm').click();
    $("#getcode").removeAttr("disabled"); 
}

//----------------------验证表单数据并返回数据 start-----------------------------------------
function checkData(){
    var id_name = $('.main:visible').attr('id');
    var bool = true;
    var data = {};
    var username = $('#username').val();
    
    if(id_name == 'firstStep'){//初始化页面

        var dk_type = $('#appyType').val();
        var mobile  = $('.mobile').val();
        var yzm     = $('.yzm').val();
        var w_money = parseInt($('#w_money option:selected').val());
        var q_money = parseInt($('#q_money option:selected').val());
        var year    = parseInt($('#year option:selected').val());
        var month   = parseInt($('#month option:selected').val());
        
        if(!checkChname(username)){
            $('.username').css('color','red');
            $('.username').val(username_tip);
            bool = false;
        }else if(!checkMobile(mobile)){
            $('.mobile').css('color','red');
            $('.mobile').val(mobile_tip);
            bool = false;
        }
        if((year <= 0 && month <= 0) || dk_type <= 0  || (w_money <= 0 && q_money <= 0)){
            bool = false;
        }
        if(year < 0){year = 0;}
        if(month < 0){month = 0;}
        if(w_money < 0){w_money = 0;}
        if(q_money < 0){q_money = 0;}
        if(bool){
            data.month = year * 12 + month;
            data.type = dk_type;
            data.username = username;
            data.mobile = mobile;
            data.money = w_money * 10000 + q_money * 1000;
        }else{
            alert(name_tip);
        }

    }else if(id_name == 'personal1'){//个人第一步
        
        var use_company         = parseInt($('#use_company option:selected').val());
        var city                = parseInt($('#gr_zone_ids').attr('data-id'));
        var cpMillion           = parseInt($('#cpMillion option:selected').val());
        var cpThousand          = parseInt($('#cpThousand option:selected').val());
        var salary_bank_private = parseInt($('#salary_bank_private option:selected').val());
        var work_year           = parseInt($('#work_year option:selected').val());
        var work_month          = parseInt($('#work_month option:selected').val());
        var credit_card         = parseInt($('#credit_card option:selected').val());
        
        if(use_company < 0 || (cpMillion <= 0 && cpThousand <= 0) || salary_bank_private <= 0 || (work_year <= 0 && work_month <= 0) || credit_card <= 0 ){
            bool = false;
        }
        if(cpMillion < 0){cpMillion   = 0;}
        if(cpThousand < 0){cpThousand = 0;}
        if(work_year < 0){work_year   = 0;}
        if(work_month < 0){work_month = 0;}
        if(bool){
            data.use_company         = use_company;
            data.zone_id             = city;
            data.salary_bank_public  = cpMillion * 10000 + cpThousand * 1000;
            data.salary_bank_private = salary_bank_private;
            data.work_license        = work_year * 12 + work_month;
            data.credit_card         = credit_card;
        }else{
            alert(name_tip);
        }
    }else if(id_name == 'personal3'){//个人第二步
        
        var house_type  = parseInt($('#house_type option:selected').val());
        var carType     = parseInt($('#carType option:selected').val());
        var is_fund     = parseInt($('#is_fund option:selected').val());
        var is_security = parseInt($('#is_security option:selected').val());
        var marriage    = parseInt($('#marriage option:selected').val());
        var profession  = parseInt($('#profession option:selected').val());
        var iden_card   = $('#iden_card').val();
        
        if(house_type <= 0 || carType <= 0 || is_fund <= 0 || is_security <= 0 || is_security <= 0 || marriage <= 0 || profession <= 0 || !checkIDcard(iden_card)){
            bool = false;
        }
        if(bool){
            data.house_type  = house_type;
            data.car_type    = carType;
            data.is_fund     = is_fund;
            data.is_security = is_security;
            data.marriage    = marriage;
            data.profession  = profession;
            data.iden_card   = iden_card;
        }else if(house_type <= 0 || carType <= 0 || is_fund <= 0 || is_security <= 0 || is_security <= 0 || marriage <= 0 || profession <= 0){
            alert(name_tip);
        }else if(!checkIDcard(iden_card)){
            $('#iden_card').css('color','red');
            $('#iden_card').val('请输入正确的身份证号码');
            bool = false;
        }
    }else if(id_name == 'company2'){//企业第一步
        
        var qi_company_house_type = parseInt($('#qi_company_house_type option:selected').val());
        var qi_carType            = parseInt($('#qi_carType option:selected').val());
        var csMillion             = parseInt($('#csMillion option:selected').val());
        var csThousand            = parseInt($('#csThousand option:selected').val());
        var qi_cpMillion          = parseInt($('#qi_cpMillion option:selected').val());
        var qi_cpThousand         = parseInt($('#qi_cpThousand option:selected').val());
        var qy_year               = parseInt($('#qy_year option:selected').val());
        var qy_month              = parseInt($('#qy_month option:selected').val());
        var city                  = parseInt($('#zone_ids').attr('data-id'));
        var qi_use_company        = parseInt($('#qi_use_company option:selected').val());
        
        if( qi_company_house_type <= 0 || qi_carType <= 0 || (csMillion <= 0 && csThousand <= 0) || (qi_cpMillion <= 0 && qi_cpThousand <= 0) || (qy_year <= 0 && qy_month <= 0) || qi_use_company <= 0){
            bool = false;
        }
        if(csMillion < 0){csMillion = 0;}
        if(csThousand < 0){csThousand = 0;}
        if(qi_cpMillion < 0){qi_cpMillion = 0;}
        if(qi_cpThousand < 0){qi_cpThousand = 0;}
        if(qy_year < 0){qy_year = 0;}
        if(qy_month < 0){qy_month = 0;}
        if(bool){
            data.house_type          = qi_company_house_type;
            data.car_type            = qi_carType;
            data.salary_bank_private = csMillion * 10000 + csThousand * 1000;
            data.salary_bank_public  = qi_cpMillion * 10000 + qi_cpThousand * 1000;
            data.work_license        = qy_year * 12 + qy_month;
            data.zone_id             = city;
            data.use_company         = qi_use_company;
        }else{
            alert(name_tip);
        }
    }else if(id_name == 'company3'){//企业第二步
        
        var qi_has_debt = parseInt($('#qi_has_debt option:selected').val());
        var qi_industry = parseInt($('#qi_industry option:selected').val());
        var iden_card   = $('#q_iden_card').val();
        var qi_marriage = parseInt($('#qi_marriage option:selected').val());
        var qi_has_loan = parseInt($('#qi_has_loan option:selected').val());
        
        if( qi_has_debt <= 0 || qi_industry <= 0 || iden_card <= 0 || qi_marriage <= 0 || qi_has_loan <= 0){
            bool = false;
        }                
        if(bool){
            data.has_debt  = qi_has_debt;
            data.industry  = qi_industry;   
            data.iden_card = iden_card;
            data.marriage  = qi_marriage;
            data.has_loan  = qi_has_loan;
        }else if(qi_has_debt <= 0 || qi_industry <= 0 ){
            alert(name_tip);
        }else if( iden_card <= 0 && !checkIDcard(iden_card)){
            $('#q_iden_card').css('color','red');
            $('#q_iden_card').val('请输入正确的身份证号码');
        }else if( qi_marriage <= 0 || qi_has_loan <= 0 ){
            alert(name_tip);
        }
    }

    if(bool){
        return data;
    }else{
        return false;
    }
    
}
//----------------------验证表单数据并返回数据 end-----------------------------------------