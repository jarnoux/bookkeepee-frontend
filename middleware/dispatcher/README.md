Dispatcher
==========
A middleware that implements coordination between models, views and controllers.

Configuration
-------------

```yaml
{
  "routes": {
    "/": {
      # dispatch plans listed in arrays will be flushed in order as soon as possible
      "get": ["<header>", "<body>", "<footer>"],
      "post": ...,
      # verbs acceptable by express (including 'all') are acceptable in this configuration
      "all": ...
    },
    "/<foo>": {
      "get": ["<header>", "<composedBody>", "<footer>"]
      # a plan can contain a subplan
      "post": ["<header>", ["<body1>", "<body2>"], "<footer>"]
    }
  },
  # plans that don't have the name of a controller are further decomposed here
  "plans": {
    # plans listed as objects will be composed with the given subplans
    "<composedBody>": {
      # each key of this object corresponds to a placeholder in the template which it will replace
      "<top>": "<bodyController.top">,
      "<bottom>": "<bodyController.bottom>"
    }
  }
}
```

Dependencies
------------
* middleware.registry
