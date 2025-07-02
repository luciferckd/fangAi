/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node modules
 */
import { motion } from 'framer-motion';

const Skeleton = () => {
  const skeletonLines = [1, 2, 3];

  // Defines Framer motion variants for skeleton loading animation
  const skeletonVaiant = {
    start: {},
    end: {
        transition: {
          staggerChildren: 0.15,
        },
    },
  };

  const skeletonChildVariant ={
    start: { opacity: 0.5},
    end:{ opacity: 1},
  }


  return (
    <motion.div
      variants={skeletonVaiant}
      initial='start'
      animate='end'
    >
      {skeletonLines.map((item) => (
        <motion.div
          key={item}
          className='skeleton'
          variants={skeletonChildVariant}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.5,  
          }}
        />
      ))}
    </motion.div>
  );
};

export default Skeleton;
