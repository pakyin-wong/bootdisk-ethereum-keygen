/* tslint:disable triple-equals */
namespace we {
  export namespace core {
    // base control class that hold and manage the basic item in Ba Item
    export class BaseGameScene extends core.BaseScene {
      protected _header: egret.DisplayObjectContainer;
      // protected _betRelatedGroup: eui.Group;

      protected _tableLayer: ui.TableLayer;
      protected _chipLayer: ui.ChipLayer;
      protected _betChipSet: ui.BetChipSet;
      protected _alwaysShowResult = false;
      protected _resultDisplay: ui.IResultDisplay;
      protected _resultMessage: ui.IGameResultMessage;
      protected _message: ui.InGameMessage;
      protected _expiredMessage: ui.InGameMessage;
      protected _dropdown: live.BetLimitDropdown;
      protected _betRelatedGroup: ui.BetRelatedGroup;

      protected _undoStack: we.utils.UndoStack = new we.utils.UndoStack();

      // protected _confirmButton: eui.Button;
      // protected _repeatButton: ui.BaseImageButton;
      // protected _cancelButton: ui.BaseImageButton;
      // protected _doubleButton: ui.BaseImageButton;
      // protected _undoButton: ui.BaseImageButton;

      protected _tableId: string;
      protected _tableInfo: data.TableInfo;
      protected _betDetails: data.BetDetail[];
      protected _previousState: number;
      protected _gameData: we.data.GameData;
      // protected _timer: ui.CountdownTimer;

      protected _btnBack: egret.DisplayObject;
      protected _lblRoomInfo: egret.DisplayObject;
      protected _lblRoomNo: ui.RunTimeLabel;

      protected _gameBar: ui.GameBar;
      protected _bgImg: eui.Image;
      protected _video: egret.FlvVideo;

      protected _gameRoundCountWithoutBet: number = 0;

      // this for desktop
      // protected _tableInfoWindow: ui.TableInfoPanel;

      // protected _leftGamePanel: BaseGamePanel;
      // protected _rightGamePanel: BaseGamePanel;

      public get previousState() {
        return this._previousState;
      }
      public get tableInfo() {
        return this._tableInfo;
      }

      constructor(data: any) {
        super(data);
        this._tableId = data.tableid;
        this.setSkinName();
      }

      protected setSkinName() {
        // this.skinName = utils.getSkinByClassname('BaccaratScene');
      }

      protected mount() {
        super.mount();
        if (!env.isMobile) {
          mouse.setButtonMode(this._btnBack, true);
          if (this._betRelatedGroup && this._betRelatedGroup._confirmButton) { mouse.setButtonMode(this._betRelatedGroup._confirmButton, true); }
        }

        this._video = dir.videoPool.get();
        this._video.setBrowser(env.UAInfo.browser.name);
        // this._video.width = this.stage.stageWidth;
        // this._video.height = this.stage.stageHeight;
        // this._video.load('wss://hk.webflv.com:8000/live/33.flv');
        // this._video.load('//210.61.148.50:8000/live/test.flv');
        this._video.load('https://gcp.weinfra247.com:443/live/720.flv');

        dir.audioCtr.video = this._video;
        this.touchEnabled = true;
      }

      public onEnter() {
        super.onEnter();
        this.setupTableInfo();

        this.initChildren();

        // Below two must be run after the component initialization finished
        this.addEventListeners();
        this.updateGame(true);
      }

      public onExit() {
        super.onExit();
        this.stage.frameRate = env.frameRate;
        dir.audioCtr.video = null;
        this._video.stop();
        dir.videoPool.release(this._video);
        this._chipLayer.getSelectedChipIndex = null;
        // this._timer.stop();
        this.removeEventListeners();
        this.removeChildren();
      }
      public async onFadeEnter() {}
      public async onFadeExit() {}

      protected getSelectedBetLimitIndex() {
        return env.currentSelectedBetLimitIndex;
      }

