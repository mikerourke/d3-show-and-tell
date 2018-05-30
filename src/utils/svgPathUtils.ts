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

const getPathNodes = () => document.querySelectorAll('path:not(.iconButton)');

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
    const propsString = this.buildPropsStringPairs(props).join(' ');
    return ['<Path ', propsString, '>'].join('');
  }

  private assignAxisForPath(svgRecords) {
    const moveRecord = svgRecords.find(({ command }) => command === 'moveto');
    if (moveRecord) {
      this.axis = moveRecord.x > moveRecord.y ? 'x' : 'y';
    }
  }

  private getSvgRecordsFromPathNode() {
    const pathValue = this.pathNode.getAttribute('d');
    const records = parseSVG(pathValue);
    return records.map(
      record => (record.relative ? record : { ...record, relative: false }),
    );
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

  private getCommentStringIfAxis() {
    const className = this.pathNode.getAttribute('class');
    if (className !== 'domain') return '';
    return `\n// This is the ${className} for the ${this.axis} axis:`;
  }

  public buildPrettySvgPath(pathNode) {
    this.pathNode = pathNode;
    const pathComponentString = this.buildPathComponentStringFromPathNode();
    const svgRecords = this.getSvgRecordsFromPathNode();
    const childrenString = this.buildChildrenStringsFromRecords(svgRecords);

    this.assignAxisForPath(svgRecords);
    const commentString = this.getCommentStringIfAxis();

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

      if (!/={/g.test(descriptor)) return acc;

      const [propName, propValue] = descriptor.split('=');
      return {
        ...acc,
        [propName]: +propValue.replace(/[{}]/g, ''),
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
      console.log(cleanBlock);
      const newPath = this.buildPathForPathBlock(cleanBlock);
      const pathNode = pathNodes.item(index);
      if (pathNode) pathNode.setAttribute('d', newPath);
    });
  }
}

export const getPathComponentsFromContents = () => {
  const pathNodes: any = getPathNodes();
  const componentStrings = [];
  const svgPrettifier = new SvgPathPrettifier();
  for (const pathNode of pathNodes) {
    componentStrings.push(svgPrettifier.buildPrettySvgPath(pathNode));
  }
  const pathBlocks = componentStrings.join('\n');
  return ['<Paths>', pathBlocks, '</Paths>'].join('\n');
};

export const updatePathsFromChanges = (newPaths: string) => {
  const pathBlocks = newPaths.split('\n\n');
  const validBlocks = drop(pathBlocks);
  const uglifier = new SvgPathUglifier(validBlocks);
  uglifier.updatePathsInDocument();
};
