export const isMobile = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  let viewModeMobile = false;
  let viewModeTablet = true; // eslint-disable-line no-unused-vars

  if (userAgent.indexOf("iphone") != -1) {
    viewModeMobile = true;
    viewModeTablet = false;
  } else if (userAgent.indexOf("ipad") != -1) {
    viewModeMobile = true;
    viewModeTablet = true;
  } else if (userAgent.indexOf("android") != -1) {
    if (userAgent.indexOf("mobile") != -1) {
      viewModeMobile = true;
      viewModeTablet = false;
    } else {
      viewModeMobile = true;
      viewModeTablet = true;
    }
  }

  //viewModeMobile = true;

  return viewModeMobile;
};
