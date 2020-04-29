import { gql } from 'apollo-boost'

export const FACULTIES = gql`
  query Faculties(
    $where: FacultyWhereInput
    $orderBy: FacultyOrderByInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    faculties(
      where: $where
      orderBy: $orderBy
      skip: $skip
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
        id
        name
        description
        note
        departments{
            id
            name
        }
        createdBy{
          firstname
          lastname
        }
        createdAt
        updatedAt
    }
  }
`

export const FACULTY = gql`
  query Faculty(
    $where: FacultyWhereUniqueInput!
  ) {
    faculty(
      where: $where
    ) {
        id
        name
        description
        note
        departments{
            id
            name
        }
        createdBy{
          firstname
          lastname
        }
        createdAt
        updatedAt
    }
  }
`

export const CREATE_FACULTY = gql`
  mutation CreateFaculty(
    $data: FacultyCreateInput!
  ) {
    createFaculty(
      data: $data
    ) {
        id
    }
  }
`

export const UPDATE_FACULTY = gql`
  mutation UpdateFaculty(
    $data: FacultyUpdateInput!
    $where: FacultyWhereUniqueInput!
  ) {
    updateFaculty(
      data: $data
      where: $where
    ) {
        id
    }
  }
`

export const DELETE_FACULTY = gql`
  mutation DeleteFaculty(
    $where: FacultyWhereUniqueInput!
  ) {
    deleteFaculty(
      where: $where
    ) {
        id
    }
  }
`