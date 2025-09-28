import ReactGA from 'react-ga4';

const TRACKING_ID = 'G-614Z65HVS3';

export const initGA = () => {
  ReactGA.initialize(TRACKING_ID);
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const logEvent = (action: string, category: string, label?: string, value?: number) => {
  ReactGA.event({
    action,
    category,
    label,
    value,
  });
};

export const logCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  ReactGA.event(eventName, parameters);
};