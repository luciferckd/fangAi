/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node Modules
 */

import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const Snackbar = ({ snackbar }) => {
  // create a frmaer motion variant for snackbar animation

  const snackbarVariant = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 0.2,
        ease: [0.05, 0.7, 0.1, 1],
      },
    },
  };

  const snackbarChildVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {snackbar.open && (
        <motion.div
          variants={snackbarVariant}
          initial='hidden'
          animate='visible'
          exit={{
            opacity: 0,
            transition: { 
              duration: 0.15,
            ease: 'easeOut' 
           },
          }}
          className={`snackbar ${snackbar.type}`}
        >
          <motion.span
            variants={snackbarChildVariants}
            transition={{ duration: 0.2, delay: 0.1, ease: 'easeOut' }}
          >
            {snackbar.message}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Snackbar.propTypes = {
  snackbar: PropTypes.object,
};

export default Snackbar;
