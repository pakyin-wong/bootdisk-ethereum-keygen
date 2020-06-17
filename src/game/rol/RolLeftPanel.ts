namespace we {
  export namespace rol {
    export class RolLeftPanel extends ro.RoLeftPanel {
      protected pageRadioBtn4: eui.RadioButton;
      protected _coinGroup: eui.Group;

      public constructor(skin?: string) {
        super(skin ? skin : env.isMobile ? '' : 'RolLeftPanel');
      }

      protected setRadioButtons() {
        this._radioButtons = [this.pageRadioBtn1, this.pageRadioBtn2, this.pageRadioBtn3, this.pageRadioBtn4];
      }

      public changeLang() {
        super.changeLang();
        this.pageRadioBtn4['labelDisplayDown']['text'] = this.pageRadioBtn4['labelDisplayUp']['text'] = i18n.t('roulette.luckyNumber');
      }

      protected init() {
        super.init();
        this.pageRadioBtn4.addEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);
      }

      protected createLuckyCoinAnim() {
        const skeletonData = RES.getRes(`roulette_w_game_result_ske_json`);
        const textureData = RES.getRes(`roulette_w_game_result_tex_json`);
        const texture = RES.getRes(`roulette_w_game_result_tex_png`);
        const factory = new dragonBones.EgretFactory();
        factory.parseDragonBonesData(skeletonData);
        factory.parseTextureAtlasData(textureData, texture);
        return factory.buildArmatureDisplay('Draw_Number_Effect');
      }

      public updateLuckyNumbers() {
        this._coinGroup.removeChildren();

        if (this.tableInfo && this.tableInfo.data && this.tableInfo.data.luckynumber) {
          let x = 60 * (5 - Object.keys(this.tableInfo.data.luckynumber).length) + 10;
          Object.keys(this.tableInfo.data.luckynumber).map((key, index) => {
            const imgCoin = new LuckyCoin();
            imgCoin.odd = this.tableInfo.data.luckynumber[key];
            imgCoin.value = +key;
            imgCoin.anchorOffsetX = 80;
            imgCoin.anchorOffsetY = 80;

            const chipSlotGroup = new eui.Group();
            chipSlotGroup.addChild(imgCoin);

            const coinAnim = this.createLuckyCoinAnim();
            coinAnim.x = x;
            coinAnim.y = 10;
            coinAnim.width = 125;
            coinAnim.height = 230;
            x += 130;

            const chipSlot = coinAnim.armature.getSlot('chips');
            chipSlot.display = chipSlotGroup;

            if (this._chipLayer) {
              const betDetails = this._chipLayer.getConfirmedBetDetails();
              if (betDetails) {
                betDetails.map((detail, index) => {
                  if (detail && detail.field) {
                    const f = this.fieldToValue(detail.field);
                    if (key === f) {
                      imgCoin.amount = detail.amount / 100;
                    }
                  }
                });
              }
            }

            let color = 'Green';

            switch (we.ro.RACETRACK_COLOR[imgCoin.value]) {
              case we.ro.Color.GREEN:
                color = 'Green';
                break;
              case we.ro.Color.RED:
                color = 'Red';
                break;
              case we.ro.Color.BLACK:
              default:
                color = 'Black';
            }
            this._coinGroup.addChild(coinAnim);
            coinAnim.animation.play(`Draw_Number_${color}_in`, 1);
          });
        }
      }

      public clearLuckyNumbers() {
        this._coinGroup.removeChildren();
      }

      protected fieldToValue(fieldName: string) {
        if (!fieldName) {
          return null;
        }
        if (fieldName.indexOf('DIRECT_') === -1) {
          return null;
        }
        const result = fieldName.split('DIRECT_');
        if (result && result[1]) {
          return result[1];
        }
        return null;
      }
    }
  }
}
