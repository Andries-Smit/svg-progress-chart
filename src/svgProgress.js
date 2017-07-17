"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var models_1 = require("./models");
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window['webkitRequestAnimationFrame'] ||
        window['mozRequestAnimationFrame'] ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
var SVGProgressChart = (function () {
    function SVGProgressChart(element, options) {
        this.lastMatch = false;
        this.options = {
            height: 500,
            width: 500,
            data: [],
            time: 0,
            tooltipHeight: 30,
            barHeight: 5,
            top: 50
        };
        if (!element) {
            throw "Root SVG Element is missing";
        }
        this.rootElement = element;
        this.id = this.rootElement.id;
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
    SVGProgressChart.prototype.clearEvents = function () {
        this.components.progressBar.overlay._el.removeEventListener('click', this.handleMouseClick.bind(this));
        this.components.progressBar.overlay._el.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.components.progressBar.overlay._el.removeEventListener('mousemove', this.handleMouseMove.bind(this));
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
    SVGProgressChart.prototype.handleMouseLeave = function (e) {
        var _this = this;
        requestAnimFrame(function () {
            _this.components.progressBar.tooltip.hide();
            _this.components.progressBar.buffer.hide();
        });
    };
    SVGProgressChart.prototype.handleMouseMove = function (e) {
        var _this = this;
        var pixels = e.offsetX / this.options.width * this.options.width - this.components.progressBar.tooltip.width / 2;
        var time = e.offsetX / this.options.width * this.options.time;
        pixels = Math.max(Math.min(pixels, this.options.width - this.components.progressBar.tooltip.width), 0);
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            _this.lastMatch = false;
            _this.components.events.forEach(function (event) {
                if (!event._el) {
                    return;
                }
                if (e.offsetX >= event.x * _this.options.width / 100 && e.offsetX < (event.x + event.width) / 100 * _this.options.width && event.type !== 'neutral') {
                    _this.lastMatch = true;
                    if (event.type !== _this.currentTooltipType) {
                        requestAnimFrame(function () {
                            _this.components.progressBar.tooltip.removeClass(_this.currentTooltipType);
                            _this.currentTooltipType = event.type;
                            _this.components.progressBar.tooltip.addClass(event.type);
                        });
                    }
                }
            });
            if (!_this.lastMatch) {
                _this.components.progressBar.tooltip.removeClass(_this.currentTooltipType);
                _this.currentTooltipType = 'neutral';
            }
        }, 10);
        requestAnimFrame(function () {
            _this.setPreBuffer(time);
        });
    };
    SVGProgressChart.prototype.handleMouseClick = function (e) {
        var _this = this;
        var percent = (e.offsetX / this.options.width * 100);
        requestAnimFrame(function () {
            _this.components.progressBar.progress.moveTo(percent);
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
        overlay._el.addEventListener('click', this.handleMouseClick.bind(this));
        overlay._el.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        overlay._el.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.addClass('show');
    };
    return SVGProgressChart;
}());
exports.SVGProgressChart = SVGProgressChart;
window['SVGProgressChart'] = SVGProgressChart || {};
