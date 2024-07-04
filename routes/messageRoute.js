import { Router } from 'express';
import { deleteMessage, editMessage, getAllMessages, sendMessae } from '../controller/messageController.js'
const messageRouter=Router()
// GET
messageRouter.get('/:chatId',getAllMessages)
// POST
messageRouter.post('/',sendMessae)
// PUT
messageRouter.put('/delete/:id',deleteMessage)
messageRouter.put('/edit',editMessage)

export default messageRouter;