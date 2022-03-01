// This hook is to prevent react-router from restoring previous scrolling position
// so switching tabs would always scroll to the top

import React, { useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

const ScrollToTop: React.FC<RouteComponentProps> = ({ history }) => {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  });

  return null;
};

export default withRouter(ScrollToTop);
