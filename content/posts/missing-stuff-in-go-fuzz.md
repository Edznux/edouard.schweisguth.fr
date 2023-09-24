---
title: "Missing Stuff in Go (native) Fuzz"
date: 2023-09-24
draft: true
---

I believe most devs can attest that the DevX of the Go ecosystem is fairly pleasant. Simple yet effective in its mission.
If you are lucky enough to never have to touch CGO, `go build` will just work.
Dependencies management, `go mod tidy` will just downloads what you need. You want to cross compile? set `GOARCH` or `GOOS` flags.

Sometimes you need to do twiddle a few things around like download the correct C libs because you use `CGO`, or set some env var to enable some flags.

But the fuzzing tooling, despite being a really nice addition to the native toolchain is just not yet up to that high standard.
Here are some things that I feel could be improved to make fuzzing even more effective and easy to integrate into everybody's workflow.

## The documentation

I'm probably not the best documentation reader out there - I have to admit; but:
How do you compile a fuzzing harness as a dedicated binary, like an equivalent of `go test -c` ?
Well, just write `go test -c -fuzz=FuzzMyHarness` right? Wrong, it will compile without instrumentation and tell you that. The solution? `go test -c -d=libfuzzer` which I found in the code somewhere while reading what the toolchain was doing.

Writing a fuzz harness in a file that you forgot to suffix with  `_test.go` and then running `go test -fuzz=FuzzMyFunction` will just... run the test successfully and then exit. Not fuzz anything.
Adding a warning message saying "the provided function name does not match any harness in the _test.go files provided" would have saved me.... too more time that I can admit.

## Features

In order to see how effective a fuzzing campaign is and how good the harness are, a code coverage metrics is really helpful. As far as I can tell, there's no such thing currently.
The `-cover` flag that can be used for other kind of test just don't work. There's an open issue on the github tracker [#46765](https://github.com/golang/go/issues/46765)
Getting the ability to see what a harness is able to trigger, where it struggles... would be a huge help for developers trying to write their harnesses.
Also, as a security engineer, having some way to visualize progress of a long running fuzzing campaign would be super helpful to see if progress is being made or not.
There are already profiles for memory and CPU, with timeline visualization for usual operation time. Wouldn't it be nice to have such feature available here?
I wrote a very basic [statsd metric submitter](https://github.com/AFLplusplus/AFLplusplus/pull/571) for AFL++ a few years back and it's been a nice thing to have for me ever since.
But I think Go could do even better because it can be integrated directly with the official tooling.


## Community packages

The Go fuzzing community is really nice, but still young but misses some good libs and packages to help developers write harnesses.
Notable mentions are:
- [fzgen](https://github.com/thepudds/fzgen) to generate automatically harnesses. It even supports fuzzing functions "chains".
- [go-fuzz-headers](https://github.com/AdaLogics/go-fuzz-headers) to generate structured inputs (struct producer, SQL query generator)

But I still miss a way for default toolchain to generate complex data structures in a sane way.

# Notes
Core:
- documentation
  - how to swap the fuzz engine
  - how to build test binaries
  - what are the available params
- generator for more complex types / structs


Community:
- structured fuzzer libs like [go-fuzz-headers](https://github.com/AdaLogics/go-fuzz-headers)