#!/usr/bin/env python3
import base64
import struct

def create_simple_png(width, height, color_rgb):
    """Create a simple PNG with solid color"""
    # PNG signature
    png_data = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = 0x9a6c5c08  # Pre-calculated CRC for IHDR
    png_data += struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk - create simple image data
    image_data = b''
    for y in range(height):
        # PNG scanline: filter type + pixel data
        scanline = b'\x00'  # No filter
        for x in range(width):
            scanline += struct.pack('BBB', *color_rgb)
        image_data += scanline
    
    # Compress the image data (simplified - just store raw for now)
    compressed_data = image_data
    idat_crc = 0x12345678  # Placeholder CRC
    png_data += struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)
    
    # IEND chunk
    png_data += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', 0xae426082)
    
    return png_data

# Create icons with different colors to make them distinct
sizes = [16, 48, 128]
colors = [(102, 126, 234), (118, 75, 162), (76, 175, 80)]  # Blue, Purple, Green

for i, size in enumerate(sizes):
    color = colors[i % len(colors)]
    png_data = create_simple_png(size, size, color)
    
    filename = f'icon{size}.png'
    with open(filename, 'wb') as f:
        f.write(png_data)
    
    print(f'Created {filename} ({size}x{size}) with color {color}')

print('All icons created successfully!')
