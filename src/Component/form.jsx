import React, { useState, useEffect, useRef } from 'react';
import {
    FormControl, FormGroup, TextField, Button, Checkbox, FormControlLabel, Typography, MenuItem, Select,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

/*Form*/
const Form = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [applicantName, setApplicantName] = useState('');
    const [applicantNameError, setApplicantNameError] = useState(false);
    const [applicantNameErrorMsg, setApplicantNameErrorMsg] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [canadianAddress, setCanadianAddress] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [dateOfBirthError, setDateOfBirthError] = useState(false);
    const [dateOfBirthErrorMsg, setDateOfBirthErrorMsg] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMsg, setEmailErrorMsg] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [phoneNumberErrorMsg, setPhoneNumberErrorMsg] = useState('');
    const [nationality, setNationality] = useState('');
    const [submittedData, setSubmittedData] = useState(null);
    const [countries, setCountries] = useState([]);
    const autocompleteRef = useRef(null);
    let autocomplete;

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBxs5Tio6Yhi9ygwgBjfHj_e84Z-dsR5_I&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                if (window.google) {
                    autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
                        types: ['address'],
                        componentRestrictions: { country: 'ca' }
                    });
                    autocomplete.addListener('place_changed', handlePlaceSelect);
                }
            };
            document.body.appendChild(script);
        };

        if (!window.google) {
            loadGoogleMapsScript();
        } else {
            autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
                types: ['address'],
                componentRestrictions: { country: 'ca' }
            });
            autocomplete.addListener('place_changed', handlePlaceSelect);
        }
    }, []);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://restcountries.com/v3.1/all');
                const countryNames = response.data.map(country => country.name.common);
                setCountries(countryNames);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        fetchCountries();
    }, []);

    const handlePlaceSelect = () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
            setCanadianAddress(place.formatted_address);
        }
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const validatePhoneNumber = (phoneNumber) => {
        const phoneNumberRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return phoneNumberRegex.test(phoneNumber);
    }

    const formatPhoneNumber = (phoneNumber) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumber;
    }

    const handleBlur = (event) => {
        if (event.target.name === 'applicantName') {
            if (!applicantName.trim()) {
                setApplicantNameError(true);
                setApplicantNameErrorMsg('Applicant Name is required.');
            } else {
                setApplicantNameError(false);
                setApplicantNameErrorMsg('');
            }
        }
        if (event.target.name === 'email') {
            if (!validateEmail(email)) {
                setEmailError(true);
                setEmailErrorMsg('Invalid email format.');
            } else {
                setEmailError(false);
                setEmailErrorMsg('');
            }
        }
        if (event.target.name === 'phoneNumber') {
            if (!validatePhoneNumber(phoneNumber)) {
                setPhoneNumberError(true);
                setPhoneNumberErrorMsg('Invalid phone number format.');
            } else {
                setPhoneNumberError(false);
                setPhoneNumberErrorMsg('');
            }
        }
    }

    const handleChange = (event) => {
        setMaritalStatus(event.target.value);
    };

    const handlePhoneChange = (event) => {
        const formattedPhoneNumber = formatPhoneNumber(event.target.value);
        setPhoneNumber(formattedPhoneNumber);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setEmailError(true);
            setEmailErrorMsg('Invalid email format.');
            return;
        }

        if (!validatePhoneNumber(phoneNumber)) {
            setPhoneNumberError(true);
            setPhoneNumberErrorMsg('Invalid phone number format.');
            return;
        }

        const data = {
            applicantName,
            maritalStatus,
            canadianAddress,
            dateOfBirth,
            email,
            phoneNumber,
            isChecked,
            nationality: isChecked ? nationality : '',
        };
        setSubmittedData(data);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div>
                <Typography className='Title' variant="h5" component="h2"> Registration Form</Typography>
                <FormGroup>
                    <FormControl>
                        <TextField 
                            label="Applicant Name" 
                            variant="outlined" 
                            fullWidth 
                            id="margin-dense" 
                            margin="dense" 
                            required 
                            sx={{ width: '500px' }}
                            onChange={(e) => setApplicantName(e.target.value)}
                            onBlur={handleBlur}
                            error={applicantNameError}
                            helperText={applicantNameErrorMsg} 
                            name="applicantName"
                        />
                    </FormControl>

                    <FormControl sx={{ width: '500px' }} fullWidth margin="dense">
                        <Select
                            value={maritalStatus}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Single</MenuItem>
                            <MenuItem value={20}>Married</MenuItem>
                            <MenuItem value={30}>Divorced</MenuItem>
                            <MenuItem value={40}>Widowed</MenuItem>
                            <MenuItem value={50}>Separated</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <TextField 
                            inputRef={autocompleteRef}
                            label="Canadian Address" 
                            variant="outlined" 
                            fullWidth 
                            id="margin-dense" 
                            margin="dense" 
                            sx={{ width: '500px' }} 
                            onChange={(e) => setCanadianAddress(e.target.value)}
                            value={canadianAddress}
                        />
                    </FormControl>

                    <FormControl>
                        <DatePicker
                            label="Date of Birth"
                            value={dateOfBirth}
                            onChange={(newValue) => setDateOfBirth(newValue)}
                            renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    sx={{ width: '500px' }}
                                    error={dateOfBirthError}
                                    helperText={dateOfBirthErrorMsg}
                                />
                            )}
                        />
                    </FormControl>

                    <FormControl>
                        <TextField 
                            label="Email" 
                            variant="outlined" 
                            fullWidth 
                            id="margin-dense" 
                            margin="dense" 
                            required 
                            sx={{ width: '500px' }} 
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={handleBlur}
                            error={emailError}
                            helperText={emailErrorMsg} 
                            name="email"
                        />
                    </FormControl>

                    <FormControl>
                        <TextField 
                            label="Phone Number" 
                            variant="outlined" 
                            fullWidth 
                            id="margin-dense" 
                            margin="dense" 
                            required 
                            sx={{ width: '500px' }} 
                            onChange={handlePhoneChange}
                            onBlur={handleBlur}
                            error={phoneNumberError}
                            helperText={phoneNumberErrorMsg} 
                            name="phoneNumber"
                        />
                    </FormControl>

                    <FormControl>
                        <FormControlLabel
                            control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                            label="  "
                        />
                    </FormControl>

                    {isChecked && (
                        <FormControl>
                            <Autocomplete
                                options={countries}
                                value={nationality}
                                onChange={(event, newValue) => setNationality(newValue)}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Nationality" 
                                        variant="outlined" 
                                        fullWidth 
                                        margin="dense" 
                                        sx={{ width: '500px' }} 
                                    />
                                )}
                            />
                        </FormControl>
                    )}

                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ width: '500px' }}>
                        Submit
                    </Button>
                </FormGroup>

                {submittedData && (
                    <div>
                        <h3>Submitted Data:</h3>
                        <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                    </div>
                )}
            </div>
        </LocalizationProvider>
    );
};

export default Form;
