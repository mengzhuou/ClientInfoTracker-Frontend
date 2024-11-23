import './EditExistingClient.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { updateRecord, deleteRecord, deleteDraft, createRecord } from '../../connector';
import DeletePopup from '../Functions/PopupModals/DeletePopup/DeletePopup';

const EditExistingClient = () => {
    // allows me to push users back to the home page after submission
    const navigate = useNavigate();
    const location = useLocation(); // Retrieve passed state
    const [selectedRow, setSelectedRow] = useState({});

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    
    // All state variables in form
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [hobby, setHobby] = useState('');
    const [familySituation, setFamilySituation] = useState('');
    const [birthday, setBirthday] = useState('');
    const [reasonOfKnowing, setReasonOfKnowing] = useState('');
    const [position, setPosition] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [additionalNote, setAdditionalNote] = useState('');
    const [importantDatesAndNotes, setImportantDatesAndNotes] = useState([]);



    useEffect(() => {
        if (location.state?.selectedRow) {
            const normalizedRow = Array.isArray(location.state.selectedRow) ? location.state.selectedRow : [location.state.selectedRow];
    
            const row = normalizedRow[0]; // Access the first item in the array
    
            // Update the state variables with the row data
            setSelectedRow(row);
            setName(row.name || '');
            setCompany(row.company || '');
            setHobby(row.hobby || '');
            setFamilySituation(row.familySituation || '');
            setBirthday(row.birthday ? new Date(row.birthday) : '');
            setReasonOfKnowing(row.reasonOfKnowing || '');
            setPosition(row.position || '');
            setPhoneNumber(row.phoneNumber ? String(row.phoneNumber) : ''); 
            setEmail(row.email || '');
            setAdditionalNote(row.additionalNote || '');
            // setImportantDatesAndNotes(row.importantDatesAndNotes || []);
            setImportantDatesAndNotes(
                row.importantDatesAndNotes
                    ? row.importantDatesAndNotes.map(item => ({
                          importantDate: item.importantDate ? new Date(item.importantDate) : null,
                          note: item.note,
                      }))
                    : []
            );
        } else {
            console.error("No data found");
            navigate('/MainPage'); // Redirect to main page if no data is found
        }
    }, [location.state, navigate]);

    const formatPhoneNumber = (number) => {
        if (!number) return '';
        const cleaned = String(number).replace(/\D/g, ''); // Convert to string before replacing
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (!match) return number;
        return [match[1], match[2], match[3]].filter(Boolean).join('-');
    };
    
    const validateForm = () => {
        if (phoneNumber.length !== 0) {
            const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ''); 
            if (cleanedPhoneNumber.length !== 10) {
                alert('Phone number must be either empty or exactly in the format "999-999-9999".');
                return false;
            }
        }

        
        return true;
    };
    

    // removes all fields
    const resetFields = () => {
        setName(''); 
        setHobby('');
        setEmail(''); 
        setCompany(''); 
        setBirthday('');
        setPosition(''); 
        setPhoneNumber('');
        setFamilySituation(''); 
        setReasonOfKnowing(''); 
        setAdditionalNote('');
        setImportantDatesAndNotes([]);
    };

    const handleAddRow = () => {
        setImportantDatesAndNotes([...importantDatesAndNotes, { importantDate: '', note: '' }]);
    };

    const handleRemoveRow = (index) => {
        const updatedRows = importantDatesAndNotes.filter((_, i) => i !== index);
        setImportantDatesAndNotes(updatedRows);
    };

    const handleRowChange = (index, field, value) => {
        const updatedRows = [...importantDatesAndNotes];
        updatedRows[index][field] = value;
        setImportantDatesAndNotes(updatedRows);
    };

    const handleSaveDraft = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const draftDetails = {
            name,
            company,
            hobby,
            familySituation,
            birthday: birthday ? birthday.toISOString() : null,
            reasonOfKnowing,
            position,
            phoneNumber,
            email,
            additionalNote,
            importantDatesAndNotes: importantDatesAndNotes.map(row => ({
                importantDate: row.importantDate instanceof Date && !isNaN(row.importantDate)
                    ? row.importantDate.toISOString()
                    : null, // Ensure it's a valid Date object or null
                note: row.note,
            })),
            draftStatus: true,
        };

        try {
            if (selectedRow._id) {
                await updateRecord(selectedRow._id, draftDetails);
            } else {
                await createRecord(draftDetails);
            }
            resetFields();
            navigate('/draft');
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const clientDetails = {
            name,
            company,
            hobby,
            familySituation,
            birthday: birthday ? birthday.toISOString() : null,
            reasonOfKnowing,
            position,
            phoneNumber,
            email,
            additionalNote,
            importantDatesAndNotes: importantDatesAndNotes.map(row => ({
                importantDate: row.importantDate instanceof Date && !isNaN(row.importantDate)
                    ? row.importantDate.toISOString()
                    : null, // Ensure it's a valid Date object or null
                note: row.note,
            })),
            draftStatus: false,
        };

        try {
            if (selectedRow.draftStatus) {
                await createRecord(clientDetails);
                await deleteDraft(selectedRow._id);
            } else {
                await updateRecord(selectedRow._id, clientDetails);
            }
            resetFields();
            navigate('/MainPage');
        } catch (error) {
            console.error('Error submitting client:', error);
        }
    };

    const handleDelete = (state) => {
        // Set the record to delete and show the popup
        const normalizedRow = Array.isArray(state.selectedRow)
         ? state.selectedRow
         : [state.selectedRow];
         const row = normalizedRow[0];
        setRecordToDelete(row._id);
        setIsPopupOpen(true);
    }

    const confirmDelete = async () => {
        if (recordToDelete) {
            try {
                await deleteRecord(recordToDelete); // Call the delete API
                navigate('/MainPage'); // Navigate to the main page
            } catch (error) {
                console.error("Error deleting record:", error);
            }
        } else {
            console.warn("No record to delete.");
        }
        // Close the popup after deletion
        setIsPopupOpen(false);
        setRecordToDelete(null);
    };
    

    const cancelDelete = () => {
        // Close the popup without deleting
        setIsPopupOpen(false);
        setRecordToDelete(null);
    };

    const getUpdatedAt = () => {
        if (!selectedRow) {
            return "No data available"; // Default text if no data
        }
    
        const row = selectedRow;
        if(row.draftStatus){
            return row.createdAt ? new Date(row.createdAt).toLocaleString() : "No update time available";
        } else {
            return row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "No update time available";
        }
    };


    return (
        <div className='edit-client-page-body'>
            <div className='edit-client-container'>
                <p className='title'>Edit Existing Client</p>
                <div className = 'last-update-time-container'>
                    <label className='updateLabel'>Last Updated Time:</label>
                    <label className='updatedAt'>
                        {getUpdatedAt()}
                    </label>
                </div>
                <form className='form-scrollable'>
                    <div className='form-row1'>
                        <div className='label-input-group'>
                            <label>Name <span className='must-fill'>*</span></label>
                            <input
                                className='name'
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className='label-input-group'>
                            <label>Company <span className='must-fill'>*</span></label>
                            <input
                                className='company'
                                type="text"
                                required
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                        <div className='label-input-group'>
                            <label>Hobby <span className='must-fill'>*</span></label>
                            <input
                                className='hobby'
                                type="text"
                                required
                                value={hobby}
                                onChange={(e) => setHobby(e.target.value)}
                            />
                        </div>
                    </div>
                    {importantDatesAndNotes.map((row, index) => (
                        <div key={index} className="form-row2">
                            <div className="label-input-group">
                                <label>Important Date</label>
                                <DatePicker
                                    className="date-important"
                                    dateFormat="yyyy/MM/dd"
                                    selected={row.importantDate}
                                    onChange={(date) => handleRowChange(index, "importantDate", date)}
                                />
                            </div>
                            <div className="label-input-group">
                                <label>Note</label>
                                <textarea
                                    className="note"
                                    value={row.note}
                                    onChange={(e) => handleRowChange(index, "note", e.target.value)}
                                />
                            </div>
                            <div className="note-buttons">
                                <button type="button" className="add-button" onClick={handleAddRow}>
                                    +
                                </button>
                                {importantDatesAndNotes.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => handleRemoveRow(index)}
                                    >
                                        <span className="minus">-</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className='form-row3'>
                        <div className='label-input-group'>
                            <label>Family Situation</label>
                            <input
                                className='family-situation'
                                type="text"
                                value={familySituation}
                                onChange={(e) => setFamilySituation(e.target.value)}
                            />
                        </div>
                        <div className='label-input-group'>
                            <label>Birthday</label>
                            <DatePicker
                                className='birthday'
                                selected={birthday}
                                dateFormat="yyyy/MM/dd"
                                onChange={(date) => setBirthday(date)}
                                placeholderText='YYYY/MM/DD'
                                portalId="root-portal"
                            />
                        </div>
                        <div className='label-input-group'>
                            <label>Reason of Knowing</label>
                            <input
                                className='reason-of-knowing'
                                type="text"
                                value={reasonOfKnowing}
                                onChange={(e) => setReasonOfKnowing(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='form-row4'>
                        <div className='label-input-group'>
                            <label>Position</label>
                            <input
                                className='position'
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            />
                        </div>
                        <div className='label-input-group'>
                            <label>Phone Number</label>
                            <input
                                className='phone-number'
                                type="text"
                                value={formatPhoneNumber(phoneNumber)} 
                                onChange={(e) => {
                                    const formattedValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                    if (formattedValue.length <= 10) {
                                        setPhoneNumber(formattedValue); 
                                    }
                                }}
                                
                            />
                        </div>
                        <div className='label-input-group'>
                            <label>Email</label>
                            <input
                                className='email'
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='form-row5'>
                        <div className='label-input-group'>
                            <label>Additional Note</label>
                            <textarea
                                className='additional-note'
                                value={additionalNote}
                                onChange={(e) => setAdditionalNote(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='bottom-buttons'>
                        <button type="submit" onClick={handleSaveDraft} className='edit-save-draft'>Save Draft</button>
                        <button type="submit" onClick={handleSubmit} className='edit-submit'>Submit</button>
                        <button type="button" onClick={()=>handleDelete(location.state)} className='edit-delete'>Delete</button>
                    </div>

                    {isPopupOpen && (
                            <DeletePopup
                                onClose={cancelDelete} // Handle cancel
                                onConfirm={confirmDelete} // Handle confirm
                                message="Delete this record permanently?"
                            />
                        )}
                    
                </form>
            </div>
        </div>
    );
}
export default EditExistingClient;

