// components/HealthyBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    score: number;
};

const HealthyBar: React.FC<Props> = ({ score }) => {
    const percentage = Math.min(score / 100, 1);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Health Score</Text>
            <View style={styles.bar}>
                <View style={[styles.fill, { width: `${percentage * 100}%` }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 10 },
    label: { fontSize: 16, marginBottom: 4 },
    bar: {
        height: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
});

export default HealthyBar;
