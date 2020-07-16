// TypeScript file
namespace we {
  export namespace lo {
    // manage lottery note list and bet related buttons
    export abstract class ANoteControlPanel extends core.BaseEUI implements INoteControl {
      protected _notes: TradNoteData[];
      // TradNoteData {
      //   public field: string; // field consist of several information: Bet type, bet per note and bet detail
      //   public count: number; // number of note corresponding to the field
      //   public multiplier: number;
      // }
      public bettingPanel: ABettingPanel;

      public get notes() {
        return this._notes;
      }

      public set notes(val: any) {
        this._notes = val;
      }

      public addNotes(notes: TradNoteData[]) {
        this._notes.concat(notes);
      }

      public addTempNotes() {
        const temp = [
          {
            field: '^3^4OptionalFree_&564_&708@200',
            count: 9,
            multiplier: 1,
          },
        ];
        this.notes = this._notes.concat(temp);
      }

      public clearNotes(note: TradNoteData) {
        if (this.notes.length === 0) {
          return;
        } else {
          this.notes.forEach((e, i) => {
            if (e === note) {
              this.notes.splice(i, 1);
            }
          });
        }
      }

      public clearAllNotes() {
        this._notes = [];
      }

      public updateNoteControlPanel() {}
    }
  }
}
