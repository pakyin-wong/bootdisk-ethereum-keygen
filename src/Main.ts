class Main extends eui.UILayer {
  protected createChildren(): void {
    super.createChildren();
    // add global mouse event handler
    mouse.enable(this.stage);

    // egret.lifecycle.addLifecycleListener(context => {
    //   // custom lifecycle plugin
    // });

    // egret.lifecycle.onPause = () => {
    //   egret.ticker.pause();
    // };

    // egret.lifecycle.onResume = () => {
    //   egret.ticker.resume();
    // };

    this.init().catch(e => {
      console.log(e);
    });
  }

  private async init() {
    // step 1: init director elements (socket comm, controller, handler)
    // dir.socket = new socket.SocketMock();
    dir.config = await we.utils.getConfig();
    if (dir.config.mode === 'comm') {
      dir.socket = new we.core.SocketComm();
    } else {
      dir.socket = new we.core.SocketMock();
    }
    dir.evtHandler = new we.core.EventHandler();
    dir.errHandler = new we.core.ErrorHandler();
    dir.layerCtr = new we.core.LayerCtr(this.stage);
    dir.sceneCtr = new we.core.SceneCtr();
    dir.meterCtr = new we.core.MeterCtr();
    dir.moniter = new we.core.Monitor();
    dir.videoPool = new we.utils.Pool(egret.FlvVideo);

    // step 2: init Egrets Asset / Res
    await this.initRes();

    // step 3: create loading scene
    dir.sceneCtr.goto('loading');
  }

  private async initRes() {
    egret.registerImplementation('eui.IAssetAdapter', new AssetAdapter());
    egret.registerImplementation('eui.IThemeAdapter', new ThemeAdapter());
    try {
      await RES.loadConfig('resource/default.res.json', 'resource/');
      await Promise.all([this.loadTheme(), RES.loadGroup(we.core.res.EgretBasic), RES.loadGroup('temp'), fontMgr.loadFonts([{ res: 'barlow_woff', name: 'Barlow' }])]);
    } catch (e) {
      console.error(e);
    }
  }

  private loadTheme(): Promise<{}> {
    const theme = new eui.Theme('resource/default.thm.json', this.stage);
    return we.utils.wait(theme, eui.UIEvent.COMPLETE);
  }
}
