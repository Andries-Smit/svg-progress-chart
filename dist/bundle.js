/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var svgProgress_1 = __webpack_require__(1);
	var app;
	(function (app) {
	    var chart = new svgProgress_1.SVGProgressChart("SVGChart", {
	        width: 800,
	        height: 100,
	        time: 450,
	        data: [{
	                type: "positive",
	                width: 10
	            },
	            {
	                type: "neutral",
	                width: 10
	            },
	            {
	                type: "negative",
	                width: 20
	            }, {
	                type: "positive",
	                width: 5
	            }]
	    });
	})(app || (app = {}));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var interfaces_1 = __webpack_require__(2);
	var models_1 = __webpack_require__(3);
	var requestAnimFrame = (function () {
	    return window.requestAnimationFrame ||
	        window['webkitRequestAnimationFrame'] ||
	        window['mozRequestAnimationFrame'] ||
	        function (callback) {
	            window.setTimeout(callback, 1000 / 60);
	        };
	})();
	var SVGProgressChart = (function () {
	    function SVGProgressChart(id, options) {
	        this.options = {
	            height: 500,
	            width: 500,
	            data: [],
	            time: 0,
	            tooltipHeight: 30,
	            barHeight: 5,
	            top: 50
	        };
	        this.id = id;
	        this.rootElement = document.getElementById(id);
	        if (!id || !this.rootElement) {
	            throw "Root SVG Element is missing";
	        }
	        if (options) {
	            this.options.height = options.height;
	            this.options.width = options.width || this.rootElement.parentElement.clientWidth;
	            this.options.data = options.data;
	            this.options.time = options.time;
	            this.options.barHeight = options.barHeight || this.options.barHeight;
	            this.options.tooltipHeight = options.tooltipHeight || 30;
	            this.options.top = 20 + this.options.tooltipHeight;
	        }
	        this.rootElement.setAttribute("height", this.options.height.toString());
	        this.rootElement.setAttribute("width", '100%');
	        this.components = {
	            progressBar: {
	                bar: null,
	                buffer: null,
	                overlay: null,
	                progress: null,
	                tooltip: null
	            },
	            events: []
	        };
	        this.init();
	    }
	    SVGProgressChart.prototype.addClass = function (cls) {
	        if ('classList' in this.rootElement) {
	            this.rootElement.classList.add(cls);
	        }
	        else {
	            this.rootElement.className = this.rootElement.className + ' ' + cls;
	        }
	    };
	    SVGProgressChart.prototype.setBuffer = function (time) {
	        time = Math.min(time, this.options.time);
	        var that = this;
	        var value;
	        if (!time) {
	            return;
	        }
	        value = Math.min(time / that.options.time * 100, that.options.time);
	        requestAnimFrame(function () {
	            that.components.progressBar.buffer.moveTo(value);
	        });
	    };
	    SVGProgressChart.prototype.onSetProgress = function (callback) {
	        var instance = this;
	        if (!callback) {
	            return;
	        }
	        this.components.progressBar.overlay._el.addEventListener('click', function (e) {
	            var percent = (e.offsetX / instance.options.width);
	            var time = Math.round(percent * instance.options.time);
	            callback(time);
	        });
	    };
	    SVGProgressChart.prototype.setProgress = function (time) {
	        time = Math.min(time, this.options.time);
	        var that = this;
	        var value;
	        if (typeof time === 'undefined') {
	            return;
	        }
	        value = Math.min(time / that.options.time * 100, that.options.time);
	        requestAnimFrame(function () {
	            that.components.progressBar.progress.moveTo(value);
	        });
	    };
	    SVGProgressChart.prototype.setPreBuffer = function (time) {
	        time = Math.min(time, this.options.time);
	        var per = time / this.options.time;
	        var pixels = per * this.options.width - this.components.progressBar.tooltip.width / 2;
	        pixels = Math.max(Math.min(pixels, this.options.width - this.components.progressBar.tooltip.width), 0);
	        this.components.progressBar.tooltip.show();
	        this.components.progressBar.buffer.show();
	        this.setBuffer(time);
	        this.components.progressBar.tooltip.moveTo(pixels, time);
	    };
	    SVGProgressChart.prototype.setData = function (data) {
	        var _this = this;
	        if (data.length < this.components.events.length) {
	            this.components.events.forEach(function (e, i) {
	                if (i >= data.length) {
	                    e.remove();
	                }
	            });
	        }
	        data.forEach(function (event, i) {
	            if (!event.x) {
	                event.x = i ? _this.options.data[i - 1].x + _this.options.data[i - 1].width : 0;
	            }
	            if (_this.components.events && _this.components.events[i] && _this.components.events[i]._el) {
	                _this.components.events[i].x = event.x;
	                _this.components.events[i].width = event.width;
	                _this.components.events[i].type = event.type || 'default';
	                _this.components.events[i].color = interfaces_1.Colors[event.type || 'default'];
	                _this.components.events[i].update();
	            }
	            else {
	                var newEvent = new models_1.Rect(_this.options.barHeight * 2, event.width, event.x, 20 + _this.options.tooltipHeight - 0.5 * _this.options.barHeight);
	                newEvent.type = event.type;
	                newEvent.addClass(event.type || 'default');
	                _this.components.events.push(newEvent);
	                if (_this.components.progressBar.overlay) {
	                    _this.components.progressBar.overlay._el.parentNode.insertBefore(newEvent._el, _this.components.progressBar.overlay._el);
	                }
	                else {
	                    _this.rootElement.appendChild(newEvent._el);
	                }
	            }
	        });
	    };
	    SVGProgressChart.prototype.init = function () {
	        var instance = this;
	        var bar = new models_1.Rect(this.options.barHeight, 100, 0, this.options.top);
	        bar.addClass('bar');
	        this.rootElement.appendChild(bar._el);
	        this.components.progressBar.bar = bar;
	        var progress = new models_1.Rect(this.options.barHeight, 1, 0, this.options.top);
	        progress.addClass('progress');
	        progress.moveTo(0);
	        var bufferProgress = new models_1.Rect(this.options.barHeight, 1, 0, this.options.top);
	        this.rootElement.appendChild(bufferProgress._el);
	        this.components.progressBar.buffer = bufferProgress;
	        bufferProgress.addClass('buffer');
	        bufferProgress.moveTo(0);
	        this.rootElement.appendChild(progress._el);
	        this.components.progressBar.progress = progress;
	        console.log(this);
	        if (this.options.data) {
	            this.setData(this.options.data);
	        }
	        var overlay = new models_1.Rect(this.options.barHeight * 3, 100, 0, 20 + this.options.tooltipHeight - this.options.barHeight, "rgba(255,255,255,0)");
	        overlay.addClass("overlay");
	        this.components.progressBar.overlay = overlay;
	        this.rootElement.appendChild(overlay._el);
	        var tooltip = new models_1.Tooltip(this.options.tooltipHeight, this.options.tooltipHeight * 2.2, 0, 0, "00:00:00");
	        this.components.progressBar.tooltip = tooltip;
	        this.rootElement.appendChild(tooltip._el);
	        overlay._el.addEventListener('click', function (e) {
	            var percent = (e.offsetX / instance.options.width * 100);
	            requestAnimFrame(function () {
	                progress.moveTo(percent);
	            });
	        });
	        overlay._el.addEventListener('mouseleave', function (e) {
	            requestAnimFrame(function () {
	                tooltip.hide();
	                bufferProgress.hide();
	            });
	        });
	        var timer;
	        var currentTooltipType;
	        var lastMatch = false;
	        overlay._el.addEventListener('mousemove', function (e) {
	            var pixels = e.offsetX / instance.options.width * instance.options.width - tooltip.width / 2;
	            var time = e.offsetX / instance.options.width * instance.options.time;
	            pixels = Math.max(Math.min(pixels, instance.options.width - tooltip.width), 0);
	            clearTimeout(timer);
	            timer = setTimeout(function () {
	                lastMatch = false;
	                instance.components.events.forEach(function (event) {
	                    if (!event._el) {
	                        return;
	                    }
	                    if (e.offsetX >= event.x * instance.options.width / 100 && e.offsetX < (event.x + event.width) / 100 * instance.options.width && event.type !== 'neutral') {
	                        lastMatch = true;
	                        if (event.type !== currentTooltipType) {
	                            requestAnimFrame(function () {
	                                tooltip.removeClass(currentTooltipType);
	                                currentTooltipType = event.type;
	                                tooltip.addClass(event.type);
	                            });
	                        }
	                    }
	                });
	                if (!lastMatch) {
	                    tooltip.removeClass(currentTooltipType);
	                    currentTooltipType = 'neutral';
	                }
	            }, 10);
	            requestAnimFrame(function () {
	                instance.setPreBuffer(time);
	            });
	        });
	        this.addClass('show');
	    };
	    return SVGProgressChart;
	}());
	exports.SVGProgressChart = SVGProgressChart;
	window['SVGProgressChart'] = SVGProgressChart || {};


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Colors = {
	    positive: "#1abc9c",
	    negative: "#e74c3c",
	    neutral: "rgba(0,0,0,0)",
	    default: "#2C3E50"
	};
	exports.TrimSpacesRegEx = /(  +)|(?:\r\n|\r|\n|\r\s)/g;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var interfaces_1 = __webpack_require__(2);
	exports.SVGSchemaURI = "http://www.w3.org/2000/svg";
	var Shape = (function () {
	    function Shape(h, w, x, y, color) {
	        this.height = h;
	        this.width = w;
	        this.x = x;
	        this.y = y;
	        if (color) {
	            this.color = color;
	        }
	        this.classList = [];
	    }
	    Shape.prototype.addClass = function (cls) {
	        if ('classList' in this._el) {
	            this._el.classList.add(cls);
	        }
	        else {
	            this._el.className.baseVal = this._el.className.baseVal + ' ' + cls;
	        }
	    };
	    Shape.prototype.removeClass = function (cls) {
	        if ('classList' in this._el) {
	            this._el.classList.remove(cls);
	        }
	        else {
	            this._el.className.baseVal = this._el.className.baseVal.replace(this.classReg(cls), ' ');
	        }
	    };
	    Shape.prototype.hasClass = function (selector) {
	        var className = " " + selector + " ", i = 0, l = this._el.length;
	        for (; i < l; i++) {
	            if (this._el[i].nodeType === 1 && (" " + this._el[i].className + " ").replace(/[\t\r\n]/g, " ").indexOf(className) >= 0) {
	                return true;
	            }
	        }
	        return false;
	    };
	    Shape.prototype.classReg = function (className) {
	        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	    };
	    return Shape;
	}());
	exports.Shape = Shape;
	var Rect = (function (_super) {
	    __extends(Rect, _super);
	    function Rect(h, w, x, y, color) {
	        var _this = _super.call(this, h, w, x, y, color) || this;
	        _this._el = _this.createElement();
	        _this.update();
	        return _this;
	    }
	    Rect.prototype.createElement = function () {
	        return document.createElementNS(exports.SVGSchemaURI, 'rect');
	    };
	    Rect.prototype.update = function () {
	        var element = this._el;
	        if (!element) {
	            return;
	        }
	        element.setAttribute("width", this.width.toString() + "%");
	        element.setAttribute("height", this.height.toString());
	        element.setAttribute("x", this.x.toString() + "%");
	        element.setAttribute("y", this.y.toString());
	        element.setAttribute("class", "transition");
	        if (this.color) {
	            element.setAttribute("style", "fill:" + this.color);
	        }
	        this.classList.forEach(function (cls) {
	            if (!element.classList.contains(cls)) {
	                element.classList.add(cls);
	            }
	        });
	    };
	    Rect.prototype.remove = function () {
	        if (!this._el) {
	            return;
	        }
	        if (this._el.remove) {
	            this._el.remove();
	        }
	        else {
	            this._el.parentNode.removeChild(this._el);
	        }
	        delete this._el;
	    };
	    Rect.prototype.moveTo = function (percent) {
	        percent = Math.min(percent, 100);
	        this._el.setAttribute("transform", "scale(" + percent + ",1)");
	        this._el.style.transform = "scale3d(" + percent + ",1,1)";
	        this._el.style.webkitTransform = "scale3d(" + percent + ",1,1)";
	        this._el.style['-ms-transform'] = "scale3d(" + percent + ",1,1)";
	        this.value = percent;
	    };
	    Rect.prototype.show = function () {
	        this.addClass('show');
	    };
	    Rect.prototype.hide = function () {
	        this.removeClass('hide');
	    };
	    return Rect;
	}(Shape));
	exports.Rect = Rect;
	var Tooltip = (function (_super) {
	    __extends(Tooltip, _super);
	    function Tooltip(h, w, x, y, text, color, css) {
	        var _this = _super.call(this, h, w, x, y, color) || this;
	        _this.text = text || "00:00:00";
	        _this.components = {
	            text: null
	        };
	        _this._el = _this.createElement();
	        return _this;
	    }
	    Tooltip.prototype.createElement = function () {
	        var path = document.createElementNS(exports.SVGSchemaURI, "path");
	        path.setAttribute("d", ("M" + this.x + " " + this.y + "\n                                L" + (this.width + this.x) + " " + this.y + "\n                                L" + (this.width + this.x) + " " + (this.height + this.y) + "\n                                L" + (this.x + this.width / 2 + 7) + " " + (this.height + this.y) + "\n                                L" + (this.x + this.width / 2) + " " + (this.height + this.y + 7) + "\n                                L" + (this.x + this.width / 2 - 7) + " " + (this.height + this.y) + "\n                                L" + this.x + " " + (this.height + this.y)).replace(interfaces_1.TrimSpacesRegEx, ' '));
	        var text = document.createElementNS(exports.SVGSchemaURI, "text");
	        text.textContent = this.text;
	        text.setAttribute("x", "" + (this.x + this.width / 2 - 23));
	        text.setAttribute("y", "" + (this.y + this.height / 2 + 5));
	        text.setAttribute("fill", "rgba(0,0,0,.6)");
	        this.components.text = text;
	        var tooltip = document.createElementNS(exports.SVGSchemaURI, "g");
	        if (this.color) {
	            tooltip.setAttribute("fill", "" + this.color);
	        }
	        tooltip.setAttribute("class", "transition tooltip");
	        tooltip.appendChild(path);
	        tooltip.appendChild(text);
	        return tooltip;
	    };
	    Tooltip.prototype.toTimeText = function (time) {
	        var sec_num = time;
	        var hours = Math.floor(sec_num / 3600);
	        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	        var seconds = sec_num - (hours * 3600) - (minutes * 60);
	        seconds = parseInt(seconds, 10);
	        if (hours < 10) {
	            hours = "0" + hours;
	        }
	        if (minutes < 10) {
	            minutes = "0" + minutes;
	        }
	        if (seconds < 10) {
	            seconds = "0" + seconds;
	        }
	        return hours + ':' + minutes + ':' + seconds;
	    };
	    Tooltip.prototype.show = function () {
	        if (!this.hasClass('show')) {
	            this.addClass('show');
	        }
	    };
	    Tooltip.prototype.hide = function () {
	        this.removeClass('show');
	    };
	    Tooltip.prototype.moveTo = function (percent, time) {
	        this._el.setAttribute("transform", "translate(" + percent + " 0)");
	        this._el.style.transform = "translate3d(" + percent + "px,0,0)";
	        this._el.style.webkitTransform = "translate3d(" + percent + "px,0,0)";
	        this.components.text.textContent = this.toTimeText(time);
	    };
	    Tooltip.prototype.setColor = function (color) {
	        this._el.setAttribute('fill', color);
	    };
	    Tooltip.prototype.update = function () {
	    };
	    return Tooltip;
	}(Shape));
	exports.Tooltip = Tooltip;


/***/ }
/******/ ]);