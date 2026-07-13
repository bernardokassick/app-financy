import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query GetTransactions(
    $month: Int!, 
    $year: Int!, 
    $search: String, 
    $type: String, 
    $categoryId: String,
    $page: Int
  ) {
    getTransactions(
      month: $month, 
      year: $year, 
      search: $search, 
      type: $type, 
      categoryId: $categoryId,
      page: $page
    ) {
      transactions {
        id
        description
        amount
        date
        type
        category {
          id
          name
          icon
          color
        }
      }
      total
    }
  }
`;