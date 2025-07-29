#!/usr/bin/env python3
"""
Ernest Holmes Text Processor for AI Training
Converts downloaded HTML files to plain text and prepares training datasets
"""

import os
import re
import json
from pathlib import Path
from bs4 import BeautifulSoup
import html
import time

# Create directories
TEXTS_DIR = Path("texts")
PROCESSED_DIR = Path("processed")
TRAINING_DIR = Path("training_data")
TEXTS_DIR.mkdir(exist_ok=True)
PROCESSED_DIR.mkdir(exist_ok=True)
TRAINING_DIR.mkdir(exist_ok=True)

def clean_html_to_text(html_content):
    """Convert HTML to clean plain text"""
    # Parse HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()
    
    # Get text content
    text = soup.get_text()
    
    # Clean up text
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    text = ' '.join(chunk for chunk in chunks if chunk)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Decode HTML entities
    text = html.unescape(text)
    
    return text

def extract_chapters_and_sections(text, filename):
    """Extract chapters and sections from text"""
    # Common chapter patterns
    chapter_patterns = [
        r'CHAPTER\s+[IVXLC]+[\.\s]*(.*?)(?=CHAPTER|$)',
        r'Chapter\s+\d+[\.\s]*(.*?)(?=Chapter|$)',
        r'PART\s+[IVXLC]+[\.\s]*(.*?)(?=PART|$)',
        r'Section\s+\d+[\.\s]*(.*?)(?=Section|$)',
        r'LESSON\s+\d+[\.\s]*(.*?)(?=LESSON|$)'
    ]
    
    sections = []
    
    for pattern in chapter_patterns:
        matches = re.finditer(pattern, text, re.DOTALL | re.IGNORECASE)
        for match in matches:
            section_text = match.group(0).strip()
            if len(section_text) > 100:  # Only include substantial sections
                sections.append({
                    'title': match.group(1).strip() if match.group(1) else 'Untitled Section',
                    'content': section_text,
                    'source': filename
                })
    
    return sections

def extract_quotes_and_passages(text, filename):
    """Extract notable quotes and passages"""
    quotes = []
    
    # Look for quoted text
    quote_patterns = [
        r'"([^"]{20,})"',  # Double quotes
        r"'([^']{20,})'",  # Single quotes
        r'([A-Z][^.!?]{50,}[.!?])',  # Long sentences starting with capital
    ]
    
    for pattern in quote_patterns:
        matches = re.finditer(pattern, text)
        for match in matches:
            quote = match.group(1).strip()
            if len(quote) > 50 and len(quote) < 500:  # Reasonable quote length
                quotes.append({
                    'quote': quote,
                    'source': filename
                })
    
    return quotes

def create_qa_pairs(text, filename):
    """Create Q&A pairs from text content"""
    qa_pairs = []
    
    # Common metaphysical questions and their potential answers
    metaphysical_questions = [
        "What is the nature of God?",
        "How does the Science of Mind work?",
        "What is the Creative Power of thought?",
        "How can I apply spiritual principles?",
        "What is the relationship between mind and matter?",
        "How does prayer work in the Science of Mind?",
        "What is the Principle of Life?",
        "How can I develop my spiritual understanding?",
        "What is the meaning of Oneness?",
        "How does the Law of Attraction work?",
        "What is Divine Intelligence?",
        "How does spiritual healing work?",
        "What is the Creative Power within me?",
        "How can I overcome fear?",
        "What is the nature of spiritual substance?",
        "How do I recognize my divine nature?",
        "What is the Law of Mind?",
        "How can I manifest my desires?",
        "What is the meaning of faith?",
        "How does consciousness create reality?"
    ]
    
    # Enhanced keyword mapping for better matching
    question_keywords = {
        "What is the nature of God?": ["god", "divine", "infinite", "creator", "source", "principle"],
        "How does the Science of Mind work?": ["science of mind", "principle", "law", "works", "operates"],
        "What is the Creative Power of thought?": ["creative power", "thought", "mind", "creation", "manifestation"],
        "How can I apply spiritual principles?": ["apply", "practice", "use", "spiritual", "principle", "law"],
        "What is the relationship between mind and matter?": ["mind", "matter", "relationship", "connection", "spirit"],
        "How does prayer work in the Science of Mind?": ["prayer", "treatment", "affirmation", "recognition"],
        "What is the Principle of Life?": ["principle", "life", "living", "existence", "being"],
        "How can I develop my spiritual understanding?": ["develop", "understanding", "spiritual", "growth", "consciousness"],
        "What is the meaning of Oneness?": ["oneness", "unity", "one", "whole", "complete"],
        "How does the Law of Attraction work?": ["law of attraction", "attraction", "like attracts like", "vibration"],
        "What is Divine Intelligence?": ["divine intelligence", "infinite mind", "spirit", "consciousness"],
        "How does spiritual healing work?": ["healing", "health", "wholeness", "spiritual", "cure"],
        "What is the Creative Power within me?": ["creative power", "within", "inner", "potential", "ability"],
        "How can I overcome fear?": ["fear", "overcome", "courage", "faith", "confidence"],
        "What is the nature of spiritual substance?": ["spiritual substance", "substance", "essence", "reality"],
        "How do I recognize my divine nature?": ["divine nature", "recognize", "realize", "true self", "identity"],
        "What is the Law of Mind?": ["law of mind", "mental law", "principle", "law"],
        "How can I manifest my desires?": ["manifest", "desire", "creation", "attraction", "realization"],
        "What is the meaning of faith?": ["faith", "belief", "trust", "confidence", "assurance"],
        "How does consciousness create reality?": ["consciousness", "reality", "create", "manifest", "experience"]
    }
    
    # Find relevant passages for each question
    for question in metaphysical_questions:
        relevant_passages = []
        keywords = question_keywords.get(question, question.lower().split())
        
        # Split text into paragraphs
        paragraphs = re.split(r'\n\s*\n', text)
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if len(paragraph) > 100 and len(paragraph) < 1000:
                # Check if paragraph contains relevant keywords
                paragraph_lower = paragraph.lower()
                keyword_matches = sum(1 for keyword in keywords if keyword in paragraph_lower)
                
                # If we have at least 2 keyword matches, consider it relevant
                if keyword_matches >= 2:
                    relevant_passages.append((paragraph, keyword_matches))
        
        if relevant_passages:
            # Sort by relevance (number of keyword matches) and take the best
            relevant_passages.sort(key=lambda x: x[1], reverse=True)
            answer = relevant_passages[0][0]
            
            # Clean up the answer
            answer = re.sub(r'\s+', ' ', answer).strip()
            
            qa_pairs.append({
                'question': question,
                'answer': answer,
                'source': filename,
                'relevance_score': relevant_passages[0][1]
            })
    
    return qa_pairs

