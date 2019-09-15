export interface StickerItem {
  name: string;
  category: string;
  resource: any;
}

export default class StickerCategory {

  private category: string;
  private stickers: StickerItem[];
  private start: number;
  private end: number;
  private pageCount: number;
  private poster?: NodeRequire;

  public constructor(param: { category: string, stickers: StickerItem[], start: number, end: number }) {
    this.category = param.category;
    this.stickers = param.stickers;
    this.start = param.start;
    this.end = param.end;
    this.pageCount = this.end - this.start;
    // TODO 添加默认poster
    if (param.stickers.length > 0) {
      this.poster = param.stickers[0].resource;
    }
  }

  public getStart(): number {
    return this.start;
  }

  public getPageCount() {
    return this.pageCount;
  }

  public getStickers() {
    return this.stickers;
  }

  public checkInCategory(index: number): boolean {
    return index >= this.start && index < this.end;
  }

  public getName(): string {
    return this.category;
  }

  public getPoster(): NodeRequire {
    return this.poster!;
  }
}
