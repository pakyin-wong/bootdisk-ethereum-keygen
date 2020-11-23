// TypeScript file
namespace we {
  export namespace ui {
    export class MobileSlideUpMenu extends core.BaseEUI {
      protected _root: eui.Group;

      protected _lblTitle: RunTimeLabel;
      protected _backBtnGroup: eui.Group;
      protected _lblBackButton: RunTimeLabel;
      protected _btnClose: egret.DisplayObject;

      protected _touchArea: eui.Component;

      protected _scroller: eui.Scroller;
      protected _content: eui.Group;

      protected _pageStack: MobileSlideUpMenuPage[];
      protected _currentPage: MobileSlideUpMenuPage;

      public expandHeight: number = 1966;
      public collapseHeight: number = 1343;
      public tweenDuration: number = 200;

      constructor() {
        super('SlideUpMenuSkin', false);
        this._pageStack = [];
      }

      protected mount() {
        this._btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hide, this);
        this._root.y = this.expandHeight;

        this._root.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this._scroller.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onScrollerTouchBegin, this);
        // this._scroller.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onScrollerTouchEnd, this);
      }

      protected destroy() {
        super.destroy();
      }

      public show() {
        // tween root
        this.tweenTo(this.expandHeight - this.collapseHeight);
      }

      public hide() {
        egret.Tween.removeTweens(this._root);
        if (this._root.y >= this.expandHeight) {
        } else {
          const targetY = this._root.y > this.collapseHeight ? this.collapseHeight : this.expandHeight;
          egret.Tween.get(this._root).to({ y: targetY }, this.tweenDuration);
        }
      }

      public setPage(page: MobileSlideUpMenuPage) {
        // clear previous pages
        if (this._currentPage) {
          this._currentPage.exitPage();
        }
        this._content.removeChildren();
        this._pageStack = [];

        // add page to stack and add to _content
        this._pageStack.push(page);
        this._content.addChild(page);
        this._currentPage = page;
        this._currentPage.left = 0;
        this._currentPage.right = 0;
        this._currentPage.enterPage();
      }

      public pushPage(page: MobileSlideUpMenuPage) {
        if (this._currentPage) {
          this._currentPage.exitPage();
        }
        this._content.removeChildren();
        this._pageStack.push(page);
        this._content.addChild(page);
        this._currentPage = page;
        this._currentPage.left = 0;
        this._currentPage.right = 0;
        this._currentPage.enterPage();
      }

      public popPage() {
        if (this._pageStack.length > 1) {
          this._currentPage.exitPage();
          this._content.removeChildren();
          const page = this._pageStack.pop();
          this._content.addChild(page);
          this._currentPage = page;
          this._currentPage.left = 0;
          this._currentPage.right = 0;
          this._currentPage.enterPage();
        }
      }

      protected _startY: number;
      protected _prevTouchY: number;
      protected _startPosY: number;
      protected _startHeight: number;
      protected _diff: number;
      protected _velocity: number;
      protected onTouchBegin(evt: egret.TouchEvent) {
        this._root.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this._root.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this._root.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd, this);
        this._root.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);

        this._startY = evt.stageY;
        this._prevTouchY = evt.stageY;
        this._startPosY = this._root.y;
        this._startHeight = this._root.height;
        this._diff = 0;
        this._velocity = 0;
      }

      protected onTouchMove(evt: egret.TouchEvent) {
        if (this._isScrollerTouched && this._scroller.viewport.scrollV >= 20) {
          return;
        }
        const touchY = evt.stageY;
        this._diff = touchY - this._startY;
        this._velocity = touchY - this._prevTouchY;
        this._prevTouchY = evt.stageY;

        this._root.y = Math.max(0, this._startPosY + this._diff);
        this._root.height = Math.min(this._startHeight - this._diff, this.expandHeight);
      }

      protected onTouchEnd(evt: egret.TouchEvent) {
        if (this._isScrollerTouched && this._scroller.viewport.scrollV >= 20) {
          return;
        }
        const tempY = this._root.y;
        const expandDiff = tempY;
        const collapseDiff = Math.abs(tempY - (this.expandHeight - this.collapseHeight));
        const closeDiff = Math.abs(tempY - this.expandHeight);
        const minDiff = Math.min(Math.min(collapseDiff, expandDiff), closeDiff);

        if (Math.abs(this._velocity) > 20) {
          if (this._velocity > 0) {
            // tween down for one level
            switch (minDiff) {
              case expandDiff:
                this.tweenTo(this.expandHeight - this.collapseHeight);
                break;
              case collapseDiff:
                this.hide();
                break;
              case closeDiff:
                this.hide();
                break;
            }
          } else {
            // tween up for one level if applicable
            switch (minDiff) {
              case expandDiff:
                this.tweenTo(0);
                break;
              case collapseDiff:
                this.tweenTo(0);
                break;
              case closeDiff:
                this.tweenTo(this.expandHeight - this.collapseHeight);
                break;
            }
          }
        } else {
          // snap root position and height
          switch (minDiff) {
            case expandDiff:
              this.tweenTo(0);
              break;
            case collapseDiff:
              this.tweenTo(this.expandHeight - this.collapseHeight);
              break;
            case closeDiff:
              this.hide();
              break;
          }
        }

        this._root.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this._root.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this._root.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd, this);
        this._root.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);

        // const y = this._startPosY + this._diff;
        // const finalY = y > this.expandHeight - y? this.expandHeight : 0;
        // const finalHeight = finalY>0
        // if (y > this.expandHeight - y) {

        // }
      }

      protected tweenTo(y: number) {
        egret.Tween.removeTweens(this._root);
        const targetY = y;
        const targetHeight = this.expandHeight - y;
        egret.Tween.get(this._root).to({ y: targetY, height: targetHeight }, this.tweenDuration);
      }

      protected _isScrollerTouched: boolean = false;
      protected onScrollerTouchBegin(evt: egret.TouchEvent) {
        this._isScrollerTouched = true;
        if (this._root.y > 0 && this._scroller.viewport.scrollV < 0) {
          this._scroller.viewport.scrollV = 0;
          evt.preventDefault();
        }
      }
      protected onScrollerTouchMove(evt: egret.TouchEvent) {
        if (this._root.y > 0 && this._scroller.viewport.scrollV < 0) {
          evt.preventDefault();
          this._scroller.viewport.scrollV = 0;
        }
      }
      protected onScrollerTouchEnd(evt: egret.TouchEvent) {
        this._isScrollerTouched = false;
        if (this._root.y > 0 && this._scroller.viewport.scrollV < 0) {
          evt.preventDefault();
          this._scroller.viewport.scrollV = 0;
        }
      }
      protected onScrollerTouchCancel(evt: egret.TouchEvent) {
        if (this._root.y > 0 && this._scroller.viewport.scrollV < 0) {
          evt.preventDefault();
          this._scroller.viewport.scrollV = 0;
        }
      }
    }
  }
}
