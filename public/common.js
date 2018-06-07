var editorDecorations = [];

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

var SlideTemplate = function SlideTeplate(props) {
  return React.createElement(
    'svg',
    { viewBox: '0 0 1440 1080' },
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
      { x: 0, y: 180, width: '100%', height: 900 },
      React.createElement,
      props.children,
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
};

var BulletedList = React.createClass({
  getInitialState: function getInitialState() {
    var childItems = React.Children.toArray(this.props.children);
    var shownItems = _
      .range(1, childItems.length + 1)
      .reduce(function(acc, item) {
        return _.assign(
          {},
          acc,
          definePropertyPolyfill({}, item, childItems[item - 1].props.isShown),
        );
      }, {});
    var shownChildren = childItems.map(
      (child, index) => (child.props.isShown === true ? index + 1 : 0),
    );
    var lastShownItem = _.max(shownChildren).toString();
    return {
      shownItems: shownItems,
      lastShownItem: lastShownItem,
    };
  },
  componentDidMount: function componentDidMount() {
    document
      .querySelector('#contents')
      .addEventListener('click', this.handleNavigationClick);
  },
  componentWillUnmount: function componentWillUnmount() {
    document
      .querySelector('#contents')
      .removeEventListener('click', this.handleNavigationClick);
  },
  handleNavigationClick: function handleNavigationClick() {
    var _state = this.state,
      lastShownItem = _state.lastShownItem,
      shownItems = _state.shownItems;

    var nextItem = +lastShownItem + 1;
    var childCount = React.Children.count(this.props.children);
    if (nextItem >= childCount + 1) return;

    var newShownItems = _.assign(
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

    return React.createElement(
      'svg',
      _.assign(
        {},
        { width: '100%', height: '100%' },
        _.omit(this.props, 'lineGap'),
      ),
      React.createElement(
        'g',
        { transform: 'translate(75, 75)' },
        React.Children.map(this.props.children, function(child, index) {
          return React.cloneElement(child, {
            lineGap: _.get(_this.props, 'lineGap', 75),
            isShown: _.get(
              child,
              ['props', 'isShown'],
              _this.getIsShown(index + 1),
            ),
            lineItem: _.get(child, ['props', 'lineItem'], index + 1),
          });
        }),
      ),
    );
  },
});

var SlideItem = function SlideItem(props) {
  if (!props.isShown) return React.createElement('g', {});
  var classes = classNames(props.className, 'animated', 'fadeIn');
  return React.createElement(
    props.tag || 'g',
    _.assign({}, props, { className: classes }),
    props.children,
  );
};

var Bullet = function Bullet(props) {
  var circleClass = props.level % 2 ? 'hollowBullet' : 'filledBullet';
  return React.createElement('circle', {
    cx: 0,
    cy: 0,
    r: 5,
    className: circleClass,
  });
};

var BulletPoint = function BulletPoint(props) {
  if (!props.isShown) return React.createElement('g', {});

  var level = _.get(props, 'level', 0);
  var lineGap = _.get(props, 'lineGap', 75);
  var xOffset = _.get(props, 'offset', 0) + level * 75;
  var yOffset = (_.get(props, 'lineItem', 1) - 1) * lineGap;

  var itemProps = _.assign(
    {},
    {
      transform: 'translate(' + xOffset + ', ' + yOffset + ')',
      className: classNames('animated', 'fadeIn'),
    },
    _.omit(props, 'isShown', 'level', 'lineGap', 'lineItem'),
  );

  var textProps = {
    className: classNames('bulletedItemText', 'slideText'),
    style: _.get(props, 'textStyle', {}),
  };

  return React.createElement(
    'g',
    itemProps,
    React.createElement(Bullet, { level }),
    React.createElement(
      'g',
      { transform: 'translate(25, 0)' },
      React.createElement('text', textProps, props.children),
    ),
  );
};
