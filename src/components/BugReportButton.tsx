import React, { useState } from 'react';
import { FaBug } from 'react-icons/fa';
import BugReportModal from './BugReportModal';

interface BugReportButtonProps {
  darkMode: boolean;
}

const BugReportButton: React.FC<BugReportButtonProps> = ({ darkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Floating Bug Report Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={openModal}
          className={`p-3 rounded-full shadow-lg transition-colors duration-200 ${
            darkMode
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
          title="Zgłoś błąd"
          aria-label="Zgłoś błąd"
        >
          <FaBug className="text-xl" />
        </button>
      </div>

      {/* Modal */}
      <BugReportModal
        isOpen={isModalOpen}
        onClose={closeModal}
        darkMode={darkMode}
      />
    </>
  );
};

export default BugReportButton;