namespace we {
  export namespace ui {
    export class BetChipSetGridItemRenderer extends ui.ItemRenderer {
      private _isSelected: boolean;
      public itemIndex: number;

      public static STATE_NORMAL: number = 0;
      public static STATE_FOCUS: number = 1;

      protected _holderState: number = 0;
      public content: eui.Group;

      protected _betChip: BetChip;
      protected _betChipHeight: number = 56;
      protected _betChipWidth: number = 70;

      protected get betChipSetGrid(): BetChipSetGrid {
        if (this.parent) {
          return this.parent.parent as BetChipSetGrid;
        }
        return null;
      }

      public constructor() {
        super();
        this._betChip = new BetChip(0);
        this.once(eui.UIEvent.ADDED_TO_STAGE, this.setSize, this);
        this.addChild(this._betChip);
        mouse.setButtonMode(this._betChip, true);
      }

      protected setSize() {
        this.height = this.betChipSetGrid ? this.betChipSetGrid.betChipHeight : this._betChipHeight;
        this.width = this.betChipSetGrid ? this.betChipSetGrid.betChipWidth : this._betChipWidth;
        this._betChip.verticalCenter = 0;
        this._betChip.horizontalCenter = 0;
        this._betChip.scaleX = 0.85;
        this._betChip.scaleY = 0.85;
        this._betChip.labelSize = 64;
      }

      public itemDataChanged() {
        super.itemDataChanged();
        if (this.itemData) {
          const type = this.selected ? we.core.ChipType.FLAT : we.core.ChipType.PERSPECTIVE;
          this._betChip.setValue(this.itemData, this.itemIndex, type);
          this._betChip.index = this.itemIndex;
        }
      }

      public get selected(): boolean {
        return this._isSelected;
      }

      public set selected(value: boolean) {
        if (this._isSelected === value) {
          return;
        }
        // update chip face
        if (this.itemData) {
          this._betChip.type = value ? we.core.ChipType.FLAT : we.core.ChipType.PERSPECTIVE;
        }
        this._isSelected = value;
        this.invalidateState();
      }
    }
  }
}
