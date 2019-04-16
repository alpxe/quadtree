module ManagerRes {
	var mrdic: Object = {};

	export async function load(subGroups: string[], progress: Function, ) {
		let sub: string[] = [];
		for (let key of subGroups) {
			if (mrdic.hasOwnProperty(key)) {
				if (mrdic[key] == false) {
					sub.push(key);
				}
			} else {
				mrdic[key] = false;
				sub.push(key);
			}
		}

		return new Promise((resolve, reject) => {
			if (sub.length > 0) {
				App.ResourceUtils.loadGroups("game_load", sub, function (): void {
					for (let key of sub) {
						mrdic[key] = true;
					}
					resolve();
				}, function (itemsLoaded: number, itemsTotal: number): void {
					if(progress)
						progress.call(this, itemsLoaded, itemsTotal);
				}, this);
			} else {
				resolve();
			}
		})
	}

	/**
	 * 强制设置某个组的字典为false
	 */
	export function forceNull(key: string): void {
		if (mrdic.hasOwnProperty(key)) {
			mrdic[key] = false;
		}
	}
}