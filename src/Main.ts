class Main extends BaseComponent {
    private loadingUI: LoadingUI;

    private debugShape: egret.Shape;
    private moveShape: egret.Shape;

    private info: eui.Label;
    private tips: eui.Label;

    private curr: number = 0;
    private total: number = 0;

    private cont: eui.Group;

    private pw: number = 1500;
    private ph: number = 1500;

    public constructor() {
        super();
    }

    public initUI(): void {
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
        }

        //注入自定义的素材解析器
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        App.StageUtils.setScaleMode(egret.StageScaleMode.FIXED_WIDTH);
        App.StageUtils.startFullscreenAdaptation(1500, 1650, () => {
            console.log("resize");
        })

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.onloadConfig();
        await this.onloadTheme();


        this.loadingUI = new LoadingUI();
        this.addChild(this.loadingUI);
        this.loadingUI.tips = "正在连接服务器...";

        var groupName: string = "main_load";
        var subGroups: Array<string> = [
            "preload"
        ];
        App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    }

    public onloadConfig() {
        App.ResourceUtils.addConfig("resource/default.res.json", "resource/");

        return new Promise((resolve, reject) => {
            App.ResourceUtils.loadConfig(() => {
                console.log("配置加载完成");
                resolve();//该方法中 调用这个exetucor 跳出await
            }, this);
        });
    }

    public onloadTheme() {
        return new Promise((resolve, reject) => {
            let theme: eui.Theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this)
        });
    }


    private tree: QuadTree.Tree;
    private glow: egret.GlowFilter;
    public onResourceLoadComplete() {
        this.removeChild(this.loadingUI);
        
        this.cont = new eui.Group();
        this.addChild(this.cont);

        this.debugShape = new egret.Shape();
        this.addChild(this.debugShape);

        this.moveShape = new egret.Shape();
        this.addChild(this.moveShape);

        this.info = new eui.Label();
        this.addChild(this.info);
        this.info.x = 50;
        this.info.y = this.ph+50;


        this.tips = new eui.Label();
        this.addChild(this.tips);
        this.tips.x = 50;
        this.tips.y = this.ph+100;
        this.tips.text = "拖动鼠标查看。按A加10个。 按B加100个";

        this.glow = new egret.GlowFilter(0X00ffff, 1, 20, 20, 10);

        let redGlow = new egret.GlowFilter(0xff0000, 1, 20, 20);
        this.moveShape.filters = [redGlow];

        this.tree = new QuadTree.Tree(0, 0, new egret.Rectangle(0, 0, this.pw, this.ph));
        this.debugShape.graphics.lineStyle(5, 0xff0000);
        this.debugShape.graphics.clear();
        this.update(this.tree);

        document.addEventListener("keydown", (evt) => this.__keydownHandler(evt));

        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.__moveHandler, this);

        let node: TestComponent = new TestComponent(new egret.Rectangle(
            this.pw * Math.random(),
            this.ph * Math.random(),
            20 + 20 * Math.random(),
            20 + 20 * Math.random()
        ));

        this.cont.addChild(node);
        this.tree.insert(node);
        this.total += 1;
    }
    
    private qs: Array<TestComponent> = [];
    public __moveHandler(e: egret.TouchEvent): void {
        let rect: egret.Rectangle = new egret.Rectangle(e.stageX - 40, e.stageY - 40, 80, 80);

        this.moveShape.graphics.clear();
        this.moveShape.graphics.lineStyle(3, 0xff00ff);
        this.moveShape.graphics.beginFill(0x00ff00, 0.2)
        this.moveShape.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
        this.moveShape.graphics.endFill();

        for (let q of this.qs) {
            q.filters = [];
        }

        this.qs = this.tree.retrieve(rect) as Array<TestComponent>;
        for (let q of this.qs) {
            q.filters = [this.glow];
        }

        this.curr = this.qs.length;

        this.info.text = "当前个数：" + this.curr + "," + "总个数：" + this.total + ",   占 " + Math.floor(this.curr / this.total * 10000) / 100 + "%";
    }

    public __keydownHandler(evt: any): void {
        let len: number = 0;
        switch (evt.keyCode) {
            case 65:
                len = 10;
                break;
            case 66:
                len = 100;
                break;
        }

        for (let i: number = 0; i < len; i++) {
            let node: TestComponent = new TestComponent(new egret.Rectangle(
                this.pw * Math.random(),
                this.ph * Math.random(),
                20 + 20 * Math.random(),
                20 + 20 * Math.random()
            ));

            this.cont.addChild(node);
            this.tree.insert(node);
            this.total += 1;
        }

        this.debugShape.graphics.clear();
        this.update(this.tree);
    }

    public update(tree: QuadTree.Tree): void {
        if (tree == undefined || tree == null) return;

        let bound: egret.Rectangle = tree.bounds;

        this.debugShape.graphics.lineStyle(5, 0xff0000);
        this.debugShape.graphics.drawRect(bound.x, bound.y, bound.width, bound.height);

        for (let t of tree.trees) {
            this.update(t);
        }
    }
    

    public onResourceLoadProgress(itemsLoaded: number, itemsTotal: number) {
        console.log(itemsLoaded + "/" + itemsTotal);
        this.loadingUI.onProgress(itemsLoaded, itemsTotal);
    }
}