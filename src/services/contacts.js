import { Contact } from '../db/models/contact.js';
import { saveFileToCloudinary } from '../utils/cloudinary.js';

export const getAllContacts = async (
  { filter = {}, ...params },
  userId,
) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
  } = params;
  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const queryFilter = { ...filter, userId };

  const contactsQuery = Contact.find(queryFilter);
  const totalItems = await Contact.countDocuments(queryFilter);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await contactsQuery.sort(sort).skip(skip).limit(perPage);

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (payload, userId, file) => {
  let photoUrl;
  if (file) {
    const result = await saveFileToCloudinary(file);
    photoUrl = result.url;
  }

  return Contact.create({ ...payload, userId, photo: photoUrl });
};

export const updateContact = async (contactId, payload, userId, file) => {
  let photoUrl;
  if (file) {
    const result = await saveFileToCloudinary(file);
    photoUrl = result.url;
  }

  const updatePayload = photoUrl ? { ...payload, photo: photoUrl } : payload;

  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updatePayload,
    {
      new: true,
    },
  );
  return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};