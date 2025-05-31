import { useEffect, useState } from 'react';
import { FontSource, useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export function useFrameworkReady(fontsToLoad: Record<string, FontSource>) {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts(fontsToLoad);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Promise.all([
          // Add any async resources loading here
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady && fontsLoaded) {
      // This tells the splash screen to hide immediately
      SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  return { appIsReady, fontsLoaded };
}
