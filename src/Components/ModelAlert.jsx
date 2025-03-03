import PropTypes from 'prop-types';

function ModelAlert({ show, handleClose, title, message }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-[#F2C79D]">{title}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div className="p-4 bg-gradient-to-r from-[#AFB7AB] to-[#F2C79D] text-black">
          {message}
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-300">
          <button onClick={handleClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Close</button>
          <button 
            onClick={handleClose} 
            className="px-4 py-2 bg-gradient-to-r from-[#AFB7AB] to-[#F2C79D] text-white rounded-lg border-none hover:opacity-90">
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

ModelAlert.propTypes = {
  show: PropTypes.bool.isRequired, 
  handleClose: PropTypes.func.isRequired, 
  title: PropTypes.string.isRequired, 
  message: PropTypes.string.isRequired, 
};

export default ModelAlert;
