module TextureUtil {

	/**
	 * 切割图的描述数据
	 * horl * verl 的数组
	 * @returns  描述图形的凹凸四边数组
	 */
	export function CuttingDescription(horl: number, verl: number): Array<Array<number[]>> {
		let arr: Array<Array<number[]>> = new Array<Array<number[]>>();
		for (let i: number = 0; i < verl; i++) {
			arr[i] = new Array<number[]>();
			for (let j: number = 0; j < horl; j++) {
				let quad: number[] = [];// x y w h
				quad.push(j == 0 ? 0 : getRandom());
				quad.push(i == 0 ? 0 : getRandom());
				quad.push(j == (horl - 1) ? 0 : getRandom());
				quad.push(i == (verl - 1) ? 0 : getRandom());

				arr[i].push(quad);
			}
		}
		return varietyArray(arr);
	}

	/**
	 * 变化数组
	 */
	function varietyArray(arr: Array<Array<number[]>>): Array<Array<number[]>> {
		for (let i: number = 0; i < arr.length - 1; i++) {
			for (let j: number = 0; j < arr[i].length - 1; j++) {//纵向延展
				let tips: number[] = arr[i][j];
				let tips_right: number[] = arr[i][j + 1];
				let tips_bottom: number[] = arr[i + 1][j];
				let tips_diago: number[] = arr[i + 1][j + 1];
				tips_right[0] = tips[2] * -1;
				tips_bottom[1] = tips[3] * -1;
				tips_diago[0] = tips_bottom[2] * -1;
				tips_diago[1] = tips_right[3] * -1;
			}
		}
		return arr;
	}

	function getRandom(): number {
		return Math.random() > 0.5 ? 1 : -1;
	}


	export function CuttingMachine(txr:egret.Texture,des:Array<Array<number[]>>,offset:number){
		let bmp:egret.Bitmap=new egret.Bitmap(txr);
		let verl:number=des.length;
		let horl:number=des[0].length;

		let horlStep:number=txr.textureWidth/horl;
		let verlStep:number=txr.textureHeight/verl;

		let resArr:Array<Array<egret.RenderTexture>>=new Array<Array<egret.RenderTexture>>();

		for(let i:number=0;i<des.length;i++){
			resArr[i]=new Array<egret.RenderTexture>();
			for(let j:number=0;j<des[i].length;j++){
				let quad:number[]=des[i][j];

				let rect:egret.Rectangle=new egret.Rectangle(j*horlStep,i*verlStep,horlStep,verlStep);
				let offsetX:number=quad[0]==1?offset:0;//如果左边凸 则向左偏移
				rect.x-=offsetX;
				rect.width+=offsetX;
				let offsetY:number=quad[1]==1?offset:0;//如果上边凸 则向上偏移
				rect.y-=offsetY;
				rect.height+=offsetY;
				
				rect.width+=(quad[2]==1?offset:0);
				rect.height+=(quad[3]==1?offset:0);	

				let renderTexture=Cutting(bmp,rect);
				

				resArr[i].push(renderTexture);
			}
		}

		return resArr;

	}

	function Cutting(view: egret.DisplayObject, rect: egret.Rectangle): egret.RenderTexture {
		let renderTexture: egret.RenderTexture = new egret.RenderTexture();
		renderTexture.drawToTexture(view, rect);
		return renderTexture;
	}


	export function CuttingMachine3(txr: egret.Texture, data: any, sup: number = 30): Array<Array<egret.RenderTexture>> {
		let step: number = data.step;
		let desArr: Array<Array<number[]>> = data.arr;

		let bitmap: egret.Bitmap = new egret.Bitmap(txr);

		let resArr: Array<Array<egret.RenderTexture>> = new Array<Array<egret.RenderTexture>>();

		for (let i: number = 0; i < desArr.length; i++) {
			let arr: Array<egret.RenderTexture> = new Array<egret.RenderTexture>();
			resArr.push(arr);
			for (let j: number = 0; j < desArr[i].length; j++) {
				let des: number[] = desArr[i][j];

				let rectX: number = j * step;
				let rectY: number = i * step;
				let rectW: number = step;
				let rectH: number = step;

				if (des[0] == 1) rectX -= sup;
				if (des[1] == 1) rectY -= sup;
				if (des[2] == 1) rectW += sup;
				if (des[3] == 1) rectH += sup;

				let renderTexture: egret.RenderTexture = new egret.RenderTexture();
				renderTexture.drawToTexture(bitmap, new egret.Rectangle(rectX, rectY, rectW, rectH));

				arr.push(renderTexture);
			}
		}

		return resArr;
	}

	/**
	 * 切割器
	 * rx * ry 
	 * "horl":horl, //横向切几刀
	 * "verl":verl, //纵向切几刀
	 * "hstep":horlStep, //横向宽度
	 * "vstep":verlStep, //纵向宽度
	 * "arr":resArr // 子项二维数组 @type Array<Array<egret.RenderTexture>>  
	 * @param txr 纹理
	 * @param horl 水平方向切几刀
	 * @param verl 垂直方向切几刀
	 * 
	 * @return horl verl hstep vstep arr
	 */
	export function CuttingMachine2(txr: egret.Texture, horl: number, verl: number): any {
		let totalWidth: number = txr.textureWidth;
		let totalHeight: number = txr.textureHeight;

		let bitmap: egret.Bitmap = new egret.Bitmap(txr);

		//跨度
		let horlStep: number = totalWidth / (horl + 1);
		let verlStep: number = totalHeight / (verl + 1);

		console.log(horlStep, verlStep);

		let resArr: Array<Array<egret.RenderTexture>> = new Array<Array<egret.RenderTexture>>();
		//从左到右 。从上到下切割
		for (let i: number = 0; i <= verl; i++) {
			let arr: Array<egret.RenderTexture> = new Array<egret.RenderTexture>();
			resArr.push(arr);

			for (let j: number = 0; j <= horl; j++) {
				let sx: number = j * horlStep;
				let sy: number = i * verlStep;


				let renderTexture: egret.RenderTexture = new egret.RenderTexture();
				renderTexture.drawToTexture(bitmap, new egret.Rectangle(sx, sy, horlStep, verlStep));

				arr.push(renderTexture);
			}
		}

		let res: Object = {
			"horl": horl, //横向切几刀
			"verl": verl, //纵向切几刀
			"hstep": horlStep, //横向宽度
			"vstep": verlStep, //纵向宽度
			"arr": resArr // 子项二维数组 @type Array<Array<egret.RenderTexture>>  
		};

		return res;
	}

}