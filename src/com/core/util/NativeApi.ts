  /**
	* 调用原生api方法汇总
	* 使用方法如：Global.setCookie()
    */

module NativeApi
{

    // 储存数据需要key和value，都必须是字符串
	export function setLocalData(key:string, value:any):void
	{ 
		egret.localStorage.setItem(key, value);
	}

	// 读取数据
	export function getLocalData(key:string):string
	{ 
		return egret.localStorage.getItem(key);
	}

	// 删除数据
	export function deleteLocalData(key:string):void
	{ 
		egret.localStorage.removeItem(key);
	}

	// 将所有数据清空
	export function clearLocalData():void
	{ 
		egret.localStorage.clear();
	}

	//调用麦克风  
	export function getMic():void
	{
    	//getUserMedia API 大部分手机不支持，所以暂不考虑
    }

	//调用canvas截屏
	export function getScreen():void
	{
      
    } 	

	//调用打电话功能
	export function callPhone(telNum:number):void
	{
    	window.open("tel:"+telNum,'_self') 
    } 

	//调用发短信功能
	export function sendMessage(telNum:number):void
	{
    	window.open("sms:"+telNum,'_self') 
    } 	

	export function openUrl(url:string):void
	{
		window.open(url, "_blank");
	}

	//获取当前地址
	export function getCurUrl():string
	{
		return window.location.href;
    } 	

	//当前游戏角度
	export var curAngle:number = +window["orientation"];

	/**
	 * 复制字符串到粘贴板
	 */
	export function copyToClipboard(text: string)
    {
        try
        {
            let input = document.createElement("input");
            input.readOnly = true;
            input.value = text;
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length);
            document.execCommand("Copy");
            document.body.removeChild(input);
        } catch (e)
        {
    
        }
    }





	
	/**
	 * 获得浏览器类型 pc android ios -- 可扩展为其他 如 微信、qqzone、qq、微博、校内、facebook
	 */
    export function systemType(): string
    {
        var ua = window.navigator.userAgent.toLowerCase();

        var microStr = "" + ua.match(/MicroMessenger/i);

        if(("" + ua.match(/windows nt/i)) == "windows nt")
        {
            return "windows";
        }
        else if(("" + ua.match(/iphone/i)) == "iphone")
        {
            return "ios";
        }
        else if(("" + ua.match(/android/i)) == "android")
        {
            return "android";
        }
        else if(("" + ua.match(/ipad/i)) == "ipad")
        {
            return "ipad";
        }
        else if(("" + ua.match(/linux/i)) == "linux")
        {
            return "linux";
        }
        else if(("" + ua.match(/mac/i)) == "mac")
        {
            return "mac";
        }
        else if(("" + ua.match(/ucbrower/i)) == "ucbrower")
        {
            return "ucbrower";
        }
        else
        {
            console.log("未知系统类型");
        }
    }  

	/**
	 * 获得平台类型 如 微信、qqzone、qq、微博、校内、facebook
	 */
    export function platformType(): string
    {
        var ua = window.navigator.userAgent.toLowerCase();

        if(("" + ua.match(/micromessenger/i)) == "micromessenger")
        {
            return "micromessenger";
        }
        else if(("" + ua.match(/qzone/i)) == "qzone")
        {
            return "qzone";
        }
        else if(("" + ua.match(/weibo/i)) == "weibo")
        {
            return "weibo";
        }
        else if(("" + ua.match(/qq/i)) == "qq")
        {
            return "qq";
        }
        else if(("" + ua.match(/renren/i)) == "renren")
        {
            return "renren";
        }
        else if(("" + ua.match(/txmicroblog/i)) == "txmicroblog")
        {
            return "txmicroblog";
        }
        else if(("" + ua.match(/douban/i)) == "douban")
        {
            return "douban";
        }
        else
        {
            return "other";
        }
    }

	/**
	 * 判断是否微信浏览
	 */
    export function isWeiXin(): boolean
    {
        var ua = window.navigator.userAgent.toLowerCase();

        var microStr = "" + ua.match(/MicroMessenger/i);

        if(microStr == "null")
        {
            return false;
        }
        else if(microStr == "micromessenger")
        {
            return true;
        }
    }

	/**
	 * 判断是否大屏
	 */
    export function isBigScreen(): boolean
    {
        return (document.body.clientHeight / document.body.clientWidth > 1.32);
    } 

	/**
	 * 当前舞台
	 */
    export function curStage(): egret.Stage
    {
        return egret.MainContext.instance.stage;
    }

    /**
	 * 当前面板
	 */
    export var curPanel: egret.DisplayObjectContainer;

    /**
	 * 当前游戏宽度
	 */
    export function curWidth(): number
    {
        return egret.MainContext.instance.stage.stageWidth;
    }

    /**
	 * 当前游戏高度
	 */
    export function curHeight(): number
    {
        return egret.MainContext.instance.stage.stageHeight;
    }

}