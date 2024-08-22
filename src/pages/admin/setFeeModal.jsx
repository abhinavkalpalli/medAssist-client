import React from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { updateFee } from "../../services/admin/apiMethods";
import { updateAdmin } from "../../utils/reducers/adminReducer";
import toast from "react-hot-toast";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const headingStyles = {
  backgroundColor: 'blue',
  color: 'white',
  padding: '10px',
  borderRadius: '5px',
  textAlign: 'center'
};

const SetFeeModal = ({ isOpen, onRequestClose, baseFee, setBaseFee, increment, setIncrement }) => {
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.admin.adminData);
  
  const handleSubmit = async () => {
    const data = {
      baseFee,
      Increment: increment,
      email: adminData.email
    };
    const response = await updateFee(data);
    if (response.status === 200) {
        toast.success("Fee updated successfully");
    dispatch(updateAdmin({ adminData: response.data.data }));
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Set Fee Modal"
    >
      <h2 style={headingStyles} className="text-xl font-bold mb-4">Set Fee</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Base Fee:</label>
        <input
          type="number"
          value={baseFee}
          onChange={(e) => setBaseFee(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Increment:</label>
        <input
          type="number"
          value={increment}
          onChange={(e) => setIncrement(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </Modal>
  );
};

export default SetFeeModal;
