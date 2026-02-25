export const getDebugParamsFromPageUrl = () => {
  const pageUrl = new URL(window.location.href);

  const fail = pageUrl.searchParams.get('fail');
  const slow = pageUrl.searchParams.get('slow');

  const debugParams: Record<string, string> = {};

  if (fail === '1') {
    debugParams.fail = '1';
  }

  if (slow === '1') {
    debugParams.slow = '1';
  }

  return debugParams;
};
