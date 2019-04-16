class TickerManager extends egret.DisplayObjectContainer{

	public tickerList:Array<Ticker> = new Array<Ticker>();

	private lastTime:number;
	
	//实用的静态方法
	public static sTickerId:number = 0;
	public static sTickerMap:any = {};

	private static instance:TickerManager;
	public static getInstance():TickerManager{
		if(this.instance == null){
			this.instance = new TickerManager();
		}
		return this.instance;
     }

	 public constructor(){
		 super();
		 if(TickerManager.instance){
			 throw new Error("TickerManager Singleton already constructed!");
		 }
		 console.log("init TimerManager");
		 this.start();
	}
	
	public start():void
	{
		this.lastTime = egret.getTimer();
		this.addEventListener(egret.Event.ENTER_FRAME, this.__onUpdate,this);
	}

	private __onUpdate(e:egret.Event):void{
		var time:number = egret.getTimer();
		var dtime:number = time - this.lastTime;
		this.lastTime = time;
		this.doTick(dtime);
	}

	public get length():number
	{
		return this.tickerList.length;
	}

	/**
	 * 添加计时器
	 */
	public addTicker(ticker:Ticker):void
	{
		this.tickerList.push(ticker);
	}

	/**
	 * 移除计时器
	 */
	public removeTicker(ticker:Ticker):void
	{
		let iof:number=this.tickerList.indexOf(ticker);
		if(iof>=0){
			this.tickerList.splice(iof, 1);
		}
	}

	public doTick(dtime:number):void
	{
		for(let ticker of this.tickerList){
			ticker.doTick(dtime);
		}
	}
}