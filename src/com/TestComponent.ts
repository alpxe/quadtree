class TestComponent extends BaseComponent implements QuadNode{
	public rect:egret.Rectangle;

	private debugShape:egret.Shape;
	public constructor(rect:egret.Rectangle) {
		super();
		this.rect=rect;
	}

	public initUI():void{
		this.debugShape=new egret.Shape();
		this.addChild(this.debugShape);

		this.debugShape.graphics.lineStyle(2,0xffffff*Math.random());
		this.debugShape.graphics.drawRect(this.rect.x,this.rect.y,this.rect.width,this.rect.height);

	}

	public initEvent(b:boolean=true):void{

	}

	public initLocation():void{

	}
}