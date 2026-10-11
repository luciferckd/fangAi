/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node modules
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MOTIVATIONAL_WORDS = [
  'Inspiring...',
  'Thinking...',
  'Focusing...',
  'Creating...',
  'Exploring...',
  'Innovating...',
  'Wisdom...',
  'Patience...',
];

const Skeleton = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect for single motivational word letter by letter
  useEffect(() => {
    const currentWord = MOTIVATIONAL_WORDS[wordIndex];
    let timer;

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, 80);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1200);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % MOTIVATIONAL_WORDS.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex]);

  // Framer motion variants for skeleton loading lines
  const skeletonVariant = {
    start: {},
    end: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const skeletonChildVariant = {
    start: { opacity: 0.35 },
    end: { opacity: 0.9 },
  };

  return (
    <div className='w-full py-1'>
      {/* Single motivational word letter by letter */}
      <div className='flex items-center gap-2 mb-2 text-bodyMedium font-medium text-light-primary dark:text-dark-primary'>
        <span
          className='material-symbols-rounded text-[18px] animate-spin'
          style={{ animationDuration: '4s' }}
        >
          auto_awesome
        </span>
        <span className='tracking-wide'>{displayText}</span>
        <span className='inline-block w-0.5 h-4 bg-light-primary dark:bg-dark-primary animate-pulse -ml-1' />
      </div>

      {/* First line and second line in skeleton format */}
      <motion.div
        variants={skeletonVariant}
        initial='start'
        animate='end'
      >
        {/* First line */}
        <motion.div
          className='skeleton !my-2 !h-3.5 !w-full'
          variants={skeletonChildVariant}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.6,
          }}
        />

        {/* Second line */}
        <motion.div
          className='skeleton !my-2 !h-3.5 !w-3/4'
          variants={skeletonChildVariant}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.6,
            delay: 0.15,
          }}
        />
      </motion.div>
    </div>
  );
};

export default Skeleton;
