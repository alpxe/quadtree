module ArrayUtil {
	export function clone(arr: Array<any>): Array<any> {
		let res: Array<any> = new Array<any>();
		res = res.concat(arr);
		return res;
	}
	
	/**
	 * 从数组中删除一个元素
	 */
	export function deleteElement(arr: Array<any>, n: any): Array<any> {
		let resArr = clone(arr);
		let index: number = arr.indexOf(n);
		if (index >= 0) {
			resArr.splice(index, 1);
		}
		return resArr;
	}

	/**
	 * 从mixed数组中删除arr中存在的元素
	 * @return  形参
	 */
	export function excluding(arr:Array<any>,mixed:Array<any>):Array<any>{
		var _mixed:Array<any>=new Array<any>();
		_mixed=_mixed.concat(mixed);
		for(let i:number=0;i<_mixed.length;i++){
			if(arr.indexOf(_mixed[i])>=0){//搜索成功
				_mixed.splice(i,1);//剔除一个
				i--;
			}
		}
		return _mixed;
	}

	/**
	 * 去除数组中 相同的元素
	 */
	export function killSame(arr: Array<any>): Array<any> {
		let resArr: Array<any> = new Array<any>();

		for (let res of arr) {
			if (resArr.indexOf(res) == -1) {
				resArr.push(res);
			}
		}

		return resArr;
	}

	function randomArray(arrLen: number): number[] {
		var rArr = new Array(arrLen);
		for (var i: number = 0; i < arrLen; i++) {
			rArr[i] = Math.random();
		}
		return rArr;
	}

	function randomIndex(arrLen: number): number[] {
		var iArr = new Array(arrLen);
		var rArr = randomArray(arrLen);  //建立随机数组,以备使用
		for (var i: number = 0; i < arrLen; i++) {  //遍历数组,寻找最小的数字
			iArr[i] = i;  //默认被比较的数字为最小数字,并记录索引
			var t: number = rArr[i];  //记录该数字在临时变量中
			for (var j: number = 0; j < arrLen; j++) {  //与所有数字进行比较
				if (rArr[j] < t) {  //如果发现更小的数字,则更新
					iArr[i] = j;
					t = rArr[j];
				}
			}
			//delete t;
			rArr[iArr[i]] = 1;  //将最小的数字设置成1.
		}
		return iArr;
	}

	export function randomSort(arr: Array<any>): Array<any> {
		let tempArr = clone(arr);

		var arrLen: number = tempArr.length;
		var tArr = new Array(arrLen);  //建立临时数组,存放随机打乱的数组
		var iArr = randomIndex(arrLen);  //建立随机索引
		for (let i: number = 0; i < arrLen; i++) {
			tArr[i] = tempArr[iArr[i]]; //根据随机索引完全打乱数组中所有的值
		}
		return tArr;
	}
}