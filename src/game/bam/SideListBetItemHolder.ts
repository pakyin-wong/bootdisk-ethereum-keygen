namespace we {
  export namespace bam {
    export class SideListBetItemHolder extends ui.TableListItemHolder {
      constructor() {
        super();
        // this.initDisplayItem();
      }

      protected initDisplayItem() {
        super.initDisplayItem();

        if (!this.tableInfo || this._displayItem) {
          return;
        }
        const BAgametype = this.tableInfo.gametype;
        const listItem = new we.ui.SideListBetItem('SideListBetItemSkin');
        if (BAgametype === core.GameType.BAM) {
          listItem.itemInitHelper = new we.bam.SideListItemInitHelper();
        } else {
          listItem.itemInitHelper = new we.bamb.SideListItemInitHelper();
        }
        this._displayItem = listItem;
        this.setDisplayItem(this._displayItem);
      }
    }
  }
}
