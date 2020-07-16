const promo = require("../../models/promo/promo");
const multer = require("multer")
const upload = require("../../utils/multerPromo")
const promoValidator = require("../../validators/promo");
const response = require("../../utils/response")

module.exports = {
  getAllPromos: async (req, res) => {
    try {
      const getUser = await promo.getPromos();
      res.status(200).send(response(true, "List of Promo", getUser))
    }
    catch (e) {
      res.status(500).send(response(false, e.message))
    }
  },
  createPromo: (req, res) => {
    upload(req, res, async (fileError) => {
      if (req.fileValidationError) {
        res.status(400).send(response(false, req.fileValidationError));
      } else if (fileError instanceof multer.MulterError) {
        res.status(400).send(response(false, "File size too large, Max 1 MB"));
      }
      if (!req.file) {
        res
          .status(400)
          .send(response(false, "Please select an image to upload"));
      }
      else {
        const promoValid = await promoValidator(req.body)
        if (promoValid.status) {
          const { title, description } = promoValid.passed;
          const data = {
            title,
            image: "public/" + req.file.filename,
            description
          };
          try {
            const createPromo = await promo.createPromo(data);
            res.status(201).send(response(true, profileValid.msg, createPromo[0]));
          } catch (e) {
            res.status(500).send(response(false, e.message));
          }
        } else { res.status(400).send(response(true, promoValid.msg)) }
      }
    })
  },
  updatePromo: (req, res) => {
    upload(req, res, async (fileError) => {
      if (req.fileValidationError) {
        res.status(400).send(response(false, req.fileValidationError));
      } else if (fileError instanceof multer.MulterError) {
        res.status(400).send(response(false, "File size too large, Max 1 MB"));
      }
      if (!req.file) {
        res
          .status(400)
          .send(response(false, "Please select an image to upload"));
      }
      else {
        const { id } = req.params;
        const promoExist = await getPromoById({ id: parseInt(id) })
        if (promoExist) {
          const promoValid = await promoValidator(req.body)
          if (promoValid.status) {
            const { title, description } = promoValid.passed;
            const data = {
              title,
              image: "public/" + req.file.filename,
              description
            };
            try {
              const updatePromo = await promo.updatePromo([data, { id: parseInt(id) }])
              res.status(201).send(response(true, promoValid.msg, updatePromo));
            } catch (e) {
              res.status(500).send(response(false, e.message));
            }
          } else { res.status(400).send(response(false, promoValid.msg)) }
        } else { res.status(404).send(response(false, promoExist)) }
      }
    })
  },
  deletePromo: async (req, res) => {
    const { id } = req.params
    const promoExist = await getPromoById({ id: parseInt(id) })
    if (promoExist) {
      try {
        const deletePromo = await promo.updatePromo({ id: parseInt(id) })
        res.status(201).send(response(true, deletePromo));
      } catch (e) {
        res.status(500).send(response(false, e.message));
      }
    } else { res.status(404).send(response(false, promoExist)) }
  }
}