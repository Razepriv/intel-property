import React, { useState, useRef, useEffect } from 'react';
import { PropertyDetails, StoredProperty, HistoryEntry } from '../types';

interface AppHeaderProps {
  history: HistoryEntry[];
  savedProperties: StoredProperty[];
  onViewDetails: (details: PropertyDetails) => void;
  onDeleteSavedProperty: (id: string) => void;
}

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-bold text-sky-400">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-sky-300 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-grow pr-2 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};


const AppHeader: React.FC<AppHeaderProps> = ({ history, savedProperties, onViewDetails, onDeleteSavedProperty }) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  const handleViewAndClose = (details: PropertyDetails, modalCloser: () => void) => {
    onViewDetails(details);
    modalCloser();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-slate-800/80 backdrop-blur-md shadow-lg z-40 p-4 border-b border-slate-700">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <div className="text-xl font-bold text-sky-400">Property Intel</div>
          <nav className="flex gap-3">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline mr-1.5 align-text-bottom"><path fillRule="evenodd" d="M2 5.25A3.25 3.25 0 0 1 5.25 2h9.5A3.25 3.25 0 0 1 18 5.25v9.5A3.25 3.25 0 0 1 14.75 18h-9.5A3.25 3.25 0 0 1 2 14.75v-9.5Zm6.25 2.5a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5ZM10.5 9a.75.75 0 0 0 0-1.5h-3a.75.75 0 0 0 0 1.5h3Z" clipRule="evenodd" /></svg>
              Extraction History ({history.length})
            </button>
            <button
              onClick={() => setShowSavedModal(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out text-sm"
            >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline mr-1.5 align-text-bottom"><path d="M5.25 3A2.25 2.25 0 0 0 3 5.25v9.5A2.25 2.25 0 0 0 5.25 17h9.5A2.25 2.25 0 0 0 17 14.75v-9.5A2.25 2.25 0 0 0 14.75 3H5.25Z" /></svg>
              Saved Properties ({savedProperties.length})
            </button>
          </nav>
        </div>
      </header>

      <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title="Extraction History (Last 14 Days)">
        {history.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No extractions in the last 14 days.</p>
        ) : (
          <ul className="space-y-3">
            {history.map(entry => (
              <li key={entry.id} className="bg-slate-700 p-3 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">
                      <span className="font-semibold text-slate-300">Source:</span> {entry.sourceType === 'url' ? 'URL' : 'Text Input'}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-md" title={entry.sourceIdentifier}>
                      {entry.sourceIdentifier}
                    </p>
                    <p className="text-xs text-slate-500">
                      Extracted: {new Date(entry.extractedAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewAndClose(entry.details, () => setShowHistoryModal(false))}
                    className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition"
                  >
                    View
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <Modal isOpen={showSavedModal} onClose={() => setShowSavedModal(false)} title="Saved Properties">
        {savedProperties.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No properties saved yet.</p>
        ) : (
          <ul className="space-y-3">
            {savedProperties.map(prop => (
              <li key={prop.id} className="bg-slate-700 p-3 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <button 
                        onClick={() => handleViewAndClose(prop.details, () => setShowSavedModal(false))}
                        className="text-sky-400 hover:text-sky-300 hover:underline font-semibold text-left block"
                        title={`View details for ${prop.name}`}
                    >
                        {prop.name}
                    </button>
                    <p className="text-xs text-slate-500">
                      Saved: {new Date(prop.storedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center flex-shrink-0 ml-2">
                    <button
                        onClick={() => handleViewAndClose(prop.details, () => setShowSavedModal(false))}
                        className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition"
                    >
                        View
                    </button>
                    <button
                      onClick={() => onDeleteSavedProperty(prop.id)}
                      className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition"
                      title={`Delete ${prop.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b; /* slate-800 */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569; /* slate-600 */
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b; /* slate-500 */
        }
      `}</style>
    </>
  );
};

export default AppHeader;