/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node Modules
 */
import PropTypes from 'prop-types';

const menuItem = ({ classes = '', labelText, ...rest }) => {
  return (
    <button className={`menu-item ${classes}`}
     {...rest}
    >
        <span>{labelText}</span>

        <div className="state-layer"></div>
    </button>
  )
}

menuItem.propTypes = {
  classes: PropTypes.string,
  labelText: PropTypes.string,
};

export default menuItem
