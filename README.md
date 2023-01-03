# webcomponent_typed-pid-maker_pid-list

[![Build](https://github.com/kit-data-manager/webcomponent_typed-pid-maker_pid-list/actions/workflows/build.yml/badge.svg)](https://github.com/kit-data-manager/webcomponent_typed-pid-maker_pid-list/actions/workflows/build.yml) [![Node.js Package](https://github.com/kit-data-manager/webcomponent_typed-pid-maker_pid-list/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/kit-data-manager/webcomponent_typed-pid-maker_pid-list/actions/workflows/npm-publish.yml) [![](https://data.jsdelivr.com/v1/package/npm/@kit-data-manager/webcomponent_typed-pid-maker_pid-list/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@kit-data-manager/webcomponent_typed-pid-maker_pid-list)

This is a webcomponent to use in HTML or more complex web projects.

- [NPMjs project page](https://www.npmjs.com/package/@kit-data-manager/webcomponent_typed-pid-maker_pid-list)

## Integration

If the dependency is up set properly (instructions will follow), the component can be used like this:

```html
<head>
    ...
    <!-- add the code !-->
    <script src="https://cdn.jsdelivr.net/npm/@kit-data-manager/webcomponent_typed-pid-maker_pid-list@latest/dist/typid-known-pids-table.umd.js"></script>
</head>
<body>
    <!-- use the component !-->
    <typid-known-pids-table base-url="http://localhost:8090/">
</body>
```

## Attributes

- `base-url`: string, base-url to your Typed PID Maker instance
- `onrowclick`: string or function([UIEvent](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent), [RowComponent](https://tabulator.info/docs/5.4/components#component-row)) (optional)

    As described, above, it can either be a function, or a string with instructions. The latter option makes it similar to [onclick](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/onclick). The function gets the event and the row as a parameter, which means you can access the row data. Here are two examples:

    ```html
    <!-- as instruction string !-->
    <typid-known-pids-table
        base-url="http://localhost:8090/"
        onrowclick="console.log('catched event!')">
    ```

    ```html
    <!-- as a function, accessing row data !-->
    <typid-known-pids-table
        base-url="http://localhost:8090/"
        onrowclick="(function() { console.log('hello world') })()">
    ```

    In the second example, the function is still represented as a string. This means the function needs to call itself, which is why the `()` operator is needed in the end. From Javascript, you may directly assign a function like in the following example:

    ```javascript
    var component = document.getElementsByTagName("typid-known-pids-table")[0]
    component.onRowClick = function(event, row) {
        console.log(event)
        console.log(row.getData().pid)
    }
    ```

    Its default value is the following function, which will open a PID in a public instance of the FAIRDOscope:

    ```typescript
    (_event, row) => {
        window.open(
        'https://kit-data-manager.github.io/fairdoscope/?pid=' + row.getData().pid,
        '_blank'
        )
    }
    ```
