# Euglena Modeling

## Getting Started

[Node](https://nodejs.org) and [npm](https://npmjs.org) are required for easy installation and development of this project.

Once both are installed, run the following from the project root to install all dependencies:

> $ npm install

We use the gulp build system. If this is not already installed, do so now:

> $ npm install --global gulp-cli

When that process is complete, compiling and server start can be accomplished with the following command:

> $ gulp

The project can then be found at localhost:3000. If a different port is desired, use the `--port` option:

> $ gulp dev_start --port=3001
>  [OR]
> $ gulp dev_start -p 3001 

If you just wish to run the server by itself, use the following command:

> $ gulp up