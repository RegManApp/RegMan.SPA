import i18n from "../i18n";

export const formatNumber = (value, options) => {
  try {
    return new Intl.NumberFormat(i18n.language || "en", options).format(value);
  } catch {
    return String(value);
  }
};

export const formatDateTime = (value, options) => {
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat(i18n.language || "en", options).format(date);
  } catch {
    return String(value);
  }
};
