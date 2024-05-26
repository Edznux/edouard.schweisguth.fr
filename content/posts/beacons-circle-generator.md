---
title: "Perfect Beacons Circle generator"
subtitle: "A perspective pleasing circle generator"
date:  2024-05-26
---

A few weeks ago, Youtube's algorithm sent me to a video that picked my interest on how to properly do a circle of light ([video link](https://www.youtube.com/watch?v=VcsEm7FnheU)).
That seemed like a fun little weekend project to write an in-browser circle generator with a few parameters so you can generate one to your needs.

## Circles vs Angular difference on a grid 

The idea is fairly simple, beacons emit light rays, and our eyes and brains are much better at detecting variance in the spacing than in the intensity or depth between two source of light.

To make pleasing circle (from a centered point of view), one must ensure the spacing is more consistent.

So, a typical circle will look like this:
![image](/images/beacons-circle-basic.png)


While a "perfect" circle will look like
![image](/images/beacons-circle-perfect.png)


As you can see, the first screenshot shows quite large variation in the spacing of each beam.
While on the second image,it's much better, especially considering the size of the circle (7-8 radius), not perfect, but as far as I can tell, likely the best compromise there is!


## What does the generator looks like

Visit the page [beacons.edznux.fr](https://beacons.edznux.fr) to see for yourself
But here's a screenshot:
![image](/images/beacons.edznux.fr.png)

## How was it made

### Tools

I haven't done Javascript in a while, and that was rough: without type ... you don't have good autocompletion? I didn't want to spent any time fiddling with the Javascript build ecosystem, so I used a simple `tsc main.ts --watch` and was mostly happy with the result. It's not really using much of Typescript features and probably miss use some of them, but that was helpful to get auto complete working!

There's no engine behind it, it fits in a single file. No p5.js or Phaser or anything else! I had to impement collision detection and along the way of searching how to do that again, I've discovered the incredible website [Collision Detection](https://crhallberg.com/CollisionDetection/Website/index.html) by Jeff Thompson with algorithm and live examples, all with clear and in depth explanations!


### Casting rays

I was likely biaised by the video's author original idea, and thus made the computation based on casting rays.
It's very likely possible to compute that by using some clever math, but I sticked with the simple "Cast a ray, check which blocks cross that rays, of which check which block center is the closest to the Ray".

I've left a lots of toggles on the website to show the different steps: casting rays, colliding blocks, min and max range circles...

Each draw was taking about 3ms, on my computer, to run on maxed out radius, so I deemed it performant enough!
As it was in JS, there's isn't any concurrency done (e.g: for each rays).

### Conclusion

That was a fun little weekend project, I'm sure there are improvements to be made and I've even listed some of them on the github repository: [beacon-circle-calculator](https://github.com/Edznux/beacon-circle-calculator).
Once I finished, I shared it on the discord of the video's author, and discovered a few other projects that aimed to do similar things (but none of them in the browser I think? Folks did that in a terminal, in Math software, in game with a mod...). They aren't really comparable as well since we have very different features and interface.

For once, I think I'll consider this as done and be glad to have finished one side project! It's a nice feeling, will probably do that more often. :)

*Bonus point:* tweaking some parameters made some pleasing visualization (especially with the real time changes) like this one:
![image](/images/beacons-art.png)
_(for some reason the grid appears on the exported canvas image but not on the website canvas, not sure why!)_