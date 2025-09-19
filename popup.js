// Popup script for Human Typing Simulator
class PopupController {
  constructor() {
    this.elements = {
      toggle: document.getElementById('toggle'),
      status: document.getElementById('status'),
      minSpeed: document.getElementById('minSpeed'),
      maxSpeed: document.getElementById('maxSpeed'),
      minSpeedValue: document.getElementById('minSpeedValue'),
      maxSpeedValue: document.getElementById('maxSpeedValue'),
      errorRate: document.getElementById('errorRate'),
      errorRateValue: document.getElementById('errorRateValue'),
      minCorrection: document.getElementById('minCorrection'),
      maxCorrection: document.getElementById('maxCorrection'),
      minCorrectionValue: document.getElementById('minCorrectionValue'),
      maxCorrectionValue: document.getElementById('maxCorrectionValue')
    };

    this.settings = {
      enabled: false,
      typingSpeed: { min: 50, max: 150 },
      errorRate: 5,
      correctionDelay: { min: 200, max: 800 }
    };

    this.init();
  }

  async init() {
    // Load settings from storage
    await this.loadSettings();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Update UI with loaded settings
    this.updateUI();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'enabled', 'typingSpeed', 'errorRate', 'correctionDelay'
      ]);
      
      this.settings.enabled = result.enabled !== false; // default to true
      this.settings.typingSpeed = result.typingSpeed || { min: 50, max: 150 };
      this.settings.errorRate = result.errorRate || 5;
      this.settings.correctionDelay = result.correctionDelay || { min: 200, max: 800 };
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set({
        enabled: this.settings.enabled,
        typingSpeed: this.settings.typingSpeed,
        errorRate: this.settings.errorRate,
        correctionDelay: this.settings.correctionDelay
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  setupEventListeners() {
    // Toggle switch
    this.elements.toggle.addEventListener('click', () => {
      this.settings.enabled = !this.settings.enabled;
      this.updateUI();
      this.saveSettings();
      this.notifyContentScript();
    });

    // Typing speed inputs
    this.elements.minSpeed.addEventListener('input', (e) => {
      const value = parseInt(e.target.value) || 50;
      this.settings.typingSpeed.min = Math.max(10, Math.min(500, value));
      this.elements.minSpeedValue.textContent = this.settings.typingSpeed.min;
      this.saveSettings();
      this.notifyContentScript();
    });

    this.elements.maxSpeed.addEventListener('input', (e) => {
      const value = parseInt(e.target.value) || 150;
      this.settings.typingSpeed.max = Math.max(10, Math.min(500, value));
      this.elements.maxSpeedValue.textContent = this.settings.typingSpeed.max;
      this.saveSettings();
      this.notifyContentScript();
    });

    // Error rate slider
    this.elements.errorRate.addEventListener('input', (e) => {
      this.settings.errorRate = parseInt(e.target.value);
      this.elements.errorRateValue.textContent = this.settings.errorRate + '%';
      this.saveSettings();
      this.notifyContentScript();
    });

    // Correction delay inputs
    this.elements.minCorrection.addEventListener('input', (e) => {
      const value = parseInt(e.target.value) || 200;
      this.settings.correctionDelay.min = Math.max(50, Math.min(2000, value));
      this.elements.minCorrectionValue.textContent = this.settings.correctionDelay.min;
      this.saveSettings();
      this.notifyContentScript();
    });

    this.elements.maxCorrection.addEventListener('input', (e) => {
      const value = parseInt(e.target.value) || 800;
      this.settings.correctionDelay.max = Math.max(50, Math.min(2000, value));
      this.elements.maxCorrectionValue.textContent = this.settings.correctionDelay.max;
      this.saveSettings();
      this.notifyContentScript();
    });
  }

  updateUI() {
    // Update toggle state
    if (this.settings.enabled) {
      this.elements.toggle.classList.add('active');
      this.elements.status.textContent = 'Extension is enabled';
      this.elements.status.className = 'status enabled';
    } else {
      this.elements.toggle.classList.remove('active');
      this.elements.status.textContent = 'Extension is disabled';
      this.elements.status.className = 'status disabled';
    }

    // Update typing speed values
    this.elements.minSpeed.value = this.settings.typingSpeed.min;
    this.elements.maxSpeed.value = this.settings.typingSpeed.max;
    this.elements.minSpeedValue.textContent = this.settings.typingSpeed.min;
    this.elements.maxSpeedValue.textContent = this.settings.typingSpeed.max;

    // Update error rate
    this.elements.errorRate.value = this.settings.errorRate;
    this.elements.errorRateValue.textContent = this.settings.errorRate + '%';

    // Update correction delay values
    this.elements.minCorrection.value = this.settings.correctionDelay.min;
    this.elements.maxCorrection.value = this.settings.correctionDelay.max;
    this.elements.minCorrectionValue.textContent = this.settings.correctionDelay.min;
    this.elements.maxCorrectionValue.textContent = this.settings.correctionDelay.max;
  }

  async notifyContentScript() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'updateSettings',
          settings: {
            typingSpeed: this.settings.typingSpeed,
            errorRate: this.settings.errorRate / 100, // Convert percentage to decimal
            correctionDelay: this.settings.correctionDelay
          }
        });
      }
    } catch (error) {
      console.log('Could not notify content script:', error);
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
