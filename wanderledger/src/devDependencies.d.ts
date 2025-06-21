
// This file is used to declare modules for packages that don't have types
// available. This is useful for packages that are not written in TypeScript
// or for which types have not yet been provided.

// For example, to declare a module for a package named `my-untyped-package`:
// declare module 'my-untyped-package';

// For `jspdf-autotable`, which may not have default types included with jspdf.
declare module 'jspdf-autotable' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autoTable: (...args: any[]) => any;
  export default autoTable;
}
