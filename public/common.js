function responsivefy(svg) {
  // Get container + svg aspect ratio:
  var container = d3.select(svg.node().parentNode);
  var width = parseInt(svg.style('width')) || 1;
  var height = parseInt(svg.style('height')) || 1;
  var aspect = width / height;

  // Add viewBox and preserveAspectRatio properties, and call resize so that
  // svg resizes on inital page load:
  svg
    .attr('viewBox', '0 0 ' + width + ' ' + height)
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
    const widthInPixels = window
      .getComputedStyle(container.node(), null)
      .getPropertyValue('width');
    var targetWidth = parseInt(widthInPixels);
    svg.attr('width', targetWidth);
    svg.attr('height', Math.round(targetWidth / aspect));
  }
}

function getRenderError(error) {
  var description = error.message;
  var errorStackLine = error.stack.split('\n')[1];
  var functionName = errorStackLine.split(' (eval at')[0].replace('at ', '');

  return React.createElement(
    'div',
    {
      className: 'notification is-danger renderError animated fadeIn',
      id: 'renderError',
    },
    [
      React.createElement(
        'div',
        { className: 'renderErrorTitle' },
        'Render Error Encountered',
      ),
      React.createElement(
        'div',
        { className: 'renderErrorHeader' },
        'Description:',
      ),
      React.createElement('code', {}, description),
      React.createElement(
        'div',
        { className: 'renderErrorHeader' },
        'Function Name:',
      ),
      React.createElement('code', {}, functionName),
      React.createElement('div', { className: 'renderErrorHeader' }, 'Stack:'),
      React.createElement(
        'pre',
        { className: 'renderErrorStack' },
        error.stack,
      ),
    ],
  );
}

function render(component) {
  try {
    ReactDOM.render(component, document.getElementById('contents'));
  } catch (error) {
    var RenderError = getRenderError(error);
    ReactDOM.render(RenderError, document.getElementById('contents'));
  }
}

function definePropertyPolyfill(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var SlideTemplate = React.createClass({
  getInitialState: function getInitialState() {
    var childCount = React.Children.count(this.props.children);
    var shownItems = _.range(1, childCount + 1).reduce(function(acc, item) {
      return Object.assign({}, acc, definePropertyPolyfill({}, item, false));
    }, {});
    var lastShownItem = '0';
    return {
      shownItems: shownItems,
      lastShownItem: lastShownItem,
    };
  },
  componentDidMount: function componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  handleKeyDown: function handleKeyDown(event) {
    if (event.key === 'PageDown' && event.altKey) {
      this.handleNavigationClick();
    }
  },
  handleNavigationClick: function handleNavigationClick() {
    var _state = this.state,
      lastShownItem = _state.lastShownItem,
      shownItems = _state.shownItems;

    var nextItem = +lastShownItem + 1;
    var childCount = React.Children.count(this.props.children);
    if (nextItem >= childCount + 1) return;

    var newShownItems = Object.assign(
      {},
      shownItems,
      definePropertyPolyfill({}, nextItem, true),
    );
    this.setState({
      shownItems: newShownItems,
      lastShownItem: nextItem.toString(),
    });
  },
  getIsShown: function getIsShown(item) {
    return this.state.shownItems[item.toString()];
  },
  render: function render() {
    var _this = this;
    var lineGap = this.props.lineGap || 75;

    return React.createElement(
      'svg',
      { viewBox: '0 0 1440 1080', onClick: this.handleNavigationClick },
      React.createElement(
        'svg',
        { className: 'slideHeader', height: 180 },
        React.createElement('rect', { x: 0, y: 0 }),
        React.createElement(
          'text',
          { x: '50%', y: '50%', className: 'slideText' },
          document.querySelector('#slideTitle').innerHTML,
        ),
      ),
      React.createElement(
        'svg',
        { x: 0, y: 0, width: '100%', height: 900 },
        React.createElement(
          'g',
          { transform: 'translate(75, 255)' },
          React.Children.map(this.props.children, function(child, index) {
            return React.createElement(
              'g',
              {
                transform:
                  'translate(' +
                  _.get(child, ['props', 'offset'], 0) +
                  ', ' +
                  (_.get(child, ['props', 'position'], index + 1) - 1) *
                    lineGap +
                  ')',
              },
              React.cloneElement(child, {
                isShown: _.get(
                  child,
                  ['props', 'alwaysShow'],
                  _this.getIsShown(index + 1),
                ),
              }),
            );
          }),
        ),
      ),
      React.createElement(
        'g',
        { className: 'slideFooter', transform: 'translate(0, 1005)' },
        React.createElement('line', { x1: 0, y1: 0, x2: '100%', y2: 0 }),
        React.createElement(
          'text',
          { x: '50%', y: 40 },
          +window.location.pathname.replace('/slides/', ''),
        ),
        React.createElement('image', {
          href: '../images/pandera-labs.png',
          x: 1135,
          y: 0,
          width: 305,
        }),
      ),
    );
  },
});

var SlideItem = function SlideItem(props) {
  if (!props.isShown) return React.createElement('g', {});
  return React.createElement(props.tag || 'g', props, props.children);
};

var BulletPoint = function BulletPoint(props) {
  var level = props.level || 0;
  delete props.level;
  if (!props.isShown) return React.createElement('g', {});
  var circleClass = level % 2 ? 'hollowBullet' : 'filledBullet';
  var textProps = Object.assign(
    {},
    { className: 'bulletedItemText slideText' },
    props,
  );
  return React.createElement(
    'g',
    {
      transform: 'translate(' + level * 75 + ', 0)',
      className: 'animated fadeIn',
    },
    React.createElement('circle', {
      cx: 0,
      cy: 0,
      r: 5,
      className: circleClass,
    }),
    React.createElement(
      'g',
      { transform: 'translate(15, 0)' },
      React.createElement('text', textProps, props.children),
    ),
  );
};
