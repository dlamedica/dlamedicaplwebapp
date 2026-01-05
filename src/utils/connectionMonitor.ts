/**
 * Connection monitor utility
 * Senior specialist implementation
 * 
 * Monitors network connection status and quality
 */

import { log } from './logger';
import { events } from './eventEmitter';

type ConnectionType = 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
type EffectiveType = '2g' | '3g' | '4g' | 'slow-2g';

interface NetworkInformation {
  downlink: number;
  effectiveType: EffectiveType;
  onchange: ((this: NetworkInformation, ev: Event) => any) | null;
  rtt: number;
  saveData: boolean;
  type: ConnectionType;
}

class ConnectionMonitor {
  private online: boolean = true;
  private connectionInfo: NetworkInformation | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  /**
   * Initialize connection monitoring
   */
  private initialize(): void {
    // Online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // Network information API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        this.connectionInfo = connection as NetworkInformation;
        connection.addEventListener('change', this.handleConnectionChange);
        this.updateConnectionInfo();
      }
    }

    // Initial state
    this.online = navigator.onLine;
    this.updateConnectionInfo();
  }

  /**
   * Handle online event
   */
  private handleOnline = (): void => {
    this.online = true;
    log.info('Network connection restored');
    events.emit('network-online');
    this.notifyListeners();
  };

  /**
   * Handle offline event
   */
  private handleOffline = (): void => {
    this.online = false;
    log.warn('Network connection lost');
    events.emit('network-offline');
    this.notifyListeners();
  };

  /**
   * Handle connection change
   */
  private handleConnectionChange = (): void => {
    this.updateConnectionInfo();
    log.info('Network connection changed', this.getConnectionDetails());
    events.emit('network-change', this.getConnectionDetails());
    this.notifyListeners();
  };

  /**
   * Update connection info
   */
  private updateConnectionInfo(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        this.connectionInfo = connection as NetworkInformation;
      }
    }
  }

  /**
   * Get connection details
   */
  getConnectionDetails(): {
    online: boolean;
    type?: ConnectionType;
    effectiveType?: EffectiveType;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  } {
    return {
      online: this.online,
      type: this.connectionInfo?.type,
      effectiveType: this.connectionInfo?.effectiveType,
      downlink: this.connectionInfo?.downlink,
      rtt: this.connectionInfo?.rtt,
      saveData: this.connectionInfo?.saveData,
    };
  }

  /**
   * Check if online
   */
  isOnline(): boolean {
    return this.online;
  }

  /**
   * Check if connection is slow
   */
  isSlowConnection(): boolean {
    if (!this.connectionInfo) return false;
    return this.connectionInfo.effectiveType === '2g' || this.connectionInfo.effectiveType === 'slow-2g';
  }

  /**
   * Check if save data mode is enabled
   */
  isSaveDataEnabled(): boolean {
    return this.connectionInfo?.saveData || false;
  }

  /**
   * Get estimated bandwidth in Mbps
   */
  getEstimatedBandwidth(): number | null {
    return this.connectionInfo?.downlink || null;
  }

  /**
   * Get round-trip time in ms
   */
  getRTT(): number | null {
    return this.connectionInfo?.rtt || null;
  }

  /**
   * Subscribe to connection changes
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        log.error('Error in connection monitor listener', error as Error);
      }
    });
  }

  /**
   * Cleanup
   */
  destroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    if (this.connectionInfo && 'addEventListener' in this.connectionInfo) {
      this.connectionInfo.removeEventListener('change', this.handleConnectionChange);
    }
    this.listeners.clear();
  }
}

// Singleton instance
export const connectionMonitor = new ConnectionMonitor();

// Export convenience functions
export const connection = {
  isOnline: () => connectionMonitor.isOnline(),
  isSlowConnection: () => connectionMonitor.isSlowConnection(),
  isSaveDataEnabled: () => connectionMonitor.isSaveDataEnabled(),
  getEstimatedBandwidth: () => connectionMonitor.getEstimatedBandwidth(),
  getRTT: () => connectionMonitor.getRTT(),
  getConnectionDetails: () => connectionMonitor.getConnectionDetails(),
  subscribe: (callback: () => void) => connectionMonitor.subscribe(callback),
};

export default connectionMonitor;

