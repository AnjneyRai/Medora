/**
 * Medora - Firebase Client Sync Manager
 * Supports Web Firebase v10/v11 SDK loading & seamless LocalStorage Fallback
 */

class FirebaseSyncManager {
  constructor() {
    this.config = JSON.parse(localStorage.getItem('medora_firebase_config')) || null;
    this.isConnected = false;
    this.app = null;
    this.db = null;
  }

  getConfig() {
    return this.config;
  }

  saveConfig(newConfig) {
    this.config = newConfig;
    localStorage.setItem('medora_firebase_config', JSON.stringify(newConfig));
    this.initFirebase();
  }

  async initFirebase() {
    if (!this.config || !this.config.apiKey || !this.config.projectId) {
      console.log('Firebase: Config missing or incomplete. Using LocalStorage fallback mode.');
      this.updateStatus(false, 'LocalStorage Mode (Demo Ready)');
      return false;
    }

    try {
      // Dynamic import of Firebase modules via CDN when credentials are set
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
      const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

      this.app = initializeApp(this.config);
      this.db = getFirestore(this.app);
      this.isConnected = true;
      this.updateStatus(true, 'Firebase Cloud Synced');
      console.log('Firebase initialized successfully!');
      return true;
    } catch (err) {
      console.error('Firebase Initialization Error:', err);
      this.updateStatus(false, 'Connection Error (LocalStorage Mode)');
      return false;
    }
  }

  updateStatus(connected, text) {
    const dot = document.getElementById('firebase-status-dot');
    const textEl = document.getElementById('firebase-status-text');

    if (dot) {
      dot.className = 'status-dot ' + (connected ? 'connected' : '');
    }
    if (textEl) {
      textEl.innerText = text;
    }
  }
}

export const firebaseSync = new FirebaseSyncManager();
