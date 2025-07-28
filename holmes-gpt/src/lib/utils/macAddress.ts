/**
 * Client-side utilities for device identification
 * Note: Due to browser security restrictions, we cannot directly access MAC addresses
 * Instead, we create a device fingerprint based on available information
 */

export interface DeviceInfo {
  fingerprint: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookieEnabled: boolean;
  doNotTrack: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  publicIP?: string;
}

/**
 * Generate a device fingerprint
 * This is a privacy-friendly alternative to MAC address
 */
export function generateDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'server_fingerprint';
  }
  
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.platform,
    navigator.cookieEnabled ? '1' : '0',
    navigator.doNotTrack || '0'
  ];
  
  // Create a hash of the components
  const fingerprint = components.join('|');
  return btoa(fingerprint).substring(0, 16); // Base64 encode and truncate
}

/**
 * Get complete device information
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      fingerprint: 'server_fingerprint',
      userAgent: 'server',
      screenResolution: '0x0',
      timezone: 'UTC',
      language: 'en',
      platform: 'server',
      cookieEnabled: false,
      doNotTrack: false
    };
  }
  
  return {
    fingerprint: generateDeviceFingerprint(),
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: Boolean(navigator.doNotTrack)
  };
}

/**
 * Get network information (if available)
 * Note: This requires HTTPS and user permission
 */
export async function getNetworkInfo(): Promise<Partial<DeviceInfo>> {
  if (typeof window === 'undefined') {
    return {};
  }
  
  const networkInfo: Partial<DeviceInfo> = {};
  
  try {
    // Check if Network Information API is available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        networkInfo.effectiveType = connection.effectiveType;
        networkInfo.downlink = connection.downlink;
        networkInfo.rtt = connection.rtt;
      }
    }
    
    // Try to get IP address using a public service
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      networkInfo.publicIP = data.ip;
    } catch (error) {
      console.log('Could not fetch public IP:', error);
    }
    
  } catch (error) {
    console.log('Network information not available:', error);
  }
  
  return networkInfo;
}

/**
 * Create a unique session identifier
 */
export function createSessionId(): string {
  if (typeof window === 'undefined') {
    return 'server_session_' + Date.now();
  }
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const fingerprint = generateDeviceFingerprint();
  
  return `session_${timestamp}_${random}_${fingerprint}`;
}

/**
 * Store device information in localStorage
 */
export function storeDeviceInfo(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const deviceInfo = getDeviceInfo();
    const sessionId = createSessionId();
    
    localStorage.setItem('holmes_device_fingerprint', deviceInfo.fingerprint);
    localStorage.setItem('holmes_session_id', sessionId);
    localStorage.setItem('holmes_device_info', JSON.stringify(deviceInfo));
    
    console.log('Device information stored:', deviceInfo);
  } catch (error) {
    console.error('Failed to store device information:', error);
  }
}

/**
 * Retrieve stored device information
 */
export function getStoredDeviceInfo(): Partial<DeviceInfo> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem('holmes_device_info');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to retrieve device information:', error);
    return {};
  }
}

/**
 * Get the device fingerprint
 */
export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'server';
  
  const stored = localStorage.getItem('holmes_device_fingerprint');
  if (stored) {
    return stored;
  }
  
  // Generate and store if not available
  const fingerprint = generateDeviceFingerprint();
  localStorage.setItem('holmes_device_fingerprint', fingerprint);
  return fingerprint;
}

/**
 * Get session ID
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  
  const stored = localStorage.getItem('holmes_session_id');
  if (stored) {
    return stored;
  }
  
  // Generate and store if not available
  const sessionId = createSessionId();
  localStorage.setItem('holmes_session_id', sessionId);
  return sessionId;
} 