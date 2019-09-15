import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import * as Color from './color';

interface Category {
  name: string;
  image: NodeRequire;
}

interface Prop {
  curColor: string;
  curIndex: number;
  height?: number;
  style?: any;
  onSelect?: (category: Category) => void;
  categoryList: Category[];
}

export default class CategoryControl extends Component<Prop> {

  static defaultProps = {
    curColor: Color.subPrimaryDarkColor,
  };
  render() {
    const { height, style } = this.props;
    return (<View style={[styles.container, { height }, style]}>
      {this.props.categoryList.map(this.renderItem)}
    </View>);
  }

  private renderItem = (category: Category, index: number) => {
    const { curIndex, curColor } = this.props;
    const bgColor = (value: string) => ({ backgroundColor: value });
    const style = curIndex === index ? [styles.item, bgColor(curColor)] : styles.item;
    return <View style={[style, { justifyContent: 'center', alignItems: 'center' }]} key={index}>
      <TouchableOpacity
        onPress={() => {
          if (this.props.onSelect) {
            this.props.onSelect(category);
          }
        }}
        style={{
          borderRightWidth: StyleSheet.hairlineWidth
          , borderRightColor: '#424A5F', paddingHorizontal: 10
        }
        }>
        <Image source={category.image} resizeMode='contain' style={{
          width: 30, height: 27
        }} />
      </TouchableOpacity>
    </View>;
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#363F55',
  },
  item: {
    backgroundColor: '#363F55',
    height: '100%',
  },
});
