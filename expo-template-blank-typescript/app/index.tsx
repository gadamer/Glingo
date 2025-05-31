import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useStore } from '../store';

export default function Index() {
  const { initialized, initialize } = useStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  return <Redirect href="/onboarding" />;
}
