import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Ratings = ({ ratings }: { ratings: Array<{ Source: string, Value: string }> }) => {

    return (
        <View style={styles.ratingsContainer}>
            {ratings.map((rating, index) => (
                <View key={index} style={styles.ratingItem}>
                    <Text style={styles.ratingSource}>{rating.Source}</Text>
                    <Text style={styles.ratingValue}>{rating.Value}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    ratingsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginVertical: 30,
    },
    ratingItem: {
        marginHorizontal: 10,
        alignItems: 'center',
    },
    ratingSource: {
        fontWeight: 'bold',
        color:'white'
    },
    ratingValue: {
        fontSize: 16,
        color:'white'
    },
});

export default Ratings;
