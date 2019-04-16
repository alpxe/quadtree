class BaseComponent extends eui.Component implements IBaseComponent{
	private created:boolean=false;
	private added:boolean=false;

	//是否已经加载到舞台中
	private isInited:boolean=false;

	public constructor(skinName:string=null) {
		super();

		if(skinName!=null&&skinName!="")
			this.skinName=skinName;

		this.addEventListener(egret.Event.ADDED_TO_STAGE,this.__addedToStageHandler,this);
	}

	protected childrenCreated():void{
		this.created=true;
		this.__initialize();
	}

	private __addedToStageHandler(e:egret.Event):void{
		this.added=true;
		this.__initialize();
	}

	private __initialize():void{
		if(this.created&&this.added){
			this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.__addedToStageHandler,this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.__removeFromeStageHandler,this);

			//判断是否已经被载入到舞台
			if (!this.isInited){//未载入，则载入
				this.isInited=true;
				this.initUI();
				this.initEvent(true);
				this.initLocation();

				//侦听 舞台大小改变
				this.stage.addEventListener(egret.Event.RESIZE,this.__resizeHandler,this);
			}else{
				this.initLocation();
			}
		}
	}

	private __removeFromeStageHandler(e:egret.Event):void {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.__removeFromeStageHandler,this);
		this.stage.removeEventListener(egret.Event.RESIZE,this.__resizeHandler,this);

		this.dispose();
	}

	private __resizeHandler(e:egret.Event):void{
		this.initLocation();
	}
	

	public initUI():void{

	}

	public initEvent(b:boolean=true):void{

	}

	public initLocation():void{

	}

	/** 
	 * 释放资源
	 * 默认:
	 * 		initEvent(false);
	 * 		while(this.numChildren)this.removeChildAt(0);
	 * 
	 * 如需完全清除，可能还需要重构并且 removeEventListener(Event.ADDED_TO_STAGE,__addedToStageHandle);
	 */
	public dispose():void
	{
		this.initEvent(false);
		
		while(this.numChildren)this.removeChildAt(0);
	}
}