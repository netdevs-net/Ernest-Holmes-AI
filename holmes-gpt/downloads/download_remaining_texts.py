#!/usr/bin/env python3
"""
Ernest Holmes Text Downloader - Remaining Texts
Downloads the remaining Ernest Holmes texts for AI training
"""

import requests
import os
import time
import json
from pathlib import Path
from urllib.parse import urljoin, urlparse
import re

# Create directories
TEXTS_DIR = Path("texts")
METADATA_DIR = Path("metadata")
MANUAL_DIR = Path("manual_downloads")
TEXTS_DIR.mkdir(exist_ok=True)
METADATA_DIR.mkdir(exist_ok=True)
MANUAL_DIR.mkdir(exist_ok=True)

# Remaining texts to download
REMAINING_TEXTS = {
    "this_thing_called_you": {
        "title": "This Thing Called You (1948)",
        "author": "Ernest Holmes",
        "year": 1948,
        "sources": [
            {
                "name": "Project Gutenberg",
                "url": "https://www.gutenberg.org/ebooks/67872",
                "format": "html"
            },
            {
                "name": "Internet Archive",
                "url": "https://archive.org/details/this_thing_called_you",
                "format": "pdf"
            }
        ],
        "filename": "this-thing-called-you-1948"
    },
    "words_that_heal_today": {
        "title": "Words That Heal Today (1949)",
        "author": "Ernest Holmes",
        "year": 1949,
        "sources": [
            {
                "name": "Project Gutenberg",
                "url": "https://www.gutenberg.org/ebooks/67873",
                "format": "html"
            },
            {
                "name": "Internet Archive",
                "url": "https://archive.org/details/words_that_heal_today",
                "format": "pdf"
            }
        ],
        "filename": "words-that-heal-today-1949"
    },
    "living_science_of_mind": {
        "title": "Living the Science of Mind (1955)",
        "author": "Ernest Holmes",
        "year": 1955,
        "sources": [
            {
                "name": "Internet Archive",
                "url": "https://archive.org/details/living_science_of_mind",
                "format": "pdf"
            }
        ],
        "filename": "living-science-of-mind-1955"
    },
    "hidden_power_bible": {
        "title": "The Hidden Power of the Bible (1929)",
        "author": "Ernest Holmes",
        "year": 1929,
        "sources": [
            {
                "name": "Project Gutenberg",
                "url": "https://www.gutenberg.org/ebooks/67874",
                "format": "html"
            },
            {
                "name": "Internet Archive",
                "url": "https://archive.org/details/hidden_power_bible",
                "format": "pdf"
            }
        ],
        "filename": "hidden-power-bible-1929"
    },
    "art_of_life": {
        "title": "The Art of Life (1960)",
        "author": "Ernest Holmes",
        "year": 1960,
        "sources": [
            {
                "name": "Internet Archive",
                "url": "https://archive.org/details/art_of_life_holmes",
                "format": "pdf"
            }
        ],
        "filename": "art-of-life-1960"
    },
    "how_to_use_science_of_mind": {
        "title": "How to Use the Science of Mind (1944)",
        "author": "Ernest Holmes",
        "year": 1944,
        "sources": [
            {
                "name": "Internet Archive",
                "url": "https://archive.org/details/how_to_use_science_of_mind",
                "format": "pdf"
            }
        ],
        "filename": "how-to-use-science-of-mind-1944"
    }
}

def download_file(url, filename, source_name):
    """Download a file from URL"""
    try:
        print(f"  📥 Attempting to download from {source_name}...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Determine file extension
        content_type = response.headers.get('content-type', '')
        if 'html' in content_type or 'text' in content_type:
            ext = '.html'
        elif 'pdf' in content_type:
            ext = '.pdf'
        else:
            ext = '.txt'
        
        filepath = TEXTS_DIR / f"{filename}{ext}"
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"  ✅ Successfully downloaded: {filepath}")
        return str(filepath)
        
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Failed to download from {source_name}: {e}")
        return None
    except Exception as e:
        print(f"  ❌ Error downloading from {source_name}: {e}")
        return None

def download_from_gutenberg(gutenberg_id, filename):
    """Download from Project Gutenberg"""
    # Try different Gutenberg URLs
    urls = [
        f"https://www.gutenberg.org/files/{gutenberg_id}/{gutenberg_id}-h/{gutenberg_id}-h.htm",
        f"https://www.gutenberg.org/cache/epub/{gutenberg_id}/pg{gutenberg_id}.html",
        f"https://www.gutenberg.org/ebooks/{gutenberg_id}.html.images"
    ]
    
    for url in urls:
        result = download_file(url, filename, "Project Gutenberg")
        if result:
            return result
    
    return None

def download_from_archive(archive_id, filename):
    """Download from Internet Archive"""
    urls = [
        f"https://archive.org/download/{archive_id}/{archive_id}.pdf",
        f"https://archive.org/download/{archive_id}/{archive_id}_djvu.txt",
        f"https://archive.org/download/{archive_id}/{archive_id}.epub"
    ]
    
    for url in urls:
        result = download_file(url, filename, "Internet Archive")
        if result:
            return result
    
    return None

def main():
    """Main download function"""
    print("🚀 Starting download of remaining Ernest Holmes texts...")
    print("=" * 60)
    
    download_results = {}
    successful_downloads = 0
    
    for text_id, text_info in REMAINING_TEXTS.items():
        print(f"\n📖 Processing: {text_info['title']}")
        print("-" * 40)
        
        downloaded_file = None
        
        # Try each source
        for source in text_info['sources']:
            if source['name'] == "Project Gutenberg":
                # Extract Gutenberg ID from URL
                gutenberg_id = source['url'].split('/')[-1]
                downloaded_file = download_from_gutenberg(gutenberg_id, text_info['filename'])
            elif source['name'] == "Internet Archive":
                # Extract archive ID from URL
                archive_id = source['url'].split('/')[-1]
                downloaded_file = download_from_archive(archive_id, text_info['filename'])
            
            if downloaded_file:
                break
        
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
        
        # Small delay between downloads
        time.sleep(1)
    
    # Save download results
    results_file = METADATA_DIR / "download_results.json"
    with open(results_file, 'w') as f:
        json.dump(download_results, f, indent=2)
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 DOWNLOAD SUMMARY")
    print("=" * 60)
    print(f"✅ Successfully downloaded: {successful_downloads}/{len(REMAINING_TEXTS)}")
    print(f"📁 Files saved to: {TEXTS_DIR}")
    print(f"📋 Results saved to: {results_file}")
    
    # List successful downloads
    if successful_downloads > 0:
        print("\n✅ Successfully downloaded:")
        for text_id, result in download_results.items():
            if result['downloaded']:
                print(f"  • {result['title']}")
    
    # List failed downloads
    failed_downloads = [text_id for text_id, result in download_results.items() if not result['downloaded']]
    if failed_downloads:
        print(f"\n❌ Failed downloads ({len(failed_downloads)}):")
        for text_id in failed_downloads:
            print(f"  • {download_results[text_id]['title']}")
        print(f"\n📝 Manual download guide: {MANUAL_DIR}/download_guide.md")
    
    print(f"\n🎯 Next steps:")
    print(f"  1. Check downloaded files in: {TEXTS_DIR}")
    print(f"  2. For failed downloads, use manual guide: {MANUAL_DIR}/download_guide.md")
    print(f"  3. Process HTML/PDF files to plain text for AI training")

if __name__ == "__main__":
    main() 