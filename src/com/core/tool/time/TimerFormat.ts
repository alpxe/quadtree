module Timer {
	//时间格式化输出
	export class TimerFormat {

		public static Format(sec:number,type:TimerType=TimerType.MMSS):string
		{
			switch(type)
			{
				case TimerType.MMSS:
					return this.getMMSS(sec);	
				case TimerType.HHMMSS:			
					return this.getHHMMSS(sec);	
				case TimerType.YYYYMMDD_HHMM:
					return this.getYYYYMMDD_HHMM(sec);
							
			}
		}


		public static FormatChina_Sec(dateStr:string):number
		{
			let date:Date = new Date(dateStr);
			let sec:number = date.getTime()-(8*3600*1000);
			return sec;

		}

		public static getYYYYMMDD_HHMM(sec:number,_date?:any):string
		{
			let date:Date = null;
			if(_date)
			{
				date = _date;
			}
			else
			{
				date = new Date(sec);
			}			
			let year:number = date.getFullYear();
			let month:number = date.getMonth()+1;
			let day:number = date.getDate();
			let hour:number = date.getHours();
			let minute:number =date.getMinutes();
			return year+"/"+this.getTwoDigits(month)+"/"+this.getTwoDigits(day)+" "+this.getTwoDigits(hour)+":"+this.getTwoDigits(minute);
		}

		private static getMMSS(sec:number):string
		{
			let minute:number = Math.floor(sec/60);
			let seconds:number = sec%60;
			let minuteStr:string = this.getTwoDigits(minute);
			let secondsStr:string = this.getTwoDigits(seconds);
			return minuteStr+":"+secondsStr;
		}

		private static getHHMMSS(sec:number):string
		{
			let hour:number = Math.floor(sec/3600);
			let minute:number = Math.floor((sec-hour*3600)/60);
			let seconds:number = Math.floor(sec%60);
			let hourStr:string = this.getTwoDigits(hour);
			let minuteStr:string = this.getTwoDigits(minute);
			let secondsStr:string = this.getTwoDigits(seconds);
			return hourStr+":"+minuteStr+":"+secondsStr;
		}	

		private static getTwoDigits(num:number):string
		{
			let twodigits:string = num>=10?(num+""):("0"+num);
			return twodigits;
		}


		/**
		 * 01:22
		 */
		public static minute2second(str:string):number{
			let arr:string[]=str.split(":");
			if(arr.length!=2)return -1;
			
			let min:number=parseInt(arr[0]);
			let sec:number=parseInt(arr[1]);
			return min*60+sec;
		}
	}

	//MMSS => 00:58分秒形式
	//HHMMSS => 01：00：22 时分秒形式
	//yyyy/mm/dd hh:mm => 2018/09/01 12:43
	export enum TimerType
	{
		HHMMSS,
		MMSS,
		YYYYMMDD_HHMM
		
	}
}