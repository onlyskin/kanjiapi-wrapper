# kanjiapi-wrapper

A wrapper library for [kanjiapi.dev](https://kanjiapi.dev). Provides
(currently) in-memory only request caching, and wraps the api with a
synchronous listener based model.

## Installation
`yarn add kanjiapi-wrapper` / `npm install kanjiapi-wrapper`

## Example usage

### Generic usage:
```javascript
const { Kanjiapi } = require('kanjiapi-wrapper')

const listener = () => {
    // Ask kanjiapi instance for data again and trigger UI redraws
}

const kanjiapi = Kanjiapi.build()
kanjiapi.addListener('listener_name', listener)

const result = kanjiapi.getKanji('字')
// { status: "LOADING", value: null }

// once the data is loaded, any registered listener functions will be called
// to notify the library client that there was a change
// after this point calling kanjiapi.getKanji('字') returns the success result:
// { status: "SUCCESS", value: { kanji: "字", ... } }
```

### mithril.js example:
[flems.io]()
```javascript
const Kanji = {
    view: ({ attrs: { kanji } }) =>
        kanji.status === Kanjiapi.SUCCESS ?
            m('ul', kanji.value.meanings.map(meaning => m('li', meaning))) :
            kanji.status === Kanjiapi.LOADING ?
            'Loading' :
            'Error',
}

const Page = {
    oninit: ({ state }) => state.character = '字',
    view: ({ state, attrs: { kanjiapi } }) => [
        m(
            'input[type=text]',
            {
               oninput: e => state.character = e.target.value,
               value: state.character,
            },
        ),
        m(Kanji, { kanji: kanjiapi.getKanji(state.character) }),
    ],
}

const kanjiapi = Kanjiapi.build();
kanjiapi.addListener('app', m.redraw)

m.mount(document.body, { view: () => m(Page, { kanjiapi }) })
```

### react.js example:
[flems.io](https://flems.io/#0=N4IgtglgJlA2CmIBcA2ATAOhSgNCAxgPYB2AzoQsgRbAIYAOp8UIeAZhAqcgNqjG0wiJCAwALAC5hYrasQnx5VADxQIANwAE0ALwAdEA3oGAfMoD0a9SdlME+CRBLcRABiQBGACwgAvjn5BYVEAK248InlFCSpI0glNAGlaYhCITR1NAApgTXwxWgAnWgd4QpxNAGsUtIZ03wBKDJNNYD1iTU685wTC+FIAV1gEzOrUiDqMAHN4CWTxrPyikoVChvau7rIKeAxYQimsgHIAQXp0gHdi+noyzT6JAcLiZiQjir7B4fXiDa6Hp4dT5DCQYeK0R6kDI6TLzWrnDAAZQAqgBhVEAUURiM0AH4-ptOsohiYCYTOsBgcMMOpaLABrshCkIMQpqQMGAGFkmcQWVNmmTyUTYOlKvAAJ46YA8vm+EzS+DM1m+CwikwNXyCroWEmaJBazpU0HgyHQ2E1CYIgAyAHkTgARACSADkAOJ4g2aVQaExWwi0NSsixWFr6jpC73WDGFQqEQrBn3tTW-YhxBIABVoMwy2VyY3h9SaOhabXDac0PEcQnBYHoFSYEgAKhBqxJBPQALo5gBKiocGAGTERbYUWXtEN2xEIFyyDR+nXzlogGADUCtEHiijKx3oWfgw4n72yRZaDebrfbY4nGCnM7nPz+5Z4S2KpXKmgbqIKr9WXcyvZWAchxHeBjkAdW0jgfcMAWeL1SXDTZlBZegBgSCRxVufQQAUAAPCQDE0Wl6XgKUXxWMpfE0EgvxSGYpSyeATw-WYaJ-bddjbQoZlBIiGQ1cx4PJZQ4XSMi31I79yMKSjFzqKVZPOXwBLJCxBM0ZN2gkMQNwwBT0nNcZJgAIwGTgoFndoAIce0bQAWQwPpiCgbdlEzbM9Pki06iUkwKigQh8AGIR5GmWYMQQYKJAAIXFR1zKOIxIIaWQiFrTgyioIzaCM+AZDwOx4AcJwyCodxXAAWjQAB2JAqpQPwAhAAQhCoDB8FIcI5AUJQRD8Ds8BFYhKhcPgmqCKg+kA5z1Fywh6EijAwlkJ4ZBESQJEYJBzHMAZiHoSopjawgwHMSaHAAAQ8FAMAADiwHawCgU6+1BabZvm6JFs69DbioUh8EKCB6BifxAhakQzokcr-LADA3v2D6QqWvAVqodbNu23b9sO1LnpWaHjsulAHqeyGCdh+G5oW5HsIw4J-sB4GGrB4I9PKq4jAylHClWkB0dILadr2g6jpOtmOZuLnad+kQGaBkGO18IA)
```javascript
const Kanji = ({ kanji }) =>
    kanji.status === Kanjiapi.SUCCESS ?
        <ul>
            {kanji.value.meanings.map(meaning =>
                <li key={meaning}>{meaning}</li>)}
        </ul> :
        kanji.status === Kanjiapi.LOADING ?
        <div>Loading</div> :
        <div>Error</div>

const App = ({ kanjiapi }) => {
    const [timestamp, setTimestamp] = React.useState(Date.now())
    kanjiapi.addListener('appState', () => setTimestamp(Date.now()))

    const [character, setCharacter] = React.useState('字')

    return <>
        <input
            type="text"
            value={character}
            onChange={e => setCharacter(e.target.value)}/>
        <Kanji kanji={kanjiapi.getKanji(character)}/>
    </>
}

this.kanjiapi = Kanjiapi.build()
ReactDOM.render(<App kanjiapi={kanjiapi}/>, document.getElementById('app'))
```

## Result form:
All results have a status either of "LOADING", "SUCCESS", or "ERROR", and a value
of the parsed API response.
```
{
    status: "LOADING" | "SUCCESS" | "ERROR",
    value: $RESPONSE,
}
```

## Methods
`getUrl(url)`
Returns a result for an arbitrary api url after appending the version prefix
e.g. `kanjiapi.getUrl('/kanji/蜜')`

`getKanji(kanji)`
Returns a kanji character result

`getReading(reading)`
Returns a reading result

`getJoyoSet()`
Returns the set of Jōyō kanji result

`getJinmeiyoSet()`
Returns the set of Jinmeiyō kanji result

`getListForGrade(grade)`
Returns the list of Jinmeiyō kanji result for the given grade

`getWordsForKanji(kanji)`
Returns a result containing a list of words for a given kanji
