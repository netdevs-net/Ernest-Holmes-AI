#!/usr/bin/env python3
"""
Find and Download Ernest Holmes Texts from Multiple Sources
Searches Project Gutenberg, Internet Archive, and other sources
"""

import requests
import re
import json
import time
from pathlib import Path
from bs4 import BeautifulSoup
import urllib.parse

# Create directories
TEXTS_DIR = Path("texts")
METADATA_DIR = Path("metadata")
TEXTS_DIR.mkdir(exist_ok=True)
METADATA_DIR.mkdir(exist_ok=True)

# Ernest Holmes texts to find
HOLMES_TEXTS = {
    "science_of_mind": {
        "title": "The Science of Mind",
        "author": "Ernest Holmes",
        "year": 1938,
        "filename": "science-of-mind-1938"
    },
    "creative_mind_success": {
        "title": "Creative Mind and Success", 
        "author": "Ernest Holmes",
        "year": 1919,
        "filename": "creative-mind-success-1919"
    },
    "this_thing_called_you": {
        "title": "This Thing Called You",
        "author": "Ernest Holmes", 
        "year": 1948,
        "filename": "this-thing-called-you-1948"
    },
    "words_that_heal_today": {
        "title": "Words That Heal Today",
        "author": "Ernest Holmes",
        "year": 1949,
        "filename": "words-that-heal-today-1949"
    },
    "hidden_power_bible": {
        "title": "The Hidden Power of the Bible",
        "author": "Ernest Holmes",
        "year": 1929,
        "filename": "hidden-power-bible-1929"
    }
}

def search_gutenberg():
    """Search Project Gutenberg for Ernest Holmes texts"""
    print("🔍 Searching Project Gutenberg...")
    
    search_terms = [
        "Ernest Holmes",
        "Science of Mind",
        "Creative Mind and Success", 
        "This Thing Called You",
        "Words That Heal Today",
        "Hidden Power of the Bible"
    ]
    
    found_books = []
    
    for term in search_terms:
        try:
            url = f"https://www.gutenberg.org/ebooks/search/?query={urllib.parse.quote(term)}"
            print(f"  Searching: {term}")
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Look for book links
            book_links = soup.find_all('a', href=re.compile(r'/ebooks/\d+'))
            
            for link in book_links:
                book_id = re.search(r'/ebooks/(\d+)', link.get('href'))
                if book_id:
                    title = link.get_text(strip=True)
                    if any(holmes_term.lower() in title.lower() for holmes_term in ['holmes', 'science of mind', 'creative mind']):
                        found_books.append({
                            'id': book_id.group(1),
                            'title': title,
                            'url': f"https://www.gutenberg.org{link.get('href')}",
                            'search_term': term
                        })
                        print(f"    Found: {title} (ID: {book_id.group(1)})")
            
            time.sleep(1)
            
        except Exception as e:
            print(f"    Error searching '{term}': {e}")
    
    return found_books

def search_internet_archive():
    """Search Internet Archive for Ernest Holmes texts"""
    print("\n🔍 Searching Internet Archive...")
    
    search_terms = [
        "Ernest Holmes Science of Mind",
        "Ernest Holmes Creative Mind and Success",
        "Ernest Holmes This Thing Called You"
    ]
    
    found_books = []
    
    for term in search_terms:
        try:
            url = f"https://archive.org/search.php?query={urllib.parse.quote(term)}"
            print(f"  Searching: {term}")
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Look for book results
            book_items = soup.find_all('div', class_='item-ia')
            
            for item in book_items[:5]:  # Limit to first 5 results
                title_elem = item.find('a', class_='title')
                if title_elem:
                    title = title_elem.get_text(strip=True)
                    book_url = f"https://archive.org{title_elem.get('href')}"
                    
                    if any(holmes_term.lower() in title.lower() for holmes_term in ['holmes', 'science of mind', 'creative mind']):
                        found_books.append({
                            'title': title,
                            'url': book_url,
                            'source': 'internet_archive',
                            'search_term': term
                        })
                        print(f"    Found: {title}")
            
            time.sleep(1)
            
        except Exception as e:
            print(f"    Error searching '{term}': {e}")
    
    return found_books

def search_other_sources():
    """Search other potential sources"""
    print("\n🔍 Searching other sources...")
    
    # Try some known public domain sources
    sources = [
        {
            'name': 'HathiTrust',
            'url': 'https://babel.hathitrust.org/cgi/pt?q1=Ernest+Holmes',
            'pattern': r'Ernest Holmes'
        },
        {
            'name': 'Google Books',
            'url': 'https://books.google.com/books?id=',
            'pattern': r'Ernest Holmes'
        }
    ]
    
    found_books = []
    
    for source in sources:
        try:
            print(f"  Checking: {source['name']}")
            # Note: These might require more sophisticated scraping
            # For now, just note the availability
            found_books.append({
                'title': f"Potential source: {source['name']}",
                'url': source['url'],
                'source': source['name'].lower().replace(' ', '_'),
                'note': 'Manual verification required'
            })
            
        except Exception as e:
            print(f"    Error checking {source['name']}: {e}")
    
    return found_books

def download_from_gutenberg(book_id, filename):
    """Download from Project Gutenberg"""
    urls = [
        f"https://www.gutenberg.org/files/{book_id}/{book_id}-h/{book_id}-h.htm",
        f"https://www.gutenberg.org/cache/epub/{book_id}/pg{book_id}.html",
        f"https://www.gutenberg.org/ebooks/{book_id}.html.images"
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
    """Main search and download function"""
    print("🚀 Starting comprehensive search for Ernest Holmes texts...")
    print("=" * 70)
    
    # Search all sources
    gutenberg_books = search_gutenberg()
    archive_books = search_internet_archive()
    other_books = search_other_sources()
    
    # Combine all results
    all_results = {
        'gutenberg': gutenberg_books,
        'internet_archive': archive_books,
        'other_sources': other_books,
        'search_timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # Save search results
    results_file = METADATA_DIR / "comprehensive_search_results.json"
    with open(results_file, 'w') as f:
        json.dump(all_results, f, indent=2)
    
    # Print summary
    print("\n" + "=" * 70)
    print("📊 COMPREHENSIVE SEARCH SUMMARY")
    print("=" * 70)
    print(f"📚 Project Gutenberg: {len(gutenberg_books)} potential matches")
    print(f"📚 Internet Archive: {len(archive_books)} potential matches")
    print(f"📚 Other Sources: {len(other_books)} potential sources")
    print(f"📋 Results saved to: {results_file}")
    
    if gutenberg_books:
        print("\n✅ Project Gutenberg matches:")
        for book in gutenberg_books:
            print(f"  • {book['title']} (ID: {book.get('id', 'N/A')})")
    
    if archive_books:
        print("\n✅ Internet Archive matches:")
        for book in archive_books:
            print(f"  • {book['title']}")
    
    print(f"\n🎯 Next steps:")
    print(f"  1. Review search results in {results_file}")
    print(f"  2. Manually verify correct texts")
    print(f"  3. Download verified texts")
    print(f"  4. Process for training data")

if __name__ == "__main__":
    main() 