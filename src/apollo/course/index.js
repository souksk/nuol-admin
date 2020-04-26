import { gql } from 'apollo-boost'

export const COURSES = gql`
  query Courses(
    $where: CourseWhereInput
    $orderBy: CourseOrderByInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    courses(
      where: $where
      orderBy: $orderBy
      skip: $skip
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      id
      courseCode
      title
      department {
        name
      }
      faculty {
        name
      }
      dayTimeIndexes {
        dayInt
        dayString
        timeIndexes
      }
      teacher{
        firstname
        lastname
      }
      unit
      yearLevel
      semester
      description
      note
      createdAt
      updatedAt
    }
  }
`

export const REGISTER_COURSES = gql`
  query Courses(
    $where: CourseWhereInput
    $orderBy: CourseOrderByInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    courses(
      where: $where
      orderBy: $orderBy
      skip: $skip
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      id
      courseCode
      title
    }
  }
`

export const COURSE = gql`
  query Course($where: CourseWhereUniqueInput!) {
    course(where: $where) {
      id
      courseCode
      title
      department {
        id
        name
      }
      faculty {
        id
        name
      }
      syllabusFile{
        file
        title
      }
      dayTimeIndexes {
        dayInt
        dayString
        timeIndexes
      }
      teacher{
        id
        firstname
        lastname
      }
      files{
        id
        description
        title
        file
        createdAt
      }
      unit
      yearLevel
      semester
      description
      note
      createdAt
      updatedAt
    }
  }
`

export const COURSE_EDIT = gql`
  query CourseEdit(
    $where: CourseWhereUniqueInput!,
    $whereFaculty: FacultyWhereInput
    $orderBy: FacultyOrderByInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
    ) {
    course(where: $where) {
      id
      courseCode
      title
      department {
        id
        name
      }
      faculty {
        id
        name
      }
      syllabusFile{
        file
        title
      }
      dayTimeIndexes {
        dayInt
        dayString
        timeIndexes
      }
      teacher{
        id
        firstname
        lastname
        userId
      }
      unit
      yearLevel
      semester
      description
      note
      createdAt
      updatedAt
    }

    faculties(
      where: $whereFaculty
      orderBy: $orderBy
      skip: $skip
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
        id
        name
        departments{
            id
            name
        }
    }
  }
`


export const CREATE_COURSE = gql`
  mutation CreateCourse($data: CourseCreateInput!) {
    createCourse(data: $data) {
      id
    }
  }
`

export const UPDATE_COURSE = gql`
  mutation UpdateCourse(
    $data: CourseUpdateInput!
    $where: CourseWhereUniqueInput!
  ) {
    updateCourse(data: $data, where: $where) {
      id
    }
  }
`

export const DELETE_COURSE = gql`
  mutation DeleteCourse($where: CourseWhereUniqueInput!) {
    deleteCourse(where: $where) {
      id
    }
  }
`
