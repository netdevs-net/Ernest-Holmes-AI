<script lang="ts">
	import { onMount } from 'svelte';
	import type { QuestionHistory } from '$lib/utils/questionStorage';
	
	let questions: QuestionHistory[] = [];
	let loading = true;
	let error = '';
	let sortField: 'timestamp' | 'category' | 'question' = 'timestamp';
	let sortDirection: 'asc' | 'desc' = 'desc';
	let searchTerm = '';
	let selectedCategory = '';
	let showDeleteConfirm = false;
	let questionToDelete: QuestionHistory | null = null;
	let showResponseModal = false;
	let selectedQuestion: QuestionHistory | null = null;
	let responseLoading = false;
	let aiResponse = '';
	let responseError = '';
	
	// Categories for filtering
	const categories = ['all', 'spiritual', 'practical', 'metaphysical', 'personal', 'general'];
	
	onMount(async () => {
		await loadQuestions();
	});
	
	async function loadQuestions() {
		try {
			loading = true;
			const response = await fetch('/api/questions?limit=1000'); // Get all questions
			if (response.ok) {
				const data = await response.json();
				questions = data.questions || [];
			} else {
				error = 'Failed to load questions';
			}
		} catch (err) {
			error = 'Error loading questions';
			console.error('Error loading questions:', err);
		} finally {
			loading = false;
		}
	}
	
	async function deleteQuestion(question: QuestionHistory) {
		try {
			const response = await fetch(`/api/questions/${question.id}`, {
				method: 'DELETE'
			});
			
			if (response.ok) {
				// Remove from local array
				questions = questions.filter(q => q.id !== question.id);
				showDeleteConfirm = false;
				questionToDelete = null;
			} else {
				error = 'Failed to delete question';
			}
		} catch (err) {
			error = 'Error deleting question';
			console.error('Error deleting question:', err);
		}
	}
	
	function confirmDelete(question: QuestionHistory) {
		questionToDelete = question;
		showDeleteConfirm = true;
	}
	
	function cancelDelete() {
		showDeleteConfirm = false;
		questionToDelete = null;
	}
	
	async function viewResponse(question: QuestionHistory) {
		selectedQuestion = question;
		showResponseModal = true;
		responseLoading = true;
		aiResponse = '';
		responseError = '';
		
		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: question.question,
					category: question.category
				})
			});
			
			if (response.ok) {
				const data = await response.json();
				aiResponse = data.response || 'No response received';
			} else {
				responseError = 'Failed to get response from AI';
			}
		} catch (err) {
			responseError = 'Error connecting to AI service';
			console.error('Error getting AI response:', err);
		} finally {
			responseLoading = false;
		}
	}
	
	function closeResponseModal() {
		showResponseModal = false;
		selectedQuestion = null;
		aiResponse = '';
		responseError = '';
	}
	
	function handleSort(field: 'timestamp' | 'category' | 'question') {
		if (sortField === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDirection = 'asc';
		}
	}
	
	function formatDate(date: Date): string {
		return new Date(date).toLocaleString();
	}
	
	function formatRelativeTime(date: Date): string {
		const now = new Date();
		const questionDate = new Date(date);
		const diffInHours = (now.getTime() - questionDate.getTime()) / (1000 * 60 * 60);
		
		if (diffInHours < 1) {
			return 'Just now';
		} else if (diffInHours < 24) {
			const hours = Math.floor(diffInHours);
			return `${hours} hour${hours > 1 ? 's' : ''} ago`;
		} else if (diffInHours < 168) { // 7 days
			const days = Math.floor(diffInHours / 24);
			return `${days} day${days > 1 ? 's' : ''} ago`;
		} else {
			return questionDate.toLocaleDateString();
		}
	}
	
	function getCategoryColor(category: string): string {
		const colors = {
			spiritual: 'bg-purple-100 text-purple-800 border-purple-200',
			practical: 'bg-blue-100 text-blue-800 border-blue-200',
			metaphysical: 'bg-indigo-100 text-indigo-800 border-indigo-200',
			personal: 'bg-pink-100 text-pink-800 border-pink-200',
			general: 'bg-gray-100 text-gray-800 border-gray-200'
		};
		return colors[category as keyof typeof colors] || colors.general;
	}
	
	function parseFormatting(text: string): string {
		return text
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/\n\n/g, '</p><p>')
			.replace(/\n/g, '<br>')
			.replace(/^/, '<p>')
			.replace(/$/, '</p>')
			.replace(/• /g, '<br>• ');
	}
	
	// Computed properties for filtering and sorting
	$: filteredQuestions = questions.filter(question => {
		const matchesSearch = searchTerm === '' || 
			question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
		
		const matchesCategory = selectedCategory === '' || selectedCategory === 'all' || 
			question.category === selectedCategory;
		
		return matchesSearch && matchesCategory;
	});
	
	$: sortedQuestions = [...filteredQuestions].sort((a, b) => {
		let aValue: any, bValue: any;
		
		switch (sortField) {
			case 'timestamp':
				aValue = new Date(a.timestamp).getTime();
				bValue = new Date(b.timestamp).getTime();
				break;
			case 'category':
				aValue = a.category.toLowerCase();
				bValue = b.category.toLowerCase();
				break;
			case 'question':
				aValue = a.question.toLowerCase();
				bValue = b.question.toLowerCase();
				break;
			default:
				return 0;
		}
		
		if (sortDirection === 'asc') {
			return aValue > bValue ? 1 : -1;
		} else {
			return aValue < bValue ? 1 : -1;
		}
	});
	
	$: totalQuestions = questions.length;
	$: filteredCount = filteredQuestions.length;
