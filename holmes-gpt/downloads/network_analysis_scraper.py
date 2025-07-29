#!/usr/bin/env python3
"""
Network Analysis Scraper for Google Books
Analyzes network requests to find potential API endpoints and content loading mechanisms
"""

import requests
import json
import time
import re
from pathlib import Path
from bs4 import BeautifulSoup
import urllib.parse
from urllib.parse import urlparse, parse_qs
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create directories
TEXTS_DIR = Path("texts")
METADATA_DIR = Path("metadata")
TEXTS_DIR.mkdir(exist_ok=True)
METADATA_DIR.mkdir(exist_ok=True)

# Target book
TARGET_BOOK = {
    "title": "The Science of Mind",
    "author": "Ernest Holmes",
    "google_id": "0-C7o-AK1OwC",
    "base_url": "https://books.google.me/books?id=0-C7o-AK1OwC"
}

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
        'Referer': 'https://books.google.me/',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"'
    }

def analyze_page_structure(url):
    """Analyze the page structure and look for potential content sources"""
    logger.info(f"🔍 Analyzing page structure: {url}")
    
    try:
        headers = get_enhanced_headers()
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for potential content sources
        analysis = {
            'url': url,
            'title': soup.title.string if soup.title else None,
            'scripts': [],
            'api_endpoints': [],
            'content_selectors': [],
            'data_attributes': [],
            'iframe_sources': [],
            'ajax_requests': []
        }
        
        # Find all scripts
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string:
                script_content = script.string
                analysis['scripts'].append({
                    'type': script.get('type', 'text/javascript'),
                    'src': script.get('src'),
                    'content_preview': script_content[:200] + '...' if len(script_content) > 200 else script_content
                })
                
                # Look for API endpoints in scripts
                api_patterns = [
                    r'https?://[^"\']*api[^"\']*',
                    r'https?://[^"\']*books[^"\']*',
                    r'https?://[^"\']*preview[^"\']*',
                    r'https?://[^"\']*content[^"\']*'
                ]
                
                for pattern in api_patterns:
                    matches = re.findall(pattern, script_content, re.IGNORECASE)
                    analysis['api_endpoints'].extend(matches)
        
        # Look for content selectors
        content_selectors = [
            '.gb-content', '.gb-page', '.gb-text', '.book-content',
            '.page-content', 'div[role="main"]', '.book-preview',
            '.preview-content', '.gb-page-content', '.gb-page-text',
            '.gb-page-body', '.gb-page-main', '.gb-page-wrapper',
            '.gb-page-container', '[data-content]', '[data-text]'
        ]
        
        for selector in content_selectors:
            elements = soup.select(selector)
            if elements:
                analysis['content_selectors'].append({
                    'selector': selector,
                    'count': len(elements),
                    'sample_text': elements[0].get_text()[:100] + '...' if elements[0].get_text() else 'No text'
                })
        
        # Look for data attributes
        elements_with_data = soup.find_all(attrs=lambda x: any(key.startswith('data-') for key in x.keys() if key))
        for element in elements_with_data[:10]:  # Limit to first 10
            data_attrs = {k: v for k, v in element.attrs.items() if k.startswith('data-')}
            if data_attrs:
                analysis['data_attributes'].append({
                    'tag': element.name,
                    'data_attrs': data_attrs
                })
        
        # Look for iframes
        iframes = soup.find_all('iframe')
        for iframe in iframes:
            src = iframe.get('src')
            if src:
                analysis['iframe_sources'].append(src)
        
        return analysis
        
    except Exception as e:
        logger.error(f"Error analyzing page structure: {e}")
        return None

def try_different_url_patterns(book_id):
    """Try different URL patterns that might contain content"""
    patterns = [
        f"https://books.google.me/books?id={book_id}&printsec=frontcover",
        f"https://books.google.me/books?id={book_id}&printsec=copyright",
        f"https://books.google.me/books?id={book_id}&printsec=titlepage",
        f"https://books.google.me/books?id={book_id}&printsec=contents",
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_ge_summary_r",
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_toc_r",
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_ge_summary_r&cad=0",
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_toc_r&cad=0",
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_ge_summary_r&cad=0#v=onepage&q&f=false",
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_toc_r&cad=0#v=onepage&q&f=false"
    ]
    
    results = []
    
    for pattern in patterns:
        logger.info(f"🔍 Trying pattern: {pattern}")
        analysis = analyze_page_structure(pattern)
        if analysis:
            results.append(analysis)
        time.sleep(1)  # Be respectful
    
    return results

