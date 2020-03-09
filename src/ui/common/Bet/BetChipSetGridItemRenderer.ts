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
      protected _labelSize: number = 30;
      protected _clipChipHeightPortion: number = 0.85;
      protected _flatChipHeightPortion: number = 1.2;

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

        this._betChipWidth = this.betChipSetGrid ? this.betChipSetGrid.betChipWidth : this._betChipWidth;
        this._betChipHeight = this.betChipSetGrid ? this.betChipSetGrid.betChipHeight : this._betChipHeight;

        this._betChip.height = this._betChipHeight;
        this._betChip.width = this._betChipWidth;
        this._betChip.verticalCenter = 0;
        this._betChip.horizontalCenter = 0;
        this._betChip.scaleX = 0.85;
        this._betChip.scaleY = 0.85;
        this._betChip.labelSize = this.betChipSetGrid ? this.betChipSetGrid.labelSize : this._labelSize;
        this._clipChipHeightPortion = this.betChipSetGrid ? this.betChipSetGrid.clipChipHeightPortion : this._clipChipHeightPortion;
        this._flatChipHeightPortion = this.betChipSetGrid ? this.betChipSetGrid.flatChipHeightPortion : this._flatChipHeightPortion;
        if (!this._flatChipHeightPortion) {
          logger.l('missing value!!');
        }
      }

      public itemDataChanged() {
        super.itemDataChanged();
        if (this.itemData) {
          const type = this.selected ? we.core.ChipType.FLAT : we.core.ChipType.PERSPECTIVE;
          this._betChip.setValue(this.itemData, this.itemIndex, type);
          this._betChip.index = this.itemIndex;
          switch (type) {
            case we.core.ChipType.FLAT:
              this._betChip.height = this._betChipHeight * this._flatChipHeightPortion;
              break;
            case we.core.ChipType.PERSPECTIVE:
              this._betChip.height = this._betChipHeight * this._clipChipHeightPortion;
              break;
          }
          if (this._betChip.height === 228) {
            logger.l('228!!');
          }
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
          switch (this._betChip.type) {
            case we.core.ChipType.FLAT:
              this._betChip.height = this._betChipHeight * this._flatChipHeightPortion;
              break;
            case we.core.ChipType.PERSPECTIVE:
              this._betChip.height = this._betChipHeight * this._clipChipHeightPortion;
              break;
          }
          if (this._betChip.height === 228) {
            logger.l('228!!');
          }
        }
        this._isSelected = value;
        this.invalidateState();
      }
    }
  }
}
