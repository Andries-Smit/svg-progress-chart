import {Rect, Tooltip} from './models';

// interfaces
export interface ChartOptions {
    width:number;
    height:number;
    data:ChartData[];
    time:number;
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
    default:"#DDDDDD"
}

export const TrimSpacesRegEx:RegExp = /(  +)|(?:\r\n|\r|\n|\r\s)/g ;