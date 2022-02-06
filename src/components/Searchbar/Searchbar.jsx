import PropTypes from 'prop-types';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  SearchbarStyles,
  SearchForm,
  SearchFormButton,
  SearchFormInput,
} from './Searchbar.styled';

const Searchbar = ({ propSubmit }) => {
  const [value, setValue] = useState('');

  // Handle Change
  const handleChange = event => {
    setValue(event.currentTarget.value);
  };

  // Handle Submit
  const handleSubmit = event => {
    event.preventDefault();

    if (value.trim() === '') {
      return toast.error('Please enter a valid search name!');
    }
    propSubmit(value);
    reset();
  };

  // Reset
  const reset = () => {
    setValue('');
  };

  return (
    <>
      <Toaster position="top-right" />
      <SearchbarStyles>
        <SearchForm onSubmitCapture={handleSubmit}>
          <SearchFormInput
            type="text"
            value={value}
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={handleChange}
          />
          <SearchFormButton type="submit"></SearchFormButton>
        </SearchForm>
      </SearchbarStyles>
    </>
  );
};

export default Searchbar;

Searchbar.propTypes = {
  propSubmit: PropTypes.func.isRequired,
};
