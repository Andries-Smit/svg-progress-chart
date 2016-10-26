import {Rect, Tooltip} from './models';

// interfaces
export interface Showable {
    show():void;
    hide():void;
}

export interface ChartOptions {
    width:number;
    height:number;
    data:ChartData[];
    time:number;
    barHeight:number;
    tooltipHeight:number;
    top:number;

}

export interface ChartData {
    width:number;
    type:string;
    x?:number;
    ex?:number; // End X Pos
}


export interface ProgressBar {
    progress: Rect,
    buffer:Rect,
    overlay:Rect,
    bar : Rect,
    tooltip: Tooltip
}

export interface ComponentTree {
    progressBar: ProgressBar;
    events:Rect[];
}

export const Colors  = {
    positive:"#1abc9c",
    negative:"#e74c3c",
    neutral:"rgba(0,0,0,0)",
    default:"#2C3E50"
}

export const TrimSpacesRegEx:RegExp = /(  +)|(?:\r\n|\r|\n|\r\s)/g ;