/**
 * Font can be load by creating a FontFace instance and added to the document.fonts. The font data file can be load within the res group, then call the loadFont to create font
 */

class FontManager {
  private static _instance: FontManager;

  public static get Instance(): FontManager {
    return this._instance ? this._instance : new FontManager();
  }
  protected fonts: { [key: string]: string } = {};

  public hasFont(fontname: string) {
    if (this.fonts[fontname]) {
      return true;
    }
    return false;
  }

  public async loadFont(resName: string, name: string = null) {
    if (RES.hasRes(resName)) {
      const resInfo = RES.getResourceInfo(resName);
      let fontname = name;
      if (!fontname) {
        const fontnameChunk = resName.split('_');
        fontname = resName
          .split('_')
          .splice(fontnameChunk.length - 1, 1)
          .join('_');
      }
      if (this.hasFont(fontname)) {
        return Promise.resolve();
      }
      const resData = RES.getRes(resName);
      let font = null;
      if (resData) {
        font = new FontFace(`${fontname}`, resData);
      } else {
        font = new FontFace(`${fontname}`, `url(${resInfo.root}${resInfo.url})`);
      }
      const self = this;
      font
        .load()
        .then(function (loaded_face) {
          (<any>document).fonts.add(loaded_face);
          self.fonts[fontname] = loaded_face;
          return Promise.resolve();
        })
        .catch(function (error) {
          // error occurred
          egret.error(`Load font error: ${error}`);
          return Promise.reject(error);
        });
    } else {
      return Promise.resolve();
    }
  }

  public async loadFontsGroup(groupName: string) {
    const resInfos = RES.getGroupByName(groupName);
    return this.loadFonts(
      resInfos.map(data => {
        return {
          res: data.name,
        };
      })
    );
  }

  public loadFonts(resources: { res: string; name?: string }[]): Promise<{}> {
    return Promise.all(resources.map(data => this.loadFont(data.res, data.name)));
  }
}

let fontMgr: FontManager = FontManager.Instance;