      protected initChildren() {
        this.addChild(this._video);
        this.setChildIndex(this._video, 0);
        // this.playVideo();
        const aspect = 16 / 9;
        const ratio = this.stage.stageWidth / this.stage.stageHeight;
        this._video.x = this.stage.stageWidth * 0.5;
        this._video.y = this.stage.stageHeight * 0.5;
        this._video.width = ratio < 1 ? this.stage.stageHeight * aspect : this.stage.stageWidth;
        this._video.height = ratio < 1 ? this.stage.stageHeight : this.stage.stageWidth / aspect;
        this._video.$anchorOffsetX = this._video.width * 0.5;
        this._video.$anchorOffsetY = this._video.height * 0.5;
        if (!env.videoOpen) {
          this.stopVideo();
        } else {
          this.playVideo();
        }

        // this._video.play();
        // this.stage.frameRate = 60;
        // this._bgImg.visible = false;

        if (this._gameBar) {
          this._gameBar.targetScene = this;
        }

        if (env.betLimits) {
          this.initDenom();
          this.initBettingTable();
        }

        this._lblRoomNo.renderText = () => `${i18n.t('gametype_' + we.core.GameType[this._tableInfo.gametype])} ${env.getTableNameByID(this._tableId)}`;
        if (this._betRelatedGroup) { this._betRelatedGroup.changeBtnState(false); }

        // if (this._tableInfoWindow) {
        //   this._tableInfoWindow.setToggler(this._lblRoomInfo);
        //   this._tableInfoWindow.setValue(this._tableInfo);
        // }

        // this._leftGamePanel.setTableInfo(this._tableInfo);
        // this._rightGamePanel.setTableInfo(this._tableInfo);
      }

      protected initDenom() {
        const denominationList = env.getBetLimitSet('Live', this.getSelectedBetLimitIndex()).chips;

        if (this._betChipSet) {
          this._betChipSet.init(5, denominationList);
        }
      }

      protected initBettingTable() {
        const denominationList = env.getBetLimitSet('Live', this.getSelectedBetLimitIndex()).chips;
        if (this._tableLayer) {
          this._tableLayer.init();
        }

        if (this._chipLayer) {
          this._chipLayer.denomList = denominationList;
          this._chipLayer.type = we.core.BettingTableType.NORMAL;
          this._chipLayer.undoStack = this._undoStack;
          this._chipLayer.tableLayer = this._tableLayer;
          this._chipLayer.betChipSet = this._betChipSet;
          this._chipLayer.init();
          this._chipLayer.getSelectedBetLimitIndex = this.getSelectedBetLimitIndex;
          this._chipLayer.getSelectedChipIndex = () => this._betChipSet.selectedChipIndex;
          this._chipLayer.onConfirmPressed = this.onConfirmPressed.bind(this);
        }
      }

      protected setupTableInfo() {
        const tableInfo = env.tableInfos[this._tableId];
        let time = moment().format('HH:mm:ss')
        console.log('current time',time)
        console.log('setupTableInfo,',tableInfo)
        this.setData(tableInfo);
      }

      public setData(tableInfo: data.TableInfo) {
        this._tableId = tableInfo.tableid;
        this._tableInfo = tableInfo;
        if (this._chipLayer) {
          this._chipLayer.tableId = this._tableInfo.tableid;
        }
        this._betDetails = this._tableInfo.bets;
        this._gameData = this._tableInfo.data;
        this._previousState = this._gameData ? this._gameData.previousstate : null;
        /*if (this._label) {
          this._label.renderText = () => `${i18n.t('gametype_' + we.core.GameType[this._tableInfo.gametype])} ${env.getTableNameByID(this._tableId)}`;
        }*/
      }

