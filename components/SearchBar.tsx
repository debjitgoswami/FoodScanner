// components/SearchBar.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';


type Props = {
    onSearch: (query: string) => void;
};

const SearchBar: React.FC<Props> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    return (
        <View style={styles.container}>
            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search food name..."
                style={styles.input}
            />
            <Button title="Search🔎"
                color={Colors.primary}
                onPress={() => onSearch(query)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        // borderColor: '#4CAF50',
        borderColor: Colors.primary,
        borderWidth: 1,
        padding: 10,
        borderRadius: 16,
        marginRight: 10,
    },
});

export default SearchBar;
