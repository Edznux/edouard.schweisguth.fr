# Lyfe


## This is a customized version of the terminal theme by panr

I've customized the theme to meet my needs and personalization. But most of the work is coming from the panr's theme Terminal.
----

![Terminal](https://github.com/panr/hugo-theme-terminal/blob/master/images/screenshot.png?raw=true)

### ⚠️ The theme needs at least Hugo **Extended** v0.90.x.

---

- [Lyfe](#lyfe)
  - [This is a customized version of the terminal theme by panr](#this-is-a-customized-version-of-the-terminal-theme-by-panr)
  - [I've customized the theme to meet my needs and personalization. But most of the work is coming from the panr's theme Terminal.](#ive-customized-the-theme-to-meet-my-needs-and-personalization-but-most-of-the-work-is-coming-from-the-panrs-theme-terminal)
    - [⚠️ The theme needs at least Hugo **Extended** v0.90.x.](#️-the-theme-needs-at-least-hugo-extended-v090x)
  - [Features](#features)
      - [Built-in shortcodes](#built-in-shortcodes)
      - [Code highlighting](#code-highlighting)
    - [Install theme locally](#install-theme-locally)
    - [Install theme as a submodule](#install-theme-as-a-submodule)
  - [How to run your site](#how-to-run-your-site)
  - [How to configure](#how-to-configure)
  - [Post archetype](#post-archetype)
  - [License](#license)

## Features

- **5 duotone themes**, depending on your preferences (orange is default, red, blue, green, pink)
- [**Fira Code**](https://github.com/tonsky/FiraCode) as default monospaced font. It's gorgeous!
- **really nice duotone**, custom syntax highlighting based on [**PrismJS**](https://prismjs.com)
- fully responsive
- fully based on Hugo ecosystem (Pipes and Modules)

#### Built-in shortcodes

- **`image`** (props required: **`src`**; props optional: **`alt`**, **`position`** (**left** is default | center | right), **`style`**)
  - e.g.
  ```go
  {{< image src="/img/hello.png" alt="Hello Friend" position="center" style="border-radius: 8px;" >}}
  ```
- **`figure`** (same as `image`, plus few optional props: **`caption`**, **`captionPosition`** (left | **center** is default | right), **`captionStyle`**)
  - e.g.
  ```go
  {{< figure src="/img/hello.png" alt="Hello Friend" position="center" style="border-radius: 8px;" caption="Hello Friend!" captionPosition="right" captionStyle="color: red;" >}}
  ```
- **`code`** (props required: **`language`**; props optional: **`title`**, **`id`**, **`expand`** (default "△"), **`collapse`** (default "▽"), **`isCollapsed`**)
  - e.g.
  ```go
  {{< code language="css" title="Really cool snippet" id="1" expand="Show" collapse="Hide" isCollapsed="true" >}}
  pre {
    background: #1a1a1d;
    padding: 20px;
    border-radius: 8px;
    font-size: 1rem;
    overflow: auto;

    @media (--phone) {
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    code {
      background: none !important;
      color: #ccc;
      padding: 0;
      font-size: inherit;
    }
  }
  {{< /code >}}
  ```

#### Code highlighting

A custom syntax highlighting based on PrismJS. All you need to do is to wrap you code like this:

````
```html
  // your code here
```
````

**Supported languages**: actionscript, apacheconf, applescript, bash, c, clike, cmake, coffeescript, cpp, csharp, csp, css, css-extras, diff, django, docker, elixir, elm, erlang, flow, fsharp, git, go, graphql, haml, handlebars, haskell, http, java, javascript, json, jsx, kotlin, latex, less, llvm, makefile, markdown, markup, markup-templating, nasm, objectivec, ocaml, perl, php, php-extras, powershell, processing, pug, python, r, reason, ruby, rust, sass, scala, scheme, scss, sql, stylus, swift, textile, toml, tsx, twig, typescript, vim, visual-basic, wasm, yaml.

### Install theme locally

```bash
git clone https://github.com/panr/hugo-theme-terminal.git themes/terminal
```

This will clone the repository directly to the `themes/terminal` directory.

### Install theme as a submodule

```bash
git submodule add -f https://github.com/panr/hugo-theme-terminal.git themes/terminal
```

This will install the repository as a sumbodule in the `themes/terminal` directory.

⚠️ If you encounter any issues with:

```bash
Error: module "terminal" not found; either add it as a Hugo Module or store it in "[...your custom path]/themes".: module does not exist
```

then please try to remove `theme = "terminal"` from your config file.

## How to run your site

```bash
hugo server -t terminal
```

and go to `localhost:1313` in your browser. From now on all the changes you make will go live, so you don't need to refresh your browser every single time.

## How to configure

The theme doesn't require any advanced configuration. Just copy:

```toml
baseurl = "/"
languageCode = "en-us"
# Add it only if you keep the theme in the `themes` directory.
# Remove it if you use the theme as a remote Hugo Module.
theme = "terminal"
paginate = 5

[params]
  # dir name of your main content (default is `content/posts`).
  # the list of set content will show up on your index page (baseurl).
  contentTypeName = "posts"

  # ["orange", "blue", "red", "green", "pink"]
  themeColor = "orange"

  # if you set this to 0, only submenu trigger will be visible
  showMenuItems = 2

  # show selector to switch language
  showLanguageSelector = false

  # set theme to full screen width
  fullWidthTheme = false

  # center theme with default width
  centerTheme = false

  # if your resource directory contains an image called `cover.(jpg|png|webp)`,
  # then the file will be used as a cover automatically.
  # With this option you don't have to put the `cover` param in a front-matter.
  autoCover = true

  # set post to show the last updated
  # If you use git, you can set `enableGitInfo` to `true` and then post will automatically get the last updated
  showLastUpdated = false

  # set a custom favicon (default is a `themeColor` square)
  # favicon = "favicon.ico"

  # Provide a string as a prefix for the last update date. By default, it looks like this: 2020-xx-xx [Updated: 2020-xx-xx] :: Author
  # updatedDatePrefix = "Updated"

  # set all headings to their default size (depending on browser settings)
  # oneHeadingSize = true # default

  # whether to show a page's estimated reading time
  # readingTime = false # default

  # whether to show a table of contents
  # can be overridden in a page's front-matter
  # Toc = false # default

  # set title for the table of contents
  # can be overridden in a page's front-matter
  # TocTitle = "Table of Contents" # default


[params.twitter]
  # set Twitter handles for Twitter cards
  # see https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started#card-and-content-attribution
  # do not include @
  creator = ""
  site = ""

[languages]
  [languages.en]
    languageName = "English"
    title = "Terminal"
    subtitle = "A simple, retro theme for Hugo"
    owner = ""
    keywords = ""
    copyright = ""
    menuMore = "Show more"
    readMore = "Read more"
    readOtherPosts = "Read other posts"
    newerPosts = "Newer posts"
    olderPosts = "Older posts"
    missingContentMessage = "Page not found..."
    missingBackButtonLabel = "Back to home page"
    minuteReadingTime = "min read"
    words = "words"

    [languages.en.params.logo]
      logoText = "Terminal"
      logoHomeLink = "/"

    [languages.en.menu]
      [[languages.en.menu.main]]
        identifier = "about"
        name = "About"
        url = "/about"
      [[languages.en.menu.main]]
        identifier = "showcase"
        name = "Showcase"
        url = "/showcase"

[module]
  # In case you would like to make changes to the theme and keep it locally in you repository,
  # uncomment the line below (and correct the local path if necessary).
  # --
  # replacements = "github.com/panr/hugo-theme-terminal -> themes/terminal"
[[module.imports]]
  path = 'github.com/panr/hugo-theme-terminal'
```

to `config.toml` file in your Hugo root directory and change params fields. In case you need, here's [a YAML version](https://gist.github.com/panr/9eeea6f595c257febdadc11763e3a6d1).

**NOTE:** Please keep in mind that currently `main menu` doesn't support nesting.

## Post archetype

See the default `post` file params supported by the theme — https://github.com/panr/hugo-theme-terminal/blob/master/archetypes/posts.md

## License

Copyright © 2019-2022 Radosław Kozieł ([@panr](https://twitter.com/panr))

The theme is released under the MIT License. Check the [original theme license](https://github.com/panr/hugo-theme-terminal/blob/master/LICENSE.md) for additional licensing information.
