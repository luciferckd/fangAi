/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node Modules
 */
import PropTypes from 'prop-types';

const MenuItem = ({ classes = '', icon, labelText, ...rest }) => {
  return (
    <button
      className={`menu-item ${classes}`}
      {...rest}
    >
      {icon && (
        <span className='material-symbols-rounded icon-small shrink-0'>
          {icon}
        </span>
      )}

      <span className='truncate text-left grow'>{labelText}</span>

      <div className='state-layer'></div>
    </button>
  );
};

MenuItem.propTypes = {
  classes: PropTypes.string,
  icon: PropTypes.string,
  labelText: PropTypes.string,
};

export default MenuItem
