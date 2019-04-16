/**
 * Created by gu on 2015/8/26.
 */
//这个是简化版本的
module SAT_SIMPLE{
    //计算是否相交
    export function sat(p1: Array<egret.Point>,p2: Array<egret.Point>): number {
        //简单做一下边数检查。如过情况复杂，还要校验是否可以构成多边形之类的
        if(p1.length < 3 || p2.length < 3) return 0;
        var szaxis: Array<egret.Point> = [];
        szaxis = getUniqueAxis(p1,szaxis);
        szaxis = getUniqueAxis(p2,szaxis);
        var i: number;
        var extreme1,extreme2: egret.Point = new egret.Point;
        for(i = 0;i < szaxis.length;i++) {
            extreme1 = getProjection(p1,szaxis[i]);
            extreme2 = getProjection(p2,szaxis[i]);
            if(!overlap(extreme1,extreme2)) return 0;
        }
        return 1;
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
        v.x/=n;
        v.y/=n;
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
    function getProjection(p:Array<egret.Point>,axis:egret.Point):egret.Point{
        var ret:egret.Point=new egret.Point;
        var n,min,max:number=0;
        min=dot(p[0],axis);
        max=min;
        for(var i:number=1;i<p.length;i++){
            n=dot(p[i],axis);
            if(n<min) min=n;
            if(n>max) max=n;
        }
        ret.x=min;
        ret.y=max;
        return ret;
    }
}