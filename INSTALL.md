# Installation Guide

## Quick Setup

1. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/` in your browser
   - Or click the three dots menu → More tools → Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to and select the `human-typing-extension` folder
   - Click "Select Folder"

4. **Verify Installation**
   - You should see the extension appear in your extensions list
   - The extension icon should appear in your toolbar

## Creating Icons (Optional)

If you want custom icons:

1. Open `create_icons.html` in your browser
2. The page will automatically generate and download three icon files
3. Replace the placeholder icon files with the downloaded ones

## Usage

1. Click the extension icon in your toolbar
2. Toggle the extension on/off
3. Adjust settings as needed:
   - **Typing Speed**: 50-500ms between keystrokes
   - **Error Rate**: 0-20% chance of typos
   - **Correction Delay**: 200-2000ms before correcting errors
4. Navigate to any website and try pasting text into input fields

## Troubleshooting

- **Extension not working**: Make sure it's enabled in the popup
- **Settings not saving**: Check that you have storage permissions
- **Not working on some sites**: Some sites may block content scripts

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Human Typing Simulator"
3. Click "Remove"
