import { gql } from "@apollo/client";

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($month: Int!, $year: Int!) {
    getTransactions(month: $month, year: $year, page: 1) {
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
    }
    getCategories {
      id
      name
      color
      icon
    }
  }
`;