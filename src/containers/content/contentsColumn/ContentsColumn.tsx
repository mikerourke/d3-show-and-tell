import React from 'react';
import { connect } from 'react-redux';
import { selectCurrentSlideTitle } from '@redux/content/contentSelectors';
import SlideNavigation from './components/SlideNavigation';
import { ReduxState } from '@customTypes/common';

interface ConnectStateProps {
  slideTitle: string;
}

interface OwnProps {
  slideNumber: number;
  className: string;
}

type Props = ConnectStateProps & OwnProps;

/**
 * Slide/content container displaying the slide and navigation bar (on right).
 * @param slideTitle Title of the current slide.
 * @param slideNumber Slide number of the current slide.
 * @param className CSS class to apply to root <div>.
 * @connected
 */
export const ContentsColumnComponent: React.SFC<Props> = ({
  slideTitle,
  slideNumber,
  className,
}) => (
  <div className={className}>
    <SlideNavigation slideNumber={slideNumber} slideTitle={slideTitle} />
    <div id="contents" className="chart" />
  </div>
);

export default connect<ConnectStateProps, null, OwnProps>(
  (state: ReduxState, { slideNumber }: OwnProps) => ({
    slideTitle: selectCurrentSlideTitle(state, slideNumber),
  }),
)(ContentsColumnComponent);
