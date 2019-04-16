module TweenUtil {
    /**
     * 基于速度的移动
     * 
     * @props {object} {x:int} {y:int}
     * 
     * function onChange(self:any):void; self.currentTarget._target
     */
    export function MoveTo(target: any, props: any, speed: number = 1, sups?: {
        loop?: boolean;
        onChange?: Function;
        onChangeObj?: any;
    }): egret.Tween {
        
        let key: string;
        for (let p in props) {
            if (hasProperty(target, p)) {
                key = p;
                break;
            }
        }

        let curPos: number = target[key];//当前位置
        let tarPos: number = props[key];//目标位置

        var time = 0;
        if (speed > 0) {
            let rate = 10;
            time = rate * Math.abs(tarPos - curPos) / speed;
        }
        return egret.Tween.get(target, sups).to(props, time);
    }

    //判断对象是否存在
    function hasProperty(target: any, p: string): boolean {
        for (let v in target) {
            if (p == v) {
                return true;
            }
        }
        return false;
    }
}