import { ChartData, 
         ChartOptions, 
         ProgressBar, 
         ComponentTree, 
         Colors } from './interfaces';
import { Rect, Tooltip } from './models';
// import {Utils} from './utils';
// @TODO import function from Utils
let requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window['mozRequestAnimationFrame'] ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

export class SVGChart {
    id: string;
    rootElement: HTMLElement;
    components: ComponentTree;
    options: ChartOptions = {
        height: 500,
        width: 500,
        data: [],
        time: 0
    };

    constructor(id, options: ChartOptions | undefined) {
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


    private setBuffer(time: number) {
        let that = this;
        let value;
        if (!time) {
            return;
        }
        value = Math.min(time / that.options.time * 100, that.options.time);
        requestAnimFrame(function () {
            that.components.progressBar.buffer.moveTo(value);
        });
    }

    public setProgress(time: number) {
        let that = this;
        let value;
        if (!time) {
            return;
        }
        value = Math.min(time / that.options.time * 100, that.options.time);
        requestAnimFrame(function () {
            that.components.progressBar.progress.moveTo(value);
        });

    }
    private init() {
        let instance = this;
        // Create progress bar
        // 1. Create the bar element
        let bar = new Rect(10, 100, 0, 50, "#ecf0f1");
        this.rootElement.appendChild(bar._el);
        this.components.progressBar.bar = bar;

        // 2. Create the progress element
        let progress = new Rect(10, 1, 0, 50, "#2c3e50");
        progress.moveTo(0);

        // 3. Create the dragging overlay progress
        let bufferProgress = new Rect(10, 1, 0, 50, "rgba(0,0,0,0.1)");
        this.rootElement.appendChild(bufferProgress._el);
        this.components.progressBar.buffer = bufferProgress;
        bufferProgress._el.classList.add('buffer');
        bufferProgress.moveTo(0);

        this.rootElement.appendChild(progress._el);
        this.components.progressBar.progress = progress;
        console.log(this);

        // 4. Create timeline rects from data if exists
        if (this.options.data) {
            this.options.data.forEach((event, i) => {
                event.x = i ? instance.options.data[i - 1].x + instance.options.data[i - 1].width : 0;
                let newEvent = new Rect(20, event.width, event.x, 45);
                newEvent._el.classList.add(event.type);
                instance.components.events.push(newEvent);
                instance.rootElement.appendChild(newEvent._el);
            });
        }

        // 5. Create overlay on top of everything for catching events        
        let overlay = new Rect(40, 100, 0, 30, "rgba(255,255,255,0)");
        overlay._el.classList.add("overlay");
        this.components.progressBar.overlay = overlay;
        this.rootElement.appendChild(overlay._el);

        // 6. Create the tooltip
        let tooltip = new Tooltip(30, 90, 0, 0, "00:00:00", "#DDDDDD");
        this.components.progressBar.tooltip = tooltip;
        this.rootElement.appendChild(tooltip._el);

        // Add event listeners
        overlay._el.addEventListener('click', function (e: MouseEvent) {
            let percent = (e.offsetX / instance.options.width * 100);
            requestAnimFrame(function () {
                progress.moveTo(percent);
            });
        });
        
        overlay._el.addEventListener('mouseleave', function () {
            tooltip.hide();
            bufferProgress.hide();
        });

        overlay._el.addEventListener('mousemove', function (e: MouseEvent) {
            let percent = (e.offsetX / instance.options.width * 100);
            let pixels = e.offsetX / instance.options.width * instance.options.width - tooltip.width / 2;
            let time = e.offsetX / instance.options.width * instance.options.time;
            pixels = Math.max(Math.min(pixels, instance.options.width - tooltip.width), 0);

            function buffer() {
                tooltip.show();
                bufferProgress.show();
                bufferProgress.moveTo(percent);
                tooltip.moveTo(pixels, time);
            }

            requestAnimFrame(buffer);
        });
    }
}