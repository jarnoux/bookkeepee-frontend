tojson-errorhandler
===================
A middleware that renders and outputs errors in JSON on `res`

Configuration
-------------
```yaml
{
  "statuses": {
    "<FooError>": 409,
    "<BarError>": 404,
    "<BazError>": 500,
    ...
  }
}
```

Dependencies
------------
* middleware.jsonrenderer
