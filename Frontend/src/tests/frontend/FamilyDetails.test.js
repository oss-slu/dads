import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FamilyDetails from '../../pages/FamilyDetails';
import { get_family } from '../../api/routes';

jest.mock('../../api/routes', () => ({
  get_family: jest.fn()
}));

const family = {
  family_id: 1,
  name: 'poly_deg_2',
  degree: 2,
  num_parameters: 1,
  model_coeffs: [['1', '0', 't'], ['0', '0', '1']],
  model_resultant: '-16',
  base_field_label: '1.1.1.1',
  base_field_degree: 1,
  sigma_one: 's1',
  sigma_two: 's2',
  ordinal: 1,
  citations: [1],
  is_polynomial: true,
  num_critical_points: 3,
  automorphism_group_cardinality: 4,
  citation: 'Bjorn Poonen. The classification of rational preperiodic points'
};

const renderAt = (id) =>
  render(
    <MemoryRouter initialEntries={[`/family-details/${id}`]}>
      <Routes>
        <Route path="/family-details/:familyId" element={<FamilyDetails />} />
      </Routes>
    </MemoryRouter>
  );

afterEach(() => jest.clearAllMocks());

test('shows every field from the named-field get_family answer', async () => {
  get_family.mockResolvedValue({ data: family });

  renderAt(1);

  expect(await screen.findByText('poly_deg_2')).toBeInTheDocument();
  expect(get_family).toHaveBeenCalledWith('1');
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('[x² + ty², y²]')).toBeInTheDocument();
  expect(screen.getByText('1.1.1.1')).toBeInTheDocument();
  expect(screen.getByText('s1')).toBeInTheDocument();
  expect(screen.getByText('s2')).toBeInTheDocument();
  expect(screen.getByText('-16')).toBeInTheDocument();
  expect(screen.getByText('Yes')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByText('4')).toBeInTheDocument();
  expect(screen.getByText(family.citation)).toBeInTheDocument();
});

test('shows the error message when the request fails', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  get_family.mockRejectedValue(new Error('boom'));

  renderAt(1);

  expect(await screen.findByText(/Failed to fetch family details/)).toBeInTheDocument();
  console.error.mockRestore();
});