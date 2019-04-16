module ProtoUtil {
	export function fromObject(cs: any, obj: Object): any {
		let ins = new cs();
		for (let key in cs.prototype) {
			if (obj.hasOwnProperty(key)) {
				ins[key] = obj[key]
			}
		}

		return ins;
	}

	export function finish(cs: any, obj: Object): Uint8Array {
		let val = fromObject(cs, obj);
		return cs.encode(val).finish();
	}


	/**
	 * 封装 protobuf 内容
	 */
	// export function packet(cmd: Protobufs.MsgType, cs: any, obj: Object): egret.ByteArray {
	// 	let obj_u8r=finish(cs,obj);

	// 	let bytes:egret.ByteArray=new egret.ByteArray();
	// 	bytes.endian=egret.Endian.BIG_ENDIAN;

	// 	bytes.writeShort(cmd);
	// 	bytes._writeUint8Array(obj_u8r);

	// 	return bytes;
	// }
}