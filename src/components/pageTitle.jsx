/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */

/**
 * Node module
 */


import {Helmet} from 'react-helmet'
import PropTypes from 'prop-types';


const pageTitle = ({title}) => {
    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    )
}

pageTitle.PropTypes = {
    title: PropTypes.string,
}

export default pageTitle