      protected addEventListeners() {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.addEventListener(core.Event.PLAYER_BET_RESULT, this.onBetResultReceived, this);

        dir.evtHandler.addEventListener(core.Event.TABLE_INFO_UPDATE, this.onTableInfoUpdate, this);
        dir.evtHandler.addEventListener(core.Event.ROADMAP_UPDATE, this.onRoadDataUpdate, this);
        dir.evtHandler.addEventListener(core.Event.TABLE_BET_INFO_UPDATE, this.onTableBetInfoUpdate, this);
        dir.evtHandler.addEventListener(core.Event.PLAYER_BET_INFO_UPDATE, this.onBetDetailUpdate, this);
        dir.evtHandler.addEventListener(core.Event.BET_LIMIT_CHANGE, this.onBetLimitUpdate, this);
        dir.evtHandler.addEventListener(core.Event.MATCH_GOOD_ROAD_DATA_UPDATE, this.onMatchGoodRoadUpdate, this);

        if (this._chipLayer) {
          this._chipLayer.addEventListener('onUnconfirmBet', this.changeBetRelatedGroupBtn, this);
          this._chipLayer.addEventListener('resetUnconfirmBet', this.resetBetRelatedGroupBtn, this);
          this._chipLayer.addEventListener(core.Event.GENERAL_BET_FAIL, this.generalBetFail, this);
          this._chipLayer.addEventListener(core.Event.EXCEED_TABLE_LIMIT, this.exceedTableLimit, this);
          this._chipLayer.addEventListener(core.Event.INSUFFICIENT_BALANCE, this.insufficientBalance, this);
          this._chipLayer.addEventListener(core.Event.EXCEED_BET_LIMIT, this.exceedBetLimit, this);
        }
        // if (this._confirmButton) {
        //   this._confirmButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirmPressed, this, true);
        // }
        // if (this._repeatButton) {
        //   this._repeatButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRepeatPressed, this, true);
        // }
        // if (this._doubleButton) {
        //   this._doubleButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDoublePressed, this, true);
        // }
        // if (this._undoButton) {
        //   this._undoButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUndoPressed, this, true);
        // }
        // if (this._cancelButton) {
        //   this._cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelPressed, this, true);
        // }
        if (this._btnBack) {
          this._btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backToLobby, this);
        }
        if (this._betRelatedGroup) {
          this._betRelatedGroup.addEventListener('ON_CONFIRM_PRESS', this.onConfirmPressed, this);
          this._betRelatedGroup.addEventListener('ON_CANCEL_PRESS', this.onCancelPressed, this);
          this._betRelatedGroup.addEventListener('ON_REPEAT_PRESS', this.onRepeatPressed, this);
          this._betRelatedGroup.addEventListener('ON_DOUBLE_PRESS', this.onDoublePressed, this);
          this._betRelatedGroup.addEventListener('ON_UNDO_PRESS', this.onUndoPressed, this);
        }
      }

      public insufficientBalance() {
        if (this._message) {
          this._message.showMessage(ui.InGameMessage.ERROR, i18n.t('game.insufficientBalance'));
        }
      }

      public exceedTableLimit() {
        if (this._message) {
          this._message.showMessage(ui.InGameMessage.ERROR, i18n.t('game.exceedTableLimit'));
        }
      }

      public generalBetFail() {
        if (this._message) {
          this._message.showMessage(ui.InGameMessage.ERROR, i18n.t('game.generalBetError'));
        }
      }

      public exceedBetLimit(evt: egret.Event) {
        if (this._message) {
          if (evt && evt.data && evt.data.exceedLower) {
            this._message.showMessage(ui.InGameMessage.ERROR, i18n.t('game.exceedBetLowerLimit'));
          } else {
            this._message.showMessage(ui.InGameMessage.ERROR, i18n.t('game.exceedBetUpperLimit'));
          }
        }
      }

      protected removeEventListeners() {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.removeEventListener(core.Event.PLAYER_BET_RESULT, this.onBetResultReceived, this);

        dir.evtHandler.removeEventListener(core.Event.TABLE_INFO_UPDATE, this.onTableInfoUpdate, this);
        dir.evtHandler.removeEventListener(core.Event.ROADMAP_UPDATE, this.onRoadDataUpdate, this);
        dir.evtHandler.removeEventListener(core.Event.TABLE_BET_INFO_UPDATE, this.onTableBetInfoUpdate, this);
        dir.evtHandler.removeEventListener(core.Event.PLAYER_BET_INFO_UPDATE, this.onBetDetailUpdate, this);
        dir.evtHandler.removeEventListener(core.Event.BET_LIMIT_CHANGE, this.onBetLimitUpdate, this);
        dir.evtHandler.removeEventListener(core.Event.MATCH_GOOD_ROAD_DATA_UPDATE, this.onMatchGoodRoadUpdate, this);

        if (this._chipLayer) {
          this._chipLayer.removeEventListener('onUnconfirmBet', this.changeBetRelatedGroupBtn, this);
          this._chipLayer.removeEventListener('resetUnconfirmBet', this.resetBetRelatedGroupBtn, this);
          this._chipLayer.removeEventListener(core.Event.GENERAL_BET_FAIL, this.generalBetFail, this);
          this._chipLayer.removeEventListener(core.Event.EXCEED_TABLE_LIMIT, this.exceedTableLimit, this);
          this._chipLayer.removeEventListener(core.Event.INSUFFICIENT_BALANCE, this.insufficientBalance, this);
          this._chipLayer.removeEventListener(core.Event.EXCEED_BET_LIMIT, this.exceedBetLimit, this);
        }
        // if (this._confirmButton) {
        //   this._confirmButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirmPressed, this, true);
        // }
        // if (this._repeatButton) {
        //   this._repeatButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRepeatPressed, this, true);
        // }
        // if (this._doubleButton) {
        //   this._doubleButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDoublePressed, this, true);
        // }
        // if (this._undoButton) {
        //   this._undoButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUndoPressed, this, true);
        // }
        // if (this._cancelButton) {
        //   this._cancelButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelPressed, this, true);
        // }
        if (this._betRelatedGroup) {
          this._betRelatedGroup.removeEventListener('ON_CONFIRM_PRESS', this.onConfirmPressed, this);
          this._betRelatedGroup.removeEventListener('ON_CANCEL_PRESS', this.onCancelPressed, this);
          this._betRelatedGroup.removeEventListener('ON_REPEAT_PRESS', this.onRepeatPressed, this);
          this._betRelatedGroup.removeEventListener('ON_DOUBLE_PRESS', this.onDoublePressed, this);
          this._betRelatedGroup.removeEventListener('ON_UNDO_PRESS', this.onUndoPressed, this);
        }

        this._btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.backToLobby, this);
      }

