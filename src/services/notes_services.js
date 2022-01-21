import axios from 'axios'

let baseUrl = 'http://localhost:3001/notes'

const getAllNotes = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const postNote = (note) => {
    return axios.post(baseUrl, note).then(response => response.data)
}

const updateNoteAt = (id, note) => {
    return axios.patch(`${baseUrl}/${id}`, note).then(response => response.data)
}

const note_services = {
    getAllNotes,
    postNote,
    updateNoteAt
}

export default note_services
    

