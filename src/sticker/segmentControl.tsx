import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Prop {
    length: number;
    currentIndex: number;
    color: string;
    currentColor: string;
}

export default class SegmentControl extends React.PureComponent<Prop> {

    static defaultProps = {
        color: '#8b8b8b',
        currentColor: '#d6d6d6',
    };

    render() {
        const { length } = this.props;
        return (
            <View style={styles.view}>
                {new Array(length).fill(1).map(this.renderItem)}
            </View>
        );
    }

    private renderItem = (item, index) => {
        const { currentIndex, color, currentColor } = this.props;
        const bgColor = (value) => ({ backgroundColor: value });
        const style = index === currentIndex ?
            [styles.cur, bgColor(currentColor)] :
            [styles.other, bgColor(color)];
        return <View key={index} style={style} />;
    }
}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cur: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
        marginHorizontal: 2.5,
    },
    other: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        marginHorizontal: 3.5,
    },
});