      protected changeBetRelatedGroupBtn() {
        if (this._betRelatedGroup) {
          this._betRelatedGroup.changeBtnState(
            true,
            this._chipLayer.getTotalCfmBetAmount(),
            this.tableInfo.prevbets && this.tableInfo.prevroundid && this.tableInfo.prevroundid === this.tableInfo.prevbetsroundid
          );
        }
      }

      protected resetBetRelatedGroupBtn(){
        console.log('test')
          if (this._betRelatedGroup) {
            this._betRelatedGroup.changeBtnState(
              false,
              this._chipLayer.getTotalCfmBetAmount(),
              this.tableInfo.prevbets && this.tableInfo.prevroundid && this.tableInfo.prevroundid === this.tableInfo.prevbetsroundid
            );
          }
      }

      public backToLobby() {
        // dir.sceneCtr.goto('lobby', { page: 'live', tab: 'ba' });
        dir.sceneCtr.goto('lobby', { page: env.currentPage, tab: env.currentTab });
      }

      protected onBetLimitUpdate(evt: egret.Event) {
        const denominationList = env.getBetLimitSet('Live', this.getSelectedBetLimitIndex()).chips;
        if (this._betChipSet) {
          this._betChipSet.resetDenominationList(denominationList);
        }
        if (this._chipLayer) {
          this._chipLayer.denomList = denominationList;
        }
      }

      protected onBetDetailUpdate(evt: egret.Event) {
        const tableInfo = <data.TableInfo> evt.data;
        logger.l(utils.LogTarget.DEBUG, we.utils.getClass(this).toString(), '::onBetDetailUpdate', tableInfo);
        if (tableInfo.tableid === this._tableId) {
          this._betDetails = tableInfo.bets;
          switch (this._gameData.state) {
            case we.core.GameState.BET:
              this.onBetDetailUpdateInBetState();
              break;
            case we.core.GameState.FINISH:
              this.onBetDetailUpdateInFinishState();
            default:
              break;
          }
        }
      }

      protected onMatchGoodRoadUpdate() {}

      protected onTableBetInfoUpdate(evt: egret.Event) {}

      // item clicked
      protected onTouchTap(evt: egret.Event) {}

      protected onBetDetailUpdateInBetState() {
        if (this._betDetails && this._chipLayer) {
          this._chipLayer.updateBetFields(this._betDetails);
          this._message.showMessage(ui.InGameMessage.SUCCESS, i18n.t('baccarat.betSuccess'));
          if (this._betRelatedGroup) {
            this._betRelatedGroup.changeBtnState(
              false,
              this._chipLayer.getTotalCfmBetAmount(),
              this.tableInfo.prevbets && this.tableInfo.prevroundid && this.tableInfo.prevroundid === this.tableInfo.prevbetsroundid
            );
          }
        }
      }
      protected onBetDetailUpdateInFinishState() {
        this._chipLayer.showWinEffect(this._betDetails);
        if (this._betDetails && this._chipLayer) {
          if (this._resultMessage) {
            this.checkResultMessage();
          }
        }
      }

