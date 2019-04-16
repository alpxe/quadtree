/**
 * 函数描述：js调用webview事件
 *
 * jsBridge.callHandler(method, data, callBack(response))
 * @param method {string} 方法名
 * @param data {Object} 参数
 * @return {Object} 回调
 */
/**
 * 函数描述：webView调用JS事件
 *
 * jsBridge.registerHandler(method, callBack(response))
 * @param method {string} 方法名
 * @return {Object} 回调
 */
var JsBridge = {
    isiOS: false,
    init: function (callback) {
        this.isiOS ? this.iOSBridge(callback) : this.androidBridge(callback);
    },
    isiOSFun: function () {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        return isiOS;
    },
    iOSBridge: function (callback) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    },
    androidBridge: function (callback) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }
        else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                callback(WebViewJavascriptBridge);
            }, false);
        }
    },
    initialize: function () {
        this.isiOS = this.isiOSFun();
        if (!this.isiOS) {
            this.init(function (bridge) {
                bridge.init();
            });
        }
    },
    registerHandler: function (name, fun) {
        this.init(function (bridge) {
            bridge.registerHandler(name, fun);
        });
    },
    callHandler: function (name, data, fun) {
        this.init(function (bridge) {
            bridge.callHandler(name, data, fun);
        });
    }
};
// JsBridge.initialize()
// export default JsBridge
