import { gql } from 'apollo-boost'

export const LOGIN_USER = gql`
  mutation LoginUser($data: loginUserInput!) {
    loginUser(data: $data) {
      accessToken
      refreshToken
      data {
        id
        userId
        firstname
        lastname
        role
        gender
        maritualStatus
        religion
        educationBackGround
        highSchool
        college
        passportNo
        idNumber
        introduction
        address{
          country
          province
          district
          village
          postCode
          lat
          lng
          detail
          note
        }
      }
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($data: UserCreateInputWithPassword!) {
    createUser(data: $data) {
      id
      firstname
      userId
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($data: UserUpdateInputWithPassword!, $where: UserWhereUniqueInput!) {
    updateUser(data: $data, where: $where) {
      id
      firstname
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($where: UserWhereUniqueInput!) {
    deleteUser(where: $where) {
      id
    }
  }
`

export const USER = gql`
  query User($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      userId
      firstname
      lastname
      userId
      email
      phone
      role
      yearLevel
      description
      note
      birthday
      gender
      maritualStatus
      religion
      educationBackGround
      highSchool
      college
      passportNo
      idNumber
      introduction
      address{
        country
        province
        district
        village
        postCode
        lat
        lng
        detail
        note
      }
      department{
        name
      }
      faculty{
        name
      }
      createdAt
      updatedAt
    }
  }
`

export const USER_EDIT = gql`
  query User($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      userId
      firstname
      lastname
      userId
      email
      phone
      role
      description
      note
      birthday
      yearLevel
      gender
      maritualStatus
      religion
      educationBackGround
      highSchool
      college
      passportNo
      idNumber
      introduction
      address{
        country
        province
        district
        village
        postCode
        lat
        lng
        detail
        note
      }
      department{
        id
        name
      }
      faculty{
        id
        name
      }
      createdAt
      updatedAt
    }

    faculties{
        id
        name
        departments{
            id
            name
        }
    }
  }
`


export const USERS = gql`
  query Users(
    $where: UserWhereInput
    $orderBy: UserOrderByInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    users(
      where: $where
      orderBy: $orderBy
      skip: $skip
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      id
      userId
      firstname
      lastname
      userId
      email
      phone
      role
      birthday
      description
      note
      yearLevel
      gender
      maritualStatus
      religion
      educationBackGround
      highSchool
      college
      passportNo
      idNumber
      introduction
      address{
        country
        province
        district
        village
        postCode
        lat
        lng
        detail
        note
      }
      department{
        name
        faculty{
          name
        }
      }
      faculty{
        name
      }
      createdAt
      updatedAt
    }
  }
`

export const TEACHERS = gql`
  query Users(
    $where: UserWhereInput
    $orderBy: UserOrderByInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    users(
      where: $where
      orderBy: $orderBy
      skip: $skip
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      id
      userId
      firstname
      lastname
      userId
      email
      phone
      role
      birthday
      description
      note
      gender
      maritualStatus
      religion
      educationBackGround
      highSchool
      college
      passportNo
      idNumber
      introduction
      address{
        country
        province
        district
        village
        postCode
        lat
        lng
        detail
        note
      }
      department{
        name
        faculty{
          name
        }
      }
      faculty{
        name
      }
      createdAt
      updatedAt
    }
  }
`
