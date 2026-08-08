import type { BookmarkButtonProps } from '../../article-shared.types';

export const BookmarkButton = ({ isBookmarked, onToggle }: BookmarkButtonProps) => {
  return (
    <button type="button" onClick={onToggle}>
      {isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
    </button>
  );
};
