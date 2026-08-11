'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, children, className = '' }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  // Перевіряємо, чи ми вже на клієнті
  useEffect(() => {
    setMounted(true);
  }, []);

  // Блокування скролу та обробка клавіші Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Якщо компонент не на клієнті або модалка закрита — нічого не рендеримо
  if (!mounted || !isOpen) return null;

  const modalClasses = [styles.modalContent, className].filter(Boolean).join(' ');

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.25 5.25L12 12M12 12L5.25 18.75M12 12L18.75 18.75M12 12L18.75 5.25"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
