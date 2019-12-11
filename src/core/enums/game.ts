namespace we {
  export namespace core {
    export enum BettingTableType {
      NORMAL = 0,
      LOBBY = 1,
      BETSUMMARY = 2,
    }
    export enum TableState {
      CLOSED = 0,
      ONLINE = 10,
      OFFLINE = 20,
      MAINTENANCE = 30,
    }

    export enum GameType {
      BAC = 0, // classic baccarat
      BAS = 1, // speed baccarat
      BAI = 2, // insurance baccarat
      DI = 12, // Dice
      MJ = 13, // MaJong
      RO = 14, // Rolette
    }

    export enum ChipType {
      FLAT = 1,
      CLIP = 2,
      BETTING = 3,
    }

    export enum GameName {
      lobby = 'lobby',
      ba = 'ba',
    }
    export enum PageName {
      lobby = 'lobby',
      live = 'live',
    }
    export enum LiveGameTab {
      ba = 'bacarrat',
      goodroad = 'goodroad',
    }

    export const TableFilter = {
      FEATURED_TABLE: 1,
      BACCARAT: '123213',
      BACCARAT_GOOD_ROAD: 3,
      OTHER_GAMES: 4,
    };

    export const Mode = {
      UNKNOWN: 0,
      LIGHT: 1,
      DARK: 2,
    };
  }
}
