import React from 'react';
import { Form, InputGroup, FormControl } from 'react-bootstrap';
import { FaSearch, FaFilter, FaTag, FaCog } from 'react-icons/fa';
import './Exercise.css';

const Filter = ({ categories, mechanics, primaryMuscles, secondaryMuscles, onFilterChange }) => {
  return (
    <div className="filter-container">
      <h3 className="filter-title"><FaFilter /> Filters</h3>
      <Form className="filter-form">
        <div className="filter-row">
          <Form.Group controlId="categoryFilter" className="filter-group">
            <Form.Label><FaTag /> Category</Form.Label>
            <Form.Control as="select" onChange={(e) => onFilterChange('category', e.target.value)} className="filter-select">
              <option value="">All</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="mechanicFilter" className="filter-group">
            <Form.Label><FaCog /> Mechanic</Form.Label>
            <Form.Control as="select" onChange={(e) => onFilterChange('mechanic', e.target.value)} className="filter-select">
              <option value="">All</option>
              {mechanics.map((mechanic, index) => (
                <option key={index} value={mechanic}>{mechanic}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="primaryMusclesFilter" className="filter-group">
            <Form.Label><FaTag /> Primary Muscles</Form.Label>
            <Form.Control as="select" onChange={(e) => onFilterChange('primaryMuscles', e.target.value)} className="filter-select">
              <option value="">All</option>
              {primaryMuscles.map((muscle, index) => (
                <option key={index} value={muscle}>{muscle}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="secondaryMusclesFilter" className="filter-group">
            <Form.Label><FaTag /> Secondary Muscles</Form.Label>
            <Form.Control as="select" onChange={(e) => onFilterChange('secondaryMuscles', e.target.value)} className="filter-select">
              <option value="">All</option>
              {secondaryMuscles.map((muscle, index) => (
                <option key={index} value={muscle}>{muscle}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="searchFilter" className="filter-group">
            <Form.Label><FaSearch /> Search</Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                type="text"
                placeholder="Search exercises"
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="filter-input"
              />
            </InputGroup>
          </Form.Group>
        </div>
      </Form>
    </div>
  );
};

export default Filter;
