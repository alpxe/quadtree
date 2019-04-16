module QuadTree {
	export const MAX_NODES: number = 4;//最大个数
	export const MAX_DEPTH: number = 5;//最大深度

	export enum pos {
		TOP = 0x10,
		BOTTOM = 0x20,
		LEFT = 0x40,
		RIGHT = 0x80
	}

	export class Tree {


		/**
		 * 象限
		 * 1 | 0
		 * ——+——
		 * 2 |3
		 */
		public quadrant: number;
		public depth: number;
		public bounds: egret.Rectangle;

		public trees: Array<QuadTree.Tree>;//树
		public nodes: Array<QuadNode>;
		public dictionary: any[] = [];

		public istrunk: boolean = false;

		public SERIAL: number = 0;//自增序号 用于id

		public constructor(quadrant: number, depth: number, bounds: egret.Rectangle) {
			this.quadrant = quadrant;
			this.depth = depth;
			this.bounds = bounds;

			this.trees = new Array<QuadTree.Tree>(4);
			this.nodes = new Array<QuadNode>();
		}

		public retrieve(rect: egret.Rectangle): Array<QuadNode> {
			let result: Array<QuadNode> = new Array<QuadNode>();

			let rant: number = this.locateInfo(rect);

			//如果他有分支，则获取分支下面的retrieve方法
			if (this.istrunk) {
				let index: number = this.getIndex(rant);

				if (index != -1) {//在某个象限上
					result = result.concat(this.trees[index].retrieve(rect));
				} else {
					//切割矩形
					let subs = QuadTree.carve(rect, this.bounds);
					for (let r of subs) {
						//如果还是原来的矩形 那就是没切
						if (r.x == rect.x
							&& r.y == rect.y
							&& r.width == rect.width
							&& r.height == rect.height) {
							break;
						} else {
							result = result.concat(this.retrieve(r));
						}
					}
				}
			}

			//获取他边上的所载
			result = result.concat(this.getSideNode(rant));
			result = result.concat(this.nodes);//特殊所载（一般经过中心位置）

			
			return ArrayUtil.killSame(result);
		}


		public insert(node: QuadNode): void {
			let rant: number = this.locateInfo(node.rect);
			let side: string = QuadTree.pos[rant];
			
			if (this.istrunk) {
				let index: number = this.getIndex(rant);
				if (index != -1) {
					this.trees[index].insert(node);
				} else {
					if (side != undefined && side != null) {
						this.increase(side, node);
					} else {
						this.nodes.push(node);
					}
				}
				return;
			}

			//加入没有分支节点 则全加入到node中
			this.nodes.push(node);

			//如果没有分支，承载超过
			if (!this.istrunk && this.nodes.length > QuadTree.MAX_NODES && this.depth < QuadTree.MAX_DEPTH) {
				this.__split();

				//拆分后 重新分配 nodes的归属
				let temps: Array<QuadNode> = ArrayUtil.clone(this.nodes);
				this.nodes = [];//nodes 重置为空

				for (let item of temps) {
					this.insert(item);
				}
			}
		}

		public delete(node:QuadNode): void {
			throw new Error("四叉树删除方法未实现...");
		}

		private getSideNode(rant: number): Array<QuadNode> {
			let result: Array<QuadNode> = new Array<QuadNode>();

			//遍历方向
			for (let k in QuadTree.pos) {
				let key = parseInt(k);
				if (!isNaN(key)) {
					if (MultiUtil.bit(rant, key)) {
						result = result.concat(this.extract(QuadTree.pos[key]));
					}
				}
			}

			return result;
		}

		private extract(key: string): Array<QuadNode> {
			if (this.dictionary[key] == null || this.dictionary[key] == undefined) {
				return [];
			}
			return this.dictionary[key];
		}

		private increase(key: string, value: QuadNode): void {
			if (this.dictionary[key] == null || this.dictionary[key] == undefined) {
				this.dictionary[key] = new Array<QuadNode>();
			}
			this.dictionary[key].push(value);
		}

		/**
		 * 获取四个角的方位
		 */
		private getIndex(rant: number): number {
			if (MultiUtil.bit(rant, QuadTree.pos.TOP | QuadTree.pos.RIGHT)) {
				return 0;
			}

			if (MultiUtil.bit(rant, QuadTree.pos.TOP | QuadTree.pos.LEFT)) {
				return 1;
			}

			if (MultiUtil.bit(rant, QuadTree.pos.BOTTOM | QuadTree.pos.LEFT)) {
				return 2;
			}

			if (MultiUtil.bit(rant, QuadTree.pos.BOTTOM | QuadTree.pos.RIGHT)) {
				return 3;
			}

			return -1;
		}

		/**
		 * 四等拆分
		 */
		private __split(): void {
			this.istrunk = true;//拆分

			let rx: number = this.bounds.x;
			let ry: number = this.bounds.y;
			let rw: number = this.bounds.width / 2;
			let rh: number = this.bounds.height / 2;

			//4个起点坐标
			let ps: Array<egret.Point> = [
				new egret.Point(rx + rw, ry),//右上
				new egret.Point(rx, ry),//左上
				new egret.Point(rx, ry + rh),//左下
				new egret.Point(rx + rw, ry + rh)//右下
			];

			for (let i: number = 0; i < ps.length; i++) {
				let rect = new egret.Rectangle(ps[i].x, ps[i].y, rw, rh);
				this.trees[i] = new QuadTree.Tree(i, this.depth + 1, rect);
			}
		}

		/**
		 * 定位信息
		 */
		private locateInfo(rect: egret.Rectangle): number {
			let midX = this.bounds.x + this.bounds.width / 2;
			let midY = this.bounds.y + this.bounds.height / 2;

			let rant: number = 0;

			if (rect.y + rect.height < midY) {
				rant |= QuadTree.pos.TOP;
			}

			if (rect.y > midY) {
				rant |= QuadTree.pos.BOTTOM;
			}

			if (rect.x + rect.width < midX) {
				rant |= QuadTree.pos.LEFT;
			}

			if (rect.x > midX) {
				rant |= QuadTree.pos.RIGHT;
			}

			return rant;
		}
	}

	/**
	 * 切割举行
	 */
	export function carve(src: egret.Rectangle, prc: egret.Rectangle): Array<egret.Rectangle> {
		let result: Array<egret.Rectangle> = [];

		let midX: number = prc.x + prc.width / 2;
		let midY: number = prc.y + prc.height / 2;

		if (src.x < midX && src.x + src.width > midX) {
			if (midX - src.x - 1 > 0)
				result = result.concat(carve(new egret.Rectangle(src.x, src.y, midX - src.x - 1, src.height), prc));

			if (src.x + src.width - midX > 0)
				result = result.concat(carve(new egret.Rectangle(midX + 1, src.y, src.x + src.width - midX, src.height), prc));

			return result;
		}

		if (src.y < midY && src.y + src.height > midY) {
			if (midY - src.y - 1 > 0)
				result = result.concat(carve(new egret.Rectangle(src.x, src.y, src.width, midY - src.y - 1), prc));

			if (src.y + src.height - midY > 0)
				result = result.concat(carve(new egret.Rectangle(src.x, midY + 1, src.width, src.y + src.height - midY), prc));

			return result;
		}

		result.push(src);

		return result;
	}
}