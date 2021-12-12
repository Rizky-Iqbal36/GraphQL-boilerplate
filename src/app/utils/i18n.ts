import i18n from "i18n";
import path from "path";
import { ILocalizeMessage } from "@root/interfaces";

export class Localization {
  public readonly i18n = i18n;

  constructor(dataDir: string) {
    this.i18n.configure({
      locales: ["en", "id"],
      directory: dataDir,
      updateFiles: false,
      defaultLocale: "en",
      objectNotation: true,
    });
  }

  getLocalizedMsg = (option: ILocalizeMessage, lang?: any): string => {
    let msg;

    if (lang) this.i18n.setLocale(lang);
    msg = this.i18n.__(option.key, option.vars as any);
    if (!msg || msg === option.key) {
      msg = `<err: localized msg not found in json files><flag: ${
        option.key
      }><lang: ${this.i18n.getLocale()}>`;
    }

    return msg;
  };

  getLocalizedTime = (second: number, lang?: any) => {
    if (lang) this.i18n.setLocale(lang);
    if (second >= 3600) {
      const hour = Math.floor(second / 3600);
      const minute = Math.ceil((second - 3600 * hour) / 60);
      return `${this.i18n.__n("%s HOUR", hour)} ${this.i18n.__n(
        "%s MINUTE",
        minute
      )}`;
    }
    if (second >= 60) {
      const minute = Math.floor(second / 60);
      second -= 60 * minute;
      return `${this.i18n.__n("%s MINUTE", minute)} ${this.i18n.__n(
        "%s SECOND",
        second
      )}`;
    }
    return this.i18n.__n("%s SECOND", second);
  };
}

export const localization = new Localization(
  path.join(process.cwd(), "localization")
);

export const getLocalizedMsg = localization.getLocalizedMsg;
export const getLocalizedTime = localization.getLocalizedTime;
