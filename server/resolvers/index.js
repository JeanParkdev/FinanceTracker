import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Goal from '../models/Goal.js';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/auth.js';

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await User.findById(context.user._id);
    },

    transactions: async (parent, { month, year }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      return await Transaction.find({
        userId: context.user._id,
        date: { $gte: start, $lt: end },
      });
    },

    budgets: async (parent, { month, year }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Budget.find({ userId: context.user._id, month, year });
    },

    goals: async (parent, args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Goal.find({ userId: context.user._id });
    },
  },

  Mutation: {
    register: async (parent, { username, email, password }) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error('Email already in use');
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashed });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid credentials');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid credentials');
      const token = signToken(user);
      return { token, user };
    },

    toggleDarkMode: async (parent, args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const user = await User.findById(context.user._id);
      user.darkMode = !user.darkMode;
      await user.save();
      return user;
    },

    addTransaction: async (parent, args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const data = { ...args, userId: context.user._id };
      if (data.date) {
        const [year, month, day] = data.date.split('-');
        data.date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        data.date = new Date();
      }
      return await Transaction.create(data);
    },

    updateTransaction: async (parent, { _id, ...args }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Transaction.findOneAndUpdate(
        { _id, userId: context.user._id },
        args,
        { new: true }
      );
    },

    deleteTransaction: async (parent, { _id }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Transaction.findOneAndDelete({ _id, userId: context.user._id });
    },

    setBudget: async (parent, args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Budget.create({ ...args, userId: context.user._id });
    },

    updateBudget: async (parent, { _id, ...args }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Budget.findOneAndUpdate(
        { _id, userId: context.user._id },
        args,
        { new: true }
      );
    },

    deleteBudget: async (parent, { _id }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Budget.findOneAndDelete({ _id, userId: context.user._id });
    },

    addGoal: async (parent, args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Goal.create({ ...args, userId: context.user._id });
    },

    updateGoal: async (parent, { _id, ...args }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Goal.findOneAndUpdate(
        { _id, userId: context.user._id },
        args,
        { new: true }
      );
    },

    deleteGoal: async (parent, { _id }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Goal.findOneAndDelete({ _id, userId: context.user._id });
    },
  },

  Transaction: {
    date: (parent) => parent.date ? new Date(parent.date).toISOString() : null,
  },
};

export default resolvers;