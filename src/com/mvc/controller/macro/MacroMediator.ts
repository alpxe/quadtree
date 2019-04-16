class MacroMediator extends puremvc.SimpleCommand implements puremvc.ICommand {
	public execute(notification: puremvc.INotification): void {
		App.facade.registerMediator(new ApplicationMediator(notification.getBody()));
	}
}	