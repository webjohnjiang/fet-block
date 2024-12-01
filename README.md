# fet-block

Hook the request in a web page, and replace the url to another domain. When the request is xmlHttpRequest, it can transform the request to another domain or another request tunnel.


## usage

install the npm package in your project

```bash
npm install fetBlock
```

import it in your project entry file, as early as possible

```js
import { init } from 'fetBlock'
// start fetBlock
init()
```

You should use you own config url in prodution environment. So you should pass a config url to fetBlock:

```js
import { init } from 'fetBlock'
// start fetBlock
init({
    configUrl: 'https://yourdomain.com/config.json'
})
```

And now your project is ready to go!

## config

If you want to replace a url domain to another domain, you can config your domain to another domain

```js
// config.json
{
  "en": {
    "img.mydemo.com": "bak.img.mydemo.com",
    "api.mydemo.com": "bak.api.mydemo.com"
  }
}
```

And if you want to use a special tunnel to send a request( eg: jsbridge), you can config the `tunnel api name` in your project file like:

```js
{
  "zh": {
    "img.mydemo.com": "sendRequestByJsBridge",
    "api.mydemo.com": "sendRequestByJsBridge"
  }
}
```

Like this, when the page send a request with `img.mydemo.com` domain, it will be replace to use the jsbridge api `sendRequestByJsBridge` to send. It is simple!

All of it occur under the mocked XmlHttpRequest hood.

## develop

If you want to develop fetBlock, you can clone this repo and run `npm install` to install the dependencies. Then run `npm run dev` to start the dev server. 


Then you can install a proxy tool `whistle` and config it :

```bash
npm  install whistle -g
```

Config the whistle, first, create a rule like this:

```js
www.mydemo.com http://localhost:52000
www.mydemo.com resHeaders://{corsjson}

img.mydemo.com http://localhost:52000
img.mydemo.com resHeaders://{corsjson}

api.mydemo.com http://localhost:52000
api.mydemo.com resHeaders://{corsjson}

bak.img.mydemo.com http://localhost:52000
bak.img.mydemo.com resHeaders://{corsjson}

bak.api.mydemo.com http://localhost:52000
bak.api.mydemo.com resHeaders://{corsjson}
```

And create a value for the `corsjson` like this:

```js
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,OPTIONS,PUT
Access-Control-Allow-Headers: *
Access-Control-Max-Age: 1
```

Then, you should config your chrome `swichOmega` plugin to use the `whistle` proxy.

Finally, You can visit `https://www.mydemo.com` to see the demo page, and change the code in src folder, and it will audo build the dist.