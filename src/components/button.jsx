/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node Modules
 */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Common button

const Button = ({
  classes = '',
  variant = 'filled',
  color = 'primary',
  children,
  ...rest
}) => {
  return (
    <button
      className={`btn ${variant} ${color} ${classes}`}
      {...rest}
    >
      {children}

      <div className='state-layer'></div>
    </button>
  );
};

Button.propTypes = {
  classes: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.any,
};

/**
 *  Icon button
 */

const IconBtn = ({ classes = '', icon, size = '', childern, ...rest }) => {
  return (
    <motion.button
      className={`icon-btn ${size} ${classes}`}
      {...rest}
    >

      {childern}

      {!childern && (
        <span className='material-symbols-rounded icon'>{icon}</span>
      )}

      <div className='state-layer'></div>
    </motion.button>
  );
};

IconBtn.propTypes = {
  classes: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.string,
  childern: PropTypes.any,
}

/**
 * Extented fab
 */
const ExtendedFab = ({ href, text, classes = '', ...rest }) => {
  return <Link to={href} className={`extended-fab ${classes}`}
    {...rest}
  >
    <span className='material-symbols-rounded'>add</span>
    <span className="truncate">{text}</span>

    <div className="state-layer"></div>
  </Link>
}

ExtendedFab.propTypes = {
  href: PropTypes.string,
  text: PropTypes.string,
  classes: PropTypes.string,
};

export { Button, IconBtn, ExtendedFab };
