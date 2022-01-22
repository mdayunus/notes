import React, { useEffect, useState } from 'react'
import note_services from '../services/notes_services'

const Note = (props) => {
    return (
        <div>
            <li>{props.title}</li>
            <button onClick={props.onClick}>{props.available ? 'Not Available' : 'Available'}</button>
        </div>
    )
}

const Notification = (props) => {
    if (props.message === null) {
        return null
    }
    if (props.message !== null && props.type === 'success') {
        return (
            <div className='sucessful'>
                {props.message}
            </div>
        )
    }
    return (
        <div className='error'>
            {props.message}
        </div>
    )
}

const Notes = () => {

    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState({ title: 'book title...', author: 'author...' })
    const [showAll, setShowAll] = useState(true)
    const [notificaitonMessage, setNotificationMessage] = useState({ message: null, type: null })
    const [currentId, setId] = useState(0)
    const notesToShow = showAll ? notes : notes.filter(note => note.available === true)

    useEffect(() => {
        note_services.getAllNotes()
            .then(fetchedNotes => {
                setNotes(fetchedNotes)
                console.log(fetchedNotes)
            })
            .catch(err => {
                console.log(`this is ane error ${err}`)
                const errMessage = {
                    message: 'there is a network error, please check your connection or retry again',
                    type: 'failure'
                }
                setNotificationMessage(errMessage)
                clearTimeout(currentId)
                setTimeout(() => {
                    setNotificationMessage({ message: null, type: null })
                }, 5000)
            })
    }, [])

    const handleTitleChange = (event) => {
        console.log(event.target.value)
        const updatedNote = { ...newNote, title: event.target.value }
        setNewNote(updatedNote)
    }

    const handleAuthorChange = (event) => {
        console.log(event.target.value)
        const updatedNote = { ...newNote, author: event.target.value }
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
        note_services.postNote(createdNote)
            .then(postedNote => {
                console.log(`new note to add ${postedNote}`)
                const successMessage = {
                    message: `new note added by the name ${postedNote.title}`,
                    type: 'success'
                }
                setNotificationMessage(successMessage)
                clearTimeout(currentId)
                setId(setTimeout(() => {
                    setNotificationMessage({ message: null, type: null })
                }, 5000))
                setNotes(notes.concat(postedNote))
                setNewNote({ title: 'book title...', author: 'author...' })
            })
    }

    const toggleAvailabiltyOf = (id) => {
        const noteToUpdate = notes.find(note => note.id === id)
        const updatedNote = { ...noteToUpdate, available: !noteToUpdate.available }
        note_services.updateNoteAt(id, updatedNote)
            .then(fetchedNote => {
                const successMessage = {
                    message: `updated availability of ${fetchedNote.title}`,
                    type: 'success'
                }
                setNotificationMessage(successMessage)
                console.log('1', currentId)
                clearTimeout(currentId)
                console.log('2', currentId)
                setId(setTimeout(() => {
                    setNotificationMessage({ message: null, type: null })
                }, 5000))
                console.log('3', currentId)
                console.log(fetchedNote)
                setNotes(notes.map(note => note.id === id ? fetchedNote : note))
            })
    }

    return (
        <div>
            <form onSubmit={handleNewNoteSubmit}>
                <input value={newNote.title} onChange={handleTitleChange} />
                <input value={newNote.author} onChange={handleAuthorChange} />
                <button type='submit'>Save</button>
            </form>
            <Notification message={notificaitonMessage.message} type={notificaitonMessage.type} />
            <button onClick={() => { setShowAll(!showAll) }}>{showAll ? 'Show Available' : 'Show All'}</button>
            <ul>
                {notesToShow.map(note =>
                    <Note key={note.id} title={note.title}
                        available={note.available}
                        onClick={() => { toggleAvailabiltyOf(note.id) }} />)}
            </ul>
        </div>

    )
}

export default Notes