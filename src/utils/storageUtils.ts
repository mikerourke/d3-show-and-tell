import * as store from 'store';
import {
  contentTypeArray,
  getArrayOfContentTypeNames,
  getNameForContentType,
} from './commonUtils';
import { StorageRecord } from '@customTypes/common';
import { ContentType } from '@customTypes/content';

/**
 * Returns the key associated with the specified content type.
 * @param contentType Type of content to get key for.
 */
const getStorageKeyForContentType = (contentType: ContentType) => {
  const nameForType = getNameForContentType(contentType);
  if (nameForType) return nameForType.toLowerCase();
  return null;
};

/**
 * Returns the localStorage contents for the specified content type.
 * @param contentType Type of content to get from storage.
 */
export const getStorageForContentType = (contentType: ContentType) => {
  const storageKey = getStorageKeyForContentType(contentType);
  return store.get(storageKey);
};

/**
 * Updates the contents of localStorage for the specified content type with
 *    the specified new values.
 * @param contentType Type of content to update in storage.
 * @param newValues New value to store.
 */
export const setStorageForContentType = (
  contentType: ContentType,
  newValues: StorageRecord,
) => {
  const storageKey = getStorageKeyForContentType(contentType);
  const existingValues = getStorageForContentType(contentType);
  const updatedValues = {
    ...existingValues,
    ...newValues,
  };
  store.set(storageKey, updatedValues);
  return true;
};

/**
 * Updates the values of all content types in localStorage with the specified
 *    values.
 * @param newValues New values for all content types.
 */
export const setStorageForAllContentTypes = (newValues: StorageRecord) => {
  contentTypeArray.forEach(contentType => {
    setStorageForContentType(contentType, newValues);
  });
};

/**
 * Returns the values of all content types in localStorage.
 */
export const getStorageForAllContentTypes = (): Record<
  string,
  StorageRecord
> => {
  const storageByContentType = {};
  const contentTypeNames = getArrayOfContentTypeNames(true);
  store.each((value, key) => {
    if (contentTypeNames.includes(key)) storageByContentType[key] = value;
  });
  return storageByContentType;
};
