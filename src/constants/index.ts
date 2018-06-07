export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const elementHeights = {
  APP_HEADER: 48,
  APP_HEADER_WITH_MARGINS: 64,
  COLUMN_HEADER: 32,
  EDITOR_TABS: 32,
  EDITOR_MAX: 928,
};

export const ROUTES = {
  app: {
    clientPath: '/',
  },
  slides: {
    clientPath: '/slides',
    display: 'Slides',
  },
};
