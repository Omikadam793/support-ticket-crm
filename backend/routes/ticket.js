const express = require("express");
const router = express.Router();

const db = require("../database");
const { v4: uuidv4 } = require("uuid");

router.post("/", (req, res) => {
  const { customer_name, customer_email, subject, description } = req.body;

  const ticket_id = "TKT-" + uuidv4().slice(0, 5);

  db.run(
    `
    INSERT INTO tickets
    (ticket_id, customer_name, customer_email, subject, description)
    VALUES (?, ?, ?, ?, ?)
    `,
    [ticket_id, customer_name, customer_email, subject, description],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        ticket_id,
      });
    }
  );
});

router.get("/", (req, res) => {
  const { status, search } = req.query;

  let query = `SELECT * FROM tickets WHERE 1=1`;
  let params = [];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  if (search) {
    query += `
      AND (
        customer_name LIKE ?
        OR customer_email LIKE ?
        OR subject LIKE ?
        OR ticket_id LIKE ?
      )
    `;

    const term = `%${search}%`;

    params.push(term, term, term, term);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(rows);
  });
});

router.get("/:ticket_id", (req, res) => {
  db.get(
    `SELECT * FROM tickets WHERE ticket_id = ?`,
    [req.params.ticket_id],
    (err, row) => {
      if (err) return res.status(500).json(err);

      res.json(row);
    }
  );
});

router.put("/:ticket_id", (req, res) => {
  const { status, notes } = req.body;

  db.run(
    `
    UPDATE tickets
    SET status = ?, notes = ?
    WHERE ticket_id = ?
    `,
    [status, notes, req.params.ticket_id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
      });
    }
  );
});

