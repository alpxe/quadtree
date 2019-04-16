module MathUtil {
	/**
	 * 求直线的斜率
	 * @param a Point
	 * @param b Point
	 */
	export function slope(a: egret.Point, b: egret.Point): number {
		return (a.y - b.y) / (a.x - b.x);
	}

	/**
	 * 点到直线的距离公式
	 * @param a Point
	 * @param k 直线的斜率
	 * @param b 直线的截距
	 */
	export function pline(a: egret.Point, k: number, b: number): number {
		return Math.abs(k * a.x - a.y + b) / Math.sqrt(Math.pow(k, 2) + 1);
	}

	/**
	 * y=kx+b 已知点与斜率，求b的大小
	 * @param k 斜率
	 * @param p 点的坐标
	 */
	export function bbs(k: number, p: egret.Point): number {
		return p.y - k * p.x;
	}

	/**
	 * 已知两点,求中点坐标
	 * @param a Point
	 * @param b Point
	 */
	export function midpoint(a: egret.Point, b: egret.Point): egret.Point {
		var mid: egret.Point = new egret.Point((a.x + b.x) / 2, (a.y + b.y) / 2);
		return mid;
	}

	/**
	 * 点关于直线的对称点
	 * @param a,b,c 直线的标准方式 ax+by+c=0
	 * @param o 坐标点
	 */
	export function mirror(a: number, b: number, c: number, o: egret.Point): egret.Point {
		var x: number = ((b * b - a * a) * o.x - 2 * a * b * o.y - 2 * a * c) / (a * a + b * b);
		var y: number = ((a * a - b * b) * o.y - 2 * a * b * o.x - 2 * b * c) / (a * a + b * b);

		return new egret.Point(x, y);
	}

	/**
	 * 勾股定理求斜边的长度
	 * @param x:Number
	 * @param y:Number
	 */
	export function pythagorean(x: number, y: number): number {
		return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	}

	/**
	 * 直线与圆的交点坐标
	 * 1.   y=kx+b
	 * 2.   (x-m)^2+(y-n)^2=r^2
	 * 根据求方程组 求 x的表达式
	 * (k^2+1)*x^2+(2*k*b-2*n*k-2*m)*x+b^2+n^2+m^2-r^2-2*n*b=0;
	 * 
	 * @param k 直线的斜率
	 * @param b 直线的截距
	 * @param m 圆的x位置
	 * @param n 圆的y位置
	 * @param r 圆的半径
	 * @param mp  目标当前的坐标   与得出的结论做比较  取一个交点的值
	 */
	export function sharpCircle(k: number, b: number, m: number, n: number, r: number, mp: egret.Point): egret.Point {
		var lineA: number = k * k + 1;
		var lineB: number = 2 * k * b - 2 * n * k - 2 * m;
		var lineC: number = b * b + n * n + m * m - r * r - 2 * n * b;
		//直线与圆的交点 两个x坐标 x1,x2    分别将两个x坐标代入圆的方程
		var coil: Object = Substitutions(lineA, lineB, lineC);

		var p1: egret.Point = new egret.Point();
		var p2: egret.Point = new egret.Point();
		//			trace("k",k);
		if (k.toString() == "-Infinity" || k.toString() == "Infinity") {//k=无限大  即CK垂直X轴   此时计算x=m的时候 代入圆的公式 计算y的坐标
			//				trace(m,n,r);
			p1 = new egret.Point(m, n + r);//(y-n)^2=r^2  ±(y-n)=r
			p2 = new egret.Point(m, n - r);
			//				trace(p1,p2)
		} else {
			p1 = new egret.Point(coil["x1"], k * coil["x1"] + b);
			p2 = new egret.Point(coil["x2"], k * coil["x2"] + b);
		}
		var result: egret.Point = distance(p1, mp) < distance(p2, mp) ? p1 : p2;
		return result;
	}


	/**
	 * 解 1元2次方程
	 * Ax^2+Bx+C=0
	 * x=[-b±√(b^2-4ac)]/2a
	 * 
	 * @param a A
	 * @param b B
	 * @param c C
	 */
	export function Substitutions(a: number, b: number, c: number): Object {
		var coil: Object = {};
		if (a == 0) {
			coil["x1"] = coil["x2"] = -c / b;
		} else {
			coil["x1"] = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
			coil["x2"] = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
		}
		return coil;
	}

	/**
	 * 两点之间的距离公式
	 * @param ap Point
	 * @param bp Point
	 */
	export function distance(ap: egret.Point, bp: egret.Point): number {
		return Math.sqrt(Math.pow(ap.x - bp.x, 2) + Math.pow(ap.y - bp.y, 2));
	}


	/**
	 * 直线与x轴的夹角
	 * @param a 直线上的一个点
	 * @param b 直线上的另一个点
	 */
	export function includeAngle(a: egret.Point, b: egret.Point): number {
		return Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI - 90;
	}


	/**
	 * as3数值类型操作工具类集合
	 * version v20121029.0.1  <br/>
	 * date 2012.10.29  <br/>
	 * <br/>
	 * getRandomNum       返回[min, max]之间的一个整型随机数(包含两边)  <br/>
	 * getRandomNumArr    返回[min, max]之间的整型随机数集合(包含两边)  <br/>
	 * getRandomStr       获取随机数， 随机数级别 ($n * 100) ^ 10  <br/>
	 * isEvenNum          是否为偶数  <br/>
	 * isNumber           (整数、小数、正数、负数)  <br/>
	 */

	/**
	 * 返回[min, max]之间的一个整型随机数(包含两边)
	 * @param min 最小值限定
	 * @param max 最大值限定
	 * @return int 返回一个获取的无重复随机数
	 */
	export function getRandomNum(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	/**
	 * 返回[min, max]之间的整型随机数集合(包含两边)
	 * @param min 最小值限定
	 * @param max 最大值限定
	 * @param no 生成几个不同的数字
	 * @return Array 返回获取的无重复随机数集合对象
	 */
	export function getRandomNumArr(min: number, max: number, nums: number): Array<number> {
		var result: Array<number> = [];
		if (nums > 0) {
			if (nums == 1) {
				result.push(getRandomNum(min, max));
			}
			else {
				var generate: number = getRandomNum(min, max);
				while (true) {
					if (result.length == nums) {
						break;
					}
					if (result.indexOf(generate) != -1) {
						generate = getRandomNum(min, max);
					}
					else {
						result.push(generate);
					}
				}
			}
		}
		return result;
	}


	/**
	 * 获取随机数， 随机数级别 ($n * 100) ^ 10
	 * @param $n 随机数级别，越高所生成的随机数的长度越大，当然效率越低，一般不大于10
	 * @return (String) 返回生成的随机数结果
	 * */
	export function getRandomStr($n: number): String {
		var s: String = "";
		var i: number = 0;
		while (i < $n) {
			s += Math.floor(Math.random() * 1000).toString();
			i++;
		}
		return s;
	}


	/**
	 * 是否为偶数
	 * @param num 目标数值 
	 * @return Boolean 偶数返回true，奇数返回false
	 * */
	export function isEvenNum(num: number): boolean {
		if (Math.floor(num) % 2 == 0) {
			return true;        //偶数
		}
		else {
			return false;    //奇数
		}
	}

	/**
	 * 判断是否为数值型字符串(整数、小数、正数、负数)
	 * @param str 目标字符串
	 * @return Boolean 是数值型字符串返回true, 否则返回false
	 * */
	export function isNumber(str: string): boolean {
		if (str == null) {
			return false;
		}
		return !isNaN(Number(str));
	}



	/**
	 * 排列组合 (二进制法)
	 * 从n个元素中 任取m个元素并成一组   所组成的集合
	 * @param n 数组源
	 * @param m 取m个
	 * @return res 集合{ 个数 × m }的二维数组
	 */
	export function Cn2m(n: Array<any>, m: number): Array<Array<any>> {
		var res: Array<Array<any>> = new Array<Array<any>>();

		/**
		 * exp：
		 * 返回的数组格式 C(3,2)
		 * [1,1,0]
		 * [1,0,1]
		 * [0,1,1]
		 */
		var transform: Array<Array<any>> = combinationsByTransform(n.length, m);

		for (var i: number = 0; i < transform.length; i++) {
			var tmp: Array<any> = new Array<any>();
			for (var j: number = 0; j < transform[i].length; j++) {
				if (transform[i][j] == 1) {
					tmp.push(n[j]);
				}
			}
			res.push(tmp);
		}
		return res;
	}




	/**Cm2n 依赖的方法 */
	function combinationsByTransform(count: number, selectMany: number): Array<Array<any>> {
		if (selectMany < 2 || count < selectMany) return [];
		var combination: Array<any> = [];  //each combination

		for (var i = 0; i < count; i++) {
			combination.push(0);//全部 初始化 0
		}

		//init the first combination 初始化第一个序列
		for (var i = 0; i < selectMany; i++) {
			combination[i] = 1;//前面几个 都设置成1
		}

		var transform: Array<Array<any>> = new Array<Array<any>>();
		var list: Array<any> = new Array<any>();
		list = list.concat(combination);
		//保存序列
		transform.push(list);
		// transform.push(combination); //store combination 保存第一个序列

		var end = count - 1; //如果i移动到序列末端，未找到'10'则已经产生了所有序列
		for (var i = 0, one = -1; i < end; i++) {
			if (combination[i] == 1) one++; //统计直到当前位置，'1'的个数
			//找到第一对'10'并交换
			if (combination[i] == 1 && combination[i + 1] == 0) {
				combination[i] = 0;
				combination[i + 1] = 1;
				//以下两个for是把第一对'10'前的'1'全部移动到序列开头
				for (var k = 0; k < one; k++) {
					combination[k] = 1;
				}
				for (k = one; k < i; k++) {
					combination[k] = 0;
				}

				var list: Array<any> = new Array<any>();
				list = list.concat(combination);
				//保存序列
				transform.push(list);
				//查找下一个序列
				i = -1;
				one = -1;
			}
		}
		//返回组合数形如[1,1,1,0,1]结果集
		return transform;
	}

	
}