def look_for_api_endpoints(book_id):
    """Look for potential API endpoints"""
    logger.info(f"🔍 Looking for API endpoints for book ID: {book_id}")
    
    # Common Google Books API patterns
    api_patterns = [
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_ge_summary_r&cad=0",
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_toc_r&cad=0",
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_ge_summary_r&cad=0#v=onepage&q&f=false",
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_toc_r&cad=0#v=onepage&q&f=false",
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_ge_summary_r&cad=0#v=snippet&q&f=false",
        f"https://books.google.me/books?id={book_id}&printsec=frontcover&source=gbs_toc_r&cad=0#v=snippet&q&f=false"
    ]
    
    api_results = []
    
    for pattern in api_patterns:
        try:
            headers = get_enhanced_headers()
            response = requests.get(pattern, headers=headers, timeout=30)
            
            api_results.append({
                'url': pattern,
                'status_code': response.status_code,
                'content_type': response.headers.get('content-type', ''),
                'content_length': len(response.text),
                'has_content': len(response.text) > 1000,
                'content_preview': response.text[:500] + '...' if len(response.text) > 500 else response.text
            })
            
        except Exception as e:
            logger.error(f"Error testing API pattern {pattern}: {e}")
            api_results.append({
                'url': pattern,
                'error': str(e)
            })
        
        time.sleep(1)  # Be respectful
    
    return api_results

def extract_content_from_analysis(analysis_results):
    """Extract actual content from analysis results"""
    logger.info("📖 Extracting content from analysis results...")
    
    all_content = []
    
    for analysis in analysis_results:
        if not analysis:
            continue
            
        # Try to extract content from different sources
        content_sources = []
        
        # 1. Try content selectors
        for selector_info in analysis.get('content_selectors', []):
            selector = selector_info['selector']
            try:
                # Re-request the page and extract content
                headers = get_enhanced_headers()
                response = requests.get(analysis['url'], headers=headers, timeout=30)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                elements = soup.select(selector)
                for element in elements:
                    text = element.get_text(separator='\n', strip=True)
                    if text and len(text) > 100:  # Meaningful content
                        content_sources.append({
                            'source': f'selector: {selector}',
                            'content': text
                        })
            except Exception as e:
                logger.error(f"Error extracting from selector {selector}: {e}")
        
        # 2. Try data attributes
        for data_info in analysis.get('data_attributes', []):
            data_attrs = data_info.get('data_attrs', {})
            for key, value in data_attrs.items():
                if 'content' in key.lower() or 'text' in key.lower():
                    if value and len(value) > 50:
                        content_sources.append({
                            'source': f'data-attribute: {key}',
                            'content': value
                        })
        
        all_content.extend(content_sources)
    
    return all_content

def main():
    """Main analysis function"""
    logger.info("🚀 Starting Google Books Network Analysis...")
    logger.info("=" * 70)
    
    book_id = TARGET_BOOK['google_id']
    
    # 1. Analyze different URL patterns
    logger.info("📋 Step 1: Analyzing different URL patterns...")
    pattern_results = try_different_url_patterns(book_id)
    
    # 2. Look for API endpoints
    logger.info("🔌 Step 2: Looking for API endpoints...")
    api_results = look_for_api_endpoints(book_id)
    
    # 3. Extract content from analysis
    logger.info("📖 Step 3: Extracting content from analysis...")
    extracted_content = extract_content_from_analysis(pattern_results)
    
    # 4. Save results
    logger.info("💾 Step 4: Saving analysis results...")
    
    # Save pattern analysis
    pattern_file = METADATA_DIR / "google_books_pattern_analysis.json"
    with open(pattern_file, 'w') as f:
        json.dump(pattern_results, f, indent=2)
    
    # Save API results
    api_file = METADATA_DIR / "google_books_api_analysis.json"
    with open(api_file, 'w') as f:
        json.dump(api_results, f, indent=2)
    
    # Save extracted content
    content_file = TEXTS_DIR / "google_books_extracted_content.json"
    with open(content_file, 'w') as f:
        json.dump(extracted_content, f, indent=2)
    
    # 5. Print summary
    logger.info("\n" + "=" * 70)
    logger.info("📊 NETWORK ANALYSIS SUMMARY")
    logger.info("=" * 70)
    logger.info(f"✅ URL Patterns Analyzed: {len(pattern_results)}")
    logger.info(f"✅ API Endpoints Tested: {len(api_results)}")
    logger.info(f"✅ Content Sources Found: {len(extracted_content)}")
    
    # Show promising results
    promising_apis = [r for r in api_results if r.get('has_content', False)]
    if promising_apis:
        logger.info(f"🎯 Promising API Endpoints: {len(promising_apis)}")
        for api in promising_apis[:3]:  # Show top 3
            logger.info(f"   - {api['url']} ({api['content_length']} chars)")
    
    if extracted_content:
        logger.info(f"📖 Extracted Content Sources: {len(extracted_content)}")
        for content in extracted_content[:3]:  # Show top 3
            logger.info(f"   - {content['source']} ({len(content['content'])} chars)")
    
    logger.info(f"\n📁 Results saved to:")
    logger.info(f"   - Pattern Analysis: {pattern_file}")
    logger.info(f"   - API Analysis: {api_file}")
    logger.info(f"   - Extracted Content: {content_file}")
    
    logger.info(f"\n🎯 Next steps:")
    logger.info(f"   1. Review pattern analysis for content sources")
    logger.info(f"   2. Test promising API endpoints")
    logger.info(f"   3. Extract content from identified sources")
    logger.info(f"   4. Consider alternative approaches if needed")

if __name__ == "__main__":
    main() 