def process_file(filepath):
    """Process a single HTML file"""
    filename = filepath.name
    print(f"📖 Processing: {filename}")
    
    # Read HTML content
    with open(filepath, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Convert to plain text
    plain_text = clean_html_to_text(html_content)
    
    # Save plain text version
    text_filename = filename.replace('.html', '.txt')
    text_filepath = PROCESSED_DIR / text_filename
    
    with open(text_filepath, 'w', encoding='utf-8') as f:
        f.write(plain_text)
    
    print(f"  ✅ Saved plain text: {text_filepath}")
    
    # Extract content for training
    sections = extract_chapters_and_sections(plain_text, filename)
    quotes = extract_quotes_and_passages(plain_text, filename)
    qa_pairs = create_qa_pairs(plain_text, filename)
    
    return {
        'filename': filename,
        'text_file': str(text_filepath),
        'sections': sections,
        'quotes': quotes,
        'qa_pairs': qa_pairs,
        'word_count': len(plain_text.split()),
        'character_count': len(plain_text)
    }

def main():
    """Main processing function"""
    print("🚀 Starting text processing for AI training...")
    print("=" * 60)
    
    # Find all HTML files
    html_files = list(TEXTS_DIR.glob("*.html"))
    
    if not html_files:
        print("❌ No HTML files found in texts directory")
        return
    
    print(f"📚 Found {len(html_files)} HTML files to process")
    
    # Process each file
    processing_results = {}
    total_words = 0
    total_quotes = 0
    total_qa_pairs = 0
    
    for filepath in html_files:
        result = process_file(filepath)
        processing_results[filepath.name] = result
        
        total_words += result['word_count']
        total_quotes += len(result['quotes'])
        total_qa_pairs += len(result['qa_pairs'])
        
        print(f"  📊 Extracted: {len(result['sections'])} sections, {len(result['quotes'])} quotes, {len(result['qa_pairs'])} Q&A pairs")
    
    # Save processing results
    results_file = TRAINING_DIR / "processing_results.json"
    with open(results_file, 'w') as f:
        json.dump(processing_results, f, indent=2)
    
    # Create training datasets
    all_quotes = []
    all_qa_pairs = []
    all_sections = []
    
    for result in processing_results.values():
        all_quotes.extend(result['quotes'])
        all_qa_pairs.extend(result['qa_pairs'])
        all_sections.extend(result['sections'])
    
    # Save training datasets
    quotes_file = TRAINING_DIR / "holmes_quotes.json"
    with open(quotes_file, 'w') as f:
        json.dump(all_quotes, f, indent=2)
    
    qa_file = TRAINING_DIR / "holmes_qa_pairs.json"
    with open(qa_file, 'w') as f:
        json.dump(all_qa_pairs, f, indent=2)
    
    sections_file = TRAINING_DIR / "holmes_sections.json"
    with open(sections_file, 'w') as f:
        json.dump(all_sections, f, indent=2)
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 PROCESSING SUMMARY")
    print("=" * 60)
    print(f"✅ Processed files: {len(html_files)}")
    print(f"📝 Total words: {total_words:,}")
    print(f"💬 Total quotes: {total_quotes}")
    print(f"❓ Total Q&A pairs: {total_qa_pairs}")
    print(f"📖 Total sections: {len(all_sections)}")
    
    print(f"\n📁 Files created:")
    print(f"  • Plain text files: {PROCESSED_DIR}")
    print(f"  • Training datasets: {TRAINING_DIR}")
    print(f"  • Processing results: {results_file}")
    
    print(f"\n🎯 Training datasets:")
    print(f"  • Quotes: {quotes_file}")
    print(f"  • Q&A pairs: {qa_file}")
    print(f"  • Sections: {sections_file}")
    
    print(f"\n🚀 Next steps:")
    print(f"  1. Review training datasets")
    print(f"  2. Prepare fine-tuning configuration")
    print(f"  3. Choose target model (Mistral 7B, Llama 3.1 8B)")
    print(f"  4. Set up LoRA/QLoRA training pipeline")

if __name__ == "__main__":
    main() 