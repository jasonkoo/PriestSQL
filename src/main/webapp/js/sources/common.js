/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1||b[0]>2)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.6",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.6",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")?(c.prop("checked")&&(a=!1),b.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==c.prop("type")&&(c.prop("checked")!==this.$element.hasClass("active")&&(a=!1),this.$element.toggleClass("active")),c.prop("checked",this.$element.hasClass("active")),a&&c.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target).closest(".btn");b.call(d,"toggle"),a(c.target).is('input[type="radio"]')||a(c.target).is('input[type="checkbox"]')||(c.preventDefault(),d.is("input,button")?d.trigger("focus"):d.find("input:visible,button:visible").first().trigger("focus"))}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.6",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.6",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function c(c){c&&3===c.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=b(d),f={relatedTarget:this};e.hasClass("open")&&(c&&"click"==c.type&&/input|textarea/i.test(c.target.tagName)&&a.contains(e[0],c.target)||(e.trigger(c=a.Event("hide.bs.dropdown",f)),c.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger(a.Event("hidden.bs.dropdown",f)))))}))}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.6",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=b(e),g=f.hasClass("open");if(c(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",c);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger(a.Event("shown.bs.dropdown",h))}return!1}},g.prototype.keydown=function(c){if(/(38|40|27|32)/.test(c.which)&&!/input|textarea/i.test(c.target.tagName)){var d=a(this);if(c.preventDefault(),c.stopPropagation(),!d.is(".disabled, :disabled")){var e=b(d),g=e.hasClass("open");if(!g&&27!=c.which||g&&27==c.which)return 27==c.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find(".dropdown-menu"+h);if(i.length){var j=i.index(c.target);38==c.which&&j>0&&j--,40==c.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",c).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.6",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in"),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){document===a.target||this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+e).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;!e&&/destroy|hide/.test(b)||(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",a,b)};c.VERSION="3.3.6",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(a.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusin"==b.type?"focus":"hover"]=!0),c.tip().hasClass("in")||"in"==c.hoverState?void(c.hoverState="in"):(clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.isInStateTrue=function(){for(var a in this.inState)if(this.inState[a])return!0;return!1},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusout"==b.type?"focus":"hover"]=!1),c.isInStateTrue()?void 0:(clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide())},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.getPosition(this.$viewport);h="bottom"==h&&k.bottom+m>o.bottom?"top":"top"==h&&k.top-m<o.top?"bottom":"right"==h&&k.right+l>o.width?"left":"left"==h&&k.left-l<o.left?"right":h,f.removeClass(n).addClass(h)}var p=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(p,h);var q=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",q).emulateTransitionEnd(c.TRANSITION_DURATION):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top+=g,b.left+=h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.right&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){if(!this.$tip&&(this.$tip=a(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),b?(c.inState.click=!c.inState.click,c.isInStateTrue()?c.enter(c):c.leave(c)):c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type),a.$tip&&a.$tip.detach(),a.$tip=null,a.$arrow=null,a.$viewport=null})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;!e&&/destroy|hide/.test(b)||(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.6",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.6",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");
d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.6",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.6",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=e?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=Math.max(a(document).height(),a(document.body).height());"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);

/* Copyright (c) 2010-2016 Marcus Westin */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.store = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;u>r;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;u>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value);var gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r]);return reviver.call(t,e,o)}var j;if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

},{}],2:[function(require,module,exports){
require("./json2"),module.exports=require("./store");
},{"./json2":1,"./store":3}],3:[function(require,module,exports){
(function (global){
"use strict";module.exports=function(){function e(){try{return o in n&&n[o]}catch(e){return!1}}var t,r={},n="undefined"!=typeof window?window:global,i=n.document,o="localStorage",a="script";if(r.disabled=!1,r.version="1.3.20",r.set=function(e,t){},r.get=function(e,t){},r.has=function(e){return void 0!==r.get(e)},r.remove=function(e){},r.clear=function(){},r.transact=function(e,t,n){null==n&&(n=t,t=null),null==t&&(t={});var i=r.get(e,t);n(i),r.set(e,i)},r.getAll=function(){},r.forEach=function(){},r.serialize=function(e){return JSON.stringify(e)},r.deserialize=function(e){if("string"==typeof e)try{return JSON.parse(e)}catch(t){return e||void 0}},e())t=n[o],r.set=function(e,n){return void 0===n?r.remove(e):(t.setItem(e,r.serialize(n)),n)},r.get=function(e,n){var i=r.deserialize(t.getItem(e));return void 0===i?n:i},r.remove=function(e){t.removeItem(e)},r.clear=function(){t.clear()},r.getAll=function(){var e={};return r.forEach(function(t,r){e[t]=r}),e},r.forEach=function(e){for(var n=0;n<t.length;n++){var i=t.key(n);e(i,r.get(i))}};else if(i&&i.documentElement.addBehavior){var c,u;try{u=new ActiveXObject("htmlfile"),u.open(),u.write("<"+a+">document.w=window</"+a+'><iframe src="/favicon.ico"></iframe>'),u.close(),c=u.w.frames[0].document,t=c.createElement("div")}catch(l){t=i.createElement("div"),c=i.body}var f=function(e){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(t),c.appendChild(t),t.addBehavior("#default#userData"),t.load(o);var i=e.apply(r,n);return c.removeChild(t),i}},d=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g"),s=function(e){return e.replace(/^d/,"___$&").replace(d,"___")};r.set=f(function(e,t,n){return t=s(t),void 0===n?r.remove(t):(e.setAttribute(t,r.serialize(n)),e.save(o),n)}),r.get=f(function(e,t,n){t=s(t);var i=r.deserialize(e.getAttribute(t));return void 0===i?n:i}),r.remove=f(function(e,t){t=s(t),e.removeAttribute(t),e.save(o)}),r.clear=f(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(o);for(var r=t.length-1;r>=0;r--)e.removeAttribute(t[r].name);e.save(o)}),r.getAll=function(e){var t={};return r.forEach(function(e,r){t[e]=r}),t},r.forEach=f(function(e,t){for(var n,i=e.XMLDocument.documentElement.attributes,o=0;n=i[o];++o)t(n.name,r.deserialize(e.getAttribute(n.name)))})}try{var v="__storejs__";r.set(v,v),r.get(v)!=v&&(r.disabled=!0),r.remove(v)}catch(l){r.disabled=!0}return r.enabled=!r.disabled,r}();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2])(2)
});


/* global define */

/* ================================================
 * Make use of Bootstrap's modal more monkey-friendly.
 *
 * For Bootstrap 3.
 *
 * javanoob@hotmail.com
 *
 * https://github.com/nakupanda/bootstrap3-dialog
 *
 * Licensed under The MIT License.
 * ================================================ */
!function(t,e){"use strict";if("undefined"!=typeof module&&module.exports){var n="undefined"!=typeof process,o=n&&"electron"in process.versions;o?t.BootstrapDialog=e(t.jQuery):module.exports=e(require("jquery"),require("bootstrap"))}else"function"==typeof define&&define.amd?define("bootstrap-dialog",["jquery","bootstrap"],function(t){return e(t)}):t.BootstrapDialog=e(t.jQuery)}(this,function(t){"use strict";var e=t.fn.modal.Constructor,n=function(t,n){e.call(this,t,n)};n.getModalVersion=function(){var e=null;return e="undefined"==typeof t.fn.modal.Constructor.VERSION?"v3.1":/3\.2\.\d+/.test(t.fn.modal.Constructor.VERSION)?"v3.2":/3\.3\.[1,2]/.test(t.fn.modal.Constructor.VERSION)?"v3.3":"v3.3.4"},n.ORIGINAL_BODY_PADDING=parseInt(t("body").css("padding-right")||0,10),n.METHODS_TO_OVERRIDE={},n.METHODS_TO_OVERRIDE["v3.1"]={},n.METHODS_TO_OVERRIDE["v3.2"]={hide:function(e){if(e&&e.preventDefault(),e=t.Event("hide.bs.modal"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()){this.isShown=!1;var n=this.getGlobalOpenedDialogs();0===n.length&&this.$body.removeClass("modal-open"),this.resetScrollbar(),this.escape(),t(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),t.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",t.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal()}}},n.METHODS_TO_OVERRIDE["v3.3"]={setScrollbar:function(){var t=n.ORIGINAL_BODY_PADDING;this.bodyIsOverflowing&&this.$body.css("padding-right",t+this.scrollbarWidth)},resetScrollbar:function(){var t=this.getGlobalOpenedDialogs();0===t.length&&this.$body.css("padding-right",n.ORIGINAL_BODY_PADDING)},hideModal:function(){this.$element.hide(),this.backdrop(t.proxy(function(){var t=this.getGlobalOpenedDialogs();0===t.length&&this.$body.removeClass("modal-open"),this.resetAdjustments(),this.resetScrollbar(),this.$element.trigger("hidden.bs.modal")},this))}},n.METHODS_TO_OVERRIDE["v3.3.4"]=t.extend({},n.METHODS_TO_OVERRIDE["v3.3"]),n.prototype={constructor:n,getGlobalOpenedDialogs:function(){var e=[];return t.each(o.dialogs,function(t,n){n.isRealized()&&n.isOpened()&&e.push(n)}),e}},n.prototype=t.extend(n.prototype,e.prototype,n.METHODS_TO_OVERRIDE[n.getModalVersion()]);var o=function(e){this.defaultOptions=t.extend(!0,{id:o.newGuid(),buttons:[],data:{},onshow:null,onshown:null,onhide:null,onhidden:null},o.defaultOptions),this.indexedButtons={},this.registeredButtonHotkeys={},this.draggableData={isMouseDown:!1,mouseOffset:{}},this.realized=!1,this.opened=!1,this.initOptions(e),this.holdThisInstance()};return o.BootstrapDialogModal=n,o.NAMESPACE="bootstrap-dialog",o.TYPE_DEFAULT="type-default",o.TYPE_INFO="type-info",o.TYPE_PRIMARY="type-primary",o.TYPE_SUCCESS="type-success",o.TYPE_WARNING="type-warning",o.TYPE_DANGER="type-danger",o.DEFAULT_TEXTS={},o.DEFAULT_TEXTS[o.TYPE_DEFAULT]="Information",o.DEFAULT_TEXTS[o.TYPE_INFO]="Information",o.DEFAULT_TEXTS[o.TYPE_PRIMARY]="Information",o.DEFAULT_TEXTS[o.TYPE_SUCCESS]="Success",o.DEFAULT_TEXTS[o.TYPE_WARNING]="Warning",o.DEFAULT_TEXTS[o.TYPE_DANGER]="Danger",o.DEFAULT_TEXTS.OK="OK",o.DEFAULT_TEXTS.CANCEL="Cancel",o.DEFAULT_TEXTS.CONFIRM="Confirmation",o.SIZE_NORMAL="size-normal",o.SIZE_SMALL="size-small",o.SIZE_WIDE="size-wide",o.SIZE_LARGE="size-large",o.BUTTON_SIZES={},o.BUTTON_SIZES[o.SIZE_NORMAL]="",o.BUTTON_SIZES[o.SIZE_SMALL]="",o.BUTTON_SIZES[o.SIZE_WIDE]="",o.BUTTON_SIZES[o.SIZE_LARGE]="btn-lg",o.ICON_SPINNER="glyphicon glyphicon-asterisk",o.defaultOptions={type:o.TYPE_PRIMARY,size:o.SIZE_NORMAL,cssClass:"",title:null,message:null,nl2br:!0,closable:!0,closeByBackdrop:!0,closeByKeyboard:!0,spinicon:o.ICON_SPINNER,autodestroy:!0,draggable:!1,animate:!0,description:"",tabindex:-1},o.configDefaultOptions=function(e){o.defaultOptions=t.extend(!0,o.defaultOptions,e)},o.dialogs={},o.openAll=function(){t.each(o.dialogs,function(t,e){e.open()})},o.closeAll=function(){t.each(o.dialogs,function(t,e){e.close()})},o.getDialog=function(t){var e=null;return"undefined"!=typeof o.dialogs[t]&&(e=o.dialogs[t]),e},o.setDialog=function(t){return o.dialogs[t.getId()]=t,t},o.addDialog=function(t){return o.setDialog(t)},o.moveFocus=function(){var e=null;t.each(o.dialogs,function(t,n){e=n}),null!==e&&e.isRealized()&&e.getModal().focus()},o.METHODS_TO_OVERRIDE={},o.METHODS_TO_OVERRIDE["v3.1"]={handleModalBackdropEvent:function(){return this.getModal().on("click",{dialog:this},function(t){t.target===this&&t.data.dialog.isClosable()&&t.data.dialog.canCloseByBackdrop()&&t.data.dialog.close()}),this},updateZIndex:function(){var e=1040,n=1050,i=0;t.each(o.dialogs,function(t,e){i++});var s=this.getModal(),a=s.data("bs.modal").$backdrop;return s.css("z-index",n+20*(i-1)),a.css("z-index",e+20*(i-1)),this},open:function(){return!this.isRealized()&&this.realize(),this.getModal().modal("show"),this.updateZIndex(),this}},o.METHODS_TO_OVERRIDE["v3.2"]={handleModalBackdropEvent:o.METHODS_TO_OVERRIDE["v3.1"].handleModalBackdropEvent,updateZIndex:o.METHODS_TO_OVERRIDE["v3.1"].updateZIndex,open:o.METHODS_TO_OVERRIDE["v3.1"].open},o.METHODS_TO_OVERRIDE["v3.3"]={},o.METHODS_TO_OVERRIDE["v3.3.4"]=t.extend({},o.METHODS_TO_OVERRIDE["v3.1"]),o.prototype={constructor:o,initOptions:function(e){return this.options=t.extend(!0,this.defaultOptions,e),this},holdThisInstance:function(){return o.addDialog(this),this},initModalStuff:function(){return this.setModal(this.createModal()).setModalDialog(this.createModalDialog()).setModalContent(this.createModalContent()).setModalHeader(this.createModalHeader()).setModalBody(this.createModalBody()).setModalFooter(this.createModalFooter()),this.getModal().append(this.getModalDialog()),this.getModalDialog().append(this.getModalContent()),this.getModalContent().append(this.getModalHeader()).append(this.getModalBody()).append(this.getModalFooter()),this},createModal:function(){var e=t('<div class="modal" role="dialog" aria-hidden="true"></div>');return e.prop("id",this.getId()),e.attr("aria-labelledby",this.getId()+"_title"),e},getModal:function(){return this.$modal},setModal:function(t){return this.$modal=t,this},createModalDialog:function(){return t('<div class="modal-dialog"></div>')},getModalDialog:function(){return this.$modalDialog},setModalDialog:function(t){return this.$modalDialog=t,this},createModalContent:function(){return t('<div class="modal-content"></div>')},getModalContent:function(){return this.$modalContent},setModalContent:function(t){return this.$modalContent=t,this},createModalHeader:function(){return t('<div class="modal-header"></div>')},getModalHeader:function(){return this.$modalHeader},setModalHeader:function(t){return this.$modalHeader=t,this},createModalBody:function(){return t('<div class="modal-body"></div>')},getModalBody:function(){return this.$modalBody},setModalBody:function(t){return this.$modalBody=t,this},createModalFooter:function(){return t('<div class="modal-footer"></div>')},getModalFooter:function(){return this.$modalFooter},setModalFooter:function(t){return this.$modalFooter=t,this},createDynamicContent:function(t){var e=null;return e="function"==typeof t?t.call(t,this):t,"string"==typeof e&&(e=this.formatStringContent(e)),e},formatStringContent:function(t){return this.options.nl2br?t.replace(/\r\n/g,"<br />").replace(/[\r\n]/g,"<br />"):t},setData:function(t,e){return this.options.data[t]=e,this},getData:function(t){return this.options.data[t]},setId:function(t){return this.options.id=t,this},getId:function(){return this.options.id},getType:function(){return this.options.type},setType:function(t){return this.options.type=t,this.updateType(),this},updateType:function(){if(this.isRealized()){var t=[o.TYPE_DEFAULT,o.TYPE_INFO,o.TYPE_PRIMARY,o.TYPE_SUCCESS,o.TYPE_WARNING,o.TYPE_DANGER];this.getModal().removeClass(t.join(" ")).addClass(this.getType())}return this},getSize:function(){return this.options.size},setSize:function(t){return this.options.size=t,this.updateSize(),this},updateSize:function(){if(this.isRealized()){var e=this;this.getModal().removeClass(o.SIZE_NORMAL).removeClass(o.SIZE_SMALL).removeClass(o.SIZE_WIDE).removeClass(o.SIZE_LARGE),this.getModal().addClass(this.getSize()),this.getModalDialog().removeClass("modal-sm"),this.getSize()===o.SIZE_SMALL&&this.getModalDialog().addClass("modal-sm"),this.getModalDialog().removeClass("modal-lg"),this.getSize()===o.SIZE_WIDE&&this.getModalDialog().addClass("modal-lg"),t.each(this.options.buttons,function(n,o){var i=e.getButton(o.id),s=["btn-lg","btn-sm","btn-xs"],a=!1;if("string"==typeof o.cssClass){var d=o.cssClass.split(" ");t.each(d,function(e,n){-1!==t.inArray(n,s)&&(a=!0)})}a||(i.removeClass(s.join(" ")),i.addClass(e.getButtonSize()))})}return this},getCssClass:function(){return this.options.cssClass},setCssClass:function(t){return this.options.cssClass=t,this},getTitle:function(){return this.options.title},setTitle:function(t){return this.options.title=t,this.updateTitle(),this},updateTitle:function(){if(this.isRealized()){var t=null!==this.getTitle()?this.createDynamicContent(this.getTitle()):this.getDefaultText();this.getModalHeader().find("."+this.getNamespace("title")).html("").append(t).prop("id",this.getId()+"_title")}return this},getMessage:function(){return this.options.message},setMessage:function(t){return this.options.message=t,this.updateMessage(),this},updateMessage:function(){if(this.isRealized()){var t=this.createDynamicContent(this.getMessage());this.getModalBody().find("."+this.getNamespace("message")).html("").append(t)}return this},isClosable:function(){return this.options.closable},setClosable:function(t){return this.options.closable=t,this.updateClosable(),this},setCloseByBackdrop:function(t){return this.options.closeByBackdrop=t,this},canCloseByBackdrop:function(){return this.options.closeByBackdrop},setCloseByKeyboard:function(t){return this.options.closeByKeyboard=t,this},canCloseByKeyboard:function(){return this.options.closeByKeyboard},isAnimate:function(){return this.options.animate},setAnimate:function(t){return this.options.animate=t,this},updateAnimate:function(){return this.isRealized()&&this.getModal().toggleClass("fade",this.isAnimate()),this},getSpinicon:function(){return this.options.spinicon},setSpinicon:function(t){return this.options.spinicon=t,this},addButton:function(t){return this.options.buttons.push(t),this},addButtons:function(e){var n=this;return t.each(e,function(t,e){n.addButton(e)}),this},getButtons:function(){return this.options.buttons},setButtons:function(t){return this.options.buttons=t,this.updateButtons(),this},getButton:function(t){return"undefined"!=typeof this.indexedButtons[t]?this.indexedButtons[t]:null},getButtonSize:function(){return"undefined"!=typeof o.BUTTON_SIZES[this.getSize()]?o.BUTTON_SIZES[this.getSize()]:""},updateButtons:function(){return this.isRealized()&&(0===this.getButtons().length?this.getModalFooter().hide():this.getModalFooter().show().find("."+this.getNamespace("footer")).html("").append(this.createFooterButtons())),this},isAutodestroy:function(){return this.options.autodestroy},setAutodestroy:function(t){this.options.autodestroy=t},getDescription:function(){return this.options.description},setDescription:function(t){return this.options.description=t,this},setTabindex:function(t){return this.options.tabindex=t,this},getTabindex:function(){return this.options.tabindex},updateTabindex:function(){return this.isRealized()&&this.getModal().attr("tabindex",this.getTabindex()),this},getDefaultText:function(){return o.DEFAULT_TEXTS[this.getType()]},getNamespace:function(t){return o.NAMESPACE+"-"+t},createHeaderContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("header")),e.append(this.createTitleContent()),e.prepend(this.createCloseButton()),e},createTitleContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("title")),e},createCloseButton:function(){var e=t("<div></div>");e.addClass(this.getNamespace("close-button"));var n=t('<button class="close">&times;</button>');return e.append(n),e.on("click",{dialog:this},function(t){t.data.dialog.close()}),e},createBodyContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("body")),e.append(this.createMessageContent()),e},createMessageContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("message")),e},createFooterContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("footer")),e},createFooterButtons:function(){var e=this,n=t("<div></div>");return n.addClass(this.getNamespace("footer-buttons")),this.indexedButtons={},t.each(this.options.buttons,function(t,i){i.id||(i.id=o.newGuid());var s=e.createButton(i);e.indexedButtons[i.id]=s,n.append(s)}),n},createButton:function(e){var n=t('<button class="btn"></button>');return n.prop("id",e.id),n.data("button",e),"undefined"!=typeof e.icon&&""!==t.trim(e.icon)&&n.append(this.createButtonIcon(e.icon)),"undefined"!=typeof e.label&&n.append(e.label),n.addClass("undefined"!=typeof e.cssClass&&""!==t.trim(e.cssClass)?e.cssClass:"btn-default"),"undefined"!=typeof e.hotkey&&(this.registeredButtonHotkeys[e.hotkey]=n),n.on("click",{dialog:this,$button:n,button:e},function(t){var e=t.data.dialog,n=t.data.$button,o=n.data("button");o.autospin&&n.toggleSpin(!0),"function"==typeof o.action&&o.action.call(n,e,t)}),this.enhanceButton(n),"undefined"!=typeof e.enabled&&n.toggleEnable(e.enabled),n},enhanceButton:function(t){return t.dialog=this,t.toggleEnable=function(t){var e=this;return"undefined"!=typeof t?e.prop("disabled",!t).toggleClass("disabled",!t):e.prop("disabled",!e.prop("disabled")),e},t.enable=function(){var t=this;return t.toggleEnable(!0),t},t.disable=function(){var t=this;return t.toggleEnable(!1),t},t.toggleSpin=function(e){var n=this,o=n.dialog,i=n.find("."+o.getNamespace("button-icon"));return"undefined"==typeof e&&(e=!(t.find(".icon-spin").length>0)),e?(i.hide(),t.prepend(o.createButtonIcon(o.getSpinicon()).addClass("icon-spin"))):(i.show(),t.find(".icon-spin").remove()),n},t.spin=function(){var t=this;return t.toggleSpin(!0),t},t.stopSpin=function(){var t=this;return t.toggleSpin(!1),t},this},createButtonIcon:function(e){var n=t("<span></span>");return n.addClass(this.getNamespace("button-icon")).addClass(e),n},enableButtons:function(e){return t.each(this.indexedButtons,function(t,n){n.toggleEnable(e)}),this},updateClosable:function(){return this.isRealized()&&this.getModalHeader().find("."+this.getNamespace("close-button")).toggle(this.isClosable()),this},onShow:function(t){return this.options.onshow=t,this},onShown:function(t){return this.options.onshown=t,this},onHide:function(t){return this.options.onhide=t,this},onHidden:function(t){return this.options.onhidden=t,this},isRealized:function(){return this.realized},setRealized:function(t){return this.realized=t,this},isOpened:function(){return this.opened},setOpened:function(t){return this.opened=t,this},handleModalEvents:function(){return this.getModal().on("show.bs.modal",{dialog:this},function(t){var e=t.data.dialog;if(e.setOpened(!0),e.isModalEvent(t)&&"function"==typeof e.options.onshow){var n=e.options.onshow(e);return n===!1&&e.setOpened(!1),n}}),this.getModal().on("shown.bs.modal",{dialog:this},function(t){var e=t.data.dialog;e.isModalEvent(t)&&"function"==typeof e.options.onshown&&e.options.onshown(e)}),this.getModal().on("hide.bs.modal",{dialog:this},function(t){var e=t.data.dialog;if(e.setOpened(!1),e.isModalEvent(t)&&"function"==typeof e.options.onhide){var n=e.options.onhide(e);return n===!1&&e.setOpened(!0),n}}),this.getModal().on("hidden.bs.modal",{dialog:this},function(e){var n=e.data.dialog;n.isModalEvent(e)&&"function"==typeof n.options.onhidden&&n.options.onhidden(n),n.isAutodestroy()&&(n.setRealized(!1),delete o.dialogs[n.getId()],t(this).remove()),o.moveFocus()}),this.handleModalBackdropEvent(),this.getModal().on("keyup",{dialog:this},function(t){27===t.which&&t.data.dialog.isClosable()&&t.data.dialog.canCloseByKeyboard()&&t.data.dialog.close()}),this.getModal().on("keyup",{dialog:this},function(e){var n=e.data.dialog;if("undefined"!=typeof n.registeredButtonHotkeys[e.which]){var o=t(n.registeredButtonHotkeys[e.which]);!o.prop("disabled")&&o.focus().trigger("click")}}),this},handleModalBackdropEvent:function(){return this.getModal().on("click",{dialog:this},function(e){t(e.target).hasClass("modal-backdrop")&&e.data.dialog.isClosable()&&e.data.dialog.canCloseByBackdrop()&&e.data.dialog.close()}),this},isModalEvent:function(t){return"undefined"!=typeof t.namespace&&"bs.modal"===t.namespace},makeModalDraggable:function(){return this.options.draggable&&(this.getModalHeader().addClass(this.getNamespace("draggable")).on("mousedown",{dialog:this},function(t){var e=t.data.dialog;e.draggableData.isMouseDown=!0;var n=e.getModalDialog().offset();e.draggableData.mouseOffset={top:t.clientY-n.top,left:t.clientX-n.left}}),this.getModal().on("mouseup mouseleave",{dialog:this},function(t){t.data.dialog.draggableData.isMouseDown=!1}),t("body").on("mousemove",{dialog:this},function(t){var e=t.data.dialog;e.draggableData.isMouseDown&&e.getModalDialog().offset({top:t.clientY-e.draggableData.mouseOffset.top,left:t.clientX-e.draggableData.mouseOffset.left})})),this},realize:function(){return this.initModalStuff(),this.getModal().addClass(o.NAMESPACE).addClass(this.getCssClass()),this.updateSize(),this.getDescription()&&this.getModal().attr("aria-describedby",this.getDescription()),this.getModalFooter().append(this.createFooterContent()),this.getModalHeader().append(this.createHeaderContent()),this.getModalBody().append(this.createBodyContent()),this.getModal().data("bs.modal",new n(this.getModal(),{backdrop:"static",keyboard:!1,show:!1})),this.makeModalDraggable(),this.handleModalEvents(),this.setRealized(!0),this.updateButtons(),this.updateType(),this.updateTitle(),this.updateMessage(),this.updateClosable(),this.updateAnimate(),this.updateSize(),this.updateTabindex(),this},open:function(){return!this.isRealized()&&this.realize(),this.getModal().modal("show"),this},close:function(){return!this.isRealized()&&this.realize(),this.getModal().modal("hide"),this}},o.prototype=t.extend(o.prototype,o.METHODS_TO_OVERRIDE[n.getModalVersion()]),o.newGuid=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0,n="x"===t?e:3&e|8;return n.toString(16)})},o.show=function(t){return new o(t).open()},o.alert=function(){var e={},n={type:o.TYPE_PRIMARY,title:null,message:null,closable:!1,draggable:!1,buttonLabel:o.DEFAULT_TEXTS.OK,callback:null};return e="object"==typeof arguments[0]&&arguments[0].constructor==={}.constructor?t.extend(!0,n,arguments[0]):t.extend(!0,n,{message:arguments[0],callback:"undefined"!=typeof arguments[1]?arguments[1]:null}),new o({type:e.type,title:e.title,message:e.message,closable:e.closable,draggable:e.draggable,data:{callback:e.callback},onhide:function(t){!t.getData("btnClicked")&&t.isClosable()&&"function"==typeof t.getData("callback")&&t.getData("callback")(!1)},buttons:[{label:e.buttonLabel,action:function(t){t.setData("btnClicked",!0),"function"==typeof t.getData("callback")&&t.getData("callback").call(this,!0)!==!1&&t.close()}}]}).open()},o.confirm=function(){var e={},n={type:o.TYPE_PRIMARY,title:null,message:null,closable:!1,draggable:!1,btnCancelLabel:o.DEFAULT_TEXTS.CANCEL,btnOKLabel:o.DEFAULT_TEXTS.OK,btnOKClass:null,callback:null};return e="object"==typeof arguments[0]&&arguments[0].constructor==={}.constructor?t.extend(!0,n,arguments[0]):t.extend(!0,n,{message:arguments[0],closable:!1,buttonLabel:o.DEFAULT_TEXTS.OK,callback:"undefined"!=typeof arguments[1]?arguments[1]:null}),null===e.btnOKClass&&(e.btnOKClass=["btn",e.type.split("-")[1]].join("-")),new o({type:e.type,title:e.title,message:e.message,closable:e.closable,draggable:e.draggable,data:{callback:e.callback},buttons:[{label:e.btnCancelLabel,action:function(t){"function"==typeof t.getData("callback")&&t.getData("callback").call(this,!1)!==!1&&t.close()}},{label:e.btnOKLabel,cssClass:e.btnOKClass,action:function(t){"function"==typeof t.getData("callback")&&t.getData("callback").call(this,!0)!==!1&&t.close()}}]}).open()},o.warning=function(t,e){return new o({type:o.TYPE_WARNING,message:t}).open()},o.danger=function(t,e){return new o({type:o.TYPE_DANGER,message:t}).open()},o.success=function(t,e){return new o({type:o.TYPE_SUCCESS,message:t}).open()},o});

/*

bootpag - jQuery plugin for dynamic pagination

Copyright (c) 2015 botmonster@7items.com

Licensed under the MIT license:
  http://www.opensource.org/licenses/mit-license.php

Project home:
  http://botmonster.com/jquery-bootpag/

Version:  1.0.7

*/
(function(h,q){h.fn.bootpag=function(p){function m(c,b){b=parseInt(b,10);var d,e=0==a.maxVisible?1:a.maxVisible,k=1==a.maxVisible?0:1,n=Math.floor((b-1)/e)*e,f=c.find("li");a.page=b=0>b?0:b>a.total?a.total:b;f.removeClass(a.activeClass);d=1>b-1?1:a.leaps&&b-1>=a.maxVisible?Math.floor((b-1)/e)*e:b-1;a.firstLastUse&&f.first().toggleClass(a.disabledClass,1===b);e=f.first();a.firstLastUse&&(e=e.next());e.toggleClass(a.disabledClass,1===b).attr("data-lp",d).find("a").attr("href",g(d));k=1==a.maxVisible?
0:1;d=b+1>a.total?a.total:a.leaps&&b+1<a.total-a.maxVisible?n+a.maxVisible+k:b+1;e=f.last();a.firstLastUse&&(e=e.prev());e.toggleClass(a.disabledClass,b===a.total).attr("data-lp",d).find("a").attr("href",g(d));f.last().toggleClass(a.disabledClass,b===a.total);e=f.filter("[data-lp="+b+"]");k="."+[a.nextClass,a.prevClass,a.firstClass,a.lastClass].join(",.");if(!e.not(k).length){var m=b<=n?-a.maxVisible:0;f.not(k).each(function(b){d=b+1+n+m;h(this).attr("data-lp",d).toggle(d<=a.total).find("a").html(d).attr("href",
g(d))});e=f.filter("[data-lp="+b+"]")}e.not(k).addClass(a.activeClass);l.data("settings",a)}function g(c){return a.href.replace(a.hrefVariable,c)}var l=this,a=h.extend({total:0,page:1,maxVisible:null,leaps:!0,href:"javascript:void(0);",hrefVariable:"{{number}}",next:"&raquo;",prev:"&laquo;",firstLastUse:!1,first:'<span aria-hidden="true">&larr;</span>',last:'<span aria-hidden="true">&rarr;</span>',wrapClass:"pagination",activeClass:"active",disabledClass:"disabled",nextClass:"next",prevClass:"prev",
lastClass:"last",firstClass:"first"},l.data("settings")||{},p||{});if(0>=a.total)return this;h.isNumeric(a.maxVisible)||a.maxVisible||(a.maxVisible=parseInt(a.total,10));l.data("settings",a);return this.each(function(){var c,b,d=h(this);c=['<ul class="',a.wrapClass,' bootpag">'];a.firstLastUse&&(c=c.concat(['<li data-lp="1" class="',a.firstClass,'"><a href="',g(1),'">',a.first,"</a></li>"]));a.prev&&(c=c.concat(['<li data-lp="1" class="',a.prevClass,'"><a href="',g(1),'">',a.prev,"</a></li>"]));for(b=
1;b<=Math.min(a.total,a.maxVisible);b++)c=c.concat(['<li data-lp="',b,'"><a href="',g(b),'">',b,"</a></li>"]);a.next&&(b=a.leaps&&a.total>a.maxVisible?Math.min(a.maxVisible+1,a.total):2,c=c.concat(['<li data-lp="',b,'" class="',a.nextClass,'"><a href="',g(b),'">',a.next,"</a></li>"]));a.firstLastUse&&(c=c.concat(['<li data-lp="',a.total,'" class="last"><a href="',g(a.total),'">',a.last,"</a></li>"]));c.push("</ul>");d.find("ul.bootpag").remove();d.append(c.join(""));c=d.find("ul.bootpag");d.find("li").click(function(){var b=
h(this);if(!b.hasClass(a.disabledClass)&&!b.hasClass(a.activeClass)){var c=parseInt(b.attr("data-lp"),10);l.find("ul.bootpag").each(function(){m(h(this),c)});l.trigger("page",c)}});m(c,a.page)})}})(jQuery,window);

/* sweetalert */
!function(e,t,n){"use strict";!function o(e,t,n){function a(s,l){if(!t[s]){if(!e[s]){var i="function"==typeof require&&require;if(!l&&i)return i(s,!0);if(r)return r(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var c=t[s]={exports:{}};e[s][0].call(c.exports,function(t){var n=e[s][1][t];return a(n?n:t)},c,c.exports,o,e,t,n)}return t[s].exports}for(var r="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}({1:[function(o,a,r){var s=function(e){return e&&e.__esModule?e:{"default":e}};Object.defineProperty(r,"__esModule",{value:!0});var l,i,u,c,d=o("./modules/handle-dom"),f=o("./modules/utils"),p=o("./modules/handle-swal-dom"),m=o("./modules/handle-click"),v=o("./modules/handle-key"),y=s(v),h=o("./modules/default-params"),b=s(h),g=o("./modules/set-params"),w=s(g);r["default"]=u=c=function(){function o(e){var t=a;return t[e]===n?b["default"][e]:t[e]}var a=arguments[0];if(d.addClass(t.body,"stop-scrolling"),p.resetInput(),a===n)return f.logStr("SweetAlert expects at least 1 attribute!"),!1;var r=f.extend({},b["default"]);switch(typeof a){case"string":r.title=a,r.text=arguments[1]||"",r.type=arguments[2]||"";break;case"object":if(a.title===n)return f.logStr('Missing "title" argument!'),!1;r.title=a.title;for(var s in b["default"])r[s]=o(s);r.confirmButtonText=r.showCancelButton?"Confirm":b["default"].confirmButtonText,r.confirmButtonText=o("confirmButtonText"),r.doneFunction=arguments[1]||null;break;default:return f.logStr('Unexpected type of argument! Expected "string" or "object", got '+typeof a),!1}w["default"](r),p.fixVerticalPosition(),p.openModal(arguments[1]);for(var u=p.getModal(),v=u.querySelectorAll("button"),h=["onclick","onmouseover","onmouseout","onmousedown","onmouseup","onfocus"],g=function(e){return m.handleButton(e,r,u)},C=0;C<v.length;C++)for(var S=0;S<h.length;S++){var x=h[S];v[C][x]=g}p.getOverlay().onclick=g,l=e.onkeydown;var k=function(e){return y["default"](e,r,u)};e.onkeydown=k,e.onfocus=function(){setTimeout(function(){i!==n&&(i.focus(),i=n)},0)},c.enableButtons()},u.setDefaults=c.setDefaults=function(e){if(!e)throw new Error("userParams is required");if("object"!=typeof e)throw new Error("userParams has to be a object");f.extend(b["default"],e)},u.close=c.close=function(){var o=p.getModal();d.fadeOut(p.getOverlay(),5),d.fadeOut(o,5),d.removeClass(o,"showSweetAlert"),d.addClass(o,"hideSweetAlert"),d.removeClass(o,"visible");var a=o.querySelector(".sa-icon.sa-success");d.removeClass(a,"animate"),d.removeClass(a.querySelector(".sa-tip"),"animateSuccessTip"),d.removeClass(a.querySelector(".sa-long"),"animateSuccessLong");var r=o.querySelector(".sa-icon.sa-error");d.removeClass(r,"animateErrorIcon"),d.removeClass(r.querySelector(".sa-x-mark"),"animateXMark");var s=o.querySelector(".sa-icon.sa-warning");return d.removeClass(s,"pulseWarning"),d.removeClass(s.querySelector(".sa-body"),"pulseWarningIns"),d.removeClass(s.querySelector(".sa-dot"),"pulseWarningIns"),setTimeout(function(){var e=o.getAttribute("data-custom-class");d.removeClass(o,e)},300),d.removeClass(t.body,"stop-scrolling"),e.onkeydown=l,e.previousActiveElement&&e.previousActiveElement.focus(),i=n,clearTimeout(o.timeout),!0},u.showInputError=c.showInputError=function(e){var t=p.getModal(),n=t.querySelector(".sa-input-error");d.addClass(n,"show");var o=t.querySelector(".sa-error-container");d.addClass(o,"show"),o.querySelector("p").innerHTML=e,setTimeout(function(){u.enableButtons()},1),t.querySelector("input").focus()},u.resetInputError=c.resetInputError=function(e){if(e&&13===e.keyCode)return!1;var t=p.getModal(),n=t.querySelector(".sa-input-error");d.removeClass(n,"show");var o=t.querySelector(".sa-error-container");d.removeClass(o,"show")},u.disableButtons=c.disableButtons=function(){var e=p.getModal(),t=e.querySelector("button.confirm"),n=e.querySelector("button.cancel");t.disabled=!0,n.disabled=!0},u.enableButtons=c.enableButtons=function(){var e=p.getModal(),t=e.querySelector("button.confirm"),n=e.querySelector("button.cancel");t.disabled=!1,n.disabled=!1},"undefined"!=typeof e?e.sweetAlert=e.swal=u:f.logStr("SweetAlert is a frontend module!"),a.exports=r["default"]},{"./modules/default-params":2,"./modules/handle-click":3,"./modules/handle-dom":4,"./modules/handle-key":5,"./modules/handle-swal-dom":6,"./modules/set-params":8,"./modules/utils":9}],2:[function(e,t,n){Object.defineProperty(n,"__esModule",{value:!0});var o={title:"",text:"",type:null,allowOutsideClick:!1,showConfirmButton:!0,showCancelButton:!1,closeOnConfirm:!0,closeOnCancel:!0,confirmButtonText:"OK",confirmButtonColor:"#8CD4F5",cancelButtonText:"Cancel",imageUrl:null,imageSize:null,timer:null,customClass:"",html:!1,animation:!0,allowEscapeKey:!0,inputType:"text",inputPlaceholder:"",inputValue:"",showLoaderOnConfirm:!1};n["default"]=o,t.exports=n["default"]},{}],3:[function(t,n,o){Object.defineProperty(o,"__esModule",{value:!0});var a=t("./utils"),r=(t("./handle-swal-dom"),t("./handle-dom")),s=function(t,n,o){function s(e){m&&n.confirmButtonColor&&(p.style.backgroundColor=e)}var u,c,d,f=t||e.event,p=f.target||f.srcElement,m=-1!==p.className.indexOf("confirm"),v=-1!==p.className.indexOf("sweet-overlay"),y=r.hasClass(o,"visible"),h=n.doneFunction&&"true"===o.getAttribute("data-has-done-function");switch(m&&n.confirmButtonColor&&(u=n.confirmButtonColor,c=a.colorLuminance(u,-.04),d=a.colorLuminance(u,-.14)),f.type){case"mouseover":s(c);break;case"mouseout":s(u);break;case"mousedown":s(d);break;case"mouseup":s(c);break;case"focus":var b=o.querySelector("button.confirm"),g=o.querySelector("button.cancel");m?g.style.boxShadow="none":b.style.boxShadow="none";break;case"click":var w=o===p,C=r.isDescendant(o,p);if(!w&&!C&&y&&!n.allowOutsideClick)break;m&&h&&y?l(o,n):h&&y||v?i(o,n):r.isDescendant(o,p)&&"BUTTON"===p.tagName&&sweetAlert.close()}},l=function(e,t){var n=!0;r.hasClass(e,"show-input")&&(n=e.querySelector("input").value,n||(n="")),t.doneFunction(n),t.closeOnConfirm&&sweetAlert.close(),t.showLoaderOnConfirm&&sweetAlert.disableButtons()},i=function(e,t){var n=String(t.doneFunction).replace(/\s/g,""),o="function("===n.substring(0,9)&&")"!==n.substring(9,10);o&&t.doneFunction(!1),t.closeOnCancel&&sweetAlert.close()};o["default"]={handleButton:s,handleConfirm:l,handleCancel:i},n.exports=o["default"]},{"./handle-dom":4,"./handle-swal-dom":6,"./utils":9}],4:[function(n,o,a){Object.defineProperty(a,"__esModule",{value:!0});var r=function(e,t){return new RegExp(" "+t+" ").test(" "+e.className+" ")},s=function(e,t){r(e,t)||(e.className+=" "+t)},l=function(e,t){var n=" "+e.className.replace(/[\t\r\n]/g," ")+" ";if(r(e,t)){for(;n.indexOf(" "+t+" ")>=0;)n=n.replace(" "+t+" "," ");e.className=n.replace(/^\s+|\s+$/g,"")}},i=function(e){var n=t.createElement("div");return n.appendChild(t.createTextNode(e)),n.innerHTML},u=function(e){e.style.opacity="",e.style.display="block"},c=function(e){if(e&&!e.length)return u(e);for(var t=0;t<e.length;++t)u(e[t])},d=function(e){e.style.opacity="",e.style.display="none"},f=function(e){if(e&&!e.length)return d(e);for(var t=0;t<e.length;++t)d(e[t])},p=function(e,t){for(var n=t.parentNode;null!==n;){if(n===e)return!0;n=n.parentNode}return!1},m=function(e){e.style.left="-9999px",e.style.display="block";var t,n=e.clientHeight;return t="undefined"!=typeof getComputedStyle?parseInt(getComputedStyle(e).getPropertyValue("padding-top"),10):parseInt(e.currentStyle.padding),e.style.left="",e.style.display="none","-"+parseInt((n+t)/2)+"px"},v=function(e,t){if(+e.style.opacity<1){t=t||16,e.style.opacity=0,e.style.display="block";var n=+new Date,o=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){e.style.opacity=+e.style.opacity+(new Date-n)/100,n=+new Date,+e.style.opacity<1&&setTimeout(o,t)});o()}e.style.display="block"},y=function(e,t){t=t||16,e.style.opacity=1;var n=+new Date,o=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){e.style.opacity=+e.style.opacity-(new Date-n)/100,n=+new Date,+e.style.opacity>0?setTimeout(o,t):e.style.display="none"});o()},h=function(n){if("function"==typeof MouseEvent){var o=new MouseEvent("click",{view:e,bubbles:!1,cancelable:!0});n.dispatchEvent(o)}else if(t.createEvent){var a=t.createEvent("MouseEvents");a.initEvent("click",!1,!1),n.dispatchEvent(a)}else t.createEventObject?n.fireEvent("onclick"):"function"==typeof n.onclick&&n.onclick()},b=function(t){"function"==typeof t.stopPropagation?(t.stopPropagation(),t.preventDefault()):e.event&&e.event.hasOwnProperty("cancelBubble")&&(e.event.cancelBubble=!0)};a.hasClass=r,a.addClass=s,a.removeClass=l,a.escapeHtml=i,a._show=u,a.show=c,a._hide=d,a.hide=f,a.isDescendant=p,a.getTopMargin=m,a.fadeIn=v,a.fadeOut=y,a.fireClick=h,a.stopEventPropagation=b},{}],5:[function(t,o,a){Object.defineProperty(a,"__esModule",{value:!0});var r=t("./handle-dom"),s=t("./handle-swal-dom"),l=function(t,o,a){var l=t||e.event,i=l.keyCode||l.which,u=a.querySelector("button.confirm"),c=a.querySelector("button.cancel"),d=a.querySelectorAll("button[tabindex]");if(-1!==[9,13,32,27].indexOf(i)){for(var f=l.target||l.srcElement,p=-1,m=0;m<d.length;m++)if(f===d[m]){p=m;break}9===i?(f=-1===p?u:p===d.length-1?d[0]:d[p+1],r.stopEventPropagation(l),f.focus(),o.confirmButtonColor&&s.setFocusStyle(f,o.confirmButtonColor)):13===i?("INPUT"===f.tagName&&(f=u,u.focus()),f=-1===p?u:n):27===i&&o.allowEscapeKey===!0?(f=c,r.fireClick(f,l)):f=n}};a["default"]=l,o.exports=a["default"]},{"./handle-dom":4,"./handle-swal-dom":6}],6:[function(n,o,a){var r=function(e){return e&&e.__esModule?e:{"default":e}};Object.defineProperty(a,"__esModule",{value:!0});var s=n("./utils"),l=n("./handle-dom"),i=n("./default-params"),u=r(i),c=n("./injected-html"),d=r(c),f=".sweet-alert",p=".sweet-overlay",m=function(){var e=t.createElement("div");for(e.innerHTML=d["default"];e.firstChild;)t.body.appendChild(e.firstChild)},v=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=t.querySelector(f);return e||(m(),e=v()),e}),y=function(){var e=v();return e?e.querySelector("input"):void 0},h=function(){return t.querySelector(p)},b=function(e,t){var n=s.hexToRgb(t);e.style.boxShadow="0 0 2px rgba("+n+", 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)"},g=function(n){var o=v();l.fadeIn(h(),10),l.show(o),l.addClass(o,"showSweetAlert"),l.removeClass(o,"hideSweetAlert"),e.previousActiveElement=t.activeElement;var a=o.querySelector("button.confirm");a.focus(),setTimeout(function(){l.addClass(o,"visible")},500);var r=o.getAttribute("data-timer");if("null"!==r&&""!==r){var s=n;o.timeout=setTimeout(function(){var e=(s||null)&&"true"===o.getAttribute("data-has-done-function");e?s(null):sweetAlert.close()},r)}},w=function(){var e=v(),t=y();l.removeClass(e,"show-input"),t.value=u["default"].inputValue,t.setAttribute("type",u["default"].inputType),t.setAttribute("placeholder",u["default"].inputPlaceholder),C()},C=function(e){if(e&&13===e.keyCode)return!1;var t=v(),n=t.querySelector(".sa-input-error");l.removeClass(n,"show");var o=t.querySelector(".sa-error-container");l.removeClass(o,"show")},S=function(){var e=v();e.style.marginTop=l.getTopMargin(v())};a.sweetAlertInitialize=m,a.getModal=v,a.getOverlay=h,a.getInput=y,a.setFocusStyle=b,a.openModal=g,a.resetInput=w,a.resetInputError=C,a.fixVerticalPosition=S},{"./default-params":2,"./handle-dom":4,"./injected-html":7,"./utils":9}],7:[function(e,t,n){Object.defineProperty(n,"__esModule",{value:!0});var o='<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert"><div class="sa-icon sa-error">\n      <span class="sa-x-mark">\n        <span class="sa-line sa-left"></span>\n        <span class="sa-line sa-right"></span>\n      </span>\n    </div><div class="sa-icon sa-warning">\n      <span class="sa-body"></span>\n      <span class="sa-dot"></span>\n    </div><div class="sa-icon sa-info"></div><div class="sa-icon sa-success">\n      <span class="sa-line sa-tip"></span>\n      <span class="sa-line sa-long"></span>\n\n      <div class="sa-placeholder"></div>\n      <div class="sa-fix"></div>\n    </div><div class="sa-icon sa-custom"></div><h2>Title</h2>\n    <p>Text</p>\n    <fieldset>\n      <input type="text" tabIndex="3" />\n      <div class="sa-input-error"></div>\n    </fieldset><div class="sa-error-container">\n      <div class="icon">!</div>\n      <p>Not valid!</p>\n    </div><div class="sa-button-container">\n      <button class="cancel" tabIndex="2">Cancel</button>\n      <div class="sa-confirm-button-container">\n        <button class="confirm" tabIndex="1">OK</button><div class="la-ball-fall">\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>\n    </div></div>';n["default"]=o,t.exports=n["default"]},{}],8:[function(e,t,o){Object.defineProperty(o,"__esModule",{value:!0});var a=e("./utils"),r=e("./handle-swal-dom"),s=e("./handle-dom"),l=["error","warning","info","success","input","prompt"],i=function(e){var t=r.getModal(),o=t.querySelector("h2"),i=t.querySelector("p"),u=t.querySelector("button.cancel"),c=t.querySelector("button.confirm");if(o.innerHTML=e.html?e.title:s.escapeHtml(e.title).split("\n").join("<br>"),i.innerHTML=e.html?e.text:s.escapeHtml(e.text||"").split("\n").join("<br>"),e.text&&s.show(i),e.customClass)s.addClass(t,e.customClass),t.setAttribute("data-custom-class",e.customClass);else{var d=t.getAttribute("data-custom-class");s.removeClass(t,d),t.setAttribute("data-custom-class","")}if(s.hide(t.querySelectorAll(".sa-icon")),e.type&&!a.isIE8()){var f=function(){for(var o=!1,a=0;a<l.length;a++)if(e.type===l[a]){o=!0;break}if(!o)return logStr("Unknown alert type: "+e.type),{v:!1};var i=["success","error","warning","info"],u=n;-1!==i.indexOf(e.type)&&(u=t.querySelector(".sa-icon.sa-"+e.type),s.show(u));var c=r.getInput();switch(e.type){case"success":s.addClass(u,"animate"),s.addClass(u.querySelector(".sa-tip"),"animateSuccessTip"),s.addClass(u.querySelector(".sa-long"),"animateSuccessLong");break;case"error":s.addClass(u,"animateErrorIcon"),s.addClass(u.querySelector(".sa-x-mark"),"animateXMark");break;case"warning":s.addClass(u,"pulseWarning"),s.addClass(u.querySelector(".sa-body"),"pulseWarningIns"),s.addClass(u.querySelector(".sa-dot"),"pulseWarningIns");break;case"input":case"prompt":c.setAttribute("type",e.inputType),c.value=e.inputValue,c.setAttribute("placeholder",e.inputPlaceholder),s.addClass(t,"show-input"),setTimeout(function(){c.focus(),c.addEventListener("keyup",swal.resetInputError)},400)}}();if("object"==typeof f)return f.v}if(e.imageUrl){var p=t.querySelector(".sa-icon.sa-custom");p.style.backgroundImage="url("+e.imageUrl+")",s.show(p);var m=80,v=80;if(e.imageSize){var y=e.imageSize.toString().split("x"),h=y[0],b=y[1];h&&b?(m=h,v=b):logStr("Parameter imageSize expects value with format WIDTHxHEIGHT, got "+e.imageSize)}p.setAttribute("style",p.getAttribute("style")+"width:"+m+"px; height:"+v+"px")}t.setAttribute("data-has-cancel-button",e.showCancelButton),e.showCancelButton?u.style.display="inline-block":s.hide(u),t.setAttribute("data-has-confirm-button",e.showConfirmButton),e.showConfirmButton?c.style.display="inline-block":s.hide(c),e.cancelButtonText&&(u.innerHTML=s.escapeHtml(e.cancelButtonText)),e.confirmButtonText&&(c.innerHTML=s.escapeHtml(e.confirmButtonText)),e.confirmButtonColor&&(c.style.backgroundColor=e.confirmButtonColor,c.style.borderLeftColor=e.confirmLoadingButtonColor,c.style.borderRightColor=e.confirmLoadingButtonColor,r.setFocusStyle(c,e.confirmButtonColor)),t.setAttribute("data-allow-outside-click",e.allowOutsideClick);var g=e.doneFunction?!0:!1;t.setAttribute("data-has-done-function",g),e.animation?"string"==typeof e.animation?t.setAttribute("data-animation",e.animation):t.setAttribute("data-animation","pop"):t.setAttribute("data-animation","none"),t.setAttribute("data-timer",e.timer)};o["default"]=i,t.exports=o["default"]},{"./handle-dom":4,"./handle-swal-dom":6,"./utils":9}],9:[function(t,n,o){Object.defineProperty(o,"__esModule",{value:!0});var a=function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},r=function(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?parseInt(t[1],16)+", "+parseInt(t[2],16)+", "+parseInt(t[3],16):null},s=function(){return e.attachEvent&&!e.addEventListener},l=function(t){e.console&&e.console.log("SweetAlert: "+t)},i=function(e,t){e=String(e).replace(/[^0-9a-f]/gi,""),e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),t=t||0;var n,o,a="#";for(o=0;3>o;o++)n=parseInt(e.substr(2*o,2),16),n=Math.round(Math.min(Math.max(0,n+n*t),255)).toString(16),a+=("00"+n).substr(n.length);return a};o.extend=a,o.hexToRgb=r,o.isIE8=s,o.logStr=l,o.colorLuminance=i},{}]},{},[1]),"function"==typeof define&&define.amd?define(function(){return sweetAlert}):"undefined"!=typeof module&&module.exports&&(module.exports=sweetAlert)}(window,document);


/******************************************************************************
 * jquery.i18n.properties
 *
 * Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and
 * MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
 *
 * @version     1.2.2
 * @url         https://github.com/jquery-i18n-properties/jquery-i18n-properties
 * @inspiration Localisation assistance for jQuery (http://keith-wood.name/localisation.html)
 *              by Keith Wood (kbwood{at}iinet.com.au) June 2007
 *
 *****************************************************************************/
!function($){function callbackIfComplete(e){e.async&&(e.filesLoaded+=1,e.filesLoaded===e.totalFiles&&e.callback&&e.callback())}function loadAndParseFile(e,a){$.ajax({url:e,async:a.async,cache:a.cache,dataType:"text",success:function(e,r){parseData(e,a.mode),callbackIfComplete(a)},error:function(r,t,n){console.log("Failed to download or parse "+e),callbackIfComplete(a)}})}function parseData(data,mode){for(var parsed="",parameters=data.split(/\n/),regPlaceHolder=/(\{\d+})/g,regRepPlaceHolder=/\{(\d+)}/g,unicodeRE=/(\\u.{4})/gi,i=0;i<parameters.length;i++)if(parameters[i]=parameters[i].replace(/^\s\s*/,"").replace(/\s\s*$/,""),parameters[i].length>0&&"#"!=parameters[i].match("^#")){var pair=parameters[i].split("=")
if(pair.length>0){for(var name=decodeURI(pair[0]).replace(/^\s\s*/,"").replace(/\s\s*$/,""),value=1==pair.length?"":pair[1];"\\"==value.match(/\\$/);)value=value.substring(0,value.length-1),value+=parameters[++i].replace(/\s\s*$/,"")
for(var s=2;s<pair.length;s++)value+="="+pair[s]
if(value=value.replace(/^\s\s*/,"").replace(/\s\s*$/,""),"map"==mode||"both"==mode){var unicodeMatches=value.match(unicodeRE)
if(unicodeMatches)for(var u=0;u<unicodeMatches.length;u++)value=value.replace(unicodeMatches[u],unescapeUnicode(unicodeMatches[u]))
$.i18n.map[name]=value}if("vars"==mode||"both"==mode)if(value=value.replace(/"/g,'\\"'),checkKeyNamespace(name),regPlaceHolder.test(value)){for(var parts=value.split(regPlaceHolder),first=!0,fnArgs="",usedArgs=[],p=0;p<parts.length;p++)!regPlaceHolder.test(parts[p])||0!=usedArgs.length&&-1!=usedArgs.indexOf(parts[p])||(first||(fnArgs+=","),fnArgs+=parts[p].replace(regRepPlaceHolder,"v$1"),usedArgs.push(parts[p]),first=!1)
parsed+=name+"=function("+fnArgs+"){"
var fnExpr='"'+value.replace(regRepPlaceHolder,'"+v$1+"')+'"'
parsed+="return "+fnExpr+";};"}else parsed+=name+'="'+value+'";'}}eval(parsed)}function checkKeyNamespace(key){var regDot=/\./
if(regDot.test(key))for(var fullname="",names=key.split(/\./),i=0;i<names.length;i++)i>0&&(fullname+="."),fullname+=names[i],eval("typeof "+fullname+' == "undefined"')&&eval(fullname+"={};")}function getFiles(e){return e&&e.constructor==Array?e:[e]}function unescapeUnicode(e){var a=[],r=parseInt(e.substr(2),16)
r>=0&&r<Math.pow(2,16)&&a.push(r)
for(var t="",n=0;n<a.length;++n)t+=String.fromCharCode(a[n])
return t}$.i18n={},$.i18n.map={},$.i18n.properties=function(e){var a={name:"Messages",language:"",path:"",mode:"vars",cache:!1,encoding:"UTF-8",async:!1,checkAvailableLanguages:!1,callback:null}
e=$.extend(a,e),e.language=this.normaliseLanguageCode(e.language)
var r=function(a){e.totalFiles=0,e.filesLoaded=0
var r=getFiles(e.name)
if(e.async)for(var t=0,n=r.length;n>t;t++){e.totalFiles+=1
var s=e.language.substring(0,2)
if(0!=a.length&&-1==$.inArray(s,a)||(e.totalFiles+=1),e.language.length>=5){var l=e.language.substring(0,5)
0!=a.length&&-1==$.inArray(l,a)||(e.totalFiles+=1)}}for(var i=0,g=r.length;g>i;i++){loadAndParseFile(e.path+r[i]+".properties",e)
var s=e.language.substring(0,2)
if(0!=a.length&&-1==$.inArray(s,a)||loadAndParseFile(e.path+r[i]+"_"+s+".properties",e),e.language.length>=5){var l=e.language.substring(0,5)
0!=a.length&&-1==$.inArray(l,a)||loadAndParseFile(e.path+r[i]+"_"+l+".properties",e)}}e.callback&&!e.async&&e.callback()}
e.checkAvailableLanguages?$.ajax({url:e.path+"languages.json",async:e.async,cache:!1,success:function(e,a,t){r(e.languages||[])}}):r([])},$.i18n.prop=function(e){var a=$.i18n.map[e]
if(null==a)return"["+e+"]"
var r
2==arguments.length&&$.isArray(arguments[1])&&(r=arguments[1])
var t
if("string"==typeof a){for(t=0;-1!=(t=a.indexOf("\\",t));)a="t"==a.charAt(t+1)?a.substring(0,t)+"	"+a.substring(t++ +2):"r"==a.charAt(t+1)?a.substring(0,t)+"\r"+a.substring(t++ +2):"n"==a.charAt(t+1)?a.substring(0,t)+"\n"+a.substring(t++ +2):"f"==a.charAt(t+1)?a.substring(0,t)+"\f"+a.substring(t++ +2):"\\"==a.charAt(t+1)?a.substring(0,t)+"\\"+a.substring(t++ +2):a.substring(0,t)+a.substring(t+1)
var n,s,l=[]
for(t=0;t<a.length;)if("'"==a.charAt(t))if(t==a.length-1)a=a.substring(0,t)
else if("'"==a.charAt(t+1))a=a.substring(0,t)+a.substring(++t)
else{for(n=t+2;-1!=(n=a.indexOf("'",n));){if(n==a.length-1||"'"!=a.charAt(n+1)){a=a.substring(0,t)+a.substring(t+1,n)+a.substring(n+1),t=n-1
break}a=a.substring(0,n)+a.substring(++n)}-1==n&&(a=a.substring(0,t)+a.substring(t+1))}else if("{"==a.charAt(t))if(n=a.indexOf("}",t+1),-1==n)t++
else if(s=parseInt(a.substring(t+1,n)),!isNaN(s)&&s>=0){var i=a.substring(0,t)
""!=i&&l.push(i),l.push(s),t=0,a=a.substring(n+1)}else t=n+1
else t++
""!=a&&l.push(a),a=l,$.i18n.map[e]=l}if(0==a.length)return""
if(1==a.length&&"string"==typeof a[0])return a[0]
var g=""
for(t=0;t<a.length;t++)g+="string"==typeof a[t]?a[t]:r&&a[t]<r.length?r[a[t]]:!r&&a[t]+1<arguments.length?arguments[a[t]+1]:"{"+a[t]+"}"
return g},$.i18n.normaliseLanguageCode=function(e){return(!e||e.length<2)&&(e=navigator.languages?navigator.languages[0]:navigator.language||navigator.userLanguage||"en"),e=e.toLowerCase(),e=e.replace(/-/,"_"),e.length>3&&(e=e.substring(0,3)+e.substring(3).toUpperCase()),e}
var cbSplit
cbSplit||(cbSplit=function(e,a,r){if("[object RegExp]"!==Object.prototype.toString.call(a))return"undefined"==typeof cbSplit._nativeSplit?e.split(a,r):cbSplit._nativeSplit.call(e,a,r)
var t,n,s,l,i=[],g=0,c=(a.ignoreCase?"i":"")+(a.multiline?"m":"")+(a.sticky?"y":""),a=new RegExp(a.source,c+"g")
if(e+="",cbSplit._compliantExecNpcg||(t=new RegExp("^"+a.source+"$(?!\\s)",c)),void 0===r||0>+r)r=1/0
else if(r=Math.floor(+r),!r)return[]
for(;(n=a.exec(e))&&(s=n.index+n[0].length,!(s>g&&(i.push(e.slice(g,n.index)),!cbSplit._compliantExecNpcg&&n.length>1&&n[0].replace(t,function(){for(var e=1;e<arguments.length-2;e++)void 0===arguments[e]&&(n[e]=void 0)}),n.length>1&&n.index<e.length&&Array.prototype.push.apply(i,n.slice(1)),l=n[0].length,g=s,i.length>=r)));)a.lastIndex===n.index&&a.lastIndex++
return g===e.length?!l&&a.test("")||i.push(""):i.push(e.slice(g)),i.length>r?i.slice(0,r):i},cbSplit._compliantExecNpcg=void 0===/()??/.exec("")[1],cbSplit._nativeSplit=String.prototype.split),String.prototype.split=function(e,a){return cbSplit(this,e,a)}}(jQuery)


/* chosen */
var LANG = {
		'zh-CN': {
			'keywordSearch': '关键字搜索…',
			'search': '搜 索',
			'searching': '正在搜索...',
			'no': '没有',
			'result': '的相关结果',
			'num': '数量'
		},
		'en-US': {
			'keywordSearch': 'keyword search…',
			'search': 'Search',
			'searching': 'Searching...',
			'no': 'not',
			'result': 'result.',
			'num': 'totalUser'
		}
	}
	var Lang = LANG['en-US'];

	$.fn.Chosen = function(options){
	    var dafaults = {
	        data: [],
	        valueWidth: 'auto',
	        standardHeight: 32,
	        chosenConWidth: 150,
	        dataListHeight: 290,
	        isSearch: true,
	        isValue: false,
	        searchBack: false,
	        searchAjaxURL: '',
	        beforeFillData: function(_self){},
	        initCallback: function(_self){},
	        selectedVal: [],
	        selectedCallback: function(id, name, _self){},
	        removeCallback: function(id, name, _self){},
	        initTip: '',
	        clearSelected: false,
	        multi: false,
	        maskText: false,
	        multiCol: false,
	        maxSize: 5,
	        maxSizeTip: '',
	        joinChar: ',',
	        idAlias: 'id',
	        nameAlias: 'name'
	    };

	    var opt = $.extend({}, dafaults, options);
	    var rightPadding = opt.clearSelected ? 40 : 20;

	    // 数组扩展
	    Array.prototype.indexOf = function(Object){
	        for(var i = 0, len = this.length; i < len; i++){
	            if(this[i] == Object){
	                return i;
	            }
	        }
	        return -1;
	    };

	    // 数组删除项
	    Array.prototype.remove = function(val) {
	        var index = this.indexOf(val);
	        if (index > -1) {
	            this.splice(index, 1);
	        }
	        return this;
	    };
	    

	    var Chosen = {
	        // 初始化
	        _init: function(){
	            var selectedWidth = opt.valueWidth - rightPadding - 6;
	            var _dataSelectedCon;
	            if(opt.multi){
	                if(opt.multiCol){
	                    _dataSelectedCon = '<a href="javascript:;" class="fixedText"></a>';
	                }else{
	                    _dataSelectedCon = '<div class="dataSelectedCon"></div>';
	                }
	            }else{
	                _dataSelectedCon = '<a href="javascript:;" class="fixedText"></a>';
	            }
	            
	            _self.attr('data-height', opt.standardHeight);
	            
	            _self.append(
	                '<div class="dataSelected" style="height:'+opt.standardHeight+'px;line-height:'+opt.standardHeight+'px;padding-right:'+rightPadding+'px">' +
	                '<label class="maskText">'+opt.maskText+'</label>'+
	                '<label class="fixedTextInit">'+opt.initTip+'</label>'+_dataSelectedCon+
	                '<input type="hidden" class="fixedId" />' +
	                '<input type="hidden" class="fixedVal" />' +
	                '<input type="hidden" class="fixedAlias" />' +
	                '<a href="javascript:;" class="clearSelected"></a><b class="chosenArrow"></b></div>'+
	                '<div class="chosenCon">'+
	                '<div class="searchKeyword"><input type="text" class="keywords form-control" autocomplete="off" placeholder="'+Lang.keywordSearch+'" />' +
	                '<div class="dataList keywordsDataList"><ul></ul></div></div>'+
	                '<div class="dataList dataListAll"><ul></ul></div>'+
	                '</div>');
	            

	            if(typeof opt.valueWidth == 'number'){
	                _self.find('.dataSelected').width(selectedWidth);
	                _self.find('.dataSelected .fixedText').width(selectedWidth);
	            }
	            if(opt.skins){
	                 _self.addClass(opt.skins);
	            }
	            if(opt.maskText != false){
	                _self.find('.maskText').show();
	            }
	            
	            // 绑定数据之前
	            opt.beforeFillData(_self, opt.data);

	            // 是否显示搜索
	            if(opt.isSearch){
	                if(opt.searchBack){
	                    Chosen.keywordsSearchBack();
	                }else{
	                    if(opt.data.length > 5){
	                        Chosen.keywordsSearch();
	                    }
	                }
	            }

	            // 选择下拉框的宽度
	            opt.chosenConWidth && _self.find('.chosenCon').css({'width': opt.chosenConWidth, 'top': opt.standardHeight});

	            var dataListAll = _self.find('.dataListAll');
	            var dataListAllUl = dataListAll.find('ul');
	            if(opt.isValue){
	            	$.each(opt.data,function(k,v){
		           		 dataListAllUl.append('<li thisid="'+v+'" thisval="'+v+'" thisalias="'+v+'">'+v+'</li>');
		           	})
	            }else{
	            	$.each(opt.data, function(k, v){
		                if(!RegExp('[?]').test(v[opt.nameAlias])){
		                   dataListAllUl.append('<li thisid="'+v[opt.idAlias]+'" thisval="'+v[opt.nameAlias]+'" thisalias="'+v.alias+'">' + v[opt.nameAlias] + '</li>');
		                }
		            });
	            }
	            
	            if(opt.selectedVal.length > 0){
	                var selectedId = [];
	                var selectedValue = [];
	                var selectedAlias = [];
	                $.each(opt.selectedVal, function(k, v){
	                    dataListAllUl.find('li').each(function(){
	                        var _name = $(this).attr('thisval');
	                        var _id = $(this).attr('thisid');
	                        var _alias = $(this).attr('thisalias');
	                        if(_name == v){
	                            selectedId.push(_id);
	                            selectedAlias.push(_alias);
	                        }
	                    });
	                });


	                if(opt.multi && !opt.multiCol){
	                    for(var i = 0, len = selectedId.length; i < len; i++){
	                        _self.find('.dataSelectedCon').append(
	                            '<span class="item" thisid="'+selectedId[i]+'" thisval="'+opt.selectedVal[i]+'" thisalias="'+selectedAlias[i]+'">' +
	                                '<a href="javascript:;" class="itemText">'+opt.selectedVal[i]+'</a><a href="javascript:;" class="delItem"></a></span>');
	                    }
	                }else{
	                    _self.find('.fixedText').html(opt.selectedVal.join(opt.joinChar));
	                }

	                _self.find('.fixedId').val(selectedId.join(opt.joinChar));
	                _self.find('.fixedVal').val(opt.selectedVal.join(opt.joinChar));
	                _self.find('.fixedAlias').val(selectedAlias.join(opt.joinChar));

	            }
	            dataListAllUl.find('li').filter(':odd').addClass('odd');
	            Chosen._bind();
	        },

	        _selectedMove: function(method){
	            var _activeDatalist = _self.find('.dataListAll').is(':hidden') ? _self.find('.keywordsDataList') : _self.find('.dataListAll');
	            var dataliLen = _activeDatalist.find('li').length;

	            _activeDatalist.find('li.hover').removeClass('hover');
	            _activeDatalist.find('li').eq(_i).addClass('hover');
	            var selectedLi = _activeDatalist.find('li').eq(_i);

	            if(method == 'down'){
	                if(_i < dataliLen - 1){
	                    _i++;
	                }
	            }else{
	                if(_i > 0){
	                    _i--;
	                }
	            }

	            var itemHeight = selectedLi.outerHeight();
	            var itemTop = selectedLi.position().top;

	            if(itemHeight + itemTop > _activeDatalist.height()){
	                _activeDatalist.scrollTop(_activeDatalist.scrollTop() + itemTop + itemHeight  - _activeDatalist.height());
	            }else if(itemTop < 0){
	                _activeDatalist.scrollTop(_activeDatalist.scrollTop() + itemTop);
	            }
	        },

	        keywordsSearch: function(){
	            _self.find('.searchKeyword').show();

	            _self.find('.searchKeyword .keywords').width(opt.chosenConWidth - 34);

	            var dataListAll = _self.find('.dataListAll');
	            var keywordDataList = _self.find('.keywordsDataList');
	            var keywordDataListUI = _self.find('.keywordsDataList ul');

	            _self.find('.keywords').keyup(function(e){
	                switch(e.keyCode){
	                    case 13: // enter
	                    case 16: // shift
	                    case 17: // ctrl
	                    case 37: // left
	                    case 38: // up
	                    case 39: // right
	                    case 40: // down
	                        break;
	                    case 27: // esc
	                        break;
	                    default:
	                        _i = 0;
	                        var _keyword = $(this).val(), keyword;
	                        if(_keyword != ''){
	                            keyword = _keyword;

	                            dataListAll.hide();
	                            keywordDataList.show();
	                            keywordDataListUI.html('');

	                            if(RegExp('([\(])').test(_keyword)){
	                                keyword = _keyword.replace(/(\()/, "\\"+"$1");
	                            }
	                            if(RegExp('([\)])').test(_keyword)){
	                                keyword = _keyword.replace(/(\))/, "\\"+"$1");
	                            }
	                            if(RegExp('([\[])').test(_keyword)){
	                                keyword = _keyword.replace(/(\[)/, "\\"+"$1");
	                            }
	                            if(RegExp('([\]])').test(_keyword)){
	                                keyword = _keyword.replace(/(\])/, "\\"+"$1");
	                            }

	                            dataListAll.find('li').each(function(k, v){
	                                var thisVal = $(this).attr('thisval');
	                                var thisHtml = $(this).html();
	                                var thisId = $(this).attr('thisid');

	                                if(RegExp(keyword, "i").test(thisVal)){
	                                    thisHtml = thisHtml.replace(eval("/("+keyword+")/gi"), '<b>'+'$1'+'</b>');
	                                    var _active = _self.find('.fixedId').val().split(opt.joinChar).indexOf(thisId) > -1 ? 'active' : '';
	                                    keywordDataListUI.append('<li thisid="'+thisId+'" thisval="'+thisVal+'" class="'+_active+'">'+thisHtml+'</li>');
	                                }
	                            });

	                            if(!keywordDataListUI.find('li').length){
	                                keywordDataListUI.append('<li class="noResult">'+Lang.no+'<b>"'+_keyword+'"</b>'+Lang.result+'</li>');
	                            }
	                            keywordDataListUI.find('li').filter(':odd').addClass('odd');

	                            var thisHeight = keywordDataListUI.height();
	                            keywordDataList.height(thisHeight > opt.dataListHeight ? opt.dataListHeight : thisHeight);

	                            _self.find('.dataList li').hover(function(){
	                                $(this).addClass('hover');
	                            }, function(){
	                                $(this).removeClass('hover');
	                            });
	                        }else{
	                            dataListAll.show();
	                            keywordDataList.hide().find('ul').html('');
	                        }

//								if(opt.multi){
	                        var thisSelectedId = _self.find('.fixedId').val().split(opt.joinChar);
	                        _self.find('.dataList li').each(function(k, v){
	                            if(thisSelectedId.indexOf($(this).attr('thisid')) > -1){
	                                $(this).addClass('active');
	                            }
	                        });
//								}
	                }
	            })
	        },

	        keywordsSearchBack: function(){
	            _self.find('.searchKeyword').append('<a href="javascript:;" class="btn btnPrimary keywordsSearch">'+Lang.search+'</a>');
	            _self.find('.searchKeyword').show();

	            _self.find('.searchKeyword .keywords').width(opt.chosenConWidth - 20);

	            var dataListAll = _self.find('.dataListAll');
	            var keywordDataList = _self.find('.keywordsDataList');
	            var keywordDataListUI = _self.find('.keywordsDataList ul');

	            _self.find('.keywords').keyup(function(e){
	                switch(e.keyCode){
	                    case 13: // enter
	                    case 16: // shift
	                    case 17: // ctrl
	                    case 37: // left
	                    case 38: // up
	                    case 39: // right
	                    case 40: // down
	                        break;
	                    case 27: // esc
	                        break;
	                    default:
	                        var _keyword = $(this).val();
	                        if(_keyword != ''){
	                            dataListAll.hide();
	                            keywordDataList.show();
	                            $('.keywordsSearch').addClass('keywordsSearchActive');
	                        }else{
	                            $('.keywordsSearch').removeClass('keywordsSearchActive');
	                            dataListAll.show();
	                            keywordDataList.hide().find('ul').html('');
	                        }

////								if(opt.multi){
//									var thisSelectedId = _self.find('.fixedId').val().split(opt.joinChar);
//									_self.find('.dataList li').each(function(k, v){
//										if(thisSelectedId.indexOf($(this).attr('thisid')) > -1){
//											$(this).addClass('active');
//										}
//									});
////								}
	                }
	            });

	            _self.find('.keywordsSearch').click(function(){
	                if($(this).hasClass('keywordsSearchActive')){
	                    keywordDataListUI.html('<div style="padding:5px;">'+Lang.searching+'</div>');

	                    var _keyword = _self.find('.keywords').val();
	                    keyword = _keyword;
	                    var ajaxData = $.extend({}, opt.ajaxData, {'keyword': keyword.toLowerCase()});

	                    $.ajax({
	                        url: opt.searchAjaxURL,
	                        data: ajaxData,
	                        dataType: 'json',
	                        success: function(data){
	                        	data = data.data;
	                            $('.keywordsSearch').removeClass('keywordsSearchActive');
	                            keywordDataListUI.html('');

	                            if(data.length == 0){
	                                keywordDataListUI.append('<li class="noResult">'+Lang.no+'<b>"'+_keyword+'"</b>'+Lang.result+'</li>');
	                            }else{
	                                $.each(data, function(k, v){
	                                    if(!RegExp('[?]').test(v[opt.nameAlias])){
	                                        keywordDataListUI.append
	                                            ('<li thisid="'+v[opt.idAlias]+'" thisval="'+v[opt.nameAlias]+'" thisalias="'+v.alias+'">'+v[opt.nameAlias]+(v.alias?'('+v.alias+')':'')+'</li>');
	                                    }
	                                });

	                                keywordDataListUI.find('li').filter(':odd').addClass('odd');
	                                _self.find('.dataList li').hover(function(){
	                                    $(this).addClass('hover');
	                                }, function(){
	                                    $(this).removeClass('hover');
	                                });
	                            }

	                            var thisHeight = keywordDataListUI.height();
	                            keywordDataList.height(thisHeight > opt.dataListHeight ? opt.dataListHeight : thisHeight);
	                        }
	                    })
	                }
	            });
	        },

	        _bind: function(){
	            var dataListAll = _self.find('.dataListAll');
	            var dataListAllUl = dataListAll.find('ul');

	            _self.find('.dataSelected').hover(function(){
	                $(this).addClass('hover');
	                if(opt.maskText == false){
		                var _top = _self.find('.dataSelectedCon').outerHeight();
		                _top = _top < opt.standardHeight ? opt.standardHeight : _top;
		                _self.find('.dataSelected').css('height', _top);
	                }
	            },function(){
	                if(_self.find('.chosenCon').is(':hidden')){
	                    $(this).removeClass('hover');
	                    if(opt.maskText == false){
	                    	_self.find('.dataSelected').css('height', opt.standardHeight);
	                    }
	                }
	            });

	            if(opt.clearSelected){
	                _self.find('.clearSelected').off('click').on('click', function(e){
	                    if(opt.multi){
	                        _self.find('.dataSelectedCon').html('');
	                        _self.find('.dataSelected').height(opt.standardHeight)
	                        _self.find('.chosenCon').css('top', opt.standardHeight - 1);
	                        if(opt.multiCol){
	                            _self.find('.fixedText').html('').removeAttr('title');
	                        }
	                    }else{
	                        _self.find('.fixedText').html('').removeAttr('title');
	                    }
	                    _self.find('.dataList li').removeClass('active');
	                    _self.find('.fixedTextInit').show();
	                    _self.find('.fixedId').val('');
	                    _self.find('.fixedVal').val('');
	                    _self.find('.fixedAlias').val('');
	                    $(this).hide();
	                    if(!_self.find('.chosenCon').is(':hidden')){
	                        if(typeof opt.valueWidth != 'number'){
	                            if(_self.find('.dataSelected').outerWidth() > _self.find('.chosenCon').outerWidth()){
	                                _self.find('.dataSelected').removeClass('activeFFF');
	                                _self.find('.chosenCon').addClass('chosenConFFF');
	                            }else{
	                                _self.find('.dataSelected').addClass('activeFFF');
	                                _self.find('.chosenCon').removeClass('chosenConFFF');
	                            }
	                        }
	                    }
	                    e.stopPropagation();
	                });
	            };

	            _self.find('.dataSelected').off('click').on('click', function(){
	                if(_self.find('.chosenCon').is(':hidden')){
	                    if($(this).outerWidth() > _self.find('.chosenCon').outerWidth()){
	                        $(this).removeClass('activeFFF');
	                        _self.find('.chosenCon').addClass('chosenConFFF');
	                    }else{
	                        $(this).addClass('activeFFF');
	                        _self.find('.chosenCon').removeClass('chosenConFFF');
	                    }
	                    
	                    if(_self.find('.chosenCon').outerWidth() + _self.offset().left > $(window).width()){
	                    	_self.find('.chosenCon').addClass('rightFixed');
	                    }else{
	                    	_self.find('.chosenCon').removeClass('rightFixed');
	                    }

	                    $(this).addClass('active');
	                    _self.find('.chosenCon').show();
	                    _self.find('.keywords').focus();

	                    _self.find('.dataList li.active').removeClass('active');
	                    if(!_self.find('.dataListAll').is(':hidden')){
	                        _i = 0;
	                        var _thisHeight = dataListAllUl.outerHeight();
	                        dataListAll.height(_thisHeight > opt.dataListHeight ? opt.dataListHeight : _thisHeight);
	                    }else{

	                    }

	                    var thisId = _self.find('.fixedId').val().split(opt.joinChar);
	                    _self.find('.dataList li').each(function(){
	                        if(thisId.indexOf($(this).attr('thisid')) != -1){
	                            $(this).addClass('active');
	                        }
	                    })
	                    
	                    if(opt.maskText == false){
		                    var _top = _self.find('.dataSelectedCon').outerHeight();
		                    _top = _top < opt.standardHeight ? opt.standardHeight : _top;
		                    _self.find('.dataSelected').css('height', _top);
		                    _self.find('.chosenCon').css('top', _top - 1);
	                    }

	                    _self.find('.chosenArrow').addClass('chosenArrowUp');
	                }else{
	                    _self.find('.dataSelected').removeClass('active');
	                    _self.find('.chosenCon').hide();
	                    _self.find('.dataSelected').removeClass('activeFFF');
	                    _self.find('.chosenCon').addClass('chosenConFFF');
	                    _self.find('.dataSelected').height(opt.standardHeight);
	                    _self.find('.chosenArrow').removeClass('chosenArrowUp');
	                }
	            });

	            _self.find('.dataList li').hover(function(){
	                $(this).addClass('hover');
	            }, function(){
	                $(this).removeClass('hover');
	            });

	            $(document).off('mousedown.Chosen');
	            $(document).on('mousedown.Chosen', function(e){
	                var _thisChosen = $(e.target).closest('.chosen');
	                if(_thisChosen.length == 0){
	                	var _height = _thisChosen.attr('data-height');
	                	
	                    $('.dataSelected').removeClass('active activeFFF hover').height(_height - 2);
	                    $('.chosenCon').hide().addClass('chosenConFFF');
	                    $('.chosenArrow').removeClass('chosenArrowUp');
	                }else{
	                    $('.chosen').each(function(){
	                        if($(this).attr('id') == _thisChosen.attr('id')){
	                            return;
	                        }
	                        var _height = $(this).attr('data-height');
	                        $(this).find('.dataSelected').removeClass('active activeFFF hover').height(_height - 2);
	                        $(this).find('.chosenCon').hide().addClass('chosenConFFF');
	                        $(this).find('.chosenArrow').removeClass('chosenArrowUp');
	                    })
	                }
	            });

	            _self.find('.dataList').off('click', 'li').on('click', 'li', function(){
	            	if($(this).hasClass('noResult')){
	            		return;
	            	}
	                var thisId = $(this).attr('thisid');
	                var thisVal = $(this).attr('thisval');
	                var thisAlias = $(this).attr('thisalias');

	                if(opt.multi){
	                    if($(this).hasClass('active')){
	                        var _thisVal = _self.find('.fixedVal').val().split(opt.joinChar);
	                        var _thisId = _self.find('.fixedId').val().split(opt.joinChar);
	                        var _thisAlias = _self.find('.fixedAlias').val().split(opt.joinChar);

	                        _thisVal.remove(thisVal);
	                        _thisId.remove(thisId);
	                        _thisAlias.remove(thisAlias);

	                        _self.find('.fixedVal').val(_thisVal.join(opt.joinChar));
	                        _self.find('.fixedId').val(_thisId.join(opt.joinChar));
	                        _self.find('.fixedAlias').val(_thisAlias.join(opt.joinChar));

	                        if(opt.multiCol){
	                            _self.find('.fixedText').html(_thisVal.join(opt.joinChar));
	                        }else{
	                            _self.find('.dataSelectedCon .item').each(function(){
	                                var thisid = $(this).attr('thisid');
	                                if(thisid == thisId){
	                                    $(this).remove();
	                                    if(_self.find('.dataSelectedCon .item').length == 0){
	                                        _self.find('.fixedTextInit').show();
	                                        opt.clearSelected && _self.find('.clearSelected').hide();
	                                    }
	                                    return false;
	                                }
	                            });
	                        }
	                        $(this).removeClass('active');

	                        opt.removeCallback(thisId, thisVal,_self,thisAlias);
	                    }else{
	                        if(_self.find('.fixedId').val().split(opt.joinChar).length == opt.maxSize){
	                            if(opt.maxSizeTip == ''){
	                                alert('只能选择 '+opt.maxSize+' 项！');
	                            }else{
	                                alert(opt.maxSizeTip);
	                            }
	                            return;
	                        }
	                        if(_self.find('.fixedVal').val() != ''){
	                            _self.find('.fixedVal').val(_self.find('.fixedVal').val() + opt.joinChar + thisVal);
	                            _self.find('.fixedId').val(_self.find('.fixedId').val() + opt.joinChar + thisId);
	                            _self.find('.fixedAlias').val(_self.find('.fixedAlias').val() + opt.joinChar + thisAlias);
	                        }else{
	                            _self.find('.fixedVal').val(thisVal);
	                            _self.find('.fixedId').val(thisId);
	                            _self.find('.fixedAlias').val(thisAlias);
	                        }

	                        if(opt.multiCol){
	                            _self.find('.fixedText').html(_self.find('.fixedVal').val()).attr('title', _self.find('.fixedVal').val());
	                        }else{
	                            _self.find('.dataSelectedCon').append(
	                                '<span class="item" thisid="'+thisId+'" thisval="'+thisVal+'" thisalias="'+thisAlias+'">' +
	                                    '<a href="javascript:;" class="itemText">'+thisVal+'</a><a href="javascript:;" class="delItem"></a></span>');
	                        }
	                        _self.find('.fixedTextInit').hide();
	                        opt.clearSelected && _self.find('.clearSelected').show();
	                        $(this).addClass('active');

	                        opt.selectedCallback(thisId, thisVal, _self, thisAlias);
	                    }
	                    if(opt.maskText == false){
		                    var _top = _self.find('.dataSelectedCon').outerHeight();
		                    _top = _top < opt.standardHeight ? opt.standardHeight : _top;
		                    _self.find('.dataSelected').css('height', _top);
		                    _self.find('.chosenCon').css('top', _top - 1);
	                    }

	                    if(typeof opt.valueWidth != 'number'){
	                        if(_self.find('.dataSelected').outerWidth() > _self.find('.chosenCon').outerWidth()){
	                            _self.find('.dataSelected').removeClass('activeFFF');
	                            _self.find('.chosenCon').addClass('chosenConFFF');
	                        }else{
	                            _self.find('.dataSelected').addClass('activeFFF');
	                            _self.find('.chosenCon').removeClass('chosenConFFF');
	                        }
	                    }
	                }else{
	                    _self.find('.fixedVal').val(thisVal);
	                    _self.find('.fixedId').val(thisId);
	                    _self.find('.fixedAlias').val(thisAlias);


	                    _self.find('.fixedText').html(thisVal).attr('title', thisVal);

	                    _self.find('.dataSelected').removeClass("active hover activeFFF");

	                    opt.clearSelected && _self.find('.clearSelected').show();
	                    _self.find('.chosenArrow').removeClass('chosenArrowUp');
	                    _self.find('.fixedTextInit').hide();
	                    _self.find('.chosenCon').hide();

	                    opt.selectedCallback(thisId, thisVal, _self, thisAlias);
	                }
	            });


	            _self.on('click', '.delItem', function(e){
	                var thisId = $(this).parent().attr('thisid');
	                var thisVal = $(this).parent().attr('thisval');
	                var thisAlias = $(this).parent().attr('thisalias');
	                $(this).parent().remove();

	                var _thisVal = _self.find('.fixedVal').val().split(opt.joinChar);
	                var _thisId = _self.find('.fixedId').val().split(opt.joinChar);
	                var _thisAlias = _self.find('.fixedAlias').val().split(opt.joinChar);

	                _thisVal.remove(thisVal);
	                _thisId.remove(thisId);
	                _thisAlias.remove(thisAlias);

	                _self.find('.fixedVal').val(_thisVal.join(opt.joinChar));
	                _self.find('.fixedId').val(_thisId.join(opt.joinChar));
	                _self.find('.fixedAlias').val(_thisAlias.join(opt.joinChar));

	                _self.find('.dataList li').each(function(){
	                    if($(this).attr('thisid') == thisId){
	                        $(this).removeClass('active');
	                    }
	                });
	                
	                if(opt.maskText == false){
		                var _top = _self.find('.dataSelectedCon').outerHeight();
		                _top = _top < opt.standardHeight ? opt.standardHeight : _top;
		                _self.find('.chosenCon').css('top', _top - 1);
	                }

	                if(!_self.find('.chosenCon').is(':hidden')){
	                    if(typeof opt.valueWidth != 'number'){
	                        if(_self.find('.dataSelected').outerWidth() > _self.find('.chosenCon').outerWidth()){
	                            _self.find('.dataSelected').removeClass('activeFFF');
	                            _self.find('.chosenCon').addClass('chosenConFFF');
	                        }else{
	                            _self.find('.dataSelected').addClass('activeFFF');
	                            _self.find('.chosenCon').removeClass('chosenConFFF');
	                        }
	                    }
	                }
	                if(!_self.find('.fixedId').val().split(opt.joinChar).length){
	                    opt.clearSelected && _self.find('.clearSelected').hide();
	                    _self.find('.fixedTextInit').show();
	                }

	                opt.removeCallback(thisId, thisVal, _self, thisAlias);
	                e.stopPropagation();
	            });

	            _self.find('.keywords').off('keydown').on('keydown', function(e){
	                switch(e.keyCode){
	                    case 38: // up
	                        Chosen._selectedMove('up');
	                        break;
	                    case 40: // down
	                        Chosen._selectedMove('down');
	                        break;
	                    case 13: // enter
	                        _self.find('.dataSelected').removeClass('active');
	                        _self.find('.chosenCon').hide();

	                        var _selectedLi = _self.find('.dataList li.hover');

	                        var thisId = _selectedLi.attr('thisid');
	                        var thisVal = _selectedLi.attr('thisval');
	                        var thisAlias = _selectedLi.attr('thisalias');
	                        if(thisId){
	                            if(opt.multi){
	                                if(_self.find('.fixedVal').val() != ''){
	                                    _self.find('.fixedVal').val(_self.find('.fixedVal').val() + opt.joinChar + thisVal);
	                                    _self.find('.fixedId').val(_self.find('.fixedId').val() + opt.joinChar + thisId);
	                                    _self.find('.fixedAlias').val(_self.find('.fixedAlias').val() + opt.joinChar + thisAlias);
	                                }else{
	                                    _self.find('.fixedVal').val(thisVal);
	                                    _self.find('.fixedId').val(thisId);
	                                    _self.find('.fixedAlias').val(thisAlias);
	                                }

	                                if(opt.multiCol){
	                                    _self.find('.fixedText').html(_self.find('.fixedVal').val()).attr('title', _self.find('.fixedVal').val());
	                                }else{
	                                    _self.find('.dataSelectedCon').append(
	                                        '<span class="item" thisid="'+thisId+'" thisval="'+thisVal+'" thisalias="'+thisAlias+'">' +
	                                            '<a href="javascript:;" class="itemText">'+thisVal+'</a><a href="javascript:;" class="delItem"></a></span>');
	                                }

	                                _self.find('.fixedTextInit').hide();
	                                
	                                if(opt.maskText == false){
		                                var _top = _self.find('.dataSelectedCon').outerHeight();
		                                _top = _top < opt.standardHeight ? opt.standardHeight : _top;
		                                _self.find('.dataSelected').css('height', _top);
		                                _self.find('.chosenCon').css('top', _top - 1);
	                                }

	                            }else{
	                                _self.find('.fixedVal').val(thisVal);
	                                _self.find('.fixedId').val(thisId);
	                                _self.find('.fixedAlias').val(thisAlias);

	                                _self.find('.fixedText').html(thisVal).attr('title', thisVal);
	                                _self.find('.dataSelected').removeClass("active activeFFF");

	                                _self.find('.fixedTextInit').hide();
	                                _self.find('.chosenCon').hide();
	                            }
	                            opt.selectedCallback(thisId, thisVal, _self, thisAlias);
	                        }
	                        break;
	                }
	            });
	        }
	    };

	    var _self = $(this);
	    var _i = 0;
	    _self.html('').addClass('chosen');

	    Chosen._init();
	    opt.initCallback(_self);
	}

	
	
	
//	/* tab */
//	
//	;(function($) {
//		$.fn.extend({
//			chrometab: function(options) {
//				this.defaultOptions = {
//					changeTabCallback: function() {},
//					newTabCallback: function() {}
//				};
//				var settings = $.extend({}, this.defaultOptions, options);
//
//				return this.each(function() {
//					var $cTabContainer = $(this),
//						$cTabs = $cTabContainer.find('.cTab'),
//						mouseDown = false,
//						draggedTab = null;
//
//					$cTabContainer.append($cTabs.detach())
//
//					$cTabs.on('mousedown', function(e) {
//						if (e.target.classList[0] == 'closeTab') {
//							return;
//						}
//						var $this = $(this),
//							$pane = $this.data('target');
//
//						$('.cTab').add('.cTab-pane').removeClass('active')
//						$this.add($pane).addClass('active');
//
//						settings.changeTabCallback();
//
//						RunState = 0;
//						mouseDown = true;
//						draggedTab = $this;
//						offset = e.offsetX
//					})
//
//					$cTabContainer.on('click', '.closeTab', function(e) {
//						e.preventDefault();
//
//						if ($cTabContainer.find('.cTab').length == 1) {
//							return;
//						}
//
//						var _tab = $(this).parent();
//
//						$(_tab.data('target')).remove();
//						$(_tab).remove();
//
//						if (_tab.hasClass('active')) {
//							$cTabContainer.find('.cTab').eq(0).addClass('active');
//							$($cTabContainer.find('.cTab').eq(0).data('target')).addClass('active');
//						}
//						$cTabs = $cTabContainer.find('.cTab');
//						settings.closeCallback();
//					})
//
//					$(document).on('mousemove', function(e) {
//						if (!mouseDown && !draggedTab) return;
//
//						var left = e.clientX - offset,
//							ati = $('.cTabs').find('.cTab.active').index();
//
//						draggedTab.offset({
//							left: left
//						})
//
//						t = $cTabs.sort(function(a, b) {
//							return $(a).offset().left > $(b).offset().left
//						})
//
//						$cTabs.detach();
//						$cTabContainer.append(t)
//
//						if (ati != $('.cTabs').find('.cTab.active').index()) {
//							$('.cTabs').find('.cTab.active').css('left', '')
//						}
//
//						$cTabs = $cTabContainer.find('.cTab')
//
//						e.preventDefault()
//					})
//
//					$(document).on('mouseup', function() {
//						if (mouseDown && draggedTab) {
//							$cTabs.css('left', '')
//						}
//						mouseDown = false;
//						draggedTab = null;
//					})
//
//
//					
//
//
//
//					
//
//					codeEditor($('#CodeSql_1'));
//				});
//			}
//		});
//	})(jQuery);


;!function (window, $, undefined) {
	var chromeTab = (function () {
		function chromeTab(bindDom, options) {
			this.$this = bindDom;
			this.dom = options.dom;
			this.setOptions(options);
			this.bindEvent();
			this.render();
		}
		
		chromeTab.prototype.defaultOpts = {
			changeTabCallback: function() {},
			newTabCallback: function() {}
		};

		chromeTab.prototype.setOptions = function (options) {
			this.opts = $.extend({}, this.defaultOpts, options);
		};

		chromeTab.prototype.bindEvent = function () {
			var _self = this;
			
			var $cTabContainer = _self.dom,
				$cTabs = $cTabContainer.find('.cTab'),
				mouseDown = false,
				draggedTab = null;
	
			$cTabContainer.append($cTabs.detach())
	
			$cTabs.on('mousedown', function(e) {
				if (e.target.classList[0] == 'closeTab') {
					return;
				}
				var $this = $(this),
					$pane = $this.data('target');
	
				$('.cTab').add('.cTab-pane').removeClass('active')
				$this.add($pane).addClass('active');
				
				_self.activeEditor = 'CodeSql_' + $this.data('target').split('e')[1];
				_self.opts.changeTabCallback();
	
				RunState = 0;
				mouseDown = true;
				draggedTab = $this;
				offset = e.offsetX
			})
	
			$cTabContainer.on('click', '.closeTab', function(e) {
				e.preventDefault();
	
				if ($cTabContainer.find('.cTab').length == 1) {
					return;
				}
	
				var _tab = $(this).parent();
	
				$(_tab.data('target')).remove();
				$(_tab).remove();
	
				if (_tab.hasClass('active')) {
					$cTabContainer.find('.cTab').eq(0).addClass('active');
					$($cTabContainer.find('.cTab').eq(0).data('target')).addClass('active');
					
					_self.activeEditor = 'CodeSql_' + $cTabContainer.find('.cTab').eq(0).data('target').split('e')[1];
					_self.opts.closeCallback();
				}
				$cTabs = $cTabContainer.find('.cTab');
				
				
			})
	
			$(document).on('mousemove', function(e) {
				if (!mouseDown && !draggedTab) return;
	
				var left = e.clientX - offset,
					ati = $('.cTabs').find('.cTab.active').index();
	
				draggedTab.offset({
					left: left
				})
	
				t = $cTabs.sort(function(a, b) {
					return $(a).offset().left > $(b).offset().left
				})
	
				$cTabs.detach();
				$cTabContainer.append(t)
	
				if (ati != $('.cTabs').find('.cTab.active').index()) {
					$('.cTabs').find('.cTab.active').css('left', '')
				}
	
				$cTabs = $cTabContainer.find('.cTab')
	
				e.preventDefault()
			})
	
			$(document).on('mouseup', function() {
				if (mouseDown && draggedTab) {
					$cTabs.css('left', '')
				}
				mouseDown = false;
				draggedTab = null;
			})
			
			$('#AddTab').click(function() {
				if ($('#EditTable li').length == 5) {
					swal($.i18n.prop('tabMaxTip'), '', 'error');
				} else {
					var _len = parseInt($('#AddTab').attr('data-index')) + 1;

					$('#AddTab').attr('data-index', _len);

					$('#EditTable').append('<li class="cTab" data-target="#Page' + _len + '"><span>' + $.i18n.prop('newQuery') + _len + '</span>' +
						'<button type="button" class="closeTab">×</button>' +
						'</li>');

					$('.cTab-content').append('<div class="cTab-pane" id="Page' + _len + '">' +
						'<textarea class="codeSql" id="CodeSql_' + _len + '" name="code" placeholder="'+$.i18n.prop('editorPlaceholder')+'"></textarea>' +
						'<div class="runBtn">' +
						'<button type="button" class="btn btn-primary btnRun" data-code="CodeSql_' + _len + '" data-index="' + _len + '">执行</button>' +
						'<button type="button" class="btn btn-primary btnSave" data-code="CodeSql_' + _len + '" data-index="' + _len + '">保存</button>' +
						'<button type="button" class="btn btn-primary btnStop" data-code="CodeSql_' + _len + '" data-index="' + _len + '">停止</button>' +
						'</div>' +
						'</div>');
					
					
					$cTabContainer.find('.cTab:last').addClass('active').siblings().removeClass('active');
					$($cTabContainer.find('.cTab:last').data('target')).addClass('active').siblings().removeClass('active');

					$cTabs = $cTabContainer.find('.cTab');
					
					_self.opts.editorInit($('#Page' + _len).find('.codeSql'));
					_self.activeEditor = 'CodeSql_' + _len;
					
					_self.opts.newTabCallback();

					$cTabContainer.find('.cTab').off('mousedown').on('mousedown', function(e) {
						if (e.target.classList[0] == 'closeTab') {
							return;
						}
						var $this = $(this),
							$pane = $this.data('target');

						$('.cTab').add('.cTab-pane').removeClass('active')
						$this.add($pane).addClass('active');
						
						_self.activeEditor = 'CodeSql_' + $this.data('target').split('e')[1];
						_self.opts.changeTabCallback();
						mouseDown = true;
						draggedTab = $this;
						offset = e.offsetX
					})
				}
			})

			return this;
		};
		
		chromeTab.prototype.render = function () {
			var _self = this;
			_self.opts.editorInit($('#CodeSql_1'));
			_self.activeEditor = 'CodeSql_1'; 
		}
		
		return chromeTab;
	})();

	// window.chromeTab = $.chromeTab = chromeTab;
	$.fn.chromeTab = function (opts) {
		var _r = [];
		this.each(function () {
			var $this = $(this),
				data = $this.data();
			if (data.chromeTab) {
				delete data.chromeTab;
			}
			if (opts !== false) {
				opts.dom = $this;
				data.chromeTab = new chromeTab($this, opts);
			}
			_r.push(data.chromeTab);
		});
		return _r;
	};
}(window, jQuery);



Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


// 数组的方法
Array.prototype.distinct = function () {
	for (var b = 0, f = this.length, a, c, d = {}, e = []; b < f; b++) a = this[b], c = typeof a, "undefined" == typeof d[a + c] && (d[a + c] = 1, e.push(a));
	return e
};
//数组删除项
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
    return this;
};



window.Util = {
	getQueryString: function(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return decodeURIComponent(unescape(r[2])); return null;
	},
	ajax: function(opt){
		$.ajax({
			url: opt.url,
    		type: opt.type || 'post',
    		data: opt.data,
    		success: function(data){
    			if(data.code == -2){
    				window.location.href = 'logout';
    			}else{
    				opt.success(data);
    			}
    		}
		})
	}
};

//导出Excel
$.exportExcel = function (a) {
    a = $.extend({}, {
    	'queryKey': 'xx',
    	'forBigData': 0
    }, a);
    0 == $("#ExcelForm").length && $(document.body).append('<form target="ExcelIframe" id="ExcelForm">'
    		+'<input type="hidden" id="Excel_queryKey" name="queryKey" />'
    		+'<input type="hidden" id="Excel_forBigData" name="forBigData" />'
    		+'</form><iframe name="ExcelIframe" style="display:none; visibility: hidden;"></iframe>');
    
    $("#Excel_queryKey").val(a.queryKey);
    $("#Excel_forBigData").val(a.forBigData);
    
    b = document.getElementById("ExcelForm");
    b.method = "post";
    b.action = a.url;
    b.submit()
};


$(function(){
	jQuery.i18n.properties({
	    name: 'strings', 
	    path: 'i18n/', 
	    mode : 'map',
	    language: Language, 
	    callback: function() {
	        // updateExamples();
	    }
	});
	
	$('#LanguageChange a').click(function(){
		var _lang = $(this).data('type');
		Util.ajax({
			url: 'entry/Language',
			data: {
				lang: _lang
			},
			success: function(data){
				window.location.reload();
			}
		});	
	})
})