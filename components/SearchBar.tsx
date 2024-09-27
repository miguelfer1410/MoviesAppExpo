import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, FlatList, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, FlatListComponent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchMovieDetails, fetchMovies } from '../server/api'; 
import { Context } from '@/context/Context'; 
import { useNavigation } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigaton } from '@/routes/stack';

const SearchBar = () => {
    const { state, dispatch } = useContext(Context);
    const [searchInput, setSearchInput] = useState<string>('');
    const navigation = useNavigation<NativeStackNavigationProp<StackNavigaton, 'Details'>>();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchInput.length > 2) { 
                fetchMovies(searchInput, dispatch); 
            }
        };

        fetchSuggestions();
    }, [searchInput]);

    const handleSuggestionPress = async (item: string, year:string) => {
        state.suggestions = 0;
        await fetchMovieDetails(item, year,dispatch);
        setSearchInput('');
        navigation.navigate("Details");
    };


    const handleSettingsPress = () => {        
        navigation.navigate("Settings");
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.searchBox}>
                <View style={{flexDirection:'row', alignSelf:'flex-start', top:5}}>
                <Ionicons style={styles.button} name="search" size={24} color='lightgrey' />
                <TextInput
                    style={styles.input}
                    value={searchInput}
                    placeholder="Search..."
                    placeholderTextColor='lightgrey'
                    onChangeText={setSearchInput} 
                />
                </View>
                <View style={{alignItems:'flex-end', right:22, top:12}}>
                    <TouchableOpacity onPress={handleSettingsPress}>
                        <Ionicons name='settings' size={24} color='lightgrey' />
                    </TouchableOpacity>
                </View>
            </View>

            {state.suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={state.suggestions}
                        keyExtractor={(item) => item.imdbID}
                        style={styles.suggestionsList}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.suggestion} 
                                onPress={() => handleSuggestionPress(item.Title, item.Year)}
                            >
                                <Image 
                                    source={{ uri: item.Poster }} 
                                    style={styles.poster} 
                                />
                                <View style={styles.textContainer}>
                                    <Text style={styles.title}>{item.Title}</Text>
                                    <Text style={styles.year}>{item.Year}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 20,
    },
    searchBox: {
        backgroundColor: '#333',
        height: 50,
        width: 350,
        borderRadius: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        justifyContent:'space-between'
    },
    input: {
        height: 40,
        borderRadius: 20,
        marginLeft: 5,
        alignSelf: 'center',
        width: 300,
        color:'lightgrey'
    },
    button: {
        backgroundColor: '#333',
        borderRadius: 30,
        alignSelf: 'center',
        marginLeft: 10,
    },
    suggestionsContainer: {
        marginTop:20,
        maxHeight: 370, 
        borderRadius: 10,
        overflow: 'hidden', 
        backgroundColor:'#2b2b2b'
    },
    suggestion: {
        padding: 10,
        backgroundColor: '#2b2b2b',
        marginBottom: 5,
        flexDirection: 'row',  
        alignItems: 'center', 
    },
    poster: {
        width: 50,
        height: 75,
        borderRadius: 5,
        marginRight: 10,  
        borderWidth:1,
        borderColor:'white'
    },
    textContainer: {
        flexShrink: 1, 
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color:'white'
    },
    year: {
        fontSize: 14,
        color: 'white',
    },
    suggestionsList: {
        backgroundColor: 'black',
        borderRadius: 10,
        marginTop: 10,
    },
});

export default SearchBar;
