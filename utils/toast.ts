import Toast from 'react-native-toast-message';

export const showToast = {
    success: (title: string, message?: string) => {
        Toast.show({
            type: 'success',
            text1: title,
            text2: message,
            position: 'top',
            visibilityTime: 6000,
            topOffset: 60,

        });
    },

    error: (title: string, message?: string) => {
        Toast.show({
            type: 'error',
            text1: title,
            text2: message,
            position: 'top',
            visibilityTime: 5000,
            topOffset: 60,
        });
    },

    info: (title: string, message?: string) => {
        Toast.show({
            type: 'info',
            text1: title,
            text2: message,
            position: 'top',
            visibilityTime: 5000,
            topOffset: 60,
        });
    },

    warning: (title: string, message?: string) => {
        Toast.show({
            type: 'warning',
            text1: title,
            text2: message,
            position: 'top',
            visibilityTime: 5000,
            topOffset: 60,
        });
    },

    custom: (title: string, message?: string, icon?: string) => {
        Toast.show({
            type: 'custom',
            text1: title,
            text2: message,
            position: 'top',
            visibilityTime: 5000,
            topOffset: 60,
            props: { icon },
        });
    },
};