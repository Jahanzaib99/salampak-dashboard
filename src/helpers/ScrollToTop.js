import React, { useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { createBrowserHistory } from "history";

function ScrollToTop({ children }) {
    useEffect(() => {
        const browserHistory = createBrowserHistory();
        const unlisten = browserHistory.listen(() => {
            window.scrollTo(0, 0);
        });
        return () => {
            unlisten();
        }
    }, []);

    return <Fragment>{children}</Fragment>;
}

export default withRouter(ScrollToTop);