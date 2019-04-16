class TimerTicker extends Ticker{
	public delay:number;
	public repeatCount:number = 0;
	public tickTime:number;
	public tickCount:number = 0;

	public constructor(delay_:number,repeatCount_:number=0,timerFunc_:Function = null, compFunc_:Function = null,thisObj:any=null) {
		super(timerFunc_, compFunc_,thisObj);
		this.delay = Math.abs(delay_);
		this.repeatCount = Math.max(0, repeatCount_);
		this.reset();
	}

	public reset():void
	{
		this.tickCount = 0;
		this.tickTime = 0;
	}

	public doTick(dtime:number):void{
		this.tickTime += dtime;
		while (this.tickTime >= this.delay)
		{
			this.tickTime -= this.delay;
			++this.tickCount;
			if(this.timerFunc != null)
			{
				// this.timerFunc();
				this.timerFunc.apply(this.thisObj);
			}
			if (this.repeatCount > 0 && this.tickCount >= this.repeatCount)
			{
				if (this.compFunc != null)
				{
					// this.compFunc();
					this.compFunc.apply(this.thisObj);
				}
				this.dispose();
				return;
			}
		}
	}
}