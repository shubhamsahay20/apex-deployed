import React, { useState } from 'react';
import SchemeList from './SchemeList';
import CreateScheme from './CreateScheme';
import EditScheme from './EditScheme';

const Scheme = () => {
  const [currentview, setCurrentView] = useState('list');
  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleAddClick = () => {
    setCurrentView('create');
  };

  const handleEditClick = (scheme ) => {
    setSelectedScheme(scheme);
    setCurrentView('edit');
  };

  const handleDeleteClick = (id) => {
    setCurrentView('list');
  };

  const handleCreateSubmit = (data) => {
    console.log(data);
    setCurrentView('list');
  };

  const handleEditSubmit = (data) => {
    console.log(data);
    setCurrentView('list');
  };

  const handleCancel = () => {
    setCurrentView('list');
  };

  switch (currentview) {
    case 'create':
      return <CreateScheme onCancel={handleCancel}
       onSubmit={handleCreateSubmit} />;

    case 'edit':
      return <EditScheme 
      scheme={selectedScheme} 
      onSubmit={handleEditSubmit}
      onCancel={handleCancel}
       />;

    default:
      return (
        <SchemeList
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          handleAddClick={handleAddClick}
        />
      );
  }
};

export default Scheme;
