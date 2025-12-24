export const getApiErrorMessageKey = (error) => {
  // Frontend uses ApiResponse { success, message, data }
  const message = error?.response?.data?.message;
  if (!message) return null;

  // Map known backend validation messages to i18n keys
  if (String(message).toLowerCase().includes("studentid is required")) {
    return "errors.studentIdRequired";
  }

  return null;
};
