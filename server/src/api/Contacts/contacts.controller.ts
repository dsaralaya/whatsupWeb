import { Request, Response } from "express";
import Contact from "./contacts.model";
const bcrypt = require("bcrypt");
const _ = require("lodash");

export default class ContactsController {
  public async getall(req: Request, res: Response) {
    return Contact.find()
      .then(contacts => {
        res.send({ status: "success", statusCode: "200", data: contacts });
      })
      .catch(err => {
        res.send({
          message:
            err.message || "Some error occurred while retrieving contacts list.",
          status: "failure",
          statusCode: "400"
        });
      });
  }

  public async getbyid(req: Request, res: Response) {
    Contact.findById(req.params.id)
      .then(contact => {
        if (!contact) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "Contact not found with id " + req.params.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: contact });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error retrieving Contact with id " + req.params.id
        });
      });
  }

  public async create(req: Request, res: Response) {
    try {
      let contact = await Contact.findOne({ number: req.body.number });
      if (contact) {
        return res.send({
          message: "Contact already exists!",
          status: "failure",
          statusCode: "400"
        });
      } else {
        contact = new Contact(
          _.pick(req.body, [
            "name",
            "number"
          ])
        );
        await contact.save();
        return res.send({
          status: "success",
          statusCode: "200",
          data: _.pick(contact, [
            "_id",
            "name",
            "number"
          ])
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async update(req: Request, res: Response) {
    Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(contact => {
        if (!contact) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "Contact not found with ID: " + req.params.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: contact });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error updating Contact with id " + req.params.id
        });
      });
  }

  public async delete(req: Request, res: Response) {
    Contact.findByIdAndRemove(req.params.id)
      .then(contact => {
        if (!contact) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "Contact not found with id " + req.params.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: contact });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error deleting Contact with id " + req.params.id
        });
      });
  }
}
