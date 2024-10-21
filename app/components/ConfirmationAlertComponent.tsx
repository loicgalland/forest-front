import React from "react";

interface Props {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

const ConfirmationModal: React.FC<Props> = (props) => {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg p-5">
        <h3 className="text-lg font-bold">Confirmation</h3>
        <p>Êtes-vous sûr de vouloir supprimer cet événement ?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={props.onClose}
            className="mr-2 p-2 bg-gray-300 rounded"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              props.onConfirm(props.id);
              props.onClose();
            }}
            className="p-2 bg-red-600 text-white rounded"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