      protected onTableInfoUpdate(evt: egret.Event) {
        if (evt && evt.data) {
          const tableInfo = <data.TableInfo> evt.data;
          if (tableInfo.tableid === this._tableId) {
            // update the scene
            this._tableInfo = tableInfo;
            this._betDetails = tableInfo.bets;
            this._gameData = this._tableInfo.data;
            this._previousState = this._gameData ? this._gameData.previousstate : null;
            this.updateTableInfoRelatedComponents();

            this.updateGame();
          }
        }
      }

      protected updateTableInfoRelatedComponents() {
        // if (this._tableInfoWindow) {
        //   this._tableInfoWindow.setValue(this._tableInfo);
        // }
        // this._leftGamePanel.update();
        // this._rightGamePanel.update();
      }

      protected onBetResultReceived(evt: egret.Event) {
        const result: data.PlayerBetResult = evt.data;
        if (result.success) {
          this.onBetConfirmed();
        }
      }

      public onBetConfirmed() {
        this._chipLayer.resetUnconfirmedBet();
      }

      protected onRoadDataUpdate(evt: egret.Event) {}

      public updateGame(isInit: boolean = false) {
        if (!this._gameData) {
          return;
        }
        switch (this._gameData.state) {
          case core.GameState.IDLE:
            this.setStateIdle(isInit);
            break;
          case core.GameState.BET:
            this.setStateBet(isInit);
            break;
          case core.GameState.DEAL:
            this.setStateDeal(isInit);
            break;
          case core.GameState.PEEK:
            this.setStatePeek(isInit);
            break;
          case core.GameState.PEEK_BANKER:
            this.setStatePeekBanker(isInit);
            break;
          case core.GameState.PEEK_PLAYER:
            this.setStatePeekPlayer(isInit);
            break;
          case core.GameState.FINISH:
            this.setStateFinish(isInit);
            break;
          case core.GameState.REFUND:
            this.setStateRefund(isInit);
            break;
          case core.GameState.SHUFFLE:
            this.setStateShuffle(isInit);
            break;
          default:
            this.setStateUnknown(isInit);
            break;
        }
      }

      protected setStateUnknown(isInit: boolean = false) {
        this.setBetRelatedComponentsEnabled(false);
        this.setResultRelatedComponentsEnabled(false);
      }

      protected setStateIdle(isInit: boolean = false) {
        if (this._previousState !== we.core.GameState.IDLE || isInit) {
          this.setBetRelatedComponentsEnabled(false);
          this.setResultRelatedComponentsEnabled(false);
        }
      }

      protected setStatePeek(isInit: boolean = false) {
        if (this._previousState !== we.core.GameState.PEEK || isInit) {
          this.setBetRelatedComponentsEnabled(false);
          this.setResultRelatedComponentsEnabled(true);
          if (this._betDetails) {
            this._chipLayer.updateBetFields(this._betDetails);
          }
        }
      }

      protected setStatePeekPlayer(isInit: boolean = false) {
        if (this._previousState !== we.core.GameState.PEEK_PLAYER || isInit) {
          this.setBetRelatedComponentsEnabled(false);
          this.setResultRelatedComponentsEnabled(true);

          if (this._betDetails) {
            this._chipLayer.updateBetFields(this._betDetails);
          }
        }
      }

      protected setStatePeekBanker(isInit: boolean = false) {
        if (this._previousState !== we.core.GameState.PEEK_BANKER || isInit) {
          this.setBetRelatedComponentsEnabled(false);
          this.setResultRelatedComponentsEnabled(true);

          if (this._betDetails) {
            this._chipLayer.updateBetFields(this._betDetails);
          }
        }
      }

