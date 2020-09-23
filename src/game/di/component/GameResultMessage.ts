namespace we {
  export namespace di {
    export class GameResultMessage extends ui.GameResultMessage implements ui.IGameResultMessage {
      public constructor() {
        super();
      }
      public showResult(gameType: core.GameType, resultData: any) {
        this._dbClass = 'sicbo';
        super.showResult(gameType, resultData);
      }

      protected startAnim(gameType: core.GameType, resultData: any) {
        const { gameData, winAmount } = resultData;
        const { dice1, dice2, dice3, size, odd, tie } = <di.GameData>gameData;

        const diceresult = [dice1, dice2, dice3];
        console.log('diceresult', diceresult);
        console.log('size', size);
        console.log('tie x', tie);
        const isIdentical = tie === 1;
        console.log('isIdentical', isIdentical);
        console.log('this._display.armature', this._display.armature);
        console.log('gameData', gameData);
        this._display.armature.eventDispatcher.addDBEventListener(
          dragonBones.EventObject.COMPLETE,
          () => {
            this.visible = false;
          },
          this
        );

        logger.l(utils.LogTarget.DEBUG, dice1, dice2, dice3, size, odd);

        const total = isNaN((gameData as di.GameData).total) ? dice1 + dice2 + dice3 : (gameData as di.GameData).total;

        console.log('total', total);
        let anim = 'ani_result_';
        let txtSlot = null;
        let isWin = false;

        // if (isNaN(winAmount)) {
        //   anim += 'no_bets';
        // } else if (winAmount <= 0) {
        //   anim += 'loss';
        //   txtSlot = 'loss_txt';
        // } else {
        //   anim += 'win';
        //   txtSlot = 'L1_txt';
        //   isWin = true;
        // }
        if (isNaN(winAmount)) {
          anim += 'no_bets';
          console.log('no_bets');
          if (isIdentical) {
            anim += '_identical';
            console.log('_identical');
          }
          // if (!isIdentical) {
          //   console.log('not _identical');
          // }
        } else if (winAmount <= 0) {
          anim += 'loss';
          txtSlot = 'credit_loss';
          console.log('loss');
          if (isIdentical) {
            anim += '_identical';
            console.log('_identical');
          }
          // if (!isIdentical) {
          //   console.log('not _identical');
          // }
        } else if (winAmount > 0) {
          anim += 'win';
          txtSlot = 'credit_win';
          console.log('win');
          isWin = true;
          if (isIdentical) {
            anim += '_identical';
            console.log('_identical');
          }
          // if (!isIdentical) {
          //   console.log('not _identical');
          // }
        }

        this.visible = true;
        this._display.animation.play(anim, 1);

        const diceResults = [dice1, dice1, dice2, dice3];
        for (let i = 1; i <= 3; i += 1) {
          // const slot = this._display.armature.getSlot(`dice_${i + (isWin ? 6 : 9)}`);
          const test = `dice${i}${isWin ? '_win' : '_loss'}`;
          console.log('dice', test);
          const slot = this._display.armature.getSlot(`dice${i}${isWin ? '_win' : '_loss'}`);
          const img = new eui.Image();
          // img.source = `d_sic_history_lv3_dice-${diceResults[i]}_png`; // RES.getRes(`d_sic_history_lv3_dice-${diceResults[i]}_png`);
          img.source = `dice${diceResults[i]}_png`; // RES.getRes(`d_sic_history_lv3_dice-${diceResults[i]}_png`);

          // cannot use image.width
          img.anchorOffsetX = 50;
          img.anchorOffsetY = 50;
          img.width = 100;
          img.height = 100;
          slot.display = img;
        }

        // const array = [
        //   [isWin ? '15' : '16', 60, total.toString()],
        //   [isWin ? 'red_txt2' : 'red_txt3', 40, size === 1 ? '小' : '大'],
        //   [isWin ? 'blue_txt2' : 'blue_txt3', 40, odd === 1 ? '單' : '雙'],
        // ];
        const array = [
          [isWin ? 'result_win' : 'result_loss', 60, total.toString()],
          [isWin ? 'red_txt_win' : 'red_txt_loss', 40, size === 1 ? '小' : '大'],
          [isWin ? 'blue_txt_win' : 'blue_txt_loss', 40, odd === 1 ? '單' : '雙'],
        ];

        if (isIdentical) {
          const slot = this._display.armature.getSlot('green_txt');
          const r = new eui.Label();
          r.fontFamily = 'Barlow';
          r.size = 40;
          r.text = '圍';
          r.textColor = 0xffffff;
          r.anchorOffsetX = r.width / 2;
          r.anchorOffsetY = r.height / 2;
          slot.display = r;
        }

        for (const [slotName, fontSize, text] of array) {
          const slot = this._display.armature.getSlot(<string>slotName);
          const r = new eui.Label();
          r.fontFamily = 'Barlow';
          r.size = <number>fontSize;
          r.text = <string>text;
          if (fontSize === 60) {
            const shadowFilter: egret.DropShadowFilter = new egret.DropShadowFilter(3, 45, 0x111111, 0.1, 10, 10, 20, egret.BitmapFilterQuality.LOW);
            r.filters = [shadowFilter];
            r.bold = true;
          }
          r.textColor = 0xffffff;
          r.anchorOffsetX = r.width / 2;
          r.anchorOffsetY = r.height / 2;
          slot.display = r;
        }

        if (txtSlot) {
          const slot = this._display.armature.getSlot(txtSlot);
          console.log('slot', slot);
          const r = new eui.Label();
          r.fontFamily = 'Barlow';
          r.size = 60;
          r.text = utils.formatNumber(winAmount);
          const shadowFilter: egret.DropShadowFilter = new egret.DropShadowFilter(3, 45, 0x111111, 0.1, 10, 10, 20, egret.BitmapFilterQuality.LOW);
          r.filters = [shadowFilter];
          r.bold = true;
          console.log('r.text', r.text);
          r.textColor = 0xffffff;
          r.anchorOffsetX = r.width / 2;
          r.anchorOffsetY = r.height / 2;
          r.visible = true;
          // slot.displayIndex = 0;
          slot.display = r;
          console.log('slot.displayIndex', slot.displayIndex);
          console.log('r.stage', r.stage);
        }
      }
    }
  }
}
