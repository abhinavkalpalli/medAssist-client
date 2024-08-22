import React, { useState } from "react";
import Modal from "react-modal";
import { uploadImageToCloudinary } from "../../hooks/cloudinary";
import { useSelector, useDispatch } from "react-redux";
import { uploadDocuments, deleteDocument } from "../../services/doctor/apiMethods";
import { updateDoctor } from "../../utils/reducers/doctorReducer";
import swal from 'sweetalert';

Modal.setAppElement('#root');

function DocumentModal({ isOpen, onRequestClose, documents, onAddDocument, onDeleteDocument }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewDocument, setViewDocument] = useState(null);
  const Doctor = useSelector((state) => state?.doctor?.doctorData);
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      let uploadFile = await uploadImageToCloudinary(selectedFile);
      const formData = {
        email: Doctor.email,
        photo: uploadFile
      };
      const response = await uploadDocuments(formData);
      if (response.status === 200) {
        console.log('Document uploaded successfully');
        setPreviewUrl(null);
        setSelectedFile(null);
        onAddDocument(uploadFile);
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (index) => {
    try {
      const confirmed = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this document!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (confirmed) {
        const response = await deleteDocument(Doctor.email, index);
        if (response.status === 200) {
          onDeleteDocument(index);
          dispatch(updateDoctor({ doctorData: { ...Doctor, documents: response.data.documents } }));
          swal("Deleted!", "The document has been deleted.", "success");
        } else {
          console.error('Failed to delete document');
          swal("Failed!", "There was a problem deleting the document.", "error");
        }
      } else {
        swal("Cancelled", "The document is safe.", "info");
      }
    } catch (error) {
      console.error('Error deleting document', error);
      swal("Error!", "An unexpected error occurred.", "error");
    }
  };

  const handleViewDocument = (doc) => {
    setViewDocument(doc);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Document Preview"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl mb-4">Uploaded Documents</h2>
        {viewDocument ? (
          <div className="border p-2 rounded bg-gray-100 mb-4">
            {viewDocument.endsWith('.pdf') ? (
              <iframe
                src={viewDocument}
                title="Document Preview"
                className="w-full h-64"
              ></iframe>
            ) : (
              <img
                src={viewDocument}
                alt="Document Preview"
                className="w-full h-64 object-contain"
              />
            )}
            <button
              onClick={() => setViewDocument(null)}
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
                        onClick={() => handleViewDocument(doc)}
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(index)}
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-300 ease-in-out"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No documents uploaded yet</p>
              )}
            </div>
            <div className="mt-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-700 transition duration-300 ease-in-out"
                disabled={uploading}
              />
            </div>
            {previewUrl && (
              <div className="mt-4">
                <h3 className="text-xl">Document Preview:</h3>
                <img src={previewUrl} alt="Document Preview" className="w-full max-h-64 object-cover rounded" />
              </div>
            )}
          </>
        )}
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 ease-in-out"
            disabled={uploading || !selectedFile}
          >
            Submit
          </button>
          <button
            onClick={onRequestClose}
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