      protected setStateBet(isInit: boolean = false) {
        if (this._previousState !== we.core.GameState.BET || isInit) {
          this.setBetRelatedComponentsEnabled(true);
          this.setResultRelatedComponentsEnabled(false);
          this._undoStack.clearStack();
          this._resultMessage.clearMessage();

          if (this._chipLayer) {
            this._chipLayer.resetUnconfirmedBet();
            this._chipLayer.resetConfirmedBet();
          }

          if (this._betDetails && this._chipLayer) {
            this._chipLayer.updateBetFields(this._betDetails);
          }
          if (this._betRelatedGroup) {
            this._betRelatedGroup.changeBtnState(
              false,
              this._chipLayer.getTotalCfmBetAmount(),
              this.tableInfo.prevbets && this.tableInfo.prevroundid && this.tableInfo.prevroundid === this.tableInfo.prevbetsroundid
            );
          }
        }

        if (this._previousState !== we.core.GameState.BET) {
          if (this._resultMessage) {
            this._resultMessage.clearMessage();
          }

          if (this._message && !isInit) {
            if (this._gameRoundCountWithoutBet === 3) {
              if (this._expiredMessage) {
                this._message.showMessage(ui.InGameMessage.INFO, i18n.t('game.startBet'), this.showTwoMessage.call(this));
              }
            } else {
              this._message.showMessage(ui.InGameMessage.INFO, i18n.t('game.startBet'));
            }
          }
          this._undoStack.clearStack();
        }
        // update the countdownTimer
        if (this._betRelatedGroup) { this._betRelatedGroup.updateCountdownTimer(this._gameData); }
      }
      protected showTwoMessage() {
        this._expiredMessage.showMessage(ui.InGameMessage.EXPIRED, i18n.t('expiredmessage_text'));
      }
      protected checkRoundCountWithoutBet() {
        if (this.tableInfo.totalBet > 0) {
          this._gameRoundCountWithoutBet = 0;
        } else {
          this._gameRoundCountWithoutBet += 1;
        }

        if (this._gameRoundCountWithoutBet === 3) {
          // <<<<<<< HEAD
          if (env.isMobile) {
            dir.evtHandler.showMessage({
              class: 'MessageDialog',
              args: [
                i18n.t('expiredmessage_text'),
                {
                  dismiss: { text: i18n.t('nav.menu.confirm') },
                },
              ],
            });
          } else {
            this.showInGameMessage();
          }
        }

        if (this._gameRoundCountWithoutBet >= 5) {
          this.backToLobby();
        }
      }

      protected showInGameMessage() {
        if (this._expiredMessage) {
          this._expiredMessage.showMessage(ui.InGameMessage.EXPIRED, i18n.t('expiredmessage_text'));
          // this._message.showMessage(ui.InGameMessage.EXPIRED,i18n.t(''));
        }
      }
      protected setStateDeal(isInit: boolean = false) {
        if (this._previousState !== we.core.GameState.DEAL || isInit) {
          this.setBetRelatedComponentsEnabled(false);
          this.setResultRelatedComponentsEnabled(true);

          if (this._betDetails) {
            this._chipLayer.updateBetFields(this._betDetails);
          }
        }

        if (this._previousState !== we.core.GameState.DEAL) {
          this.checkRoundCountWithoutBet();

          if (this._resultDisplay) {
            this._resultDisplay.reset();
          }

          if (this._previousState === core.GameState.BET && this._message && !isInit) {
            this._message.showMessage(ui.InGameMessage.INFO, i18n.t('game.stopBet'));
          }
        }
        if (this._resultDisplay) {
          this._resultDisplay.updateResult(this._gameData, this._chipLayer, isInit);
        }
      }

      protected setStateFinish(isInit: boolean = false) {
        if (this._previousState !== we.core.GameState.FINISH || isInit) {
          this.setBetRelatedComponentsEnabled(false);
          this.setResultRelatedComponentsEnabled(true);
        }
        if (this._previousState !== we.core.GameState.FINISH) {
          if (this._resultDisplay) {
            this._resultDisplay.updateResult(this._gameData);
          }

          if (this._resultMessage) {
            console.log('no message');
            this.checkResultMessage();
          }
        }
        if (this._betRelatedGroup) { this._betRelatedGroup.changeBtnState(false); }
      }

      protected setStateRefund(isInit: boolean = false) {
        if (this._previousState !== we.core.GameState.REFUND || isInit) {
          this.setBetRelatedComponentsEnabled(false);
          this.setResultRelatedComponentsEnabled(false);
        }
      }

      protected setStateShuffle(isInit: boolean = false) {
        if (this._previousState !== we.core.GameState.SHUFFLE || isInit) {
          this.setBetRelatedComponentsEnabled(false);
          this.setResultRelatedComponentsEnabled(false);
        }
      }

      // protected updateCountdownTimer() {
      //   if (this._timer) {
      //     this._timer.countdownValue = this._gameData.countdown * 1000;
      //     this._timer.remainingTime = this._gameData.countdown * 1000 - (env.currTime - this._gameData.starttime);
      //     this._timer.start();
      //   }
      // }

