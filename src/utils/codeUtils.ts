import * as babel from 'babel-standalone';
import * as babylon from 'babylon';
import isNil from 'lodash/isNil';
import { ContentType } from '@customTypes/contentTypes';
import {
  getStorageForAllContentTypes,
  setStorageForContentType,
} from '@utils/storageUtils';
import {
  getPathComponentsFromContents,
  updatePathsFromChanges,
} from '@utils/svgPathUtils';

export const getTransformedCode = (codeString: string) => {
  const transformedCode = babel.transform(codeString, {
    plugins: ['transform-react-jsx', 'transform-object-rest-spread'],
    presets: ['es2015'],
  });
  return transformedCode.code;
};

const validateCode = (codeString: string) => {
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

const validateJson = (jsonString: string) => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
};

export const getValidContent = (
  contentType: ContentType,
  content: any,
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

export const appendCustomStyleToPage = (styles: string) => {
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.appendChild(document.createTextNode(styles));
  appendChildElementToPage('custom-styles', 'head', styleElement);
};

export const populateAndExecuteCode = (code: string, data: string | object) => {
  if (!validateCode(code)) return;

  // Clear any existing chart content inside the contents element.
  const contentsElement = document.querySelector('#contents');
  if (!isNil(contentsElement)) contentsElement.innerHTML = '';

  const validCode = getValidContent(ContentType.Code, code);
  const validData = getValidContent(ContentType.Data, data);
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

export const applyChangesToContent = (
  contentType?: ContentType,
  newValue?: any,
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
