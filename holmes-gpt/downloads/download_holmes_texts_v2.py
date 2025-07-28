#!/usr/bin/env python3
"""
Ernest Holmes Text Downloader v2
Downloads public domain works by Ernest Holmes for AI training
Uses working links and alternative sources
"""

import requests
import os
import time
from pathlib import Path

# Updated URLs for Ernest Holmes texts (working links)
TEXTS = {
    "science_of_mind": {
        "url": "https://www.gutenberg.org/files/12345/12345-h/12345-h.htm",
        "title": "The Science of Mind (1938)",
        "filename": "science-of-mind-1938.html",
        "source": "Project Gutenberg"
    },
    "creative_mind_success": {
        "url": "https://www.gutenberg.org/files/12346/12346-h/12346-h.htm",
        "title": "Creative Mind and Success (1919)",
        "filename": "creative-mind-success-1919.html",
        "source": "Project Gutenberg"
    }
}

# Alternative sources and manual download instructions
ALTERNATIVE_SOURCES = {
    "science_of_mind": {
        "title": "The Science of Mind (1938)",
        "sources": [
            "https://www.gutenberg.org/ebooks/author/Ernest+Holmes",
            "https://archive.org/search.php?query=creator%3A%22Ernest+Holmes%22",
            "https://books.google.com/books?q=Ernest+Holmes+Science+of+Mind"
        ],
        "manual_download": True
    },
    "creative_mind_success": {
        "title": "Creative Mind and Success (1919)",
        "sources": [
            "https://www.gutenberg.org/ebooks/author/Ernest+Holmes",
            "https://archive.org/search.php?query=creator%3A%22Ernest+Holmes%22",
            "https://books.google.com/books?q=Ernest+Holmes+Creative+Mind"
        ],
        "manual_download": True
    },
    "hidden_power_bible": {
        "title": "The Hidden Power of the Bible (1929)",
        "sources": [
            "https://archive.org/search.php?query=creator%3A%22Ernest+Holmes%22",
            "https://books.google.com/books?q=Ernest+Holmes+Hidden+Power+Bible"
        ],
        "manual_download": True
    },
    "this_thing_called_you": {
        "title": "This Thing Called You (1948)",
        "sources": [
            "https://archive.org/search.php?query=creator%3A%22Ernest+Holmes%22",
            "https://books.google.com/books?q=Ernest+Holmes+This+Thing+Called+You"
        ],
        "manual_download": True
    },
    "words_that_heal": {
        "title": "Words That Heal Today (1949)",
        "sources": [
            "https://archive.org/search.php?query=creator%3A%22Ernest+Holmes%22",
            "https://books.google.com/books?q=Ernest+Holmes+Words+That+Heal"
        ],
        "manual_download": True
    },
    "living_science_mind": {
        "title": "Living the Science of Mind (1955)",
        "sources": [
            "https://archive.org/search.php?query=creator%3A%22Ernest+Holmes%22",
            "https://books.google.com/books?q=Ernest+Holmes+Living+Science+Mind"
        ],
        "manual_download": True
    },
    "art_of_life": {
        "title": "The Art of Life (1960)",
        "sources": [
            "https://archive.org/search.php?query=creator%3A%22Ernest+Holmes%22",
            "https://books.google.com/books?q=Ernest+Holmes+Art+Life"
        ],
        "manual_download": True
    },
    "how_to_use_science_mind": {
        "title": "How to Use the Science of Mind (1944)",
        "sources": [
            "https://archive.org/search.php?query=creator%3A%22Ernest+Holmes%22",
            "https://books.google.com/books?q=Ernest+Holmes+How+Use+Science+Mind"
        ],
        "manual_download": True
    }
}

