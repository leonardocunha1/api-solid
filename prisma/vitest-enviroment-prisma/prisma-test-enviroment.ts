// import { Environment } from "vitest";
import type { Environment } from 'vitest/environments';

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('Setup');

    return {
      teardown() {
        console.log('Teardown');
      },
    };
  },
};
