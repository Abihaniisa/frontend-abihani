import React, { useState, useRef } from 'react';
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react';
import { useOrderStore } from '../store/order.store';
import { useAuthStore } from '../store/auth.store';
import { useUIStore } from '../store/ui.store';

interface ReceiptUploadModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const ReceiptUploadModal: React.FC<ReceiptUploadModalProps> = ({ orderId, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadReceipt } = useOrderStore();
  const { currentUser } = useAuthStore();
  const { addToast } = useUIStore();

  if (!orderId) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = (): void => {
    if (!previewUrl) return;

    setIsUploading(true);
    setTimeout(() => {
      uploadReceipt(orderId, previewUrl, currentUser);
      addToast('Receipt uploaded successfully', 'success');
      setIsUploading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-sm bg-[#0B0B0F] border border-neutral-800 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#F5F0E6]">Upload Payment Receipt</h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#B8B2A6] hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-44 rounded-xl border-2 border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden transition-colors"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Receipt preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mb-2">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#F5F0E6]">
                Tap to select screenshot or photo
              </span>
              <span className="text-[10px] text-neutral-500 mt-1">
                PNG, JPG or JPEG from your bank app
              </span>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Buttons */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleUpload}
            disabled={!previewUrl || isUploading}
            className="w-full h-11 rounded-xl bg-[#C41E3A] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#b01a33] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow transition-transform"
          >
            {isUploading ? (
              <span>Uploading...</span>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Confirm Receipt Upload</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-neutral-900 text-[#B8B2A6] text-xs font-medium hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
