import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '@/context/Context';
import { fetchMovieDetails, fetchShowDetails } from '@/server/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigaton } from '@/routes/stack';
import { Ionicons } from '@expo/vector-icons';

interface Rating {
    Source: string;
    Value: string;
}

interface Movie {
    Title: string;
    Poster: string;
    Released: string;
    Year:string;
    Plot: string;
    Type: 'movie';
    Ratings?: Rating[];  // Adicionando o array de Ratings
}

interface Show {
    Name: string;
    Poster: string;
    FirstAirDate: string;
    Plot: string;
    Type: 'series';
    Ratings?: Rating[];
    Year:string;

}

type FavoriteItem = Movie | Show;

const FavoriteList = () => {
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
    const [favoriteShows, setFavoriteShows] = useState<Show[]>([]);
    const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
    const [watchlistShows, setWatchlistShows] = useState<Show[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMovies, setIsMovies] = useState(true); 
    const [isWatchlist, setIsWatchlist] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<StackNavigaton, 'Details'>>();
    const { state, dispatch } = useContext(Context);

    const loadFavoritesAndWatchlist = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            const favorites: FavoriteItem[] = storedFavorites ? JSON.parse(storedFavorites) : [];
            const movies = favorites.filter((item: FavoriteItem) => item.Type === 'movie') as Movie[];
            const shows = favorites.filter((item: FavoriteItem) => item.Type === 'series') as Show[];
            setFavoriteMovies(movies);
            setFavoriteShows(shows);

            const storedWatchlist = await AsyncStorage.getItem('watchlist');
            const watchlist: FavoriteItem[] = storedWatchlist ? JSON.parse(storedWatchlist) : [];
            const watchlistMovies = watchlist.filter((item: FavoriteItem) => item.Type === 'movie') as Movie[];
            const watchlistShows = watchlist.filter((item: FavoriteItem) => item.Type === 'series') as Show[];
            setWatchlistMovies(watchlistMovies);
            setWatchlistShows(watchlistShows);
            

            setIsLoading(false);
        } catch (error) {
            console.error('Failed to load data:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFavoritesAndWatchlist(); 
        console.log('changed');  
    }, [state.favorites, state.watchlists]); 

    const handleFavoritePress = async (item: FavoriteItem) => {
        if ('Title' in item) {
            const year = item.Released ? item.Released.split(' ').pop() : 'Unknown Year'; 
            await fetchMovieDetails(item.Title, year ?? 'Unknown Year', dispatch);
        } else if ('Name' in item) {
            await fetchShowDetails(item.Name, dispatch);
        }
        navigation.navigate("Details");
    };

    const renderItem = ({ item }: { item: FavoriteItem }) => {
        const imdbRating = item.Ratings?.find(rating => rating.Source === "Internet Movie Database");
        const ratingValue = imdbRating ? imdbRating.Value.split('/')[0] : 'N/A';                 
    
        return (
            <View style={styles.movieItem}>
                <TouchableOpacity style={{ flexDirection: 'row', width: 340 }} onPress={() => handleFavoritePress(item)}>
                    <Image source={{ uri: item.Poster }} style={styles.poster} />
                    <View style={styles.movieDetails}>
                        <View style={{flexDirection:'row',top:10,right:10, position:'absolute'}}>
                            <Ionicons style={{marginRight:5, marginTop:1}} name="star" size={16} color="tomato" />
                            <Text style={{color:'white'}}>{ratingValue}</Text>
                        </View>
                        <Text style={{color:'tomato'}}>{item.Year}</Text>
                        <Text style={styles.movieTitle}>
                            {'Title' in item ? item.Title : item.Name}
                        </Text>
                        <Text style={[styles.movieReleased, styles.textEllipsis]} numberOfLines={2}>
                            {item.Plot}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
    

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.noFavoritesText}>Loading...</Text>
            </View>
        );
    }

    const itemsToDisplay = isWatchlist
        ? isMovies
            ? watchlistMovies
            : watchlistShows
        : isMovies
            ? favoriteMovies
            : favoriteShows;

    return (
        <View style={styles.container}>
            <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold', marginBottom: 15 }}>My Collection</Text>
            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 8 }}>
                <TouchableOpacity onPress={() => {setIsMovies(true); }}>
                    <Text style={[styles.tabText, isMovies && styles.activeTab]}>Movies</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setIsMovies(false); }}>
                    <Text style={[styles.tabText, !isMovies && styles.activeTab]}>Shows</Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row', marginBottom:10}}>
                {isMovies ? (
                    <>
                        <TouchableOpacity style={[styles.subTabButton, isMovies && !isWatchlist && styles.activeSubTabButton]} 
                        onPress={() => { setIsWatchlist(false); setIsMovies(true); }}>
                            <Text style={{color:'white'}}>My Movies</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.subTabButton, isMovies && isWatchlist && styles.activeSubTabButton]}
                        onPress={() => setIsWatchlist(true)}>
                            <Text style={{color:'white'}}>Watchlist</Text>
                        </TouchableOpacity>
                    </>
                ) : !isMovies ? (
                    <>
                        <TouchableOpacity style={[styles.subTabButton, !isMovies && !isWatchlist && styles.activeSubTabButton]} 
                        onPress={() => { setIsWatchlist(false); setIsMovies(false); }}>
                            <Text style={{color:'white'}}>My Shows</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.subTabButton, !isMovies && isWatchlist && styles.activeSubTabButton]}
                        onPress={() => setIsWatchlist(true)}>
                            <Text style={{color:'white'}}>Watchlist</Text>
                        </TouchableOpacity>
                    </>
                ) : null}
            </View>

            {itemsToDisplay.length > 0 ? (
                <FlatList
                    data={itemsToDisplay}
                    keyExtractor={(item) => 'Title' in item ? item.Title : item.Name}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <Text style={styles.noFavoritesText}>
                    {isWatchlist
                        ? `You have no items in your watchlist.`
                        : isMovies
                            ? `You have no favorite movies.`
                            : `You have no favorite shows.`
                    }
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 20,
    },
    movieItem: {
        marginTop:5,
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 10,
    },
    textEllipsis: {
        overflow: 'hidden',
    },
    tabText: {
        color: 'white',
        fontSize: 30,
        marginRight: 25, 
        marginBottom:10,
        marginLeft:-10
    },
    activeTab: {
        fontWeight: 'bold',
        color:'tomato'
    },
    activeSubTabButton: {
        borderBottomColor: 'tomato', 
    },
    subTabButton: {
        marginRight: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    poster: {
        width: 100,
        height: 150,
        borderRadius: 5,
    },
    movieDetails: {
        marginLeft: 10,
        justifyContent: 'center',
        flex:1
    },
    movieTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        maxWidth:250
    },
    movieReleased: {
        color: 'gray',
        marginTop: 5,
        maxWidth:220
    },
    removeButton: {
        marginTop: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'tomato',
        borderRadius: 5,
        width:200
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noFavoritesText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
});

export default FavoriteList;
