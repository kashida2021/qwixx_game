# How to run Typescript + Vitest + React

Followed [this](https://victorbruce82.medium.com/vitest-with-react-testing-library-in-react-created-with-vite-3552f0a9a19a) and [this](https://codingwithmanny.medium.com/quick-vitest-setup-with-vitejs-react-typescript-bea9d3a01b07) guide on setup. 

### Summary: 

Though initializing vite with react and TS get's most of it set up, there are still some extra packages that need to be installed. 

1. React testing library
2. jestdom
3. user-event
4. react-router-dom

There are also some config inside vite.config and tsconfig that need to be set up. 

Inside vite.config, you need to set the environment as jsdom.
Inside tsconfig, you need "types: [vitest/globals]". 

You can also create a setup.ts file for the tests that runs a clean after each test case as well as importing 'jest-dom'. 

Please check package.json, vite.config.ts, tsconfig.json, and tests/setup.ts, as reference. 

# Additional setup:
****
Though following the guides linked above got me most of the way, there were some Types issues which I resolved with the following: 

- Although "import React from "react"" is usually unecessary, I found that an error from Typescript won't go away in the test file unless I have that import even thought it didn't seem to stop the test from running. I believe this only happens with Typescript and isn't flagged when writing in vanilla JS. 

- I also had some issues with TypeScript not recognizing types for the "jest-dom" matchers even though I've installed "@types/testing-library__jest-dom" and imported it in my "tests/setup.ts" as well as including it in my tsconfig file. The only solution was to import it directly into the test file. 

