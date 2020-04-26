import { gql } from 'apollo-boost'

export const DEPARTMENTS = gql`
  query Departments(
    $where: DepartmentWhereInput
    $orderBy: DepartmentOrderByInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    departments(
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
        faculty{
            id
            name
        }
        createdBy{
          id
          firstname
          lastname
        }
        courseList{
          id
          title
          courseCode
        }
        files{
          id
          title
          description
          file
          keyword
          type
          cate
        }
        createdAt
        updatedAt
    }
  }
`

export const DEPARTMENT = gql`
  query Department(
    $where: DepartmentWhereUniqueInput!
  ) {
    department(
      where: $where
    ) {
        id
        name
        description
        note
        faculty{
            id
            name
        }
        createdBy{
          id
          firstname
          lastname
        }
        courseList{
          id
          title
          courseCode
        }
        files{
          id
          title
          description
          file
          keyword
          type
          cate
        }
        createdAt
        updatedAt
    }
  }
`

export const CREATE_DEPARTMENT = gql`
  query CreateDepartment(
    $data: DepartmentCreateInput!
  ) {
    createDepartment(
      data: $data
    ) {
        id
    }
  }
`

export const UPDATE_DEPARTMENT = gql`
  query UpdateDepartment(
    $data: DepartmentUpdateInput!
    $where: DepartmentWhereUniqueInput!
  ) {
    updateDepartment(
      data: $data
      where: $where
    ) {
        id
    }
  }
`

export const DELETE_DEPARTMENT = gql`
  query DeleteDepartment(
    $where: DepartmentWhereUniqueInput!
  ) {
    deleteDepartment(
      where: $where
    ) {
        id
    }
  }
`