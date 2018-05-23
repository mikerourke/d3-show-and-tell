import * as babel from 'babel-standalone';
import * as babylon from 'babylon';
import isNil from 'lodash/isNil';
import { ContentModel, ContentType } from '../types/contentTypes';

// language=JavaScript
const responsivefyFunction = `
  function responsivefy(svg) {
    // Get container + svg aspect ratio:
    var container = d3.select(svg.node().parentNode);
    // console.log(svg.style('width'));
    // return;
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
`;

// language=JavaScript
const renderFunction = `
  function render(component) {
    ReactDOM.render(component, document.getElementById('contents'));
  }
`;

export const functionStrings = {
  responsivefy: responsivefyFunction,
  render: renderFunction,
};

const validateCode = (codeString: string) => {
  try {
    const options = {
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

export const getTransformedCode = (codeString: string) => {
  const transformedCode = babel.transform(codeString, {
    plugins: ['transform-react-jsx', 'transform-object-rest-spread'],
    presets: ['es2015'],
  });
  return transformedCode.code;
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
  return '';
};

export const appendScriptToPage = (identifier: string, content: string) => {
  // Remove the existing <script> element from the page to prevent
  // duplicate script tags.
  const existingElement = document.querySelector(`#${identifier}`);
  if (!isNil(existingElement)) document.body.removeChild(existingElement);

  // Create a new <script> tag, populate it with the valid code, and append
  // it to the page.
  const scriptElement = document.createElement('script');
  scriptElement.id = identifier;
  scriptElement.text = content;
  document.body.appendChild(scriptElement);
};
