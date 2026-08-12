'use client';

import { Loader } from '@/components/ui/Loader/Loader';
import {
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { PublicUser } from '@/types/user';
import Button from '@/components/ui/Button/Button';
import { getAuthors } from '@/features/authors/authors.service';

import styles from './AuthorsPage.module.css';
import AuthorsList from '@/features/authors/components/AuthorsList/AuthorsList';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Container } from '@/components/ui/Container';

export default function AuthorsPage() {
  console.log('🟢 AuthorsPage RENDER');

  const queryClient = useQueryClient();

  console.log('🟡 queryClient:', queryClient);

  const query = useInfiniteQuery({
    queryKey: ['authors'],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      console.log('➡️ useInfiniteQuery queryFn START');
      console.log('➡️ pageParam:', pageParam);

      try {
        const result = await queryClient.fetchQuery({
          queryKey: ['authors-page', pageParam],
          queryFn: async () => {
            console.log(
              `➡️ getAuthors(${pageParam}) START`,
            );

            try {
              const response = await getAuthors(pageParam);

              console.log(
                `✅ getAuthors(${pageParam}) SUCCESS`,
              );
              console.log(
                `📦 getAuthors(${pageParam}) response:`,
                response,
              );

              return response;
            } catch (error) {
              console.error(
                `❌ getAuthors(${pageParam}) ERROR:`,
                error,
              );

              throw error;
            }
          },
        });

        console.log(
          `✅ fetchQuery authors-page ${pageParam} SUCCESS:`,
          result,
        );

        return result;
      } catch (error) {
        console.error(
          `❌ useInfiniteQuery queryFn ERROR page ${pageParam}:`,
          error,
        );

        throw error;
      }
    },

    getNextPageParam: (lastPage) => {
      console.log(
        '🔵 getNextPageParam lastPage:',
        lastPage,
      );

      if (!lastPage.hasNextPage) {
        console.log(
          '🔴 getNextPageParam → NO NEXT PAGE',
        );

        return undefined;
      }

      const nextPage = lastPage.page + 1;

      console.log(
        '🟢 getNextPageParam → nextPage:',
        nextPage,
      );

      return nextPage;
    },
  });

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = query;

  console.log('📊 QUERY STATE:', {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
  });

  const authors: PublicUser[] = Array.from(
    new Map(
      (data?.pages.flatMap((page) => page.authors) ?? []).map(
        (author) => [author.id, author],
      ),
    ).values(),
  );

  console.log('👥 AUTHORS:', authors);
  console.log('👥 AUTHORS COUNT:', authors.length);

  useEffect(() => {
    console.log('🟣 AuthorsPage useEffect [data]');

    console.log('🟣 Current data:', data);

    const lastPage = data?.pages.at(-1);

    console.log('🟣 Last page:', lastPage);

    if (!lastPage) {
      console.log(
        '⚪ No last page → skip prefetch',
      );
      return;
    }

    if (!lastPage.hasNextPage) {
      console.log(
        '⚪ hasNextPage=false → skip prefetch',
      );
      return;
    }

    const nextPage = lastPage.page + 1;

    console.log(
      '🚀 PREFETCH START:',
      nextPage,
    );

    queryClient
      .prefetchQuery({
        queryKey: ['authors-page', nextPage],
        queryFn: async () => {
          console.log(
            `🚀 PREFETCH getAuthors(${nextPage}) START`,
          );

          try {
            const result = await getAuthors(nextPage);

            console.log(
              `✅ PREFETCH getAuthors(${nextPage}) SUCCESS`,
              result,
            );

            return result;
          } catch (error) {
            console.error(
              `❌ PREFETCH getAuthors(${nextPage}) ERROR`,
              error,
            );

            throw error;
          }
        },
      })
      .then(() => {
        console.log(
          `✅ PREFETCH page ${nextPage} FINISHED`,
        );
      })
      .catch((error) => {
        console.error(
          `❌ PREFETCH page ${nextPage} FAILED`,
          error,
        );
      });
  }, [data, queryClient]);

  useEffect(() => {
    console.log('🟠 ERROR STATE EFFECT:', {
      isError,
      data,
      error,
    });

    if (isError && !data) {
      console.error(
        '❌ INITIAL AUTHORS LOAD ERROR:',
        error,
      );

      toast.error('Не вдалося завантажити авторів');
    }
  }, [isError, data, error]);

  const handleLoadMore = async () => {
    console.log('🟠 LOAD MORE CLICK');

    console.log({
      hasNextPage,
      isFetchingNextPage,
    });

    if (!hasNextPage) {
      console.log(
        '⚪ Load More stopped: no next page',
      );
      return;
    }

    if (isFetchingNextPage) {
      console.log(
        '⚪ Load More stopped: already fetching',
      );
      return;
    }

    try {
      console.log('🚀 fetchNextPage START');

      const result = await fetchNextPage();

      console.log(
        '✅ fetchNextPage RESULT:',
        result,
      );

      if (result.isSuccess) {
        const newPage = result.data.pages.at(-1);

        console.log(
          '🆕 NEW PAGE:',
          newPage,
        );

        const firstNewAuthor =
          newPage?.authors[0];

        console.log(
          '🆕 FIRST NEW AUTHOR:',
          firstNewAuthor,
        );

        if (firstNewAuthor) {
          requestAnimationFrame(() => {
            console.log(
              '🔎 SEARCH ELEMENT:',
              `[data-author-id="${firstNewAuthor.id}"]`,
            );

            const element =
              document.querySelector(
                `[data-author-id="${firstNewAuthor.id}"]`,
              );

            console.log(
              '🔎 FOUND ELEMENT:',
              element,
            );

            element?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          });
        }
      }
    } catch (error) {
      console.error(
        '❌ LOAD MORE ERROR:',
        error,
      );

      toast.error(
        'Не вдалося завантажити авторів',
      );
    }
  };

  console.log('🔴 BEFORE RENDER:', {
    isPending,
    isError,
    authorsCount: authors.length,
    hasNextPage,
  });

  if (isPending) {
    console.log('⏳ RENDER LOADER');

    return <Loader />;
  }

  if (isError) {
    console.log('❌ RENDER ERROR');

    return null;
  }

  console.log('🟢 RENDER AUTHORS PAGE');

  return (
    <main className={styles.page}>
      <Container>
        <h1>Authors</h1>

        <AuthorsList authors={authors} />

        {hasNextPage && (
          <Button
            type="button"
            size="xl"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            className={styles.button}
          >
            {isFetchingNextPage
              ? 'Loading...'
              : 'Load More'}
          </Button>
        )}
      </Container>
    </main>
  );
}
