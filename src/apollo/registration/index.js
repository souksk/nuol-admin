
import { gql } from 'apollo-boost';

export const REGISTRATIONS = gql`
  query Registrations($where: RegistrationWhereInput
$orderBy: RegistrationOrderByInput
$skip: Int
$after: String
$before: String
$first: Int
$last: Int) 
{
  registrations(where: $where, orderBy: $orderBy,skip: $skip,after: $after,before: $before, first: $first, last: $last) {
    id
    student{
      id
      userId
      lastname
      firstname
      birthday
      yearLevel
      phone
      email
    }
    course{
      id
      title
      courseCode
      yearLevel
      department{
        id
        name
        faculty{
          id
          name
        }
      }
    }
    note
    createdAt
    updatedAt
    }
  }
`;


export const CREATE_REGISTRATION = gql`
  mutation CreateRegistration($data: RegistrationCreateInput!) {
    createRegistration(data: $data) {
      id
    }
  }
`;

export const UPDATE_REGISTRATION = gql`
  mutation UpdateRegistration($data: RegistrationUpdateInput!, $where: RegistrationWhereUniqueInput!) {
    updateRegistration(data: $data, where: $where) {
      id
    }
  }
`;

export const DELETE_REGISTRATION = gql`
  mutation DeleteRegistration($where: RegistrationWhereUniqueInput!) {
    deleteRegistration(where: $where) {
      id
    }
  }
`;
