import transformQueryConditional from '../utils/query';

export default (model, populate) => async (req, res, next) => {
  let query = { ...req.query };

  // Remove custom field to first search in DB
  const filterFields = ['select', 'sort', 'page', 'limit'];

  filterFields.forEach(filter => delete query[filter]);

  query = transformQueryConditional(query);

  // Find model based on mongoDB valid query
  query = model.find(query);

  // Apply Select Filter
  if (req.query.select) {
    query = query.select(req.query.select.replace(',', ' '));
  }

  // Apply Sort Filter
  if (req.query.sort) {
    query = query.sort(req.query.sort.replace(',', ' '));
  } else {
    query = query.sort('-createdAt');
  }

  // populate a related field
  if (populate) {
    query = query.populate(populate);
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  // Ignore documents per page
  query = query.skip(startIndex).limit(limit);

  // Get result after all filters
  const results = await query;

  // Pagination result
  const pagination = {};

  if (startIndex > 0) {
    pagination.prev = {
      limit,
      page: page - 1,
    };
  }

  if (endIndex < total) {
    pagination.next = {
      limit,
      page: page + 1,
    };
  }

  res.advancedResults = {
    pagination,
    success: true,
    data: results,
    count: results.length,
  };

  next();
};
