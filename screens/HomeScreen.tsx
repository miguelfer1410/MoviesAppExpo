import React, { useState, useEffect } from 'react';
import SearchBar  from '../components/SearchBar';
import { View } from 'react-native';
import TrendingMovies from '@/components/TrendingMovies';

export default function HomeScreen() {
    return (
        <View style={{backgroundColor:'black', height:'100%'}}>
            <SearchBar />
            <TrendingMovies />
        </View>
    );
  }
