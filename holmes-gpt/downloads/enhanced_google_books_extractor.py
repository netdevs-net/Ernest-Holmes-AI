#!/usr/bin/env python3
"""
Enhanced Google Books Extractor
Based on insights from google-book-scraper tool
Extracts text content from Google Books JSON API endpoints
"""

import requests
import json
import time
import re
from pathlib import Path
from bs4 import BeautifulSoup
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create directories
TEXTS_DIR = Path("texts")
METADATA_DIR = Path("metadata")
TEXTS_DIR.mkdir(exist_ok=True)
METADATA_DIR.mkdir(exist_ok=True)

def get_enhanced_headers():
    """Get enhanced headers that mimic a real browser"""
    return {
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
        'Cache-Control': 'max-age=0',
        'Referer': 'https://books.google.com/',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"'
    }

def extract_book_id_from_url(url):
    """Extract book ID from Google Books URL"""
    import re
    # Try to extract ID from URL
    id_match = re.search(r'id=([^&]+)', url)
    if id_match:
        return id_match.group(1)
    
    # Try to extract from path
    path_match = re.search(r'/books/edition/[^/]+/([^/?]+)', url)
    if path_match:
        return path_match.group(1)
    
    raise ValueError(f"Could not extract book ID from URL: {url}")

def get_json_url(book_id, first_page="1", page_id="1"):
    """Generate JSON URL for Google Books API (based on google-book-scraper logic)"""
    base_url = f"https://books.google.us/books?id={book_id}&hl=en"
    return f"{base_url}&lpg={first_page}&pg={page_id}&jscmd=click3"

