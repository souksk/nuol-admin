import { gql } from 'apollo-boost'

export const STUDYCALENDAS = gql`
  query StudyCalendas(
    $where: StudyCalendaWhereInput
    $orderBy: StudyCalendaOrderByInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    studyCalendas(
      where: $where
      orderBy: $orderBy
      skip: $skip
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      id
      calendaCoce
      title
      course{
        title
        courseCode
        department{
          name
          faculty{
            name
          }
        }
      }
      dayTimeIndexes{
        dayString
        timeIndexes
      }
      teacher{
        id
        firstname
        lastname
      }
      yearLevel
      semester
      startDate
      endDate
      createdBy{
        id
        role
        firstname
        lastname
      }
      createdAt
      updatedAt
    }
  }
`

export const STUDYCALENDA = gql`
  query StudyCalenda(
    $where: StudyCalendaWhereUniqueInput!
  ) {
    studyCalenda(
      where: $where
    ) {
      id
      calendaCoce
      title
      course{
        title
        courseCode
        unit
        department{
          name
          faculty{
            name
          }
        }
      }
      dayTimeIndexes{
        dayString
        timeIndexes
      }
      teacher{
        id
        firstname
        lastname
      }
      yearLevel
      semester
      startDate
      endDate
      createdBy{
        id
        role
        firstname
        lastname
      }
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_STUDYCALENDA = gql`
  query UpdateStudyCalenda(
    $data: StudyCalendaUpdateInput!
    $where: StudyCalendaWhereUniqueInput!,
    ) {
      updateStudyCalenda(data: $data, where: $where) {
      id
    }
  }
`


export const CREATE_STUDYCALENDA = gql`
  mutation CreateStudyCalenda($data: StudyCalendaCreateInput!) {
    createStudyCalenda(data: $data) {
      id
    }
  }
`

export const DELETE_STUDYCALENDA = gql`
  mutation DeleteStudyCalenda($where: StudyCalendaWhereUniqueInput!) {
    deleteStudyCalenda(where: $where) {
      id
    }
  }
`
