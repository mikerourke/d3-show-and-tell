import { ContentType } from '@customTypes/content';

/**
 * Returns the display name for the specified content type.
 * @param contentType Type of content to get display name for.
 */
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

/**
 * Returns array of the name that corresponds with each content type.
 * @param isLower Indicates if the name should be lowercase.
 */
export const getArrayOfContentTypeNames = (isLower: boolean) =>
  contentTypeArray.map(contentType => {
    const name = getNameForContentType(contentType);
    return isLower ? name.toLowerCase() : name;
  });

/**
 * Extrapolates the current slide number from the window's location.
 */
export const getCurrentSlideNumber = (): number =>
  +window.location.pathname.replace('/slides/', '');
