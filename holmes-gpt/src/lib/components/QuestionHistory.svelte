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
        <label for="history-category-filter" class="sr-only">Filter by category</label>
        <select id="history-category-filter" bind:value={selectedCategory} class="category-select">
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
    background: var(--glass-bg);
    border-radius: 20px;
    box-shadow: 0 25px 50px var(--shadow-medium);
    max-height: 70vh;
    width: 60vw;
    max-width: 800px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-primary);
    margin: auto;
    clip-path: inset(0);
  }
  
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2.5rem 2rem 1.5rem;
    border-bottom: 1px solid var(--border-primary);
    background: var(--bg-secondary);
  }
  
  .history-header h3 {
    margin: 0;
    color: var(--text-accent);
    font-size: 1.4rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .header-actions {
    display: flex;
    gap: 1rem;
  }
  
  .export-btn, .close-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px var(--shadow-light);
    clip-path: inset(0);
  }
  
  .export-btn {
    background: var(--text-accent);
    color: var(--bg-primary);
  }
  
  .export-btn:hover {
    background: var(--text-accent-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px var(--shadow-medium);
  }
  
  .close-btn {
    background: var(--text-secondary);
    color: var(--bg-primary);
    font-size: 1.2rem;
    padding: 0.75rem 1rem;
  }
  
  .close-btn:hover {
    background: var(--text-muted);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px var(--shadow-medium);
  }
  
  .filters {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border-primary);
    background: var(--bg-secondary);
  }
  
  .filter-group {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .category-select, .search-input {
    padding: 8px 12px;
    border: 1px solid var(--border-secondary);
    border-radius: 6px;
    font-size: 0.9rem;
    background: var(--bg-primary);
    color: var(--text-primary);
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
    color: var(--text-secondary);
  }
  
  .clear-filters-btn {
    padding: 6px 12px;
    border: 1px solid var(--border-secondary);
    background: var(--bg-primary);
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    color: var(--text-primary);
  }
  
  .clear-filters-btn:hover {
    background: var(--bg-secondary);
  }
  
  .question-list {
    flex: 1;
    overflow-y: auto;
    padding: 0;
  }
  
  .question-item {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-secondary);
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .question-item:hover {
    background: var(--bg-secondary);
  }
  
  .question-item.bookmarked {
    background: var(--bg-tertiary);
    border-left: 4px solid var(--text-accent);
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
    color: var(--text-secondary);
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
    color: var(--text-secondary);
  }
  
  .bookmark-btn {
    color: var(--text-accent);
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
  }
  
  .bookmark-btn.bookmarked {
    color: var(--text-accent-hover);
    transform: scale(1.1);
  }
  
  .bookmark-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-accent-hover);
  }
  
  .delete-btn {
    opacity: 0.25;
  }
  
  .delete-btn:hover {
    background: var(--bg-tertiary);
    opacity: 1;
    color: var(--text-error);
  }

  .question-text {
    font-size: 1.1rem;
    line-height: 1.4;
    color: var(--text-primary);
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
    color: var(--text-accent);
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }
  
  .tag {
    padding: 2px 6px;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border-radius: 4px;
    font-size: 0.75rem;
  }
  
  .response-preview {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-style: italic;
    margin-bottom: 4px;
  }
  
  .source-info {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
  
  .empty-state {
    padding: 40px 20px;
    text-align: center;
    color: var(--text-secondary);
  }
  
  .empty-state p {
    margin: 0;
    font-size: 0.95rem;
  }

  /* Mobile Responsive Design */
  @media (max-width: 768px) {
    .question-history-panel {
      width: 95vw;
      max-width: 95%;
      height: 70vh;
      max-height: 70vh;
      border-radius: 12px;
      margin: 0 auto;
      position: relative;
    }

    .history-header {
      padding: 1rem 0.75rem 0.75rem;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      min-height: auto;
    }

    .history-header h3 {
      font-size: 1rem;
      line-height: 1.1;
      margin: 0;
      padding-right: 0.5rem;
      flex: 1;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 0.375rem;
      flex-shrink: 0;
    }

    .export-btn, .close-btn {
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
      font-weight: 500;
      border-radius: 6px;
    }

    .close-btn {
      padding: 0.5rem 0.625rem;
      font-size: 0.9rem;
    }

    .filters {
      padding: 0.75rem;
      flex-shrink: 0;
    }

    .filter-group {
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .category-select, .search-input {
      min-width: unset;
      width: 100%;
      padding: 0.625rem 0.75rem;
      font-size: 0.9rem;
      border-radius: 6px;
      height: 2.5rem;
    }

    .filter-actions {
      flex-direction: row;
      gap: 0.5rem;
      align-items: center;
      justify-content: space-between;
    }

    .bookmark-filter {
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .clear-filters-btn {
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .question-list {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }

    .question-item {
      padding: 0.75rem;
      flex-direction: column;
      gap: 0.5rem;
      align-items: stretch;
    }

    .question-content {
      width: 100%;
    }

    .question-header {
      margin-bottom: 0.375rem;
      gap: 0.5rem;
    }

    .question-text {
      font-size: 0.9rem;
      line-height: 1.3;
      font-weight: 500;
    }

    .bookmark-btn {
      font-size: 1rem;
      min-width: 18px;
      height: 18px;
    }

    .tags {
      gap: 0.25rem;
      margin-bottom: 0.375rem;
    }

    .tag {
      padding: 0.125rem 0.375rem;
      font-size: 0.7rem;
      border-radius: 3px;
    }

    .response-preview {
      font-size: 0.8rem;
      margin-bottom: 0.25rem;
      line-height: 1.2;
    }

    .question-meta {
      align-items: flex-start;
      width: 100%;
      gap: 0.375rem;
    }

    .meta-top {
      justify-content: space-between;
      width: 100%;
      align-items: center;
    }

    .category-badge {
      padding: 0.25rem 0.5rem;
      font-size: 0.7rem;
      border-radius: 8px;
    }

    .timestamp {
      font-size: 0.7rem;
    }

    .question-actions {
      align-self: flex-end;
      margin-top: 0.25rem;
    }

    .delete-btn {
      font-size: 0.9rem;
      padding: 0.25rem;
    }

    .empty-state {
      padding: 1.5rem 0.75rem;
      text-align: center;
    }

    .empty-state p {
      font-size: 0.9rem;
      line-height: 1.4;
    }
  }

  @media (max-width: 480px) {
    .question-history-panel {
      width: 95vw;
      max-width: 95%;
      height: 70vh;
      max-height: 70vh;
      border-radius: 10px;
      margin: 0 auto;
    }

    .history-header {
      padding: 0.875rem 0.625rem 0.625rem;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      min-height: auto;
    }

    .history-header h3 {
      font-size: 0.9rem;
      line-height: 1;
      margin: 0;
      padding-right: 0.25rem;
      flex: 1;
      font-weight: 600;
    }

    .header-actions {
      gap: 0.25rem;
      flex-shrink: 0;
    }

    .export-btn, .close-btn {
      padding: 0.375rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 4px;
    }

    .close-btn {
      padding: 0.375rem 0.5rem;
      font-size: 0.8rem;
    }

    .filters {
      padding: 0.625rem;
    }

    .filter-group {
      gap: 0.375rem;
      margin-bottom: 0.5rem;
    }

    .category-select, .search-input {
      padding: 0.5rem 0.625rem;
      font-size: 0.85rem;
      border-radius: 5px;
      height: 2.25rem;
    }

    .filter-actions {
      flex-direction: column;
      gap: 0.375rem;
      align-items: stretch;
    }

    .bookmark-filter {
      font-size: 0.8rem;
      justify-content: center;
    }

    .clear-filters-btn {
      padding: 0.5rem;
      font-size: 0.75rem;
      border-radius: 5px;
      width: 100%;
    }

    .question-item {
      padding: 0.625rem;
      gap: 0.375rem;
    }

    .question-header {
      margin-bottom: 0.25rem;
      gap: 0.375rem;
    }

    .question-text {
      font-size: 0.85rem;
      line-height: 1.3;
      font-weight: 500;
    }

    .bookmark-btn {
      font-size: 0.9rem;
      min-width: 16px;
      height: 16px;
    }

    .tags {
      gap: 0.1875rem;
      margin-bottom: 0.25rem;
    }

    .tag {
      padding: 0.125rem 0.25rem;
      font-size: 0.65rem;
      border-radius: 2px;
    }

    .response-preview {
      font-size: 0.75rem;
      margin-bottom: 0.1875rem;
      line-height: 1.2;
    }

    .question-meta {
      gap: 0.25rem;
    }

    .category-badge {
      padding: 0.1875rem 0.375rem;
      font-size: 0.65rem;
      border-radius: 6px;
    }

    .timestamp {
      font-size: 0.65rem;
    }

    .question-actions {
      margin-top: 0.1875rem;
    }

    .delete-btn {
      font-size: 0.8rem;
      padding: 0.1875rem;
    }

    .empty-state {
      padding: 1.25rem 0.625rem;
    }

    .empty-state p {
      font-size: 0.85rem;
      line-height: 1.3;
    }
  }
</style>
