import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

type RefetchFn = () => Promise<unknown> | void;

type NetworkContextType = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  error: Error | null;
  registerRefetch: (fn: RefetchFn) => string;
  unregisterRefetch: (id: string) => void;
  triggerRefetch: () => Promise<void>;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
};

export const NetworkProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [state, setState] = useState<NetInfoState | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refetchMap = useRef(new Map<string, RefetchFn>());

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((s: NetInfoState) => {
      setState(s);
      // if connection regained, clear error
      if (s.isConnected) setError(null);
      // if disconnected, set a generic network error
      if (!s.isConnected) setError(new Error('Network connection lost'));
    });
    // fetch initial state
    NetInfo.fetch().then((s: NetInfoState) => {
      setState(s);
      if (!s.isConnected) setError(new Error('Network connection lost'));
    });
    return () => unsubscribe();
  }, []);

  const registerRefetch = (fn: RefetchFn) => {
    const id = Math.random().toString(36).slice(2, 9);
    refetchMap.current.set(id, fn);
    return id;
  };

  const unregisterRefetch = (id: string) => {
    refetchMap.current.delete(id);
  };

  const triggerRefetch = async () => {
    const fns = Array.from(refetchMap.current.values());
    await Promise.all(
      fns.map(async (fn) => {
        try {
          await fn();
        } catch {
          // ignore per-callback error
        }
      })
    );
  };

  return (
    <NetworkContext.Provider
      value={{
        isConnected: state?.isConnected ?? null,
        isInternetReachable: state?.isInternetReachable ?? null,
        error,
        registerRefetch,
        unregisterRefetch,
        triggerRefetch,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
