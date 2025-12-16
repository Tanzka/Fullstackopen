import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()

    const anecdotes = useSelector(state => 
    [...state].sort((a,b) => b.votes - a.votes)
    )

    const handleVote = id => {
        dispatch(voteAnecdote(id))
        console.log('vote', id)
    }

    return (
        <div>
            {anecdotes.map(anecdote => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote.id)}>vote</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AnecdoteList 