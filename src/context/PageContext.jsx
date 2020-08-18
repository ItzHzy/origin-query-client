import React from 'react';

const PageContext = React.createContext({
    page: 'builder',
    changePage: () => {}
});

export default PageContext