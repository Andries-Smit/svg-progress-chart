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
var interfaces_1 = require("./interfaces");
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
