import API from "./axios";

//Get all notes
export const getNotes = () => API.get("/notes");

//Create note
export const createNote = (data) => API.post("/notes", data);

//Update note
export const updateNote = (id, data) =>
  API.put(`/notes/${id}`, data);

//Delete note
export const deleteNote = (id) =>
  API.delete(`/notes/${id}`);

//Search
export const searchNotes = (query) =>
  API.get(`/notes/search?query=${query}`);

//Add collaborator
export const addCollaborator = (id, data) =>
  API.post(`/notes/${id}/collaborator`, data);

//Get collaborators
export const getCollaborators = (id) =>
  API.get(`/notes/${id}/collaborators`);

//Update collaborator role
export const updateCollaborator = (noteId, collaboratorId, role) =>
  API.put(`/notes/${noteId}/collaborators/${collaboratorId}`, { role });

//Share note
export const shareNote = (id) =>
  API.post(`/notes/${id}/share`);