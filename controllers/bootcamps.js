/**
 *
 * @description Get All bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = (req, res, next) => {
  res.status(200).send({ success: true, msg: 'Show all bootcamps' });
};

/**
 *
 * @description Get single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
export const getBootcamp = (req, res, next) => {
  res.status(200).send({ success: true, msg: `Get bootcamp ${req.params.id}` });
};

/**
 *
 * @description Create a bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
export const createBootcamp = (req, res, next) => {
  res.status(201).send({ success: true, msg: 'Create new bootcamp' });
};

/**
 *
 * @description Update a bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
export const updateBootcamp = (req, res, next) => {
  res.status(200).send({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

/**
 *
 * @description Delete a bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
export const deleteBootcamp = (req, res, next) => {
  res.status(200).send({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
