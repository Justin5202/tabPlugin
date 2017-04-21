;
(function($) {
	var Tab = function(tab) { //Tab构造函数
		var _this_ = this;
		//保存单个tab组件
		this.tab = tab;
		//默认的配置参数
		this.config = {
			"triggleType": "click", //事件绑定
			"effect": "fade", //显示效果
			"invoke": 2, //默认显示
			"auto": false //自动切换或者指定时间
		};
		//如果配置参数存在，就替换默认的参数
		if (this.getConfig()) {
			$.extend(true, this.config, this.getConfig());

		}
		//保存标签元素和内容元素
		this.tabItems = this.tab.find(".tab-nav li");
		this.contentItems = this.tab.find(".content-wrap .content-item");
		//保存配置参数
		var config = this.config;
		if (config.triggleType === "click") {
			this.tabItems.bind(config.triggleType, function(event) {
				_this_.invoke($(this));
			});
		} else if (config.triggleType === "mouseover" || config.triggleType != "click") {
			this.tabItems.mouseover(function(event) {
				_this_.invoke($(this));
			});
		}
		//自动切换功能
		if (config.auto) {
			//定义全局的定时器
			this.timer = null;
			//计数器
			this.loop = 0;
			this.autoPlay();
			this.tab.find('.content-wrap').hover(function() {
				clearInterval(_this_.timer);
			}, function() {
				_this_.autoPlay();
			});
		}
		//设置默认显示某个tab
		if (config.invoke > 1) {
			this.invoke(this.tabItems.eq(config.invoke - 1));
		}

	};
	Tab.prototype = {
		//自动切换函数
		autoPlay: function() {
			var _this_ = this,
				tabItems = this.tabItems, //临时保存tab列表
				tabLength = tabItems.length, //tab长度
				config = this.config;
			this.timer = window.setInterval(function() {
				_this_.loop++;
				if (_this_.loop >= tabLength) {
					_this_.loop = 0;
				}
				tabItems.eq(_this_.loop).trigger(config.triggleType);
			}, config.auto)
		},
		//事件驱动函数
		invoke: function(currentTab) {
			var _this_ = this;
			/***
			 *执行tab的选中状态，当前选中的要加上active
			 *切换当前tab的内容，根据配置参数effect的值来确定效果
			 ***/
			var index = currentTab.index();
			//tab选中状态
			currentTab.addClass("active").siblings().removeClass('active');
			//对应的内容切换
			var effect = this.config.effect;
			var conItems = this.contentItems;
			if (effect === "default" || effect != "fade") {
				conItems.eq(index).addClass('current').siblings().removeClass('current');

			} else if (effect === 'fade') {
				conItems.eq(index).stop().fadeIn().siblings().hide();
			}
			//同步loop的值
			this.loop = index;
		},
		//获取配置参数
		getConfig: function() {
			//得到tab节点上的data-config参数
			var config = this.tab.attr("data-config");
			//确保有配置参数
			if (config && config != "") {
				return $.parseJSON(config); //转义json格式
			} else {
				return null;
			}
		}
	};
	Tab.init = function(tabs) {
			var _this_ = this;
			tabs.each(function() {
				new _this_($(this));
			});
		}
		//注册jquery方法
	$.fn.extend({
		tab: function() {
			this.each(function() {
				new Tab($(this));
			});
			return this;
		}
	});
	window.Tab = Tab; //事件注册
})(jQuery); //匿名函数自执行