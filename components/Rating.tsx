// components/Rating.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    value: number;
};

const Rating: React.FC<Props> = ({ value }) => {
    return (
        <View style={styles.row}>
            <Text style={styles.text}>Rating: </Text>
            {[1, 2, 3, 4, 5].map((i) => (
                <Text key={i} style={i <= value ? styles.star : styles.emptyStar}>
                    ★
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
    },
    star: {
        color: '#FFD700',
        fontSize: 18,
    },
    emptyStar: {
        color: '#ccc',
        fontSize: 18,
    },
});

export default Rating;
