/**
 * 单例基类
 */
class SingleInstance {
    public constructor() {

    }

    /**
     * 获取一个单例
     * @returns {any}
     */
    public static getInstance(...args:any[]):any {
        var Class:any = this;
        if (!Class._instance)
        {                
            Class._instance = new Class(args);
        }
        return Class._instance;
    }
    
}