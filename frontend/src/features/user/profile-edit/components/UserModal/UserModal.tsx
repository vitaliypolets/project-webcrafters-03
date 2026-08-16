"use client";

import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal/Modal";
import { getAvatarSrc } from "@/utils/getAvatarSrc";
import { useAuthStore } from "@/store/auth.store";

import { ALLOWED_AVATAR_MIME_TYPES, MAX_AVATAR_SIZE } from "../../profile-edit.schema";

import { updateMe } from "../../../me/me.service";

import styles from "./UserModal.module.css";

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserModal({ isOpen, onClose }: UserModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setSession = useAuthStore((state) => state.setSession);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setAvatarFile(null);
    setPreviewUrl(null);
    setError(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setError(null);

    if (!file) {
      return;
    }

    if (!ALLOWED_AVATAR_MIME_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG and WebP are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError("Avatar must be up to 1 MB");
      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);

    setAvatarFile(file);
    setPreviewUrl(newPreviewUrl);
  };

  const handleSave = async () => {
    if (isSubmitting || !avatarFile) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("avatar", avatarFile);

      const updatedUser = await updateMe(formData);

      if (accessToken) {
        setSession(updatedUser, accessToken);
      }

      toast.success("Avatar updated successfully");

      resetForm();
      onClose();
    } catch (err) {
      const message = isAxiosError<{ message?: string }>(err)
        ? (err.response?.data?.message ?? "Failed to update avatar. Please try again.")
        : "Failed to update avatar. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.userModalContent}>
        <h1 className={styles.userModalTitle}>Update your photo</h1>

        <button
          type="button"
          className={styles.avatarPicker}
          onClick={() => inputRef.current?.click()}
          aria-label="Choose avatar"
          disabled={isSubmitting}
        >
          <Image
            src={previewUrl ?? getAvatarSrc(null)}
            alt={previewUrl ? "Avatar preview" : "Default avatar"}
            className={styles.avatarImage}
            width={136}
            height={136}
            priority
            unoptimized={Boolean(previewUrl)}
          />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_AVATAR_MIME_TYPES.join(",")}
          className={styles.avatarFileInput}
          onChange={handleFileChange}
          disabled={isSubmitting}
        />

        {error && <p className={styles.avatarError}>{error}</p>}

        <Button
          className={styles.avatarSaveButton}
          variant="primary"
          size="md"
          type="button"
          disabled={isSubmitting || !avatarFile}
          onClick={handleSave}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </Modal>
  );
}
