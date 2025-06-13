import { useState, useEffect } from 'react';

const useEnvironment = () => {
  const [environment, setEnvironment] = useState({
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isOnline: navigator.onLine,
    browserInfo: {
      name: '',
      version: '',
      platform: navigator.platform
    },
    screenSize: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    supportedFeatures: {
      webRTC: false,
      webGL: false,
      serviceWorker: false,
      pushNotifications: false,
      geolocation: false,
      camera: false,
      microphone: false
    }
  });

  useEffect(() => {
    // Detect device type
    const detectDeviceType = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      
      const isMobile = width <= 768 || /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = width > 768 && width <= 1024;
      const isDesktop = width > 1024;

      return { isMobile, isTablet, isDesktop };
    };

    // Detect browser
    const detectBrowser = () => {
      const userAgent = navigator.userAgent;
      let name = 'Unknown';
      let version = 'Unknown';

      if (userAgent.indexOf('Chrome') > -1) {
        name = 'Chrome';
        version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
      } else if (userAgent.indexOf('Firefox') > -1) {
        name = 'Firefox';
        version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
      } else if (userAgent.indexOf('Safari') > -1) {
        name = 'Safari';
        version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
      } else if (userAgent.indexOf('Edge') > -1) {
        name = 'Edge';
        version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
      }

      return { name, version };
    };

    // Check supported features
    const checkSupportedFeatures = () => {
      return {
        webRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        webGL: (() => {
          try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
          } catch (e) {
            return false;
          }
        })(),
        serviceWorker: 'serviceWorker' in navigator,
        pushNotifications: 'PushManager' in window,
        geolocation: 'geolocation' in navigator,
        camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        microphone: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      };
    };

    // Update environment state
    const updateEnvironment = () => {
      const deviceType = detectDeviceType();
      const browserInfo = detectBrowser();
      const supportedFeatures = checkSupportedFeatures();

      setEnvironment(prev => ({
        ...prev,
        ...deviceType,
        browserInfo: {
          ...prev.browserInfo,
          ...browserInfo
        },
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        supportedFeatures,
        isOnline: navigator.onLine
      }));
    };

    // Initial update
    updateEnvironment();

    // Listen for resize events
    const handleResize = () => {
      updateEnvironment();
    };

    // Listen for online/offline events
    const handleOnline = () => {
      setEnvironment(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setEnvironment(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Utility methods
  const isFeatureSupported = (feature) => {
    return environment.supportedFeatures[feature] || false;
  };

  const getDeviceType = () => {
    if (environment.isMobile) return 'mobile';
    if (environment.isTablet) return 'tablet';
    if (environment.isDesktop) return 'desktop';
    return 'unknown';
  };

  const getBreakpoint = () => {
    const width = environment.screenSize.width;
    if (width < 576) return 'xs';
    if (width < 768) return 'sm';
    if (width < 992) return 'md';
    if (width < 1200) return 'lg';
    return 'xl';
  };

  return {
    ...environment,
    isFeatureSupported,
    getDeviceType,
    getBreakpoint
  };
};

export default useEnvironment;
