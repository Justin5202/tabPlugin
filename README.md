# tabPlugin
demo()
> 运用jQuery开发的一款tab切换插件，并封装成jq的方法，可直接调用。
### 定义一个Tab构造函数
 
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
    }
  
### 向对象添加属性和方法

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
  
**提前保存this对象，避免this对象的冲突**
    var _this_ = this;
    
    $.parseJSON()//将接收的用户定义的对象转为json格式
    
### 最后将其封装为JQ方法，可直接调用

    $.fn.extend({
		tab: function() {
			this.each(function() {
				new Tab($(this));
			});
			return this;
		}
	});
  $(".js-tab").tab(); //直接调用