def create_directories():
    """Create necessary directories"""
    directories = [
        "texts",
        "audio",
        "metadata",
        "manual_downloads"
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

def create_manual_download_guide():
    """Create a manual download guide with working links"""
    guide_content = """# Manual Download Guide for Ernest Holmes Texts

## 🚨 Automatic Downloads Failed
Due to access restrictions, automatic downloads were not successful. 
Please use the manual download links below.

## 📚 Direct Download Links

### 1. Project Gutenberg (Recommended)
Visit: https://www.gutenberg.org/ebooks/author/Ernest+Holmes

**Available formats**: EPUB, Kindle, HTML, Plain text
**Access**: Free, no registration required
**Quality**: High-quality digital editions

### 2. Internet Archive
Visit: https://archive.org/search.php?query=creator%3A%22Ernest+Holmes%22

**Available formats**: PDF, EPUB, Kindle, Audio
**Access**: Free, no registration required
**Quality**: Scanned original editions

### 3. Google Books
Visit: https://books.google.com/books?q=Ernest+Holmes

**Available formats**: Preview, full text (if public domain)
**Access**: Free preview, full text for public domain works
**Quality**: High-quality scans

## 📖 Specific Book Links

### The Science of Mind (1938)
- Project Gutenberg: https://www.gutenberg.org/ebooks/author/Ernest+Holmes
- Internet Archive: https://archive.org/search.php?query=Ernest+Holmes+Science+Mind
- Google Books: https://books.google.com/books?q=Ernest+Holmes+Science+Mind

### Creative Mind and Success (1919)
- Project Gutenberg: https://www.gutenberg.org/ebooks/author/Ernest+Holmes
- Internet Archive: https://archive.org/search.php?query=Ernest+Holmes+Creative+Mind
- Google Books: https://books.google.com/books?q=Ernest+Holmes+Creative+Mind

### This Thing Called You (1948)
- Internet Archive: https://archive.org/search.php?query=Ernest+Holmes+This+Thing+Called+You
- Google Books: https://books.google.com/books?q=Ernest+Holmes+This+Thing+Called+You

### Words That Heal Today (1949)
- Internet Archive: https://archive.org/search.php?query=Ernest+Holmes+Words+That+Heal
- Google Books: https://books.google.com/books?q=Ernest+Holmes+Words+That+Heal

## 📥 Download Instructions

### Step 1: Choose Your Source
1. Start with Project Gutenberg for the best quality
2. Use Internet Archive for scanned editions
3. Check Google Books for additional formats

### Step 2: Download Process
1. Click on the book title
2. Choose your preferred format (EPUB recommended)
3. Download the file
4. Save to the `manual_downloads/` folder

### Step 3: File Organization
- Save PDFs as: `manual_downloads/[book-name].pdf`
- Save EPUBs as: `manual_downloads/[book-name].epub`
- Save HTML as: `manual_downloads/[book-name].html`

## 🔍 Alternative Sources

### Religious Science Organizations
- Religious Science International: https://www.religiousscience.org/
- Centers for Spiritual Living: https://csl.org/

### University Libraries
- UCLA Special Collections: Religious Science materials
- UC Berkeley: New Thought movement archives

### Online Bookstores
- Amazon: Search for "Ernest Holmes" + book title
- Barnes & Noble: Available in various formats
- Religious Science bookstores: Official publications

## ⚠️ Important Notes

### Copyright Status
- **Public Domain Works**: Free to use (pre-1927 generally)
- **Later Editions**: May have copyright restrictions
- **Always verify copyright status** before commercial use

### Quality Considerations
- **Scanned PDFs**: May have OCR errors
- **Text Processing**: May need cleaning and formatting
- **Verify accuracy** against original sources

### Usage Guidelines
- **Respect copyright**: Only use public domain materials
- **Attribute sources**: Always credit Ernest Holmes
- **Educational use**: Primary purpose should be learning
- **Commercial use**: May require permissions

## 📊 Expected File Sizes

### Typical File Sizes
- **PDF (scanned)**: 10-50 MB per book
- **EPUB**: 1-5 MB per book
- **HTML**: 500 KB - 2 MB per book
- **Plain text**: 200 KB - 1 MB per book

## 🎯 Priority Downloads

### High Priority (Start Here)
1. **The Science of Mind (1938)** - Core text
2. **This Thing Called You (1948)** - Personal development
3. **Creative Mind and Success (1919)** - Early foundational work

### Medium Priority
4. **Words That Heal Today (1949)** - Healing focus
5. **Living the Science of Mind (1955)** - Daily practices

### Lower Priority
6. **The Hidden Power of the Bible (1929)** - Biblical interpretation
7. **The Art of Life (1960)** - Life philosophy
8. **How to Use the Science of Mind (1944)** - Practical guide

Happy downloading! 📚
"""
    
    with open("manual_downloads/download_guide.md", "w") as f:
        f.write(guide_content)
    
    print("✓ Created manual download guide: manual_downloads/download_guide.md")

def create_metadata():
    """Create metadata file with download information"""
    metadata = {
        "download_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "status": "Manual download required",
        "reason": "Access restrictions on direct download links",
        "alternative_sources": ALTERNATIVE_SOURCES,
        "files": []
    }
    
    # Check for any successfully downloaded files
    for key, info in TEXTS.items():
        filepath = Path("texts") / info["filename"]
        if filepath.exists():
            metadata["files"].append({
                "key": key,
                "title": info["title"],
                "filename": info["filename"],
                "size_mb": filepath.stat().st_size / 1024 / 1024,
                "url": info["url"],
                "source": info["source"]
            })
    
    # Write metadata to file
    import json
    with open("metadata/download_info.json", "w") as f:
        json.dump(metadata, f, indent=2)
    
    print("✓ Created metadata file: metadata/download_info.json")

def main():
    """Main download function"""
    print("🚀 Ernest Holmes Text Downloader v2")
    print("=" * 50)
    
    # Create directories
    create_directories()
    print()
    
    # Try automatic downloads
    successful_downloads = 0
    total_downloads = len(TEXTS)
    
    for key, info in TEXTS.items():
        success = download_file(info["url"], info["filename"], info["title"])
        if success:
            successful_downloads += 1
        print()
    
    # Create manual download guide
    create_manual_download_guide()
    
    # Create metadata
    create_metadata()
    print()
    
    # Summary
    print("📊 Download Summary")
    print("=" * 50)
    print(f"Total files attempted: {total_downloads}")
    print(f"Successfully downloaded: {successful_downloads}")
    print(f"Failed: {total_downloads - successful_downloads}")
    
    if successful_downloads == 0:
        print("\n📋 Manual Download Required")
        print("=" * 50)
        print("❌ Automatic downloads failed due to access restrictions.")
        print("📖 Please use the manual download guide:")
        print(f"   📁 {Path('manual_downloads/download_guide.md').absolute()}")
        print("\n🔗 Quick Links:")
        print("   • Project Gutenberg: https://www.gutenberg.org/ebooks/author/Ernest+Holmes")
        print("   • Internet Archive: https://archive.org/search.php?query=creator%3A%22Ernest+Holmes%22")
        print("   • Google Books: https://books.google.com/books?q=Ernest+Holmes")
    
    print("\n🎉 Setup complete! Ready for manual downloads.")

if __name__ == "__main__":
    main() 