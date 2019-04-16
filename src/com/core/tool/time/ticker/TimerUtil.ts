/**
 * 时间方法接口
 */
module TimerUtil {
	/**
	 * 设置一个指定时间后回调的定时器
	 *
	 * @param delay:延迟时间
	 * @param callback:回调
	 */
	export function setTimeout(delay: number, callback: Function, thisObj: any): number {
		var ticker: TimerTicker = new TimerTicker(delay, 1, null, onTimeout, thisObj);
		ticker.start();

		var id: number = ++TickerManager.sTickerId % Number.MAX_VALUE;
		TickerManager.sTickerMap[id] = ticker;
		return id;

		function onTimeout(): void {
			clearTimeout(id);
			callback.apply(thisObj);
		}
	}


	/**
	 * 设置一个定时器，间隔delay执行一次
	 *
	 * @param delay:间隔时间
	 * @param callback:回调
	 * @param immediately:是否立即回调一次
	 *
	 */
	export function setInterval(delay: number, callback: Function, thisObj: any): number {
		var ticker: TimerTicker = new TimerTicker(delay, 0, callback, null, thisObj);
		ticker.start();

		var id: number = ++TickerManager.sTickerId % Number.MAX_VALUE;
		TickerManager.sTickerMap[id] = ticker;
		return id;
	}

	/**
	 * 设置一个指定次数的定时器
	 *
	 * @param delay:间隔时间
	 * @param repeatCount:次数
	 * @param callback:回调
	 * @param complete:完成后的回调
	 */
	export function setTicker(delay: number, repeatCount: number, callback: Function, compFunc: Function = null, thisObj: any): number {
		var ticker: TimerTicker = new TimerTicker(delay, repeatCount, callback, onComplete, thisObj);
		ticker.start();

		var id: number = ++TickerManager.sTickerId % Number.MAX_VALUE;
		TickerManager.sTickerMap[id] = ticker;
		return id;

		function onComplete(): void {
			if (compFunc != null) {
				compFunc.apply(thisObj);
			}
			clearTimeout(id);
		}
	}

	/**
	 * 重置定时器
	 * @param id
	 *
	 */
	export function resetTimer(id: number): void {
		if (id == 0) {
			return;
		}
		var ticker: TimerTicker = TickerManager.sTickerMap[id];
		if (ticker) {
			ticker.reset();
		}
	}

	/**
	 * 重置一个定时器的延时
	 *
	 * @param id:ID
	 * @param delay:新时间
	 */
	export function resetTime(id: number, delay_: number): void {
		if (id == 0) {
			return;
		}
		var ticker: TimerTicker = TickerManager.sTickerMap[id];
		if (ticker) {
			ticker.delay = delay_;
		}
	}


	/**
	 * 移除一个定时器
	 *
	 * @param id:由setTimeout返回的id
	 */
	export function clearTimeout(id: number): void {
		if (id == 0) {
			return;
		}
		var ticker: TimerTicker = TickerManager.sTickerMap[id];
		if (ticker) {
			ticker.dispose();
			delete TickerManager.sTickerMap[id];
		}
	}
}