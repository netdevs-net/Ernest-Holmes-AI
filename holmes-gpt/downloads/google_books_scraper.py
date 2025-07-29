#!/usr/bin/env python3
"""
Google Books Scraper for Ernest Holmes Texts
Extracts content from Google Books for authentic Ernest Holmes works
"""

import requests
import json
import time
import re
from pathlib import Path
from bs4 import BeautifulSoup
import urllib.parse
from urllib.parse import urlparse, parse_qs

# Create directories
TEXTS_DIR = Path("texts")
METADATA_DIR = Path("metadata")
TEXTS_DIR.mkdir(exist_ok=True)
METADATA_DIR.mkdir(exist_ok=True)

# Ernest Holmes books on Google Books
HOLMES_GOOGLE_BOOKS = {
    "science_of_mind": {
        "title": "The Science of Mind",
        "author": "Ernest Holmes",
        "google_id": "0-C7o-AK1OwC",
        "url": "https://books.google.me/books?id=0-C7o-AK1OwC&printsec=copyright",
        "filename": "science-of-mind-google"
    },
    "creative_mind_success": {
        "title": "Creative Mind and Success",
        "author": "Ernest Holmes",
        "google_id": "search_required",  # Need to find
        "url": "https://books.google.me/books?q=Creative+Mind+and+Success+Ernest+Holmes",
        "filename": "creative-mind-success-google"
    },
    "this_thing_called_you": {
        "title": "This Thing Called You",
        "author": "Ernest Holmes", 
        "google_id": "search_required",  # Need to find
        "url": "https://books.google.me/books?q=This+Thing+Called+You+Ernest+Holmes",
        "filename": "this-thing-called-you-google"
    }
}