      protected setBetRelatedComponentsEnabled(enable: boolean) {
        // if (this._timer) {
        //   this._timer.visible = true;
        // }

        if (this._chipLayer) {
          this._chipLayer.setTouchEnabled(enable);
        }
        if (this._tableLayer) {
          this._tableLayer.clearAllHighlights();
        }
        if (this._betChipSet) {
          this._betChipSet.setTouchEnabled(enable);
        }
        // if (this._confirmButton) {
        //   this._confirmButton.touchEnabled = enable;
        // }
        // if (this._cancelButton) {
        //   this._cancelButton.touchEnabled = enable;
        // }
        if (this._betRelatedGroup) {
          this._betRelatedGroup.isTimerVisible = true;
          this._betRelatedGroup.enableConfirm = true;
          this._betRelatedGroup.enableCancel = true;
        }
      }

      protected setResultRelatedComponentsEnabled(enable: boolean) {
        if (this._resultDisplay) {
          this._resultDisplay.visible = this._alwaysShowResult || enable;
        }
      }

      protected hasBet(): boolean {
        if (this._betDetails) {
          for (const betDetail of this._betDetails) {
            if (betDetail.amount > 0) {
              return true;
            }
          }
        }
        return false;
      }

      public checkResultMessage(resultData = null) {
        let totalWin: number = NaN;
        if (!isNaN(this._tableInfo.totalWin)) {
          totalWin = this._tableInfo.totalWin;
        }
        let pass1: boolean = false;
        let pass2: boolean = false;
        switch (this._tableInfo.gametype) {
          case core.GameType.BAC:
          case core.GameType.BAI:
          case core.GameType.BAS:
          case core.GameType.BAM:
          case core.GameType.BAB:
          case core.GameType.DTB:
          case core.GameType.DT:
            pass1 = this._gameData && this._gameData.wintype != 0 && !isNaN(totalWin);
            pass2 = this._gameData && this._gameData.wintype != 0;
            break;
          case core.GameType.RO:
          case core.GameType.ROL:
          case core.GameType.DI:
          case core.GameType.DIL:
          case core.GameType.LW:
            pass1 = this._gameData && this._gameData.state === core.GameState.FINISH && !isNaN(totalWin);
            pass2 = !!this._gameData && this._gameData.state === core.GameState.FINISH;
            break;
          default:
            logger.e(utils.LogTarget.DEBUG, 'No gametype found in ControlItem::checkResultMessage');
            break;
        }

        if (this._tableInfo.totalBet > 0) {
          if (pass1) {
            this._resultMessage.showResult(this._tableInfo.gametype, {
              winType: this._gameData.wintype,
              winAmount: totalWin,
              gameData: this._gameData,
            });
          }
        } else {
          if (pass2) {
            this._resultMessage.showResult(this._tableInfo.gametype, {
              winType: this._gameData.wintype,
              winAmount: NaN,
              gameData: this._gameData,
            });
          }
        }

        this.playResultSoundEffect(totalWin);
      }

      protected playResultSoundEffect(totalWin) {}

      protected onConfirmPressed(evt: egret.Event) {
        if (this._chipLayer) {
          if (this._chipLayer.getTotalUncfmBetAmount() > 0) {
            if (this._chipLayer.validateBet()) {
              const bets = this._chipLayer.getUnconfirmedBetDetails();
              this._chipLayer.resetUnconfirmedBet(); // Waiting to change to push to waitingforconfirmedbet
              if (this._betRelatedGroup) {
                this._betRelatedGroup.changeBtnState(
                  false,
                  this._chipLayer.getTotalCfmBetAmount(),
                  this.tableInfo.prevbets && this.tableInfo.prevroundid && this.tableInfo.prevroundid === this.tableInfo.prevbetsroundid
                );
              }
              this._undoStack.clearStack();
              dir.socket.bet(this._tableId, bets, this.onBetReturned.bind(this));
            }
          }
        }
      }

      protected onBetReturned(result) {
        if (!result) {
          logger.e(utils.LogTarget.RELEASE, 'Bet error');
          return;
        }
        // dealing with backend error message
        if (result.error) {
          switch (result.error.id) {
            case '4001':
              if (this._chipLayer) {
                this._chipLayer.dispatchEvent(new egret.Event(core.Event.GENERAL_BET_FAIL));
              }
              break;
            case '4002':
              if (this._chipLayer) {
                this._chipLayer.dispatchEvent(new egret.Event(core.Event.INSUFFICIENT_BALANCE));
              }
              break;
            default:
              // maybe calling errorhandler
              logger.e(utils.LogTarget.RELEASE, `Bet error: ${result.error.id}`);
          }
          return;
        }
        // dealing with success message
        if (result.success) {
          logger.l(utils.LogTarget.RELEASE, 'Bet Result Received', result);
          this.dispatchEvent(new egret.Event(core.Event.PLAYER_BET_RESULT, false, false, result));
        } else {
          logger.e(utils.LogTarget.RELEASE, result);
        }
      }

