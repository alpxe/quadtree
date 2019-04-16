class ApplicationStartupCommand extends puremvc.MacroCommand {
	public constructor() {
		super();
	}

	public initializeMacroCommand(): void {
		this.addSubCommand(MacroCommand);
		this.addSubCommand(MacroProxy);
		this.addSubCommand(MacroMediator);
	}
}