function RepostModal({ isOpen, onClose, onConfirm, isReposted }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-xs mx-4 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {isReposted ? 'Desfazer repost?' : 'Repostar?'}
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.77 15.67a.749.749 0 0 0-1.06 0l-2.22 2.22V7.65a3.755 3.755 0 0 0-3.75-3.75h-4.5a.75.75 0 0 0 0 1.5h4.5c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22a.749.749 0 1 0-1.06 1.06l3.5 3.5a.747.747 0 0 0 1.06 0l3.5-3.5a.749.749 0 0 0 0-1.06Zm-10.66 3.28H8.5c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22a.752.752 0 0 0 1.062 0 .749.749 0 0 0 0-1.06l-3.5-3.5a.747.747 0 0 0-1.06 0l-3.5 3.5a.749.749 0 1 0 1.06 1.06l2.22-2.22V16.7a3.755 3.755 0 0 0 3.75 3.75h4.61a.75.75 0 0 0 0-1.5Z"/>
              </svg>
              <span className="font-semibold text-gray-900 dark:text-white">
                {isReposted ? 'Desfazer repost' : 'Repostar'}
              </span>
            </button>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-6 py-4 text-center font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default RepostModal;