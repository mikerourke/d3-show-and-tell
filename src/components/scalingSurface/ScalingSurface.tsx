import React from 'react';

interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface Props {
  width: number;
  height: number;
  margins: Margins;
  children: any;
}

interface State {
  width: number;
  height: number;
}

export default class ScalingSurface extends React.Component<Props, State> {
  ref: any;
  aspect: any;

  constructor(props: Props) {
    super(props);
    const { width, height } = this.props;
    this.aspect = width / height;
    this.state = {
      width,
      height,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    const widthInPixels = window
      .getComputedStyle(this.ref.parentNode, null)
      .getPropertyValue('width');
    const width = parseInt(widthInPixels, 10);
    const height = Math.round(width / this.aspect);
    this.setState({ width, height });
  };

  handleRef = element => (this.ref = element);

  render() {
    const { left, right, top, bottom } = this.props.margins;
    const fullHeight = this.props.height + top + bottom;
    const fullWidth = this.props.width + left + right;

    return (
      <div style={{ maxWidth: 1000 }}>
        <svg
          width={this.state.width}
          height={this.state.height}
          viewBox={`0 0 ${fullWidth} ${fullHeight}`}
          preserveAspectRatio="xMinYMid"
          ref={this.handleRef}
        >
          <g transform={`translate(${left}, ${top})`}>{this.props.children}</g>
        </svg>
      </div>
    );
  }
}
