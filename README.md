# redux-persist-storage-node

`redux-persist` storage for Node.js/Electron.

## Example

```js
// [...]

import {resolve} from "path";
import NodeStorage from "redux-persist-storage-node";

// [...]

persistStore(store, {
    keyPrefix: "",
    storage: new NodeStorage(resolve("./store.json"))
});
```

## API

Exports a default class.

### new NodeStorage(fileName: string)

- fileName: An absolute path to the file to write the storage to.
