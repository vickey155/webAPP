$(function () {
  'use strict';

  //下拉刷新页面
  $(document).on("pageInit", "#page-ptr", function(e, id, page) {
    var $content = $(page).find(".content").on('refresh', function(e) {
      // 模拟2s的加载过程
      setTimeout(function() {
        var cardHTML = '<div class="card">' +
          '<div class="card-header">标题</div>' +
          '<div class="card-content">' +
          '<div class="card-content-inner">内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容' +
          '</div>' +
          '</div>' +
          '</div>';

        $content.find('.card-container').prepend(cardHTML);
        // $(window).scrollTop(0);
        // 加载完毕需要重置
        $.pullToRefreshDone($content);
      }, 2000);
    });
  });

  //无限滚动
  $(document).on("pageInit", "#page-infinite-scroll-bottom", function(e, id, page) {
    var loading = false;
    // 每次加载添加多少条目
    var itemsPerLoad = 20;
    // 最多可加载的条目
    var maxItems = 100;
    var lastIndex = $('.list-container li').length;
    function addItems(number, lastIndex) {
      // 生成新条目的HTML
      var html = '';
      for (var i = lastIndex + 1; i <= lastIndex + number; i++) {
        html += '<li class="item-content"><div class="item-inner"><div class="item-title">新条目</div></div></li>';
      }
      // 添加新条目
      $('.infinite-scroll .list-container').append(html);
    }
    $(page).on('infinite', function() {
      // 如果正在加载，则退出
      if (loading) return;
      // 设置flag
      loading = true;
      // 模拟1s的加载过程
      setTimeout(function() {
        // 重置加载flag
        loading = false;
        if (lastIndex >= maxItems) {
          // 加载完毕，则注销无限加载事件，以防不必要的加载
          $.detachInfiniteScroll($('.infinite-scroll'));
          // 删除加载提示符
          $('.infinite-scroll-preloader').remove();
          return;
        }
        addItems(itemsPerLoad,lastIndex);
        // 更新最后加载的序号
        lastIndex = $('.list-container li').length;
        $.refreshScroller();
      }, 1000);
    });
  });

  //顶部无限滚动
  $(document).on("pageInit", "#page-infinite-scroll-top", function(e, id, page) {
    function addItems(number, lastIndex) {
      // 生成新条目的HTML
      var html = '';
      for (var i = lastIndex+ number; i > lastIndex ; i--) {
        html += '<li class="item-content"><div class="item-inner"><div class="item-title">条目'+i+'</div></div></li>';
      }
      // 添加新条目
      $('.infinite-scroll .list-container').prepend(html);

    }
    var timer = false;
    $(page).on('infinite', function() {
       var lastIndex = $('.list-block li').length;
       var lastLi = $(".list-container li")[0];
       var scroller = $('.infinite-scroll-top');
       var scrollHeight = scroller[0].scrollHeight; // 获取当前滚动元素的高度
      // 如果正在加载，则退出
      if (timer) {
        clearTimeout(timer);
      }

      // 模拟1s的加载过程
      timer = setTimeout(function() {

        addItems(20,lastIndex);

        $.refreshScroller();
        //  lastLi.scrollIntoView({
        //     behavior: "smooth",
        //     block:    "start"
        // });
        // 将滚动条的位置设置为最新滚动元素高度和之前的高度差
        scroller.scrollTop(scroller[0].scrollHeight - scrollHeight);
      }, 1000);
    });

  });
  //test demo js

  //多个标签页下的无限滚动
  $(document).on("pageInit", "#page-fixed-tab-infinite-scroll", function(e, id, page) {
    var loading = false;
    // 每次加载添加多少条目
    var itemsPerLoad = 20;
    // 最多可加载的条目
    var maxItems = 100;
    var lastIndex = $('.list-container li')[0].length;
    function addItems(number, lastIndex) {
      // 生成新条目的HTML
      var html = '';
      for (var i = lastIndex + 1; i <= lastIndex + number; i++) {
        html += '<li class="item-content""><div class="item-inner"><div class="item-title">新条目</div></div></li>';
      }
      // 添加新条目
      $('.infinite-scroll.active .list-container').append(html);
    }
    $(page).on('infinite', function() {
      // 如果正在加载，则退出
      if (loading) return;
      // 设置flag
      loading = true;
      var tabIndex = 0;
      if($(this).find('.infinite-scroll.active').attr('id') == "tab2"){
        tabIndex = 0;
      }
      if($(this).find('.infinite-scroll.active').attr('id') == "tab3"){
        tabIndex = 1;
      }
      lastIndex = $('.list-container').eq(tabIndex).find('li').length;
      // 模拟1s的加载过程
      setTimeout(function() {
        // 重置加载flag
        loading = false;
        if (lastIndex >= maxItems) {
          // 加载完毕，则注销无限加载事件，以防不必要的加载
          //$.detachInfiniteScroll($('.infinite-scroll').eq(tabIndex));
          // 删除加载提示符
          $('.infinite-scroll-preloader').eq(tabIndex).hide();
          return;
        }
        addItems(itemsPerLoad,lastIndex);
        // 更新最后加载的序号
        lastIndex =  $('.list-container').eq(tabIndex).find('li').length;
        $.refreshScroller();
      }, 1000);
    });
  });

  //图片浏览器
  $(document).on("pageInit", "#page-photo-browser", function(e, id, page) {
    var myPhotoBrowserStandalone = $.photoBrowser({
      photos : [
        '//img.alicdn.com/tps/i3/TB1kt4wHVXXXXb_XVXX0HY8HXXX-1024-1024.jpeg',
        '//img.alicdn.com/tps/i1/TB1SKhUHVXXXXb7XXXX0HY8HXXX-1024-1024.jpeg',
        '//img.alicdn.com/tps/i4/TB1AdxNHVXXXXasXpXX0HY8HXXX-1024-1024.jpeg',
      ]
    });
    //点击时打开图片浏览器
    $(page).on('click','.pb-standalone',function () {
      myPhotoBrowserStandalone.open();
    });
    /*=== Popup ===*/
    var myPhotoBrowserPopup = $.photoBrowser({
      photos : [
        '//img.alicdn.com/tps/i3/TB1kt4wHVXXXXb_XVXX0HY8HXXX-1024-1024.jpeg',
        '//img.alicdn.com/tps/i1/TB1SKhUHVXXXXb7XXXX0HY8HXXX-1024-1024.jpeg',
        '//img.alicdn.com/tps/i4/TB1AdxNHVXXXXasXpXX0HY8HXXX-1024-1024.jpeg',
      ],
      type: 'popup'
    });
    $(page).on('click','.pb-popup',function () {
      myPhotoBrowserPopup.open();
    });
    /*=== 有标题 ===*/
    var myPhotoBrowserCaptions = $.photoBrowser({
      photos : [
        {
          url: '//img.alicdn.com/tps/i3/TB1kt4wHVXXXXb_XVXX0HY8HXXX-1024-1024.jpeg',
          caption: 'Caption 1 Text'
        },
        {
          url: '//img.alicdn.com/tps/i1/TB1SKhUHVXXXXb7XXXX0HY8HXXX-1024-1024.jpeg',
          caption: 'Second Caption Text'
        },
        // 这个没有标题
        {
          url: '//img.alicdn.com/tps/i4/TB1AdxNHVXXXXasXpXX0HY8HXXX-1024-1024.jpeg',
        },
      ],
      theme: 'dark',
      type: 'standalone'
    });
    $(page).on('click','.pb-standalone-captions',function () {
      myPhotoBrowserCaptions.open();
    });
  });


  //对话框
  $(document).on("pageInit", "#page-modal", function(e, id, page) {
    var $content = $(page).find('.content');
    $content.on('click','.alert-text',function () {
      $.alert('这是一段提示消息');
    });

    $content.on('click','.alert-text-title', function () {
      $.alert('这是一段提示消息', '这是自定义的标题!');
    });

    $content.on('click', '.alert-text-title-callback',function () {
      $.alert('这是自定义的文案', '这是自定义的标题!', function () {
        $.alert('你点击了确定按钮!')
      });
    });
    $content.on('click','.confirm-ok', function () {
      $.confirm('你确定吗?', function () {
        $.alert('你点击了确定按钮!');
      });
    });
    $content.on('click','.prompt-ok', function () {
      $.prompt('你叫什么问题?', function (value) {
        $.alert('你输入的名字是"' + value + '"');
      });
    });
  });

  //操作表
  $(document).on("pageInit", "#page-city-picker", function(e, id, page) {
    $(page).on('click','.create-actions', function () {
      var buttons1 = [
        {
          text: '请选择',
          label: true
        },
        {
          text: '拍照',
          bold: true,
          color: 'danger',
          onClick: function() {
            $.alert("你选择了“拍照“");
          }
        },
        {
          text: '从手机中选择',
          onClick: function() {
            $.alert("你选择了“从手机中选择“");
          }
        }
      ];
      var buttons2 = [
        {
          text: '取消',
          bg: 'danger'
        }
      ];
      var groups = [buttons1, buttons2];
      $.actions(groups);
    });
  });

  //加载提示符
  $(document).on("pageInit", "#page-preloader", function(e, id, page) {
    $(page).on('click','.open-preloader-title', function () {
      $.showPreloader('加载中...')
      setTimeout(function () {
        $.hidePreloader();
      }, 2000);
    });
    $(page).on('click','.open-indicator', function () {
      $.showIndicator();
      setTimeout(function () {
        $.hideIndicator();
      }, 2000);
    });
  });


  //选择颜色主题
  $(document).on("click", ".select-color", function(e) {
    var b = $(e.target);
    document.body.className = "theme-" + (b.data("color") || "");
    b.parent().find(".active").removeClass("active");
    b.addClass("active");
  });

  //picker
  $(document).on("pageInit", "#page-city-picker", function(e, id, page) {
    $("#picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">借款需求</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['2万元以下', '3万元', '5万元', '10万元', '20万元', '50万元', '100万元'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#mouth-money-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">可接受月综合费率</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['1%以下（通过率低，公务员、事业单位可选）', '1%-1.5%（公积金客户可选）', '1.5%-2.5%（推荐，通过率高，下款快）', '2.5%-3%（符合条件可当天下款）', '3%以上（费率较高，征信差可选）'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#why-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">借款事由</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['扩大经营需要', '转贷急需', '本人购车急需', '本人购房急需', '其他需要'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#xyqk-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">信用情况</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['无信用卡或贷款', '信用良好', '1年内逾期少于3次且少于90天', '1年内逾期超过3次或少于90天'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#fclx-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">房产情况</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['无房产', '商品房', '商铺', '经适房'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#aj-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">按揭情况</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['无按揭还款', '有按揭，且已经还款6期以上', '有按揭，且已经还款12期以上'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#fcz-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">能否提供房产证</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['是，能提供房产证', '是商品房，暂不能提供房产证', '无房产证'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#name-car-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">名下有无车辆</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['无车', '名下有车', '有车，但被抵押', '无车，准备购买'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#car-what-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">有无按揭/抵押</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['无按揭且未抵押', '有按揭贷款且在还款中', '已抵押'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#tbgs-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">投保公司</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['平安车险', '太平洋车险', '人保车险', '阳光车险', '其他保险公司'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#bx-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">是否购买传统、分红型保险</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['是，我买了传统、分红型保险', '否，我没有'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#tbgs-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">是否购买传统、分红型保险</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['平安保险', '太平洋保险',  '中国人民保险', '人寿保险', '其他保险公司'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	
	$("#jffs-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">缴费方式</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['年缴', '月缴',  '期缴'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#mqje-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">每期缴费金额</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['1000元以下', '1000-3000元',  '3001-5000元',  '5000-10000元',  '10000元以上'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#bank-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">所属银行</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['国有银行（工农中建交）', '全国股份制银行（如：浦发、华夏、中信等）', '1年内逾期少于3次且少于90天城市商业银行（如：上海银行、杭州银行等）', '邮政银行或农村商业银行', '外资银行'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#ck-time-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">持卡时间</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['6个月以下', '6-12个月', '1年以上'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#bdsb-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">是否有本地社保</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['是，有本地社保', '否，没有'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#bdgjj-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">是否缴纳公积金</h1>\
      </header>',
      cols: [
        { 
          textAlign: 'center',
          values: ['是，有本地公积金', '否，不缴纳'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#money-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">额度区间</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['4000元以下', '4000元-4500元', '4500元-5000元', '5000元-6000元', '6000元-7000元', '7000元-8000元', '8000元-9000元', '9000元-10000元', '10000元-12000元', '12000元-15000元', '15000元及以上'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#jd-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">贷款进度</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['待联系', '准备材料', '进件客户', '申请通过-待签约', '已签约放款', '贷款拒绝'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#lx-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">贷款类型</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['工薪贷', '车辆抵押贷款', '房屋抵押贷款', '生意人贷'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#ly-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">客户来源</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['自己推广', '微信推送', '主动购买'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#car-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">愿意将车辆交给我们保管吗</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['愿意将车辆交给我们保管', '不愿意将车辆交给我们保管'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#xyk-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">有无信用卡</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['有信用卡', '无信用卡'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#POS-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">有无POS机</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['有POS机', '无POS机'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#zz-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">有无营业执照</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['有营业执照', '无营业执照'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#house-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">房产有无抵押</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['有房产抵押', '无房产抵押'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#jg-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">标题</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['10W', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#time-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">用款时间</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['3个月', '6个月', '12个月', '36个月'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#sb-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">有无社保公积金</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['无社保', '有社保','有社保且有公积金'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
	$("#gz-picker").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-left">\
      按钮\
      </button>\
      <button class="button button-link pull-right close-picker">\
      确定\
      </button>\
      <h1 class="title">工资发放方式</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['打卡工资', '现金发放'],
          cssClass: 'picker-items-col-normal'
        }
      ]
    });
    $("#picker-name").picker({
      toolbarTemplate: '<header class="bar bar-nav">\
      <button class="button button-link pull-right close-picker">确定</button>\
      <h1 class="title">请选择称呼</h1>\
      </header>',
      cols: [
        {
          textAlign: 'center',
          values: ['赵', '钱', '孙', '李', '周', '吴', '郑', '王']
        },
        {
          textAlign: 'center',
          values: ['杰伦', '磊', '明', '小鹏', '燕姿', '菲菲', 'Baby']
        },
        {
          textAlign: 'center',
          values: ['先生', '小姐']
        }
      ]
    });
  });
  $(document).on("pageInit", "#page-datetime-picker", function(e) {
    $("#datetime-picker").datetimePicker({
      toolbarTemplate: '<header class="bar bar-nav">\
      <button class="button button-link pull-right close-picker">确定</button>\
      <h1 class="title">选择日期和时间</h1>\
      </header>'
    });
  });

  $(document).on("pageInit", "#page-city-picker", function(e) {
    $("#city-picker").cityPicker({
		textAlign: 'center',
        value: ['北京', '东城区'],
		cssClass: 'picker-items-col-normal'
        //value: ['四川', '内江', '东兴区']
    });
  });

  $.init();
});
