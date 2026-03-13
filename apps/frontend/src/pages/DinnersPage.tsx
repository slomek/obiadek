import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { TrelloCard, TrelloLabel, MealSourceCard } from '@obiadek/shared';
import { useAuth, authFetch } from '../auth';

const LABEL_COLORS: Record<string, string> = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  orange: 'bg-orange-100 text-orange-800',
  red: 'bg-red-100 text-red-800',
  purple: 'bg-purple-100 text-purple-800',
  blue: 'bg-blue-100 text-blue-800',
  sky: 'bg-sky-100 text-sky-800',
  lime: 'bg-lime-100 text-lime-800',
  pink: 'bg-pink-100 text-pink-800',
  black: 'bg-gray-800 text-white',
};

function LabelBadge({ label }: { label: TrelloLabel }) {
  const colorClass = LABEL_COLORS[label.color] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
      {label.name || label.color}
    </span>
  );
}

export default function DinnersPage() {
  const { token } = useAuth();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [copyMealsStatus, setCopyMealsStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [selectedMealIds, setSelectedMealIds] = useState<Set<string>>(new Set());

  const { data: meals, isLoading, error } = useQuery({
    queryKey: ['weekly-meals'],
    queryFn: async () => {
      const res = await authFetch(token!, '/api/trello/weekly-meals');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Failed to fetch weekly meals');
      }
      return res.json() as Promise<TrelloCard[]>;
    },
  });

  const { data: mealSources, isLoading: isLoadingSources, error: sourcesError } = useQuery({
    queryKey: ['meal-sources'],
    queryFn: async () => {
      const res = await authFetch(token!, '/api/trello/meal-sources');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Failed to fetch meal sources');
      }
      return res.json() as Promise<MealSourceCard[]>;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  function toggleMealSelection(id: string) {
    setSelectedMealIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleCopyMealDescriptions() {
    try {
      const selected = (meals ?? []).filter((m) => selectedMealIds.has(m.id));
      const text = selected.map((m) => `## ${m.name}\n${m.desc}`).join('\n\n');
      await navigator.clipboard.writeText(text);
      setCopyMealsStatus('copied');
      setTimeout(() => setCopyMealsStatus('idle'), 2000);
    } catch {
      setCopyMealsStatus('error');
      setTimeout(() => setCopyMealsStatus('idle'), 2000);
    }
  }

  async function handleCopyGroceries() {
    try {
      // The fetch is wrapped in a Promise<Blob> passed to ClipboardItem so that
      // navigator.clipboard.write() is called synchronously within the user gesture.
      // Mobile browsers (Safari on iOS) revoke clipboard access after any await,
      // so deferring the fetch inside the ClipboardItem keeps the gesture context alive.
      const blobPromise = authFetch(token!, '/api/trello/grocery-description')
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error((body as { error?: string }).error ?? 'Failed to fetch grocery description');
          }
          const { description } = await res.json() as { description: string };
          return new Blob([description], { type: 'text/plain' });
        });

      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blobPromise })]);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">This Week's Meals</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMealDescriptions}
            disabled={selectedMealIds.size === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              copyMealsStatus === 'copied'
                ? 'bg-green-100 text-green-800'
                : copyMealsStatus === 'error'
                ? 'bg-red-100 text-red-800'
                : selectedMealIds.size === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            {copyMealsStatus === 'copied' ? 'Copied!' : copyMealsStatus === 'error' ? 'Error' : `Copy meal descriptions${selectedMealIds.size > 0 ? ` (${selectedMealIds.size})` : ''}`}
          </button>
          <button
            onClick={handleCopyGroceries}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              copyStatus === 'copied'
                ? 'bg-green-100 text-green-800'
                : copyStatus === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'error' ? 'Error' : 'Copy grocery list'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-gray-500">Loading meals...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error.message}
        </div>
      )}

      {meals && meals.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-gray-500">
          No meals selected for this week yet.
        </div>
      )}

      {meals && meals.length > 0 && (
        <ul className="space-y-3">
          {meals.map((meal) => (
            <li key={meal.id} className="bg-white rounded-lg shadow px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="checkbox"
                  checked={selectedMealIds.has(meal.id)}
                  onChange={() => toggleMealSelection(meal.id)}
                  className="w-4 h-4 shrink-0 accent-blue-600 cursor-pointer"
                />
                <span className="font-medium text-gray-900">{meal.name}</span>
                {meal.labels.map((label) => (
                  <LabelBadge key={label.id} label={label} />
                ))}
              </div>
              <a
                href={meal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Open card
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Meal Sources</h2>

        {isLoadingSources && (
          <div className="text-gray-500">Loading meal sources...</div>
        )}

        {sourcesError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {sourcesError.message}
          </div>
        )}

        {mealSources && mealSources.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-gray-500">
            No meal sources configured.
          </div>
        )}

        {mealSources && mealSources.length > 0 && (
          <ul className="space-y-3">
            {mealSources.map((meal) => (
              <li key={meal.id} className="bg-white rounded-lg shadow px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    {meal.listName}
                  </span>
                  <span className="font-medium text-gray-900">{meal.name}</span>
                  {meal.labels.map((label) => (
                    <LabelBadge key={label.id} label={label} />
                  ))}
                </div>
                <a
                  href={meal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Open card
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
