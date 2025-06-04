import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import GlassCard from '../ui/GlassCard'; // Assuming GlassCard can be used for popover styling

interface BookmarkPreviewPopoverProps {
  url: string;
  isVisible: boolean;
  onClose: () => void;
  style?: React.CSSProperties; // For positioning
}

const BookmarkPreviewPopover: React.FC<BookmarkPreviewPopoverProps> = ({
  url,
  isVisible,
  onClose,
  style,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);
      setIsError(false);
      // Reset iframe src to trigger reload if the same URL is opened again
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank';
        setTimeout(() => {
          if (iframeRef.current) iframeRef.current.src = url;
        }, 0);
      }
    }
  }, [isVisible, url]);

  const handleLoad = () => {
    setIsLoading(false);
    setIsError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  // Timeout for loading, in case onload/onerror don't fire (e.g. X-Frame-Options)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible && isLoading) {
      timer = setTimeout(() => {
        if (isLoading) { // Check again, might have loaded just before timeout
          // If iframeRef.current exists and its contentDocument is null or inaccessible,
          // it often means it was blocked by X-Frame-Options or similar.
          // This is a heuristic. A more robust solution would involve a proxy server
          // to fetch headers, but that's beyond frontend capabilities.
          try {
            if (iframeRef.current && (!iframeRef.current.contentDocument || iframeRef.current.contentDocument.body.innerHTML === "")) {
              handleError();
            } else if (iframeRef.current && iframeRef.current.contentWindow && iframeRef.current.contentWindow.length === 0){
              // Some sites might not throw error but also not load content, contentWindow.length might be 0
              handleError();
            }
          } catch (e) {
            // Cross-origin error likely means it's blocked
            handleError();
          }
        }
      }, 7000); // 7 seconds timeout
    }
    return () => clearTimeout(timer);
  }, [isVisible, isLoading, url]);


  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          style={{ ...style, position: 'absolute', zIndex: 100 }}
        >
          <GlassCard className="w-[320px] h-[240px] p-3 flex flex-col relative"> {/* Fixed size for now */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-2 right-2 p-1 bg-black/30 rounded-full hover:bg-black/50 transition-colors z-10"
              aria-label="Close preview"
            >
              <X size={16} className="text-white/80" />
            </button>

            {isLoading && !isError && (
              <div className="flex-grow flex items-center justify-center text-white/70">
                Loading preview...
              </div>
            )}

            {isError && (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-red-400/90">
                <p className="font-semibold">Preview not available</p>
                <p className="text-xs text-red-400/70">
                  The content may be restricted or unavailable.
                </p>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={isVisible && !isError ? url : 'about:blank'} // Only set src if visible and no error
              title="Bookmark Preview"
              className={`flex-grow w-full h-full border-none bg-white ${ (isLoading || isError) ? 'hidden' : ''}`}
              onLoad={handleLoad}
              onError={handleError}
              sandbox="allow-scripts allow-same-origin" // Some sandboxing for security, might restrict some sites
            />
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookmarkPreviewPopover;
