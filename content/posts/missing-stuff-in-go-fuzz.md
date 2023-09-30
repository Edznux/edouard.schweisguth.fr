---
title: "Missing Stuff in Go (native) Fuzz"
date: 2023-09-30
tags: ["security", "fuzzing", "go"]
---

Go toolchain is really good. I believe most Go devs can agree that the DevX of the Go ecosystem is pleasant. Simple yet effective in its mission.
Dependencies management, `go mod tidy` will just downloads what you need. You want to cross compile? set `GOARCH` or `GOOS` flags.
If you are lucky enough to never have to touch CGO, `go build` will just work. Otherwise you may need to do twiddle a few things around like download the correct C headers, or set some env var to enable some flags, but it's usually fairly simple.
If you have perf issues, your have `go tool pprof`, and tracing visualization with `go tool trace` built it. You want to be able to read the generated binary in a nice format just use `go tool objdump`.
And they all work out of the box!

The fuzz tooling, on the other hand, isn't all that shiny just yet.
Despite being a really nice addition to the native toolchain is just not yet up to that high standard.

In this post, I'm sharing some things that I feel could be improved to make fuzzing even more effective and easy to integrate into everybody's workflow.

## The documentation

I'm probably not the best documentation reader out there - I have to admit; but I think it could be improved without a huge amount of effort.
Let take a look at the local documentation: `go help test` 
The only sentence where the word "fuzz" appears is in the following paragraph:

```
'Go test' recompile each package along with any files with names matching
the file pattern "*_test.go".
These additional files can contain test functions, benchmark functions, fuzz
tests and example functions. See 'go help testfunc' for more.
```

How do you run the fuzz harness? Are there any options that I need to provide?
`go test` will give you (hopefully) a `PASS` output


How do you compile a fuzzing harness as a dedicated binary, like an equivalent of `go test -c`?
Well, just write `go test -c` right? Wrong, it will compile without instrumentation and tell you that (without telling you how to enable it).
```
warning: the test binary was not built with coverage instrumentation,
so fuzzing will run without coverage guidance and may be inefficient
```

The solution is not that surprising, when you think about it: `go test -c -fuzz=FuzzReverse` but it would be nice to have a message explicitly telling it, maybe even copy paste-able.
```
warning: the test binary was not built with coverage instrumentation,
so fuzzing will run without coverage guidance and may be inefficient.
Provide `-fuzz=` flag in the compilation process to enable it.
```

