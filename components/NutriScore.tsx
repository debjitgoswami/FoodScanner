// components/NutriScore.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    grade?: string;
};

const NutriScore: React.FC<Props> = ({ grade = '?' }) => {
    const colors: Record<string, string> = {
        a: '#00C853',
        b: '#AEEA00',
        c: '#FFD600',
        d: '#FF6F00',
        e: '#D50000',
    };

    const color = colors[grade.toLowerCase()] || '#aaa';

    return (
        <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.text}>Nutri-Score: {grade.toUpperCase()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default NutriScore;
