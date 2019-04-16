module HttpHandler {
	export function sendMsgCallBack(URL:string, param:egret.URLVariables, callback:Function, method:string, thisObj:any):void{
		var loader:egret.URLLoader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        var request:egret.URLRequest = new egret.URLRequest(URL);
        request.method = method;
        request.data =param;     

        loader.addEventListener(egret.Event.COMPLETE, function(event:egret.Event)
        {
            var loader:egret.URLLoader = <egret.URLLoader>event.target;
            var data:egret.URLVariables = loader.data;
            console.log(data.toString());
            var obj:any = JSON.parse(data.toString());
            callback.call(thisObj, obj);
        }, this);
        loader.load(request);
        
	}


    export function GetRequest(url:string, params:string, callback:Function, thisObj:any):void{
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        //将参数拼接到url
        request.open(url+params,egret.HttpMethod.GET);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send();

        request.addEventListener(egret.Event.COMPLETE,(event)=>{
            var request = <egret.HttpRequest>event.currentTarget;
            // console.log("get data : ",request.response);
            callback.call(thisObj,request.response);
        },this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR,(event)=>
        {
            console.log("get error : " + event);
        },this);

	}

     export function PostRequest(url:string, params:string, callback:Function, thisObj:any):void
     {
		 var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        //将参数拼接到url
        request.open(url+params,egret.HttpMethod.POST);
        request.send();

        request.addEventListener(egret.Event.COMPLETE,(event)=>
        {
            var request = <egret.HttpRequest>event.currentTarget;
            // console.log("post data : ",request.response);
            callback.call(thisObj,request.response);
        },this);

        request.addEventListener(egret.IOErrorEvent.IO_ERROR,(event)=>
        {
            console.log("post error : " + event);
        },this);
	}

}