const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    darkMode: Boolean
    createdAt: String
  }

  type Transaction {
    _id: ID
    userId: ID
    type: String
    amount: Float
    category: String
    description: String
    date: String
    isRecurring: Boolean
    recurringFreq: String
  }

  type Budget {
    _id: ID
    userId: ID
    category: String
    limit: Float
    month: Int
    year: Int
    alertThreshold: Float
  }

  type Goal {
    _id: ID
    userId: ID
    name: String
    targetAmount: Float
    currentAmount: Float
    targetDate: String
    isComplete: Boolean
    notes: String
  }

  type Auth {
    token: String
    user: User
  }

  type Query {
    me: User
    transactions(month: Int, year: Int): [Transaction]
    budgets(month: Int, year: Int): [Budget]
    goals: [Goal]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    toggleDarkMode: User

    addTransaction(type: String!, amount: Float!, category: String!, description: String, date: String, isRecurring: Boolean, recurringFreq: String): Transaction
    updateTransaction(_id: ID!, type: String, amount: Float, category: String, description: String, date: String, isRecurring: Boolean, recurringFreq: String): Transaction
    deleteTransaction(_id: ID!): Transaction

    setBudget(category: String!, limit: Float!, month: Int!, year: Int!, alertThreshold: Float): Budget
    updateBudget(_id: ID!, limit: Float, alertThreshold: Float): Budget
    deleteBudget(_id: ID!): Budget

    addGoal(name: String!, targetAmount: Float!, currentAmount: Float, targetDate: String, notes: String): Goal
    updateGoal(_id: ID!, name: String, targetAmount: Float, currentAmount: Float, targetDate: String, isComplete: Boolean, notes: String): Goal
    deleteGoal(_id: ID!): Goal
  }
`;

export default typeDefs;