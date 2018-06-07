import React from 'react';
import { connect } from 'react-redux';
import { State as ReduxState } from '@redux/reducers';
import SlideNavigation from './components/SlideNavigation';
import { selectCurrentSlideTitle } from '@redux/content/contentSelectors';

interface StateProps {
  slideTitle: string;
}

interface OwnProps {
  slideNumber: number;
  className: string;
}

type Props = StateProps & OwnProps;

export class ContentsColumnComponent extends React.Component<Props> {
  render() {
    const { slideTitle, slideNumber } = this.props;

    return (
      <div className={this.props.className}>
        <SlideNavigation slideNumber={slideNumber} slideTitle={slideTitle} />
        <div id="contents" className="chart" />
      </div>
    );
  }
}

export default connect((state: ReduxState, { slideNumber }: OwnProps) => ({
  slideTitle: selectCurrentSlideTitle(state, slideNumber),
}))(ContentsColumnComponent);
