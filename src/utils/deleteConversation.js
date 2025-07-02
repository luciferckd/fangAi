/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */


const deleteConversation = ({ id, title, submit }) => {
    const deleteConfrim = confirm(
        `Delete chat> \n\nYou are about to delete the conversation "${title}". \n\nAre you sure?`
    )
    if (!deleteConfrim) return;

    submit(
        {
            request_type: 'delete_conversation',
            conversation_id: id,
            conversation_title: title,
        },
        {
            method: 'DELETE',
            encType: 'application/x-www-form-urlencoded',
            action: '/',
        }
    )
    
}

export default deleteConversation;