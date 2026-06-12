import { useState, useCallback, createContext, useContext } from 'react';

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, title: '', message: '', onConfirm: null, type: 'danger' });

  const confirm = useCallback(({ title, message, type = 'danger' }) => {
    return new Promise((resolve) => {
      setState({ open: true, title, message, type, onConfirm: resolve });
    });
  }, []);

  const handleConfirm = () => {
    state.onConfirm?.(true);
    setState(s => ({ ...s, open: false }));
  };

  const handleCancel = () => {
    state.onConfirm?.(false);
    setState(s => ({ ...s, open: false }));
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.open && (
        <div className="vp-modal-overlay" onClick={handleCancel}>
          <div className="vp-modal-card" onClick={e => e.stopPropagation()}>
            <div className="vp-modal-icon">
              {state.type === 'danger' ? (
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#e74c3c" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              ) : (
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#c9a96e" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18.75h.007v.008H12v-.008z" />
                </svg>
              )}
            </div>
            <h3 className="vp-modal-title">{state.title}</h3>
            <p className="vp-modal-message">{state.message}</p>
            <div className="vp-modal-actions">
              <button className="vp-modal-btn cancel" onClick={handleCancel}>Cancel</button>
              <button className={`vp-modal-btn ${state.type}`} onClick={handleConfirm}>
                {state.type === 'danger' ? 'Delete' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm must be used within ConfirmProvider');
  return context;
}
