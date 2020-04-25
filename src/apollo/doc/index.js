import { gql } from 'apollo-boost'

export const PRE_SIGNED_URL = gql`
  query PreSignedUrl($mimeType: String) {
    preSignedUrl(mimeType: $mimeType) {
      url
    }
  }
`

export const FILE_BY_KEYWORD = gql`
  query FileByKeyword($keyword: String!) {
    fileByKeyword(keyword: $keyword) {
      id
      title
      description
      file
      keyword
      type
      cate
      createdAt
      updatedAt
    }
  }
`


export const FILES = gql`
  query Files($where: FileWhereInput
$orderBy: FileOrderByInput
$skip: Int
$after: String
$before: String
$first: Int
$last: Int) 
{
  files(where: $where, orderBy: $orderBy,skip: $skip,after: $after,before: $before, first: $first, last: $last) {
    id
    title
    description
    file
    updatedAt
    }
  }
`;


export const FILE = gql`
  query File($where: FileWhereUniqueInput!) 
{
  file(where: $where) {
    id
    title
    description
    file
    keyword
    type
    cate
    createdAt
    updatedAt
    }
  }
`;



export const CREATE_FILE = gql`
  mutation CreateFile(
    $data: FileCreateInput!
  ) {
    createFile(
      data: $data
      ){
        id
      }
  }`;

export const UPDATE_FILE = gql`
mutation UpdateFile(
  $data: FileUpdateInput!, $where: FileWhereUniqueInput!
) {
  updateFile(
    data: $data, where: $where
    ){
      id
    }
}`;

export const DELETE_FILE = gql`
mutation DeleteFile($where: FileWhereUniqueInput!) {
  deleteFile(where: $where) {
    id
  }
}
`

