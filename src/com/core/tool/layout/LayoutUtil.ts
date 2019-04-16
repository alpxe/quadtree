enum FlowType {
	/** 垂直布局:上 */
	Top = 1,

	/** 垂直布局:中 */
	Center,

	/** 垂直布局:下 */
	Bottom,

	/** 水平布局:左 */
	Left,

	/** 水平布局:中 */
	Middle,

	/** 水平布局:右 */
	Right
}

module LayoutUtil {


	/**
	 * 垂直布局
	 * mast: 是否立刻布局
	 */
	export function flow(view: eui.UIComponent, type: FlowType, value: number,mast:boolean=true): void {
		switch (type) {
			case FlowType.Top:
				view.top = value;
				break;
			case FlowType.Center:
				view.verticalCenter = value;
				break;
			case FlowType.Bottom:
				view.bottom = value;
				break;
			case FlowType.Left:
				view.left = value;
				break;
			case FlowType.Middle:
				view.horizontalCenter = value;
				break;
			case FlowType.Right:
				view.right = value;
				break;

			default:
				console.log("选择的类型 不在设置函数中");
				return;
		}

		if(mast)
			view.validateNow();
	}

	/**
	 * 清理布局约束
	 */
	export function clean(view: any): void {
		view.top = NaN;
		view.verticalCenter = NaN;
		view.bottom = NaN;

		view.left = NaN;
		view.horizontalCenter = NaN;
		view.right = NaN;
	}
}