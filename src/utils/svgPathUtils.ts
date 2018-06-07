import { parseSVG } from 'svg-path-parser';
import camelCase from 'lodash/camelCase';
import drop from 'lodash/drop';
import isEmpty from 'lodash/isEmpty';
import isNaN from 'lodash/isNaN';
import isString from 'lodash/isString';
import round from 'lodash/round';

const getNumericValue = (value: string | number) => {
  if (isNaN(+value)) return value;
  return +value;
};

const getPathNodes = () => {
  const pathNodes: any = document.querySelectorAll('path:not(.iconButton)');
  const validNodes = [];
  for (const pathNode of pathNodes) {
    const parentName = pathNode.parentNode.getAttribute('name');
    if (parentName) pathNode.setAttribute('name', parentName);
    validNodes.push(pathNode);
  }
  return validNodes;
};

class SvgPathPrettifier {
  axis: string;
  pathNode: any;

  private getComponentNameForRecord = (svgRecord: any) =>
    ({
      'elliptical arc': 'Arc',
      closepath: 'Close',
      curveto: 'CubicBezier',
      'smooth curveto': 'SmoothCubicBezier',
      'horizontal lineto': 'HorizontalLine',
      lineto: 'Line',
      moveto: 'Move',
      'quadratic curveto': 'QuadBezier',
      'smooth quadratic curveto': 'SmoothQuadBezier',
      'vertical lineto': 'VerticalLine',
    }[svgRecord.command]);

  private buildPropsStringPairs(props: any): string[] {
    if (isEmpty(props)) return [];

    return Object.entries(props).map(([key, value]) => {
      if (isString(value)) return `${key}="${value}"`;
      return `${key}={${value}}`;
    });
  }

  private buildPropsStringFromRecord(svgRecord) {
    const { code, command, relative, ...rest } = svgRecord;
    let props = {};

    if (command !== 'elliptical arc') {
      props = Object.entries(rest).reduce(
        (acc, [key, value]: any) => ({ ...acc, [key]: round(value, 1) }),
        {},
      );
    } else {
      props = Object.entries(rest).reduce((acc, [key, value]: any) => {
        if (key === 'largeArc') return { ...acc, large: value };
        if (key === 'sweep') {
          return { ...acc, sweep: value ? 'positive' : 'negative' };
        }
        return { ...acc, [key]: round(value, 1) };
      }, {});
    }

    return this.buildPropsStringPairs(props).join('\n\t\t');
  }

  private buildPathComponentStringFromPathNode() {
    const props = {};

    for (const attribute of this.pathNode.attributes) {
      const { name, value } = attribute;
      if (name !== 'd') {
        const validName = name.replace('class', 'className');
        props[camelCase(validName)] = getNumericValue(value);
      }
    }
    const propsStringPairs = this.buildPropsStringPairs(props);
    const propsString =
      propsStringPairs.length === 0 ? '' : ` ${propsStringPairs.join(' ')}`;
    return ['<Path', propsString, '>'].join('');
  }

  private assignAxisForPath(svgRecords) {
    const moveRecord = svgRecords.find(({ command }) => command === 'moveto');
    if (moveRecord) {
      this.axis = moveRecord.x > moveRecord.y ? 'x' : 'y';
    }
  }

