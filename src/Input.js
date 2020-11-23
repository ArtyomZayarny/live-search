import React, { useEffect, useState } from 'react'
import thumb from './thumb.jpg'
import cross from './icon-cross.png';

export default function Input(props) {
    const [loading, setLoading] = useState(false)
    const [request, setRequest] = useState('')
    const [data, setData] = useState({
        result: [],
        search: [],
        error: ''
    })

    const fetchData = async (request) => {
        let response = await fetch(`http://43.240.103.34/api.shadhin/api/search?keyword=${request}`)
        let result = await response.json();

        if (result.status === 'success') {
            return result.data
        }
        return []
    }

    useEffect(() => {
        if (data.result.length > 0) {
            let result = search(request);
            if (result.length > 0) {
                setData({ ...data, search: result })
                setLoading(false)
            } else {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }, [data.result])

    const search = (request) => {
        let result = data.result.filter(artist => {
            if (artist.title.indexOf(request) > -1) {
                return artist
            }
        })
        return result
    }
    const handleChange = async (value) => {
        if (value === '') {
            setData({ ...data, search: [] })
            setRequest(value)

        } else {
            setRequest(value);
            setLoading(true)
            const response = await fetchData(value)

            if (Object.keys(response).length > 0) {
                setData({ ...data, result: response.Artist.data, error: '' })
            } else {
                setData({ ...data, error: 'No result for your request', result: [], search: [] })
                setLoading(false)
            }
        }
    }
    const handleClear = () => {
        setRequest('');
        setData({ ...data, search: [] })
    }

    return (
        <>
            <div className="src d-none d-md-block">
                <form>
                    <div className="wrap">
                        <input
                            value={request}
                            onChange={(e) => { handleChange(e.target.value) }}
                            type="text"
                            placeholder="Search artist, songs, videos..."
                        />
                        {request.length > 0 && <button
                            onClick={() => { handleClear() }}
                            className="search-cancil"
                        ><img src={cross} /></button>}
                    </div>
                    {loading ? <h2>Loading</h2> : ''}
                    {data.error !== '' ? <h2>{data.error}</h2> : ''}
                </form>
            </div>
            {!loading && data.search.length > 0 && <div className="search-reasult">
                <ul>
                    {data.search.map(item =>
                        <li key={item.Artist}>
                            <a href="#">
                                <img src={thumb} />
                                {item.Artist}
                            </a>
                        </li>
                    )}
                </ul>
            </div>}
        </>
    )
}