def get_google_books_page(url, book_id=None):
    """Get content from Google Books page"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        print(f"  📥 Fetching: {url}")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        return response.text
        
    except Exception as e:
        print(f"  ❌ Error fetching {url}: {e}")
        return None

def extract_text_from_google_books(html_content):
    """Extract text content from Google Books HTML"""
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Look for text content in various Google Books elements
        text_elements = []
        
        # Try different selectors that Google Books might use
        selectors = [
            '.gb-content',  # Google Books content
            '.gb-page',     # Google Books page content
            '.gb-text',     # Google Books text
            '.book-content', # Book content
            '.page-content', # Page content
            'div[role="main"]', # Main content area
            '.book-preview', # Book preview
            '.preview-content' # Preview content
        ]
        
        for selector in selectors:
            elements = soup.select(selector)
            for element in elements:
                text = element.get_text(strip=True)
                if text and len(text) > 50:  # Only meaningful text
                    text_elements.append(text)
        
        # If no specific elements found, try to get all text
        if not text_elements:
            # Get all text from body
            body = soup.find('body')
            if body:
                text = body.get_text(strip=True)
                if text and len(text) > 100:
                    text_elements.append(text)
        
        # Clean and combine text
        if text_elements:
            combined_text = '\n\n'.join(text_elements)
            # Remove excessive whitespace
            combined_text = re.sub(r'\n\s*\n', '\n\n', combined_text)
            combined_text = re.sub(r' +', ' ', combined_text)
            return combined_text
        
        return None
        
    except Exception as e:
        print(f"  ❌ Error extracting text: {e}")
        return None

def search_google_books_for_holmes():
    """Search Google Books for Ernest Holmes works"""
    print("🔍 Searching Google Books for Ernest Holmes works...")
    
    search_terms = [
        "Ernest Holmes Science of Mind",
        "Ernest Holmes Creative Mind and Success", 
        "Ernest Holmes This Thing Called You",
        "Ernest Holmes Words That Heal Today",
        "Ernest Holmes Hidden Power of the Bible"
    ]
    
    found_books = []
    
    for term in search_terms:
        try:
            search_url = f"https://books.google.me/books?q={urllib.parse.quote(term)}"
            print(f"  Searching: {term}")
            
            html_content = get_google_books_page(search_url)
            if not html_content:
                continue
                
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Look for book links in search results
            book_links = soup.find_all('a', href=re.compile(r'/books\?id='))
            
            for link in book_links[:5]:  # Limit to first 5 results
                href = link.get('href')
                if href:
                    # Extract book ID from URL
                    parsed_url = urlparse(href)
                    query_params = parse_qs(parsed_url.query)
                    book_id = query_params.get('id', [None])[0]
                    
                    if book_id:
                        title = link.get_text(strip=True)
                        if title and any(holmes_term.lower() in title.lower() for holmes_term in ['holmes', 'science of mind', 'creative mind']):
                            found_books.append({
                                'title': title,
                                'book_id': book_id,
                                'url': f"https://books.google.me{href}",
                                'search_term': term
                            })
                            print(f"    Found: {title} (ID: {book_id})")
            
            time.sleep(2)  # Be respectful to Google's servers
            
        except Exception as e:
            print(f"    Error searching '{term}': {e}")
    
    return found_books

def extract_from_science_of_mind():
    """Extract content from the specific Science of Mind book"""
    print("\n📖 Extracting from The Science of Mind...")
    
    book_info = HOLMES_GOOGLE_BOOKS["science_of_mind"]
    url = book_info["url"]
    
    # Get the main page
    html_content = get_google_books_page(url)
    if not html_content:
        print("  ❌ Could not fetch Science of Mind page")
        return None
    
    # Extract text content
    text_content = extract_text_from_google_books(html_content)
    if not text_content:
        print("  ❌ Could not extract text content")
        return None
    
    # Save the extracted content
    filepath = TEXTS_DIR / f"{book_info['filename']}.txt"
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text_content)
    
    print(f"  ✅ Extracted content saved to: {filepath}")
    print(f"  📊 Content length: {len(text_content)} characters")
    
    # Show a sample of the content
    sample = text_content[:500] + "..." if len(text_content) > 500 else text_content
    print(f"  📝 Sample content:\n{sample}")
    
    return str(filepath)

def extract_preview_pages(book_id, max_pages=10):
    """Extract content from multiple preview pages"""
    print(f"\n📚 Extracting preview pages for book ID: {book_id}")
    
    extracted_pages = []
    
    for page in range(1, max_pages + 1):
        try:
            # Try different page URL formats
            page_urls = [
                f"https://books.google.me/books?id={book_id}&pg=PA{page}",
                f"https://books.google.me/books?id={book_id}&pg=PP{page}",
                f"https://books.google.me/books?id={book_id}&pg={page}"
            ]
            
            page_content = None
            for page_url in page_urls:
                html_content = get_google_books_page(page_url)
                if html_content:
                    text_content = extract_text_from_google_books(html_content)
                    if text_content and len(text_content) > 100:
                        page_content = text_content
                        break
            
            if page_content:
                extracted_pages.append({
                    'page': page,
                    'content': page_content,
                    'length': len(page_content)
                })
                print(f"  ✅ Page {page}: {len(page_content)} characters")
            else:
                print(f"  ⚠️  Page {page}: No content found")
            
            time.sleep(1)  # Be respectful
            
        except Exception as e:
            print(f"  ❌ Error extracting page {page}: {e}")
    
    return extracted_pages

def main():
    """Main extraction function"""
    print("🚀 Starting Google Books extraction for Ernest Holmes texts...")
    print("=" * 70)
    
    # First, try to extract from the known Science of Mind book
    science_of_mind_file = extract_from_science_of_mind()
    
    # Search for other Holmes books
    found_books = search_google_books_for_holmes()
    
    # Extract from found books
    extraction_results = {
        'science_of_mind': {
            'extracted': bool(science_of_mind_file),
            'file_path': science_of_mind_file,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
        },
        'found_books': found_books,
        'extraction_timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # Save results
    results_file = METADATA_DIR / "google_books_extraction_results.json"
    with open(results_file, 'w') as f:
        json.dump(extraction_results, f, indent=2)
    
    # Print summary
    print("\n" + "=" * 70)
    print("📊 GOOGLE BOOKS EXTRACTION SUMMARY")
    print("=" * 70)
    print(f"✅ Science of Mind extracted: {bool(science_of_mind_file)}")
    print(f"📚 Found {len(found_books)} additional books")
    print(f"📋 Results saved to: {results_file}")
    
    if found_books:
        print("\n✅ Found books:")
        for book in found_books:
            print(f"  • {book['title']} (ID: {book['book_id']})")
    
    print(f"\n🎯 Next steps:")
    print(f"  1. Review extracted content quality")
    print(f"  2. Extract from additional found books")
    print(f"  3. Process extracted content for training")
    print(f"  4. Integrate with existing training dataset")

if __name__ == "__main__":
    main() 