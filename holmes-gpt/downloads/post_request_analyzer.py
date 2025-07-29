#!/usr/bin/env python3
"""
POST Request Analyzer for Google Books
Analyzes POST requests and form data to find actual API endpoints for book content
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
        'sec-ch-ua-platform': '"macOS"',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

def get_json_headers():
    """Get headers for JSON requests"""
    return {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Referer': 'https://books.google.me/',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'Content-Type': 'application/json'
    }

def extract_form_data_from_page(url):
    """Extract form data and potential POST endpoints from a page"""
    logger.info(f"🔍 Extracting form data from: {url}")
    
    try:
        headers = get_enhanced_headers()
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        forms = soup.find_all('form')
        form_data = []
        
        for form in forms:
            form_info = {
                'action': form.get('action', ''),
                'method': form.get('method', 'GET').upper(),
                'fields': []
            }
            
            # Extract form fields
            inputs = form.find_all(['input', 'textarea', 'select'])
            for input_field in inputs:
                field_info = {
                    'name': input_field.get('name', ''),
                    'type': input_field.get('type', 'text'),
                    'value': input_field.get('value', ''),
                    'id': input_field.get('id', ''),
                    'class': input_field.get('class', [])
                }
                form_info['fields'].append(field_info)
            
            form_data.append(form_info)
        
        return form_data
        
    except Exception as e:
        logger.error(f"Error extracting form data: {e}")
        return []

def find_ajax_endpoints(html_content):
    """Find potential AJAX endpoints in JavaScript code"""
    logger.info("🔍 Looking for AJAX endpoints in JavaScript...")
    
    ajax_patterns = [
        r'fetch\(["\']([^"\']*books[^"\']*)["\']',
        r'\.post\(["\']([^"\']*books[^"\']*)["\']',
        r'\.get\(["\']([^"\']*books[^"\']*)["\']',
        r'XMLHttpRequest\(\)\.open\(["\']POST["\'],\s*["\']([^"\']*)["\']',
        r'XMLHttpRequest\(\)\.open\(["\']GET["\'],\s*["\']([^"\']*)["\']',
        r'url:\s*["\']([^"\']*books[^"\']*)["\']',
        r'endpoint:\s*["\']([^"\']*books[^"\']*)["\']',
        r'api:\s*["\']([^"\']*books[^"\']*)["\']'
    ]
    
    endpoints = []
    
    for pattern in ajax_patterns:
        matches = re.findall(pattern, html_content, re.IGNORECASE)
        for match in matches:
            if match not in endpoints:
                endpoints.append(match)
    
    return endpoints

def try_common_post_endpoints(book_id):
    """Try common POST endpoints that might serve book content"""
    logger.info(f"🔍 Trying common POST endpoints for book ID: {book_id}")
    
    # Common Google Books POST endpoints
    post_endpoints = [
        f"https://books.google.me/books/preview",
        f"https://books.google.me/books/content",
        f"https://books.google.me/books/text",
        f"https://books.google.me/books/api/content",
        f"https://books.google.me/books/api/preview",
        f"https://books.google.me/books/api/text",
        f"https://books.google.me/books/ajax/content",
        f"https://books.google.me/books/ajax/preview",
        f"https://books.google.me/books/ajax/text"
    ]
    
    # Common POST data patterns
    post_data_patterns = [
        {
            'book_id': book_id,
            'format': 'text',
            'action': 'get_content'
        },
        {
            'id': book_id,
            'type': 'content',
            'format': 'plain'
        },
        {
            'bookId': book_id,
            'contentType': 'text',
            'method': 'getContent'
        },
        {
            'bid': book_id,
            'ct': 'text',
            'op': 'get'
        }
    ]
    
    results = []
    
    for endpoint in post_endpoints:
        for data_pattern in post_data_patterns:
            try:
                logger.info(f"🔍 Trying POST: {endpoint} with data: {data_pattern}")
                
                # Try with form data
                headers = get_enhanced_headers()
                response = requests.post(endpoint, data=data_pattern, headers=headers, timeout=30)
                
                result = {
                    'endpoint': endpoint,
                    'data': data_pattern,
                    'status_code': response.status_code,
                    'content_type': response.headers.get('content-type', ''),
                    'content_length': len(response.text),
                    'has_content': len(response.text) > 100,
                    'content_preview': response.text[:500] + '...' if len(response.text) > 500 else response.text
                }
                
                # Try with JSON data
                json_headers = get_json_headers()
                json_response = requests.post(endpoint, json=data_pattern, headers=json_headers, timeout=30)
                
                json_result = {
                    'endpoint': endpoint,
                    'data': data_pattern,
                    'method': 'JSON',
                    'status_code': json_response.status_code,
                    'content_type': json_response.headers.get('content-type', ''),
                    'content_length': len(json_response.text),
                    'has_content': len(json_response.text) > 100,
                    'content_preview': json_response.text[:500] + '...' if len(json_response.text) > 500 else json_response.text
                }
                
                results.extend([result, json_result])
                
            except Exception as e:
                logger.error(f"Error trying POST {endpoint}: {e}")
                results.append({
                    'endpoint': endpoint,
                    'data': data_pattern,
                    'error': str(e)
                })
            
            time.sleep(1)  # Be respectful
    
    return results

def try_google_books_api_endpoints(book_id):
    """Try Google Books API endpoints that might serve content"""
    logger.info(f"🔍 Trying Google Books API endpoints for book ID: {book_id}")
    
    # Google Books API endpoints
    api_endpoints = [
        f"https://www.googleapis.com/books/v1/volumes/{book_id}",
        f"https://books.google.com/books?id={book_id}&printsec=frontcover&source=gbs_ge_summary_r&cad=0&output=json",
        f"https://books.google.com/books?id={book_id}&printsec=frontcover&source=gbs_toc_r&cad=0&output=json",
        f"https://books.google.com/books?id={book_id}&printsec=frontcover&source=gbs_ge_summary_r&cad=0&output=text",
        f"https://books.google.com/books?id={book_id}&printsec=frontcover&source=gbs_toc_r&cad=0&output=text"
    ]
    
    results = []
    
    for endpoint in api_endpoints:
        try:
            logger.info(f"🔍 Trying API: {endpoint}")
            
            headers = get_json_headers()
            response = requests.get(endpoint, headers=headers, timeout=30)
            
            result = {
                'endpoint': endpoint,
                'status_code': response.status_code,
                'content_type': response.headers.get('content-type', ''),
                'content_length': len(response.text),
                'has_content': len(response.text) > 100,
                'content_preview': response.text[:500] + '...' if len(response.text) > 500 else response.text
            }
            
            results.append(result)
            
        except Exception as e:
            logger.error(f"Error trying API {endpoint}: {e}")
            results.append({
                'endpoint': endpoint,
                'error': str(e)
            })
        
        time.sleep(1)  # Be respectful
    
    return results

def analyze_page_for_post_requests(url):
    """Analyze a page for potential POST request patterns"""
    logger.info(f"🔍 Analyzing page for POST patterns: {url}")
    
    try:
        headers = get_enhanced_headers()
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Extract form data
        form_data = extract_form_data_from_page(url)
        
        # Find AJAX endpoints
        ajax_endpoints = find_ajax_endpoints(response.text)
        
        # Look for POST patterns in JavaScript
        post_patterns = [
            r'POST["\']?\s*,\s*["\']([^"\']*)["\']',
            r'post\(["\']([^"\']*)["\']',
            r'\.post\(["\']([^"\']*)["\']',
            r'fetch\(["\']([^"\']*)["\'],\s*{\s*method:\s*["\']POST["\']',
            r'XMLHttpRequest\(\)\.open\(["\']POST["\'],\s*["\']([^"\']*)["\']'
        ]
        
        post_endpoints = []
        for pattern in post_patterns:
            matches = re.findall(pattern, response.text, re.IGNORECASE)
            post_endpoints.extend(matches)
        
        return {
            'url': url,
            'form_data': form_data,
            'ajax_endpoints': ajax_endpoints,
            'post_endpoints': list(set(post_endpoints)),
            'html_length': len(response.text)
        }
        
    except Exception as e:
        logger.error(f"Error analyzing page for POST patterns: {e}")
        return None

def main():
    """Main analysis function"""
    logger.info("🚀 Starting Google Books POST Request Analysis...")
    logger.info("=" * 70)
    
    book_id = TARGET_BOOK['google_id']
    base_url = TARGET_BOOK['base_url']
    
    # 1. Analyze base page for POST patterns
    logger.info("📋 Step 1: Analyzing base page for POST patterns...")
    page_analysis = analyze_page_for_post_requests(base_url)
    
    # 2. Try common POST endpoints
    logger.info("🔌 Step 2: Trying common POST endpoints...")
    post_results = try_common_post_endpoints(book_id)
    
    # 3. Try Google Books API endpoints
    logger.info("🌐 Step 3: Trying Google Books API endpoints...")
    api_results = try_google_books_api_endpoints(book_id)
    
    # 4. Save results
    logger.info("💾 Step 4: Saving analysis results...")
    
    # Save page analysis
    if page_analysis:
        page_file = METADATA_DIR / "google_books_post_analysis.json"
        with open(page_file, 'w') as f:
            json.dump(page_analysis, f, indent=2)
    
    # Save POST results
    post_file = METADATA_DIR / "google_books_post_results.json"
    with open(post_file, 'w') as f:
        json.dump(post_results, f, indent=2)
    
    # Save API results
    api_file = METADATA_DIR / "google_books_api_results.json"
    with open(api_file, 'w') as f:
        json.dump(api_results, f, indent=2)
    
    # 5. Print summary
    logger.info("\n" + "=" * 70)
    logger.info("📊 POST REQUEST ANALYSIS SUMMARY")
    logger.info("=" * 70)
    
    if page_analysis:
        logger.info(f"✅ Forms Found: {len(page_analysis.get('form_data', []))}")
        logger.info(f"✅ AJAX Endpoints: {len(page_analysis.get('ajax_endpoints', []))}")
        logger.info(f"✅ POST Endpoints: {len(page_analysis.get('post_endpoints', []))}")
    
    logger.info(f"✅ POST Endpoints Tested: {len(post_results)}")
    logger.info(f"✅ API Endpoints Tested: {len(api_results)}")
    
    # Show promising results
    promising_posts = [r for r in post_results if r.get('has_content', False)]
    if promising_posts:
        logger.info(f"🎯 Promising POST Endpoints: {len(promising_posts)}")
        for post in promising_posts[:3]:  # Show top 3
            logger.info(f"   - {post['endpoint']} ({post['content_length']} chars)")
    
    promising_apis = [r for r in api_results if r.get('has_content', False)]
    if promising_apis:
        logger.info(f"🎯 Promising API Endpoints: {len(promising_apis)}")
        for api in promising_apis[:3]:  # Show top 3
            logger.info(f"   - {api['endpoint']} ({api['content_length']} chars)")
    
    logger.info(f"\n📁 Results saved to:")
    if page_analysis:
        logger.info(f"   - Page Analysis: {page_file}")
    logger.info(f"   - POST Results: {post_file}")
    logger.info(f"   - API Results: {api_file}")
    
    logger.info(f"\n🎯 Next steps:")
    logger.info(f"   1. Review POST endpoints for content")
    logger.info(f"   2. Test promising API endpoints")
    logger.info(f"   3. Extract content from successful requests")
    logger.info(f"   4. Consider browser automation if needed")

if __name__ == "__main__":
    main() 