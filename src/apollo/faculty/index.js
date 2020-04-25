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
        departments{
            id
            name
        }
    }
  }
`