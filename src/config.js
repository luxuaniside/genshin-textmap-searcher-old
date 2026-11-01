// Versions offered in the version picker.
// `value` is sent to the API exactly as written, `label` is what people see.
// If the database stores these differently (for example "7.1" rather than
// "7.1 and Older"), change the `value` here.
export const VERSION_OPTIONS = [
  { value: "7.1 and Older", label: "7.1 and Older" },
  { value: "7.2", label: "7.2" },
];

export const SINGLE_PAGE_SIZE = 10;
export const MASS_PAGE_SIZE = 5;
