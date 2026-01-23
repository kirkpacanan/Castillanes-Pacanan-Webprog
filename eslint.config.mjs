import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: new URL(".", import.meta.url).pathname
});

const config = [
  ...compat.extends("next/core-web-vitals")
];

export default config;
