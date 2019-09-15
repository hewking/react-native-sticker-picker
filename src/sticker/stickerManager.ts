import Stickers from '../../asset/stickers';
import StickerCategory, { StickerItem } from './stickerCategory';

export const PAGE_COLUMNS = 5;
export const PAGE_ROWS = 2;
export const PAGE_SIZE = PAGE_COLUMNS * PAGE_ROWS;
const DeleteItem = '__emoji_pick_delete__';
const PlaceholderItem = '__emoji_pick_placeholder__';

export default class StickerManager {

  public static getInstance() {
    if (!StickerManager.instance) {
      StickerManager.instance = new StickerManager();
    }
    return StickerManager.instance;
  }

  private static instance: StickerManager = new StickerManager();

  private stickerCategories: StickerCategory[] = [];

  private constructor() {
    this.loadStickers();
  }

  public loadStickers() {
    // 可以先clear
    for (const [key, value] of Object.entries(Stickers)) {
      let start = 0;
      if (this.stickerCategories.length > 0) {
        start = this.stickerCategories.map(item => {
          return item.getPageCount();
        }).reduce((pre, cur) => {
          return pre + cur;
        });
      }

      // place holder
      const stickerArr = Object.values(value); // .map(item => (Object.assign(item, { category: key })));
      const pageCount = Math.ceil(stickerArr.length / PAGE_SIZE);
      if (stickerArr.length < pageCount * PAGE_SIZE) {
        const gap = pageCount * PAGE_SIZE - stickerArr.length;
        for (let j = 0; j < gap; j++) {
          stickerArr.push({
            name: PlaceholderItem,
            category: key,
            resource: null,
          });
        }
      }

      const size = Math.ceil(stickerArr.length / PAGE_SIZE);
      const category = new StickerCategory({
        category: key,
        stickers: stickerArr,
        start,
        end: start + size,
      });
      this.stickerCategories.push(category);
    }
  }

  public getAllStickers(): StickerItem[] {
    if (this.stickerCategories.length === 0) {
      return [];
    }
    return this.stickerCategories.map(cagegory => cagegory.getStickers()).reduce((pre, cur) => {
      return pre.concat(cur);
    });
  }

  public getPageStcikers(page: number): StickerItem[] {
    // TODO
    return [];
  }

  /**
   * 获取当前index所在的category的pageCount
   */
  public getCagegorySizeByIndex(index: number): number {
    return this.stickerCategories.map(category => {
      let size = 0;
      if (category.checkInCategory(index)) {
        size = category.getPageCount();
      }
      return size;
    })
      .reduce((pre, cur) => {
        return pre + cur;
      });
  }

  /**
   * 获取当前index所在的category的具体index [0,pageCount)
   * @param index
   */
  public getCagegoryCurIndex(index: number): number {
    let tmp = 0;
    for (const category of this.stickerCategories) {
      if (category.checkInCategory(index)) {
        // -1 的原因是因为index 是从0开始计数
        // 跨多个category 也只用减一次就可以
        // if (tmp > 0) {
        //     tmp = tmp -1;
        // }
        return index - tmp;
      } else {
        tmp += category.getPageCount();
      }
    }
    return 0;
  }

  public getCagegoryPageCount(): number {
    return this.stickerCategories.map(category => {
      return category.getPageCount();
    })
      .reduce((pre, cur) => {
        return pre + cur;
      });
  }

  /**
   * 判断是否category改变，如果curIndex,newIndex都在category
   * 的 start,end之间，则没有改变，反之改变。
   * true 改变，false未改变
   * @param curIndex
   * @param newIndex
   */
  public checkCategoryChanged(curIndex: number, newIndex: number): boolean {
    return this.stickerCategories.some(category => {
      return category.checkInCategory(curIndex) && !category.checkInCategory(newIndex);
    });
  }

  /**
   * 获取category 个数
   */
  public getCategoryCount(): number {
    return this.stickerCategories.length;
  }

  public getAllCategory(): StickerCategory[] {
    return this.stickerCategories;
  }

  public getCategoryByIndex(index: number): StickerCategory | null {
    let tmp = 0;
    for (const category of this.stickerCategories) {
      if (category.checkInCategory(index)) {
        return category;
      } else {
        tmp += category.getPageCount();
      }
    }
    return null;
  }

  public getCategoryOrderByIndex(index: number): number {
    let tmp = 0;
    for (let i = 0; i < this.stickerCategories.length; i++) {
      if (this.stickerCategories[i].checkInCategory(index)) {
        return i;
      } else {
        tmp += this.stickerCategories[i].getPageCount();
      }
    }
    return 0;
  }

  public getIndexByCategory(categoryName: string): number {
    const category = this.stickerCategories.find(item => (item.getName() === categoryName));
    if (category) {
      return category.getStart();
    }
    return 0;
  }

  public getResourceByCategory(category: string, name: string): StickerItem | null {
    const stickCategory = this.stickerCategories.find(item => {
      return item.getName() === category;
    });
    if (stickCategory) {
      const stickerItem = stickCategory.getStickers().find(sticker => {
        return sticker.name === name;
      });
      if (stickerItem) {
        return stickerItem;
      }
    }
    return null;
  }

}
