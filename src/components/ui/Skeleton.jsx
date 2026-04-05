import React from 'react';
import { motion } from 'framer-motion';

export const Skeleton = ({ className, height, width, circle }) => {
  return (
    <div
      className={`bg-zinc-800/40 relative overflow-hidden animate-pulse ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}
      style={{
        height: height || '1rem',
        width: width || '100%',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export const UserSkeleton = () => (
  <div className="flex items-center gap-4 p-3 animate-pulse">
    <Skeleton circle width="48px" height="48px" />
    <div className="flex-1 flex flex-col gap-2">
      <Skeleton width="40%" height="0.8rem" />
      <Skeleton width="60%" height="0.6rem" />
    </div>
  </div>
);

export default Skeleton;
