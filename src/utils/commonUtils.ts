import { ContentType } from '@customTypes/contentTypes';

export const getNameForContentType = (contentType: ContentType): string =>
  ({
    [ContentType.Code]: 'Code',
    [ContentType.Styles]: 'Styles',
    [ContentType.Data]: 'Data',
    [ContentType.Paths]: 'Paths',
  }[contentType]);

export const contentTypeArray = [
  ContentType.Code,
  ContentType.Styles,
  ContentType.Data,
  ContentType.Paths,
];

export const getArrayOfContentTypeNames = (isLower: boolean) =>
  contentTypeArray.map(contentType => {
    const name = getNameForContentType(contentType);
    return isLower ? name.toLowerCase() : name;
  });

export const getCurrentSlideNumber = () =>
  +window.location.pathname.replace('/slides/', '');
