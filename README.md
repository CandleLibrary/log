# CandleLibrary Log

A simple, lightweight logging library. 

Built for EcmaScript 5 modules & TypeScript. 

Zero Dependencies.

## Usage

Add package as a dependency in your project

```bash
$ npm install --save @candlelib/log
```

Use within your project

```typescript

import log from "@candlelib/log"

const logger = log.createLogger("Test")

logger.log("Hello World")

// -> Test > Hello World

```

Logging can be nested

```typescript

const sub_logger = logger.createLogger("Sub-Test")

sub_logger.log("Hello Sub-World")

// -> Test-Sub-Test > Hello Sub-World

```

and can be tuned for specific uses

```typescript 

logger.getLogger("Sub-Test").deactivate(log.LogLevel.DEBUG);

sub_logger.debug("Echo")

// No output

sub_logger.warn("ECHO!")

// -> Test-Sub-Test > Hello Sub-World

```

## LICENSE

Copyright 2021 Anthony Weathersby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
