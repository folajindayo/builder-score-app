/**
 * Form data utilities
 */

/**
 * Converts a FormData object to a plain object
 */
export function formDataToObject(formData: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value.toString();
  }
  return obj;
}

/**
 * Converts an object to FormData
 */
export function objectToFormData(obj: Record<string, string | File>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    formData.append(key, value);
  }
  return formData;
}

/**
 * Gets form values as an object
 */
export function getFormValues(form: HTMLFormElement): Record<string, string> {
  const formData = new FormData(form);
  return formDataToObject(formData);
}

/**
 * Sets form values from an object
 */
export function setFormValues(form: HTMLFormElement, values: Record<string, string>): void {
  for (const [key, value] of Object.entries(values)) {
    const input = form.elements.namedItem(key) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    if (input) {
      input.value = value;
    }
  }
}

/**
 * Resets a form
 */
export function resetForm(form: HTMLFormElement): void {
  form.reset();
}
