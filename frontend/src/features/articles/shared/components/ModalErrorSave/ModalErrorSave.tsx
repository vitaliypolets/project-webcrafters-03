import type { ModalErrorSaveProps } from '../../article-shared.types';

export const ModalErrorSave = ({ message, onClose }: ModalErrorSaveProps) => {
  return (
    <div>
      <p>{message}</p>

      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};
