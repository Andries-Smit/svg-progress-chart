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
	var interfaces_1 = __webpack_require__(2);
	var models_1 = __webpack_require__(3);
	// import {Utils} from './utils';
	// @TODO import function from Utils
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
	            time: 0
	        };
	        this.id = id;
	        this.rootElement = document.getElementById(id);
	        if (!id || !this.rootElement) {
	            throw "Root SVG Element is missing";
	        }
	        if (options) {
	            this.options.height = options.height;
	            this.options.width = options.width;
	            this.options.data = options.data;
	            this.options.time = options.time;
	        }
	        this.rootElement.setAttribute("height", this.options.height.toString());
	        this.rootElement.setAttribute("width", this.options.width.toString());
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
	    SVGProgressChart.prototype.setProgress = function (time) {
	        time = Math.min(time, this.options.time);
	        var that = this;
	        var value;
	        if (!time) {
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
	    SVGProgressChart.prototype.init = function () {
	        var instance = this;
	        // Create progress bar
	        // 1. Create the bar element
	        var bar = new models_1.Rect(10, 100, 0, 50);
	        bar.addClass('bar');
	        this.rootElement.appendChild(bar._el);
	        this.components.progressBar.bar = bar;
	        // 2. Create the progress element
	        var progress = new models_1.Rect(10, 1, 0, 50);
	        progress.addClass('progress');
	        progress.moveTo(0);
	        // 3. Create the dragging overlay progress
	        var bufferProgress = new models_1.Rect(10, 1, 0, 50);
	        this.rootElement.appendChild(bufferProgress._el);
	        this.components.progressBar.buffer = bufferProgress;
	        bufferProgress.addClass('buffer');
	        bufferProgress.moveTo(0);
	        this.rootElement.appendChild(progress._el);
	        this.components.progressBar.progress = progress;
	        console.log(this);
	        // 4. Create timeline rects from data if exists
	        if (this.options.data) {
	            this.options.data.forEach(function (event, i) {
	                event.x = i ? instance.options.data[i - 1].x + instance.options.data[i - 1].width : 0;
	                var newEvent = new models_1.Rect(20, event.width, event.x, 45, interfaces_1.Colors[event.type]);
	                newEvent.type = event.type;
	                newEvent.addClass(event.type);
	                instance.components.events.push(newEvent);
	                instance.rootElement.appendChild(newEvent._el);
	            });
	        }
	        // 5. Create overlay on top of everything for catching events        
	        var overlay = new models_1.Rect(40, 100, 0, 30, "rgba(255,255,255,0)");
	        overlay.addClass("overlay");
	        this.components.progressBar.overlay = overlay;
	        this.rootElement.appendChild(overlay._el);
	        // 6. Create the tooltip
	        var tooltip = new models_1.Tooltip(30, 90, 0, 0, "00:00:00");
	        this.components.progressBar.tooltip = tooltip;
	        this.rootElement.appendChild(tooltip._el);
	        // Add event listeners
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
	        overlay._el.addEventListener('mousemove', function (e) {
	            var percent = (e.offsetX / instance.options.width * 100);
	            var pixels = e.offsetX / instance.options.width * instance.options.width - tooltip.width / 2;
	            var time = e.offsetX / instance.options.width * instance.options.time;
	            pixels = Math.max(Math.min(pixels, instance.options.width - tooltip.width), 0);
	            clearTimeout(timer);
	            timer = setTimeout(function () {
	                instance.components.events.forEach(function (event) {
	                    tooltip.removeClass('positive');
	                    tooltip.removeClass('negative');
	                    if (e.offsetX >= event.x * instance.options.width / 100 && e.offsetX < (event.x + event.width) / 100 * instance.options.width) {
	                        if (event.color !== interfaces_1.Colors.neutral) {
	                            requestAnimFrame(function () {
	                                tooltip.addClass(event.type);
	                            });
	                        }
	                    }
	                });
	            }, 10);
	            requestAnimFrame(function () {
	                instance.setPreBuffer(time);
	            });
	        });
	    };
	    return SVGProgressChart;
	}());
	exports.SVGProgressChart = SVGProgressChart;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	exports.Colors = {
	    positive: "#1abc9c",
	    negative: "#e74c3c",
	    neutral: "rgba(0,0,0,0)",
	    "default": "#DDDDDD"
	};
	exports.TrimSpacesRegEx = /(  +)|(?:\r\n|\r|\n|\r\s)/g;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var interfaces_1 = __webpack_require__(2);
	exports.SVGSchemaURI = "http://www.w3.org/2000/svg";
	var Shape = (function () {
	    function Shape(h, w, x, y, color) {
	        this.height = h;
	        this.width = w;
	        this.x = x;
	        this.y = y;
	        this.color = color || undefined;
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
	        element.setAttribute("width", this.width.toString() + "%");
	        element.setAttribute("height", this.height.toString());
	        element.setAttribute("x", this.x.toString() + "%");
	        element.setAttribute("y", this.y.toString());
	        element.setAttribute("class", "transition");
	        var style = "fill:" + this.color + ";";
	        if (this.color) {
	            element.setAttribute("style", style);
	        }
	        this.classList.forEach(function (cls) {
	            if (!element.classList.contains(cls)) {
	                element.classList.add(cls);
	            }
	        });
	    };
	    Rect.prototype.moveTo = function (percent) {
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
	        text.setAttribute("x", "" + (this.x + this.width / 2 - 30));
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
	        var sec_num = time; // don't forget the second param
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
	        this.addClass('show');
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
	    /**
	     *
	     * jQuery Implementation of hasClass
	     * @param {string} selector
	     * @returns {boolean}
	     *
	     * @memberOf Tooltip
	     */
	    Tooltip.prototype.hasClass = function (selector) {
	        var className = " " + selector + " ", i = 0, l = this._el.length;
	        for (; i < l; i++) {
	            if (this._el[i].nodeType === 1 && (" " + this._el[i].className + " ").replace(/[\t\r\n]/g, " ").indexOf(className) >= 0) {
	                return true;
	            }
	        }
	        return false;
	    };
	    Tooltip.prototype.update = function () {
	    };
	    return Tooltip;
	}(Shape));
	exports.Tooltip = Tooltip;
	// <g fill="red">
	//   <path fill="green" d="M0 0 L100 0 L100 50 L60 50 L50 60 L40 50 L0 50" />
	// <text x="20" y="30" fill="#000000">00:11:44</text>
	// </g> 


/***/ }
/******/ ]);