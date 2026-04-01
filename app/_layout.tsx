import { useEffect, useRef } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as Notifications from 'expo-notifications'
import { useRouter } from 'expo-router'
import {
  registerForPushNotificationsAsync,
  registerTokenWithServer,
  addNotificationListener,
  addResponseListener,
} from '../src/utils/notifications'

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://orqestrax.com'

export default function RootLayout() {
  const router = useRouter()
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  useEffect(() => {
    // Register for push notifications on mount
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        registerTokenWithServer(token, API_BASE)
      }
    })

    // Listen for notifications received while app is open
    notificationListener.current = addNotificationListener(notification => {
      console.log('[push] Received:', notification.request.content.title)
    })

    // Handle notification taps — navigate to orders
    responseListener.current = addResponseListener(response => {
      const data = response.notification.request.content.data as Record<string, unknown>
      if (data?.screen === 'orders' || data?.order_id) {
        router.push('/(tabs)/orders')
      }
    })

    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [])

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="marketplace/[id]" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="orders/[id]" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="orders/create" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="notifications" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="help" options={{ headerShown: false, presentation: 'card' }} />
      </Stack>
    </>
  )
}
