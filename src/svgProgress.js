"use strict";
var interfaces_1 = require("./interfaces");
var models_1 = require("./models");
// import {Utils} from './utils';
// @TODO import function from Utils
// Define requestAnimationFrame with fallback
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window['webkitRequestAnimationFrame'] ||
        window['mozRequestAnimationFrame'] ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
// Define the main class for the progress chart.
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
        // If new data obj less than what exists than delete data.
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
            // If event created - just modify the props.
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
                    // prepend
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
        // Create progress bar
        // 1. Create the bar element
        var bar = new models_1.Rect(this.options.barHeight, 100, 0, this.options.top);
        bar.addClass('bar');
        this.rootElement.appendChild(bar._el);
        this.components.progressBar.bar = bar;
        // 2. Create the progress element
        var progress = new models_1.Rect(this.options.barHeight, 1, 0, this.options.top);
        progress.addClass('progress');
        progress.moveTo(0);
        // 3. Create the dragging overlay progress
        var bufferProgress = new models_1.Rect(this.options.barHeight, 1, 0, this.options.top);
        this.rootElement.appendChild(bufferProgress._el);
        this.components.progressBar.buffer = bufferProgress;
        bufferProgress.addClass('buffer');
        bufferProgress.moveTo(0);
        this.rootElement.appendChild(progress._el);
        this.components.progressBar.progress = progress;
        console.log(this);
        // 4. Create timeline rects from data if exists
        if (this.options.data) {
            this.setData(this.options.data);
        }
        // 5. Create overlay on top of everything for catching events        
        var overlay = new models_1.Rect(this.options.barHeight * 3, 100, 0, 20 + this.options.tooltipHeight - this.options.barHeight, "rgba(255,255,255,0)");
        overlay.addClass("overlay");
        this.components.progressBar.overlay = overlay;
        this.rootElement.appendChild(overlay._el);
        // 6. Create the tooltip
        var tooltip = new models_1.Tooltip(this.options.tooltipHeight, this.options.tooltipHeight * 2.2, 0, 0, "00:00:00");
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
                    // if(event.hasClass('selected')){
                    //     event.removeClass('selected');
                    // }
                    if (e.offsetX >= event.x * instance.options.width / 100 && e.offsetX < (event.x + event.width) / 100 * instance.options.width && event.type !== 'neutral') {
                        lastMatch = true;
                        if (event.type !== currentTooltipType) {
                            requestAnimFrame(function () {
                                // event.addClass('selected');
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
// Expose instance globally
window['SVGProgressChart'] = SVGProgressChart || {};