Then it raises the question: what if you have multiple harnesses? Does the `-fuzz` needs to be passed for each to have instrumentation? (it doesn't)
If you have to work with Bazel, first I'm sorry, second you'll need to provide `gc_goopts = ["-d=libfuzzer"]` in the `rules_go` testing rule.
I first missed it and started to dig the Go documentation to understand why my binaries were built without instrumentation, I couldn't find anything, so I started looking at the code and found [this line in the comment](https://github.com/golang/go/blob/master/src/internal/fuzz/counters_supported.go#L15).
There's an issue in the `rules_go` [Bazel repository here](https://github.com/bazelbuild/rules_go/issues/3088), and the last comment also points to the same piece of code.


Finally, lets talk about little details but that adds up in pain.
Writing a fuzz harness in a file that you forgot to suffix with  `_test.go` and then running `go test -fuzz=FuzzMyFunction` will just... run the test successfully and then exit. Not fuzz anything, and will not tell you that you are doing something dumb.
I mean sure, go test are all in `_test.go` file and that's neat! Nobody would expect to not create fuzz test in non `_test.go` suffixed file....
Except that the "previous" fuzzing support was from the great [go-fuzz](https://github.com/dvyukov/go-fuzz/) package, which required packages to be importable, so usually not in `_test.go` files.
Adding a warning message saying "the provided function name does not match any harness in the *_test.go files provided" would have saved me... much more time that I can admit.

## Unexpected behaviors

Lets say you have a test package like this:

```go
func FuzzReverse(f *testing.F) {
	testcases := []string{"Hello, world", " ", "!12345"}
	for _, tc := range testcases {
		f.Add(tc) // Use f.Add to provide a seed corpus
	}
	f.Fuzz(func(t *testing.T, orig string) {
		rev := Reverse(orig)
		doubleRev := Reverse(rev)
		if orig != doubleRev {
			t.Errorf("Before: %q, after: %q", orig, doubleRev)
		}
		if utf8.ValidString(orig) && !utf8.ValidString(rev) {
			t.Errorf("Reverse produced invalid UTF-8 string %q", rev)
		}
	})
}
```

You have fuzzed the `FuzzReverse` and you've found some things. You managed to get some nice coverage (by doing it manually, afterward) and you're planning on finding more things.
So you add this harness:

```go
func FuzzBla(f *testing.F) {
	f.Fuzz(func(t *testing.T, bla string) {
		if bla == "bla" {
			t.Errorf("wat: %q, after: %q", bla, "bla")
		}
	})
}
```

Then you think, lets just run it with: `go test -fuzz=FuzzBla`, but you get:
```
--- FAIL: FuzzReverse (0.00s)
    --- FAIL: FuzzReverse/50245f130d9b9671 (0.00s)
        fuzz_test.go:28: Reverse produced invalid UTF-8 string "\x91\xdc"
FAIL
```

So, what is happening here?
Well there's a finding in your `testdata` that crashes the previous harness. And Go will happily run it for you without asking you.
So you'll have to run `mv testdata testdata.bak` or remove your `testdata` folder before you can progress further.

## Features
### Code coverage
In order to see how effective a fuzzing campaign is and how good the harness are, a code coverage metrics is really helpful. As far as I can tell, there's no such thing currently.
The `-cover` flag that can be used for other kind of test just don't work. There's an open issue on the github tracker [#46765](https://github.com/golang/go/issues/46765)
Getting the ability to see what a harness is able to trigger, where it struggles... would be a huge help for developers trying to write their harnesses.
Also, as a security engineer, having some way to visualize progress of a long running fuzzing campaign would be super helpful to see if progress is being made or not.
There are already profiles for memory and CPU, with timeline visualization for usual operation time. Wouldn't it be nice to have such feature available here?
I wrote a very basic [statsd metric submitter](https://github.com/AFLplusplus/AFLplusplus/pull/571) for AFL++ a few years back and it's been a nice thing to have for me ever since.
But I think Go could do even better because it can be integrated directly with the official tooling.

### Resources limits (memory and time)

There is no built in support for "timeouts based findings" (usually called "hangs" in the AFL world).
Let say my service is an intake queue that is expected to have very high throughput, how can I make sure that any payload take less than 1ms to parse?
You can surely play with timer and running the case in a goroutine etc... but it's going to be really annoying really fast.
Unit test have a `-timeout` flags, why not fuzz case?

> The time based limit looks to be soon be solved as part of [this change](https://go-review.googlesource.com/c/go/+/526355) and discussion on the related [github issues here](https://github.com/golang/go/issues/48157) :tada:

On the memory side of things, as far as I've seen, it does not seem possible to easily enforce a maximum memory consumption? I've made a few pods explode in while fuzzing because out of memory OOM-kills.
I understand it's a non trivial issue, and probably even more so in a GC based language; but it would be really nice to have a check for a single test case taking more than a threshold amount of memory and mark it as a finding.
This could lead to some "memory usage increase on weird inputs" rabbit hole, but I think it could help reliability and cost for some applications.

### Support for other fuzzing engine

I'm not exactly sure exactly how the integration with libfuzzer is implemented in the code, but having the ability to swap the fuzzing engine would be nice.
Especially with libfuzzer being "deprecated" and the state of the art being so much more advanced.
I'm assuming the the instrumentation might be go specific and can't really be changed; but the execution, the payload generation, the dictionary integration... could be?

A *(dumb)* example that I encountered while writing some of this blog is this:
```go
func FuzzBla(f *testing.F) {
	f.Add("something lol")
	f.Fuzz(func(t *testing.T, bla string) {
		if bla == "bla" {
			t.Errorf("wat: %q, after: %q", bla, "bla")
		}
	})
}
```

`go test -fuzz=FuzzBla` takes a very long time to find the crash *(I actually wasn't bothered enough to let it find the bug...).*
It sure is a stupid example, not saying otherwise, but having a automatic dictionary creation based on the `cmp` values seems like a simple enough improvement that could help quite significantly on keyword based parsers (AFL++ does this for example)

I've yet to try for real `libafl` and more specifically [libafl_libfuzzer](https://github.com/AFLplusplus/LibAFL/tree/main/libafl_libfuzzer) but maybe that can help on the execution side at least? (that's a topic for another time.)

## Community and ecosystem

The Go fuzzing community is nice, but still fairly young and misses some good libs and packages.
Some tools and packages exists, and I want share some notable mentions like these ones:
- [fzgen](https://github.com/thepudds/fzgen) to generate automatically harnesses. It even supports fuzzing functions "chains".
- [go-fuzz-headers](https://github.com/AdaLogics/go-fuzz-headers) to generate structured inputs (struct producer, SQL query generator)
- [gofuzz](https://github.com/google/gofuzz/) similarly to go-fuzz-header in some ways. It allows you to generate complex data structures based on a consumer.

But I still miss a way for default toolchain to generate complex data structures in a sane way.

## Conclusion

Overall, I'm happy that go included fuzz tooling into the toolchain itself. It's the only language that I know of that has this.
It's really powerful and the list of bugs found with fuzzing, even for a "memory safe" language is really impressive.
I'm looking forward to see the some of the improvements that are being actively addressed (as mentioned in the post) and I'd love to find some time to contribute to it as well. 
Contributing seems possible for most of the complains that I have, but I've yet to see how Go contribution model works, so I'm not sure!

### Take actions:
- Dig into libafl and see if it's possible to swap go's fuzzing engine with it.
- Read learn what's the contribution process and find some time to make the things above better.

If something is wrong or outdated, feel free to ping me on twitter, I'm available at [@edznux](https://twitter.com/Edznux)