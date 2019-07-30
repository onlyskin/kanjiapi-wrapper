# kanjiapi-wrapper

A wrapper library for [kanjiapi.dev](https://kanjiapi.dev). Provides
(currently) in-memory only request caching, and wraps the api with an
asynchronous notification based model.

## Installation
`yarn add kanjiapi-wrapper` / `npm install kanjiapi-wrapper`

## Example usage

### Generic usage:
```javascript
const { Kanjiapi } = require('kanjiapi-wrapper')

const onchange = () => {
    // Ask kanjiapi instance for data again and trigger UI redraws
}
const kanjiapi = Kanjiapi.build(onchange)

const result = kanjiapi.getKanji('字')
// { status: "LOADING", value: null }

// once the data is loaded, onchange will be called, after this point calling
// kanjiapi.getKanji('字') returns:
// { status: "SUCCESS", value: { kanji: "字", ... } }
```

### mithril.js example:
[flems.io](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4hcYgAIA1hjS8IGAA4RJAXkkBpOQuUR8AIwCu0ACYAKLPgBOMU9YwB3AJQBuADppP4qdvmqNYE9JEMkANwgYR0RJc2BJDGJiazgY+OpCDAdqRmtJVnzndQA+SSC0UMrJH0lbOCMoKQ1Zfz18AHMYYj8FcwysjByYa2dPYKqQ22Ijawq6huJ8CUSjOHU1DQByAGUAVQBhfYBRbe3NyQB+cYnKrHNNhs2KWvgF-DCMKCMYfBw5CDQ7Tgv2Ulhg-0BJUkd02UAgT2h4LQAPazjRkkQ1xuk1ejSWxBWaw2WwAMgB5ACCABEAJIAOQA4ucrhVsaFNiTaBhTCjzpjWWzJJsjtZrLRrJssexPKwxmgagAFDCddRlLH0AEQYgxOKSZaMQpQ-U-frZXKqzaAdW0nliIlEdfFjYa1KVkFi7ljKpsAUojMRkMQAJ5KGBqRgAD2IAF0bQKquVBSENWhfdrJDAjQTGPhTYNzRofgTrJ1Fh8vjAKJ6bmXvjFjTnMmbhpW49jpa3Qs4W9i7j0IM90o288M61mTUOhnlWF2sVGW7KvGgrFhaEYGOZTLRqEYcAxDLRTIHnkrOs5KCA4DBYDkIPQEDwAEwAFkQAAY2BwQJgcHgc3ABDQ9CMMwPBsHOIBwmg0j3qgX5cHgLS6CoAC0jgOEoIbWOeMzkDwJDEEoqQAPREWuSjSO0Oa0FgRGIYoKFocomEAAIAIz4K++AAGy0To9EQKh6GYb8AL4Pw55BiGeBwNQ1gQEoojsJwP48FgWqEHJ5BUDheD4YRiAkWRFFUTRanEBp0DMQ+HH4AAzERZkWVAIloGJAGSdwF6yfJilRqwQA)
```javascript
const kanjiapi = Kanjiapi.build(m.redraw);

const Kanji = {
    view: ({ attrs: { character } }) => {
        const result = kanjiapi.getKanji(character)

        return result.status === 'SUCCESS' ?
            m('ul', result.value.meanings.map(meaning => m('li', meaning))) :
            result.status === 'LOADING' ?
            'Loading' :
            'Error'
    },
}

const Page = {
    oninit: ({ state }) => state.character = '字',
    view: ({ state }) => [
        m(
            'input[type=text]',
            {
              oninput: e => state.character = e.target.value,
              value: state.character,
            },
        ),
        m(Kanji, { character: state.character }),
    ],
}

m.mount(document.body, Page)
```

### react.js example:
[flems.io](https://flems.io/#0=N4IgtglgJlA2CmIBcA2ATAOhSgNCAZhAgM7IDaoAdgIZiJIgYAWALmLCHgMYD2lL8fshAAeKBABuAAmgBeADohqAB2WKAfCID04ies4hi8BFxYQ+pBgAYkARgAsIAL44qteowBWpbnwFCGXkpiFikAaWpKTwgpWSkACmApLiZqACdqU3g0nCkAa0jolRinAEpY9SlgeUopOuSLULT4YgBXWFC4gqiIYowAc3gWCJ74lPTMgTTSmvqpZpZWtNrmto6MEOpF4ljZOIByAGUAVQBhU4BRQ8P9qQB+Wbn6kXb1R6f64FX2lgwJalgrXgGDokQglH6xBBKnioMo4P6FXeH2esBieXgAE9ZMA4QinOpcfAwRCnNo0epSk5kXNtK8pEgafVvutNttdgcADIAeQAggARACSADkAOK3B61FFiSTqTk8ajiCHaXTqRlSj4yvQXNJpHhpFWymrUyg1LiwajEHYABWogyk8AAHv4oDsAErE0wYU48MDKPiCULVKVBEJpVqmfXxZR65TEcrBuZtZTZaOx+MAbmRLCYEChqUocHggsoylanSkObzzEiRZLZd+ACNwVB4lX49nc1DmlAMgB3WKVrsYHv9jDNwttrszU0aofVtnwQdJcYZLJpJBSfaAdW19rlYAqoPAoLyWJv+VtgZQeH34uUnFm5+2MN0isoYnERm+IOPWkRW8+o7UH2pSPnUJqPEBt4Jp2C5DIcLCXvEd4VAkSQHoqx6nuel4YNe0FSGUM7gTUjwFnWpblvE8AwU+w5GCwCFISuqRrlMm7AohaSDL8-yAkuZSPBBUrNIWqa0XMCxLLUIhvHOdQiOCDaVpiKYKCAAjOooUh8UCOLPouGCrpM2ROFIfCnAWgz6cO5EIPW5ZOFocmal+MTGeuNkLohAhGaxJlpGZr69O+XlQsFxQEtobkuc8zlCcapGUB6kz8tyACyI6CEeaTxCItqDM5uRQDwXCtHQ-ADEMFwIBVLAAEKYoKrb7Coyj7KUpQGLwfpENkwiNtQjbGM4rggDQdDCEZVrdX4gbCM4AC6eBopQeSWBQ43uMIEXvgAtH2GSqP1eBLBwDCsCwcZIFoWitKWeT9EZvpaLtEAHUdKZpAYLCqR4xBcGkEDKCwo1uJNDDNJMGBHhIxg8ModUYN4BhncIl3Xbd93KI9z1gFoUOmAAArYKB3WAUAE56vyw-DiOBsjPgaX9wgA0DINg1tEMgITLB7SVYAw-AcMHvTlUo6daTnSAGPEDdd0PU9PVU5M-O+iTKAYAAHFg5OU7zauC7TotIxLzMpqzgPA6DLjgx4g3DbAILgozqNS+jLBXXLWOK3jWgO8Ye2bIWAIBkTmtoJrVj+0NxjO5Qrt4L9FsMGz1tLU4QA)
```javascript
const Kanji = ({ character, kanjiapi }) => {
    const result = kanjiapi.getKanji(character)
    return result.status === 'SUCCESS' ?
        <ul>
          {result.value.meanings.map(meaning =>
            <li key={meaning}>{meaning}</li>)}
        </ul> :
        result.status === 'LOADING' ?
        <div>Loading</div>:
        <div>Error</div>
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this)
    this.redraw = this.redraw.bind(this)

    this.state = { character: '字', loadedAt: Date.now() };
    this.kanjiapi = Kanjiapi.build(this.redraw);
  }

  redraw() {
    this.setState(() => ({ loadedAt: Date.now() }))
  }

  handleInput(e) {
    this.setState({ character: e.target.value })
  }

  render() {
    return <>
      <input type="text" value={this.state.character} onChange={this.handleInput}/>
      <Kanji character={this.state.character} kanjiapi={this.kanjiapi}></Kanji>
    </>
  }
}

ReactDOM.render(<Page/>, document.getElementById('app'))
```

## Result form:
Results have a status either of "LOADING", "SUCCESS", or "ERROR", and a value
of the parsed API response.
```
{
    status: "LOADING" | "SUCCESS" | "ERROR",
    value: $RESPONSE,
}
```

## Methods
`getUrl`
`getKanji`
`getReading`
`getJoyoSet`
`getJinmeiyoSet`
`getListForGrade`
`getWordsForKanji`
