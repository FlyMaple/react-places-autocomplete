# React - PlacesAutoComplete

create-react-app + React + google map api

Demo: http://flymaple.github.io/react-places-autocomplete

## Install

* npm install -g create-react-app
* create-react-app demo
* cd demo
* download src/components/PlacesAutoComplete/*.* into components/
* download public/*.* into pubilc/
* add `"homepage": "."` into package.json
* npm run eject
* edit ./config/webpack.config.dev.js、./config/webpack.config.prod.js
``` JS
preLoaders: [
    {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: paths.appSrc,
        query: {
            globals: [
                "google: true"
            ]
        }
    }
]
```

## Using
* public/index.html 加載 google map apis lib
``` HTML
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key={api_key}&libraries=places"></script>
```

* React Component
``` JS
import loading from '../../public/images/ripple.gif'
import PlacesAutoComplete from './PlacesAutoComplete'

constructor(props) {
    super(props)

    this.state = {
        loading: false,
        address: '',
        location: {},
        state: ''
    }
}

handleInputOnChange = (address) => {}

/**
 * PlacesAutoComplete 開始翻譯地址前觸發
 */
handleSuggestSelectedStart = () => {}

/**
 * PlacesAutoComplete 翻譯地址完成後觸發
 * success: 顯示座標、地圖
 * ZOER_RESULTS: 顯示 Not Found
 * @param { string } err
 * @param { object } loaction
 * @param { object } results
 */
handleSuggestSelectedEnd = (err, location, results){}

render() {
    return (
        <div id="app">
            <PlacesAutoComplete 
                className="test"
                placeholder="Typing Your Address"
                defaultValue=""
                autoFocus={ true }
                onInputChange={ this.handleInputOnChange }
                onSelectedStart={ this.handleSuggestSelectedStart }
                onSelectedEnd={ this.handleSuggestSelectedEnd } />
        </div>
    );
}
```

# Google Services
* Enabled Google Apis
  * https://developers.google.com/maps/documentation/javascript/get-api-key
  * https://developers.google.com/maps/documentation/javascript/distancematrix
* Getter Api Key
  * https://console.developers.google.com/apis/credentials

## Refs
* https://github.com/kenny-hibino/react-places-autocomplete
  * https://kenny-hibino.github.io/react-places-autocomplete/
* Meterial.io
  * https://material.io/icons/
  * http://google.github.io/material-design-icons/
  ``` HTML
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    
    
    <i class="material-icons">explore</i>
  ```
