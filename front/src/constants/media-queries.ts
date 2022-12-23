import { MediaQueryAllQueryable } from 'react-responsive';

type Query = Partial<
  MediaQueryAllQueryable & {
    query?: string | undefined;
  }
>;

// Small devices (landscape phones, 576px and up)
export const sm: Query = {
  query: '(min-width: 576px)',
};

// Medium devices (tablets, 768px and up)
export const md: Query = {
  query: '(min-width: 768px)',
};

// Large devices (desktops, 992px and up)
export const lg: Query = {
  query: '(min-width: 992px)',
};

// Extra large devices (large desktops, 1200px and up)
export const xl: Query = {
  query: '(min-width: 1200px)',
};
