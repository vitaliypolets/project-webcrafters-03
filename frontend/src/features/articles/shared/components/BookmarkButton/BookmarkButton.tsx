"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth.store";

import {
  addSavedArticle,
  removeSavedArticle,
} from "@/features/profile/saved-articles/saved-articles.service";

import type { BookmarkButtonProps } from "../../article-shared.types";
import { ModalErrorSave } from "../ModalErrorSave/ModalErrorSave";

import styles from "./BookmarkButton.module.css";

type BookmarkAction = "save" | "remove";

type ArticlesQueryData = {
  pages: Array<{
    data: {
      items: Array<{
        id: string;
        isBookmarked?: boolean;
      }>;
    };
  }>;
  pageParams: unknown[];
};

type ArticleQueryData = {
  data?: {
    isBookmarked?: boolean;
  };
};

export const BookmarkButton = ({
  articleId,
  isBookmarked,
  className,
  label,
}: BookmarkButtonProps) => {
  const queryClient = useQueryClient();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [saved, setSaved] = useState(isBookmarked);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setSaved(isBookmarked);
  }, [isBookmarked]);

  const updateBookmarkCache = (nextSaved: boolean) => {
    queryClient.setQueriesData<ArticlesQueryData>({ queryKey: ["articles"] }, (oldData) => {
      if (!oldData?.pages) {
        return oldData;
      }

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            items: page.data.items.map((article) =>
              article.id === articleId
                ? {
                    ...article,
                    isBookmarked: nextSaved,
                  }
                : article,
            ),
          },
        })),
      };
    });

    queryClient.setQueryData<ArticleQueryData>(["article", articleId], (oldData) => {
      if (!oldData) {
        return oldData;
      }

      return {
        ...oldData,
        data: oldData.data
          ? {
              ...oldData.data,
              isBookmarked: nextSaved,
            }
          : oldData.data,
      };
    });
  };

  const mutation = useMutation({
    mutationFn: async (action: BookmarkAction) => {
      if (action === "save") {
        return addSavedArticle(articleId);
      }

      return removeSavedArticle(articleId);
    },

    onSuccess: (_, action) => {
      const nextSaved = action === "save";

      setSaved(nextSaved);
      updateBookmarkCache(nextSaved);

      void queryClient.invalidateQueries({
        queryKey: ["saved-articles"],
      });
    },

    onError: (error) => {
      const status = (
        error as {
          response?: {
            status?: number;
          };
        }
      )?.response?.status;

      if (status === 409) {
        setSaved(true);
        updateBookmarkCache(true);

        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update bookmark. Please try again.",
      );

      setShowErrorModal(true);
    },
  });

  const handleClick = () => {
    if (mutation.isPending) {
      return;
    }

    if (!isAuthenticated) {
      setErrorMessage("To save this article, you need to authorize first");
      setShowErrorModal(true);

      return;
    }

    mutation.mutate(saved ? "remove" : "save");
  };

  const buttonClassName = [styles.button, label ? styles.withLabel : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <button
        className={buttonClassName}
        type="button"
        onClick={handleClick}
        disabled={mutation.isPending}
        aria-label={saved ? "Remove bookmark" : "Save bookmark"}
        aria-pressed={saved}
      >
        <svg
          className={`${styles.icon} ${saved ? styles.saved : ""}`}
          viewBox="0 0 25 32"
          aria-hidden="true"
        >
          <use href="/icons/sprite.svg#icon-security" />
        </svg>

        {label && <span className={styles.label}>{label}</span>}
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
