import { Contact } from '../db/models/contact.js';

export const getAllContacts = async ({ filter = {}, ...params }, userId) => {
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

export const createContact = async (payload) => {
  return Contact.create(payload);
};

export const updateContact = async (filter, payload) => {
  const updatedContact = await Contact.findOneAndUpdate(filter, payload, {
    new: true,
  });
  return { contact: updatedContact };
};

export const deleteContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};