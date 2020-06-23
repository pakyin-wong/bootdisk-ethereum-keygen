// TypeScript file
namespace we {
  export namespace lo {
    export class SSCTraditionalBettingPanel extends ABettingPanel {
      protected _buttonGroup: eui.Group;

      protected _bigTagsGroup: eui.Group;
      protected _smallTagsGroup: eui.Group;

      protected bigTagsArray: any[];
      protected smallTagsArray: any[];

      protected currentBigTagIndex: number = 0;
      protected currentSmallTagIndex: number = 0;
      private currentBetTable;

      protected _buttons;

      private _multipleGroup: eui.Group;
      private _imgMultiple: ui.RoundRectShape;
      private _multipleValue: number;
      private _lblMultipleValue: ui.RunTimeLabel;
      private _lblMultipleTitle: ui.RunTimeLabel;
      private _buttonAdd;
      private _buttonMinus;

      private _dollarGroup: eui.Group;
      private _dollarValue: number;
      private _lblDollar: ui.RunTimeLabel;

      private _winInstructGroup: eui.Group;
      private _lblwinInstruct: ui.RunTimeLabel;

      constructor(skin: string = null) {
        super(skin);
        this.skinName = 'skin_desktop.ssc.SSCTraditionalBettingPanel';
      }

      protected childrenCreated() {
        super.childrenCreated();
        this.init();
      }

      protected mount() {}

      protected init() {
        this.createBigTags();
        // this.createSmallTags();
        // this.initCurrentButtonPanel();
      }

      // Big Tags Related
      protected createBigTags() {
        this.bigTagsArray = [];
        this.currentBigTagIndex = 0;

        for (let i = 0; i < Object.keys(SelectionMapping).length; i++) {
          const obj = SelectionMapping[Object.keys(SelectionMapping)[i]];

          const bigTag: eui.Group = new eui.Group();
          bigTag.width = 117;
          bigTag.height = 60;
          bigTag.name = obj['name'];
          bigTag.touchEnabled = true;
          bigTag.touchChildren = false;

          const img: eui.Image = new eui.Image();
          img.width = 117;
          img.height = 60;
          img.source = ImageMapping.BIGTAG_NORMAL;
          bigTag.addChild(img);

          const lbl: ui.RunTimeLabel = new ui.RunTimeLabel();
          // lbl.text = i18n.t(SelectionMapping[i].name);
          lbl.text = obj['name'];
          lbl.size = 20;
          lbl.textAlign = 'center';
          lbl.verticalAlign = 'middle';
          lbl.width = 117;
          lbl.height = 60;
          bigTag.addChild(lbl);

          this.bigTagsArray.push(bigTag);
          this._bigTagsGroup.addChild(bigTag);
          this._bigTagsGroup.touchChildren = true;
          bigTag.x = i * bigTag.width;
          bigTag.y = 0;
          bigTag.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBigTagClicked, this);
        }

        this.setActiveBigTag();
        this.createSmallTags();
      }

      protected setActiveBigTag() {
        this.clearSmallTags();
        for (let i = 0; i < this.bigTagsArray.length; i++) {
          const img = this.bigTagsArray[i].getChildAt(0) as eui.Image;
          img.source = ImageMapping.BIGTAG_NORMAL;
          if (i === this.currentBigTagIndex) {
            img.source = ImageMapping.BIGTAG_ACTIVE;
          }
        }
      }

      protected onBigTagClicked(e: egret.TouchEvent) {
        for (let i = 0; i < this.bigTagsArray.length; i++) {
          if (e.target === this.bigTagsArray[i]) {
            if (i === this.currentBigTagIndex) {
              return;
            }
            this.currentBigTagIndex = i;
            break;
          }
        }
        this.setActiveBigTag();
        this.createSmallTags();
      }
      // End of Big Tags related

