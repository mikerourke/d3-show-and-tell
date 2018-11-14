import * as babel from 'babel-standalone';
import * as babylon from 'babylon';
import isNil from 'lodash/isNil';
import {
  getStorageForAllContentTypes,
  setStorageForContentType,
} from '@utils/storageUtils';
import {
  getPathComponentsFromContents,
  updatePathsFromChanges,
} from '@utils/svgPathUtils';
import { ContentType } from '@customTypes/content';

/**
 * Returns the transpiled code by transforming input with Babel.
 * @param codeString ESNext/React code to transform.
 */
export const getTransformedCode = (codeString: string): string => {
  const transformedCode = babel.transform(codeString, {
    plugins: ['transform-react-jsx', 'transform-object-rest-spread'],
    presets: ['es2015'],
  });
  return transformedCode.code;
};

/**
 * Attempts to parse the specified code to ensure it's valid. If valid, return
 *    true, otherwise false.
 * @param codeString Code string to validate.
 */
const validateCode = (codeString: string): boolean => {
  try {
    const options: any = {
      sourceType: 'script',
      plugins: ['jsx', 'objectRestSpread', 'classProperties'],
    };
    babylon.parse(codeString, options);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Attempts to parse the specified JSON string to see if it's valid. If valid,
 *    return true, otherwise false.
 * @param jsonString String of JSON to parse and validate.
 */
const validateJson = (jsonString: string) => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates either code or JSON (depending on contentType specified).
 * @param contentType Type of content to validate.
 * @param content Content to validate.
 */
export const getValidContent = (
  contentType: ContentType,
  content: string,
): any => {
  if (contentType === ContentType.Code && validateCode(content)) {
    return content;
  }

  if (contentType === ContentType.Data && validateJson(content)) {
    const stringifiedContent = JSON.stringify(content);
    return JSON.parse(stringifiedContent);
  }

  return content;
};

/**
 * Appends a DOM element to the current page.
 * @param identifier Value to use for `id` attribute.
 * @param documentLocation Location on HTML document to append (<body> or
 *    <head>).
 * @param elementToAppend DOM element to append to HTML document.
 */
const appendChildElementToPage = (
  identifier: string,
  documentLocation: 'body' | 'head',
  elementToAppend: any,
) => {
  // Remove the existing element from the page to prevent duplicate tags.
  const existingElement = document.querySelector(`#${identifier}`);
  const documentElement: any = document[documentLocation];
  if (!isNil(existingElement)) documentElement.removeChild(existingElement);

  // Append the new element to the document location (head or body).
  elementToAppend.id = identifier;
  documentElement.appendChild(elementToAppend);
};

/**
 * Appends a <style> element to the current page.
 * @param styles Text contents for <style> element.
 */
export const appendCustomStyleToPage = (styles: string) => {
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.appendChild(document.createTextNode(styles));
  appendChildElementToPage('custom-styles', 'head', styleElement);
};

/**
 * If the specified code and data are valid, transform the code, update the
 *    contents in the editor, and execute it.
 * @param code Code value to populate editor.
 * @param data Data value to populate editor.
 */
export const populateAndExecuteCode = (code: string, data: string | object) => {
  if (!validateCode(code)) return;

  // Clear any existing chart content inside the contents element.
  const contentsElement = document.querySelector('#contents');
  if (!isNil(contentsElement)) contentsElement.innerHTML = '';

  const validCode = getValidContent(ContentType.Code, code);
  const validData = getValidContent(ContentType.Data, data as string);
  const content = `
      var currentData = ${validData};
      ${getTransformedCode(validCode)}
    `;
  try {
    eval(content);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Parse the `<path>` elements and update storage.
 */
export const extrapolatePaths = async () => {
  setTimeout(() => {
    const paths = getPathComponentsFromContents();
    const NO_PATHS = `// There are no <path> elements in your Code file!`;
    setStorageForContentType(ContentType.Paths, {
      value: paths || NO_PATHS,
    });
    return Promise.resolve();
  }, 0);
};

/**
 * Update the content on the page.
 * @param contentType Type of content to update.
 * @param newValue
 */
export const applyChangesToContent = (
  contentType?: ContentType,
  newValue?: string,
) =>
  new Promise((resolve, reject) => {
    try {
      const { code, data, styles } = getStorageForAllContentTypes();
      appendCustomStyleToPage(styles.value);
      populateAndExecuteCode(code.value, data.value);

      if (contentType === ContentType.Paths) {
        setTimeout(() => {
          updatePathsFromChanges(newValue);
          resolve();
        }, 100);
      } else {
        setTimeout(() => {
          extrapolatePaths().then(() => {
            resolve();
          });
        }, 500);
      }
    } catch (error) {
      reject(error);
    }
  });
