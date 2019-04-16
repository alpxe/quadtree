class SocketMsgEvent extends egret.Event{
	public data:any;
	public waitFlag:number;
	public constructor(type:string,params:any=null,waitFlag:number=0) {
		super(type);
		this.data=params;
		this.waitFlag=waitFlag;
	}
}