      // Small Tags related
      protected createSmallTags() {
        // this.clearSmallTags();
        this.smallTagsArray = [];
        const currentBigTag = SelectionMapping[Object.keys(SelectionMapping)[this.currentBigTagIndex]];
        const smallTagsHeight = 57;
        const lastRowItemIndex = -1;
        let offset = 0;
        for (let i = 0; i < Object.keys(currentBigTag['type']).length; i++) {
          const currentSmallTag = currentBigTag['type'][Object.keys(currentBigTag['type'])[i]];
          const smallTag = new eui.Group();
          // smallTag.width = env.language === 'en'? SmallTags.LABELWIDTH_EN + 40 : SmallTags.LABELWIDTH_CN + 40;
          smallTag.width = env.language === 'en' ? SmallTags.LABELWIDTH_EN + 40 : SmallTags.LABELWIDTH_EN + 40;
          smallTag.height = 57;
          smallTag.touchEnabled = true;
          smallTag.touchChildren = false;

          const lbl = new ui.RunTimeLabel();
          // lbl.text = i18n.t(currentSmallTag["name"]);
          lbl.text = currentSmallTag['name'];
          lbl.alpha = 0.7;
          // lbl.width = env.language === 'en'? SmallTags.LABELWIDTH_EN : SmallTags.LABELWIDTH_CN;
          lbl.width = env.language === 'en' ? SmallTags.LABELWIDTH_EN : SmallTags.LABELWIDTH_EN;
          lbl.height = 57;
          lbl.size = 18;

          smallTag.addChild(lbl);
          this._smallTagsGroup.addChild(smallTag);
          this.smallTagsArray.push(smallTag);
          smallTag.x = 24 + offset + i * smallTag.width;
          smallTag.y = 0;
          smallTag.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSmallTagClicked, this);

          if (currentBigTag['seperateLine']) {
            for (let k = 0; k < currentBigTag['seperateLine'].length; k++) {
              if (currentBigTag.seperateLine[k] === i) {
                const shape = new egret.Shape();
                shape.x = offset + 40 + (i + 1) * smallTag.width;
                shape.graphics.beginFill(0xffffff, 0.7);
                shape.graphics.drawRect(0, 0, 1, 30);
                shape.graphics.endFill();
                this._smallTagsGroup.addChild(shape);

                offset += 80;
              }
            }
          }
          // if(smallTag.x > this._smallTagsGroup.width)
          // {
          //   if(lastRowItemIndex < 0)
          //     lastRowItemIndex = i;
          //   this._smallTagsGroup.height = smallTagsHeight * 2;
          //   smallTag.x = 24 + (i - lastRowItemIndex) * smallTag.width;
          //   smallTag.y = smallTagsHeight;
          // }
        }
        this.setActiveSmallTag();
      }

      protected onSmallTagClicked(e: egret.TouchEvent) {
        for (let i = 0; i < this.smallTagsArray.length; i++) {
          if (e.target === this.smallTagsArray[i]) {
            if (i === this.currentSmallTagIndex) {
              return;
            }
            this.currentSmallTagIndex = i;
          }
        }
        this.setActiveSmallTag();
      }

      protected setActiveSmallTag() {
        for (let i = 0; i < this.smallTagsArray.length; i++) {
          const lbl = this.smallTagsArray[i].getChildAt(0) as ui.RunTimeLabel;
          lbl.alpha = 0.7;
          lbl.textFlow = <egret.ITextElement[]>[
            {
              text: lbl.text,
              style: { bold: false, underline: false },
            },
          ];
          if (i === this.currentSmallTagIndex) {
            lbl.alpha = 1;
            lbl.textFlow = <egret.ITextElement[]>[
              {
                text: lbl.text,
                style: { bold: true, underline: true },
              },
            ];
          }
        }
        this.createBetTable();
      }

      protected createBetTable() {
        if(this.currentBetTable){
          this.clearBetTable();
        }
        const currentBigTag = SelectionMapping[Object.keys(SelectionMapping)[this.currentBigTagIndex]];
        const config = currentBigTag['type'][Object.keys(currentBigTag['type'])[this.currentSmallTagIndex]];

        this.currentBetTable = new SSCTraditionalBettingTable(config);
        this._buttonGroup.addChild(this.currentBetTable);
        this.currentBetTable.x = this.currentBetTable.y = 0;
        this._buttonGroup.touchChildren = true;
      }

      protected clearBetTable() {
        this._buttonGroup.removeChildren();
      }

      protected clearSmallTags() {
        this.currentSmallTagIndex = 0;
        this._smallTagsGroup.removeChildren();
      }
    }
  }
}
