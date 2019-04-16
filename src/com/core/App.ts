class App {
	/**
     * 资源加载工具类
     */
    public static get ResourceUtils(): ResourceUtils {
        return ResourceUtils.getInstance();
    }
    
    public static get StageUtils():StageUtils{
        return StageUtils.getInstance();
    }
}