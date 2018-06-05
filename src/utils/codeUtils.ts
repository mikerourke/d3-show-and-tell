import * as babel from 'babel-standalone';
import * as babylon from 'babylon';
import isNil from 'lodash/isNil';
import { ContentType } from '@customTypes/contentTypes';

// language=JavaScript
const sharedCode = `
  function responsivefy(svg) {
    // Get container + svg aspect ratio:
    var container = d3.select(svg.node().parentNode);
    var width = parseInt(svg.style('width')) || 1;
    var height = parseInt(svg.style('height')) || 1;
    var aspect = width / height;
  
    // Add viewBox and preserveAspectRatio properties, and call resize so that
    // svg resizes on inital page load:
    svg.attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);
  
    /**
     * To register multiple listeners for same event type, you need to add
     * namespace, i.e., 'click.foo' necessary if you call invoke this function
     * for multiple svgs API docs.
     * @see https://github.com/mbostock/d3/wiki/Selections#on
     */
    d3.select(window).on('resize.' + container.attr('id'), resize);
  
    // Get width of container and resize svg to fit it:
    function resize() {
      var targetWidth = parseInt(container.style('width'));
      svg.attr('width', targetWidth);
      svg.attr('height', Math.round(targetWidth / aspect));
    }
  }

  function render(component) {
    try {
      ReactDOM.render(component, document.getElementById('contents'));
    } catch (error) {
      console.log(error);
    }
  }
`;

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

export const appendSharedCodeScriptToPage = () => {
  // Create a new <script> tag, populate it with the valid code, and append
  // it to the page.
  const scriptElement = document.createElement('script');
  scriptElement.text = sharedCode;
  appendChildElementToPage('shared-code', 'body', scriptElement);
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
  eval(content);
};
