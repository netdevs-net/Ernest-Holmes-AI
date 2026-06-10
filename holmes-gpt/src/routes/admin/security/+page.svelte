<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { Shield, AlertTriangle, Activity, DollarSign, Users } from '@lucide/svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: metrics = data.metrics;

  async function refreshMetrics() {
    await invalidateAll();
  }

  function formatCost(cost: number): string {
    return `$${cost.toFixed(6)}`;
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  function getThreatLevel(): { level: 'low' | 'medium' | 'high'; color: string; text: string } {
    const threatScore = metrics.rateLimitHits + metrics.botDetections + metrics.promptInjectionAttempts;

    if (threatScore === 0) return { level: 'low', color: 'text-green-500', text: 'Low' };
    if (threatScore < 5) return { level: 'medium', color: 'text-yellow-500', text: 'Medium' };
    return { level: 'high', color: 'text-red-500', text: 'High' };
  }
</script>

<svelte:head>
  <title>Security Dashboard - HolmesGPT Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield class="w-8 h-8 text-blue-600" />
            Security Dashboard
          </h1>
          <p class="mt-2 text-gray-600">Monitor security threats and usage patterns</p>
        </div>
        <button
          on:click={refreshMetrics}
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>

    {#if metrics}
      {@const threatLevel = getThreatLevel()}
      <div class="mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Current Threat Level</h2>
              <p class="text-gray-600">Based on detected security events</p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold {threatLevel.color}">{threatLevel.text}</div>
              <div class="text-sm text-gray-500">Threat Level</div>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Requests</p>
            <p class="text-2xl font-bold text-gray-900">{metrics.totalRequests.toLocaleString()}</p>
          </div>
          <Activity class="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Rate Limit Hits</p>
            <p class="text-2xl font-bold text-orange-600">{metrics.rateLimitHits}</p>
          </div>
          <AlertTriangle class="w-8 h-8 text-orange-600" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Bot Detections</p>
            <p class="text-2xl font-bold text-red-600">{metrics.botDetections}</p>
          </div>
          <Users class="w-8 h-8 text-red-600" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Injection Attempts</p>
            <p class="text-2xl font-bold text-purple-600">{metrics.promptInjectionAttempts}</p>
          </div>
          <Shield class="w-8 h-8 text-purple-600" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Usage Metrics</h3>
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-gray-600">Daily Usage Exceeded:</span>
            <span class="font-medium">{metrics.dailyUsageExceeded}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Avg Tokens/Request:</span>
            <span class="font-medium">{metrics.averageTokensPerRequest.toFixed(0)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Last Updated:</span>
            <span class="font-medium">{formatDate(metrics.lastUpdated)}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Cost Tracking</h3>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Cost</p>
            <p class="text-3xl font-bold text-green-600">{formatCost(metrics.totalCost)}</p>
          </div>
          <DollarSign class="w-12 h-12 text-green-600" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Security Recommendations</h3>
      <div class="space-y-3">
        {#each data.recommendations as recommendation}
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <p class="text-gray-700">{recommendation}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
