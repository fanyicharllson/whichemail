import {useState} from 'react';
import * as WebBrowser from 'expo-web-browser';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {account} from '@/services/appwrite/appwrite';
import {showToast} from '@/utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from 'expo-router';
import {appwriteConfig} from "@/utils/expoContants";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const queryClient = useQueryClient();

    const googleAuth = useMutation({
        mutationFn: async () => {
            try {
                setIsAuthenticating(true);

                const appwriteEndpoint = appwriteConfig.endpoint;
                const projectId =  appwriteConfig.projectId;

                const provider = 'google';
                const success = encodeURIComponent('whichemail://auth/callback');
                const failure = encodeURIComponent('whichemail://auth/error');

                // ✅ Build OAuth URL manually (no SDK redirect)
                const authUrl = `${appwriteEndpoint}/account/sessions/oauth2/${provider}?project=${projectId}&success=${success}&failure=${failure}`;

                const result = await WebBrowser.openAuthSessionAsync(
                    authUrl,
                    'whichemail://auth/callback'
                );

                if (result.type !== 'success') {
                    throw new Error('User cancelled or auth failed');
                }

                // ✅ After redirect, Appwrite already has session
                const user = await account.get();
                await AsyncStorage.setItem('isAuthenticated', 'true');

                return {success: true, user};
            } catch (error: any) {
                console.error('Google auth error:', error);
                return {success: false, error: error.message || 'Authentication failed'};
            } finally {
                setIsAuthenticating(false);
            }
        },
        onSuccess: (result) => {
            if (result.success) {
                showToast.success('Welcome! 🎉', `Signed in as ${result.user?.name || 'User'}`);
                queryClient.invalidateQueries({queryKey: ['user']});
                router.replace('/(tabs)');
            } else {
                showToast.error('Authentication Failed', result.error || 'Please try again');
            }
        },
    });

    const signInWithGoogle = () => {
        if (isAuthenticating) {
            showToast.info('Please wait...', 'Authentication in progress');
            return;
        }
        googleAuth.mutate();
    };

    return {
        signInWithGoogle,
        isAuthenticating: isAuthenticating || googleAuth.isPending,
        isError: googleAuth.isError,
        error: googleAuth.error,
    };
};
