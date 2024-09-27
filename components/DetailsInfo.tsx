import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { Context } from '@/context/Context';
import Ratings from './Ratings'; 
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const { width, height } = Dimensions.get('window');

interface Actor {
    id: number;
    profile_path: string;
    name: string;
}

const DetailsInfo = () => {
    const { state, dispatch } = useContext(Context);
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    if (!state.selectedMovie) {
        return <Text>No movie selected</Text>;
    }

    const { Title, Released, Poster, Plot, Ratings: movieRatings, Director, Writer, Genre, Runtime, Type } = state.selectedMovie;    

    const uniqueActors = state.actors
        .filter((actor: Actor, index: number, self: Actor[]) =>
            index === self.findIndex((a) => a.name === actor.name)
        )
        .filter((actor: Actor) => actor.profile_path); 

    const handleFavoritePress = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            
            if (isFavorite) {
                favorites = favorites.filter((movie: any) => movie.Title !== Title);                  
                dispatch({
                    type: 'REMOVE_FAVORITES',
                    payload: Title,
                });           
                await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            } else {
                favorites.push(state.selectedMovie);
                dispatch({
                    type:'ADD_FAVORITES',
                    payload: state.selectedMovie,
                });                
                await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            }

            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Failed to save or remove favorite:', error);
        }
    };


    const handleWatchlistPress = async() => {
        try {
            const storedWatchlist = await AsyncStorage.getItem('watchlist');
            let watchlist = storedWatchlist ? JSON.parse(storedWatchlist) : [];
            
            if (isInWatchlist) {
                watchlist = watchlist.filter((movie: any) => movie.Title !== Title); 
                console.log(Title);
                                 
                dispatch({
                    type: 'REMOVE_WATCHLIST',
                    payload: Title,
                });                     
                      
                await AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
            } else {
                watchlist.push(state.selectedMovie);
                
                dispatch({
                    type:'ADD_WATCHLIST',
                    payload: state.selectedMovie,
                });      
                          
                await AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
            }
            setIsInWatchlist(!isInWatchlist);
        } catch (error) {
            console.error('Failed to save or remove favorite:', error);
        }
    };


    useEffect(() => {
        const checkIfFavoriteOrWatchList = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem('favorites');
                const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
                const isMovieFavorite = favorites.some((movie: any) => movie.Title === Title);
                setIsFavorite(isMovieFavorite);
                const storedWatchList = await AsyncStorage.getItem('watchlist');
                const watchlists = storedWatchList ? JSON.parse(storedWatchList) : [];
                const isMovieWatchlist = watchlists.some((movie: any) => movie.Title === Title);
                setIsInWatchlist(isMovieWatchlist);
            } catch (error) {
                console.error('Failed to check if movie is favorite:', error);
            }
        };

        checkIfFavoriteOrWatchList();
    }, [Title]);

    

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: Poster }} 
                    style={styles.poster} 
                    resizeMode="cover" 
                />
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View>
                <Text style={styles.title}>
                    {Title}
                </Text>
                <View style={{flexDirection:'row', marginTop:-32, alignSelf:'center'}}>
                    <Text style={styles.releaseDate}>({Released})</Text>
                    <Text style={{color:'white', marginTop:31}}>  |  {Runtime}</Text>
                </View>
            </View>

            <Text style={{color:'white', alignSelf:'center', marginBottom:10}} numberOfLines={2} ellipsizeMode="tail">
                Genre: {Genre}
            </Text>

            <Text style={{ color: 'white' }}>{Plot}</Text>
            <Ratings ratings={movieRatings} />

            {isFavorite ? (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={[styles.favButton, isFavorite && styles.favButtonActive]} onPress={handleFavoritePress}>
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons style={{ marginRight: 10 }} name="bookmark" size={24} color="tomato" />
                            <Text style={[styles.favButtonText, isFavorite && styles.favButtonTextActive]}>
                                Added to My {Type === 'movie' ? 'Movies' : 'Series'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ flexDirection: 'row' }}>
                    {isInWatchlist ? (
                        <View>
                            <TouchableOpacity 
                                style={{ width: 220, height: 60, borderWidth: 1, borderColor: 'white', borderRadius: 30, justifyContent: 'center' }}
                                onPress={handleWatchlistPress}
                            >
                                <View style={{flexDirection:'row', alignSelf:'center'}}>
                                    <Ionicons style={{ marginRight:10,color:'lightgrey'}} name="bookmark" size={24}/>
                                    <Text style={{ color: 'lightgrey', alignSelf: 'center', fontSize: 18 }}>
                                        Added to Watchlist
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity style={[styles.favButton, isFavorite && styles.favButtonActive]} onPress={handleFavoritePress}>
                                <Text style={[styles.favButtonText, isFavorite && styles.favButtonTextActive]}>
                                    Add to My {Type === 'movie' ? 'Movies' : 'Series'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{ width: 180, height: 60, borderWidth: 1, borderColor: 'white', borderRadius: 30, justifyContent: 'center' }} 
                                onPress={handleWatchlistPress}
                            >
                                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 18 }}>
                                    Add to Watchlist
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}

            {uniqueActors.length > 0 && (
                <View style={{ flexDirection: 'column', height: 200 }}>
                    <Text style={{ color: 'white', fontSize: 20, left: 10, fontWeight: 'bold' }}>Cast & Crew</Text>
                    <View style={styles.actorContainer}>
                        <FlatList
                            data={uniqueActors}
                            horizontal={true}
                            keyExtractor={(actor: Actor) => actor.id.toString()}
                            renderItem={({ item: actor }: { item: Actor }) => (
                                <View style={styles.actorItem}>
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500${actor.profile_path}` }}
                                        style={styles.actorImage}
                                    />
                                    <Text style={styles.actorName}>{actor.name}</Text>
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                </View>
            )}

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: 'white', fontSize: 17 }}>Director</Text>
                    <Text style={{ color: 'white', fontSize: 10 }}>{Director}       </Text>
                </View>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: 'white', fontSize: 17 }}>Writer</Text>
                    <Text style={{ color: 'white', fontSize: 10 }}>{Writer}</Text>
                </View>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'black',
        flexGrow: 1, 
    },
    imageContainer: {
        width: width,
        height: height * 0.6,
        position: 'relative',
    },
    poster: {
        width: width, 
        height: height * 0.63, 
        marginBottom: 20,
        marginTop: -10,
        borderWidth: 1,
        borderColor: 'grey',
    },
    backButton: {
        position: 'absolute',
        top: 5, 
        left: 10, 
        width:40,
        height:40,
        justifyContent:'center'
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 22,
        textAlign: 'center',
    },
    releaseDate: {
        color: 'white',
        fontSize: 15,
        marginBottom: 10,
        marginTop: 30,
        alignSelf:'center'
    },
    actorContainer: {
        marginTop: 5,
    },
    actorItem: {
        alignItems: 'center',
        margin: 10,
    },
    actorImage: {
        width: 85,
        height: 120,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'white',
        padding: 5,
    },
    actorName: {
        color: 'white',
        marginTop: 5,
        textAlign: 'center',
        maxWidth:90
    },
    favButton: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 30,
        width: 180,
        padding: 15,
        marginBottom: 20,
        marginRight:10
    },
    favButtonActive: {
        borderColor: 'tomato',
        width:235
    },
    favButtonText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 18,
    },
    favButtonTextActive: {
        color: 'tomato', 
    },
    directorContainer: {
        borderWidth: 2,
        height: 200,
        borderColor: 'white',
        marginTop: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
});

export default DetailsInfo;
