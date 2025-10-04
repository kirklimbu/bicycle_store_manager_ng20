

export function toFormData(fieldName: string, formValue: any) {
  console.log('file', formValue, 'fieldName', fieldName);

  const formData = new FormData();
  formData.append(fieldName, formValue.file);
  // for (const key of Object.keys(formValue)) {
  //     const value = formValue[key];
  //     formData.append(key, value);
  // }
  return formData;
}