  private getSvgRecordsFromPathNode() {
    let pathValue = this.pathNode.getAttribute('d');
    if (!pathValue) {
      // This is for SVG paths that have their "d" property specified in
      // a CSS file.
      const dValue = window
        .getComputedStyle(this.pathNode)
        .getPropertyValue('d');
      pathValue = dValue.replace(/path\('|'\)/g, '');
    }

    try {
      const records = !!pathValue ? parseSVG(pathValue) : [];
      if (records.length === 0) return [];
      return records.map(
        record => (record.relative ? record : { ...record, relative: false }),
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  private buildComponentStringFromRecord(svgRecord) {
    const componentName = this.getComponentNameForRecord(svgRecord);
    if (componentName === 'Close') return '\t<Close />';

    const propsString = this.buildPropsStringFromRecord(svgRecord);
    const moveType = svgRecord.relative ? 'relative' : 'absolute';
    const contents = [componentName, moveType, propsString].join('\n\t\t');
    return ['\t', '<', contents, '\n\t', '/>'].join('');
  }

  private buildChildrenStringsFromRecords = (svgRecords: any[]) =>
    svgRecords
      .map(svgRecord => this.buildComponentStringFromRecord(svgRecord))
      .join('\n');

  public buildPrettySvgPath(pathNode) {
    this.pathNode = pathNode;
    const pathComponentString = this.buildPathComponentStringFromPathNode();
    const svgRecords = this.getSvgRecordsFromPathNode();
    const childrenString = this.buildChildrenStringsFromRecords(svgRecords);

    this.assignAxisForPath(svgRecords);

    const commentString = `\n// @bookmark`;
    return [commentString, pathComponentString, childrenString, '</Path>'].join(
      '\n',
    );
  }
}

class SvgPathUglifier {
  pathBlocks: any[];

  constructor(pathBlocks: any[]) {
    this.pathBlocks = pathBlocks;
  }

  private cleanupPathBlock = (pathBlock: string) =>
    pathBlock
      .replace(/  +/g, '\t')
      .replace(/\t/g, '')
      .replace(/\n/g, ' ')
      .replace(/> </g, '>\n<');

  private stripJsx = (value: string) => value.replace(/<| \/>|>/g, '').trim();

  private getPropsFromDescriptors = (descriptors: any[]) =>
    descriptors.reduce((acc, descriptor) => {
      if (/absolute|relative/g.test(descriptor)) {
        return { ...acc, type: descriptor };
      }

      if (!/={|="/g.test(descriptor)) return acc;

      const [propName, propValue] = descriptor.split('=');
      const validPropValue = propValue
        .replace(/"positive"|true/g, 1)
        .replace(/"negative"|false/g, 0)
        .replace(/[{}]/g, '');

      return {
        ...acc,
        [propName]: +validPropValue,
      };
    }, {});

  private extrapolatePathStringsFromBlock = (pathBlock: string) =>
    pathBlock.split('\n').reduce((acc, blockValue) => {
      if (/\/\/|<\/|Path/g.test(blockValue)) return acc;
      return [...acc, this.stripJsx(blockValue)];
    }, []);

  private getCommandByNameAndType(name, type) {
    const command = {
      Arc: 'a',
      Close: 'z',
      CubicBezier: 'c',
      SmoothCubicBezier: 's',
      Line: 'l',
      HorizontalLine: 'h',
      VerticalLine: 'v',
      Move: 'm',
      QuadBezier: 'q',
      SmoothQuadBezier: 't',
    }[name];
    return type === 'absolute' ? command.toUpperCase() : command;
  }

  private getSvgRecordsForPathBlock(pathBlock: string) {
    const pathStrings = this.extrapolatePathStringsFromBlock(pathBlock);
    return pathStrings.reduce((acc, pathString) => {
      const [name, ...descriptors] = pathString.split(' ');
      const props = this.getPropsFromDescriptors(descriptors);
      return [
        ...acc,
        {
          name,
          props,
        },
      ];
    }, []);
  }

  private buildPathForPathBlock(pathBlock: string) {
    const svgRecords = this.getSvgRecordsForPathBlock(pathBlock);
    const pathValues = svgRecords.reduce((acc, { name, props }) => {
      const { type, ...rest } = props;
      const command = this.getCommandByNameAndType(name, type);
      return [...acc, command, ...Object.values(rest)];
    }, []);
    return pathValues.join(' ');
  }

  public updatePathsInDocument() {
    const pathNodes: any = getPathNodes();
    this.pathBlocks.forEach((pathBlock, index) => {
      const cleanBlock = this.cleanupPathBlock(pathBlock);
      const newPath = this.buildPathForPathBlock(cleanBlock);
      const pathNode = pathNodes[index];
      if (pathNode) pathNode.setAttribute('d', newPath);
    });
  }
}

const instructionsHeader = `/**
 * Change any of the Path element values and the updates will be reflected
 * in the element display.
 */`;

export const getPathComponentsFromContents = () => {
  const pathNodes: any = getPathNodes();
  if (pathNodes.length === 0) return null;
  const svgPrettifier = new SvgPathPrettifier();
  const componentStrings = pathNodes.map(pathNode =>
    svgPrettifier.buildPrettySvgPath(pathNode),
  );
  const pathBlocks = componentStrings.join('\n');
  return [instructionsHeader, '<Paths>', pathBlocks, '</Paths>'].join('\n');
};

export const updatePathsFromChanges = (newPaths: string) => {
  const pathBlocks = newPaths.split('\n\n');
  const validBlocks = drop(pathBlocks);
  const uglifier = new SvgPathUglifier(validBlocks);
  uglifier.updatePathsInDocument();
};
