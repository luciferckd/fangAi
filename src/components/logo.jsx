/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node modules
 */
import { Link } from "react-router-dom"
import PropTypes from "prop-types";

/**
 *  Assets
 */
import { logoLight, logoDark } from "../assets/assets";

const logo = ({ classes = ''}) => {
  return (
    <Link
              to='/'
              className={`min-w-max max-w-max h-[24px] ${classes}`}
            >
              <img
                src={logoLight}
                alt='phoenix logo'
                width={133}
                height={24}
                className='dark:hidden'
              />
    
              <img
                src={logoDark}
                alt='phoenix logo'
                width={133}
                height={24}
                className='hidden dark:block'
              />
            </Link>
  )
}

logo.propTypes = {
  classes: PropTypes.string,
}

export default logo
