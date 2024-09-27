import FavoriteList from '@/components/FavoriteList';
import SearchBar from '@/components/SearchBar';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';



export default function FavoriteScreen() {
    return (
      <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'steelblue' }}>
        <FavoriteList />
      </View>
    );
  }
  