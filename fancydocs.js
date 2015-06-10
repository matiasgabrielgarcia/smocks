registerProject({"title":"smocks","summary":"Stateful HTTP mocking service built on top of [HAPI](http://hapijs.com/).  Easily add routes and different scenarios for each route including the ability to maintain state with an admin interface to control everything.\n\nWith smocks you can\n\n* create route definitions (with dynamic tokens)\n* define multiple route handlers (variants) for for any route (selectable through an admin console)\n* add input configuration components for routes and variants (accessable through an admin console)\n* use a chaninable interface to streamline route definitions\n* use route request handlers that can keep a state for true dynamic mocking capabilities\n* define global request handlers which can be selected for any route\n* use plugins which can intercept all requests to perform actions\n\nThe ```onRequest``` methods are just [HAPI route handlers](http://hapijs.com/api#route-handler) so they are very easy to use.","api":{"API":{"methods":{},"packages":{"global":{"overview":"","methods":{"route":{"profiles":["path"],"params":{"path":"the route path (must start with ```/```).  Ex: ```/api/customer/{id}```"},"summary":"Register a route handler to enable setting the method, adding variants or config properties.","dependsOn":[],"overview":"To see how variables can be used in the path, refer to the [HAPI routing guide](http://hapijs.com/tutorials/routing).\n\nReturn the associated [Route object](#project/jhudson8/smocks/snippet/package/Route)."},"plugin":{"profiles":["plugin"],"params":{"plugin":"the plugin object"},"summary":"Register the plugin.  See the plugin object type for details.  Return the [global object](#link/%23project%2Fjhudson8%2Fsmocks%2Fsnippet%2Fpackage%2Fglobal).","dependsOn":[],"overview":""},"start":{"profiles":["options"],"params":{"options":"either object {host, port} or a HAPI server instance"},"summary":"Start a HAPI server with the defined mock configuration.","dependsOn":[],"overview":"Both the host and port are optional and will default to ```localhost``` and ```8080```.\n\nIf a HAPI server instance is provided, the routes will be bound to the HAPI server provided but the ```start``` method will not be called."}}},"Route":{"overview":"","methods":{"route":{"profiles":["path"],"params":{},"summary":"Refer to [global:route](#link/%23project%2Fjhudson8%2Fsmocks%2Fsnippet%2Fmethod%2Fglobal%2Froute)","dependsOn":[],"overview":""},"method":{"profiles":["method"],"params":{"method":"the HTTP method (GET|POST|PUT|PATCH|DELETE)"},"summary":"Set the HTTP method for the current route and return the route object.","dependsOn":[],"overview":""},"config":{"profiles":["attributes"],"params":{"attributes":"The configuration attributes"},"summary":"Set any configuration attributes that will be available for modification on the admin panel.","dependsOn":[],"overview":"See [config example](#project/jhudson8/smocks/section/Examples/Route%20%2F%20variant%20configuration) for details."},"variant":{"profiles":["id"],"params":{"id":"the variant id"},"summary":"Set up a new route variant with the provided id.  The id is meaningful when selecting the active variant from the admin panel.","dependsOn":[],"overview":"A variant is basically a single request handler for a defined route.  This is useful to test out different scenarios for a single route definition.\n\nReturn the [Variant object](#project/jhudson8/smocks/snippet/package/Variant)."},"plugin":{"profiles":["plugin"],"params":{},"summary":"Refer to [global:plugin](#link/%23project%2Fjhudson8%2Fsmocks%2Fsnippet%2Fmethod%2Fglobal%2Fplugin)","dependsOn":[],"overview":""},"onRequest":{"profiles":["requestHandler"],"params":{"requestHandler":"The [RequestHandler](#project/jhudson8/smocks/section/Object%20Types/RequestHandler)"},"summary":"Convienance method for creating a default variant (id of \"default\") and then calling [Variant:onRequest](#link/%23project%2Fjhudson8%2Fsmocks%2Fsnippet%2Fmethod%2FVariant%2FonRequest) on the variant.","dependsOn":[],"overview":""}}},"Variant":{"overview":"","methods":{"route":{"profiles":["path"],"params":{},"summary":"Refer to [global:route](#link/%23project%2Fjhudson8%2Fsmocks%2Fsnippet%2Fmethod%2Fglobal%2Froute)","dependsOn":[],"overview":""},"method":{"profiles":["method"],"params":{},"summary":"Refer to [Route:method](#link/%23project%2Fjhudson8%2Fsmocks%2Fsnippet%2Fmethod%2FRoute%2Fmethod)","dependsOn":[],"overview":""},"config":{"profiles":["attributes"],"params":{"attributes":"The configuration attributes"},"summary":"Set any variant-scoped configuration attributes that will be available for modification on the admin panel.","dependsOn":[],"overview":"See [config example](#project/jhudson8/smocks/section/Examples/Route%20%2F%20variant%20configuration) for details."},"variant":{"profiles":["id"],"params":{},"summary":"Refer to [Route:variant](#link/l%23project%2Fjhudson8%2Fsmocks%2Fsnippet%2Fmethod%2FRoute%2Fvariant)","dependsOn":[],"overview":""},"plugin":{"profiles":["plugin"],"params":{},"summary":"Refer to [global:plugin](#link/%23project%2Fjhudson8%2Fsmocks%2Fsnippet%2Fmethod%2Fglobal%2Fplugin)","dependsOn":[],"overview":""},"onRequest":{"profiles":["requestHandler"],"params":{"requestHandler":"The [RequestHandler](#project/jhudson8/smocks/section/Object%20Types/RequestHandler)"},"summary":"Associate a request handler with the current route/method/variant combination.","dependsOn":[],"overview":""}}}}}},"sections":[{"body":"If a route has multiple variants, the admin panel can be used to select which variant should handle the requests.  Also, the admin panel exposes any configuration input fields defined at the route or variant level.\n\nTo view the admin panel, visit [http://localhost:{port number}/_admin](#link/http%3A%2F%2Flocalhost%3A8080%2F_admin)\n\n***Note, to see route specific config options, click the route entry with your mouse.***","title":"Admin Panel","sections":[]},{"body":"","title":"Object Types","sections":[{"body":"A plugin is a plain javascript object with the following attributes\n\n* ***onRequest***: function(request, reply, next): Standard HAPI request handler with an additional callback method to continue processing the next plugins.\n\nA small example plugin to add latency to all requests would be\n```javascript\n    ...\n    .plugin({\n      onRequest: function(request, reply, next) {\n        // wait 1 sec before continuing\n        setTimeout(next, 1000);\n      }\n    })\n```","title":"Plugin","sections":[]},{"body":"The ```onRequest``` method for variants and global plugins has access to the ```request``` and ```reply``` objects as parameters just like any [HAPI route handler](http://hapijs.com/api#route-handler).\n\nAdditionally, state, config and options values can be accessed.\n\n* ***this.state***: ```function(key, value)``` if ```value``` is undefined, return the state value of ```key```.  Otherwise set the state value of ```key``` to ```value```.\n* ***this.config***: ```function(key)``` return the config value matching the provided key\n ***this.option***: ```function(key)``` return the option value matching the provided key\n\n```javascript\n    ...\n    onRequest(function(request, reply) {\n      var oldStateValue = this.state('foo');\n      // update the state for \"foo\" to be \"bar\"\n      this.state('foo', 'bar');\n      var fooConfig = this.config('foo');\n      var fooOption = this.option('foo');\n      ...\n    })\n```","title":"RequestHandler","sections":[]}]},{"body":"","title":"Examples","sections":[{"body":"Each defined route can have multiple response handlers defined.  Only 1 can be active at any time but the active handler can be changed in the admin console to test out different scenarios.\n\n```javascript\n    var smocks = require('smocks');\n\n    smocks.route('/api/foo')\n        .method('POST')\n            .variant('default')\n                .onRequest(function(request, reply) {\n                    ...\n                })\n            .variant('something_else')\n                .onRequest(function(request, reply) {\n                    ...\n                })\n\n    .start();\n```\n\nNow, in the admin panel, you will be able to choose between the ```default``` and ```something_else``` response handlers when a POST to ```/api/foo``` is executed.\n\n(make sure to click on the route path in the admin panel to see config options)","title":"Configurable route responses","sections":[]},{"body":"It is easy to define handlers for multiple methods associated with a single route using the chaining API.  Simply call the ```method``` method any time to define a new route handler with the defined method.\n\n```javascript\n    var smocks = require('smocks');\n\n    smocks.route('/api/foo')\n        .method('GET')\n            .onRequest(function(request, reply) {\n                ...\n            })\n\n        .method('POST')\n            .onRequest(function(request, reply) {\n                ...\n            })\n\n    .start();\n```","title":"Multiple route methods","sections":[]},{"body":"The chaining API makes it easy to define a route but it is important to understand the different concepts.\n\n* ***route***: the URL path\n* ***method***: GET|POST|PUT|PATCH|DELETE\n* ***variant***: for a specific route/method combination there can be multiple variants (or request handlers) which can be selected within the admin console.  This allows you to test different scenarios that exist from calling a single endpoint.\n\nAs long as you understand that, the ```method```, ```variant``` and ```route``` methods can be called wherever it makes sense to do so.\n\n```javascript\n    var smocks = require('smocks');\n\n    smocks.route('/api/foo')\n        // the method is not necessary - GET is the default\n        .variant('default').onRequest(function(request, reply) {\n          // this is the \"default\" variant for \"/api/foo\" (GET)\n          ...\n        })\n        .variant('scenario1').onRequest(function(request, reply) {\n          // this is the \"scenario1\" variant for \"/api/foo\" (GET)\n          ...\n        })\n        .variant('scenario2').onRequest(function(request, reply) {\n          // this is the \"scenario2\" variant for \"/api/foo\" (GET)\n          ...\n        })\n\n      .method('POST')\n        //  the variant is not necessary - \"default\" is the default variant id\n        .onRequest(function(request, reply) {\n          // this is the \"default\" variant for \"/api/foo\" (POST)\n          ...\n        })\n        .variant('scenario1').onRequest(function(request, reply) {\n          // this is the \"scenario1\" variant for \"/api/foo\" (POST)\n          ...\n        })\n\n    .start();\n```","title":"Routes, methods and variants ","sections":[]},{"body":"Different types of input fields can be defined for routes or variants including ```boolean```, ```text```, ```select```, ```multiselect```.  Through the admin panel, you can modify these config values.\n\n```javascript\n    smock.route('/api/foo')\n      .config({\n        aBooleanField: {\n          label: 'Is this a checkbox?',\n          type: 'boolean',\n          defaultValue: true\n        },\n        someTextField: {\n          label: 'A text field',\n          type: 'text',\n          defaultValue: 'Hello'\n        },\n        someSelectBox: {\n          label: 'A select box',\n          type: 'select',\n          options: [{label: 'One', value: 1}, {label: 'Two', value: 2}, {label: 'Three', value: 3}],\n          defaultValue: 2\n        },\n        someMultiSelect: {\n          label: 'A check list',\n          type: 'multiselect',\n          options: [{label: 'One', value: 1}, {label: 'Two', value: 2}, {label: 'Three', value: 3}],\n          defaultValue: [2, 3]\n        },\n      })\n\n      // these variants are here to show how the config values can be retrieved\n      .variant('default').onRequest(function(request, reply) {\n        var aBooleanField = this.config('aBooleanField'); // boolean\n        var someTextField = this.config('someTextField'); // string\n        var someSelectBox = this.config('someSelectBox'); // integer (because the values are integers)\n        var someMultiSelect = this.config('someMultiSelect'); // array of integer (because the values are integers)\n        // ...\n      })\n      .variant('scenario1').onRequest(function(request, reply) {\n        // ...\n        \n      })\n      .variant('scenario2').onRequest(function(request, reply) {\n        // ...\n      })\n```\n\nThen, within the route handler, the config values can be accessed by using ```this.config```.\n\nThe same ```config``` method can be applied at the variant level as well.\n\nThe previous config example would look like this in the admin panel\n![admin panel](http://jhudson8.github.io/smocks/images/config-types.png)","title":"Route / variant configuration","sections":[]},{"body":"This is similar to Route / variant config except that these values are not exposed within the admin console.  They are accessable within the route handlers though.\n\nThis is mostly useful for global-level plugins.\n\n```javascript\n    var smocks = require('smocks');\n\n    smocks.route('/api/foo')\n      .options({\n        theVarKey: 'the variable value'\n      })\n    .onRequest(function(request, reply) {\n      var value = this.options('theVarKey');\n      // do something with the value\n    })\n```\n\nThen, within the route handler, the options values can be accessed by using ```this.options```.","title":"Route / variant options","sections":[]},{"body":"\"Plugins\" can be provided which have the ability to intercept all income requests.  They are very similar to a variant route handler except there is a third ```next``` callback parameter which will trigger the rest of the plugins to execute.\n\nIf the plugin chooses to override the response, the ```next``` parameter should not be called.\n\nFor example, a plugin to add simulated latency to all endpoint methods\n\n```javascript\n    var smocks = require('smocks');\n\n    smocks.route('/api/foo')\n      ...\n\n    .plugin({\n      onRequest: function(request, reply, next) {\n        // wait 1 sec before allowing the response to be handled\n        setTimeout(next, 1000);\n      }\n    })\n```","title":"Global route interceptors / plugins","sections":[]}]}]});
