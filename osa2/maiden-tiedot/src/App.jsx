import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import SearchBar from './components/SearchBar'
import CountryList from './components/CountryList'
import CountryInfo from './components/CountryInfo'

const App = () => {
    const [countries, setCountries] = useState([])
    const [search, setSearch] = useState('')
    const [filtered, setFiltered] = useState([])

    useEffect(() => {
        countriesService.getAll().then(setCountries)
    }, [])

    useEffect(() => {
        const results = countries.filter(c =>
            c.name.common.toLowerCase().includes(search.toLowerCase())
        )
        setFiltered(results)
    }, [search, countries])

    const handleSearchChange = e => setSearch(e.target.value)
    const handleShowCountry = name => {
        setFiltered(countries.filter(c => c.name.common === name))
    }

    const showDetail = filtered.length === 1 ? filtered[0] : null

    return (
        <div>
            <h1>Country Search</h1>
            <SearchBar value={search} onChange={handleSearchChange} />
            <div>
                {!showDetail && (
                    <CountryList countries={filtered} onShow={handleShowCountry} />
                )}
                {showDetail && <CountryInfo country={showDetail} />}
            </div>
        </div>
    )

}


export default App
