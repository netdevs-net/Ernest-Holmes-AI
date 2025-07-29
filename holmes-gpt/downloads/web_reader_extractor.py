#!/usr/bin/env python3
"""
Web Reader Extractor for Google Books
Extracts content from the Google Books web reader
"""

import requests
import json
import time
from pathlib import Path
from bs4 import BeautifulSoup
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TEXTS_DIR = Path("texts")
TEXTS_DIR.mkdir(exist_ok=True)

def get_web_reader_content(book_id):
    """Extract content from Google Books web reader"""
    web_reader_url = f"http://play.google.com/books/reader?id={book_id}&hl=&source=gbs_api"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    }
    
    try:
        logger.info(f"🔍 Accessing web reader: {web_reader_url}")
        response = requests.get(web_reader_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for content in various selectors
        content_selectors = [
            '.gb-content', '.gb-page', '.gb-text', '.book-content',
            '.page-content', 'div[role="main"]', '.book-preview',
            '.preview-content', '.gb-page-content', '.gb-page-text',
            '.gb-page-body', '.gb-page-main', '.gb-page-wrapper',
            '.gb-page-container', '[data-content]', '[data-text]',
            '.book-text', '.reader-content', '.page-text'
        ]
        
        extracted_content = []
        
        for selector in content_selectors:
            elements = soup.select(selector)
            for element in elements:
                text = element.get_text(separator='\n', strip=True)
                if text and len(text) > 100:
                    extracted_content.append({
                        'selector': selector,
                        'content': text
                    })
        
        # If no content found, try to get all text and filter
        if not extracted_content:
            all_text = soup.get_text(separator='\n', strip=True)
            lines = all_text.split('\n')
            filtered_lines = []
            
            for line in lines:
                line = line.strip()
                if (line and len(line) > 50 and 
                    not any(skip in line.lower() for skip in [
                        'sign in', 'hidden fields', 'books', 'my library', 'help',
                        'advanced book search', 'buy ebook', 'get this book',
                        'find in a library', 'all sellers', 'about this book',
                        'terms of service', 'copyright', 'page', 'google',
                        'privacy policy', 'cookie policy', 'loading'
                    ])):
                    filtered_lines.append(line)
            
            if filtered_lines:
                extracted_content.append({
                    'selector': 'filtered_text',
                    'content': '\n'.join(filtered_lines)
                })
        
        return extracted_content
        
    except Exception as e:
        logger.error(f"Error accessing web reader: {e}")
        return []

def main():
    """Main extraction function"""
    book_id = "0-C7o-AK1OwC"
    
    logger.info("🚀 Extracting content from Google Books web reader...")
    
    content = get_web_reader_content(book_id)
    
    if content:
        output_file = TEXTS_DIR / "web_reader_content.json"
        with open(output_file, 'w') as f:
            json.dump(content, f, indent=2)
        
        logger.info(f"✅ Extracted {len(content)} content sections")
        logger.info(f"📁 Saved to: {output_file}")
        
        # Show preview
        for i, section in enumerate(content[:3]):
            logger.info(f"Section {i+1} ({section['selector']}): {len(section['content'])} chars")
            logger.info(f"Preview: {section['content'][:200]}...")
    else:
        logger.warning("❌ No content extracted from web reader")

if __name__ == "__main__":
    main() 