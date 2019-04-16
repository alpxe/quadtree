class ApplicationMediator extends puremvc.Mediator implements puremvc.IMediator {
	public static NAME: string = "ApplicationMediator";
	public constructor(viewComponent: any) {
		super(ApplicationMediator.NAME, viewComponent);
	}

	public listNotificationInterests(): string[] {
		return [
			ApplicationFacade.INSTALL_MAIN_EVENT
		];
	}

	public handleNotification(notification: puremvc.INotification): void {
		var data: any = notification.getBody();

		switch (notification.getName()) {
			case ApplicationFacade.INSTALL_MAIN_EVENT:
				console.log("INSTALL_MAIN_EVENT");
				break;
		}
	}
}