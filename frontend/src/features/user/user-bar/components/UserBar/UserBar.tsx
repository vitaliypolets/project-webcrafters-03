"use client";

import React from "react";
import css from './UserBar.module.css';
import { Modal } from '@/components/ui/Modal/Modal';

export default function LogoutModal({
  
}) {
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
  <div className="logout-content">
      

      <h2>Are you shure?</h2>

      <p>We will miss you!</p>

      <div className="actions">
        <button
          type="button"
          className="button button-primary"
          onClick={onLogout}
        >
          Log out
        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>

    </div>
</Modal>
    
  );
}
