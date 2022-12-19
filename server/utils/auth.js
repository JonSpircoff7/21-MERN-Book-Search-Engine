module.exports = {
  authMiddleware: function (context) {
    // allows token to be sent via  context.request.query or headers
    let token =
      context.request.query.token || context.request.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (context.request.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      throw new AuthenticationError("You have no token!");
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      context.user = data;
    } catch {
      console.log("Invalid token");
      throw new AuthenticationError("Invalid token");
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
