const o = require('ospec')

const { ApiWrapper } = require('./api_wrapper')

o.spec('ApiWrapper', () => {
    const apiUrl = 'url'

    const withFetchSpy = (status, result) => {
        const json = Promise.resolve(result)
        const response = Promise.resolve({
            status,
            json: () => json
        })
        const fetchSpy = o.spy(() => response)

        return {
            json,
            response,
            apiWrapper: new ApiWrapper(
                fetchSpy,
                apiUrl,
            ),
            fetch: fetchSpy
        }
    }

    o('caches results of fetch', async () => {
        const { apiWrapper, fetch, response, json } = withFetchSpy(200, null)

        await response
        await json
        apiWrapper.getJoyoSet()
        apiWrapper.getJinmeiyoSet()
        apiWrapper.getJoyoSet()
        apiWrapper.getJinmeiyoSet()

        o(fetch.callCount).equals(2)
    })

    o('returns HTTP error code as record', async () => {
        const { apiWrapper, fetch, response, json } = withFetchSpy(404, null)

        o(apiWrapper.getJoyoSet())
            .deepEquals({ status: 'LOADING', value: null })

        await response
        await json

        o(apiWrapper.getJoyoSet())
            .deepEquals({ status: 'ERROR', value: 404 })
    })

    o('loads joyo kanji list', async () => {
        const { apiWrapper, fetch, response, json } = withFetchSpy(
            200, ['a', 'b', 'c'])

        o(apiWrapper.getJoyoSet())
            .deepEquals({ status: 'LOADING', value: null })

        await response
        await json

        o(fetch.calls[0].args[0]).equals('url/v1/kanji/joyo')
        const result = apiWrapper.getJoyoSet()
        o(result.status).equals('SUCCESS')
        o(result.value.size).equals(3)
        o([...result.value]).deepEquals(['a', 'b', 'c'])
    })

    o('loads jinmeiyo kanji', async () => {
        const { apiWrapper, fetch, response, json } = withFetchSpy(
            200, [4, 5, 6])

        apiWrapper.getJinmeiyoSet()
        await response
        await json

        o(fetch.calls[0].args[0]).equals('url/v1/kanji/jinmeiyo')
        const result = apiWrapper.getJinmeiyoSet()
        o(result.status).equals('SUCCESS')
        o(result.value.size).equals(3)
        o([...result.value]).deepEquals([4, 5, 6])
    })

    o('loads specific kanji', async () => {
        const { apiWrapper, fetch, response, json } = withFetchSpy(200, {})

        apiWrapper.getKanji('蜜')
        await response
        await json

        o(fetch.calls[0].args[0]).equals('url/v1/kanji/蜜')
        o(apiWrapper.getKanji('蜜'))
            .deepEquals({ status: 'SUCCESS', value: {} })
    })

    o('doesnt trim kanji strings', async () => {
        const { apiWrapper, fetch, response, json } = withFetchSpy(404, {})

        apiWrapper.getKanji('蜜蜜')
        await response
        await json

        o(fetch.calls[0].args[0]).equals('url/v1/kanji/蜜蜜')
        o(apiWrapper.getKanji('蜜蜜'))
            .deepEquals({ status: 'ERROR', value: 404 })
    })

    o('loads specific reading', async () => {
        const { apiWrapper, fetch, response, json } = withFetchSpy(200, {})

        apiWrapper.getReading('あり')
        await response
        await json

        o(fetch.calls[0].args[0]).equals('url/v1/reading/あり')
        o(apiWrapper.getReading('あり')).
            deepEquals({ status: 'SUCCESS', value: {} })
    })

    o('loads grade 1 kanji list', async () => {
        const { apiWrapper, fetch, response, json } = withFetchSpy(
            200, [1, 2, 3])

        apiWrapper.getListForGrade(1)
        await response
        await json

        o(fetch.calls[0].args[0]).equals('url/v1/kanji/grade-1')
        const result = apiWrapper.getListForGrade(1)
        o(result.status).equals('SUCCESS')
        o(result.value.size).equals(3)
        o([...result.value]).deepEquals([1, 2, 3])
    })

    o('loads grade 2 kanji list', async () => {
        const { apiWrapper, fetch, response, json } = withFetchSpy(200)

        apiWrapper.getListForGrade(2)

        o(fetch.calls[0].args[0]).equals('url/v1/kanji/grade-2')
    })

    o('loads words for specific kanji', async () => {
        const { apiWrapper, fetch, response, json } = withFetchSpy(
            200, ['a', 'b', 'c'])

        apiWrapper.getWordsForKanji('蜜')
        await response
        await json

        o(fetch.calls[0].args[0]).equals('url/v1/words/蜜')
        o(apiWrapper.getWordsForKanji('蜜'))
            .deepEquals({ status: 'SUCCESS', value: ['a', 'b', 'c'] })
    })

    o('calls notify callback after a request completes', async () => {
        const json = Promise.resolve({})

        const response = Promise.resolve({
            status: 200,
            json: () => json,
        })

        const fetchSpy = o.spy(() => response)

        const notifySpy = o.spy()

        const apiWrapper = new ApiWrapper(
            fetchSpy,
            apiUrl,
            notifySpy,
        )

        apiWrapper.getKanji('蜜')

        o(notifySpy.callCount > 0).equals(false)

        await response
        await json

        o(notifySpy.callCount > 0).equals(true)
    })
});
