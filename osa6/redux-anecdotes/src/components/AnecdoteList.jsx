import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const filtered = anecdotes.filter(a => 
      a.content.toLowerCase().includes(filter.toLowerCase())
    )
    return [...filtered].sort((a, b) => b.votes - a.votes)
  })

  const handleVote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`You voted '${anecdote.content}'`, 10))
  }

    return (
        <div>
            {anecdotes.map(anecdote => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AnecdoteList 