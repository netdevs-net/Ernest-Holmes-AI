#!/usr/bin/env python3
"""
Ernest Holmes Text Downloader
Downloads public domain works by Ernest Holmes for AI training
"""

import requests
import os
import time
from pathlib import Path

# URLs for Ernest Holmes texts (public domain works)
TEXTS = {
    "science_of_mind": {
        "url": "https://archive.org/download/scienceofmind00holm/scienceofmind00holm.pdf",
        "title": "The Science of Mind (1938)",
        "filename": "science-of-mind-1938.pdf"
    },
    "creative_mind_success": {
        "url": "https://archive.org/download/creativemindsucc00holm/creativemindsucc00holm.pdf",
        "title": "Creative Mind and Success (1919)",
        "filename": "creative-mind-success-1919.pdf"
    },
    "hidden_power_bible": {
        "url": "https://archive.org/download/hiddenpowerofbib00holm/hiddenpowerofbib00holm.pdf",
        "title": "The Hidden Power of the Bible (1929)",
        "filename": "hidden-power-bible-1929.pdf"
    },
    "this_thing_called_you": {
        "url": "https://archive.org/download/thingcalledyou00holm/thingcalledyou00holm.pdf",
        "title": "This Thing Called You (1948)",
        "filename": "this-thing-called-you-1948.pdf"
    },
    "words_that_heal": {
        "url": "https://archive.org/download/wordsthathealtod00holm/wordsthathealtod00holm.pdf",
        "title": "Words That Heal Today (1949)",
        "filename": "words-that-heal-1949.pdf"
    },
    "living_science_mind": {
        "url": "https://archive.org/download/livingscienceofm00holm/livingscienceofm00holm.pdf",
        "title": "Living the Science of Mind (1955)",
        "filename": "living-science-mind-1955.pdf"
    },
    "art_of_life": {
        "url": "https://archive.org/download/artoflife00holm/artoflife00holm.pdf",
        "title": "The Art of Life (1960)",
        "filename": "art-of-life-1960.pdf"
    },
    "how_to_use_science_mind": {
        "url": "https://archive.org/download/howtousescienceo00holm/howtousescienceo00holm.pdf",
        "title": "How to Use the Science of Mind (1944)",
        "filename": "how-to-use-science-mind-1944.pdf"
    }
}

def create_directories():
    """Create necessary directories"""
    directories = [
        "texts",
        "audio",
        "metadata"
    ]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✓ Created directory: {directory}")

def download_file(url, filename, title):
    """Download a single file with progress tracking"""
    filepath = Path("texts") / filename
    
    # Skip if file already exists
    if filepath.exists():
        print(f"⏭️  Skipping {title} (already exists)")
        return True
    
    try:
        print(f"📥 Downloading {title}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Get file size for progress tracking
        total_size = int(response.headers.get('content-length', 0))
        
        with open(filepath, 'wb') as f:
            downloaded = 0
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total_size > 0:
                        percent = (downloaded / total_size) * 100
                        print(f"\r   Progress: {percent:.1f}%", end='', flush=True)
        
        print(f"\n✓ Downloaded {title} ({filepath.stat().st_size / 1024 / 1024:.1f} MB)")
        return True
        
    except Exception as e:
        print(f"\n❌ Error downloading {title}: {e}")
        return False

def create_metadata():
    """Create metadata file with download information"""
    metadata = {
        "download_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "source": "Internet Archive",
        "copyright_status": "Public Domain",
        "files": []
    }
    
    for key, info in TEXTS.items():
        filepath = Path("texts") / info["filename"]
        if filepath.exists():
            metadata["files"].append({
                "key": key,
                "title": info["title"],
                "filename": info["filename"],
                "size_mb": filepath.stat().st_size / 1024 / 1024,
                "url": info["url"]
            })
    
    # Write metadata to file
    import json
    with open("metadata/download_info.json", "w") as f:
        json.dump(metadata, f, indent=2)
    
    print("✓ Created metadata file: metadata/download_info.json")

def main():
    """Main download function"""
    print("🚀 Ernest Holmes Text Downloader")
    print("=" * 50)
    
    # Create directories
    create_directories()
    print()
    
    # Download all texts
    successful_downloads = 0
    total_downloads = len(TEXTS)
    
    for key, info in TEXTS.items():
        success = download_file(info["url"], info["filename"], info["title"])
        if success:
            successful_downloads += 1
        print()  # Add spacing between downloads
    
    # Create metadata
    create_metadata()
    print()
    
    # Summary
    print("📊 Download Summary")
    print("=" * 50)
    print(f"Total files: {total_downloads}")
    print(f"Successfully downloaded: {successful_downloads}")
    print(f"Failed: {total_downloads - successful_downloads}")
    
    if successful_downloads > 0:
        print(f"\n📁 Files saved to: {Path('texts').absolute()}")
        print(f"📋 Metadata saved to: {Path('metadata').absolute()}")
        print("\n🎉 Download complete! Ready for AI training.")

if __name__ == "__main__":
    main() 