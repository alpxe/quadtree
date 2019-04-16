module MultiUtil {

	/**
	 * 位比较: 与 &
	 * exp>> 11100:10100==10100
	 */
	export function bit(actions, done): boolean {
		return (actions & done) == done;
	}

	/**
	 * 层级触摸完全禁用
	 */
	export function touchChildren(target: any, b: boolean): void {
		target.touchEnabled = b;
		target.touchChildren = b;
	}

	/**
	 * 层级触摸禁用
	 * 但是里面的子内容可以被点击
	 */
	export function touchEnabled(target: any, b: boolean): void {
		target.touchEnabled = b;
	}

	/**
	 * 深度管理
	 * 
	 * tar: eui.Group
	 */
	export function deepManager(tar: any): void {
		let arr: Array<any> = new Array<any>();
		for (let i: number = 0; i < tar.numChildren; i++) {
			var obj: any = {
				item: tar.getChildAt(i),
				depth_y: tar.getChildAt(i).y
			};
			arr.push(obj);
		}

		arr = arr.sort(function (a, b) { return a.depth_y - b.depth_y });

		for (let i: number = 0; i < arr.length; i++) {
			tar.setChildIndex(arr[i].item, i);
		}
	}

	/**
	 * @param type:1 竖屏
	 *        type:2 横屏
	 */
	export function orientation(type: number): void {
		switch (type) {
			case 1://竖屏
				// if (DeviceUtils.getInstance().IsPC) {
				// 	App.StageUtils.startFullscreenAdaptation(750, 1108, () => function (): void { });
				// 	return;
				// }
				// App.StageUtils.startFullscreenAdaptation(750, 1108, () => function (): void { });
				// App.StageUtils.getStage().orientation = egret.OrientationMode.PORTRAIT;
				// App.StageUtils.getStage().scaleMode = egret.StageScaleMode.FIXED_WIDTH;
				break;

			case 2://横屏
				// if (DeviceUtils.getInstance().IsPC) {
				// 	App.StageUtils.startFullscreenAdaptation(1108, 750, () => function (): void { });
				// 	return;
				// }
				// App.StageUtils.startFullscreenAdaptation(1108, 750, () => function (): void { });
				// App.StageUtils.getStage().orientation = egret.OrientationMode.LANDSCAPE_FLIPPED;
				// App.StageUtils.getStage().scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
				break;
		}
	}	
}