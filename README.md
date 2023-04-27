This repository shows the use of the Origami framework and the ori tool for transforming a graph of images.

# Problem statement

The `src/images` folder contains a set of images. The goal is create a corresponding set of thumbnail images at a smaller size.

# Using the ori command line tool to generate thumbnails

In the `src` folder, you can use ori to create a single thumbnail:

```console
$ ori thumbnail images/image1.jpg > thumb1.jpg
```

To apply the `thumbnail` function to all images in the `images` folder and save the thumbnails in a new `thumbs` folder:

```console
$ ori "@copy @map/values(images, thumbnail), @files/thumbs"
```

To view the thumbnails in the browser:

```console
$ ori "@serve @debug @map/values(images, thumbnail)"
```

# Using the Origami framework to generate thumbnails

You can write Origami formulas to generate a virtual `thumbnails` folder that will lazily create the set of thumbnails on demand.

First, start the ori server:

```console
$ ori @serve
```

In the browser, the `index.html` page will show the complete gallery of thumbnails. Or browse to the virtual `/thumbnails` folder to inspect the thumbnails as virtual files.

# Using the Origami framework and ori CLI together

To copy the virtual `thumbnails` folder to a real filesystem folder, from the `src` folder:

```console
$ ori @copy src/site.graph/thumbnails, @files/thumbs
```

# Some tips for debugging in VS Code

A simple way to trigger breakpoints in JavaScript code invoked by ori: invoke ori through the VS Code JavaScript Debug Terminal.

You can also create a VS Code launch configuration. For example, to use breakpoints with the Origami server, create a VS Code launch configuration:

```json
{
  "type": "node",
  "request": "launch",
  "name": "serve",
  "skipFiles": ["<node_internals>/**"],
  "program": "${workspaceFolder}/node_modules/@explorablegraph/explorable/src/cli/cli.js",
  "args": ["serve"]
}
```

When you run the project this way, you can set breakpoints in your code and trigger those breakpoints with browsing activity. E.g., if you set a breakpoint in `thumbnail.js`, then view `index.html`, you'll hit that breakpoint once for each image.
