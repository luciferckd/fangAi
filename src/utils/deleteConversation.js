/**
 * @copyright 2024 FangAI
 * @license MIT
 * @author FangAI
 */


const deleteConversation = ({ id, title, submit }) => {
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
  );
};

export default deleteConversation;