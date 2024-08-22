import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function DocumentModal({ isOpen, onClose, documents, onVerify }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handlePreview = (doc) => {
    setPreviewUrl(doc);
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Document Preview"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl mb-4">Uploaded Documents</h2>
        {previewUrl ? (
          <div className="border p-2 rounded bg-gray-100 mb-4">
            {previewUrl.endsWith('.pdf') ? (
              <iframe
                src={previewUrl}
                title="Document Preview"
                className="w-full h-64"
              ></iframe>
            ) : (
              <img
                src={previewUrl}
                alt="Document Preview"
                className="w-full h-64 object-contain"
              />
            )}
            <button
              onClick={handleClosePreview}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300 ease-in-out mt-4"
            >
              Close Preview
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {documents.length > 0 ? (
                documents.map((doc, index) => (
                  <div key={index} className="border p-2 rounded flex justify-between items-center">
                    <span>{doc}</span>
                    <div>
                      <button
                        onClick={() => handlePreview(doc)}
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => window.open(doc, "_blank")}
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No documents uploaded yet</p>
              )}
            </div>
          </>
        )}
        <div className="mt-4 flex justify-end space-x-4">
          {documents.length > 0 && (
            <button
              onClick={onVerify}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 ease-in-out"
            >
              Verify
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300 ease-in-out"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DocumentModal;