</script>

<svelte:head>
	<title>Admin - Question Management | HolmesAI</title>
	<meta name="description" content="Admin panel for managing spiritual questions and user interactions." />
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center py-6">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
					<p class="mt-1 text-sm text-gray-500">Manage spiritual questions and user interactions</p>
				</div>
				<div class="flex items-center space-x-4">
					<a href="/" class="text-indigo-600 hover:text-indigo-500 font-medium">
						← Back to Chat
					</a>
					<button 
						on:click={loadQuestions}
						class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
					>
						🔄 Refresh
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Stats -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
							<span class="text-white font-semibold">📝</span>
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-500">Total Questions</p>
						<p class="text-2xl font-semibold text-gray-900">{totalQuestions}</p>
					</div>
				</div>
			</div>
			
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
							<span class="text-white font-semibold">👥</span>
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-500">Filtered Results</p>
						<p class="text-2xl font-semibold text-gray-900">{filteredCount}</p>
					</div>
				</div>
			</div>
			
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
							<span class="text-white font-semibold">⭐</span>
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-500">Bookmarked</p>
						<p class="text-2xl font-semibold text-gray-900">
							{questions.filter(q => q.isBookmarked).length}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Filters -->
		<div class="bg-white rounded-lg shadow mb-6">
			<div class="px-6 py-4 border-b border-gray-200">
				<h3 class="text-lg font-medium text-gray-900">Filters & Search</h3>
			</div>
			<div class="px-6 py-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="search" class="block text-sm font-medium text-gray-700 mb-2">
							Search Questions
						</label>
						<input
							id="search"
							type="text"
							bind:value={searchTerm}
							placeholder="Search questions or tags..."
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<div>
						<label for="category" class="block text-sm font-medium text-gray-700 mb-2">
							Category Filter
						</label>
						<select
							id="category"
							bind:value={selectedCategory}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						>
							<option value="">All Categories</option>
							{#each categories.filter(c => c !== 'all') as category}
								<option value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
		</div>

		<!-- Questions Table -->
		<div class="bg-white rounded-lg shadow overflow-hidden">
			<div class="px-6 py-4 border-b border-gray-200">
				<h3 class="text-lg font-medium text-gray-900">Questions ({filteredCount})</h3>
			</div>
			
			{#if loading}
				<div class="p-8 text-center">
					<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
					<p class="mt-2 text-gray-500">Loading questions...</p>
				</div>
			{:else if error}
				<div class="p-8 text-center">
					<p class="text-red-600">{error}</p>
					<button 
						on:click={loadQuestions}
						class="mt-2 text-indigo-600 hover:text-indigo-500"
					>
						Try again
					</button>
				</div>
			{:else if sortedQuestions.length === 0}
				<div class="p-8 text-center">
					<p class="text-gray-500">No questions found matching your criteria.</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th 
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
									on:click={() => handleSort('timestamp')}
								>
									<div class="flex items-center space-x-1">
										<span>Timestamp</span>
										{#if sortField === 'timestamp'}
											<span class="text-indigo-600">
												{sortDirection === 'asc' ? '↑' : '↓'}
											</span>
										{/if}
									</div>
								</th>
								<th 
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
									on:click={() => handleSort('category')}
								>
									<div class="flex items-center space-x-1">
										<span>Category</span>
										{#if sortField === 'category'}
											<span class="text-indigo-600">
												{sortDirection === 'asc' ? '↑' : '↓'}
											</span>
										{/if}
									</div>
								</th>
								<th 
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
									on:click={() => handleSort('question')}
								>
									<div class="flex items-center space-x-1">
										<span>Question</span>
										{#if sortField === 'question'}
											<span class="text-indigo-600">
												{sortDirection === 'asc' ? '↑' : '↓'}
											</span>
										{/if}
									</div>
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tags
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Bookmarked
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each sortedQuestions as question (question.id)}
								<tr class="hover:bg-gray-50 transition-colors duration-150">
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<div>
											<div class="font-medium">{formatDate(question.timestamp)}</div>
											<div class="text-gray-500">{formatRelativeTime(question.timestamp)}</div>
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getCategoryColor(question.category)}">
											{question.category}
										</span>
									</td>
									<td class="px-6 py-4">
										<div class="text-sm text-gray-900 max-w-md truncate" title={question.question}>
											{question.question}
										</div>
									</td>
									<td class="px-6 py-4">
										<div class="flex flex-wrap gap-1">
											{#each question.tags.slice(0, 3) as tag}
												<span class="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
													{tag}
												</span>
											{/each}
											{#if question.tags.length > 3}
												<span class="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
													+{question.tags.length - 3}
												</span>
											{/if}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										{#if question.isBookmarked}
											<span class="text-yellow-500 text-lg">⭐</span>
										{:else}
											<span class="text-gray-300 text-lg">☆</span>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div class="flex space-x-2">
											<button
												on:click={() => viewResponse(question)}
												class="text-indigo-600 hover:text-indigo-900 transition-colors"
												title="View AI response"
											>
												🤖 View Response
											</button>
											<button
												on:click={() => confirmDelete(question)}
												class="text-red-600 hover:text-red-900 transition-colors"
												title="Delete question"
											>
												🗑️ Delete
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</main>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm && questionToDelete}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
		<div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
			<div class="mt-3 text-center">
				<div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
					<span class="text-red-600 text-xl">⚠️</span>
				</div>
				<h3 class="text-lg font-medium text-gray-900 mt-4">Delete Question</h3>
				<div class="mt-2 px-7 py-3">
					<p class="text-sm text-gray-500">
						Are you sure you want to delete this question? This action cannot be undone.
					</p>
					<div class="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
						"{questionToDelete.question}"
					</div>
				</div>
				<div class="flex justify-center space-x-4 mt-4">
					<button
						on:click={cancelDelete}
						class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
					>
						Cancel
					</button>
					<button
						on:click={() => deleteQuestion(questionToDelete!)}
						class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Response Modal -->
{#if showResponseModal && selectedQuestion}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
		<div class="relative top-10 mx-auto p-6 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
			<div class="flex justify-between items-start mb-4">
				<div>
					<h3 class="text-xl font-medium text-gray-900">AI Response</h3>
					<p class="text-sm text-gray-500 mt-1">Question: "{selectedQuestion.question}"</p>
				</div>
				<button
					on:click={closeResponseModal}
					class="text-gray-400 hover:text-gray-600 transition-colors"
					title="Close"
					aria-label="Close response modal"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
			
			<div class="bg-gray-50 rounded-lg p-4 mb-4">
				<h4 class="font-medium text-gray-900 mb-2">Question Details</h4>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
					<div>
						<span class="text-gray-500">Category:</span>
						<span class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border {getCategoryColor(selectedQuestion.category)}">
							{selectedQuestion.category}
						</span>
					</div>
					<div>
						<span class="text-gray-500">Asked:</span>
						<span class="ml-2">{formatDate(selectedQuestion.timestamp)}</span>
					</div>
					<div>
						<span class="text-gray-500">Bookmarked:</span>
						<span class="ml-2">{selectedQuestion.isBookmarked ? '⭐ Yes' : '☆ No'}</span>
					</div>
				</div>
			</div>
			
			{#if responseLoading}
				<div class="text-center py-8">
					<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
					<p class="mt-2 text-gray-500">Getting AI response...</p>
				</div>
			{:else if responseError}
				<div class="text-center py-8">
					<div class="text-red-600 mb-2">⚠️ {responseError}</div>
					<button
						on:click={() => viewResponse(selectedQuestion!)}
						class="text-indigo-600 hover:text-indigo-500"
					>
						Try again
					</button>
				</div>
			{:else if aiResponse}
				<div class="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
					<h4 class="font-medium text-gray-900 mb-3">HolmesGPT Response</h4>
					<div class="prose prose-sm max-w-none">
						<div class="formatted-content text-gray-700">
							{@html parseFormatting(aiResponse)}
						</div>
					</div>
				</div>
			{/if}
			
			<div class="flex justify-end mt-6">
				<button
					on:click={closeResponseModal}
					class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom scrollbar for table */
	.overflow-x-auto::-webkit-scrollbar {
		height: 8px;
	}
	
	.overflow-x-auto::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 4px;
	}
	
	.overflow-x-auto::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 4px;
	}
	
	.overflow-x-auto::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
	
	/* Formatted content styles */
	.formatted-content strong {
		color: #d97706;
		font-weight: 600;
	}
	
	.formatted-content em {
		color: #6b7280;
		font-style: italic;
	}
	
	.formatted-content p {
		margin-bottom: 1rem;
	}
	
	.formatted-content ul {
		margin-left: 1rem;
		margin-bottom: 1rem;
	}
	
	.formatted-content li {
		margin-bottom: 0.5rem;
	}
	
	.formatted-content br {
		margin-bottom: 0.5rem;
	}
</style> 