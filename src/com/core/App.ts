class App {
	/**
     * 资源加载工具类
     */
    public static get ResourceUtils(): ResourceUtils {
        return ResourceUtils.getInstance();
    }

    /**
     * Socket工具类
     */
    public static get SocketUtils():SocketUtil{
        return SocketUtil.getInstance();
    }

    public static get StageUtils():StageUtils{
        return StageUtils.getInstance();
    }

    /**
     * facade
     */
    public static get facade():ApplicationFacade{
        return ApplicationFacade.getInstance(ApplicationFacade.NAME);
    }
}