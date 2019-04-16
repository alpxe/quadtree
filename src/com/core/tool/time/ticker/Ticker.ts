class Ticker {
	public timerFunc:Function;
	public compFunc:Function;
	public thisObj:any;
	public constructor(timerFunc_:Function = null, compFunc_:Function = null,thisObj:any) {
		this.timerFunc=timerFunc_;
		this.compFunc=compFunc_;
		this.thisObj=thisObj;
	}

	public start():void
	{
		TickerManager.getInstance().addTicker(this);
	}
         
	public stop():void
	{
		TickerManager.getInstance().removeTicker(this);
	}

	public reset():void
	{
	}
	
	public doTick(dtime:number):void
	{
	}

	public dispose():void
	{
		this.stop();
		this.reset();
		this.timerFunc = null;
		this.compFunc = null;
	}
}