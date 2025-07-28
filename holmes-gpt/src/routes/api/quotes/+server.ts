import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

interface Quote {
	quote: string;
	source: string;
}

let quotesCache: Quote[] = [];

// Load quotes from the JSON file
function loadQuotes(): Quote[] {
	if (quotesCache.length > 0) {
		return quotesCache;
	}

	try {
		const quotesPath = path.join(process.cwd(), 'downloads', 'training_data', 'holmes_quotes.json');
		const quotesData = fs.readFileSync(quotesPath, 'utf-8');
		const allQuotes: Quote[] = JSON.parse(quotesData);
		
		// Filter out metadata and short quotes, keep meaningful ones
		const meaningfulQuotes = allQuotes.filter(quote => 
			quote.quote.length > 50 && 
			quote.quote.length <= 67 &&
			!quote.quote.includes('***') &&
			!quote.quote.includes('Transcriber') &&
			!quote.quote.includes('GUTENBERG') &&
			!quote.quote.includes('correction') &&
			!quote.quote.includes('printer')
		);
		
		quotesCache = meaningfulQuotes;
		return meaningfulQuotes;
	} catch (error) {
		console.error('Error loading quotes:', error);
		return [];
	}
}

export async function GET({ url }) {
	const quotes = loadQuotes();
	
	// Get query parameters
	const searchTerm = url.searchParams.get('search') || '';
	const limit = parseInt(url.searchParams.get('limit') || '10');
	const random = url.searchParams.get('random') === 'true';
	
	let filteredQuotes = quotes;
	
	// Filter by search term if provided
	if (searchTerm) {
		const term = searchTerm.toLowerCase();
		filteredQuotes = quotes.filter(quote => 
			quote.quote.toLowerCase().includes(term) ||
			quote.source.toLowerCase().includes(term)
		);
	}
	
	// Get random quotes if requested
	if (random) {
		const shuffled = [...filteredQuotes].sort(() => 0.5 - Math.random());
		filteredQuotes = shuffled.slice(0, limit);
	} else {
		// Get latest quotes (assuming they're in chronological order)
		filteredQuotes = filteredQuotes.slice(0, limit);
	}
	
	return json({
		quotes: filteredQuotes,
		total: quotes.length,
		filtered: filteredQuotes.length,
		searchTerm,
		limit
	});
} 