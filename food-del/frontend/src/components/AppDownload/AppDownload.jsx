import React, { useEffect, useState } from 'react';
import './AppDownload.css';
import { assets } from '../../assets/assets';

const AppDownload = () => {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault(); // Prevent the default browser install prompt
      setInstallPrompt(event); // Save the event for later use
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Clean up the event listener
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt(); // Show the install prompt
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null); // Clear the saved prompt
      });
    }
  };

  return (
    <div className='app-download' id='app-download'>
      <p>For Better Experience Download <br />Melo App</p>
      <div className="app-download-platforms">
        <img src={assets.play_store} alt="Play Store" />
        <img src={assets.app_store} alt="App Store" />
      </div>
      {/* Add an install button for PWA */}
      {installPrompt && (
        <button className="install-button" onClick={handleInstallClick}>
          Install Melo App
        </button>
      )}
    </div>
  );
};

export default AppDownload;
