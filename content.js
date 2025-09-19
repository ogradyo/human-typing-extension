// Human Typing Simulator Content Script
class HumanTypingSimulator {
  constructor() {
    this.isEnabled = true;
    this.typingSpeed = { min: 50, max: 150 }; // milliseconds between keystrokes
    this.errorRate = 0.05; // 5% chance of error
    this.correctionDelay = { min: 200, max: 800 }; // delay before correcting errors
    this.isTyping = false;
    
    this.init();
  }

  init() {
    // Load settings from storage
    this.loadSettings();
    
    // Listen for paste events
    document.addEventListener('paste', this.handlePaste.bind(this));
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggle') {
        this.isEnabled = request.enabled;
        this.saveSettings();
      } else if (request.action === 'updateSettings') {
        this.updateSettings(request.settings);
        this.saveSettings();
      } else if (request.action === 'getSettings') {
        sendResponse({
          enabled: this.isEnabled,
          typingSpeed: this.typingSpeed,
          errorRate: this.errorRate,
          correctionDelay: this.correctionDelay
        });
      }
    });
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'enabled', 'typingSpeed', 'errorRate', 'correctionDelay'
      ]);
      
      this.isEnabled = result.enabled !== false; // default to true
      this.typingSpeed = result.typingSpeed || { min: 50, max: 150 };
      this.errorRate = result.errorRate || 0.05;
      this.correctionDelay = result.correctionDelay || { min: 200, max: 800 };
    } catch (error) {
      console.log('Human Typing Simulator: Using default settings');
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set({
        enabled: this.isEnabled,
        typingSpeed: this.typingSpeed,
        errorRate: this.errorRate,
        correctionDelay: this.correctionDelay
      });
    } catch (error) {
      console.error('Human Typing Simulator: Failed to save settings', error);
    }
  }

  updateSettings(settings) {
    this.typingSpeed = settings.typingSpeed || this.typingSpeed;
    this.errorRate = settings.errorRate || this.errorRate;
    this.correctionDelay = settings.correctionDelay || this.correctionDelay;
  }

  handlePaste(event) {
    if (!this.isEnabled || this.isTyping) {
      return;
    }

    // Prevent default paste behavior
    event.preventDefault();
    
    // Get the pasted text
    const pastedText = (event.clipboardData || window.clipboardData).getData('text');
    
    if (!pastedText) {
      return;
    }

    // Find the target element
    const target = event.target;
    if (!this.isEditableElement(target)) {
      return;
    }

    // Start typing simulation
    this.simulateTyping(target, pastedText);
  }

  isEditableElement(element) {
    const editableTags = ['INPUT', 'TEXTAREA'];
    const editableTypes = ['text', 'email', 'password', 'search', 'tel', 'url'];
    
    if (editableTags.includes(element.tagName)) {
      return editableTypes.includes(element.type) || element.tagName === 'TEXTAREA';
    }
    
    // Check for contenteditable elements
    return element.contentEditable === 'true' || element.isContentEditable;
  }

  async simulateTyping(element, text) {
    this.isTyping = true;
    
    // Clear existing content
    this.clearElement(element);
    
    // Focus the element
    element.focus();
    
    // Type the text character by character
    for (let i = 0; i < text.length; i++) {
      if (!this.isTyping) break; // Allow interruption
      
      const char = text[i];
      const shouldMakeError = Math.random() < this.errorRate;
      
      if (shouldMakeError && i > 0) {
        // Make a typing error
        await this.makeTypingError(element, char, i);
      } else {
        // Type normally
        await this.typeCharacter(element, char);
      }
      
      // Random delay between keystrokes
      const delay = this.getRandomDelay(this.typingSpeed);
      await this.sleep(delay);
    }
    
    this.isTyping = false;
  }

  async makeTypingError(element, correctChar, position) {
    // Generate a typo
    const typo = this.generateTypo(correctChar);
    
    // Type the typo
    await this.typeCharacter(element, typo);
    
    // Wait a bit (human hesitation)
    const hesitationDelay = this.getRandomDelay({ min: 100, max: 300 });
    await this.sleep(hesitationDelay);
    
    // Realize the mistake and backspace
    await this.backspace(element);
    
    // Type the correct character
    await this.typeCharacter(element, correctChar);
    
    // Sometimes add an extra correction delay
    if (Math.random() < 0.3) {
      const correctionDelay = this.getRandomDelay(this.correctionDelay);
      await this.sleep(correctionDelay);
    }
  }

  generateTypo(char) {
    const commonTypos = {
      'a': ['s', 'q', 'w'],
      'e': ['r', 'w', 'd'],
      'i': ['o', 'u', 'k'],
      'o': ['i', 'p', 'l'],
      'u': ['y', 'i', 'j'],
      's': ['a', 'd', 'w'],
      'd': ['s', 'e', 'f'],
      'f': ['d', 'g', 'r'],
      'g': ['f', 'h', 't'],
      'h': ['g', 'j', 'y'],
      'j': ['h', 'k', 'u'],
      'k': ['j', 'l', 'i'],
      'l': ['k', 'o', 'p'],
      'q': ['w', 'a', 's'],
      'w': ['q', 'e', 's'],
      'r': ['e', 't', 'f'],
      't': ['r', 'y', 'g'],
      'y': ['t', 'u', 'h'],
      'z': ['x', 'a', 's'],
      'x': ['z', 'c', 'd'],
      'c': ['x', 'v', 'f'],
      'v': ['c', 'b', 'g'],
      'b': ['v', 'n', 'h'],
      'n': ['b', 'm', 'j'],
      'm': ['n', 'k', 'l']
    };
    
    const lowerChar = char.toLowerCase();
    if (commonTypos[lowerChar]) {
      const typoOptions = commonTypos[lowerChar];
      const selectedTypo = typoOptions[Math.floor(Math.random() * typoOptions.length)];
      return char === char.toUpperCase() ? selectedTypo.toUpperCase() : selectedTypo;
    }
    
    // If no common typo available, return a random nearby character
    return this.getRandomNearbyChar(char);
  }

  getRandomNearbyChar(char) {
    const charCode = char.charCodeAt(0);
    const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    return String.fromCharCode(charCode + variation);
  }

  async typeCharacter(element, char) {
    if (this.isInputElement(element)) {
      element.value += char;
    } else {
      // For contenteditable elements
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(char));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    
    // Trigger input event
    this.triggerInputEvent(element);
  }

  async backspace(element) {
    if (this.isInputElement(element)) {
      element.value = element.value.slice(0, -1);
    } else {
      // For contenteditable elements
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range.startOffset > 0) {
          range.setStart(range.startContainer, range.startOffset - 1);
          range.deleteContents();
        }
      }
    }
    
    // Trigger input event
    this.triggerInputEvent(element);
  }

  clearElement(element) {
    if (this.isInputElement(element)) {
      element.value = '';
    } else {
      element.textContent = '';
    }
  }

  isInputElement(element) {
    return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
  }

  triggerInputEvent(element) {
    const events = ['input', 'keyup', 'change'];
    events.forEach(eventType => {
      const event = new Event(eventType, { bubbles: true, cancelable: true });
      element.dispatchEvent(event);
    });
  }

  getRandomDelay(range) {
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize the simulator when the script loads
const humanTypingSimulator = new HumanTypingSimulator();
