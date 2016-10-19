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
        window['webkitRequestAnimationFrame'] ||
        window['mozRequestAnimationFrame'] ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

export class SVGProgressChart {
    id: string;
    rootElement: HTMLElement;
    components: ComponentTree;
    options: ChartOptions = {
        height: 500,
        width: 500,
        data: [],
        time: 0
    };

    constructor(id, options: ChartOptions) {
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
        time = Math.min(time, this.options.time);
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
        time = Math.min(time, this.options.time);
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

    public setPreBuffer(time:number) {
        time = Math.min(time, this.options.time);
        let per = time / this.options.time;
        let pixels = per * this.options.width - this.components.progressBar.tooltip.width / 2;
        pixels = Math.max(Math.min(pixels, this.options.width - this.components.progressBar.tooltip.width), 0);

        this.components.progressBar.tooltip.show();
        this.components.progressBar.buffer.show();
        this.setBuffer(time);
        this.components.progressBar.tooltip.moveTo(pixels, time);

    }

    private init() {
        let instance = this;
        // Create progress bar
        // 1. Create the bar element
        let bar = new Rect(10, 100, 0, 50);
        bar.addClass('bar');
        this.rootElement.appendChild(bar._el);
        this.components.progressBar.bar = bar;

        // 2. Create the progress element
        let progress = new Rect(10, 1, 0, 50);
        progress.addClass('progress');
        progress.moveTo(0);

        // 3. Create the dragging overlay progress
        let bufferProgress = new Rect(10, 1, 0, 50);
        this.rootElement.appendChild(bufferProgress._el);
        this.components.progressBar.buffer = bufferProgress;
        bufferProgress.addClass('buffer');
        bufferProgress.moveTo(0);

        this.rootElement.appendChild(progress._el);
        this.components.progressBar.progress = progress;
        console.log(this);

        // 4. Create timeline rects from data if exists
        if (this.options.data) {
            this.options.data.forEach((event, i) => {
                event.x = i ? instance.options.data[i - 1].x + instance.options.data[i - 1].width : 0;
                let newEvent = new Rect(20, event.width, event.x, 45, Colors[event.type]);
                newEvent.type = event.type;
                newEvent.addClass(event.type);
                instance.components.events.push(newEvent);
                instance.rootElement.appendChild(newEvent._el);
            });
        }

        // 5. Create overlay on top of everything for catching events        
        let overlay = new Rect(40, 100, 0, 30, "rgba(255,255,255,0)");
        overlay.addClass("overlay");
        this.components.progressBar.overlay = overlay;
        this.rootElement.appendChild(overlay._el);

        // 6. Create the tooltip
        let tooltip = new Tooltip(30, 90, 0, 0, "00:00:00");
        this.components.progressBar.tooltip = tooltip;
        this.rootElement.appendChild(tooltip._el);

        // Add event listeners
        overlay._el.addEventListener('click', function (e: MouseEvent) {
            let percent = (e.offsetX / instance.options.width * 100);
            requestAnimFrame(function () {
                progress.moveTo(percent);
            });
        });
        
        overlay._el.addEventListener('mouseleave', function (e:MouseEvent) {
            requestAnimFrame(function(){
                tooltip.hide();
                bufferProgress.hide();
            });
           
        });

        let timer:number;
        overlay._el.addEventListener('mousemove', function (e: MouseEvent) {
            let percent = (e.offsetX / instance.options.width * 100);
            let pixels = e.offsetX / instance.options.width * instance.options.width - tooltip.width / 2;
            let time = e.offsetX / instance.options.width * instance.options.time;
            pixels = Math.max(Math.min(pixels, instance.options.width - tooltip.width), 0);
            
            clearTimeout(timer);

            timer = setTimeout(function () {
            instance.components.events.forEach(event => {
                tooltip.removeClass('positive');
                tooltip.removeClass('negative');
                if(e.offsetX >= event.x*instance.options.width/100 && e.offsetX < (event.x + event.width)/100*instance.options.width) {
                    if(event.color !== Colors.neutral){
                        requestAnimFrame(function(){
                            tooltip.addClass(event.type);
                        });
                    } 
                }
            });
            }, 10);


            requestAnimFrame(function(){
                instance.setPreBuffer(time);
            });
        });
    }
}