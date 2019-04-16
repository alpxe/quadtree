class ApplicationFacade extends puremvc.Facade implements puremvc.IFacade{
	public static NAME:string="MainModuleApp";
	
	public static STARTUP:string="StartupEvent";

	public static INSTALL_MAIN_EVENT:string="INSTALL_MAIN_EVENT";

	public constructor(key:string) {
		super(key)
	}

	public static getInstance(key:string):ApplicationFacade{
		if(this.instanceMap[key]==null)this.instanceMap[key]=new ApplicationFacade(key);
		return <ApplicationFacade><any>this.instanceMap[key];
	}

	public initializeController(): void{
		super.initializeController();
		this.registerCommand(ApplicationFacade.STARTUP,ApplicationStartupCommand);
	}

	public startup(app:any):void{
		this.sendNotification(ApplicationFacade.STARTUP,app);
		this.removeCommand(ApplicationFacade.STARTUP);//puremvc初始化完成，注销STARTUP命令
	}

	/**
	 * 需要绑定的view 已经被加载到舞台上
	 * 确保实力化完成 (防止把null注册到Mediator)
	 * 然后注册到Mediator
	 * @param imm: 是否立刻注册(立即注册，无需等待addchild到舞台后才执行)
	 */
	public static addToMediator(appView:egret.IEventDispatcher,mediator:Function,thisObj,imm:boolean=false):void{
		let mediatorFunc:any=mediator;
		if(imm){
			ApplicationFacade.getInstance(ApplicationFacade.NAME).registerMediator(new mediatorFunc(appView));
		}else{
			appView.addEventListener(egret.Event.ADDED_TO_STAGE,__addToStageHandler,thisObj);		
		}

		function __addToStageHandler(e:egret.Event):void{
			e.currentTarget.removeEventListener(egret.Event.ADDED_TO_STAGE,__addToStageHandler,thisObj);
			ApplicationFacade.getInstance(ApplicationFacade.NAME).registerMediator(new mediatorFunc(appView));
		}
	}
}