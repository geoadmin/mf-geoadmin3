JSON Geadmin Vector Styling Specs
=================================

3 main categories are currently available via json style sheet in geoadmin.
This property is defined at top as follow:

```json
{
  "type": "single|unique|range",
  // ...
}
```

Type single
-----------

The type `single` is used when all the features should have the same style.

A JSON stylesheet of `single` type is structured as follow:

```json
{
  "type": "single",
  "geomType": "point|line|polygon",
  "vectorOptions": {
    // ...
  }
}
```

Just after defining the type of style sheet, one must define the geometry type to expect.

* point: A Point or MultiPoint layer
* line: A Line or MultiLine layer
* polygon: A Polygon or MultiPolygon layer

The `vectorOptions` property defines the style to apply and is structured as follow:

```json
{
  "type": "single",
  "geomType": "point",
  "vectorOptions": {
    "type": "circle|icon|square|triangle|star|cross",
    "radius": 10,
    "stroke": {
      // The stroke style
    },
    "fill": {
      // The fill style
    },
    "label": {
      "property": "aPropertyName",
      "text": {
        // The text style
      }
    }
  }
}
```

For `point` geomType one has couple of options to choose from.

* circle: creates an instance of [ol.style.Circle](http://openlayers.org/en/latest/apidoc/ol.style.Circle.html).
* icon: creates an instance of [ol.style.Icon](http://openlayers.org/en/latest/apidoc/ol.style.Icon.html).
* square|triangle|star|cross: creates an instance of [ol.style.RegularShape](http://openlayers.org/en/latest/apidoc/ol.style.RegularShape.html).

For `point` geomType the radius (given in pixels) determines the size of the symbol.

* stroke: same options as defined in [ol.style.Stroke](http://openlayers.org/en/latest/apidoc/ol.style.Stroke.html).
* fill: same options as defined in [ol.style.Fill](http://openlayers.org/en/latest/apidoc/ol.style.Fill.html).
* label->text: same options as defined in [ol.style.Text](http://openlayers.org/en/latest/apidoc/ol.style.Text.html)

Type unique
-----------

The type `unique` is used when style is based on a unique property value.

A JSON stylesheet of `single` type is structured as follow:

```json
{
  "type": "unique",
  "property": "optionalPropertyName",
  "values": [
    {
      "geomType": "point|line|polygon",
      "value": "optionalPropertyValue",
      "minResolution": "optionalMinResolution",
      "maxResolution": "optionalMaxResolution",
      "vectorOptions": {
        // As defined for single type
      }
    },
    {
      // ...
    }
  ]
}
```

A `unique` JSON style can be based on a property available on all features, a resolution range or a combination of both.
If `property` is defined, an array of possible `values` determine all the possible combinations for a given layer.
Notice the use of `value` which determine for which value of the features the style should be apply.
Optionally, one can define a `minResolution` and `maxResolution` at which the style should be applied. `[minResolution, maxResolution[`


**Example**:

```json
{
  "type": "unique",
  "property": "foo",
  "values": [
    {
      "geomType": "line",
      "value": "bar",
      "minResolution": 10,
      "maxResolution": 1000,
      "vectorOptions": {
        "stroke": {
          "color": "#FFFFFF",
          "width": 3
        },
        "label": {
          "property": "oraison",
          "text": {
            "textAlign": "center",
            "textBaseline": "middle",
            "font": "bold 10px Helvetica",
            "scale": 1.1,
            "offsetX": 1,
            "offsetY": 2,
            "stroke": {
              "color": "rgba(22, 22, 22, 0.4)",
              "width": 4
            },
            "fill": {
              "color": "rgba(52, 52, 52, 0.3)",
            }
          }
        }
      }
    }, {
      "geomType": "point",
      "value": "toto",
      "vectorOptions": {
        "type": "circle",
        "radius": 2,
        "fill": {
          "color": "#FF2222"
        },
        "stroke": {
          "color": "#F55555",
          "width": 3
        }
      }
    }
  ]
}
```

Type range
----------

The type `range` is used when a style is based on numerical values belonging to a given range.

A JSON stylesheet of `range` type is structured as follow:

```json
{
  "type": "range",
  "property": "aPropertyName",
  "ranges": [
    {
      "geomType": "point|line|polygon",
      "range": [0, 100],
      "minResolution": "optionalMinResolution",
      "maxResolution": "optionalMaxResolution",
      "vectorOptions": {
        // As defined for single type
      }
    },
    {
      // ...
    }
  ]
}
```

Once a `property` is defined, an array of possible `ranges` determine all the possible combinations for a given layer. `[minVal, maxVal[`
`minResolution`, `maxResolution` and `vectorOptions` work as defined earlier.
