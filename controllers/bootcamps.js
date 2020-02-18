import Bootcamp from '../models/Bootcamps';

/**
 *
 * @description Get All bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res
      .status(200)
      .send({
        success: true,
        count: bootcamps.length,
        data: bootcamps
      });
  } catch (err) {
    res
      .status(400)
      .json({
        success: false
      })
  }
};

/**
 *
 * @description Get single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
export const getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      res.status(400).send({ success: false });
    }

    res.status(200).send({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).send({ success: false });
  }
};

/**
 *
 * @description Create a bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
export const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).send({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/**
 *
 * @description Update a bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
export const updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!bootcamp) {
      res.status(400).json({ status: false });
    }

    res.status(200).json({ status: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ status: false });
  }
};

/**
 *
 * @description Delete a bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
export const deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);

    if (!bootcamp) {
      res.status(400).json({ status: false });
    }

    res.status(200).json({ status: true, data: {} });
  } catch (err) {
    res.status(400).json({ status: false });
  }
};
