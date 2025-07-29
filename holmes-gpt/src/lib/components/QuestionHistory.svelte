<script lang="ts">
  	import { questionCount, bookmarkedCount, questions, toggleBookmark, deleteQuestion, exportQuestions, searchQuestions } from '$lib/stores/questionStore';
	import type { QuestionHistory } from '$lib/utils/questionStorage';
  import { onMount } from 'svelte';
  
  export let onQuestionSelect: (question: string) => void;
  export let isVisible = false;
  export let onClose: () => void = () => {};
  
  	let selectedCategory = '';
	let searchTerm = '';
	let bookmarkedOnly = false;
	let filteredQuestions: QuestionHistory[] = [];
  
  			$: {
		// Use reactive statement to trigger search when filters change
		const filters = {
			category: selectedCategory || undefined,
			searchTerm: searchTerm || undefined,
			bookmarkedOnly
		};
		
		// Call searchQuestions asynchronously
		searchQuestions(filters).then(questions => {
			filteredQuestions = questions;
		});
	}

  // Force refresh when questions store changes
  $: if ($questions.length > 0) {
    const filters = {
      category: selectedCategory || undefined,
      searchTerm: searchTerm || undefined,
      bookmarkedOnly
    };
    
    searchQuestions(filters).then(questions => {
      filteredQuestions = questions;
    });
  }
  
  	onMount(() => {
		// Stores will automatically load data
		// Initialize filtered questions
		searchQuestions({
			category: selectedCategory || undefined,
			searchTerm: searchTerm || undefined,
			bookmarkedOnly
		}).then(questions => {
			filteredQuestions = questions;
		});
	});
  
  function loadQuestion(question: QuestionHistory) {
    onQuestionSelect(question.question);
  }
  
  				function handleToggleBookmark(questionId: string) {
			console.log('Toggling bookmark for question:', questionId);
			toggleBookmark(questionId);
		}

		function handleDeleteQuestion(questionId: string) {
			if (confirm('Are you sure you want to delete this question?')) {
				deleteQuestion(questionId);
			}
		}

		async function handleExportQuestions() {
			const data = await exportQuestions();
			const blob = new Blob([data], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `holmes-questions-${new Date().toISOString().split('T')[0]}.json`;
			a.click();
			URL.revokeObjectURL(url);
		}
  
  function formatDate(date: Date): string {
    const now = new Date();
    const questionDate = new Date(date);
    const diffInHours = (now.getTime() - questionDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return questionDate.toLocaleDateString();
    }
  }
  
  function clearFilters() {
    selectedCategory = '';
    searchTerm = '';
    bookmarkedOnly = false;
  }
</script>

{#if isVisible}
  <div class="question-history-panel">
    <!-- Header -->
    <div class="history-header">
      			<h3>Your Spiritual Questions ({$questionCount})</h3>
      <div class="header-actions">
                  <button class="export-btn" on:click={handleExportQuestions}>
          Export
        </button>
        <button class="close-btn" on:click={onClose}>
          ×
        </button>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="filters">
      <div class="filter-group">
        <select bind:value={selectedCategory} class="category-select">
          <option value="">All Categories</option>
          <option value="spiritual">Spiritual</option>
          <option value="practical">Practical</option>
          <option value="metaphysical">Metaphysical</option>
          <option value="personal">Personal</option>
          <option value="general">General</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Search questions..." 
          bind:value={searchTerm}
          class="search-input"
        />
      </div>
      
      <div class="filter-actions">
        <label class="bookmark-filter">
          <input type="checkbox" bind:checked={bookmarkedOnly} />
          				Bookmarked only ({$bookmarkedCount})
        </label>
        
        <button class="clear-filters-btn" on:click={clearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
    
    <!-- Question List -->
    <div class="question-list">
      {#if filteredQuestions.length === 0}
        <div class="empty-state">
          		{#if $questions.length === 0}
            <p>No questions saved yet. Start asking Ernest Holmes your spiritual questions!</p>
          {:else}
            <p>No questions match your current filters. Try adjusting your search criteria.</p>
          {/if}
        </div>
      {:else}
        {#each filteredQuestions as question (question.id + question.isBookmarked)}
          <div class="question-item" class:bookmarked={question.isBookmarked}>
            <div class="question-content">
              <div class="question-header">
                <button 
                  class="bookmark-btn" 
                  class:bookmarked={question.isBookmarked}
                  on:click={() => handleToggleBookmark(question.id)}
                  title={question.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  {question.isBookmarked ? '★' : '☆'}
                </button>
                <button 
                  class="question-text" 
                  on:click={() => loadQuestion(question)}
                  on:keydown={(e) => e.key === 'Enter' && loadQuestion(question)}
                  type="button"
                >
                  {question.question}
                </button>
              </div>
              
              {#if question.tags.length > 0}
                <div class="tags">
                  {#each question.tags as tag}
                    <span class="tag">{tag}</span>
                  {/each}
                </div>
              {/if}
              
              {#if question.responsePreview}
                <div class="response-preview">
                  "{question.responsePreview}..."
                </div>
              {/if}
              

            </div>
            
            <div class="question-meta">
              <div class="meta-top">
                <span class="category-badge {question.category}">{question.category}</span>
                {#if formatDate(question.timestamp) !== 'Just now'}
                  <span class="timestamp">{formatDate(question.timestamp)}</span>
                {/if}
              </div>
              <div class="question-actions">
                <button 
                  class="delete-btn" 
                  on:click={() => handleDeleteQuestion(question.id)}
                  title="Delete question"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/if}

<style>
  .question-history-panel {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    max-height: 80vh;
    width: 60vw;
    max-width: 800px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  
  .history-header h3 {
    margin: 0;
    color: #374151;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .header-actions {
    display: flex;
    gap: 10px;
  }
  
  .export-btn, .close-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
  }
  
  .export-btn {
    background: #3b82f6;
    color: white;
  }
  
  .export-btn:hover {
    background: #2563eb;
  }
  
  .close-btn {
    background: #6b7280;
    color: white;
    font-size: 1.2rem;
    padding: 8px 12px;
  }
  
  .close-btn:hover {
    background: #4b5563;
  }
  
  .filters {
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  
  .filter-group {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .category-select, .search-input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.9rem;
  }
  
  .category-select {
    min-width: 140px;
  }
  
  .search-input {
    flex: 1;
  }
  
  .filter-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .bookmark-filter {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    color: #6b7280;
  }
  
  .clear-filters-btn {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
  }
  
  .clear-filters-btn:hover {
    background: #f3f4f6;
  }
  
  .question-list {
    flex: 1;
    overflow-y: auto;
    padding: 0;
  }
  
  .question-item {
    padding: 16px 20px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .question-item:hover {
    background: #f9fafb;
  }
  
  .question-item.bookmarked {
    background: #fef3c7;
  }
  
  .question-content {
    flex: 1;
  }
  
  .question-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  
  .question-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }
  
  .meta-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .category-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .category-badge.spiritual {
    background: #dbeafe;
    color: #1e40af;
  }
  
  .category-badge.practical {
    background: #dcfce7;
    color: #166534;
  }
  
  .category-badge.metaphysical {
    background: #f3e8ff;
    color: #7c3aed;
  }
  
  .category-badge.personal {
    background: #fef3c7;
    color: #92400e;
  }
  
  .category-badge.general {
    background: #f3f4f6;
    color: #374151;
  }
  
  .timestamp {
    font-size: 0.8rem;
    color: #6b7280;
  }
  
  .question-actions {
    display: flex;
    gap: 8px;
  }
  
  .bookmark-btn, .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    font-size: 1rem;
    transition: all 0.2s ease;
    color: #6b7280;
  }
  
  .bookmark-btn {
    color: #fbbf24;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
  }
  
  .bookmark-btn.bookmarked {
    color: #f59e0b;
    transform: scale(1.1);
  }
  
  .bookmark-btn:hover {
    background: #f3f4f6;
    color: #f59e0b;
  }
  
  .delete-btn {
    opacity: 0.25;
  }
  
  .delete-btn:hover {
    background: #fee2e2;
    opacity: 1;
  }

  .question-text {
    font-size: 1.1rem;
    line-height: 1.4;
    color: #374151;
    margin-bottom: 0;
    background: none;
    border: none;
    text-align: left;
    flex: 1;
    cursor: pointer;
    padding: 0;
    font-weight: 500;
    transition: color 0.2s ease;
  }
  
  .question-text:hover {
    color: #1f2937;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }
  
  .tag {
    padding: 2px 6px;
    background: #e5e7eb;
    color: #374151;
    border-radius: 4px;
    font-size: 0.75rem;
  }
  
  .response-preview {
    font-size: 0.85rem;
    color: #6b7280;
    font-style: italic;
    margin-bottom: 4px;
  }
  
  .source-info {
    font-size: 0.8rem;
    color: #9ca3af;
  }
  
  .empty-state {
    padding: 40px 20px;
    text-align: center;
    color: #6b7280;
  }
  
  .empty-state p {
    margin: 0;
    font-size: 0.95rem;
  }
</style> 