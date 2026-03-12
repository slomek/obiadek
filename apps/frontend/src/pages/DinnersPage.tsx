import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { TrelloCard, TrelloLabel } from '@obiadek/shared';
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

  async function handleCopyGroceries() {
    try {
      const res = await authFetch(token!, '/api/trello/grocery-description');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Failed to fetch grocery description');
      }
      const { description } = await res.json() as { description: string };
      await navigator.clipboard.writeText(description);
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
  );
}
