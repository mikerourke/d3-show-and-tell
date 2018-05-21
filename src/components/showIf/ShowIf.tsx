import React from 'react';

const ShowIf: React.SFC<any> = ({ isShown, as, ...props }) => {
  if (!isShown) return null;
  const Element = as;
  return <Element {...props} />;
};

ShowIf.defaultProps = {
  as: 'div',
};

export default ShowIf;
