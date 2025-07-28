#!/usr/bin/env python3
"""
Final Ernest Holmes Text Downloader
Downloads the last 3 remaining texts using alternative sources
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

# Final remaining texts with alternative sources
FINAL_TEXTS = {
    "living_science_of_mind": {
        "title": "Living the Science of Mind (1955)",
        "author": "Ernest Holmes",
        "year": 1955,
        "sources": [
            {
                "name": "Alternative Archive",
                "url": "https://archive.org/details/livingthescienceofmind",
                "format": "pdf"
            },
            {
                "name": "Religious Science Archive",
                "url": "https://archive.org/search.php?query=Ernest+Holmes+Living+Science+Mind",
                "format": "pdf"
            }
        ],
        "filename": "living-science-of-mind-1955"
    },
    "art_of_life": {
        "title": "The Art of Life (1960)",
        "author": "Ernest Holmes",
        "year": 1960,
        "sources": [
            {
                "name": "Alternative Archive",
                "url": "https://archive.org/details/artoflife",
                "format": "pdf"
            },
            {
                "name": "Religious Science Archive",
                "url": "https://archive.org/search.php?query=Ernest+Holmes+Art+Life",
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
                "name": "Alternative Archive",
                "url": "https://archive.org/details/howtousethescienceofmind",
                "format": "pdf"
            },
            {
                "name": "Religious Science Archive",
                "url": "https://archive.org/search.php?query=Ernest+Holmes+How+Use+Science+Mind",
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

def search_and_download_from_archive(search_query, filename):
    """Search Internet Archive and attempt to download"""
    try:
        print(f"  🔍 Searching Internet Archive for: {search_query}")
        
        # Search URL
        search_url = f"https://archive.org/search.php?query={search_query.replace(' ', '+')}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(search_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Look for download links in the search results
        content = response.text
        
        # Try to find archive.org download links
        archive_patterns = [
            r'https://archive\.org/download/([^/"]+)',
            r'https://archive\.org/details/([^/"]+)'
        ]
        
        for pattern in archive_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                # Try different file formats
                for ext in ['.pdf', '.txt', '.epub', '.html']:
                    download_url = f"https://archive.org/download/{match}/{match}{ext}"
                    result = download_file(download_url, filename, f"Archive ({match})")
                    if result:
                        return result
        
        return None
        
    except Exception as e:
        print(f"  ❌ Error searching archive: {e}")
        return None

def download_from_alternative_sources(text_info):
    """Try alternative sources for downloading"""
    filename = text_info['filename']
    title = text_info['title']
    
    # Try direct archive.org downloads with different naming patterns
    archive_patterns = [
        f"https://archive.org/download/{filename.replace('-', '_')}/{filename.replace('-', '_')}.pdf",
        f"https://archive.org/download/{filename.replace('-', '')}/{filename.replace('-', '')}.pdf",
        f"https://archive.org/download/{filename}/{filename}.pdf",
        f"https://archive.org/download/{title.lower().replace(' ', '_').replace('(', '').replace(')', '')}/{title.lower().replace(' ', '_').replace('(', '').replace(')', '')}.pdf"
    ]
    
    for url in archive_patterns:
        result = download_file(url, filename, "Alternative Archive")
        if result:
            return result
    
    # Try searching
    search_queries = [
        title,
        f"Ernest Holmes {title}",
        title.replace('(', '').replace(')', ''),
        filename.replace('-', ' ')
    ]
    
    for query in search_queries:
        result = search_and_download_from_archive(query, filename)
        if result:
            return result
    
    return None

def main():
    """Main download function"""
    print("🚀 Starting download of final Ernest Holmes texts...")
    print("=" * 60)
    
    download_results = {}
    successful_downloads = 0
    
    for text_id, text_info in FINAL_TEXTS.items():
        print(f"\n📖 Processing: {text_info['title']}")
        print("-" * 40)
        
        downloaded_file = None
        
        # Try alternative sources
        downloaded_file = download_from_alternative_sources(text_info)
        
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
        time.sleep(2)
    
    # Save download results
    results_file = METADATA_DIR / "final_download_results.json"
    with open(results_file, 'w') as f:
        json.dump(download_results, f, indent=2)
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 FINAL DOWNLOAD SUMMARY")
    print("=" * 60)
    print(f"✅ Successfully downloaded: {successful_downloads}/{len(FINAL_TEXTS)}")
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
        print(f"\n📝 These texts may need manual download from:")
        print(f"   - Religious Science bookstores")
        print(f"   - University libraries")
        print(f"   - Special collections")
    
    print(f"\n🎯 Next steps:")
    print(f"  1. Check downloaded files in: {TEXTS_DIR}")
    print(f"  2. Process HTML/PDF files to plain text for AI training")
    print(f"  3. Create training datasets from all available texts")

if __name__ == "__main__":
    main() 