namespace we {
  export namespace ui {
    export interface IOverlayToggleOpt {
      class: string;
      args?: any[];
    }

    export class Overlay extends core.BaseEUI {
      private _overlayMask: egret.Shape;
      private _onShowItem: Panel;
      private _onShowItemClass: string;

      public constructor() {
        super();
        this._overlayMask = new egret.Shape();
      }

      protected mount() {
        this.width = this.stage.stageWidth;
        this.height = this.stage.stageHeight;
        this._overlayMask.graphics.beginFill(0x000000, 0.7);
        this._overlayMask.graphics.drawRect(0, 0, this.width, this.height);
        this._overlayMask.graphics.endFill();
        this.addListeners();
      }

      protected addListeners() {
        dir.evtHandler.$addListener(core.Event.TOGGLE_OVERLAY_PANEL, this.onToggle, this);
      }

      protected onToggle(e: egret.Event) {
        let panel: Panel;
        try {
          const opt: IOverlayToggleOpt = e.data;
          panel = new we.overlay[opt.class](...opt.args);
        } catch (e) {
          logger.l(`panel ${e.data} defined error`, e.data);
          return;
        }

        this.show(panel, e.data);
      }

      public async show(item: Panel, opt: IOverlayToggleOpt) {
        if (this._onShowItem != null && this._onShowItemClass === opt.class && this._onShowItemClass !== '') {
          return;
        }

        if (this._onShowItem) {
          this.removeItem();
        } else {
          this.removeChildren();
          this.addChild(this._overlayMask);
          this._overlayMask.alpha = 0;
          egret.Tween.removeTweens(this._overlayMask);
          egret.Tween.get(this._overlayMask).to({ alpha: 1 }, 250);
          this.stage['inFocus'] = true;
        }

        this.addItem(item, opt);
      }

      public hide() {
        this.removeItem();
        this.fadeout();
      }

      private fadeout() {
        egret.Tween.removeTweens(this._overlayMask);
        egret.Tween.get(this._overlayMask)
          .to({ alpha: 0 }, 250)
          .call(() => {
            this.removeChildren();
          }, this);

        this.stage['inFocus'] = false;
      }

      private addItem(item: Panel, opt: IOverlayToggleOpt) {
        this._onShowItem = item;
        this._onShowItemClass = opt.class;
        this._onShowItem.isPoppable = true;
        this._onShowItem.dismissOnClickOutside = false;
        this._onShowItem.horizontalCenter = 0;
        this._onShowItem.verticalCenter = 0;
        // this._onShowItem.x = (this._overlayMask.width - this._onShowItem.width) * 0.5;
        // this._onShowItem.y = (this._overlayMask.height - this._onShowItem.height) * 0.5;
        this._onShowItem.once('close', this.onItemClose, this);
        this.addChild(this._onShowItem);
        this._onShowItem.show();
      }

      private async removeItem() {
        const item = this._onShowItem;
        item.removeEventListener('close', this.onItemClose, this);
        this._onShowItem = null;
        this._onShowItemClass = '';
        await item.hide();
        item.parent && item.parent.removeChild(item);
      }

      private onItemClose() {
        const item = this._onShowItem;
        item.removeEventListener('close', this.onItemClose, this);
        this._onShowItem = null;
        this._onShowItemClass = '';
        this.fadeout();
      }

      public close() {
        this.onItemClose();
      }
    }
  }
}
