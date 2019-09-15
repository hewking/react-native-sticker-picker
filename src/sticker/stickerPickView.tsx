import React from 'react';
import {
  FlatList, Image, ScrollView, StyleSheet
  , TouchableOpacity, View, Dimensions
} from 'react-native';
import SegmentControl from './segmentControl';
import CategoryControl from './categoryControl';
import StickerManager, { PAGE_COLUMNS, PAGE_ROWS } from './stickerManager';
import { StickerItem } from './stickerCategory';
import * as Color from './color';
import GridView from './gridView';

const wScreen = Dimensions.get("window").width;

interface Props {
  style: any;
  tabViewHeight?: number;
  height?: number;
  itemSize?: number;
  key?: string;
  onPickSticker: (text: StickerItem) => void;
}

interface State {
  width: number;
  curIndex: number;
  categoryCount: number;
}

export default class StickerPickView extends React.PureComponent<Props, State> {

  static defaultProps = {
    itemSize: 65,
    tabViewHeight: 40,
  };

  DeleteItem = '__emoji_pick_delete__';
  PlaceholderItem = '__emoji_pick_placeholder__';

  private scrollView: ScrollView | null = null;

  constructor(props) {
    super(props);
    this.state = {
      width: wScreen,
      curIndex: 0,
      categoryCount: StickerManager.getInstance().getCagegorySizeByIndex(0),
    };
  }

  render() {
    const { tabViewHeight, key, height } = this.props;
    const tabStyle = {
      height: tabViewHeight,
    };
    const stickers = StickerManager.getInstance().getAllStickers();
    const collection = this.dataSource(stickers);
    const isValid = this.state.width > 0;
    const curIndex = StickerManager.getInstance().getCagegoryCurIndex(this.state.curIndex);
    const categoryOrder = StickerManager.getInstance().getCategoryOrderByIndex(this.state.curIndex);
    const categoryList = StickerManager.getInstance().getAllCategory()
      .map(item => ({ name: item.getName(), image: item.getPoster() }));
    return (
      <View onLayout={this.onLayout} style={[styles.view, { height, width: this.state.width }
        , { flexDirection: 'column', backgroundColor: Color.subPrimaryDarkColor }]}>
        {this.renderScrollView(collection)}
        <View style={[styles.tabview, tabStyle]}>
          {isValid && (
            <SegmentControl
              length={this.state.categoryCount}
              currentIndex={curIndex}
              currentColor={Color.white}
              color='#363F55'
            />
          )}
        </View>
        <CategoryControl
          style={{
            width: '100%'
          }}
          curIndex={categoryOrder}
          height={tabViewHeight}
          categoryList={categoryList}
          onSelect={this.onCategorySelect}
        />
      </View>
    );
  }

  private renderScrollView = (collection) => {
    const { height, tabViewHeight } = this.props;
    const viewHeight = height! - 2 * tabViewHeight!;
    return (
      <ScrollView
        ref={v => this.scrollView = v}
        style={[styles.scrollview, { height: viewHeight }]}
        automaticallyAdjustContentInsets={false}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={this.onContentHorizontalScrollEnd}
        scrollEventThrottle={16}
      >
        {collection.data.map(this.renderPage.bind(this, collection))}
      </ScrollView>
    );
  }

  private renderPage = (collection, obj, index) => {
    const { marginH, marginV, numColumns } = collection;
    return (
      <GridView
        style={[{ marginHorizontal: marginH, marginVertical: marginV }, { backgroundColor: Color.subPrimaryDarkColor }]}
        data={obj}
        renderItem={this.renderItem}
        numColumns={numColumns}
        keyExtractor={item => item.name}
      />
    );
  }

  private renderItem = (item) => {
    const { name, resource } = item;
    const style = {
      width: this.props.itemSize,
      height: this.props.itemSize,
    };
    if (name === this.PlaceholderItem) {
      return <View style={style} />;
    }
    return (
      <TouchableOpacity onPress={() => {
        this.clickEmoji(item);
      }}>
        <View style={[styles.itemview, style]}>
          <Image style={styles.icon} source={resource} />
        </View>
      </TouchableOpacity>
    );
  }

  private onContentHorizontalScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / this.state.width);
    if (newIndex !== this.state.curIndex) {
      if (StickerManager.getInstance().checkCategoryChanged(this.state.curIndex, newIndex)) {
        this.onCategoryChanged();
        this.setState({
          curIndex: newIndex,
          categoryCount: StickerManager.getInstance().getCagegorySizeByIndex(newIndex)
        });
      } else {
        this.setState({
          curIndex: newIndex,
        });
      }
    }
  }

  private onCategoryChanged = () => {
    // todo
    console.log('EmojiPickView onCategoryChanged');
  }

  private onCategorySelect = (category: { name: string, image: NodeRequire }) => {
    // 1. category选中，点击的item 2. 滑动到选中category 的分类
    const newIndex = StickerManager.getInstance().getIndexByCategory(category.name);
    this.setState({
      curIndex: newIndex,
      categoryCount: StickerManager.getInstance().getCagegorySizeByIndex(newIndex)
    });
    this.scrollView && this.scrollView.scrollTo({
      y: 0,
      x: this.state.width * newIndex,
      animated: false
    });
  }

  private clickEmoji = (item: StickerItem) => {
    const { onPickSticker } = this.props;
    if (onPickSticker) {
      onPickSticker(item);
    }
  }

  private onLayout = (event) => {
    // TODO: 
    // const { width } = event.nativeEvent.layout;
    // this.setState({
    //   width,
    // });
  }

  private dataSource = (emojis) => {
    const [numColumns, marginH] = this.columnCount();
    const [numRows, marginV] = this.rowCount();
    const pageSize = numColumns * numRows;
    const pages = StickerManager.getInstance().getCagegoryPageCount();
    const dataArr: any[] = [];
    for (let i = 0; i < pages; i++) {
      const arr = emojis.slice(i * pageSize, (i + 1) * pageSize);
      dataArr.push(arr);
    }
    console.log('dataSource pages: ' + pages);
    return { data: dataArr, numRows, numColumns, marginH, marginV, pageSize, pages };
  }

  private columnCount = () => {
    const width = this.state.width;
    const minMarginH = 15;
    // const numColumns = Math.floor((width - minMarginH * 2) / this.props.itemSize);
    const numColumns = PAGE_COLUMNS;
    const marginH = (width - this.props.itemSize! * numColumns) / 2;
    return [numColumns, marginH];
  }

  private rowCount = () => {
    const height = this.props.height! - this.props.tabViewHeight! * 2;
    const minMarginV = 4;
    // const numRows = Math.floor((height - minMarginV * 2) / this.props.itemSize);
    const numRows = PAGE_ROWS;
    const marginV = (height - this.props.itemSize! * numRows) / 2;
    return [numRows, marginV];
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column'
  },
  scrollview: {
    flexDirection: 'row',
  },
  tabview: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemview: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 64,
    height: 64,
  },
});
