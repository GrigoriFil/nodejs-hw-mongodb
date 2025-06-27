import mongoose from 'mongoose';
import {
  getAllContacts,
  getContactById,
} from '../services/contacts.js';


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;


  if (!isValidObjectId(contactId)) {
    return res.status(400).json({
      message: `'${contactId}' is not a valid ID`,
    });
  }

  try {
    const contact = await getContactById(contactId);


    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};