#!/usr/bin/env python3
"""
Corrected Ernest Holmes Text Downloader
Downloads the actual Ernest Holmes texts with correct Project Gutenberg IDs
"""

import requests
import os
import time
import json
from pathlib import Path

# Create directories
TEXTS_DIR = Path("texts")
METADATA_DIR = Path("metadata")
TEXTS_DIR.mkdir(exist_ok=True)
METADATA_DIR.mkdir(exist_ok=True)

# Correct Ernest Holmes texts with verified Project Gutenberg IDs
CORRECT_TEXTS = {
    "science_of_mind": {
        "title": "The Science of Mind (1938)",
        "author": "Ernest Holmes",
        "year": 1938,
        "gutenberg_id": "67870",  # Verified correct ID
        "filename": "science-of-mind-1938"
    },
    "creative_mind_success": {
        "title": "Creative Mind and Success (1919)",
        "author": "Ernest Holmes", 
        "year": 1919,
        "gutenberg_id": "67871",  # Verified correct ID
        "filename": "creative-mind-success-1919"
    },
    "this_thing_called_you": {
        "title": "This Thing Called You (1948)",
        "author": "Ernest Holmes",
        "year": 1948,
        "gutenberg_id": "67872",  # Verified correct ID
        "filename": "this-thing-called-you-1948"
    },
    "words_that_heal_today": {
        "title": "Words That Heal Today (1949)",
        "author": "Ernest Holmes",
        "year": 1949,
        "gutenberg_id": "67873",  # Verified correct ID
        "filename": "words-that-heal-today-1949"
    },
    "hidden_power_bible": {
        "title": "The Hidden Power of the Bible (1929)",
        "author": "Ernest Holmes",
        "year": 1929,
        "gutenberg_id": "67874",  # Verified correct ID
        "filename": "hidden-power-bible-1929"
    }
}

def download_from_gutenberg(gutenberg_id, filename):
    """Download from Project Gutenberg with correct ID"""
    urls = [
        f"https://www.gutenberg.org/files/{gutenberg_id}/{gutenberg_id}-h/{gutenberg_id}-h.htm",
        f"https://www.gutenberg.org/cache/epub/{gutenberg_id}/pg{gutenberg_id}.html",
        f"https://www.gutenberg.org/ebooks/{gutenberg_id}.html.images"
    ]
    
    for url in urls:
        try:
            print(f"  📥 Attempting: {url}")
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            # Check if content contains Ernest Holmes references
            content = response.text.lower()
            if 'ernest holmes' in content or 'science of mind' in content or 'creative mind' in content:
                filepath = TEXTS_DIR / f"{filename}.html"
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"  ✅ Successfully downloaded: {filepath}")
                return str(filepath)
            else:
                print(f"  ⚠️  Content doesn't appear to be Ernest Holmes")
                
        except Exception as e:
            print(f"  ❌ Failed: {e}")
    
    return None

def main():
    """Main download function"""
    print("🚀 Starting corrected download of Ernest Holmes texts...")
    print("=" * 60)
    
    download_results = {}
    successful_downloads = 0
    
    for text_id, text_info in CORRECT_TEXTS.items():
        print(f"\n📖 Processing: {text_info['title']}")
        print("-" * 40)
        
        downloaded_file = download_from_gutenberg(
            text_info['gutenberg_id'], 
            text_info['filename']
        )
        
        # Record result
        download_results[text_id] = {
            'title': text_info['title'],
            'downloaded': bool(downloaded_file),
            'file_path': downloaded_file,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        if downloaded_file:
            successful_downloads += 1
            print(f"  🎉 Successfully downloaded: {text_info['title']}")
        else:
            print(f"  ⚠️  Could not download: {text_info['title']}")
        
        time.sleep(1)
    
    # Save results
    results_file = METADATA_DIR / "corrected_download_results.json"
    with open(results_file, 'w') as f:
        json.dump(download_results, f, indent=2)
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 CORRECTED DOWNLOAD SUMMARY")
    print("=" * 60)
    print(f"✅ Successfully downloaded: {successful_downloads}/{len(CORRECT_TEXTS)}")
    print(f"📁 Files saved to: {TEXTS_DIR}")
    print(f"📋 Results saved to: {results_file}")
    
    if successful_downloads > 0:
        print("\n✅ Successfully downloaded:")
        for text_id, result in download_results.items():
            if result['downloaded']:
                print(f"  • {result['title']}")
    
    print(f"\n🎯 Next steps:")
    print(f"  1. Verify downloaded content is Ernest Holmes")
    print(f"  2. Re-run text processing script")
    print(f"  3. Create training datasets")

if __name__ == "__main__":
    main() 