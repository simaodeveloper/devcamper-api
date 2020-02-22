export default (queryObject) =>
  JSON.parse(JSON.stringify(queryObject).replace(/\b(lt|lte|gt|gte|in)\b/g, match => `$${match}`));
