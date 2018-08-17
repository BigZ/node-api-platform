const glob = require('glob');
const get = require('lodash.get');

module.exports = (server, cwd, routePattern) => {
  glob(routePattern, { cwd }, (er, files) => {
    files.forEach(file => {
      const routes = require(`./${file}`);
      const mappedRoutes = routes.map(route => {
        const handledRoute = Object.assign({}, route);
        const handlerDefinition = get(route, 'options.handler');

        // If the route handler is a string, automatically instantiate the handler class
        // and call the specified method
        // actually a shortcut to write 'MyHandler:myMethod'
        // instead of (req, h) => (new MyHandler()).myMethod(req, h)
        if (handlerDefinition && typeof handlerDefinition === 'string') {
          try {
            const handlers = handlerDefinition.split(':');
            const handlerName = handlers[0];
            const methodName = handlers[1];
            const Handler = require(`./handler/${handlerName}`);
            const myHandler = new Handler();

            if (typeof myHandler[methodName] !== 'function') {
              throw new Error(`${methodName} is not a method of ${handlerName}`);
            }

            handledRoute.options.handler = (req, h) => myHandler[methodName](req, h);
          } catch (error) {
            console.log(
              `${'Handler definition must either be a method or ' +
              'a string referecing a class method such as MyHandler:myMethod' +
              '(where MyHandler is the default exports of the app/handler/MyHandler.js file.' +
              `\nRoute file: ${file}\n`}${error}`
            );
            process.exit(-1);
          }
        }

        return handledRoute;
      });

      server.route(mappedRoutes);
    });
  });
};