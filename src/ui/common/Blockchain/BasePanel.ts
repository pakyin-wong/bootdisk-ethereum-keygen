namespace we {
  export namespace blockchain {
    export class BasePanel extends ui.Panel {
      protected _gameData;
      protected _closeButton;

      protected _panelBgSource = 'd_bcba_panel_bg_png';
      protected draggableArea;

      protected _maxYPos;
      protected _minYPos;

      protected _startYPos;
      protected _endYPos;

      protected _scroller: ui.Scroller;

      public set maxYPos(value: number) {
        this._maxYPos = value;
      }
      public get maxYPos(): number {
        return this._maxYPos;
      }

      public set minYPos(value: number) {
        this._minYPos = value;
      }
      public get minYPos(): number {
        return this._minYPos;
      }

      protected mount() {
        super.mount();
        this.createBg();
        if(env.isMobile){
          if(this.draggableArea){
            this.draggableArea.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.draggableBegin, this);
            this.draggableArea.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.draggableCheck, this);
            this.draggableArea.addEventListener(egret.TouchEvent.TOUCH_END, this.draggableEnd, this);
          }
        }
      }

      protected createBg() {
        const image = new eui.Image();
        image.width = this.width;
        image.height = this.height;
        image.source = this._panelBgSource;
        image.scale9Grid = new egret.Rectangle(169, 118, 2, 802);
        this.content && this.content.addChildAt(image, 0);
      }

      protected draggableBegin(e: egret.TouchEvent){
        this._startYPos = e.stageY;
        if(this._scroller.viewport.scrollV == 0){

        } 
      }

      protected draggableCheck(e: egret.TouchEvent){
        if(e.stageY > this._maxYPos || e.stageY < this._minYPos)
         return;
        this.y = e.stageY;
      }

      protected draggableEnd(e: egret.TouchEvent){
        this._endYPos = e.stageY;
      }
    }
  }
}
