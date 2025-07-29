#!/usr/bin/env python3
"""
Enhanced Google Books Scraper for Ernest Holmes Texts
Extracts actual book content from Google Books preview pages
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

# Ernest Holmes books found on Google Books
HOLMES_BOOKS = {
    "science_of_mind": {
        "title": "The Science of Mind",
        "author": "Ernest Holmes",
        "google_id": "0-C7o-AK1OwC",
        "filename": "science-of-mind-google"
    },
    "living_science_of_mind": {
        "title": "Living the Science of Mind",
        "author": "Ernest Holmes",
        "google_id": "0zU9DgAAQBAJ",
        "filename": "living-science-of-mind-google"
    },
    "creative_mind_success": {
        "title": "Creative Mind and Success",
        "author": "Ernest Holmes",
        "google_id": "q8s5mIrS6WsC",
        "filename": "creative-mind-success-google"
    },
    "hidden_power_bible": {
        "title": "The Hidden Power of the Bible",
        "author": "Ernest Holmes",
        "google_id": "IXk_qCfUFDwC",
        "filename": "hidden-power-bible-google"
    }
}

def get_google_books_page(url):
    """Get content from Google Books page with enhanced headers"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
        }
        
        print(f"  📥 Fetching: {url}")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        return response.text
        
    except Exception as e:
        print(f"  ❌ Error fetching {url}: {e}")
        return None

def extract_text_from_page(html_content):
    """Enhanced text extraction from Google Books pages"""
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove unwanted elements
        for element in soup(['script', 'style', 'nav', 'header', 'footer', 'aside']):
            element.decompose()
        
        # Try to find the main content area
        content_selectors = [
            '.gb-content',
            '.gb-page',
            '.gb-text',
            '.book-content',
            '.page-content',
            'div[role="main"]',
            '.book-preview',
            '.preview-content',
            '.gb-page-content',
            '.gb-page-text',
            '.gb-page-body',
            '.gb-page-main',
            '.gb-page-wrapper',
            '.gb-page-container'
        ]
        
        extracted_text = ""
        
        for selector in content_selectors:
            elements = soup.select(selector)
            for element in elements:
                text = element.get_text(separator='\n', strip=True)
                if text and len(text) > 100:  # Only meaningful content
                    extracted_text += text + "\n\n"
        
        # If no specific content found, try to get all text and filter
        if not extracted_text:
            all_text = soup.get_text(separator='\n', strip=True)
            
            # Filter out navigation and UI elements
            lines = all_text.split('\n')
            filtered_lines = []
            
            for line in lines:
                line = line.strip()
                if (line and 
                    len(line) > 20 and  # Skip short lines
                    not any(skip in line.lower() for skip in [
                        'sign in', 'hidden fields', 'books', 'my library', 'help',
                        'advanced book search', 'buy ebook', 'get this book',
                        'find in a library', 'all sellers', 'about this book',
                        'terms of service', 'copyright', 'page', 'google',
                        'privacy policy', 'cookie policy'
                    ])):
                    filtered_lines.append(line)
            
            extracted_text = '\n'.join(filtered_lines)
        
        # Clean up the text
        if extracted_text:
            # Remove excessive whitespace
            extracted_text = re.sub(r'\n\s*\n\s*\n', '\n\n', extracted_text)
            extracted_text = re.sub(r' +', ' ', extracted_text)
            extracted_text = extracted_text.strip()
        
        return extracted_text if extracted_text else None
        
    except Exception as e:
        print(f"  ❌ Error extracting text: {e}")
        return None

def extract_book_pages(book_id, max_pages=20):
    """Extract content from multiple book pages"""
    print(f"📚 Extracting pages for book ID: {book_id}")
    
    all_content = []
    successful_pages = 0
    
    # Try different page URL patterns
    page_patterns = [
        f"https://books.google.me/books?id={book_id}&pg=PA{{page}}",
        f"https://books.google.me/books?id={book_id}&pg=PP{{page}}",
        f"https://books.google.me/books?id={book_id}&pg={{page}}",
        f"https://books.google.me/books?id={book_id}&pg=PR{{page}}",
        f"https://books.google.me/books?id={book_id}&pg=PT{{page}}"
    ]
    
    for page_num in range(1, max_pages + 1):
        page_content = None
        
        for pattern in page_patterns:
            try:
                page_url = pattern.format(page=page_num)
                html_content = get_google_books_page(page_url)
                
                if html_content:
                    text_content = extract_text_from_page(html_content)
                    if text_content and len(text_content) > 200:  # Meaningful content
                        page_content = text_content
                        break
                
                time.sleep(0.5)  # Be respectful
                
            except Exception as e:
                continue
        
        if page_content:
            all_content.append({
                'page': page_num,
                'content': page_content,
                'length': len(page_content)
            })
            successful_pages += 1
            print(f"  ✅ Page {page_num}: {len(page_content)} characters")
        else:
            print(f"  ⚠️  Page {page_num}: No content found")
        
        time.sleep(1)  # Be respectful to Google's servers
    
    return all_content, successful_pages

