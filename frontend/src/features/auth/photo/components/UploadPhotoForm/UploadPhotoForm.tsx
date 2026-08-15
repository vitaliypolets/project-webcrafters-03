"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal/Modal";
import { useAuthStore } from "@/store/auth.store";
import { getAvatarSrc } from "@/utils/getAvatarSrc";
import { getRegisterDraft, clearRegisterDraft } from "@/features/auth/register";
import { registerUser } from "../../photo.service";
import { ALLOWED_AVATAR_MIME_TYPES, MAX_AVATAR_SIZE } from "../../photo.schema";
import styles from "./UploadPhotoForm.module.css";

export default function UploadPhotoForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedRef = useRef(false);

  useEffect(() => {
    if (!getRegisterDraft()) {
      router.replace("/register");
    }
  }, [router]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setError(null);

    if (!file) {
      setAvatarFile(null);
      setPreviewUrl(null);
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

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const completeRegistration = async (file: File | null) => {
    if (completedRef.current) return;

    const draft = getRegisterDraft();
    if (!draft) {
      router.replace("/register");
      return;
    }

    completedRef.current = true;
    setIsSubmitting(true);

    try {
      const result = await registerUser({
        name: draft.name,
        email: draft.email,
        password: draft.password,
        avatar: file,
      });

      setSession(result.user, result.accessToken);
      clearRegisterDraft();
      toast.success("Welcome to Harmoniq!");
      router.replace("/");
    } catch (err) {
      completedRef.current = false;

      const message = isAxiosError<{ message?: string }>(err)
        ? (err.response?.data?.message ?? "Registration failed. Please try again.")
        : "Registration failed. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    completeRegistration(null);
  };

  return (
    <Modal isOpen onClose={handleClose} backdrop="transparent">
      <div className={styles.content}>
        <h1 className={styles.title}>Upload your photo</h1>

        <button
          type="button"
          className={styles.avatarButton}
          onClick={() => inputRef.current?.click()}
          aria-label="Choose avatar"
        >
          <Image
            src={previewUrl ?? getAvatarSrc(null)}
            alt={previewUrl ? "Avatar preview" : "Default avatar"}
            className={styles.avatarPreview}
            width={136}
            height={136}
            priority
          />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_AVATAR_MIME_TYPES.join(",")}
          className={styles.fileInput}
          onChange={handleFileChange}
        />

        {error && <p className={styles.error}>{error}</p>}

        <Button
          className={styles.saveButton}
          variant="primary"
          size="md"
          type="button"
          disabled={isSubmitting || !avatarFile}
          onClick={() => completeRegistration(avatarFile)}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </Modal>
  );
}
