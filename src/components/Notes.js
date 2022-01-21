import React, { useEffect, useState } from 'react'
import axios from 'axios'
import note_services from '../services/notes_services'

const Note = (props) => {
    return (
        <div>
            <li>{props.title}</li>
            <button onClick={props.onClick}>{props.available ? 'Not Available' : 'Available'}</button>
        </div>
    )
}

const Notes = () => {

    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState({ title: 'book title...', author: 'author...' })

    useEffect(() => {
        note_services.getAllNotes()
            .then(fetchedNotes => {
                setNotes(fetchedNotes)
                console.log(fetchedNotes)
            })
            .catch(err => {
                console.log(`this is ane error ${err}`)
            })
    }, [])



    const handleTitleChange = (event) => {
        console.log(event.target.value)
        const updatedNote = {...newNote, title: event.target.value}
        setNewNote(updatedNote)
    }

    const handleAuthorChange = (event) => {
        console.log(event.target.value)
        const updatedNote = {...newNote, author: event.target.value}
        setNewNote(updatedNote)
    }

    const handleNewNoteSubmit = (event) => {
        event.preventDefault()
        console.log('new note added')
        const createdNote = {
            ...newNote,
            "id": Math.random(),
            "available": Math.random() < 0.5
        }
        axios
            .post('http://localhost:3001/notes', createdNote)
            .then(response => {
                console.log(`new note to add ${response.data.title}`)
                setNotes(notes.concat(response.data))
            })
    }

    const toggleAvailabiltyOf = (id) => {
        console.log(`availability of book with ${id} needs to be changes`)
    }

    const toggleShowAvailable = () => {
        console.log('show only available')
    }

    return (
        <div>
            <form onSubmit={handleNewNoteSubmit}>
                <input value={newNote.title} onChange={handleTitleChange} />
                <input value={newNote.author} onChange={handleAuthorChange} />
                <button type='submit'>Save</button>
            </form>
            <button onClick={toggleShowAvailable}>show all</button>
            <ul>
                {notes.map(note =>
                    <Note key={note.id} title={note.title}
                        available={note.available}
                        onClick={() => { toggleAvailabiltyOf(note.id) }} />)}
            </ul>
        </div>

    )
}

export default Notes