"use client";

import { useState } from "react";
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

  const mutation = useMutation({
    mutationFn: async (action: BookmarkAction) => {
      if (action === "save") {
        return addSavedArticle(articleId);
      }

      return removeSavedArticle(articleId);
    },

    onSuccess: (_, action) => {
      const nextSavedState = action === "save";

      setSaved(nextSavedState);

      void queryClient.invalidateQueries({
        queryKey: ["articles"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["saved-articles"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["article", articleId],
      });
    },

    onError: (error) => {
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

  return (
    <>
      <button
        className={className ? `${styles.button} ${className}` : styles.button}
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

        {label && <span>{label}</span>}
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