def fetch_json_content(book_id, first_page="1", page_id="1", max_retries=3):
    """Fetch JSON content from Google Books API"""
    url = get_json_url(book_id, first_page, page_id)
    
    for attempt in range(max_retries):
        try:
            logger.info(f"🔍 Fetching JSON: {url}")
            headers = get_enhanced_headers()
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            # Parse JSON response
            data = response.json()
            return data
            
        except Exception as e:
            logger.error(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                raise
    
    return None

def extract_text_from_json(json_data):
    """Extract text content from JSON response"""
    extracted_text = []
    
    try:
        # Look for page content in the JSON structure
        if 'page' in json_data:
            for page in json_data['page']:
                # Extract text from various possible fields
                text_sources = []
                
                # Check for text content in different possible locations
                if 'text' in page:
                    text_sources.append(page['text'])
                
                if 'content' in page:
                    text_sources.append(page['content'])
                
                if 'body' in page:
                    text_sources.append(page['body'])
                
                # Look for text in additional_info
                if 'additional_info' in page and page['additional_info']:
                    additional_info = page['additional_info']
                    if 'text' in additional_info:
                        text_sources.append(additional_info['text'])
                    
                    if 'content' in additional_info:
                        text_sources.append(additional_info['content'])
                
                # Combine all text sources
                for text_source in text_sources:
                    if text_source and isinstance(text_source, str):
                        # Clean up the text
                        cleaned_text = re.sub(r'\s+', ' ', text_source).strip()
                        if cleaned_text and len(cleaned_text) > 10:
                            extracted_text.append({
                                'page_id': page.get('pid', 'unknown'),
                                'text': cleaned_text
                            })
        
        # Also check for text in other possible locations
        if 'text' in json_data:
            text = json_data['text']
            if isinstance(text, str) and len(text) > 10:
                extracted_text.append({
                    'page_id': 'main',
                    'text': re.sub(r'\s+', ' ', text).strip()
                })
        
        if 'content' in json_data:
            content = json_data['content']
            if isinstance(content, str) and len(content) > 10:
                extracted_text.append({
                    'page_id': 'main',
                    'text': re.sub(r'\s+', ' ', content).strip()
                })
    
    except Exception as e:
        logger.error(f"Error extracting text from JSON: {e}")
    
    return extracted_text

def extract_pages_from_json(json_data):
    """Extract page information from JSON response"""
    pages = []
    
    try:
        if 'page' in json_data:
            for page in json_data['page']:
                page_info = {
                    'pid': page.get('pid', ''),
                    'src': page.get('src', ''),
                    'text': page.get('text', ''),
                    'content': page.get('content', ''),
                    'additional_info': page.get('additional_info', {})
                }
                pages.append(page_info)
    
    except Exception as e:
        logger.error(f"Error extracting pages from JSON: {e}")
    
    return pages

def download_book_content(book_id, max_pages=50):
    """Download book content using the JSON API approach"""
    logger.info(f"🚀 Starting content extraction for book ID: {book_id}")
    
    all_content = []
    all_pages = []
    
    # First, get the initial JSON to understand the book structure
    try:
        initial_json = fetch_json_content(book_id, "1", "1")
        if initial_json:
            # Extract pages from initial JSON
            pages = extract_pages_from_json(initial_json)
            all_pages.extend(pages)
            
            # Extract text from initial JSON
            text_content = extract_text_from_json(initial_json)
            all_content.extend(text_content)
            
            logger.info(f"✅ Initial JSON processed: {len(pages)} pages, {len(text_content)} text sections")
            
            # Try to download additional pages
            page_ids_to_try = []
            
            # Collect page IDs from the initial response
            for page in pages:
                if page['pid'] and page['pid'] not in [p['pid'] for p in all_pages]:
                    page_ids_to_try.append(page['pid'])
            
            # Also try some common page patterns
            for i in range(2, min(max_pages + 1, 21)):  # Try pages 2-20
                page_ids_to_try.append(str(i))
            
            # Download content from each page
            for page_id in page_ids_to_try[:max_pages]:
                try:
                    logger.info(f"📄 Processing page: {page_id}")
                    page_json = fetch_json_content(book_id, "1", page_id)
                    
                    if page_json:
                        # Extract text from this page
                        page_text = extract_text_from_json(page_json)
                        all_content.extend(page_text)
                        
                        # Extract page info
                        page_info = extract_pages_from_json(page_json)
                        all_pages.extend(page_info)
                        
                        logger.info(f"✅ Page {page_id}: {len(page_text)} text sections")
                    
                    # Be respectful with requests
                    time.sleep(1)
                    
                except Exception as e:
                    logger.error(f"Error processing page {page_id}: {e}")
                    continue
    
    except Exception as e:
        logger.error(f"Error in initial JSON fetch: {e}")
    
    return {
        'book_id': book_id,
        'total_pages': len(all_pages),
        'total_text_sections': len(all_content),
        'pages': all_pages,
        'content': all_content
    }

def save_extracted_content(book_id, content_data):
    """Save extracted content to files"""
    # Save full content data
    content_file = TEXTS_DIR / f"{book_id}_full_content.json"
    with open(content_file, 'w') as f:
        json.dump(content_data, f, indent=2)
    
    # Save just the text content
    text_file = TEXTS_DIR / f"{book_id}_extracted_text.txt"
    with open(text_file, 'w') as f:
        f.write(f"Google Books Content Extraction\n")
        f.write(f"Book ID: {book_id}\n")
        f.write(f"Total Pages: {content_data['total_pages']}\n")
        f.write(f"Total Text Sections: {content_data['total_text_sections']}\n")
        f.write("=" * 80 + "\n\n")
        
        for i, content in enumerate(content_data['content'], 1):
            f.write(f"Section {i} (Page: {content['page_id']}):\n")
            f.write(content['text'])
            f.write("\n\n" + "-" * 40 + "\n\n")
    
    # Save pages metadata
    pages_file = METADATA_DIR / f"{book_id}_pages_metadata.json"
    with open(pages_file, 'w') as f:
        json.dump(content_data['pages'], f, indent=2)
    
    return content_file, text_file, pages_file

def main():
    """Main extraction function"""
    # Test with our Ernest Holmes book
    book_id = "0-C7o-AK1OwC"
    
    logger.info("🚀 Starting enhanced Google Books content extraction...")
    logger.info("=" * 70)
    
    try:
        # Extract content using JSON API approach
        content_data = download_book_content(book_id, max_pages=30)
        
        # Save extracted content
        content_file, text_file, pages_file = save_extracted_content(book_id, content_data)
        
        # Print summary
        logger.info("\n" + "=" * 70)
        logger.info("📊 CONTENT EXTRACTION SUMMARY")
        logger.info("=" * 70)
        logger.info(f"✅ Book ID: {book_id}")
        logger.info(f"✅ Total Pages Processed: {content_data['total_pages']}")
        logger.info(f"✅ Total Text Sections: {content_data['total_text_sections']}")
        logger.info(f"📁 Content Data: {content_file}")
        logger.info(f"📁 Extracted Text: {text_file}")
        logger.info(f"📁 Pages Metadata: {pages_file}")
        
        # Show preview of extracted content
        if content_data['content']:
            logger.info(f"\n📖 Content Preview:")
            for i, content in enumerate(content_data['content'][:3], 1):
                preview = content['text'][:200] + "..." if len(content['text']) > 200 else content['text']
                logger.info(f"Section {i} (Page {content['page_id']}): {preview}")
        
        logger.info(f"\n🎯 Next steps:")
        logger.info(f"   1. Review extracted text content")
        logger.info(f"   2. Process text for training data")
        logger.info(f"   3. Integrate with AI system")
        
    except Exception as e:
        logger.error(f"❌ Extraction failed: {e}")

if __name__ == "__main__":
    main() 