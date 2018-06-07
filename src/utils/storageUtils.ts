import * as store from 'store';
import { ContentType } from '@customTypes/contentTypes';
import {
  contentTypeArray,
  getArrayOfContentTypeNames,
  getNameForContentType,
} from './commonUtils';
import { StorageRecord } from '@customTypes/commonTypes';

const getStorageKeyForContentType = (contentType: ContentType) => {
  const nameForType = getNameForContentType(contentType);
  if (nameForType) return nameForType.toLowerCase();
  return null;
};

export const getStorageForContentType = (contentType: ContentType) => {
  const storageKey = getStorageKeyForContentType(contentType);
  return store.get(storageKey);
};

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

export const setStorageForAllContentTypes = (newValues: StorageRecord) => {
  contentTypeArray.forEach(contentType => {
    setStorageForContentType(contentType, newValues);
  });
};

interface AllContentTypesStorageMap {
  [contentTypeName: string]: StorageRecord;
}

export const getStorageForAllContentTypes = (): AllContentTypesStorageMap => {
  const storageByContentType = {};
  const contentTypeNames = getArrayOfContentTypeNames(true);
  store.each((value, key) => {
    if (contentTypeNames.includes(key)) storageByContentType[key] = value;
  });
  return storageByContentType;
};
