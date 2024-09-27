import React from 'react';
import { Provider } from '@/context/Provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TabComponent from '@/routes/stack';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../config/i18n'; 


export default function App() {
  return (
    //<I18nextProvider i18n={i18n}>
      <GestureHandlerRootView>
        <Provider>
            <TabComponent />
        </Provider>
      </GestureHandlerRootView>
    //</I18nextProvider>
  );
}
