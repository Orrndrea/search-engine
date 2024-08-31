const { User } = require('../../models');
const { signToken } = require('../../utils/auth');

module.exports = {
  Query: {
    async me(parent, args, context) {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('Not logged in');
    },
    async getUser(parent, { id }) {
      return User.findById(id).populate('savedBooks');
    },
  },

  Mutation: {
    async login(parent, { email, password }) {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user);

      return { token, user };
    },
    async createUser(parent, { username, email, password }) {
      const user = await User.create({ username, email, password });

      const token = signToken(user);

      return { token, user };
    },
    async saveBook(parent, { bookId, authors, description, title, image, link }, context) {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { bookId, authors, description, title, image, link } } },
          { new: true }
        ).populate('savedBooks');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    async deleteBook(parent, { bookId }, context) {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate('savedBooks');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};