      // protected changeBtnState(isEnable: boolean = true) {
      //   this._undoButton.touchChildren = this._undoButton.touchEnabled = isEnable;
      //   this._cancelButton.touchChildren = this._cancelButton.touchEnabled = isEnable;
      //   this._confirmButton.touchChildren = this._confirmButton.touchEnabled = isEnable;
      //   this._doubleButton.touchChildren = this._doubleButton.touchEnabled = this._chipLayer.getTotalCfmBetAmount() ? true : false;
      //   this._repeatButton.touchChildren = this._repeatButton.touchEnabled = this.tableInfo.prevbets && this.tableInfo.prevroundid && this.tableInfo.prevroundid === this.tableInfo.prevbetsroundid;
      //   this._undoButton.alpha = isEnable ? 1 : 0.5;
      //   this._cancelButton.alpha = isEnable ? 1 : 0.5;
      //   this._confirmButton.alpha = isEnable ? 1 : 0.3;
      //   this._repeatButton.alpha = this._repeatButton.touchEnabled ? 1 : 0.5;
      //   this._doubleButton.alpha = this._doubleButton.touchEnabled ? 1 : 0.5;
      //   if (this._timer.bg_color) {
      //     this._timer.bg_color.alpha = isEnable ? 0.7 : 0;
      //     if (isEnable) {
      //       this._timer.bg_flash();
      //     } else {
      //       this._timer.removebg_flash();
      //     }
      //   }
      // }

      protected onCancelPressed(evt: egret.Event) {
        if (this._chipLayer) {
          this._chipLayer.cancelBet();
          this._undoStack.clearStack();
          if (this._betRelatedGroup) {
            this._betRelatedGroup.changeBtnState(
              false,
              this._chipLayer.getTotalCfmBetAmount(),
              this.tableInfo.prevbets && this.tableInfo.prevroundid && this.tableInfo.prevroundid === this.tableInfo.prevbetsroundid
            );
          }
        }
      }

      protected onRepeatPressed() {
        if (this._chipLayer) {
          this._chipLayer.onRepeatPressed();
        }
        if (this._betRelatedGroup) {
          this._betRelatedGroup.changeBtnState(
            true,
            this._chipLayer.getTotalCfmBetAmount(),
            this.tableInfo.prevbets && this.tableInfo.prevroundid && this.tableInfo.prevroundid === this.tableInfo.prevbetsroundid
          );
        }
      }

      protected onDoublePressed() {
        if (this._chipLayer) {
          this._chipLayer.onDoublePressed();
          if (this._betRelatedGroup) {
            this._betRelatedGroup.changeBtnState(
              true,
              this._chipLayer.getTotalCfmBetAmount(),
              this.tableInfo.prevbets && this.tableInfo.prevroundid && this.tableInfo.prevroundid === this.tableInfo.prevbetsroundid
            );
          }
        }
      }

      protected onUndoPressed() {
        if (this._chipLayer) {
          this._undoStack.popAndUndo();
          if (!this._chipLayer.getTotalUncfmBetAmount()) {
            if (this._betRelatedGroup) {
              this._betRelatedGroup.changeBtnState(
                false,
                this._chipLayer.getTotalCfmBetAmount(),
                this.tableInfo.prevbets && this.tableInfo.prevroundid && this.tableInfo.prevroundid === this.tableInfo.prevbetsroundid
              );
            }
          }
        }
      }

      public get isVideoStopped() {
        return this._video.paused;
      }

      public playVideoFunc(scene: any) {
        return () => scene.playVideo();
      }

      public playVideo() {
        try {
          this._video.play();
          this.stage.frameRate = 60;
          env.videoOpen = true;
        } catch (e) {
          console.log('Video play Error');
        }
        this._bgImg.visible = false;
      }

      public stopVideoFunc(scene: any) {
        return () => scene.stopVideo();
      }

      public stopVideo() {
        try {
          this._video.stop();
          this.stage.frameRate = env.frameRate;
          env.videoOpen = false;
        } catch (e) {
          console.log('Video play Error');
        }
        this._bgImg.visible = true;
      }

      protected destroy() {
        super.destroy();
        env._currTableId = '';
        env._currGameType = null;
      }
    }
  }
}
