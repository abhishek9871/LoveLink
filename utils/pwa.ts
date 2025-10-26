export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // navigator.serviceWorker.register('/service-worker.js')
      //   .then(registration => {
      //     console.log('ServiceWorker registration successful with scope: ', registration.scope);
      //   })
      //   .catch(error => {
      //     console.log('ServiceWorker registration failed: ', error);
      //   });
    });
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  }
};
