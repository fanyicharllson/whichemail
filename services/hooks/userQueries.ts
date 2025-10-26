import {useQuery} from '@tanstack/react-query';
import {account} from '@/services/appwrite/appwrite';
import {showToast} from "@/utils/toast";

// Raw fetcher for current user. Returns null if not authenticated.
export const fetchCurrentUser = async () => {
  try {
    // First, check if there's an active session to avoid guest scope errors
    try {
      const session = await account.getSession({ sessionId: 'current' });
      if (!session || !session.$id) {
        return null;
      }
    } catch {
      return null;
    }

    // We have a session, now safely fetch the user
    return await account.get();
  } catch (e) {
    // If fetching user fails, treat as not authenticated without noisy toasts
    console.warn('fetchCurrentUser: unable to get user, returning null');
    return null;
  }
};

// React Query hook to access the current user anywhere in the app
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};

