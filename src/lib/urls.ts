export const SITE_ORIGIN = "https://www.behavera.com";

export const BEHAVERA_APP_BASE_URL = "https://app.behavera.com";

export const BEHAVERA_LOGIN_URL = `${BEHAVERA_APP_BASE_URL}/login`;
export const ECHO_PULSE_JOIN_URL = `${BEHAVERA_APP_BASE_URL}/echo-pulse/join`;
export const ECHO_PULSE_TRY_URL = `${BEHAVERA_APP_BASE_URL}/echo-pulse/try`;
export const ACCOUNT_SETUP_URL = `${BEHAVERA_APP_BASE_URL}/setup/`;

export const TERMS_URL = `${SITE_ORIGIN}/terms`;
export const PRIVACY_POLICY_URL = `${SITE_ORIGIN}/privacy-policy`;
export const START_URL = `${SITE_ORIGIN}/start`;

export const PULSE_CHECK_URL_CZ =
  "https://bibi.behavera.com/free/behiro/pulse-showcase-initial?x_lang=cs";
export const PULSE_CHECK_URL_EN =
  "https://bibi.behavera.com/free/behiro/pulse-showcase-initial?x_lang=en";

export function getPulseCheckUrl(language: string): string {
  return language === "cz" ? PULSE_CHECK_URL_CZ : PULSE_CHECK_URL_EN;
}

export const PULSE_SCAN_WINDOW_NAME = "pulseScan";
export const PULSE_SCAN_WINDOW_FEATURES =
  "width=480,height=820,left=200,top=80,toolbar=no,menubar=no,scrollbars=yes,resizable=yes";
