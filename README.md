# Human Typing Simulator Chrome Extension

A Chrome extension that simulates human typing when you paste text, complete with realistic errors and corrections.

## Features

- **Realistic Typing Simulation**: Types character by character with human-like delays
- **Error Simulation**: Introduces realistic typos and corrections
- **Configurable Settings**: Adjust typing speed, error rate, and correction delays
- **Works on All Websites**: Compatible with input fields, textareas, and contenteditable elements
- **Easy Toggle**: Enable/disable the extension with a simple toggle

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your toolbar

## Usage

1. Click the extension icon to open the settings popup
2. Toggle the extension on/off
3. Adjust typing speed, error rate, and correction delays as desired
4. Navigate to any website and try pasting text into input fields
5. The extension will automatically simulate human typing

## Settings

- **Typing Speed**: Control the delay between keystrokes (50-500ms)
- **Error Rate**: Set the probability of making typing errors (0-20%)
- **Correction Delay**: Configure how long to wait before correcting errors (200-2000ms)

## How It Works

The extension intercepts paste events and replaces them with a character-by-character typing simulation. It includes:

- Random delays between keystrokes
- Realistic typo generation based on common keyboard mistakes
- Human-like hesitation and correction patterns
- Support for both input elements and contenteditable areas

## Technical Details

- **Manifest Version**: 3
- **Permissions**: activeTab, storage
- **Content Script**: Injected into all web pages
- **Storage**: Settings are synced across devices

## Development

The extension consists of:
- `manifest.json`: Extension configuration
- `content.js`: Main typing simulation logic
- `popup.html/js`: Settings interface
- `background.js`: Extension lifecycle management

## License

MIT License - feel free to modify and distribute.