def extract_book_info(book_id):
    """Extract book information and metadata"""
    print(f"📖 Getting book info for ID: {book_id}")
    
    info_url = f"https://books.google.me/books?id={book_id}"
    html_content = get_google_books_page(info_url)
    
    if not html_content:
        return None
    
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Try to extract title
        title = None
        title_selectors = ['h1', '.book-title', '.gb-title', 'title']
        for selector in title_selectors:
            title_elem = soup.select_one(selector)
            if title_elem:
                title = title_elem.get_text(strip=True)
                break
        
        # Try to extract author
        author = None
        author_selectors = ['.author', '.gb-author', '.book-author', 'a[href*="author"]']
        for selector in author_selectors:
            author_elem = soup.select_one(selector)
            if author_elem:
                author = author_elem.get_text(strip=True)
                break
        
        return {
            'title': title,
            'author': author,
            'book_id': book_id
        }
        
    except Exception as e:
        print(f"  ❌ Error extracting book info: {e}")
        return None

def main():
    """Main extraction function"""
    print("🚀 Starting enhanced Google Books extraction...")
    print("=" * 70)
    
    extraction_results = {}
    
    for book_key, book_info in HOLMES_BOOKS.items():
        print(f"\n📖 Processing: {book_info['title']}")
        print("-" * 50)
        
        book_id = book_info['google_id']
        
        # Get book information
        book_metadata = extract_book_info(book_id)
        
        # Extract pages
        pages_content, pages_count = extract_book_pages(book_id, max_pages=15)
        
        if pages_content:
            # Combine all page content
            full_content = "\n\n".join([page['content'] for page in pages_content])
            
            # Save the extracted content
            filepath = TEXTS_DIR / f"{book_info['filename']}.txt"
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(full_content)
            
            print(f"  ✅ Extracted {pages_count} pages")
            print(f"  📁 Saved to: {filepath}")
            print(f"  📊 Total content: {len(full_content)} characters")
            
            # Show sample
            sample = full_content[:300] + "..." if len(full_content) > 300 else full_content
            print(f"  📝 Sample:\n{sample}")
            
            extraction_results[book_key] = {
                'success': True,
                'pages_extracted': pages_count,
                'total_characters': len(full_content),
                'file_path': str(filepath),
                'metadata': book_metadata
            }
        else:
            print(f"  ❌ No content extracted")
            extraction_results[book_key] = {
                'success': False,
                'pages_extracted': 0,
                'total_characters': 0,
                'file_path': None,
                'metadata': book_metadata
            }
        
        print()  # Empty line for readability
    
    # Save results
    results_file = METADATA_DIR / "enhanced_google_books_results.json"
    with open(results_file, 'w') as f:
        json.dump(extraction_results, f, indent=2)
    
    # Print summary
    print("=" * 70)
    print("📊 ENHANCED EXTRACTION SUMMARY")
    print("=" * 70)
    
    successful_books = sum(1 for result in extraction_results.values() if result['success'])
    total_pages = sum(result['pages_extracted'] for result in extraction_results.values())
    total_chars = sum(result['total_characters'] for result in extraction_results.values())
    
    print(f"✅ Successfully extracted: {successful_books}/{len(HOLMES_BOOKS)} books")
    print(f"📚 Total pages extracted: {total_pages}")
    print(f"📝 Total characters: {total_chars:,}")
    print(f"📋 Results saved to: {results_file}")
    
    print(f"\n🎯 Next steps:")
    print(f"  1. Review extracted content quality")
    print(f"  2. Process content for training data")
    print(f"  3. Integrate with existing dataset")
    print(f"  4. Test AI responses with new content")

if __name__ == "__main__":
    main() 