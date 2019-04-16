/**
 * Created by gu on 2015/8/26.
 */

//分离轴碰撞检测-目前支持 点/圆形/线段/凸多边形/凹多边形(SAT\ConvxCal.ts 文件中有凸多边形分解算法)
//碰撞可采用(quadtree四叉树管理场景内的形状)
module SAT{
	//坐标,顶点,是否为圆形(如果为凹多边形,会传入分割后的多边形数组)
    export function sat(pos1:egret.Point,pos2:egret.Point,p1:Array<any>,p2:Array<any>,iscircle1:boolean=false,iscircle2:boolean=false):boolean{
        if(p1.length<1 || p2.length<1) return false;
        var ismuti1:boolean=(p1[0].constructor.name=="Array");
        var ismuti2:boolean=(p2[0].constructor.name=="Array");
        if(!ismuti1 && !ismuti2){
            return convexsat(pos1,pos2,p1,p2,iscircle1,iscircle2);
        }
        var i:number=0;
        var j:number=0;
        if(ismuti1 && ismuti2){
            for(i=0;i<p1.length;i++){
                for(j=0;j<p1.length;j++){
                    if(convexsat(pos1,pos2,p1[i],p2[j],iscircle1,iscircle2)) return true;
                }
            }
            return false;
        }
        if(ismuti1){
            for(i=0;i<p1.length;i++){
                if(convexsat(pos1,pos2,p1[i],p2,iscircle1,iscircle2)) return true;
            }
            return false;
        }
        for(i=0;i<p2.length;i++){
            if(convexsat(pos1,pos2,p1,p2[i],iscircle1,iscircle2)) {
                return true;
            }
        }
        return false;
    }
	//以前该函数没有传入坐标，只传入了已经转换到舞台的顶点坐标,不过那样每次需要循环取转换坐标，效率较低，所以现在改为坐标与局部顶点数据两个参数的形式
    //计算是否相交;顺序传入多边形顶点(比较场景内的绝对坐标);如果为凹多边形,先用separateConcavePoly函数分解为凸多边形
    //后面两个参数为p1/p2是否为圆形
    //圆形参数结构为[Point(圆心x,圆心y),Point(半径,半径)]
    function convexsat(pos1:egret.Point,pos2:egret.Point,p1:Array<egret.Point>,p2:Array<egret.Point>,iscircle1:boolean=false,iscircle2:boolean=false):boolean{
        //简单做一下边数检查。如过情况复杂，还要校验是否可以构成多边形之类的
        if(p1.length < 1 || p2.length < 1) return false;
        //如过都是圆形，直接进行圆形碰撞
        if(iscircle1 && iscircle2) return circleHit(pos1,pos2,p1,p2);
        var szaxis:Array<egret.Point>=[];
        if(iscircle1 && iscircle2) {
            var segment: egret.Point = new egret.Point(pos1.x-pos2.x,pos1.y-pos2.y);
            szaxis.push(perp(normalize(segment)));
        } else { 
            if(!iscircle1) {
                szaxis = getUniqueAxis(p1,szaxis);
            }
            if(!iscircle2) {
                szaxis = getUniqueAxis(p2,szaxis);
            }
        }
        var i:number;
        var extreme1,extreme2:egret.Point=new egret.Point;
        for(i=0;i<szaxis.length;i++){
            if(iscircle1) {
                extreme1=getCircleProjection(pos1,p1,szaxis[i]);
            } else { 
                extreme1=getProjection(pos1,p1,szaxis[i]);
            }
            if(iscircle2) {
                extreme2=getCircleProjection(pos2,p2,szaxis[i]);
            } else { 
                extreme2=getProjection(pos2,p2,szaxis[i]);
            }
            if(!overlap(extreme1,extreme2)) { 
                return false;
            }
        }
        return true;
    }
    //圆形与圆形碰撞检测
    export function circleHit(pos1:egret.Point,pos2:egret.Point,p1:Array<egret.Point>,p2:Array<egret.Point>):boolean {
        if(p1.length != 2 || p2.length != 2) return false;
        //去掉开方运算提高效率
        var dis2 = Math.pow((p1[0].x+pos1.x)-(p2[0].x+pos2.x),2)+Math.pow((p1[0].y+pos1.y)-(p2[0].y+pos2.y),2);
        var rd = Math.pow(p1[1].x+p2[1].x,2);
        return dis2 < rd;
    }
    //获得多边形包围盒(相对值).顺序:左上右下四个值→Xmin,Ymin,Xmax,Ymax
    export function getPolyBound(p:Array<egret.Point>):Array<number> {
        if(p.length < 1) return [0,0,0,0];
        var szpt: Array<number>=[p[0].x,p[0].y,p[0].x,p[0].y];
        for(var i: number = 0;i < p.length;i++){ 
            if(p[i].x < szpt[0]) szpt[0] = p[i].x;
            if(p[i].y < szpt[1]) szpt[1] = p[i].y;
            if(p[i].x > szpt[2]) szpt[2] = p[i].x;
            if(p[i].y > szpt[3]) szpt[3] = p[i].y;
        }
        return szpt;
    }
    //获得圆形包围盒(相对值)(参数:两项,第一项为圆心坐标,第二项x,y都为半径,后面也许会扩充椭圆).顺序:左上右下四个值→Xmin,Ymin,Xmax,Ymax
    export function getCircleBound(p:Array<egret.Point>):Array<number> {
        if(p.length != 2) return [0,0,0,0];
        var szpt: Array<number>=[p[0].x-p[1].x,p[0].y-p[1].x,p[0].x+p[1].x,p[0].y+p[1].x];
        return szpt;
    }
    //包围盒碰撞检测.顺序:左上右下四个值→Xmin,Ymin,Xmax,Ymax
    export function boundHit(pos1:egret.Point,pos2:egret.Point,p1:Array<number>,p2:Array<number>):boolean{
        if(p1.length != 4 || p2.length != 4) return false;
        if(!overlap(new egret.Point(p1[0]+pos1.x,p1[2]+pos1.x),new egret.Point(p2[0]+pos2.x,p2[2]+pos2.x))) return false;
        if(!overlap(new egret.Point(p1[1]+pos1.y,p1[3]+pos1.y),new egret.Point(p2[1]+pos2.y,p2[3]+pos2.y))) return false;
        return true;
    }
    //点乘
    export function dot(v1:egret.Point,v2:egret.Point):number{
        return v1.x*v2.x+v1.y*v2.y;
    }
    //标准化向量
    export function normalize(vf:egret.Point):egret.Point{
        var v: egret.Point = new egret.Point(vf.x,vf.y);
        var n:number=Math.sqrt(v.x*v.x+v.y*v.y);
        if(!n) return v;
        v.x = Math.round(v.x * 100 / n) / 100;
        v.y = Math.round(v.y * 100 / n) / 100;
        return v;
    }
    //法线向量-perpendicular
    export function perp(vf:egret.Point):egret.Point{
        var v: egret.Point = new egret.Point(vf.x,vf.y);
        var t=v.x;
        v.x=v.y;
        v.y=-t;
        return v;
    }
    //获取多边形需要计算的分离轴(与传入的不重复)
    function getUniqueAxis(p:Array<egret.Point>,curaxis:Array<egret.Point>=[]):Array<egret.Point>{
        var i,j:number=0;
        var b: boolean = false;
        var nor:egret.Point=new egret.Point;
        var segment:egret.Point=new egret.Point;
        for(i=0;i<p.length;i++){
            if(i >= p.length - 1) {
                segment.x=p[0].x-p[i].x;
                segment.y=p[0].y-p[i].y;
            } else { 
                segment.x=p[i+1].x-p[i].x;
                segment.y=p[i+1].y-p[i].y;
            }
            nor=perp(normalize(segment));
            if(nor.x <= 0) { 
                if(nor.x == 0) {
                    if(nor.y < 0) nor.y *= -1;
                } else { 
                    nor.x *= -1;
                    nor.y *= -1;
                }
            }
            b = true;
            //这里如过边数比较多可能会有些消耗，可以修改为二分法查找，这里只为演示功能，简单处理
            for(j = 0;j < curaxis.length;j++){
                if(curaxis[j].x != nor.x) continue;
                if(curaxis[j].y != nor.y) continue;
                b = false;
                break;
            }
            if(!b) continue;
            curaxis.push(nor);
        }
        return curaxis;
    }
    //判断是否有交叠,x,y分别代表最小值与最大值
    function overlap(s1:egret.Point,s2:egret.Point):number{
        if(s1.x>s2.y) return 0;
        if(s1.y<s2.x) return 0;
        if((s1.x - s2.x) * (s2.x - s2.y) < 0) return 1;
        return 1;
    }
    //获取多边形在投影轴上最小与最大点
    function getProjection(pos:egret.Point,p:Array<egret.Point>,axis:egret.Point):egret.Point{
        var ret:egret.Point=new egret.Point;
        var n,min,max:number=0;
        min=dot(new egret.Point(p[0].x+pos.x,p[0].y+pos.y),axis);
        max=min;
        for(var i:number=1;i<p.length;i++){
            n=dot(new egret.Point(p[i].x+pos.x,p[i].y+pos.y),axis);
            if(n<min) min=n;
            if(n>max) max=n;
        }
        ret.x=min;
        ret.y=max;
        return ret;
    }
    //获取圆形在投影轴上最小与最大点
    function getCircleProjection(pos:egret.Point,p:Array<egret.Point>,axis:egret.Point):egret.Point{
        var ret:egret.Point=new egret.Point;
        ret.x=dot(new egret.Point(p[0].x+pos.x,p[0].y+pos.y),axis)-p[1].x;
        ret.y=ret.x+2*p[1].x;
        return ret;
    }
}