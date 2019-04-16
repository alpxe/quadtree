class SocketUtil extends egret.EventDispatcher {
    private _socket: egret.WebSocket;

    private static instance: SocketUtil;

    /**
     * 消息列队
     */
	private list:Array<any>=new Array<any>();

    private check_time_id:number=-1;
    private past:number=0;
    
    public static getInstance(): SocketUtil {
        if (this.instance == null) {
            this.instance = new SocketUtil();
        }
        return this.instance;
    }

    /**
     * 初始化 socket *****************************************
     */
    public async __initialize(ip, port) {
        this._socket = new egret.WebSocket();
        this._socket.addEventListener(egret.Event.CLOSE, () => { }, this);
        this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, () => { }, this);
        this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);

        return new Promise((resolve, reject) => {
            this._socket.addEventListener(egret.Event.CONNECT, function () {
                resolve(); //连接成功
            }, this);
            this._socket.connect(ip, port);
        })
    }

    /**
     * 发送数据相关 *****************************************
     */
    public send(msg:string,queue:boolean=true):number{
        let waitFlag: number = this._wait_flag;
        this._wait_flag++;

        var bytes: egret.ByteArray = this.encode(msg, waitFlag);

        if (bytes) {
            if(queue){
                this.list.push(bytes);
                this.openChecking()
            }else{
                this._socket.type = egret.WebSocket.TYPE_BINARY;
                this._socket.writeBytes(bytes);
                this._socket.flush();
            }
        }
        return waitFlag;
    }
    private _wait_flag: number = 1;

    public __checking():void{
        if(this.list.length>0){
            if(this._socket&&this._socket.connected){
                if(new Date().getTime()-this.past>0){
                    var bytes=this.list.shift();
                    this._socket.type=egret.WebSocket.TYPE_BINARY;
                    this._socket.writeBytes(bytes);
                    this._socket.flush();
                }
                this.past=new Date().getTime();
                return;
            }else{
                console.log("[MQ]: socket closed!");
            }
        }

        this.closeChecking();
    }

    private openChecking():void{
        if(this.check_time_id==-1){
            console.log("开启 列队发送");
            this.check_time_id=TimerUtil.setTicker(10,-1,this.__checking,null,this);
        }
    }

    private closeChecking():void{
        if(this.check_time_id>-1){
            console.log("关闭 列队发送");
            TimerUtil.clearTimeout(this.check_time_id);
            this.check_time_id=-1;
        }
    }


    /**
     * 接收数据相关 *****************************************
     */
    private onReceiveMessage(): void {
        var bytes: egret.ByteArray = new egret.ByteArray();
        bytes.endian = egret.Endian.LITTLE_ENDIAN;/////////////////////////////
        this._socket.readBytes(bytes);

        var obj: any = this.decode(bytes);

        this.dispatchMsg(obj.key, obj.body, obj.waitFlag);
    }

    private dispatchMsg(messageID: number, content: string, waitFlag: number): void {
        this.dispatchEvent(new SocketMsgEvent(this.getMessageNameByID(messageID), content, waitFlag));
    }


    /**
     * 侦听socket消息
     * @param 消息ID   FlagKey中获取
     * @param 你的方法  服务器的消息 e:SocketMsgEvent  e.data
     */
    public AddSocketLinstenr(key: number, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
        this.addEventListener(this.getMessageNameByID(key), listener, thisObject, useCapture, priority);
    }

    /**
     * 移除socket侦听消息
     */
    public RemoveSocketLinstenr(key: number, listener: Function, thisObject: any, useCapture?: boolean) {
        if (this.hasEventListener(this.getMessageNameByID(key)))
            this.removeEventListener(this.getMessageNameByID(key), listener, thisObject, useCapture);
    }

    
	/**
     * 消息封装
     * @param msg
     */
    private encode(msg: any, waitFlag: number): any {
        var bytes: egret.ByteArray = new egret.ByteArray();
        bytes.endian = egret.Endian.LITTLE_ENDIAN;///////////////////////////????
        bytes.writeUnsignedInt(waitFlag);//预留4个字节记录 bytes 总长度

        if(1==1)return bytes;


        //请求头
        var key: number = msg.key;//FlagID

        //请求的消息体
        var body: string;
        if (msg != null && msg.body != null) {
            body = JSON.stringify(msg.body);
        }

        var bytes: egret.ByteArray = new egret.ByteArray();
        bytes.endian = egret.Endian.LITTLE_ENDIAN;///////////////////////////????
        bytes.writeUnsignedInt(0);//预留4个字节记录 bytes 总长度
        bytes.writeUnsignedInt(0);//预留4个字节记录 消息体相关长度
        if (body != null)
            bytes.writeUTFBytes(body);
        bytes.writeByte(0);//预留一个字节

        var offset = bytes.length;//此时的bytes长度

        bytes.position = 4;//切换到预留的4个字节位置： 该位置记录消息体相关长度
        bytes.writeUnsignedInt(offset);//写入长度，覆盖掉0

        bytes.position = bytes.length;//切换到二进制数据末尾
        //继续向末尾写入
        bytes.writeUnsignedInt(waitFlag);/////////////////////////////////?????
        bytes.writeUnsignedInt(key);//请求的FlagID
        bytes.writeByte(0);//预留

        // 服务器的地址类型，1 - 路由地址；   2 - 直接地址；   3 - 任意服务器。
        bytes.writeByte(3);

        bytes.position = 0;//切换到预留位置的0字节位置：该位置记录消息体的总长度
        bytes.writeUnsignedInt(bytes.length);//写入总长度  覆盖掉0

        return bytes;
    }

	/**
	 * 消息解析
	 * @param msg
	 */
    private decode(bytes: egret.ByteArray): any {
        var total: number = bytes.readUnsignedInt();//0-4
        var offset: number = bytes.readUnsignedInt();//4-8
        var body: string = bytes.readUTFBytes(offset - 9);//8-(offset-4-4-1)
        bytes.readByte();
        var waitFlag: number = bytes.readInt();
        var key: number = bytes.readUnsignedInt();

        var data: any = {
            key: key,
            body: body,
            waitFlag: waitFlag
        };
        return data;
    }

    private _protocolMap: any;
    private getMessageNameByID(messageID) {
        if (!this._protocolMap) {
            this._protocolMap = {};
            for (var p in FlagKey) {
                var msgid: number = FlagKey[p];
                var msgname: string = p;
                this._protocolMap[msgid] = msgname;
            }
        }
        var msgname: string = this._protocolMap[messageID];
        if (!msgname)
            console.error("未定义消息ID:0x" + messageID.toString(16));
        return msgname;
    }
}