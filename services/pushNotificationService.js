import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from './api';
import { API_PATHS } from '../config/api';

export async function registerForPushNotificationsAsync() {
    try {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.DEFAULT,
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') return;

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const { data: pushToken } = await Notifications.getExpoPushTokenAsync({ projectId });

        await api.patch(API_PATHS.updatePushToken, { pushToken });
    } catch (error) {
        // No Expo Go (SDK 53+) o registro de push remoto no Android falha de
        // propósito — esperado até rodarmos um development build de verdade.
        console.log('Push notification registration skipped:', error.message);
    }
}