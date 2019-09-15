import React, { Component } from 'react';
import { View, StyleSheet, StyleProp } from 'react-native';

interface Props {
  style: StyleProp<any>;
  data: any[];
  numColumns: number;
  renderItem: (item: any) => React.ReactElement;
  keyExtractor: (item: any) => string;
}

export default class GridView extends Component<Props> {

  render() {
    const { data, numColumns, renderItem, style } = this.props;
    const itemContainers: React.ReactElement[] = [];
    const maxLine = Math.ceil(data.length / numColumns);
    for (let i = 0; i < maxLine; i++) {
      const itemContainer: React.ReactElement[] = [];
      let startIndex = 0;
      for (let j = 0; j < numColumns; j++) {
        startIndex = j + i * numColumns;
        if (startIndex < data.length) {
          const child = renderItem(data[startIndex]);
          itemContainer.push(child);
        } else {
          break;
        }
      }

      itemContainers.push(<View style={styles.itemContainer} key={i}>{itemContainer}</View>);
    }

    return (
      <View style={[{ flex: 1, }, style]}>
        {itemContainers}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
  }
});
