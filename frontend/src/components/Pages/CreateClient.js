import React, { useState } from 'react';
import './CreateClient.css';
import { withFuncProps } from "../withFuncProps";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { createRecord } from '../../connector';
import validator from 'validator';


const CreateClient = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        hobby: '',
        importantDate: '',
        note: '',
        familySituation: '',
        birthday: '',
        reasonOfKnowing: '',
        position: '',
        phoneNumber: '',
        email: '',
        additionalNote: ''
    });

    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [companyError, setCompanyError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);
    
        if (name === 'name') validateName(value);
        if (name === 'company') validateCompany(value);
        if (name === 'email') validateEmail(value);
    };
    
    // birthday date picker changes
    const handleDateChange = (name, date) => {
        const updatedData = { ...formData, [name]: date };
        setFormData(updatedData);
    };

    const validateForm = () => {
        const isNameValid = validateName(formData.name);
        const isCompanyValid = validateCompany(formData.company);
        const isEmailValid = validateEmail(formData.email);
    
        return isNameValid && isCompanyValid && isEmailValid;
    };

    const validateName = (name) => {
        if (name.trim()) {
            setNameError('');
            return true;
        } else {
            setNameError('Name is required');
            return false;
        }
    };
    
    const validateCompany = (company) => {
        if (company.trim()) {
            setCompanyError('');
            return true;
        } else {
            setCompanyError('Company is required');
            return false;
        }
    };

    const validateEmail = (email) => {
        if (email.trim() === '') {
            setEmailError(''); // No error if the field is empty
            return true;
        }
        if (validator.isEmail(email)) {
            setEmailError('');
            return true;
        } else {
            setEmailError('Enter a valid Email');
            return false;
        }
    };    

    const formatPhoneNumber = (number) => {
        if (!number) return ''; 
        const cleaned = number.replace(/\D/g, ''); 
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/); 
        if (!match) return number;
        return [match[1], match[2], match[3]]
            .filter(Boolean)
            .join('-');
    };

    const handleSaveDraft = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) {
            return;
        }
    
        const cleanedPhoneNumber = formData.phoneNumber.replace(/[^0-9]/g, '');
    
        const importantDatesAndNotes = dateNoteRows.map((row) => ({
            importantDate: row.importantDate ? row.importantDate.toISOString() : null,
            note: row.note || '',
        }));
    
        const draftDetails = {
            ...formData,
            importantDatesAndNotes, 
            birthday: formData.birthday ? formData.birthday.toISOString() : null,
            phoneNumber: cleanedPhoneNumber,
            draftStatus: true,
        };
    
        try {
            await createRecord(draftDetails);
            resetFields();
            props.navigate('/draft');
        } catch (error) {
            console.error('Error saving draft:', error);
            alert('Failed to save draft. Data is saved locally.');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) {
            return;
        }
    
        const cleanedPhoneNumber = formData.phoneNumber.replace(/[^0-9]/g, '');
    
        const importantDatesAndNotes = dateNoteRows.map((row) => ({
            importantDate: row.importantDate ? row.importantDate.toISOString() : null,
            note: row.note || '',
        }));
    
        const clientDetails = {
            ...formData,
            importantDatesAndNotes,
            birthday: formData.birthday ? formData.birthday.toISOString() : null,
            phoneNumber: cleanedPhoneNumber,
            draftStatus: false,
        };
    
        try {
            await createRecord(clientDetails);
            console.log('New client added');
            resetFields();
            props.navigate('/MainPage');
        } catch (error) {
            console.error('Error adding client:', error);
            alert('Failed to add client. Data is saved locally.');
        }
    };
    
    
    const resetFields = () => {
        setFormData({
            name: '',
            company: '',
            hobby: '',
            importantDate: '',
            note: '',
            familySituation: '',
            birthday: '',
            reasonOfKnowing: '',
            position: '',
            phoneNumber: '',
            email: '',
            additionalNote: ''
        }); 
    };

    const [dateNoteRows, setDateNoteRows] = useState([
        { importantDate: '', note: '' }
    ]);

    // input changes for dynamic rows
    const handleRowChange = (index, field, value) => {
        const updatedRows = [...dateNoteRows];
        updatedRows[index][field] = value;
        setDateNoteRows(updatedRows);
    };

    const addRow = () => {
        setDateNoteRows([...dateNoteRows, { importantDate: '', note: '' }]);
    };

    const removeRow = (index) => {
        const updatedRows = dateNoteRows.filter((_, i) => i !== index);
        setDateNoteRows(updatedRows);
    };

    const handleImportantDateChange = (index, date) => {
        const updatedRows = [...dateNoteRows];
        updatedRows[index].importantDate = date;
        setDateNoteRows(updatedRows);
    };

    

    return (
        <div className='create-client-page-body'>
            <div className='create-client-container'>
                <p className='title'>Create a New Client</p>
                <form className='form-scrollable'>
                    <div className='form-row1'>
                        <div className='label-input-group'>
                            <label>Name <span className='must-fill'>*</span></label>
                            <input
                                className='name'
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <span className='errMessage'>{nameError}</span>
                        </div>
                        <div className='label-input-group'>
                            <label>Company <span className='must-fill'>*</span></label>
                            <input
                                className='company'
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                            />
                            <span className='errMessage'>{companyError}</span>
                        </div>
                        <div className='label-input-group'>
                            <label>Phone Number</label>
                            <input
                                className='phone-number'
                                name="phoneNumber"
                                value={formatPhoneNumber(formData.phoneNumber)}
                                onChange={(e) => {
                                    const formattedValue = e.target.value.replace(/[^0-9()-]/g, '');
                                    setFormData({ ...formData, phoneNumber: formattedValue });
                                }}
                            />
                        </div>
                    </div>

                    {dateNoteRows.map((row, index) => (
                        <div key={index} className='form-row2'>
                            <div className='label-input-group'>
                                <label>Important Date</label>
                                <DatePicker
                                    className="date-important"
                                    dateFormat="yyyy/MM/dd"
                                    selected={row.importantDate}
                                    onChange={(date) => handleImportantDateChange(index, date)}
                                    placeholderText='YYYY/MM/DD'
                                    portalId="root-portal"
                                />
                            </div>
                            <div className='label-input-group'>
                                <label>Note</label>
                                <textarea
                                    className='note'
                                    type="text"
                                    value={row.note}
                                    onChange={(e) => handleRowChange(index, 'note', e.target.value)}
                                />
                            </div>
                            <div className='note-buttons'>
                                <button type="button" className="add-button" onClick={addRow}>
                                    +
                                </button>
                                {dateNoteRows.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => removeRow(index)}
                                    >
                                        <span className='minus'>
                                            -
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className='form-row3'>
                        <div className='label-input-group'>
                            <label>Birthday</label>
                            <DatePicker
                                className='birthday'
                                selected={formData.birthday}
                                dateFormat="yyyy/MM/dd"
                                onChange={(date) => handleDateChange('birthday', date)}
                                placeholderText='YYYY/MM/DD'
                                portalId="root-portal"
                                maxDate={new Date()}
                            />
                        </div>
                        <div className='label-input-group'>
                            <label>Email</label>
                            <input
                                className='email'
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={(e) => {
                                    handleChange(e);
                                    validateEmail(e.target.value);
                                }}
                            />
                            <span className='errMessage'>{emailError}</span>
                        </div>
                        <div className='label-input-group'>
                            <label>Position</label>
                            <input
                                className='position'
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='form-row4'>
                        <div className='label-input-group'>
                            <label>Family Situation</label>
                            <textarea
                                className='family-situation'
                                type="text"
                                name="familySituation"
                                value={formData.familySituation}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='label-input-group'>
                            <label>Reason of Knowing</label>
                            <textarea
                                className='reason-of-knowing'
                                type="text"
                                name="reasonOfKnowing"
                                value={formData.reasonOfKnowing}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='label-input-group'>
                            <label>Hobby</label>
                            <textarea
                                className='hobby'
                                type="text"
                                name="hobby"
                                value={formData.hobby}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='form-row5'>
                        <div className='label-input-group'>
                            <label>Additional Note</label>
                            <textarea
                                className='additional-note'
                                type="text"
                                name="additionalNote"
                                value={formData.additionalNote}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='bottom-buttons'>
                        <button type="submit" onClick={handleSaveDraft} className='save-draft'>Save Draft</button>
                        <button type="submit" onClick={handleSubmit} className='submit'>Submit</button>
                        {/* <button type="button" onClick={resetFields} className='clear'>Clear</button> */}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default withFuncProps(CreateClient);
