/**
 * Created by yangsong on 15-1-14.
 * 音效类
 */
class SoundEffects extends BaseSound {
    private _volume:number;
    private soundChannel:egret.SoundChannel;
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 播放一个音效
     * @param effectName
     */
    public play(effectName:string):void {
        var sound:egret.Sound = this.getSound(effectName);
        // sound.close();
        console.log("音效",effectName)
        if (sound) {
            this.playSound(sound);
        }
    }
    /**
     * 停止播放音效
     * @param effectName
     */
    public stop():void {
            this.stop();
    }

    /* 只播放一个音效
     * @param effectName
     */
    public play2(effectName:string):void {
        var sound:egret.Sound = this.getSound(effectName);
        var channel:egret.SoundChannel = this.soundChannel;
        if(channel){
            //调用soundChannel对象的stop方法停止播放音频
            console.log("先停止",channel);
            channel.stop();
            this.soundChannel = null;
            // return;
        }
        if (sound) {
             this.palySound2(sound);
        }
        
    }

    private palySound2(sound:egret.Sound):void
    {
        try
        {
            this.soundChannel = sound.play(0, 1);
            this.soundChannel.volume = this._volume;
        }
        catch(e)
        {
            // alert(e);
        }
    }

    /**
     * 播放
     * @param sound
     */
    private playSound(sound:egret.Sound):void {
        try
        {
            var channel:egret.SoundChannel = sound.play(0, 1);
            channel.volume = this._volume;
        }
        catch(e)
        {
            // alert(e);
        }
    }

    /**
     * 设置音量
     * @param volume
     */
    public setVolume(volume:number):void {
        this._volume = volume;
    }


    /**
     * 资源加载完成后处理播放
     * @param key
     */
    public loadedPlay(key:string):void {
        this.playSound(RES.getRes(key));
    }
}