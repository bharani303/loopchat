import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { createPortal } from 'react-dom';
import { Check, X, Loader2 } from 'lucide-react';

export default function ImageCropModal({ imageSrc, onComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      setIsCropping(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onComplete(croppedBlob);
    } catch (e) {
      console.error("Cropping failed", e);
      onCancel();
    } finally {
      setIsCropping(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#1E1F22] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#3A3C42]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#3A3C42] flex justify-between items-center bg-[#2B2D31]">
          <h3 className="text-[#F2F3F5] font-bold text-lg">Crop Your Photo</h3>
          <button onClick={onCancel} className="text-[#949BA4] hover:text-[#DBDEE1] transition-colors bg-[#1E1F22] p-1.5 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Cropper Container */}
        <div className="relative h-[60vh] min-h-[400px] w-full bg-black/50">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} 
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            objectFit="contain"
            showGrid={true}
          />
        </div>

        {/* Footer Controls */}
        <div className="px-5 py-4 border-t border-[#3A3C42] bg-[#2B2D31] flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[#B5BAC1] text-xs font-bold uppercase tracking-wider">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="flex-1 accent-purple-500 h-1.5 bg-[#1E1F22] rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={onCancel}
              disabled={isCropping}
              className="px-5 py-2.5 rounded-lg font-bold text-[14px] text-[#DBDEE1] hover:bg-[#35373C] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isCropping}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-[14px] text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isCropping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isCropping ? 'Processing...' : 'Apply & Send'}
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
