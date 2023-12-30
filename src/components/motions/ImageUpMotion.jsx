'use client';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const ImageUpMotion = ({ imgSrc, imgWidth, imgHeight, className }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9 }}
      className={className}
    >
      <Image
        src={imgSrc}
        width={imgWidth}
        height={imgHeight}
        alt="motion image"
      />
    </motion.div>
  );
};

export default ImageUpMotion;
