const SearchBar = ({ value, onChange }) => {
    return (
        <div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Search for a country"
            />
        </div>
    )
}

export default SearchBar 