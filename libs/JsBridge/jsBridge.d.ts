declare module JsBridge{
    export function initialize():void;
    export function registerHandler(name:string,fun:Function);
    export function callHandler(name:string,data:any,fun:Function);
}