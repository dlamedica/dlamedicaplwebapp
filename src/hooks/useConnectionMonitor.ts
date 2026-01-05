import { useState, useEffect } from 'react';
import { connectionMonitor } from '../utils/connectionMonitor';

/**
 * Custom hook for connection monitoring
 * 
 * @example
 * const { isOnline, isSlowConnection, connectionDetails } = useConnectionMonitor();
 * 
 * if (!isOnline) {
 *   return <OfflineMessage />;
 * }
 */
export function useConnectionMonitor() {
  const [isOnline, setIsOnline] = useState(() => connectionMonitor.isOnline());
  const [connectionDetails, setConnectionDetails] = useState(() =>
    connectionMonitor.getConnectionDetails()
  );

  useEffect(() => {
    const unsubscribe = connectionMonitor.subscribe(() => {
      setIsOnline(connectionMonitor.isOnline());
      setConnectionDetails(connectionMonitor.getConnectionDetails());
    });

    return unsubscribe;
  }, []);

  return {
    isOnline,
    isSlowConnection: connectionMonitor.isSlowConnection(),
    isSaveDataEnabled: connectionMonitor.isSaveDataEnabled(),
    estimatedBandwidth: connectionMonitor.getEstimatedBandwidth(),
    rtt: connectionMonitor.getRTT(),
    connectionDetails,
  };
}

