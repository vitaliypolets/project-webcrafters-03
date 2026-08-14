'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/store/auth.store';

import type { BookmarkButtonProps } from '../../article-shared.types';
import { ModalErrorSave } from '../ModalErrorSave/ModalErrorSave';
import styles from './BookmarkButton.module.css';

type BookmarkAction = 'save' | 'remove';

const updateBookmark = async (articleId: string, action: BookmarkAction) => {
  const response = await fetch(
    action === 'save' ? '/api/users/me/bookmarks' : `/api/users/me/bookmarks/${articleId}`,
    {
      method: action === 'save' ? 'POST' : 'DELETE',
      credentials: 'include',
      headers:
        action === 'save'
          ? {
              'Content-Type': 'application/json',
            }
          : undefined,
      body: action === 'save' ? JSON.stringify({ articleId }) : undefined,
    },
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => null);

    throw new Error(payload?.message ?? 'Unable to update bookmark. Please try again.');
  }
};

export const BookmarkButton = ({ articleId, isBookmarked }: BookmarkButtonProps) => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [saved, setSaved] = useState(isBookmarked);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const mutation = useMutation({
    mutationFn: (action: BookmarkAction) => updateBookmark(articleId, action),

    onSuccess: (_, action) => {
      const nextSavedState = action === 'save';

      setSaved(nextSavedState);

      void queryClient.invalidateQueries({
        queryKey: ['articles'],
      });
    },

    onError: (error) => {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to update bookmark. Please try again.',
      );
      setShowErrorModal(true);
    },
  });

  const handleClick = () => {
    if (mutation.isPending) {
      return;
    }

    if (!isAuthenticated) {
      setErrorMessage('To save this article, you need to authorize first');
      setShowErrorModal(true);
      return;
    }

    mutation.mutate(saved ? 'remove' : 'save');
  };

  return (
    <>
      <button
        className={styles.button}
        type="button"
        onClick={handleClick}
        disabled={mutation.isPending}
        aria-label={saved ? 'Remove bookmark' : 'Save bookmark'}
        aria-pressed={saved}
      >
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M6 4.5C6 3.67 6.67 3 7.5 3h9c.83 0 1.5.67 1.5 1.5V21l-6-3.5L6 21V4.5Z"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {showErrorModal && (
        <ModalErrorSave
          title="Error while saving"
          description={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};
