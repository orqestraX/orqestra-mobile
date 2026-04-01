import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

// Configure how notifications behave when received while app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export type PushToken = string

/**
 * Request notification permissions and get Expo push token.
 * Returns null if permissions denied or not on a physical device.
 */
export async function registerForPushNotificationsAsync(): Promise<PushToken | null> {
  if (!Device.isDevice) {
    console.warn('[push] Push notifications require a physical device')
    return null
  }

  // Set up Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('orqestra', {
      name: 'Orqestra',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#22c55e',
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.warn('[push] Notification permission denied')
    return null
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  })

  return tokenData.data
}

/**
 * Register the Expo token with our backend so the server can send pushes.
 */
export async function registerTokenWithServer(
  token: PushToken,
  apiBase: string
): Promise<void> {
  try {
    const res = await fetch(`${apiBase}/api/push/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, platform: Platform.OS }),
    })
    if (!res.ok) {
      console.error('[push] Failed to register token:', await res.text())
    }
  } catch (err) {
    console.error('[push] Error registering token:', err)
  }
}

/**
 * Unregister push token from backend (e.g. on logout).
 */
export async function unregisterTokenFromServer(
  token: PushToken,
  apiBase: string
): Promise<void> {
  try {
    await fetch(`${apiBase}/api/push/register`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
  } catch (err) {
    console.error('[push] Error unregistering token:', err)
  }
}

/** Subscribe to incoming notifications (foreground) */
export function addNotificationListener(
  handler: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(handler)
}

/** Subscribe to notification taps */
export function addResponseListener(
  handler: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(handler)
}
