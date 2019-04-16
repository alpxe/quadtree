module Qe {
	/**
	 * @param data {key:number,body:Object}
	 * 
	 * 该次发送的socket 由该次waitFlag 相对应的socket回调执行
	 * 
	 * exp:
	 * 	Qe.semd({key:Falg.XXXX,body:null}).then((msg)=>{ console.log(msg) );
	 *  这里由于this作用域的问题 使用 (value)=>{ console.log(value) } 改变this指向
	 */
	export async function send(data:any){
		return new Promise((resolve,reject)=>{
			SocketUtil.getInstance().AddSocketLinstenr(data.key,__listener,this);

			let flagKey=SocketUtil.getInstance().send(data);

			function __listener(e:SocketMsgEvent){
				if(flagKey==Math.abs(e.waitFlag)){
					SocketUtil.getInstance().RemoveSocketLinstenr(data.key,__listener,this);
					resolve(e.data);
				}	
			}
		})
	}
}