/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node Modules
 */
import PropTypes from 'prop-types';

const Menu = ({ classes = '', children }) => {
  return <div className={`menu ${classes}`}>{children}</div>;
};

Menu.propTypes = {
  classes: PropTypes.string,
  children: PropTypes.any,
};

export default Menu;